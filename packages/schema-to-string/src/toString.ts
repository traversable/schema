import type { Returns, Join, Showable, UnionToTuple } from '@traversable/registry'
import { symbol } from '@traversable/registry'

export {
  toString_never,
  toString_unknown,
  toString_any,
  toString_void,
  toString_null,
  toString_undefined,
  toString_bigint,
  toString_symbol,
  toString_boolean,
  toString_number,
  toString_string,
  toString_integer,
  toString_eq,
  toString_array,
  toString_record,
  toString_union,
  toString_intersect,
  toString_optional,
  toString_tuple,
  toString_object,
}

/** @internal */
type Symbol_optional = typeof Symbol_optional
const Symbol_optional: typeof symbol.optional = symbol.optional

/** @internal */
const isArray = globalThis.Array.isArray

/** @internal */
const hasToString = (x: unknown): x is { toString(): string } =>
  !!x && typeof x === 'function' && 'toString' in x && typeof x.toString === 'function'

/** @internal */
const isOptional = <T>(u: unknown): u is toString_optional<T> => !!u && typeof u === 'function' &&
  Symbol_optional in u &&
  typeof u[Symbol_optional] === 'number'

/** @internal */
const isShowable = (u: unknown) => u == null
  || typeof u === 'boolean'
  || typeof u === 'number'
  || typeof u === 'bigint'
  || typeof u === 'string'

/** @internal */
const stringify = (u: unknown) => typeof u === 'string' ? `'${u}'` : isShowable(u) ? globalThis.String(u) : 'string'

export function toString(x: unknown): string { return hasToString(x) ? x.toString() : 'unknown' }

export declare namespace toString {
  export type eq<T, _ extends string = [T] extends [Showable] ? `${T}` : never>
    = [_] extends [never]
    ? [T] extends [symbol] ? 'symbol' : string
    : [T] extends [string] ? `'${_}'` : _
  export type intersect<T> = never | [T] extends [readonly []] ? 'unknown'
    /* @ts-expect-error */
    : `(${Join<{ [I in keyof T]: Returns<T[I]['toString']> }, ' & '>})`
  export type union<T> = never | [T] extends [readonly []] ? 'never'
    /* @ts-expect-error */
    : `(${Join<{ [I in keyof T]: Returns<T[I]['toString']> }, ' | '>})`
  /* @ts-expect-error */
  export type record<T> = never | `Record<string, ${Returns<T['toString']>}>`
  export type tuple<T> = never | `[${Join<{
    [I in keyof T]: `${
    /* @ts-expect-error */
    T[I] extends { [Symbol_optional]: any } ? `_?: ${Returns<T[I]['toString']>}` : Returns<T[I]['toString']>
    }`
  }, ', '>}]`
  /* @ts-expect-error */
  export type optional<T> = never | `(${Returns<T['toString']>} | undefined)`
  /* @ts-expect-error */
  export type array<T> = `(${Returns<T['toString']>})[]`
  export { object_ as object }
  export type object_<T, _ = UnionToTuple<keyof T>> = never
    | [keyof T] extends [never] ? '{}'
    /* @ts-expect-error */
    : `{ ${Join<{ [I in keyof _]: `'${_[I]}${T[_[I]] extends { [Symbol_optional]: any } ? `'?` : `'`}: ${Returns<T[_[I]]['toString']>}` }, ', '>} }`
}

toString.never = 'never' as const
toString.unknown = 'unknown' as const
toString.any = 'any' as const
toString.void = 'void' as const
toString.undefined = 'undefined' as const
toString.null = 'null' as const
toString.symbol = 'symbol' as const
toString.boolean = 'boolean' as const
toString.integer = 'number' as const
toString.number = 'number' as const
toString.bigint = 'bigint' as const
toString.string = 'string' as const

toString.optional = <S>(x: S): toString.optional<S> => <never>`(${toString(x)} | undefined)`
toString.array = <S>(x: S): toString.array<S> => <never>('(' + toString(x) + ')[]')
toString.record = <S>(x: S): toString.record<S> => <never>`Record<string, ${toString(x)}>`
toString.eq = <S>(x: S): toString.eq<S> =>
  <never>(isShowable(typeof x) ? stringify(x) : typeof x === 'symbol' ? 'symbol' : 'string')
