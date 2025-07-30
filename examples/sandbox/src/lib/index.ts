export * as t from './namespace'

import { t } from '@traversable/schema'
import '@traversable/schema-codec/install'
import '@traversable/derive-equals/install'
import '@traversable/derive-validators/install'
import '@traversable/schema-to-json-schema/install'
import '@traversable/schema-to-string/install'
import { prototype } from './prototype'

export function bind() {
  Object.assign(t.never, prototype)
  Object.assign(t.unknown, prototype)
  Object.assign(t.void, prototype)
  Object.assign(t.null, prototype)
  Object.assign(t.undefined, prototype)
  Object.assign(t.boolean, prototype)
  Object.assign(t.symbol, prototype)
  Object.assign(t.integer, prototype)
  Object.assign(t.bigint, prototype)
  Object.assign(t.number, prototype)
  Object.assign(t.string, prototype)
  Object.assign(t.eq.prototype, prototype)
  Object.assign(t.optional.prototype, prototype)
  Object.assign(t.array.prototype, prototype)
  Object.assign(t.record.prototype, prototype)
  Object.assign(t.union.prototype, prototype)
  Object.assign(t.intersect.prototype, prototype)
  Object.assign(t.tuple.prototype, prototype)
  Object.assign(t.object.prototype, prototype)
  Object.assign(t.enum.prototype, prototype)
}


// SIDE-EFFECT
void bind()

export interface parse {
  parse(u: this['_type' & keyof this] | {} | null | undefined): this['_type' & keyof this]
}

declare module '@traversable/schema' {
  interface t_never extends parse {}
  interface t_unknown extends parse {}
  interface t_any extends parse {}
  interface t_void extends parse {}
  interface t_null extends parse {}
  interface t_undefined extends parse {}
  interface t_symbol extends parse {}
  interface t_boolean extends parse {}
  interface t_integer extends parse {}
  interface t_bigint extends parse {}
  interface t_number extends parse {}
  interface t_string extends parse {}
  interface t_eq<V> extends parse {}
  interface t_optional<S> extends parse {}
  interface t_array<S> extends parse {}
  interface t_record<S> extends parse {}
  interface t_union<S> extends parse {}
  interface t_intersect<S> extends parse {}
  interface t_tuple<S> extends parse {}
  interface t_object<S> extends parse {}
  interface t_enum<V> extends parse {}
}
