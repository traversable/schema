import * as fs from 'node:fs'
import ts from 'typescript'
import type { Imports } from './imports.js'
import * as P from './parser-combinators.js'
import { fn } from '@traversable/registry'

export type ParsedSourceFile = {
  imports: Record<string, Imports>
  body: string
  // extension?: { type?: string, term?: string }
}

let typesMarker = '//<%= types %>' as const
let termsMarker = '//<%= terms %>' as const

let LIB_FILE_NAME = '/lib/lib.d.ts'
let LIB = [
  'interface Boolean {}',
  'interface Function {}',
  'interface CallableFunction {}',
  'interface NewableFunction {}',
  'interface IArguments {}',
  'interface Number { toExponential: any }',
  'interface Object {}',
  'interface RegExp {}',
  'interface String { charAt: any }',
  'interface Array<T> { length: number [n: number]: T }',
  'interface ReadonlyArray<T> {}',
  'declare const console: { log(msg: any): void }',
  '/// <reference no-default-lib="true"/>',
].join('\n')

let key = P.seq(
  P.optional(P.char('"')),
  P.ident,
  P.optional(P.char('"')),
).map(([, k]) => k)

let propertyValue = P.char().many({ not: P.alt(P.char(','), P.char('}')) }).map((xs) => xs.join(''))

let entry = P.seq(
  key,
  P.optional(P.whitespace),
  P.char(':'),
  P.optional(P.whitespace),
  propertyValue,
).map(([key, , , , value]) => [key, value] as [k: string, v: string])

let comma = P.seq(
  P.spaces,
  P.char(','),
  P.spaces,
).map((_) => _[1])

let entriesWithOptionalDanglingComma = P.seq(
  P.seq(entry.trim(), P.char(',')).map(([_]) => _).many(),
  P.optional(entry.trim()),
).map(([xs, x]) => x === null ? xs : [...xs, x])

let parseObjectEntries = P.index([
  P.char('{'),
  P.trim(entriesWithOptionalDanglingComma),
  P.char('}'),
], 1).map((_) => _ === null ? [] : _)

export function parseFile(sourceFilePath: string): ParsedSourceFile {
  let source = fs.readFileSync(sourceFilePath).toString('utf-8')
  let program = createProgram(source)
  /* initialize the type checker, otherwise we can't perform a traversal */
  let checker = program.getTypeChecker()
  let sourceFile = program.getSourceFiles()[1]
  return parseSourceFile(sourceFile)
}

let isExportedVariable = (node: ts.Node): node is ts.VariableStatement =>
  ts.isVariableStatement(node) && !!node.modifiers?.some((_) => _.kind === ts.SyntaxKind.ExportKeyword)

let isExtensionTerm = (node: ts.Node): node is ts.VariableStatement =>
  ts.isVariableStatement(node)
  && !!node.declarationList.declarations.find((declaration) => declaration.name.getText() === 'extension')

let isExtensionInterface = (node: ts.Node): node is ts.InterfaceDeclaration =>
  ts.isInterfaceDeclaration(node) && findIdentifier(node)?.getText() === 'Extension'

let isExtensionType = (node: ts.Node): node is ts.TypeAliasDeclaration =>
  ts.isTypeAliasDeclaration(node) && findIdentifier(node)?.getText() === 'Extension'

let findIdentifier = (node: ts.Node) => node.getChildren().find(ts.isIdentifier)

type ExtensionMetadata = {
  start: number
  end: number
  node: ts.VariableDeclaration
}

type ParsedExtensionType = { type: ts.InterfaceDeclaration | ts.TypeAliasDeclaration }
type ParsedExtensionTerm = { term: ts.VariableStatement }
type ParsedExtension = ParsedExtensionType & ParsedExtensionTerm

