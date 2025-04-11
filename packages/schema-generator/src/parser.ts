import * as fs from 'node:fs'
import ts from 'typescript'

import type { Imports } from './imports.js'
import * as P from './parser-combinators.js'
import { Array_isArray, Comparator } from '@traversable/registry'

export type ParsedSourceFile = {
  imports: Record<string, Imports>
  body: string
}

let LIB_FILE_NAME = '/lib/lib.d.ts'
let LIB = [].join('\n')

export let VarName = {
  Type: 'Types',
  Def: 'Definitions',
  Ext: 'Extensions',
} as const

export type ParsedExtensionFile = never | {
  [VarName.Type]?: string
  [VarName.Def]?: string
  [VarName.Ext]?: string
}

export let typesMarker = `//<%= ${VarName.Type} %>` as const
export let definitionsMarker = `//<%= ${VarName.Def} %>` as const
export let extensionsMarker = `//<%= ${VarName.Ext} %>` as const

export function createProgram(source: string): ts.Program {
  let filename = '/source.ts'
  let files = new Map<string, string>()
  files.set(filename, source)
  files.set(LIB_FILE_NAME, LIB)
  return ts.createProgram(
    [filename], {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    strict: true,
    noEmit: true,
    isolatedModules: true,
    types: [],
  }, {
    fileExists: (filename) => files.has(filename),
    getCanonicalFileName: (f) => f.toLowerCase(),
    getCurrentDirectory: () => '/',
    getDefaultLibFileName: () => LIB_FILE_NAME,
    getDirectories: () => [],
    getNewLine: () => '\n',
    getSourceFile: (filename, options) => {
      let content = files.get(filename)
      if (content === void 0) throw Error('missing file')
      return ts.createSourceFile(filename, content, options)
    },
    readFile: (filename) => files.get(filename),
    useCaseSensitiveFileNames: () => false,
    writeFile: () => { throw Error('unimplemented') },
  })
}

export function parseFile(sourceFilePath: string): ParsedSourceFile {
  let source = fs.readFileSync(sourceFilePath).toString('utf-8')
  let program = createProgram(source)
  /* initialize the type checker, otherwise we can't perform a traversal */
  let checker = program.getTypeChecker()
  let sourceFile = program.getSourceFiles()[1]
  return parseSourceFile(sourceFile)
}

let isDefinitionsVariable = (node: ts.Node): node is ts.VariableStatement =>
  ts.isVariableStatement(node)
  && !!node.declarationList.declarations.find((declaration) => declaration.name.getText() === VarName.Def)


let isExtensionsVariable = (node: ts.Node): node is ts.VariableStatement =>
  ts.isVariableStatement(node)
  && !!node.declarationList.declarations.find((declaration) => declaration.name.getText() === VarName.Ext)

let isTypeDeclaration = (node: ts.Node): node is ts.InterfaceDeclaration | ts.TypeAliasDeclaration =>
  (ts.isInterfaceDeclaration(node) && findIdentifier(node)?.getText() === VarName.Type)
  || (ts.isTypeAliasDeclaration(node) && findIdentifier(node)?.getText() === VarName.Type)

let findIdentifier = (node: ts.Node) => node.getChildren().find(ts.isIdentifier)

type ParsedTypesNode = { [VarName.Type]: ts.InterfaceDeclaration | ts.TypeAliasDeclaration }
type ParsedDefinitionsNode = { [VarName.Def]: ts.VariableStatement }
type ParsedExtensionsNode = { [VarName.Ext]: ts.VariableStatement }
type ParsedNodes =
  & ParsedTypesNode
  & ParsedDefinitionsNode
  & ParsedExtensionsNode

export function parseExtensionFile(sourceFilePath: string): ParsedExtensionFile {
  let source = fs.readFileSync(sourceFilePath).toString('utf-8')
  let program = createProgram(source)
  /* initialize the type checker, otherwise we can't perform a traversal */
  void program.getTypeChecker()
  let sourceFile = program.getSourceFiles()[1]
  let nodes: Partial<ParsedNodes> = {}
  let out: ParsedExtensionFile = {}

  void ts.forEachChild(sourceFile, (node) => {
    if (isTypeDeclaration(node)) nodes[VarName.Type] = node
    if (isDefinitionsVariable(node)) nodes[VarName.Def] = node
    if (isExtensionsVariable(node)) nodes[VarName.Ext] = node
  })
  if (nodes[VarName.Type]) {
    let text = nodes[VarName.Type]!.getText()
    out[VarName.Type] = text.slice(text.indexOf('{') + 1, text.lastIndexOf('}'))
  }
  if (nodes[VarName.Def]) {
    let text = nodes[VarName.Def]!.getText()
    out[VarName.Def] = text.slice(text.indexOf('{') + 1, text.lastIndexOf('}'))
  }
  if (nodes[VarName.Ext]) {
    let text = nodes[VarName.Ext]!.getText()
    out[VarName.Ext] = text.slice(text.indexOf('{') + 1, text.lastIndexOf('}'))
  }
  return out
}

