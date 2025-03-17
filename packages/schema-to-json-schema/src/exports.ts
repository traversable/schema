import { bindJsonSchemas } from './bind.js'
import * as JsonSchema from './jsonSchema.js'
type JsonSchema<T = never> = import('./jsonSchema.js').JsonSchema<T>

export { JsonSchema }
export { toJsonSchema, fromJsonSchema } from './recursive.js'
export { VERSION } from './version.js'

// SIDE-EFFECT
void bindJsonSchemas()

declare module '@traversable/schema' {
  interface Lower extends JsonSchema.LowerBound { }
  interface NeverSchema extends JsonSchema.NeverJsonSchema { }
  interface UnknownSchema extends JsonSchema.UnknownJsonSchema { }
  interface VoidSchema extends JsonSchema.VoidJsonSchema { }
  interface AnySchema extends JsonSchema.AnyJsonSchema { }
  interface NullSchema extends JsonSchema.NullJsonSchema { }
  interface UndefinedSchema extends JsonSchema.UndefinedJsonSchema { }
  interface SymbolSchema extends JsonSchema.SymbolJsonSchema { }
  interface BooleanSchema extends JsonSchema.BooleanJsonSchema { }
  interface IntegerSchema extends JsonSchema.IntegerJsonSchema { }
  interface BigIntSchema extends JsonSchema.BigIntJsonSchema { }
  interface NumberSchema extends JsonSchema.NumberJsonSchema { }
  interface StringSchema extends JsonSchema.StringJsonSchema { }
  interface EqSchema<V> extends JsonSchema.EqJsonSchema<V> { }
  interface OptionalSchema<S> extends JsonSchema.OptionalJsonSchema<S> { }
  interface ArraySchema<S> extends JsonSchema.ArrayJsonSchema<S> { }
  interface RecordSchema<S> extends JsonSchema.RecordJsonSchema<S> { }
  interface UnionSchema<S extends readonly unknown[]> extends JsonSchema.UnionJsonSchema<S> { }
  interface IntersectSchema<S extends readonly unknown[]> extends JsonSchema.IntersectJsonSchema<S> { }
  interface TupleSchema<S extends readonly unknown[]> extends JsonSchema.TupleJsonSchema<S> { }
  interface ObjectSchema<S extends { [x: string]: unknown }> extends JsonSchema.ObjectJsonSchema<S> { }
  interface InlineSchema<T> extends JsonSchema.InlineJsonSchema<T> { }
}
