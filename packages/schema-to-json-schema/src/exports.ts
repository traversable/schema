import * as JsonSchema from './jsonSchema.js'
type JsonSchema<T = never> = import('./jsonSchema.js').JsonSchema<T>

export { JsonSchema }
export { toJsonSchema, fromJsonSchema } from './recursive.js'
export { VERSION } from './version.js'
export { fold, Functor } from './functor.js'
export * as Gen from './arbitrary.js'
