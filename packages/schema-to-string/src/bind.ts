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
} from '@traversable/schema'

import * as toString from './toString.js'

const Def = {
  never: NeverSchema,
  unknown: UnknownSchema,
  void: VoidSchema,
  any: AnySchema,
  null: NullSchema,
  undefined: UndefinedSchema,
  symbol: SymbolSchema,
  boolean: BooleanSchema,
  integer: IntegerSchema,
  bigint: BigIntSchema,
  number: NumberSchema,
  string: StringSchema,
  eq: EqSchema.def,
  optional: OptionalSchema.def,
  array: ArraySchema.def,
  record: RecordSchema.def,
  union: UnionSchema.def,
  intersect: IntersectSchema.def,
  object: ObjectSchema.def,
  tuple: TupleSchema.def,
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
  void ((EqSchema.def as any) = (x: Param<typeof EqSchema.def>, options?: Options) => Object.assign(Def.eq(x, options), toString.toString_eq(x)));
  void ((OptionalSchema.def as any) = (x: Param<typeof OptionalSchema.def>) => Object.assign(Def.optional(x), toString.toString_optional(x)));
  void ((RecordSchema.def as any) = (x: Param<typeof RecordSchema.def>) => Object.assign(Def.record(x), toString.toString_record(x)));
  void ((ArraySchema.def as any) = (x: Param<typeof ArraySchema.def>) => Object.assign(Def.array(x), toString.toString_array(x)));
  void ((UnionSchema.def as any) = (xs: Parameters<typeof UnionSchema.def>) => Object.assign(Def.union(xs), toString.toString_union(xs)));
  void ((IntersectSchema.def as any) = (xs: Parameters<typeof IntersectSchema.def>) => Object.assign(Def.intersect(xs), toString.toString_intersect(xs)));
  void ((TupleSchema.def as any) = (xs: Parameters<typeof TupleSchema.def>, options?: Options) => Object.assign(Def.tuple(xs, options), toString.toString_tuple(xs)));
  void ((ObjectSchema.def as any) = (xs: Param<typeof ObjectSchema.def>, options?: Options) => Object.assign(Def.object(xs, options), toString.toString_object(xs)));
}
