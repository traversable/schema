import * as V from './validators.js'

export { VERSION } from './version.js'

export type {
  ValidationFn,
} from './validators.js'

export {
  // fromSchema as validatorFromSchema,
} from './validators.js'

export type {
  ValidationError,
} from './errors.js'

// export * as v from './validators.js'

export {
  ERROR as Errors,
  ErrorType,
  dataPath as dataPathFromSchemaPath,
} from './errors.js'

import { bindValidators } from './bind.js'

// SIDE-EFFECT
void bindValidators()

declare module '@traversable/schema' {
  interface Lower { validate: V.ValidationFn }
  interface NeverSchema { validate: V.ValidationFn }
  interface UnknownSchema { validate: V.ValidationFn }
  interface VoidSchema { validate: V.ValidationFn }
  interface AnySchema { validate: V.ValidationFn }
  interface NullSchema { validate: V.ValidationFn }
  interface UndefinedSchema { validate: V.ValidationFn }
  interface SymbolSchema { validate: V.ValidationFn }
  interface BooleanSchema { validate: V.ValidationFn }
  interface IntegerSchema { validate: V.ValidationFn }
  interface BigIntSchema { validate: V.ValidationFn }
  interface NumberSchema { validate: V.ValidationFn }
  interface StringSchema { validate: V.ValidationFn }
  interface EqSchema<V> { validate: V.ValidationFn }
  interface OptionalSchema<S> { validate: V.ValidationFn }
  interface ArraySchema<S> { validate: V.ValidationFn }
  interface RecordSchema<S> { validate: V.ValidationFn }
  interface UnionSchema<S extends readonly unknown[]> { validate: V.ValidationFn }
  interface IntersectSchema<S extends readonly unknown[]> { validate: V.ValidationFn }
  interface TupleSchema<S extends readonly unknown[]> { validate: V.ValidationFn }
  interface ObjectSchema<S extends { [x: string]: unknown }> { validate: V.ValidationFn }
  interface InlineSchema<T> { validate: V.ValidationFn }
}
