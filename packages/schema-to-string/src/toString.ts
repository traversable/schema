import type { Returns, Join, Showable, UnionToTuple } from '@traversable/registry'
import { symbol } from '@traversable/registry'
import { t } from '@traversable/schema-core'
import {
  isShowable,
  hasToString,
  stringify,
} from './shared.js'

export {
  neverToString as never,
  unknownToString as unknown,
  anyToString as any,
  voidToString as void,
  nullToString as null,
  undefinedToString as undefined,
  symbolToString as symbol,
  booleanToString as boolean,
  integerToString as integer,
  bigintToString as bigint,
  numberToString as number,
  stringToString as string,
  eqToString as eq,
  arrayToString as array,
  recordToString as record,
  unionToString as union,
  intersectToString as intersect,
  optionalToString as optional,
  tupleToString as tuple,
  objectToString as object,
}

/** @internal */
const isArray = globalThis.Array.isArray

/** @internal */
const isOptional = <T>(u: unknown): u is { toString(): T } => !!u && typeof u === 'function' &&
  symbol.optional in u &&
  typeof u[symbol.optional] === 'number'

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
    symbol.optional extends keyof T[I] ? `_?: ${Returns<T[I]['toString']>}` : Returns<T[I]['toString']>
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
    : `{ ${Join<{ [I in keyof _]: `'${_[I]}${T[_[I]] extends { [symbol.optional]: any } ? `'?` : `'`}: ${Returns<T[_[I]]['toString']>}` }, ', '>} }`
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

interface neverToString { toString(): typeof toString.never }
interface unknownToString { toString(): typeof toString.unknown }
interface anyToString { toString(): typeof toString.any }
interface voidToString { toString(): typeof toString.void }
interface nullToString { toString(): typeof toString.null }
interface undefinedToString { toString(): typeof toString.undefined }
interface bigintToString { toString(): typeof toString.bigint }
interface symbolToString { toString(): typeof toString.symbol }
interface booleanToString { toString(): typeof toString.boolean }
interface integerToString { toString(): typeof toString.integer }
interface numberToString { toString(): typeof toString.number }
interface stringToString { toString(): typeof toString.string }

function neverToString() { return toString.never }
function unknownToString() { return toString.unknown }
function anyToString() { return toString.any }
function voidToString() { return toString.void }
function undefinedToString() { return toString.undefined }
function nullToString() { return toString.null }
function symbolToString() { return toString.symbol }
function booleanToString() { return toString.boolean }
function integerToString() { return toString.integer }
function bigintToString() { return toString.bigint }
function numberToString() { return toString.number }
function stringToString() { return toString.string }

interface eqToString<V = unknown> { toString(): Returns<typeof toString.eq<V>> }
interface arrayToString<S> { toString(): Returns<typeof toString.array<S>> }
interface optionalToString<S> { toString(): Returns<typeof toString.optional<S>>, [symbol.optional]: number }
interface recordToString<S> { toString(): Returns<typeof toString.record<S>> }
interface unionToString<S> { toString(): Returns<typeof toString.union<S>> }
interface intersectToString<S> { toString(): Returns<typeof toString.intersect<S>> }
interface tupleToString<S> { toString(): Returns<typeof toString.tuple<S>> }
interface objectToString<S, _ = UnionToTuple<keyof S>> { toString(): Returns<typeof toString.object<S, _>> }

function eqToString<V>(this: t.eq<V>) { return toString.eq(this.def) }
function arrayToString<S>(this: t.array<S>) { return toString.array(this.def) }
function optionalToString<S>(this: t.optional<S>) { return toString.optional(this.def) }
function recordToString<S>(this: t.record<S>) { return toString.record(this.def) }
function unionToString<S>(this: t.union<S>) { return toString.union(this.def) }
function intersectToString<S>(this: t.intersect<S>) { return toString.intersect(this.def) }
function tupleToString<S>(this: t.tuple<S>) { return toString.tuple(this.def) }
function objectToString<S>(this: t.object<S>) { return toString.object(this.def) }

