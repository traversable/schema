export { fromSchema, fromSchemaWithOptions } from './recursive.js'

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
import type { Validate } from './shared.js'

// SIDE-EFFECT
void bindValidators()

declare module '@traversable/schema' {
  interface Lower { validate: Validate }
  interface NeverSchema { validate: Validate }
  interface UnknownSchema { validate: Validate }
  interface VoidSchema { validate: Validate }
  interface AnySchema { validate: Validate }
  interface NullSchema { validate: Validate }
  interface UndefinedSchema { validate: Validate }
  interface SymbolSchema { validate: Validate }
  interface BooleanSchema { validate: Validate }
  interface IntegerSchema { validate: Validate }
  interface BigIntSchema { validate: Validate }
  interface NumberSchema { validate: Validate }
  interface StringSchema { validate: Validate }
  interface EqSchema<V> { validate: Validate }
  interface OptionalSchema<S> { validate: Validate }
  interface ArraySchema<S> { validate: Validate }
  interface RecordSchema<S> { validate: Validate }
  interface UnionSchema<S> { validate: Validate }
  interface IntersectSchema<S> { validate: Validate }
  interface TupleSchema<S> { validate: Validate }
  interface ObjectSchema<S> { validate: Validate }
  interface InlineSchema<S> { validate: Validate }
}
