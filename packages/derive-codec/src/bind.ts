import type { Param, Parameters, SchemaOptions as Options } from '@traversable/registry'

import {
  t,
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
import { pipe } from './codec.js'

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

export function bindPipes() {
  void Object.assign(NeverSchema, { pipe: pipe(NeverSchema).pipe });
  void Object.assign(UnknownSchema, pipe(t.unknown));
  void Object.assign(AnySchema, pipe(t.any));
  void Object.assign(VoidSchema, pipe(t.void));
  void Object.assign(NullSchema, pipe(t.null));
  void Object.assign(UndefinedSchema, pipe(t.undefined));
  void Object.assign(BooleanSchema, pipe(t.boolean));
  void Object.assign(SymbolSchema, pipe(t.symbol));
  void Object.assign(IntegerSchema, pipe(t.integer));
  void Object.assign(BigIntSchema, pipe(t.bigint));
  void Object.assign(NumberSchema, pipe(t.number));
  void Object.assign(StringSchema, pipe(StringSchema));
  void ((EqSchema.def as any) = (x: Param<typeof EqSchema.def>, options?: Options) => pipe(Def.eq(x, options)));
  void ((OptionalSchema.def as any) = (x: Param<typeof OptionalSchema.def>) => pipe(Def.optional(x)));
  void ((RecordSchema.def as any) = (x: Param<typeof RecordSchema.def>) => pipe(Def.record(x)));
  void ((ArraySchema.def as any) = (x: Param<typeof ArraySchema.def>) => pipe(Def.array(x)));
  void ((UnionSchema.def as any) = (xs: Parameters<typeof UnionSchema.def>) => pipe(Def.union(xs)));
  void ((IntersectSchema.def as any) = (xs: Parameters<typeof IntersectSchema.def>) => pipe(Def.intersect(xs)));
  void ((TupleSchema.def as any) = (xs: Parameters<typeof TupleSchema.def>, options?: Options) => pipe(Def.tuple(xs, options)));
  void ((ObjectSchema.def as any) = (xs: Param<typeof ObjectSchema.def>, options?: Options) => pipe(t.object.def(xs, options)));
}
