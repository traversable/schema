import * as toString from './toString.js'
import { bindToStrings } from './bind.js'

export * as toString from './toString.js'
export { VERSION } from './version.js'

// SIDE-EFFECT
void bindToStrings()

declare module '@traversable/schema' {
  interface t_never extends toString.toString_never { }
  interface t_unknown extends toString.toString_unknown { }
  interface t_void extends toString.toString_void { }
  interface t_any extends toString.toString_any { }
  interface t_null extends toString.toString_null { }
  interface t_undefined extends toString.toString_undefined { }
  interface t_symbol extends toString.toString_symbol { }
  interface t_boolean extends toString.toString_boolean { }
  interface t_integer extends toString.toString_integer { }
  interface t_bigint extends toString.toString_bigint { }
  interface t_number extends toString.toString_number { }
  interface t_string extends toString.toString_string { }
  interface t_eq<V> extends toString.toString_eq<V> { }
  interface t_optional<S> extends toString.toString_optional<S> { }
  interface t_array<S> extends toString.toString_array<S> { }
  interface t_record<S> extends toString.toString_record<S> { }
  interface t_union<S> extends toString.toString_union<S> { }
  interface t_intersect<S> extends toString.toString_intersect<S> { }
  interface t_tuple<S> extends toString.toString_tuple<S> { }
  interface t_object<S> extends toString.toString_object<S> { }
}
