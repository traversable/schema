import { t } from '@traversable/schema'
import * as toString from './toString.js'

declare module '@traversable/schema' {
  interface t_never extends toString.never { }
  interface t_unknown extends toString.unknown { }
  interface t_void extends toString.void { }
  interface t_any extends toString.any { }
  interface t_null extends toString.null { }
  interface t_undefined extends toString.undefined { }
  interface t_symbol extends toString.symbol { }
  interface t_boolean extends toString.boolean { }
  interface t_integer extends toString.integer { }
  interface t_bigint extends toString.bigint { }
  interface t_number extends toString.number { }
  interface t_string extends toString.string { }
  interface t_eq<V> extends toString.eq<V> { }
  interface t_optional<S> extends toString.optional<S> { }
  interface t_array<S> extends toString.array<S> { }
  interface t_record<S> extends toString.record<S> { }
  interface t_union<S> extends toString.union<S> { }
  interface t_intersect<S> extends toString.intersect<S> { }
  interface t_tuple<S> extends toString.tuple<S> { }
  interface t_object<S> extends toString.object<S> { }
}

/////////////////
///  INSTALL  ///
void bind()   ///
///  INSTALL  ///
/////////////////

function bind() {
  Object.assign(t.never, { toString: toString.never });
  Object.assign(t.unknown, { toString: toString.unknown });
  Object.assign(t.any, { toString: toString.any });
  Object.assign(t.void, { toString: toString.void });
  Object.assign(t.null, { toString: toString.null })
  Object.assign(t.undefined, { toString: toString.undefined })
  Object.assign(t.boolean, { toString: toString.boolean })
  Object.assign(t.symbol, { toString: toString.symbol })
  Object.assign(t.integer, { toString: toString.integer })
  Object.assign(t.bigint, { toString: toString.bigint })
  Object.assign(t.number, { toString: toString.number })
  Object.assign(t.string, { toString: toString.string })
  Object.assign(t.eq.prototype, { toString: toString.eq })
  Object.assign(t.optional.prototype, { toString: toString.optional })
  Object.assign(t.union.prototype, { toString: toString.union })
  Object.assign(t.intersect.prototype, { toString: toString.intersect })
  Object.assign(t.tuple.prototype, { toString: toString.tuple })
  Object.assign(t.object.prototype, { toString: toString.object })
  Object.assign(t.array.prototype, { toString: toString.array })
  Object.assign(t.record.prototype, { toString: toString.record })
}
