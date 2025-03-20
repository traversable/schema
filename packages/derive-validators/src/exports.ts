import { ValidationFn } from './shared.js'

// TODO:
export { fromSchema, fromSchemaWithOptions } from './validators.js'

export { VERSION } from './version.js'

export type {
  ValidationFn,
  Options,
} from './shared.js'
export { isOptional } from './shared.js'

export type {
  ValidationError,
} from './errors.js'

export {
  ERROR as Errors,
  ErrorType,
  dataPath as dataPathFromSchemaPath,
} from './errors.js'

import { bindValidators } from './bind.js'

// SIDE-EFFECT
void bindValidators()

declare module '@traversable/schema' {
  interface Lower { validate: ValidationFn }
  interface NeverSchema { validate: ValidationFn }
  interface UnknownSchema { validate: ValidationFn }
  interface VoidSchema { validate: ValidationFn }
  interface AnySchema { validate: ValidationFn }
  interface NullSchema { validate: ValidationFn }
  interface UndefinedSchema { validate: ValidationFn }
  interface SymbolSchema { validate: ValidationFn }
  interface BooleanSchema { validate: ValidationFn }
  interface IntegerSchema { validate: ValidationFn }
  interface BigIntSchema { validate: ValidationFn }
  interface NumberSchema { validate: ValidationFn }
  interface StringSchema { validate: ValidationFn }
  interface EqSchema<V> { validate: ValidationFn }
  interface OptionalSchema<S> { validate: ValidationFn }
  interface ArraySchema<S> { validate: ValidationFn }
  interface RecordSchema<S> { validate: ValidationFn }
  interface UnionSchema<S extends readonly unknown[]> { validate: ValidationFn }
  interface IntersectSchema<S extends readonly unknown[]> { validate: ValidationFn }
  interface TupleSchema<S extends readonly unknown[]> { validate: ValidationFn }
  interface ObjectSchema<S extends { [x: string]: unknown }> { validate: ValidationFn }
  interface InlineSchema<T> { validate: ValidationFn }
}
