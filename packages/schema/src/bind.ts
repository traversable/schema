import type { Param } from './registry.js'

import type { SchemaOptions as Options } from './options.js'
import * as t from './schema.js'
import { pipe } from './codec.js'
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
} from './extensions.js'

type Parameters<T> = T extends { (...args: infer I): unknown } ? I : never

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

// declare module '@traversable/schema' {
//   interface NeverSchema extends pipe<t.never> { }
//   interface UnknownSchema extends pipe<t.unknown> { }
//   interface VoidSchema extends pipe<t.void> { }
//   interface AnySchema extends pipe<t.any> { }
//   interface NullSchema extends pipe<t.null> { }
//   interface UndefinedSchema extends pipe<t.undefined> { }
//   interface SymbolSchema extends pipe<t.symbol> { }
//   interface BooleanSchema extends pipe<t.boolean> { }
//   interface IntegerSchema extends pipe<t.integer> { }
//   interface BigIntSchema extends pipe<t.bigint> { }
//   interface NumberSchema extends pipe<t.number> { }
//   interface StringSchema extends pipe<t.string> { }
//   interface EqSchema<V> extends pipe<t.eq.def<V>> { }
//   interface OptionalSchema<S> extends pipe<t.optional.def<S>> { }
//   interface ArraySchema<S> extends pipe<t.array.def<S>> { }
//   interface RecordSchema<S> extends pipe<t.record.def<S>> { }
//   interface UnionSchema<S extends readonly unknown[]> extends pipe<t.union.def<S>> { }
//   interface IntersectSchema<S extends readonly unknown[]> extends pipe<t.intersect.def<S>> { }
//   interface TupleSchema<S extends readonly unknown[]> extends pipe<t.tuple.def<S>> { }
//   interface ObjectSchema<S extends { [x: string]: unknown }> extends pipe<t.object.def<S>> { }
// }

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
