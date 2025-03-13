import type { Returns, Join, Showable, UnionToTuple } from './registry.js'
import { symbol } from './registry.js'

export {
  never_ as never,
  unknown_ as unknown,
  any_ as any,
  void_ as void,
  null_ as null,
  undefined_ as undefined,
  bigint_ as bigint,
  symbol_ as symbol,
  boolean_ as boolean,
  number_ as number,
  string_ as string,
  integer,
  eq,
  array,
  record,
  union,
  intersect,
  optional,
  tuple,
  object_ as object,
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
const isOptional = <T>(u: unknown): u is optional<T> => !!u && typeof u === 'function' &&
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

interface never_ { toString(): typeof toString.never }
interface unknown_ { toString(): typeof toString.unknown }
interface any_ { toString(): typeof toString.any }
interface void_ { toString(): typeof toString.void }
interface null_ { toString(): typeof toString.null }
interface undefined_ { toString(): typeof toString.undefined }
interface bigint_ { toString(): typeof toString.bigint }
interface symbol_ { toString(): typeof toString.symbol }
interface boolean_ { toString(): typeof toString.boolean }
interface integer { toString(): typeof toString.integer }
interface number_ { toString(): typeof toString.number }
interface string_ { toString(): typeof toString.string }

const never_: never_ = { toString() { return toString.never } }
const unknown_: unknown_ = { toString() { return toString.unknown } }
const any_: any_ = { toString() { return toString.any } }
const void_: void_ = { toString() { return toString.void } }
const undefined_: undefined_ = { toString() { return toString.undefined } }
const null_: null_ = { toString() { return toString.null } }
const symbol_: symbol_ = { toString() { return toString.symbol } }
const boolean_: boolean_ = { toString() { return toString.boolean } }
const number_: number_ = { toString() { return toString.number } }
const integer: integer = { toString() { return toString.integer } }
const bigint_: bigint_ = { toString() { return toString.bigint } }
const string_: string_ = { toString() { return toString.string } }

interface eq<V = unknown> { toString(): Returns<typeof toString.eq<V>> }
function eq<V>(x: V): eq<V> { return { toString() { return toString.eq(x) } } }
interface array<S> { toString(): Returns<typeof toString.array<S>> }
function array<S>(x: S): array<S> { return { toString() { return toString.array(x) } } }
interface optional<S> { toString(): Returns<typeof toString.optional<S>>, [Symbol_optional]: number }
function optional<S>(x: S): optional<S> { return { toString() { return toString.optional(x) }, [Symbol_optional]: 1 } }
interface record<S> { toString(): Returns<typeof toString.record<S>> }
function record<S>(x: S): record<S> { return { toString() { return toString.record(x) } } }
interface union<S> { toString(): Returns<typeof toString.union<S>> }
function union<S extends readonly unknown[]>(xs: S): union<S> { return { toString() { return toString.union(xs) } } }
interface intersect<S> { toString(): Returns<typeof toString.intersect<S>> }
function intersect<S extends readonly unknown[]>(xs: S): intersect<S> { return { toString() { return toString.intersect(xs) } } }
interface tuple<S> { toString(): Returns<typeof toString.tuple<S>> }
function tuple<S extends readonly unknown[]>(xs: S): tuple<S> { return { toString() { return toString.tuple(xs) } } }
interface object_<S, _ = UnionToTuple<keyof S>> { toString(): Returns<typeof toString.object<S, _>> }
function object_<S extends { [x: string]: unknown }, _ = UnionToTuple<keyof S>>(xs: S) {
  return { toString() { return toString.object<S, _>(xs) }, toString_() { return toString.object<S, _>(xs) } }
}


// import type { Returns, Join, Showable, UnionToTuple } from '@traversable/registry'
// export { symbol as Symbol_ } from '@traversable/registry'
// import { symbol } from '@traversable/registry'

// import Symbol_optional = symbol.optional

// export {
//   never_ as never,
//   unknown_ as unknown,
//   any_ as any,
//   void_ as void,
//   null_ as null,
//   undefined_ as undefined,
//   bigint_ as bigint,
//   symbol_ as symbol,
//   boolean_ as boolean,
//   number_ as number,
//   string_ as string,
//   integer,
//   eq,
//   array,
//   record,
//   union,
//   intersect,
//   optional,
//   tuple,
//   object_ as object,
// }

// /** @internal */
// const isArray = globalThis.Array.isArray

// /** @internal */
// const hasToString = (x: unknown): x is { toString(): string } =>
//   !!x && typeof x === 'function' && 'toString' in x && typeof x.toString === 'function'

// /** @internal */
// const isOptional = <T>(u: unknown): u is optional<T> => !!u && typeof u === 'function' &&
//   Symbol_optional in u &&
//   u[Symbol_optional] === true

// /** @internal */
// const isShowable = (u: unknown) => u == null
//   || typeof u === 'boolean'
//   || typeof u === 'number'
//   || typeof u === 'bigint'
//   || typeof u === 'string'

// /** @internal */
// const stringify = (u: unknown) => typeof u === 'string' ? `'${u}'` : isShowable(u) ? globalThis.String(u) : 'string'

// export function toString(x: unknown): string { return hasToString(x) ? x.toString() : 'unknown' }

// type AnyOptional = { [Symbol_optional]: any }

// export declare namespace toString {
//   export type eq<T, _ extends string = [T] extends [Showable] ? `${T}` : never>
//     = [_] extends [never]
//     ? [T] extends [symbol] ? 'symbol' : string
//     : [T] extends [string] ? `'${_}'` : _
//   /* @ts-expect-error */
//   export type intersect<T> = never | [T] extends [readonly []] ? 'unknown' : `(${Join<{ [I in keyof T]: Returns<T[I]['toString']> }, ' & '>})`
//   /* @ts-expect-error */
//   export type union<T> = never | [T] extends [readonly []] ? 'never' : `(${Join<{ [I in keyof T]: Returns<T[I]['toString']> }, ' | '>})`
//   /* @ts-expect-error */
//   export type record<T> = never | `Record<string, ${Returns<T['toString']>}>`
//   export type tuple<T> = never | `[${Join<{
//     [I in keyof T]: `${
//     /* @ts-expect-error */
//     T[I] extends AnyOptional ? `_?: ${Returns<T[I]['toString']>}` : Returns<T[I]['toString']>
//     }`
//   }, ', '>}]`
//   /* @ts-expect-error */
//   export type optional<T> = never | `(${Returns<T['toString']>} | undefined)`
//   /* @ts-expect-error */
//   export type array<T> = `(${Returns<T['toString']>})[]`
//   export { object_ as object }
//   export type object_<T, _ = UnionToTuple<keyof T>> = never
//     | [keyof T] extends [never] ? '{}'
//     /* @ts-expect-error */
//     : `{ ${Join<{ [I in keyof _]: `'${_[I]}${T[_[I]] extends AnyOptional ? `'?` : `'`}: ${Returns<T[_[I]]['toString']>}` }, ', '>} }`
// }

// toString.never = 'never' as const
// toString.unknown = 'unknown' as const
// toString.any = 'any' as const
// toString.void = 'void' as const
// toString.undefined = 'undefined' as const
// toString.null = 'null' as const
// toString.symbol = 'symbol' as const
// toString.boolean = 'boolean' as const
// toString.integer = 'number' as const
// toString.number = 'number' as const
// toString.bigint = 'bigint' as const
// toString.string = 'string' as const

// toString.optional = <S>(x: S): toString.optional<S> => <never>`(${toString(x)} | undefined)`
// toString.array = <S>(x: S): toString.array<S> => <never>('(' + toString(x) + ')[]')
// toString.record = <S>(x: S): toString.record<S> => <never>`Record<string, ${toString(x)}>`

// toString.eq = <S>(x: S): toString.eq<S> =>
//   <never>(isShowable(typeof x) ? stringify(x) : typeof x === 'symbol' ? 'symbol' : 'string')

// toString.union = <S>(xs: S): toString.union<S> =>
//   <never>(isArray(xs) ? xs.length === 0 ? 'never' : `(${xs.map(toString).join(' | ')})` : 'unknown')

// toString.intersect = <S>(xs: S): toString.intersect<S> =>
//   <never>(isArray(xs) ? xs.length === 0 ? 'unknown' : `(${xs.map(toString).join(' & ')})` : 'unknown')

// toString.tuple = <S>(xs: S): toString.tuple<S> =>
//   <never>(isArray(xs) ? `[${xs.map((x) => isOptional(x) ? `_?: ${toString(x)}` : toString(x)).join(', ')}]` : 'unknown[]')

// toString.object = <S extends { [x: string]: unknown }, _ = UnionToTuple<keyof S>>(xs: S): toString.object<S, _> => {
//   if (!!xs && typeof xs === 'object') {
//     const entries = Object.entries(xs)
//     if (entries.length === 0) return <never>'{}'
//     else return <never>`{ ${entries.map(([k, x]) => `'${k}${isOptional(x) ? "'?" : "'"}: ${toString(x)}`).join(', ')} }`
//   }
//   else return <never>'{ [x: string]: unknown }'
// }

// interface never_ { toString(): typeof toString.never }
// interface unknown_ { toString(): typeof toString.unknown }
// interface any_ { toString(): typeof toString.any }
// interface void_ { toString(): typeof toString.void }
// interface null_ { toString(): typeof toString.null }
// interface undefined_ { toString(): typeof toString.undefined }
// interface bigint_ { toString(): typeof toString.bigint }
// interface symbol_ { toString(): typeof toString.symbol }
// interface boolean_ { toString(): typeof toString.boolean }
// interface integer { toString(): typeof toString.integer }
// interface number_ { toString(): typeof toString.number }
// interface string_ { toString(): typeof toString.string }

// const never_: never_ = { toString() { return toString.never } }
// const unknown_: unknown_ = { toString() { return toString.unknown } }
// const any_: any_ = { toString() { return toString.any } }
// const void_: void_ = { toString() { return toString.void } }
// const undefined_: undefined_ = { toString() { return toString.undefined } }
// const null_: null_ = { toString() { return toString.null } }
// const symbol_: symbol_ = { toString() { return toString.symbol } }
// const boolean_: boolean_ = { toString() { return toString.boolean } }
// const number_: number_ = { toString() { return toString.number } }
// const integer: integer = { toString() { return toString.integer } }
// const bigint_: bigint_ = { toString() { return toString.bigint } }
// const string_: string_ = { toString() { return toString.string } }

// interface eq<V = unknown> { toString(): Returns<typeof toString.eq<V>> }
// function eq<V>(x: V): eq<V> { return { toString() { return toString.eq(x) } } }

// interface array<S> { toString(): Returns<typeof toString.array<S>> }
// function array<S>(x: S): array<S> { return { toString() { return toString.array(x) } } }

// interface optional<S> { toString(): Returns<typeof toString.optional<S>>, [Symbol_optional]: true }
// function optional<S>(x: S): optional<S> { return { toString() { return toString.optional(x) }, [Symbol_optional]: true } }

// interface record<S> { toString(): Returns<typeof toString.record<S>> }
// function record<S>(x: S): record<S> { return { toString() { return toString.record(x) } } }

// interface union<S> { toString(): Returns<typeof toString.union<S>> }
// function union<S extends readonly unknown[]>(xs: S): union<S> { return { toString() { return toString.union(xs) } } }

// interface intersect<S> { toString(): Returns<typeof toString.intersect<S>> }
// function intersect<S extends readonly unknown[]>(xs: S): intersect<S> { return { toString() { return toString.intersect(xs) } } }

// interface tuple<S extends readonly unknown[]> { toString(): Returns<typeof toString.tuple<S>> }
// function tuple<S extends readonly unknown[]>(xs: S): tuple<S> { return { toString() { return toString.tuple(xs) } } }

// interface object_<S extends { [x: string]: unknown }, _ = UnionToTuple<keyof S>> { toString(): Returns<typeof toString.object<S, _>> }
// function object_<S extends { [x: string]: unknown }, _ = UnionToTuple<keyof S>>(xs: S) {
//   return { toString() { return toString.object<S, _>(xs) }, toString_() { return toString.object<S, _>(xs) } }
// }
