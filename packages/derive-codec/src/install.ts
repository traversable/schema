import { Object_assign } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import type { BindCodec } from './codec.js'
import { bindCodec } from './codec.js'

declare module '@traversable/schema-core' {
  interface t_LowerBound<T> extends BindCodec<t_LowerBound<T>> { }
  // interface t_never extends BindCodec<t.never> { }
  interface t_unknown extends BindCodec<t.unknown> { }
  interface t_void extends BindCodec<t.void> { }
  interface t_any extends BindCodec<t.any> { }
  interface t_null extends BindCodec<t.null> { }
  interface t_undefined extends BindCodec<t.undefined> { }
  interface t_symbol extends BindCodec<t.symbol> { }
  interface t_boolean extends BindCodec<t.boolean> { }
  interface t_integer extends BindCodec<t.integer> { }
  interface t_bigint extends BindCodec<t.bigint> { }
  interface t_number extends BindCodec<t.number> { }
  interface t_string extends BindCodec<t.string> { }
  interface t_eq<V> extends BindCodec<t.eq<V>> { }
  interface t_optional<S> extends BindCodec<t.optional<S>> { }
  interface t_array<S> extends BindCodec<t.array<S>> { }
  interface t_record<S> extends BindCodec<t.record<S>> { }
  interface t_union<S> extends BindCodec<t.union<S>> { }
  interface t_intersect<S> extends BindCodec<t.intersect<S>> { }
  interface t_tuple<S> extends BindCodec<t.tuple<S>> { }
  interface t_object<S> extends BindCodec<t.object<S>> { }
}

/////////////////
///  INSTALL  ///
void bind()   ///
///  INSTALL  ///
/////////////////

export function bind() {
  Object_assign(t.never, bindCodec)
  Object_assign(t.unknown, bindCodec)
  Object_assign(t.any, bindCodec)
  Object_assign(t.void, bindCodec)
  Object_assign(t.null, bindCodec)
  Object_assign(t.undefined, bindCodec)
  Object_assign(t.boolean, bindCodec)
  Object_assign(t.symbol, bindCodec)
  Object_assign(t.integer, bindCodec)
  Object_assign(t.bigint, bindCodec)
  Object_assign(t.number, bindCodec)
  Object_assign(t.string, bindCodec)
  Object_assign(t.eq.userDefinitions, bindCodec)
  Object_assign(t.optional.userDefinitions, bindCodec)
  Object_assign(t.array.userDefinitions, bindCodec)
  Object_assign(t.record.userDefinitions, bindCodec)
  Object_assign(t.union.userDefinitions, bindCodec)
  Object_assign(t.intersect.userDefinitions, bindCodec)
  Object_assign(t.tuple.userDefinitions, bindCodec)
  Object_assign(t.object.userDefinitions, bindCodec)
}
