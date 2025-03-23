import type { Param, Parameters, SchemaOptions as Options } from '@traversable/registry'

import {
  t,
  NeverSchema as t_never,
  UnknownSchema as t_unknown,
  AnySchema as t_any,
  VoidSchema as t_void,
  NullSchema as t_null,
  UndefinedSchema as t_undefined,
  SymbolSchema as t_symbol,

  BooleanSchema as t_boolean,
  IntegerSchema as t_integer,
  BigIntSchema as t_bigint,
  NumberSchema as t_number,
  StringSchema as t_string,
  EqSchema as t_eq,
  OptionalSchema as t_optional,
  ArraySchema as t_array,
  RecordSchema as t_record,
  UnionSchema as t_union,
  IntersectSchema as t_intersect,
  TupleSchema as t_tuple,
  ObjectSchema as t_object,

  // t_of,
  // def,
} from '@traversable/schema'
import { pipe } from './codec.js'

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

export function bindPipes() {
  void Object.assign(t_never, pipe(t.never));
  void Object.assign(t_unknown, pipe(t.unknown));
  void Object.assign(t_any, pipe(t.any));
  void Object.assign(t_void, pipe(t.void));
  void Object.assign(t_null, pipe(t.null));
  void Object.assign(t_undefined, pipe(t.undefined));
  void Object.assign(t_boolean, pipe(t.boolean));
  void Object.assign(t_symbol, pipe(t.symbol));
  void Object.assign(t_integer, pipe(t.integer));
  void Object.assign(t_bigint, pipe(t.bigint));
  void Object.assign(t_number, pipe(t.number));
  void Object.assign(t_string, pipe(t.string));
  void ((t_eq.def as any) = (x: Param<typeof t.eq.def>, options?: Options) => pipe(def.eq(x, options)));
  void ((t_optional.def as any) = (x: Param<typeof t.optional.def>) => pipe(def.optional(x)));
  void ((t_record.def as any) = (x: Param<typeof t.record.def>) => pipe(def.record(x)));
  void ((t_array.def as any) = (x: Param<typeof t.array.def>) => pipe(def.array(x)));
  void ((t_union.def as any) = (xs: Parameters<typeof t.union.def>) => pipe(def.union(xs)));
  void ((t_intersect.def as any) = (xs: Parameters<typeof t.intersect.def>) => pipe(def.intersect(xs)));
  void ((t_tuple.def as any) = (xs: Parameters<typeof t.tuple.def>, options?: Options) => pipe(def.tuple(xs, options)));
  void ((t_object.def as any) = (xs: Param<typeof t.object.def>, options?: Options) => pipe(def.object(xs, options)));
}
