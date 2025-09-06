export * from './exports.js'

export type JsonSchema<T = never> = [T] extends [never]
  ? import('./types.js').JsonSchema
  : import('./types.js').F<T>

export * as JsonSchema from './exports.js'
