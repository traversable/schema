export * from '@traversable/json-schema-types'

export { VERSION } from './version.js'
export * from './exports.js'
export type JsonSchema<T = never> = import('@traversable/json-schema-types').JsonSchema<T>
export * as JsonSchema from './exports.js'
