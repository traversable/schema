export * from './version.js'
export * as P from './parser-combinators.js'

export type { DefineExtension } from './defineExtension.js'
export { defineExtension } from './defineExtension.js'

export type {
  ExtensionsBySchemaName,
  ParsedImport,
  ParsedImports,
} from './imports.js'

export {
  deduplicateImports,
  makeImport,
  makeImports,
  makeImportsBySchemaName,
} from './imports.js'

export {
  generateSchemas,
  writeSchemas,
} from './generate.js'

export type {
  ParsedSourceFile,
} from './parser.js'

export {
  createProgram,
  parseFile,
  parseSourceFile,
  replaceExtensions,
} from './parser.js'


