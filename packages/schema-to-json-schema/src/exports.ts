import * as JsonSchema from './jsonSchema.js'
type JsonSchema<T = never> = import('./jsonSchema.js').JsonSchema<T>

export { JsonSchema }
export { applyTupleOptionality } from './jsonSchema.js'
export { toJsonSchema, fromJsonSchema } from './recursive.js'
export { VERSION } from './version.js'
export type { RequiredKeys } from './properties.js'
export { getSchema, isRequired, property } from './properties.js'
export type { MinItems } from './items.js'
export { minItems } from './items.js'
export type * from './specification.js'
