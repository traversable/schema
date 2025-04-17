import { Object_assign } from '@traversable/registry'
import { t } from '@traversable/schema-core'
import * as validate from './validate.js'
import type { ValidationFn_ as ValidationFn } from './shared.js'

declare module '@traversable/schema-core' {
  interface t_Lower { validate: ValidationFn<unknown> }
  // interface t_never { validate: ValidationFn<this> }
  interface t_unknown { validate: ValidationFn<this> }
  interface t_void { validate: ValidationFn<this> }
  interface t_any { validate: ValidationFn<this> }
  interface t_null { validate: ValidationFn<this> }
  interface t_undefined { validate: ValidationFn<this> }
  interface t_symbol { validate: ValidationFn<this> }
  interface t_boolean { validate: ValidationFn<this> }
  interface t_integer { validate: ValidationFn<this> }
  interface t_bigint { validate: ValidationFn<this> }
  interface t_number { validate: ValidationFn<this> }
  interface t_string { validate: ValidationFn<this> }
  interface t_eq<V> { validate: ValidationFn<this> }
  interface t_optional<S> { validate: ValidationFn<this> }
  interface t_array<S> { validate: ValidationFn<this> }
  interface t_record<S> { validate: ValidationFn<this> }
  interface t_union<S> { validate: ValidationFn<this> }
  interface t_intersect<S> { validate: ValidationFn<this> }
  interface t_tuple<S> { validate: ValidationFn<this> }
  interface t_object<S> { validate: ValidationFn<this> }
  interface t_of<S> { validate: ValidationFn<this> }
  interface t_enum<V> { validate: ValidationFn<this> }
}

/////////////////
///  INSTALL  ///
void bind()   ///
///  INSTALL  ///
/////////////////

export function bind() {
  Object_assign(t.never, { validate: validate.never })
  Object_assign(t.unknown, { validate: validate.unknown })
  Object_assign(t.any, { validate: validate.any })
  Object_assign(t.void, { validate: validate.void })
  Object_assign(t.null, { validate: validate.null })
  Object_assign(t.undefined, { validate: validate.undefined })
  Object_assign(t.symbol, { validate: validate.symbol })
  Object_assign(t.boolean, { validate: validate.boolean })
  Object_assign(t.integer, { validate: validate.integer })
  Object_assign(t.bigint, { validate: validate.bigint })
  Object_assign(t.number, { validate: validate.number })
  Object_assign(t.string, { validate: validate.string })
  Object_assign(t.eq.userDefinitions, { validate: validate.eq })
  Object_assign(t.optional.userDefinitions, { validate: validate.optional })
  Object_assign(t.array.userDefinitions, { validate: validate.array })
  Object_assign(t.record.userDefinitions, { validate: validate.record })
  Object_assign(t.union.userDefinitions, { validate: validate.union })
  Object_assign(t.intersect.userDefinitions, { validate: validate.intersect })
  Object_assign(t.tuple.userDefinitions, { validate: validate.tuple })
  Object_assign(t.object.userDefinitions, { validate: validate.object })
  Object_assign(t.enum.userDefinitions, { validate: validate.enum })
}
