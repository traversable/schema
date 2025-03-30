import type { t } from '@traversable/schema'
import type { pipe } from './codec.js'

import { bind } from './bind.js'
// SIDE-EFFECT
void bind()

declare module '@traversable/schema' {
  interface t_LowerBound extends pipe<t_LowerBound> { }
  interface t_never extends pipe<t.never> { }
  interface t_unknown extends pipe<t.unknown> { }
  interface t_void extends pipe<t.void> { }
  interface t_any extends pipe<t.any> { }
  interface t_null extends pipe<t.null> { }
  interface t_undefined extends pipe<t.undefined> { }
  interface t_symbol extends pipe<t.symbol> { }
  interface t_boolean extends pipe<t.boolean> { }
  interface t_integer extends pipe<t.integer> { }
  interface t_bigint extends pipe<t.bigint> { }
  interface t_number extends pipe<t.number> { }
  interface t_string extends pipe<t.string> { }
  interface t_eq<V> extends pipe<t.eq<V>> { }
  interface t_optional<S> extends pipe<t.optional<S>> { }
  interface t_array<S> extends pipe<t.array<S>> { }
  interface t_record<S> extends pipe<t.record<S>> { }
  interface t_union<S> extends pipe<t.union<S>> { }
  interface t_intersect<S> extends pipe<t.intersect<S>> { }
  interface t_tuple<S> extends pipe<t.tuple<S>> { }
  interface t_object<S> extends pipe<t.object<S>> { }
}
