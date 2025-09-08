import { t } from '@traversable/schema'
import * as toType from './toType.js'

declare module '@traversable/schema' {
  interface t_never extends toType.never {}
  interface t_unknown extends toType.unknown {}
  interface t_void extends toType.void {}
  interface t_any extends toType.any {}
  interface t_null extends toType.null {}
  interface t_undefined extends toType.undefined {}
  interface t_symbol extends toType.symbol {}
  interface t_boolean extends toType.boolean {}
  interface t_integer extends toType.integer {}
  interface t_bigint extends toType.bigint {}
  interface t_number extends toType.number {}
  interface t_string extends toType.string {}
  interface t_eq<V> extends toType.eq<V> {}
  interface t_ref<S, Id> extends toType.ref<S, Id> {}
  interface t_optional<S> extends toType.optional<S> {}
  interface t_array<S> extends toType.array<S> {}
  interface t_record<S> extends toType.record<S> {}
  interface t_union<S> extends toType.union<S> {}
  interface t_intersect<S> extends toType.intersect<S> {}
  interface t_tuple<S> extends toType.tuple<S> {}
  interface t_object<S> extends toType.object<S> {}
}

/////////////////
///  INSTALL  ///
void bind()   ///
///  INSTALL  ///
/////////////////

function bind() {
  Object.assign(t.never, { toType: toType.never })
  Object.assign(t.unknown, { toType: toType.unknown })
  Object.assign(t.any, { toType: toType.any })
  Object.assign(t.void, { toType: toType.void })
  Object.assign(t.null, { toType: toType.null })
  Object.assign(t.undefined, { toType: toType.undefined })
  Object.assign(t.boolean, { toType: toType.boolean })
  Object.assign(t.symbol, { toType: toType.symbol })
  Object.assign(t.integer, { toType: toType.integer })
  Object.assign(t.bigint, { toType: toType.bigint })
  Object.assign(t.number, { toType: toType.number })
  Object.assign(t.string, { toType: toType.string })
  Object.assign(t.eq.prototype, { toType: toType.eq })
  Object.assign(t.ref.prototype, { toType: toType.ref })
  Object.assign(t.optional.prototype, { toType: toType.optional })
  Object.assign(t.union.prototype, { toType: toType.union })
  Object.assign(t.intersect.prototype, { toType: toType.intersect })
  Object.assign(t.tuple.prototype, { toType: toType.tuple })
  Object.assign(t.object.prototype, { toType: toType.object })
  Object.assign(t.array.prototype, { toType: toType.array })
  Object.assign(t.record.prototype, { toType: toType.record })
}
