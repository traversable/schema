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
  t_union,
  t_intersect,
  t_tuple,
  t_object,
  t,
} from '@traversable/schema'
import * as JsonSchema from './jsonSchema.js'

const Object_assign = globalThis.Object.assign

const def = {
  never: t.never.def,
  any: t.any.def,
  unknown: t.unknown.def,
  void: t.void.def,
  null: t.null.def,
  undefined: t.undefined.def,
  symbol: t.symbol.def,
  boolean: t.boolean.def,
  integer: t.integer.def,
  bigint: t.bigint.def,
  number: t.number.def,
  string: t.string.def,
  eq: t.eq.def,
  optional: t.optional.def,
  array: t.array.def,
  record: t.record.def,
  union: t.union.def,
  intersect: t.intersect.def,
  tuple: t.tuple.def,
  object: t.object.def,
  of: t.of.def,
}

export function bindJsonSchemas() {
  void ((t_never as any).toJsonSchema = JsonSchema.NeverSchema.toJsonSchema);
  void ((t_unknown as any).toJsonSchema = JsonSchema.UnknownSchema.toJsonSchema);
  void ((t_any as any).toJsonSchema = JsonSchema.AnySchema.toJsonSchema);
  void ((t_void as any).toJsonSchema = JsonSchema.VoidSchema.toJsonSchema);
  void ((t_null as any).toJsonSchema = JsonSchema.NullSchema.toJsonSchema);
  void ((t_undefined as any).toJsonSchema = JsonSchema.UndefinedSchema.toJsonSchema);
  void ((t_boolean as any).toJsonSchema = Object_assign(def.boolean, JsonSchema.BooleanSchema).toJsonSchema);
  void ((t_symbol as any).toJsonSchema = Object_assign(def.symbol, JsonSchema.SymbolSchema).toJsonSchema);
  void ((t_integer as any).toJsonSchema = Object_assign(def.integer, JsonSchema.IntegerSchema).toJsonSchema);
  void ((t_bigint as any).toJsonSchema = Object_assign(def.bigint, JsonSchema.BigIntSchema).toJsonSchema);
  void ((t_number as any).toJsonSchema = Object_assign(def.number, JsonSchema.NumberSchema).toJsonSchema);
  void ((t_string as any).toJsonSchema = Object_assign(def.string, JsonSchema.StringSchema).toJsonSchema);
  void ((t_eq.def as any) = (...args: Parameters<typeof t.eq.def>) => Object_assign(def.eq(...args), JsonSchema.EqSchema(args[0])));
  void ((t_optional.def as any) = (...args: Parameters<typeof t.optional.def>) => Object_assign(def.optional(...args), JsonSchema.OptionalSchema(args[0])));
  void ((t_record.def as any) = (...args: Parameters<typeof t.record.def>) => Object_assign(def.record(...args), JsonSchema.RecordSchema(args[0])));
  void ((t_array.def as any) = (...args: Parameters<typeof t.array.def>) => Object_assign(def.array(...args), JsonSchema.ArraySchema(args[0])));
  void ((t_union.def as any) = (...args: Parameters<typeof t.union.def>) => Object_assign(def.union(...args), JsonSchema.UnionSchema(args[0])));
  void ((t_intersect.def as any) = (...args: Parameters<typeof t.intersect.def>) => Object_assign(def.intersect(...args), JsonSchema.IntersectSchema(args[0])));
  void ((t_tuple.def as any) = (...args: Parameters<typeof t.tuple.def>) => Object_assign(def.tuple(...args), JsonSchema.TupleSchema(args[0])));
  void ((t_object.def as any) = (...args: Parameters<typeof t.object.def>) => Object_assign(def.object(...args), JsonSchema.ObjectSchema(args[0])));
}
