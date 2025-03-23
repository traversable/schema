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
  t_object,
  t_tuple,
  t_union,
  t_intersect,
  // t_of,
  def,
} from '@traversable/schema'

import * as toString from './toString.js'

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
  void ((t_eq.def as any) = (x: Param<typeof t_eq.def>, options?: Options) => Object.assign(def.eq(x, options), toString.toString_eq(x)));
  void ((t_optional.def as any) = (x: Param<typeof t_optional.def>) => Object.assign(def.optional(x), toString.toString_optional(x)));
  void ((t_record.def as any) = (x: Param<typeof t_record.def>) => Object.assign(def.record(x), toString.toString_record(x)));
  void ((t_array.def as any) = (x: Param<typeof t_array.def>) => Object.assign(def.array(x), toString.toString_array(x)));
  void ((t_union.def as any) = (xs: Parameters<typeof t_union.def>) => Object.assign(def.union(xs), toString.toString_union(xs)));
  void ((t_intersect.def as any) = (xs: Parameters<typeof t_intersect.def>) => Object.assign(def.intersect(xs), toString.toString_intersect(xs)));
  void ((t_tuple.def as any) = (xs: Parameters<typeof t_tuple.def>, options?: Options) => Object.assign(def.tuple(xs, options), toString.toString_tuple(xs)));
  void ((t_object.def as any) = (xs: Param<typeof t_object.def>, options?: Options) => Object.assign(def.object(xs, options), toString.toString_object(xs)));
}