export function parseExtensionFile(sourceFilePath: string): { term?: string, type?: string } {
  let source = fs.readFileSync(sourceFilePath).toString('utf-8')
  let program = createProgram(source)
  /* initialize the type checker, otherwise we can't perform a traversal */
  void program.getTypeChecker()
  let sourceFile = program.getSourceFiles()[1]
  let nodes: Partial<ParsedExtension> = {}
  let out: { term?: string, type?: string } = {}
  void ts.forEachChild(sourceFile, (node) => {
    if (isExtensionType(node)) nodes.type = node
    if (isExtensionInterface(node)) nodes.type = node
    if (isExtensionTerm(node)) nodes.term = node
  })
  if (nodes.type) {
    let text = nodes.type.getText()
    out.type = text.slice(text.indexOf('{') + 1, text.lastIndexOf('}'))
  }
  if (nodes.term) {
    let text = nodes.term.getText()
    out.term = text.slice(text.indexOf('{') + 1, text.lastIndexOf('}'))
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

  let content = sourceFile.getFullText()
  let body: string = content.slice(bodyStart).trim()

  return { imports, body }
}

let parseTypeMarker = P.seq(P.char('{'), P.spaces, P.string(typesMarker), P.spaces, P.char('}'))
let parseTermMarker = P.seq(P.char('{'), P.spaces, P.string(termsMarker), P.spaces, P.char('}'))


export function replaceExtensions(source: string, extension: { term?: string, type?: string }) {
  let typeMarker = parseTypeMarker.find(source)
  let termMarker = parseTermMarker.find(source)

  if (typeMarker === void 0 || termMarker === void 0) throw Error('missing marker')
  if (extension.type === void 0 || extension.term === void 0) throw Error('missing parsed extension')
  if (!typeMarker.result.success || !termMarker.result.success) throw Error('marker parse failed')
  if (!typeMarker.result.value[1] || !termMarker.result.value[1]) throw Error('unknown error')

  let typeIndent = ' '.repeat(Math.max(typeMarker.result.value[1].length - 1, 0))
  // TODO: figure out why you need -3 here
  let termIndent = ' '.repeat(Math.max(termMarker.result.value[1].length - 3, 0))

  if (typeMarker.index < termMarker.index) {
    let out = ''
      + source.slice(0, typeMarker.index + 1)
      // TODO: figure out why indent isn't working here
      + extension.type
      // + extension.type.split('\n').map((_) => typeIndent + _).join('\n')
      + source.slice(typeMarker.result.index - 1, termMarker.index + 1)
      + extension.term.split('\n').map((_) => termIndent + _).join('\n')
      // + extension.term
      + source.slice(termMarker.result.index - 1)
    console.log('out', out)
    return out
  } else {
    let out = ''
      + source.slice(0, termMarker.index + 1)
      + extension.term.split('\n').map((_) => termIndent + _).join('\r')
      + source.slice(termMarker.result.index - 1, typeMarker.index + 1)
      + extension.type.split('\n').map((_) => typeIndent + _).join('\n')
      + source.slice(typeMarker.result.index - 1)
    console.log('out', out)
    return out
  }
}

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

// console.log('\n\nparsedTermsMarker', source.slice(parsedTermsMarker))

// let terms = !parsedTermsMarker?.success ? void 0 : {
//   start: parsedTermsMarker.index - parsedTermsMarker.value[1].length,
//   end: parsedTermsMarker.index,
//   indentation: Math.max(parsedTermsMarker.value[0].length - 1, 0),
// }

// console.log('extension', extension)

// let types = !parsedTypesMarker?.success ? void 0 : {
//   start: parsedTypesMarker.index - parsedTypesMarker.value[1].length,
//   end: parsedTypesMarker.index,
//   indentation: Math.max(parsedTypesMarker.value[0].length - 1, 0),
// }

// let terms = !parsedTermsMarker?.success ? void 0 : {
//   start: parsedTermsMarker.index - parsedTermsMarker.value[1].length,
//   end: parsedTermsMarker.index,
//   indentation: Math.max(parsedTermsMarker.value[0].length - 1, 0),
// }

// if (types === void 0) throw new Error('expected types')
// if (terms === void 0) {
//   console.log(source)
//   throw new Error('expected terms')
// }

// if (types.start < terms.start) return ''
//   + source.slice(0, types.start)
//   + extensions.map(({ type }, ix) => ix === 0 ? removeQuotes(type ?? '') : ' '.repeat(types.indentation) + removeQuotes(type ?? '')).join('\n')
//   + source.slice(types.end, terms.start)
//   + extensions.map(({ term }, ix) => ix === 0 ? removeQuotes(term ?? '') : ' '.repeat(terms.indentation) + removeQuotes(term ?? '')).join(',\n')
//   + source.slice(terms.end)
// else return ''
//   + source.slice(0, terms.start)
//   + extensions.map(({ term }, ix) => ix === 0 ? removeQuotes(term ?? '') : ' '.repeat(terms.indentation) + removeQuotes(term ?? '')).join(',\n')
//   + source.slice(terms.end, types.start)
//   + extensions.map(({ type }, ix) => ix === 0 ? removeQuotes(type ?? '') : ' '.repeat(types.indentation) + removeQuotes(type ?? '')).join('\n')
//   + source.slice(types.end)


// let removeQuotes = (text: string) => isQuoted(text) ? text.slice(1, -1) : text

// let parseTypesMarker = P.seq(P.spaces, P.string(typesMarker)).map(([ws, marker]) => [ws?.join('') ?? '', marker] satisfies [any, any])
// let parseTermsMarker = P.seq(P.spaces, P.string(termsMarker)).map(([ws, marker]) => [ws?.join('') ?? '', marker] satisfies [any, any])

// let isQuoted = (text: string) =>
//   (text.startsWith('"') && text.endsWith('"'))
//   || (text.startsWith('`') && text.endsWith('`'))
//   || (text.startsWith(`'`) && text.endsWith(`'`))
