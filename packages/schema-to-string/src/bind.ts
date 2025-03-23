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
  t,
} from '@traversable/schema'

import * as toString from './toString.js'

const def = {
  never: t.never.def,
  unknown: t.unknown.def,
  void: t.void.def,
  any: t.any.def,
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
  object: t.object.def,
  tuple: t.tuple.def,
};

export function bindToStrings() {
  void Object.assign(NeverSchema, toString.toString_never);
  void Object.assign(UnknownSchema, toString.toString_unknown);
  void Object.assign(AnySchema, toString.toString_any);
  void Object.assign(VoidSchema, toString.toString_void);
  void Object.assign(NullSchema, toString.toString_null);
  void Object.assign(UndefinedSchema, toString.toString_undefined);
  void Object.assign(BooleanSchema, toString.toString_boolean);
  void Object.assign(SymbolSchema, toString.toString_symbol);
  void Object.assign(IntegerSchema, toString.toString_integer);
  void Object.assign(BigIntSchema, toString.toString_bigint);
  void Object.assign(NumberSchema, toString.toString_number);
  void Object.assign(StringSchema, toString.toString_string);
  void ((EqSchema.def as any) = (x: Param<typeof EqSchema.def>, options?: Options) => Object.assign(def.eq(x, options), toString.toString_eq(x)));
  void ((OptionalSchema.def as any) = (x: Param<typeof OptionalSchema.def>) => Object.assign(def.optional(x), toString.toString_optional(x)));
  void ((RecordSchema.def as any) = (x: Param<typeof RecordSchema.def>) => Object.assign(def.record(x), toString.toString_record(x)));
  void ((ArraySchema.def as any) = (x: Param<typeof ArraySchema.def>) => Object.assign(def.array(x), toString.toString_array(x)));
  void ((UnionSchema.def as any) = (xs: Parameters<typeof UnionSchema.def>) => Object.assign(def.union(xs), toString.toString_union(xs)));
  void ((IntersectSchema.def as any) = (xs: Parameters<typeof IntersectSchema.def>) => Object.assign(def.intersect(xs), toString.toString_intersect(xs)));
  void ((TupleSchema.def as any) = (xs: Parameters<typeof TupleSchema.def>, options?: Options) => Object.assign(def.tuple(xs, options), toString.toString_tuple(xs)));
  void ((ObjectSchema.def as any) = (xs: Param<typeof ObjectSchema.def>, options?: Options) => Object.assign(def.object(xs, options), toString.toString_object(xs)));
}
