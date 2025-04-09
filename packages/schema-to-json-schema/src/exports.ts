import * as JsonSchema from './jsonSchema.js'
type JsonSchema<T = never> = import('./jsonSchema.js').JsonSchema<T>

export { JsonSchema }
export { toJsonSchema, fromJsonSchema } from './recursive.js'
export { VERSION } from './version.js'
export type { RequiredKeys } from './properties.js'
export { isRequired, property } from './properties.js'
export type * from './specification.js'
