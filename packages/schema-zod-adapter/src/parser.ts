import * as fs from 'node:fs'
import ts from 'typescript'
import type { Imports } from './make.js'
import * as P from './combinator.js'

export type ParsedSourceFile = {
  imports: Record<string, Imports>
  body: string
  extension?: { type?: string, term?: string }
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

let entriesNoDanglingComma = P.seq(
  entry,
  P.optional(P.seq(comma, entry).map((_) => _[1]).many()),
).map(([x, xs]) => {
  if (xs === null) return [x]
  else return [x, ...xs]
})

let entriesWithOptionalDanglingComma = P.seq(
  P.seq(P.trim(entry), P.char(',')).map(([_]) => _).many(),
  P.optional(P.trim(entry)),
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
  return parseSourceFile(checker, sourceFile)
}

let isExportedVariable = (node: ts.Node): node is ts.VariableStatement =>
  ts.isVariableStatement(node) && !!node.modifiers?.some((_) => _.kind === ts.SyntaxKind.ExportKeyword)

export function parseSourceFile(checker: ts.TypeChecker, sourceFile: ts.SourceFile): ParsedSourceFile {
  let imports: Record<string, Imports> = {}
  let bodyStart: number = 0
  let extensionStart: number | undefined = undefined
  let extensionEnd: number | undefined = undefined
  let extensionNode: ts.VariableDeclaration | undefined = undefined
  let extensionProperties = Array.of<string>()

  void ts.forEachChild(sourceFile, (node) => {
    if (isExportedVariable(node)) {
      let extension = node.declarationList.declarations.find((declaration) => declaration.name.getText() === 'extension')
      if (extension) {
        extensionStart = node.getStart()
        extensionEnd = node.end
        extensionNode = extension

        // console.log(extension.getText())
      }
    }

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

  let body: string
  let extension: string | undefined = undefined

  if (
    typeof extensionStart === 'number'
    && typeof extensionEnd === 'number'
    && !!extensionNode
    && ts.isVariableDeclaration(extensionNode)
  ) {
    let raw = content.slice(extensionStart, extensionEnd)
    let parsed = parseObjectEntries.run(raw.slice(raw.indexOf('{')))

    if (parsed.success) {
      console.log(parsed.value)

    }
    body = content.slice(bodyStart, extensionStart) + content.slice(extensionEnd).trim()
  }
  else {
    body = content.slice(bodyStart).trim()
  }

  return typeof extension === 'string'
    ? { imports, body, extension }
    : { imports, body }
}

export function replaceExtensions(source: string, extensions: { term: string, type: string }[]) {
  let typesStart = source.indexOf(typesMarker)
  let termsStart = source.indexOf(termsMarker)
  let typesEnd = typesStart + typesMarker.length
  let termsEnd = termsStart + termsMarker.length
  if (typesStart < termsStart) {
    return ''
      + source.slice(0, typesStart)
      + extensions.map(({ type }) => type).join(',\n')
      + source.slice(typesEnd, termsStart)
      + extensions.map(({ term }) => term).join(',\n')
      + source.slice(typesEnd)
  } else {
    return ''
      + source.slice(0, termsStart)
      + extensions.map(({ term }) => term).join(',\n')
      + source.slice(termsEnd, typesStart)
      + extensions.map(({ type }) => type).join(',\n')
      + source.slice(typesEnd)
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
    getSourceFile: (filename, options) => {
      let content = files.get(filename)
      if (content === void 0) throw Error('missing file')
      return ts.createSourceFile(filename, content, options)
    },
    getDefaultLibFileName: () => LIB_FILE_NAME,
    writeFile: () => { throw Error('unimplemented') },
    getCurrentDirectory: () => '/',
    getDirectories: () => [],
    getCanonicalFileName: (f) => f.toLowerCase(),
    getNewLine: () => '\n',
    useCaseSensitiveFileNames: () => false,
    readFile: (filename) => files.get(filename),
  })
}
