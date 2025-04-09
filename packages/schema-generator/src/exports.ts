export * from './version.js'
export * as P from './parser-combinators.js'

export type {
  DependenciesBySchema,
  ParsedImport,
  ParsedImports,
} from './imports.js'
export {
  deduplicateDependencies,
  makeImport,
  makeImports,
  makeImportArraysBySchemaName,
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


