import type { Param } from '@traversable/registry'
import type { SchemaOptions as Options } from '@traversable/schema'

import {
  NeverSchema,
  UnknownSchema,
  VoidSchema,
  AnySchema,
  NullSchema,
  UndefinedSchema,
  SymbolSchema,
  BooleanSchema,
  IntegerSchema,
  BigIntSchema,
  NumberSchema,
  StringSchema,
  EqSchema,
  OptionalSchema,
  ArraySchema,
  RecordSchema,
  UnionSchema,
  IntersectSchema,
  TupleSchema,
  ObjectSchema,
  InlineSchema,
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
  void ((NeverSchema as any).toJsonSchema = JsonSchema.NeverSchema.toJsonSchema);
  void ((UnknownSchema as any).toJsonSchema = JsonSchema.UnknownSchema.toJsonSchema);
  void ((AnySchema as any).toJsonSchema = JsonSchema.AnySchema.toJsonSchema);
  void ((VoidSchema as any).toJsonSchema = JsonSchema.VoidSchema.toJsonSchema);
  void ((NullSchema as any).toJsonSchema = JsonSchema.NullSchema.toJsonSchema);
  void ((UndefinedSchema as any).toJsonSchema = JsonSchema.UndefinedSchema.toJsonSchema);
  void ((BooleanSchema as any).toJsonSchema = Object_assign(def.boolean, JsonSchema.BooleanSchema).toJsonSchema);
  void ((SymbolSchema as any).toJsonSchema = Object_assign(def.symbol, JsonSchema.SymbolSchema).toJsonSchema);
  void ((IntegerSchema as any).toJsonSchema = Object_assign(def.integer, JsonSchema.IntegerSchema).toJsonSchema);
  void ((BigIntSchema as any).toJsonSchema = Object_assign(def.bigint, JsonSchema.BigIntSchema).toJsonSchema);
  void ((NumberSchema as any).toJsonSchema = Object_assign(def.number, JsonSchema.NumberSchema).toJsonSchema);
  void ((StringSchema as any).toJsonSchema = Object_assign(def.string, JsonSchema.StringSchema).toJsonSchema);
  void ((EqSchema.def as any) = (x: Param<typeof EqSchema.def>, options?: Options) => Object_assign(def.eq(x, options), JsonSchema.EqSchema(x)));
  void ((OptionalSchema.def as any) = (x: Param<typeof OptionalSchema.def>) => Object_assign(def.optional(x), JsonSchema.OptionalSchema(x)));
  void ((RecordSchema.def as any) = (x: Param<typeof RecordSchema.def>) => Object_assign(def.record(x), JsonSchema.RecordSchema(x)));
  void ((ArraySchema.def as any) = (x: Param<typeof ArraySchema.def>) => Object_assign(def.array(x), JsonSchema.ArraySchema(x)));
  void ((UnionSchema.def as any) = (xs: Parameters<typeof UnionSchema.def>) => Object_assign(def.union(xs), JsonSchema.UnionSchema(xs)));
  void ((IntersectSchema.def as any) = (xs: Parameters<typeof IntersectSchema.def>) => Object_assign(def.intersect(xs), JsonSchema.IntersectSchema(xs)));
  void ((TupleSchema.def as any) = (xs: Parameters<typeof TupleSchema.def>, options?: Options) => Object_assign(def.tuple(xs, options), JsonSchema.TupleSchema(xs)));
  void ((ObjectSchema.def as any) = (xs: Param<typeof ObjectSchema.def>, options?: Options) => Object_assign(def.object(xs, options), JsonSchema.ObjectSchema(xs)));
}
