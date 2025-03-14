import type { SchemaOptions as Options } from './options.js'
import * as JsonSchema from './jsonSchema.js'
import * as toString from './toString.js'
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
type Param<T> = T extends { (arg: infer I): unknown } ? I : never

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
//   interface NeverSchema extends JsonSchema.NeverJsonSchema { }
//   interface UnknownSchema extends JsonSchema.UnknownJsonSchema { }
//   interface VoidSchema extends JsonSchema.VoidJsonSchema { }
//   interface AnySchema extends JsonSchema.AnyJsonSchema { }
//   interface NullSchema extends JsonSchema.NullJsonSchema { }
//   interface UndefinedSchema extends JsonSchema.UndefinedJsonSchema { }
//   interface SymbolSchema extends JsonSchema.SymbolJsonSchema { }
//   interface BooleanSchema extends JsonSchema.BooleanJsonSchema { }
//   interface IntegerSchema extends JsonSchema.IntegerJsonSchema { }
//   interface BigIntSchema extends JsonSchema.BigIntJsonSchema { }
//   interface NumberSchema extends JsonSchema.NumberJsonSchema { }
//   interface StringSchema extends JsonSchema.StringJsonSchema { }
//   interface EqSchema<V> extends JsonSchema.EqJsonSchema<V> { }
//   interface OptionalSchema<S> extends JsonSchema.OptionalJsonSchema<S> { }
//   interface ArraySchema<S> extends JsonSchema.ArrayJsonSchema<S> { }
//   interface RecordSchema<S> extends JsonSchema.RecordJsonSchema<S> { }
//   interface UnionSchema<S extends readonly unknown[]> extends JsonSchema.UnionJsonSchema<S> { }
//   interface IntersectSchema<S extends readonly unknown[]> extends JsonSchema.IntersectJsonSchema<S> { }
//   interface TupleSchema<S extends readonly unknown[]> extends JsonSchema.TupleJsonSchema<S> { }
//   interface ObjectSchema<S extends { [x: string]: unknown }> extends JsonSchema.ObjectJsonSchema<S> { }
// }

// declare module '@traversable/schema' {
//   interface NeverSchema extends toString.toString_never { }
//   interface UnknownSchema extends toString.toString_unknown { }
//   interface VoidSchema extends toString.toString_void { }
//   interface AnySchema extends toString.toString_any { }
//   interface NullSchema extends toString.toString_null { }
//   interface UndefinedSchema extends toString.toString_undefined { }
//   interface SymbolSchema extends toString.toString_symbol { }
//   interface BooleanSchema extends toString.toString_boolean { }
//   interface IntegerSchema extends toString.toString_integer { }
//   interface BigIntSchema extends toString.toString_bigint { }
//   interface NumberSchema extends toString.toString_number { }
//   interface StringSchema extends toString.toString_string { }
//   interface EqSchema<V> extends toString.toString_eq<V> { }
//   interface OptionalSchema<S> extends toString.toString_optional<S> { }
//   interface ArraySchema<S> extends toString.toString_array<S> { }
//   interface RecordSchema<S> extends toString.toString_record<S> { }
//   interface UnionSchema<S extends readonly unknown[]> extends toString.toString_union<S> { }
//   interface IntersectSchema<S extends readonly unknown[]> extends toString.toString_intersect<S> { }
//   interface TupleSchema<S extends readonly unknown[]> extends toString.toString_tuple<S> { }
//   interface ObjectSchema<S extends { [x: string]: unknown }> extends toString.toString_object<S> { }
// }

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

export function bindJsonSchemas() {
  void ((NeverSchema as any).jsonSchema = JsonSchema.NeverJsonSchema.jsonSchema);
  void ((UnknownSchema as any).jsonSchema = JsonSchema.UnknownJsonSchema.jsonSchema);
  void ((AnySchema as any).jsonSchema = JsonSchema.AnyJsonSchema.jsonSchema);
  void ((VoidSchema as any).jsonSchema = JsonSchema.VoidJsonSchema.jsonSchema);
  void ((NullSchema as any).jsonSchema = JsonSchema.NullJsonSchema.jsonSchema);
  void ((UndefinedSchema as any).jsonSchema = JsonSchema.UndefinedJsonSchema.jsonSchema);
  void ((BooleanSchema as any).jsonSchema = Object.assign(Def.boolean, JsonSchema.BooleanJsonSchema).jsonSchema);
  void ((SymbolSchema as any).jsonSchema = Object.assign(Def.symbol, JsonSchema.SymbolJsonSchema).jsonSchema);
  void ((IntegerSchema as any).jsonSchema = Object.assign(Def.integer, JsonSchema.IntegerJsonSchema).jsonSchema);
  void ((BigIntSchema as any).jsonSchema = Object.assign(Def.bigint, JsonSchema.BigIntJsonSchema).jsonSchema);
  void ((NumberSchema as any).jsonSchema = Object.assign(Def.number, JsonSchema.NumberJsonSchema).jsonSchema);
  void ((StringSchema as any).jsonSchema = Object.assign(Def.string, JsonSchema.StringJsonSchema).jsonSchema);
  void ((EqSchema.def as any) = (x: Param<typeof EqSchema.def>, options?: Options) => Object.assign(Def.eq(x, options), JsonSchema.EqJsonSchema(x)));
  void ((OptionalSchema.def as any) = (x: Param<typeof OptionalSchema.def>) => Object.assign(Def.optional(x), JsonSchema.OptionalJsonSchema(x)));
  void ((RecordSchema.def as any) = (x: Param<typeof RecordSchema.def>) => Object.assign(Def.record(x), JsonSchema.RecordJsonSchema(x)));
  void ((ArraySchema.def as any) = (x: Param<typeof ArraySchema.def>) => Object.assign(Def.array(x), JsonSchema.ArrayJsonSchema(x)));
  void ((UnionSchema.def as any) = (xs: Parameters<typeof UnionSchema.def>) => Object.assign(Def.union(xs), JsonSchema.UnionJsonSchema(xs)));
  void ((IntersectSchema.def as any) = (xs: Parameters<typeof IntersectSchema.def>) => Object.assign(Def.intersect(xs), JsonSchema.IntersectJsonSchema(xs)));
  void ((TupleSchema.def as any) = (xs: Parameters<typeof TupleSchema.def>, options?: Options) => Object.assign(Def.tuple(xs, options), JsonSchema.TupleJsonSchema(xs)));
  void ((ObjectSchema.def as any) = (xs: Param<typeof ObjectSchema.def>, options?: Options) => Object.assign(Def.object(xs, options), JsonSchema.ObjectJsonSchema(xs)));
}

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
