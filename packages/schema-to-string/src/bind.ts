import type { Param } from '@traversable/registry'

import type { SchemaOptions as Options } from '@traversable/schema'
import {
  t_never,
  t_unknown,
  t_void,
  t_any,
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
  void Object.assign(t_never, toString.toString_never);
  void Object.assign(t_unknown, toString.toString_unknown);
  void Object.assign(t_any, toString.toString_any);
  void Object.assign(t_void, toString.toString_void);
  void Object.assign(t_null, toString.toString_null);
  void Object.assign(t_undefined, toString.toString_undefined);
  void Object.assign(t_boolean, toString.toString_boolean);
  void Object.assign(t_symbol, toString.toString_symbol);
  void Object.assign(t_integer, toString.toString_integer);
  void Object.assign(t_bigint, toString.toString_bigint);
  void Object.assign(t_number, toString.toString_number);
  void Object.assign(t_string, toString.toString_string);
  void ((t_eq.def as any) = (...args: Parameters<typeof t.eq.def>) => Object.assign(def.eq(...args), toString.toString_eq(args[0])));
  void ((t_optional.def as any) = (...args: Parameters<typeof t.optional.def>) => Object.assign(def.optional(...args), toString.toString_optional(args[0])));
  void ((t_record.def as any) = (...args: Parameters<typeof t.record.def>) => Object.assign(def.record(...args), toString.toString_record(args[0])));
  void ((t_array.def as any) = (...args: Parameters<typeof t.array.def>) => Object.assign(def.array(...args), toString.toString_array(args[0])));
  void ((t_union.def as any) = (...args: Parameters<typeof t.union.def>) => Object.assign(def.union(...args), toString.toString_union(args[0])));
  void ((t_intersect.def as any) = (...args: Parameters<typeof t.intersect.def>) => Object.assign(def.intersect(...args), toString.toString_intersect(args[0])));
  void ((t_tuple.def as any) = (...args: Parameters<typeof t.tuple.def>) => Object.assign(def.tuple(...args), toString.toString_tuple(args[0])));
  void ((t_object.def as any) = (...args: Parameters<typeof t.object.def>) => Object.assign(def.object(...args), toString.toString_object(args[0])));
}
