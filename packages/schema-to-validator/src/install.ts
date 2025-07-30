import { t } from '@traversable/schema'
import * as proto from './prototype.js'
import type { Validate } from './shared.js'

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

/////////////////
///  INSTALL  ///
void bind()   ///
///  INSTALL  ///
/////////////////


export function bind() {
  /** @internal */
  let Object_assign = globalThis.Object.assign
  Object_assign(t.never, { validate: proto.never })
  Object_assign(t.unknown, { validate: proto.unknown })
  Object_assign(t.any, { validate: proto.any })
  Object_assign(t.void, { validate: proto.void })
  Object_assign(t.null, { validate: proto.null })
  Object_assign(t.undefined, { validate: proto.undefined })
  Object_assign(t.symbol, { validate: proto.symbol })
  Object_assign(t.boolean, { validate: proto.boolean })
  Object_assign(t.integer, { validate: proto.integer })
  Object_assign(t.bigint, { validate: proto.bigint })
  Object_assign(t.number, { validate: proto.number })
  Object_assign(t.string, { validate: proto.string })
  Object_assign(t.optional.prototype, { validate: proto.optional })
  Object_assign(t.eq.prototype, { validate: proto.eq })
  Object_assign(t.array.prototype, { validate: proto.array })
  Object_assign(t.record.prototype, { validate: proto.record })
  Object_assign(t.union.prototype, { validate: proto.union })
  Object_assign(t.intersect.prototype, { validate: proto.intersect })
  Object_assign(t.tuple.prototype, { validate: proto.tuple })
  Object_assign(t.object.prototype, { validate: proto.object })
  Object_assign(t.enum.prototype, { validate: proto.enum })
}
