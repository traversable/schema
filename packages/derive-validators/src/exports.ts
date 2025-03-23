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

import type { t } from '@traversable/schema'
import { bindValidators } from './bind.js'
import type { Validate } from './shared.js'

// SIDE-EFFECT
void bindValidators()

declare module '@traversable/schema' {
  interface Lower { validate: Validate<unknown> }
  interface NeverSchema { validate: Validate<never> }
  interface UnknownSchema { validate: Validate<unknown> }
  interface VoidSchema { validate: Validate<void> }
  interface AnySchema { validate: Validate<any> }
  interface NullSchema { validate: Validate<null> }
  interface UndefinedSchema { validate: Validate<undefined> }
  interface SymbolSchema { validate: Validate<symbol> }
  interface BooleanSchema { validate: Validate<number> }
  interface IntegerSchema { validate: Validate<number> }
  interface BigIntSchema { validate: Validate<bigint> }
  interface NumberSchema { validate: Validate<number> }
  interface StringSchema { validate: Validate<string> }
  interface EqSchema<V> { validate: Validate<V> }
  interface OptionalSchema<S> { validate: Validate<t.optional.type<S>> }
  interface ArraySchema<S> { validate: Validate<t.array.type<S>> }
  interface RecordSchema<S> { validate: Validate<t.record.type<S>> }
  interface UnionSchema<S> { validate: Validate<t.union.type<S>> }
  interface IntersectSchema<S> { validate: Validate<t.intersect.type<S>> }
  interface TupleSchema<S> { validate: Validate<t.tuple.type<S>> }
  interface ObjectSchema<S> { validate: Validate<t.object.type<S>> }
  interface InlineSchema<S> { validate: Validate<t.of.type<S>> }
  interface EnumSchema<V> { validate: Validate<t.enum.type<V>> }
}
