export { fromSchema, fromSchemaWithOptions } from './recursive.js'

export { VERSION } from './version.js'

export type {
  ValidationFn,
  Validate,
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
  interface t_Lower { validate: Validate<unknown> }
  interface t_never { validate: Validate<never> }
  interface t_unknown { validate: Validate<unknown> }
  interface t_void { validate: Validate<void> }
  interface t_any { validate: Validate<any> }
  interface t_null { validate: Validate<null> }
  interface t_undefined { validate: Validate<undefined> }
  interface t_symbol { validate: Validate<symbol> }
  interface t_boolean { validate: Validate<number> }
  interface t_integer { validate: Validate<number> }
  interface t_bigint { validate: Validate<bigint> }
  interface t_number { validate: Validate<number> }
  interface t_string { validate: Validate<string> }
  interface t_eq<V> { validate: Validate<V> }
  interface t_optional<S> { validate: Validate<t.optional.type<S>> }
  interface t_array<S> { validate: Validate<t.array.type<S>> }
  interface t_record<S> { validate: Validate<t.record.type<S>> }
  interface t_union<S> { validate: Validate<t.union.type<S>> }
  interface t_intersect<S> { validate: Validate<t.intersect.type<S>> }
  interface t_tuple<S> { validate: Validate<t.tuple.type<S>> }
  interface t_object<S> { validate: Validate<t.object.type<S>> }
  interface t_of<S> { validate: Validate<t.of.type<S>> }
  interface t_enum<V> { validate: Validate<t.enum.type<V>> }
}
