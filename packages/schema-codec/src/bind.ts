import type { Parameters } from '@traversable/registry'

import {
  t,
  t_never,
  t_unknown,
  t_any,
  t_void,
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
  // t_of,
  // def,
} from '@traversable/schema'
import { pipe } from './codec.js'

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

export function bind() {
  void Object_assign(t_never, pipe(t.never));
  void Object_assign(t_unknown, pipe(t.unknown));
  void Object_assign(t_any, pipe(t.any));
  void Object_assign(t_void, pipe(t.void));
  void Object_assign(t_null, pipe(t.null));
  void Object_assign(t_undefined, pipe(t.undefined));
  void Object_assign(t_boolean, pipe(t.boolean));
  void Object_assign(t_symbol, pipe(t.symbol));
  void Object_assign(t_integer, pipe(t.integer));
  void Object_assign(t_bigint, pipe(t.bigint));
  void Object_assign(t_number, pipe(t.number));
  void Object_assign(t_string, pipe(t.string));
  void ((t_eq.def as any) = (...args: Parameters<typeof t.eq.def>) => pipe(def.eq(...args)));
  void ((t_optional.def as any) = (...args: Parameters<typeof t.optional.def>) => pipe(def.optional(...args)));
  void ((t_record.def as any) = (...args: Parameters<typeof t.record.def>) => pipe(def.record(...args)));
  void ((t_array.def as any) = (...args: Parameters<typeof t.array.def>) => pipe(def.array(...args)));
  void ((t_union.def as any) = (...args: Parameters<typeof t.union.def>) => pipe(def.union(...args)));
  void ((t_intersect.def as any) = (...args: Parameters<typeof t.intersect.def>) => pipe(def.intersect(...args)));
  void ((t_tuple.def as any) = (...args: Parameters<typeof t.tuple.def>) => pipe(def.tuple(...args)));
  void ((t_object.def as any) = (...args: Parameters<typeof t.object.def>) => pipe(def.object(...args)));
}
