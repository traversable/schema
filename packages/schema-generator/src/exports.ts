export * from './version.js'
export * as P from './parser-combinators.js'

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
  writeSchemas,
} from './imports.js'

export type {
  ParsedSourceFile,
} from './parser.js'

export {
  createProgram,
  parseFile,
  parseSourceFile,
  replaceExtensions,
} from './parser.js'


