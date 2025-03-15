import * as toString from './toString.js'
import { bindToStrings } from './bind.js'

export * as toString from './toString.js'
export { VERSION } from './version.js'

// SIDE-EFFECT
void bindToStrings()

declare module '@traversable/schema' {
  interface NeverSchema extends toString.toString_never { }
  interface UnknownSchema extends toString.toString_unknown { }
  interface VoidSchema extends toString.toString_void { }
  interface AnySchema extends toString.toString_any { }
  interface NullSchema extends toString.toString_null { }
  interface UndefinedSchema extends toString.toString_undefined { }
  interface SymbolSchema extends toString.toString_symbol { }
  interface BooleanSchema extends toString.toString_boolean { }
  interface IntegerSchema extends toString.toString_integer { }
  interface BigIntSchema extends toString.toString_bigint { }
  interface NumberSchema extends toString.toString_number { }
  interface StringSchema extends toString.toString_string { }
  interface EqSchema<V> extends toString.toString_eq<V> { }
  interface OptionalSchema<S> extends toString.toString_optional<S> { }
  interface ArraySchema<S> extends toString.toString_array<S> { }
  interface RecordSchema<S> extends toString.toString_record<S> { }
  interface UnionSchema<S extends readonly unknown[]> extends toString.toString_union<S> { }
  interface IntersectSchema<S extends readonly unknown[]> extends toString.toString_intersect<S> { }
  interface TupleSchema<S extends readonly unknown[]> extends toString.toString_tuple<S> { }
  interface ObjectSchema<S extends { [x: string]: unknown }> extends toString.toString_object<S> { }
}
