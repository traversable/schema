import type { Param, Parameters, SchemaOptions as Options } from '@traversable/registry'

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
  t_enum,
  // t_of,
  // def,
} from '@traversable/schema'
import { unsafeParse } from './shared'

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
  enum: t.enum.def,
  of: t.of.def,
}

export function bindUnsafeParse() {
  void unsafeParse(t_never)
  void unsafeParse(t_unknown)
  void unsafeParse(t_any)
  void unsafeParse(t_void)
  void unsafeParse(t_null)
  void unsafeParse(t_undefined)
  void unsafeParse(t_boolean)
  void unsafeParse(t_symbol)
  void unsafeParse(t_integer)
  void unsafeParse(t_bigint)
  void unsafeParse(t_number)
  void unsafeParse(t_string)
  void ((t_eq.def as any) = (...args: Parameters<typeof t.eq.def>) => unsafeParse(def.eq(...args)));
  void ((t_optional.def as any) = (...args: Parameters<typeof t.optional.def>) => unsafeParse(def.optional(...args)));
  void ((t_record.def as any) = (...args: Parameters<typeof t.record.def>) => unsafeParse(def.record(...args)));
  void ((t_array.def as any) = (...args: Parameters<typeof t.array.def>) => unsafeParse(def.array(...args)));
  void ((t_enum.def as any) = (...args: Parameters<typeof t.enum.def>) => unsafeParse(def.enum(...args)));
  void ((t_union.def as any) = (...args: Parameters<typeof t.union.def>) => unsafeParse(def.union(...args)));
  void ((t_intersect.def as any) = (...args: Parameters<typeof t.intersect.def>) => unsafeParse(def.intersect(...args)));
  void ((t_tuple.def as any) = (...args: Parameters<typeof t.tuple.def>) => unsafeParse(def.tuple(...args)));
  void ((t_object.def as any) = (...args: Parameters<typeof t.object.def>) => unsafeParse(def.object(...args)));
}
