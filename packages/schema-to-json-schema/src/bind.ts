import type { Param } from '@traversable/registry'
import type { SchemaOptions as Options } from '@traversable/schema'

import {
  t_never,
  t_unknown,
  t_void,
  t_any,
  t_null,
  t_undefined,
  t_symbol,
  t_boolean,
  t_integer,
  t_bigint,
  t_number,
  t_string,
  t_eq,
  t_optional,
  t_array,
  t_record,
  t_object,
  t_tuple,
  t_union,
  t_intersect,
  def,
  // t_of,
} from '@traversable/schema'
import * as JsonSchema from './jsonSchema.js'

export function bindJsonSchemas() {
  void ((t_never as any).jsonSchema = JsonSchema.NeverSchema.jsonSchema);
  void ((t_unknown as any).jsonSchema = JsonSchema.UnknownSchema.jsonSchema);
  void ((t_any as any).jsonSchema = JsonSchema.AnySchema.jsonSchema);
  void ((t_void as any).jsonSchema = JsonSchema.VoidSchema.jsonSchema);
  void ((t_null as any).jsonSchema = JsonSchema.NullSchema.jsonSchema);
  void ((t_undefined as any).jsonSchema = JsonSchema.UndefinedSchema.jsonSchema);
  void ((t_boolean as any).jsonSchema = Object.assign(def.boolean, JsonSchema.BooleanSchema).jsonSchema);
  void ((t_symbol as any).jsonSchema = Object.assign(def.symbol, JsonSchema.SymbolSchema).jsonSchema);
  void ((t_integer as any).jsonSchema = Object.assign(def.integer, JsonSchema.IntegerSchema).jsonSchema);
  void ((t_bigint as any).jsonSchema = Object.assign(def.bigint, JsonSchema.BigIntSchema).jsonSchema);
  void ((t_number as any).jsonSchema = Object.assign(def.number, JsonSchema.NumberSchema).jsonSchema);
  void ((t_string as any).jsonSchema = Object.assign(def.string, JsonSchema.StringSchema).jsonSchema);
  void ((t_eq.def as any) = (x: Param<typeof t_eq.def>, options?: Options) => Object.assign(def.eq(x, options), JsonSchema.EqSchema(x)));
  void ((t_optional.def as any) = (x: Param<typeof t_optional.def>) => Object.assign(def.optional(x), JsonSchema.OptionalSchema(x)));
  void ((t_record.def as any) = (x: Param<typeof t_record.def>) => Object.assign(def.record(x), JsonSchema.RecordSchema(x)));
  void ((t_array.def as any) = (x: Param<typeof t_array.def>) => Object.assign(def.array(x), JsonSchema.ArraySchema(x)));
  void ((t_union.def as any) = (xs: Parameters<typeof t_union.def>) => Object.assign(def.union(xs), JsonSchema.UnionSchema(xs)));
  void ((t_intersect.def as any) = (xs: Parameters<typeof t_intersect.def>) => Object.assign(def.intersect(xs), JsonSchema.IntersectSchema(xs)));
  void ((t_tuple.def as any) = (xs: Parameters<typeof t_tuple.def>, options?: Options) => Object.assign(def.tuple(xs, options), JsonSchema.TupleSchema(xs)));
  void ((t_object.def as any) = (xs: Param<typeof t_object.def>, options?: Options) => Object.assign(def.object(xs, options), JsonSchema.ObjectSchema(xs)));
}
