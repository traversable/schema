import { Equal, fn, has } from '@traversable/registry'
import * as Eq from './equals.js'
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
} from '@traversable/schema'

/** @internal */
const hasEquals
  : <T>(u: unknown) => u is { equals: Equal<T> }
  = has('equals', (u): u is Equal<unknown> => typeof u === 'function' && u.length === 2)

/** @internal */
const getEquals
  : <T>(u: unknown) => Equal<T>
  = (u) => hasEquals(u) ? u.equals : Equal.SameValue

export const array
  : <S>(schema: S) => Equal<readonly S['_type' & keyof S][]>
  = fn.flow(
    getEquals,
    Eq.array,
  )

export const record
  : <S>(schema: S) => Equal<globalThis.Record<string, S['_type' & keyof S]>>
  = fn.flow(
    getEquals,
    Eq.record,
  )

export const object
  : <S extends { [x: string]: unknown }>(schemas: S) => Equal<{ [K in keyof S]: S[K]['_type' & keyof S[K]] }>
  = fn.flow(
    fn.map(getEquals),
    Eq.object,
  )

export const tuple
  : <S extends readonly unknown[]>(schemas: S) => Equal<{ [I in keyof S]: S[I]['_type' & keyof S[I]] }>
  = fn.flow(
    fn.map(getEquals),
    Eq.tuple,
  )

export const union
  : <S extends readonly unknown[]>(schemas: S) => Equal<S[number]['_type' & keyof S[number]]>
  = fn.flow(
    fn.map(getEquals),
    Eq.union,
  )

export const intersect
  : <S>(schemas: readonly S[]) => Equal<S['_type' & keyof S]>
  = fn.flow(
    fn.map(getEquals),
    Eq.intersect,
  )

export const optional
  : <S>(schema: S) => Equal<S['_type' & keyof S]>
  = fn.flow(
    getEquals,
    Eq.optional,
  )

/** @internal */
const Object_assign = globalThis.Object.assign

/** @internal */
const bindNullaryEquals = <S extends {}>(x: S, equals: Equal<S['_type' & keyof S]> = Equal.SameValue) => Object_assign(x, { equals })

/** @internal */
const bindUnaryEquals = <S extends { def: unknown }>(x: S, f: (x: any) => Equal<never>) => Object_assign(x, { equals: f(x.def) })

/** @internal */
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

export interface equals<S> {
  equals: Equal<S['_type' & keyof S]>
}

export function bind() {
  void bindNullaryEquals(t_never);
  void bindNullaryEquals(t_unknown);
  void bindNullaryEquals(t_any);
  void bindNullaryEquals(t_void);
  void bindNullaryEquals(t_null);
  void bindNullaryEquals(t_undefined);
  void bindNullaryEquals(t_boolean);
  void bindNullaryEquals(t_symbol);
  void bindNullaryEquals(t_integer);
  void bindNullaryEquals(t_bigint);
  void bindNullaryEquals(t_number);
  void bindNullaryEquals(t_string);
  void ((t_eq.def as any) = (...args: Parameters<typeof t.eq.def>) => bindUnaryEquals(def.eq(...args), (x) => x));
  void ((t_optional.def as any) = (...args: Parameters<typeof t.optional>) => bindUnaryEquals(def.optional(...args), optional));
  void ((t_record.def as any) = (...args: Parameters<typeof t.record.def>) => bindUnaryEquals(def.record(...args), record));
  void ((t_array.def as any) = (...args: Parameters<typeof t.array.def>) => bindUnaryEquals(def.array(...args), array))
  void ((t_union.def as any) = (...args: Parameters<typeof t.union.def>) => bindUnaryEquals(def.union(...args), union));
  void ((t_intersect.def as any) = (...args: Parameters<typeof t.intersect.def>) => bindUnaryEquals(def.intersect(...args), intersect));
  void ((t_tuple.def as any) = (...args: Parameters<typeof t.tuple.def>) => bindUnaryEquals(def.tuple(...args), tuple));
  void ((t_object.def as any) = (...args: Parameters<typeof t.object.def>) => bindUnaryEquals(def.object(...args), object));
}
