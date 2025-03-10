export { VERSION } from './version.js'
export * from './types.js'
export * as AST from './ast.js'
export type { GlobalOptions, OptionalTreatment, SchemaOptions } from './options.js'
export type { GlobalConfig, SchemaConfig } from './config.js'
export { configure, defaults, getConfig } from './config.js'
export { parseArgs } from './parseArgs.js'
export { t } from './schema.js'
export type { Type as T, AnySchema, Schema, Unspecified } from './core.js'
export { clone, extend, } from './extend.js'