export function parseSourceFile(sourceFile: ts.SourceFile): ParsedSourceFile {
  let imports: Record<string, Imports> = {}
  let bodyStart: number = 0

  void ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node)) {
      let importClause = node.importClause
      if (importClause === undefined) return void 0
      if (node.end > bodyStart) void (bodyStart = node.end)
      let dependencyName = node.moduleSpecifier.getText().slice(`"`.length, -`"`.length)
      void (imports[dependencyName] ??= { term: { named: [] }, type: { named: [] } })
      let dep = imports[dependencyName]
      void importClause.forEachChild((importNode) => {
        if (ts.isNamedImports(importNode)) {
          void importNode.forEachChild((specifier) => {
            if (importClause.isTypeOnly)
              void dep.type.named.push(specifier.getText())
            else
              void dep.term.named.push(specifier.getText())
          })
        } else if (ts.isNamespaceImport(importNode)) {
          if (importClause.isTypeOnly)
            void (dep.type.namespace = importNode.name.text)
          else
            void (dep.term.namespace = importNode.name.text)
        }
      })
    }
  })

  let body = sourceFile.getFullText().slice(bodyStart).trim()

  return { imports, body }
}

let parseTypeMarker = P.seq(P.char('{'), P.spaces, P.string(typesMarker), P.spaces, P.char('}'))
let parseDefinitionsMarker = P.seq(P.char('{'), P.spaces, P.string(definitionsMarker), P.spaces, P.char('}'))
let parseExtensionsMarker = P.seq(P.char('{'), P.spaces, P.string(extensionsMarker), P.spaces, P.char('}'))

type Splice = {
  start: number
  end: number
  content: string
  offset: number
  firstLineOffset: number
}

let spliceComparator: Comparator<Splice> = (l, r) => l.start < r.start ? -1 : r.start < l.start ? 1 : 0

function splice3(source: string, first: Splice, second: Splice, third: Splice) {
  return ''
    + source.slice(0, first.start)
    + '\n' + ' '.repeat(first.firstLineOffset) + first.content.split('\n').map((_) => ' '.repeat(first.offset) + _).join('\n').trimStart()
    + source.slice(first.end, second.start)
    + '\n' + ' '.repeat(second.firstLineOffset) + second.content.split('\n').map((_) => ' '.repeat(second.offset) + _).join('\n').trimStart()
    + source.slice(second.end, third.start)
    + '\n' + ' '.repeat(third.firstLineOffset) + third.content.split('\n').map((_) => ' '.repeat(third.offset) + _).join('\n').trimStart()
    + source.slice(third.end)
}

export function replaceExtensions(source: string, parsedExtensionFile: ParsedExtensionFile) {
  let typeMarker = parseTypeMarker.find(source)
  let defMarker = parseDefinitionsMarker.find(source)
  let extMarker = parseExtensionsMarker.find(source)

  if (typeMarker == null) throw Error(`missing ${VarName.Type} marker`)
  if (defMarker == null) throw Error(`missing ${VarName.Def} marker`)
  if (extMarker == null) throw Error(`missing ${VarName.Ext} marker`)

  if (parsedExtensionFile[VarName.Type] == null) throw Error(`missing ${VarName.Type} text`)
  if (parsedExtensionFile[VarName.Def] == null) throw Error(`missing ${VarName.Def} text`)
  if (parsedExtensionFile[VarName.Ext] == null) throw Error(`missing ${VarName.Ext} text`)

  if (!typeMarker.result.success) throw Error(`parse for ${VarName.Type} marker failed`)
  if (!defMarker.result.success) throw Error(`parse for ${VarName.Def} marker failed`)
  if (!extMarker.result.success) throw Error(`parse for ${VarName.Ext} marker failed`)

  if (!Array_isArray(typeMarker.result.value[1])) throw Error(`unknown error when parsing ${VarName.Type} marker`)
  if (!Array_isArray(defMarker.result.value[1])) throw Error(`unknown error when parsing ${VarName.Def} marker`)
  if (!Array_isArray(extMarker.result.value[1])) throw Error(`unknown error when parsing ${VarName.Def} marker`)

  let unsortedSplices = [{
    start: typeMarker.index + 1,
    end: typeMarker.result.index - 1,
    content: parsedExtensionFile[VarName.Type] ?? '',
    firstLineOffset: Math.max(typeMarker.result.value[1].length - 1, 0),
    offset: Math.max(typeMarker.result.value[1].length - 3, 0),
  }, {
    start: defMarker.index + 1,
    end: defMarker.result.index - 1,
    content: parsedExtensionFile[VarName.Def] ?? '',
    firstLineOffset: Math.max(defMarker.result.value[1].length - 1, 0),
    offset: Math.max(defMarker.result.value[1].length - 3, 0),
  }, {
    start: extMarker.index + 1,
    end: extMarker.result.index - 1,
    content: parsedExtensionFile[VarName.Ext] ?? '',
    firstLineOffset: Math.max(extMarker.result.value[1].length - 1, 0),
    offset: Math.max(extMarker.result.value[1].length - 3, 0),
  }] as const satisfies Splice[]

  let splices = unsortedSplices.sort(spliceComparator)

  return splice3(source, ...splices)
}

function splice1(source: string, x: Splice) {
  return ''
    + source.slice(0, x.start)
    + '\n' + ' '.repeat(x.firstLineOffset) + x.content.split('\n').map((_) => ' '.repeat(x.offset) + _).join().trimStart()
    + source.slice(x.end)
}

function splice2(source: string, first: Splice, second: Splice) {
  return ''
    + source.slice(0, first.start)
    + '\n' + ' '.repeat(first.firstLineOffset) + first.content.split('\n').map((_) => ' '.repeat(first.offset) + _).join().trimStart()
    + source.slice(first.end, second.start)
    + '\n' + ' '.repeat(second.firstLineOffset) + second.content.split('\n').map((_) => ' '.repeat(second.offset) + _).join('\n').trimStart()
    + source.slice(second.end)
}
