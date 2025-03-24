export * as t from './namespace'
import '@traversable/schema-to-string'
import '@traversable/schema-to-json-schema'
import '@traversable/derive-codec'
import '@traversable/derive-validators'
import type { unsafeParse } from './shared'
import { bindUnsafeParse } from './bind'

// SIDE-EFFECT
void bindUnsafeParse()

declare module '@traversable/schema' {
  interface t_never { unsafeParse: unsafeParse<t_never> }
  interface t_unknown { unsafeParse: unsafeParse<t_unknown> }
  interface t_any { unsafeParse: unsafeParse<t_any> }
  interface t_void { unsafeParse: unsafeParse<t_void> }
  interface t_null { unsafeParse: unsafeParse<t_null> }
  interface t_undefined { unsafeParse: unsafeParse<t_undefined> }
  interface t_symbol { unsafeParse: unsafeParse<t_symbol> }
  interface t_boolean { unsafeParse: unsafeParse<t_boolean> }
  interface t_integer { unsafeParse: unsafeParse<t_integer> }
  interface t_bigint { unsafeParse: unsafeParse<t_bigint> }
  interface t_number { unsafeParse: unsafeParse<t_number> }
  interface t_string { unsafeParse: unsafeParse<t_string> }
  interface t_eq<V> { unsafeParse: unsafeParse<t_eq<V>> }
  interface t_optional<S> { unsafeParse: unsafeParse<t_optional<S>> }
  interface t_array<S> { unsafeParse: unsafeParse<t_array<S>> }
  interface t_record<S> { unsafeParse: unsafeParse<t_record<S>> }
  interface t_union<S> { unsafeParse: unsafeParse<t_union<S>> }
  interface t_intersect<S> { unsafeParse: unsafeParse<t_intersect<S>> }
  interface t_tuple<S> { unsafeParse: unsafeParse<t_tuple<S>> }
  interface t_object<S> { unsafeParse: unsafeParse<t_object<S>> }
  interface t_enum<V> { unsafeParse: unsafeParse<t_enum<V>> }
}
