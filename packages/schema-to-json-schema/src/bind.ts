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
import * as JsonSchema from './jsonSchema.js'

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