toString.union = <S>(xs: S): toString.union<S> =>
  <never>(isArray(xs) ? xs.length === 0 ? 'never' : `(${xs.map(toString).join(' | ')})` : 'unknown')
toString.intersect = <S>(xs: S): toString.intersect<S> =>
  <never>(isArray(xs) ? xs.length === 0 ? 'unknown' : `(${xs.map(toString).join(' & ')})` : 'unknown')
toString.tuple = <S>(xs: S): toString.tuple<S> =>
  <never>(isArray(xs) ? `[${xs.map((x) => isOptional(x) ? `_?: ${toString(x)}` : toString(x)).join(', ')}]` : 'unknown[]')
toString.object = <S, _ = UnionToTuple<keyof S>>(xs: S): toString.object<S, _> => {
  if (!!xs && typeof xs === 'object') {
    const entries = Object.entries(xs)
    if (entries.length === 0) return <never>'{}'
    else return <never>`{ ${entries.map(([k, x]) => `'${k}${isOptional(x) ? "'?" : "'"}: ${toString(x)}`).join(', ')} }`
  }
  else return <never>'{ [x: string]: unknown }'
}

interface toString_never { toString(): typeof toString.never }
interface toString_unknown { toString(): typeof toString.unknown }
interface toString_any { toString(): typeof toString.any }
interface toString_void { toString(): typeof toString.void }
interface toString_null { toString(): typeof toString.null }
interface toString_undefined { toString(): typeof toString.undefined }
interface toString_bigint { toString(): typeof toString.bigint }
interface toString_symbol { toString(): typeof toString.symbol }
interface toString_boolean { toString(): typeof toString.boolean }
interface toString_integer { toString(): typeof toString.integer }
interface toString_number { toString(): typeof toString.number }
interface toString_string { toString(): typeof toString.string }

const toString_never: toString_never = { toString() { return toString.never } }
const toString_unknown: toString_unknown = { toString() { return toString.unknown } }
const toString_any: toString_any = { toString() { return toString.any } }
const toString_void: toString_void = { toString() { return toString.void } }
const toString_undefined: toString_undefined = { toString() { return toString.undefined } }
const toString_null: toString_null = { toString() { return toString.null } }
const toString_symbol: toString_symbol = { toString() { return toString.symbol } }
const toString_boolean: toString_boolean = { toString() { return toString.boolean } }
const toString_number: toString_number = { toString() { return toString.number } }
const toString_integer: toString_integer = { toString() { return toString.integer } }
const toString_bigint: toString_bigint = { toString() { return toString.bigint } }
const toString_string: toString_string = { toString() { return toString.string } }

interface toString_eq<V = unknown> { toString(): Returns<typeof toString.eq<V>> }
function toString_eq<V>(x: V): toString_eq<V> { return { toString() { return toString.eq(x) } } }
interface toString_array<S> { toString(): Returns<typeof toString.array<S>> }
function toString_array<S>(x: S): toString_array<S> { return { toString() { return toString.array(x) } } }
interface toString_optional<S> { toString(): Returns<typeof toString.optional<S>>, [Symbol_optional]: number }
function toString_optional<S>(x: S): toString_optional<S> { return { toString() { return toString.optional(x) }, [Symbol_optional]: 1 } }
interface toString_record<S> { toString(): Returns<typeof toString.record<S>> }
function toString_record<S>(x: S): toString_record<S> { return { toString() { return toString.record(x) } } }
interface toString_union<S> { toString(): Returns<typeof toString.union<S>> }
function toString_union<S extends readonly unknown[]>(xs: S): toString_union<S> { return { toString() { return toString.union(xs) } } }
interface toString_intersect<S> { toString(): Returns<typeof toString.intersect<S>> }
function toString_intersect<S extends readonly unknown[]>(xs: S): toString_intersect<S> { return { toString() { return toString.intersect(xs) } } }
interface toString_tuple<S> { toString(): Returns<typeof toString.tuple<S>> }
function toString_tuple<S extends readonly unknown[]>(xs: S): toString_tuple<S> { return { toString() { return toString.tuple(xs) } } }
interface toString_object<S, _ = UnionToTuple<keyof S>> { toString(): Returns<typeof toString.object<S, _>> }
function toString_object<S extends { [x: string]: unknown }, _ = UnionToTuple<keyof S>>(xs: S): toString_object<S, _> {
  return { toString() { return toString.object<S, _>(xs) } }
}
