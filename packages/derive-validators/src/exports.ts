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
  interface t_LowerBound { validate: Validate }
  interface t_never { validate: Validate }
  interface t_unknown { validate: Validate }
  interface t_void { validate: Validate }
  interface t_any { validate: Validate }
  interface t_null { validate: Validate }
  interface t_undefined { validate: Validate }
  interface t_symbol { validate: Validate }
  interface t_boolean { validate: Validate }
  interface t_integer { validate: Validate }
  interface t_bigint { validate: Validate }
  interface t_number { validate: Validate }
  interface t_string { validate: Validate }
  interface t_eq<V> { validate: Validate }
  interface t_optional<S> { validate: Validate }
  interface t_array<S> { validate: Validate }
  interface t_record<S> { validate: Validate }
  interface t_union<S> { validate: Validate }
  interface t_intersect<S> { validate: Validate }
  interface t_tuple<S> { validate: Validate }
  interface t_object<S> { validate: Validate }
  interface t_of<S> { validate: Validate }
}
