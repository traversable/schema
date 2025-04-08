import * as fs from 'node:fs'
import ts from 'typescript'
import type { Imports } from './make.js'
import * as P from './combinator.js'
import { fn } from '@traversable/registry'

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

type ExtensionMetadata = {
  start: number
  end: number
  node: ts.VariableDeclaration
}

export function parseSourceFile(sourceFile: ts.SourceFile): ParsedSourceFile {
  let imports: Record<string, Imports> = {}
  let bodyStart: number = 0
  let extensionMetadata: ExtensionMetadata | undefined = undefined

  void ts.forEachChild(sourceFile, (node) => {
    if (isExportedVariable(node)) {
      let extension = node.declarationList.declarations
        .find((declaration) => declaration.name.getText() === 'extension')
      if (extension) {
        extensionMetadata = {
          start: node.getStart(),
          end: node.end,
          node: extension,
        }
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
  let extension: { type?: string, term?: string } | undefined = undefined
  let ext: ExtensionMetadata = extensionMetadata as never

  if (typeof ext === 'object') {
    let raw = content.slice(ext.start, ext.end)
    let parsed = parseObjectEntries.run(raw.slice(raw.indexOf('{')))
    if (parsed.success) {
      extension = fn.map(Object.fromEntries(parsed.value), removeQuotes)
    }

    body = content.slice(bodyStart, ext.start) + content.slice(ext.end).trim()
  }
  else {
    body = content.slice(bodyStart).trim()
  }

  return extension === undefined
    ? { imports, body }
    : { imports, body, extension }
}

let isQuoted = (text: string) =>
  (text.startsWith('"') && text.endsWith('"'))
  || (text.startsWith('`') && text.endsWith('`'))
  || (text.startsWith(`'`) && text.endsWith(`'`))

let removeQuotes = (text: string) => isQuoted(text) ? text.slice(1, -1) : text

let parseTypesMarker = P.seq(P.spaces, P.string(typesMarker)).map(([ws, marker]) => [ws?.join('') ?? '', marker] satisfies [any, any])
let parseTermsMarker = P.seq(P.spaces, P.string(termsMarker)).map(([ws, marker]) => [ws?.join('') ?? '', marker] satisfies [any, any])

export function replaceExtensions(source: string, extensions: { term: string, type: string }[]) {
  let parsedTypesMarker = parseTypesMarker.find(source)?.result
  let parsedTermsMarker = parseTermsMarker.find(source)?.result

  let types = !parsedTypesMarker?.success ? null : {
    start: parsedTypesMarker.index - parsedTypesMarker.value[1].length,
    end: parsedTypesMarker.index,
    indentation: Math.max(parsedTypesMarker.value[0].length - 1, 0),
  }

  let terms = !parsedTermsMarker?.success ? null : {
    start: parsedTermsMarker.index - parsedTermsMarker.value[1].length,
    end: parsedTermsMarker.index,
    indentation: Math.max(parsedTermsMarker.value[0].length - 1, 0),
  }

  if (!types) throw new Error('expected types')
  if (!terms) throw new Error('expected terms')

  if (types.start < terms.start) return ''
    + source.slice(0, types.start)
    + extensions.map(({ type }, ix) => ix === 0 ? removeQuotes(type) : ' '.repeat(types.indentation) + removeQuotes(type)).join('\n')
    + source.slice(types.end, terms.start)
    + extensions.map(({ term }, ix) => ix === 0 ? removeQuotes(term) : ' '.repeat(terms.indentation) + removeQuotes(term)).join(',\n')
    + source.slice(terms.end)
  else return ''
    + source.slice(0, terms.start)
    + extensions.map(({ term }, ix) => ix === 0 ? removeQuotes(term) : ' '.repeat(terms.indentation) + removeQuotes(term)).join(',\n')
    + source.slice(terms.end, types.start)
    + extensions.map(({ type }, ix) => ix === 0 ? removeQuotes(type) : ' '.repeat(types.indentation) + removeQuotes(type)).join('\n')
    + source.slice(types.end)
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
