import type { Param, Parameters, SchemaOptions as Options } from '@traversable/registry'

import {
  t,
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
  // t_of,
  def,
} from '@traversable/schema'
import { pipe } from './codec.js'

export function bindPipes() {
  void Object.assign(t_never, { pipe: pipe(t.never).pipe });
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
