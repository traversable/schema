import { bindJsonSchemas } from './bind.js'
import * as JsonSchema from './jsonSchema.js'
type JsonSchema<T = never> = import('./jsonSchema.js').JsonSchema<T>

export { JsonSchema }
export { toJsonSchema, fromJsonSchema } from './recursive.js'
export { VERSION } from './version.js'

// SIDE-EFFECT
void bindJsonSchemas()

declare module '@traversable/schema' {
  interface t_LowerBound extends JsonSchema.LowerBound { }
  interface t_never extends JsonSchema.NeverSchema { }
  interface t_unknown extends JsonSchema.UnknownSchema { }
  interface t_void extends JsonSchema.VoidSchema { }
  interface t_any extends JsonSchema.AnySchema { }
  interface t_null extends JsonSchema.NullSchema { }
  interface t_undefined extends JsonSchema.UndefinedSchema { }
  interface t_symbol extends JsonSchema.SymbolSchema { }
  interface t_boolean extends JsonSchema.BooleanSchema { }
  interface t_integer extends JsonSchema.IntegerSchema { }
  interface t_bigint extends JsonSchema.BigIntSchema { }
  interface t_number extends JsonSchema.NumberSchema { }
  interface t_string extends JsonSchema.StringSchema { }
  interface t_eq<V> extends JsonSchema.EqSchema<V> { }
  interface t_optional<S> extends JsonSchema.OptionalSchema<S> { }
  interface t_array<S> extends JsonSchema.ArraySchema<S> { }
  interface t_record<S> extends JsonSchema.RecordSchema<S> { }
  interface t_union<S> extends JsonSchema.UnionSchema<S> { }
  interface t_intersect<S> extends JsonSchema.IntersectSchema<S> { }
  interface t_tuple<S> extends JsonSchema.TupleSchema<S> { }
  interface t_object<S> extends JsonSchema.ObjectSchema<S> { }
  interface t_of<S> extends JsonSchema.InlineSchema<S> { }
}
