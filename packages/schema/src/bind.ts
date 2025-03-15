import type { Param } from './registry.js'

import type { SchemaOptions as Options } from './options.js'
import * as core from './core.js'
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
//   interface NeverSchema extends pipe<core.never> { }
//   interface UnknownSchema extends pipe<core.unknown> { }
//   interface VoidSchema extends pipe<core.void> { }
//   interface AnySchema extends pipe<core.any> { }
//   interface NullSchema extends pipe<core.null> { }
//   interface UndefinedSchema extends pipe<core.undefined> { }
//   interface SymbolSchema extends pipe<core.symbol> { }
//   interface BooleanSchema extends pipe<core.boolean> { }
//   interface IntegerSchema extends pipe<core.integer> { }
//   interface BigIntSchema extends pipe<core.bigint> { }
//   interface NumberSchema extends pipe<core.number> { }
//   interface StringSchema extends pipe<core.string> { }
//   interface EqSchema<V> extends pipe<core.eq.def<V>> { }
//   interface OptionalSchema<S> extends pipe<core.optional.def<S>> { }
//   interface ArraySchema<S> extends pipe<core.array.def<S>> { }
//   interface RecordSchema<S> extends pipe<core.record.def<S>> { }
//   interface UnionSchema<S extends readonly unknown[]> extends pipe<core.union.def<S>> { }
//   interface IntersectSchema<S extends readonly unknown[]> extends pipe<core.intersect.def<S>> { }
//   interface TupleSchema<S extends readonly unknown[]> extends pipe<core.tuple.def<S>> { }
//   interface ObjectSchema<S extends { [x: string]: unknown }> extends pipe<core.object.def<S>> { }
// }

export function bindPipes() {
  void Object.assign(NeverSchema, { pipe: pipe(NeverSchema).pipe });
  void Object.assign(UnknownSchema, pipe(core.unknown));
  void Object.assign(AnySchema, pipe(core.any));
  void Object.assign(VoidSchema, pipe(core.void));
  void Object.assign(NullSchema, pipe(core.null));
  void Object.assign(UndefinedSchema, pipe(core.undefined));
  void Object.assign(BooleanSchema, pipe(core.boolean));
  void Object.assign(SymbolSchema, pipe(core.symbol));
  void Object.assign(IntegerSchema, pipe(core.integer));
  void Object.assign(BigIntSchema, pipe(core.bigint));
  void Object.assign(NumberSchema, pipe(core.number));
  void Object.assign(StringSchema, pipe(StringSchema));
  void ((EqSchema.def as any) = (x: Param<typeof EqSchema.def>, options?: Options) => pipe(Def.eq(x, options)));
  void ((OptionalSchema.def as any) = (x: Param<typeof OptionalSchema.def>) => pipe(Def.optional(x)));
  void ((RecordSchema.def as any) = (x: Param<typeof RecordSchema.def>) => pipe(Def.record(x)));
  void ((ArraySchema.def as any) = (x: Param<typeof ArraySchema.def>) => pipe(Def.array(x)));
  void ((UnionSchema.def as any) = (xs: Parameters<typeof UnionSchema.def>) => pipe(Def.union(xs)));
  void ((IntersectSchema.def as any) = (xs: Parameters<typeof IntersectSchema.def>) => pipe(Def.intersect(xs)));
  void ((TupleSchema.def as any) = (xs: Parameters<typeof TupleSchema.def>, options?: Options) => pipe(Def.tuple(xs, options)));
  void ((ObjectSchema.def as any) = (xs: Param<typeof ObjectSchema.def>, options?: Options) => pipe(core.object.def(xs, options)));
}
