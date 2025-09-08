import type { Returns, Join, Showable, UnionToTuple } from '@traversable/registry'
import { symbol } from '@traversable/registry'
import { t } from '@traversable/schema'

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
  refToString as ref,
  arrayToString as array,
  recordToString as record,
  unionToString as union,
  intersectToString as intersect,
  optionalToString as optional,
  tupleToString as tuple,
  objectToString as object,
}

/** @internal */
type Symbol_optional = typeof Symbol_optional
const Symbol_optional: typeof symbol.optional = symbol.optional

/** @internal */
const isArray = globalThis.Array.isArray

/** @internal */
const hasToType = (x: unknown): x is { toType(): string } =>
  !!x && typeof x === 'function' && 'toType' in x && typeof x.toType === 'function'

/** @internal */
const isOptional = <T>(u: unknown): u is { toType(): T } => !!u && typeof u === 'function' &&
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

export function toType(x: unknown): string { return hasToType(x) ? x.toType() : 'unknown' }

export declare namespace toType {
  export type eq<T, _ extends string = [T] extends [Showable] ? `${T}` : never>
    = [_] extends [never]
    ? [T] extends [symbol] ? 'symbol' : string
    : [T] extends [string] ? `'${_}'` : _
  export type ref<Id> = `${Id & string}`
  export type intersect<T> = never | [T] extends [readonly []] ? 'unknown'
    /** @ts-expect-error */
    : `(${Join<{ [I in keyof T]: Returns<T[I]['toType']> }, ' & '>})`
  export type union<T> = never | [T] extends [readonly []] ? 'never'
    /** @ts-expect-error */
    : `(${Join<{ [I in keyof T]: Returns<T[I]['toType']> }, ' | '>})`
  /** @ts-expect-error */
  export type record<T> = never | `Record<string, ${Returns<T['toType']>}>`
  export type tuple<T> = never | `[${Join<{
    [I in keyof T]: `${
    /** @ts-expect-error */
    T[I] extends { [Symbol_optional]: any } ? `_?: ${Returns<T[I]['toType']>}` : Returns<T[I]['toType']>
    }`
  }, ', '>}]`
  /** @ts-expect-error */
  export type optional<T> = never | `(${Returns<T['toType']>} | undefined)`
  /** @ts-expect-error */
  export type array<T> = `(${Returns<T['toType']>})[]`
  export { object_ as object }
  export type object_<T, _ = UnionToTuple<keyof T>> = never
    | [keyof T] extends [never] ? '{}'
    /** @ts-expect-error */
    : `{ ${Join<{ [I in keyof _]: `'${_[I]}${T[_[I]] extends { [Symbol_optional]: any } ? `'?` : `'`}: ${Returns<T[_[I]]['toType']>}` }, ', '>} }`
}

toType.never = 'never' as const
toType.unknown = 'unknown' as const
toType.any = 'any' as const
toType.void = 'void' as const
toType.undefined = 'undefined' as const
toType.null = 'null' as const
toType.symbol = 'symbol' as const
toType.boolean = 'boolean' as const
toType.integer = 'number' as const
toType.number = 'number' as const
toType.bigint = 'bigint' as const
toType.string = 'string' as const

toType.optional = <S>(x: S): toType.optional<S> => <never>`(${toType(x)} | undefined)`
toType.array = <S>(x: S): toType.array<S> => <never>('(' + toType(x) + ')[]')
toType.record = <S>(x: S): toType.record<S> => <never>`Record<string, ${toType(x)}>`
toType.ref = <Id>(id: Id): toType.ref<Id> => id as never
toType.eq = <S>(x: S): toType.eq<S> =>
  <never>(isShowable(typeof x) ? stringify(x) : typeof x === 'symbol' ? 'symbol' : 'string')
toType.union = <S>(xs: S): toType.union<S> =>
  <never>(isArray(xs) ? xs.length === 0 ? 'never' : `(${xs.map(toType).join(' | ')})` : 'unknown')
toType.intersect = <S>(xs: S): toType.intersect<S> =>
  <never>(isArray(xs) ? xs.length === 0 ? 'unknown' : `(${xs.map(toType).join(' & ')})` : 'unknown')
toType.tuple = <S>(xs: S): toType.tuple<S> =>
  <never>(isArray(xs) ? `[${xs.map((x) => isOptional(x) ? `_?: ${toType(x)}` : toType(x)).join(', ')}]` : 'unknown[]')
toType.object = <S, _ = UnionToTuple<keyof S>>(xs: S): toType.object<S, _> => {
  if (!!xs && typeof xs === 'object') {
    const entries = Object.entries(xs)
    if (entries.length === 0) return <never>'{}'
    else return <never>`{ ${entries.map(([k, x]) => `'${k}${isOptional(x) ? "'?" : "'"}: ${toType(x)}`).join(', ')} }`
  }
  else return <never>'{ [x: string]: unknown }'
}

interface neverToString { toType(): typeof toType.never }
interface unknownToString { toType(): typeof toType.unknown }
interface anyToString { toType(): typeof toType.any }
interface voidToString { toType(): typeof toType.void }
interface nullToString { toType(): typeof toType.null }
interface undefinedToString { toType(): typeof toType.undefined }
interface bigintToString { toType(): typeof toType.bigint }
interface symbolToString { toType(): typeof toType.symbol }
interface booleanToString { toType(): typeof toType.boolean }
interface integerToString { toType(): typeof toType.integer }
interface numberToString { toType(): typeof toType.number }
interface stringToString { toType(): typeof toType.string }

function neverToString() { return toType.never }
function unknownToString() { return toType.unknown }
function anyToString() { return toType.any }
function voidToString() { return toType.void }
function undefinedToString() { return toType.undefined }
function nullToString() { return toType.null }
function symbolToString() { return toType.symbol }
function booleanToString() { return toType.boolean }
function integerToString() { return toType.integer }
function bigintToString() { return toType.bigint }
function numberToString() { return toType.number }
function stringToString() { return toType.string }

interface eqToString<V = unknown> { toType(): Returns<typeof toType.eq<V>> }
interface refToString<S, Id> { toType(): Returns<typeof toType.ref<Id>> }
interface arrayToString<S> { toType(): Returns<typeof toType.array<S>> }
interface optionalToString<S> { toType(): Returns<typeof toType.optional<S>>, [Symbol_optional]: number }
interface recordToString<S> { toType(): Returns<typeof toType.record<S>> }
interface unionToString<S> { toType(): Returns<typeof toType.union<S>> }
interface intersectToString<S> { toType(): Returns<typeof toType.intersect<S>> }
interface tupleToString<S> { toType(): Returns<typeof toType.tuple<S>> }
interface objectToString<S, _ = UnionToTuple<keyof S>> { toType(): Returns<typeof toType.object<S, _>> }

function eqToString<V>(this: t.eq<V>) { return toType.eq(this.def) }
function refToString<S, Id>(this: t.ref<S, Id & string>) { return toType.ref(this.id) }
function arrayToString<S>(this: t.array<S>) { return toType.array(this.def) }
function optionalToString<S>(this: t.optional<S>) { return toType.optional(this.def) }
function recordToString<S>(this: t.record<S>) { return toType.record(this.def) }
function unionToString<S>(this: t.union<S>) { return toType.union(this.def) }
function intersectToString<S>(this: t.intersect<S>) { return toType.intersect(this.def) }
function tupleToString<S>(this: t.tuple<S>) { return toType.tuple(this.def) }
function objectToString<S>(this: t.object<S>) { return toType.object(this.def) }
