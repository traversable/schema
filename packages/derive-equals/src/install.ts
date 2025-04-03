import { t } from '@traversable/schema'

import type { equals } from './bind.js'
import { bind } from './bind.js'
// SIDE-EFFECT
void bind()

declare module '@traversable/schema' {
  interface t_LowerBound<T = unknown> extends equals<t_LowerBound<T>> { }
  interface t_never extends equals<t.never> { }
  interface t_unknown extends equals<t.unknown> { }
  interface t_void extends equals<t.void> { }
  interface t_any extends equals<t.any> { }
  interface t_null extends equals<t.null> { }
  interface t_undefined extends equals<t.undefined> { }
  interface t_symbol extends equals<t.symbol> { }
  interface t_boolean extends equals<t.boolean> { }
  interface t_integer extends equals<t.integer> { }
  interface t_bigint extends equals<t.bigint> { }
  interface t_number extends equals<t.number> { }
  interface t_string extends equals<t.string> { }
  interface t_eq<V> extends equals<t.eq<V>> { }
  interface t_optional<S> extends equals<t.optional<S>> { }
  interface t_array<S> extends equals<t.array<S>> { }
  interface t_record<S> extends equals<t.record<S>> { }
  interface t_union<S> extends equals<t.union<S>> { }
  interface t_intersect<S> extends equals<t.intersect<S>> { }
  interface t_tuple<S> extends equals<t.tuple<S>> { }
  interface t_object<S> extends equals<t.object<S>> { }
}
