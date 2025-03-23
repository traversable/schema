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
  interface NeverSchema extends JsonSchema.NeverSchema { }
  interface UnknownSchema extends JsonSchema.UnknownSchema { }
  interface VoidSchema extends JsonSchema.VoidSchema { }
  interface AnySchema extends JsonSchema.AnySchema { }
  interface NullSchema extends JsonSchema.NullSchema { }
  interface UndefinedSchema extends JsonSchema.UndefinedSchema { }
  interface SymbolSchema extends JsonSchema.SymbolSchema { }
  interface BooleanSchema extends JsonSchema.BooleanSchema { }
  interface IntegerSchema extends JsonSchema.IntegerSchema { }
  interface BigIntSchema extends JsonSchema.BigIntSchema { }
  interface NumberSchema extends JsonSchema.NumberSchema { }
  interface StringSchema extends JsonSchema.StringSchema { }
  interface EqSchema<V> extends JsonSchema.EqSchema<V> { }
  interface OptionalSchema<S> extends JsonSchema.OptionalSchema<S> { }
  interface ArraySchema<S> extends JsonSchema.ArraySchema<S> { }
  interface RecordSchema<S> extends JsonSchema.RecordSchema<S> { }
  interface UnionSchema<S> extends JsonSchema.UnionSchema<S> { }
  interface IntersectSchema<S> extends JsonSchema.IntersectSchema<S> { }
  interface TupleSchema<S> extends JsonSchema.TupleSchema<S> { }
  interface ObjectSchema<S> extends JsonSchema.ObjectSchema<S> { }
  interface InlineSchema<S> extends JsonSchema.InlineSchema<S> { }
}
