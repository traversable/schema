import * as T from '@traversable/registry'
import type { ValidateTuple as Validate, SchemaOptions as Options } from '@traversable/schema-core'
import { extend, getConfig, parseArgs } from '@traversable/schema-core'

import { v as t } from '@traversable/derive-validators'
// import { t } from '@traversable/schema-core'

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
  integer,
  number_ as number,
  string_ as string,
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
type ValidateTuple<T extends readonly unknown[]> = Validate<T, optional<any>>

/** @internal */
type TryToString<
  T,
  _ extends string = [T] extends [string | number | boolean | bigint | null | undefined] ? `${T}` : never
> = [_] extends [never]
  ? [T] extends [symbol] ? 'symbol' : string
  : [T] extends [string] ? `"${_}"` : _

/** @internal */
const Array_isArray = globalThis.Array.isArray

/** @internal */
const hasToString = (x: unknown): x is { toString(): string } =>
  !!x && typeof x === 'function' && 'toString' in x && typeof x.toString === 'function'

function nullary<S, R extends string>(x: S, fallback: R): {
  <K extends string = never>(override: (s: S) => K): K
  (): R
}
function nullary(x: unknown, fallback: string) {
  return (override?: (x: unknown) => string) =>
    override == null ? fallback : override(x)
}

/**
 * ## {@link toString `t.toString`}
 */
export function toString(x: unknown): string {
  return hasToString(x) ? x.toString() : 'unknown'
}

toString.never = nullary(t.never, 'never')
toString.unknown = nullary(t.unknown, 'unknown')
toString.any = nullary(t.any, 'any')
toString.void = nullary(t.void, 'void')
toString.undefined = nullary(t.undefined, 'undefined')
toString.null = nullary(t.null, 'null')
toString.symbol = nullary(t.symbol, 'symbol')
toString.boolean = nullary(t.boolean, 'boolean')
toString.integer = nullary(t.integer, 'number')
toString.number = nullary(t.number, 'number')
toString.bigint = nullary(t.bigint, 'bigint')
toString.string = nullary(t.string, 'string')

toString.eq = <S>(x: S) => (): TryToString<S> => (
  x == null || ['boolean', 'bigint', 'number', 'string'].includes(typeof x)
    ? globalThis.JSON.stringify(x)
    : typeof x === 'symbol' ? 'symbol'
      : 'string'
) as never
/* @ts-expect-error */
toString.optional = <S>(x: S) => (): `${T.Returns<S['toString']>} | undefined` => `${toString(x)} | undefined`
/* @ts-expect-error */
toString.array = <S>(x: S) => (): `${T.Returns<S['toString']>}[]` => toString(x) + '[]'
/* @ts-expect-error */
toString.record = <S>(x: S) => (): `Record<string, ${T.Returns<S['toString']>}>` => `Record<string, ${toString(x)}>`
/* @ts-expect-error */
toString.union = <S>(xs: S) => (): [S] extends [readonly []] ? 'never' : T.Join<{ [I in keyof S]: T.Returns<S[I]['toString']> }, ' | '> =>
  (Array_isArray(xs) ? xs.length === 0 ? 'never' : `${xs.map(toString).join(' | ')}` as never : 'unknown') as never
/* @ts-expect-error */
toString.intersect = <S>(xs: S) => (): [S] extends [readonly []] ? 'unknown' : T.Join<{ [I in keyof S]: T.Returns<S[I]['toString']> }, ' & '> =>
  (Array_isArray(xs) ? xs.length === 0 ? 'unknown' : `${xs.map(toString).join(' & ')}` as never : 'unknown') as never
toString.tuple = <S>(xs: S) => (): `[${T.Join<{ [I in keyof S]: `${
  /* @ts-expect-error */
  optional<any> extends S[I] ? `_?: ${T.Returns<S[I]['toString']>}` : T.Returns<S[I]['toString']>
  }` }, ', '>}]` => (
    Array_isArray(xs) ? `[${xs.map((x) => t.optional.is(x) ? `_?: ${toString(x)}` : toString(x)).join(', ')}]` as never : 'unknown[]'
  ) as never

toString.object = <S extends { [x: string]: unknown }, _ = T.UnionToTuple<keyof S>>(xs: S) =>
  /* @ts-expect-error */
  (): [keyof S] extends [never] ? '{}' : `{ ${T.Join<{ [I in keyof _]: `${_[I]}${S[_[I]] extends optional<any> ? '?' : ''}: ${T.Returns<S[_[I]]['toString']>}` }, ', '>} }` => {
    if (!!xs && typeof xs === 'object') {
      const entries = Object.entries(xs)
      if (entries.length === 0) return '{}' as never
      else return `{ ${entries.map(([k, v]) => `${k}${t.optional.is(v) ? '?' : ''}: ${toString(v)}`).join(', ')} }` as never
    }
    else return '{ [x: string]: unknown }' as never
  }

interface never_ extends t.never { toString: typeof toString.never }
interface unknown_ extends t.unknown { toString: typeof toString.unknown }
interface any_ extends t.any { toString: typeof toString.any }
interface void_ extends t.void { toString: typeof toString.void }
interface null_ extends t.null { toString: typeof toString.null }
interface undefined_ extends t.undefined { toString: typeof toString.undefined }
interface bigint_ extends t.bigint { toString: typeof toString.bigint }
interface symbol_ extends t.symbol { toString: typeof toString.symbol }
interface boolean_ extends t.boolean { toString: typeof toString.boolean }
interface integer extends t.integer { toString: typeof toString.integer }
interface number_ extends t.number { toString: typeof toString.number }
interface string_ extends t.string { toString: typeof toString.string }

const never_ = extend<never_>()(t.never, { toString: toString.never })
const unknown_ = extend<unknown_>()(t.unknown, { toString: toString.unknown })
const any_ = extend<any_>()(t.any, { toString: toString.any })
const void_ = extend<void_>()(t.void, { toString: toString.void })
const undefined_ = extend<undefined_>()(t.undefined, { toString: toString.undefined })
const null_ = extend<null_>()(t.null, { toString: toString.null })
const symbol_ = extend<symbol_>()(t.symbol, { toString: toString.symbol })
const boolean_ = extend<boolean_>()(t.boolean, { toString: toString.boolean })
const number_ = extend<number_>()(t.number, { toString: toString.number })
const integer = extend<integer>()(t.integer, { toString: toString.integer })
const bigint_ = extend<bigint_>()(t.bigint, { toString: toString.bigint })
const string_ = extend<string_>()(t.string, { toString: toString.string })

interface eq<V = unknown> extends t.eq<V> { toString: T.Returns<typeof toString.eq<V>> }
interface array<S = unknown> extends t.array.def<S> { toString: T.Returns<typeof toString.array<S>> }
interface optional<S = unknown> extends t.optional.def<S> { toString: T.Returns<typeof toString.optional<S>> }
interface record<S = unknown> extends t.record.def<S> { toString: T.Returns<typeof toString.record<S>> }
interface union<S = unknown> extends t.union.def<S> { toString: T.Returns<typeof toString.union<S>> }
interface intersect<S = unknown> extends t.intersect.def<S> { toString: T.Returns<typeof toString.intersect<S>> }
interface object_<S extends { [x: string]: unknown }> extends t.object.def<S> { toString: T.Returns<typeof toString.object<S>> }
interface tuple<S extends readonly unknown[] = unknown[]> extends t.tuple.def<S, optional<any>> { toString: T.Returns<typeof toString.tuple<S>> }

function eq<V extends T.Mut<V>>(x: V): eq<V> { return extend<eq<V>>()(t.eq(x), { toString: toString.eq(x) }) }
function array<S>(x: S): array<S> { return extend<array<S>>()(t.array.fix(x), { toString: toString.array(x) }) }
function optional<S>(x: S): optional<S> { return extend<optional<S>>()(t.optional.fix(x), { toString: toString.optional(x) }) }
function record<S>(x: S): record<S> { return extend<record<S>>()(t.record.fix(x), { toString: toString.record(x) }) }
function union<S extends readonly unknown[]>(...xs: S): union<S> { return extend<union<S>>()(t.union.fix(xs), { toString: toString.union(xs) }) }
function intersect<S extends readonly unknown[]>(...xs: S): intersect<S> { return extend<intersect<S>>()(t.intersect.fix(xs), { toString: toString.intersect(xs) }) }

function object_<S extends { [x: string]: t.Schema }>(
  schemas: S,
  options?: Options
) {
  return extend<object_<S>>()(
    t.object.fix(schemas, options),
    { toString: toString.object(schemas) }
  )
}

function tuple<
  S extends readonly t.Schema[],
  T extends { -readonly [I in keyof S]: T.Entry<S[I]> }
>(...schemas: ValidateTuple<S>): tuple<t.tuple.from<ValidateTuple<S>, S>>

function tuple<
  S extends readonly t.Schema[],
  T extends { -readonly [I in keyof S]: T.Entry<S[I]> }
>(
  ...args: [
    ...schemas: ValidateTuple<S>,
    options?: Options
  ]
): tuple<t.tuple.from<ValidateTuple<S>, S>>

/// impl
function tuple<S extends readonly t.Schema[]>(
  ...args:
    | [...guard: S]
    | [...guard: S, $: Options]
): {} {
  const [guards, $] = parseArgs(getConfig().schema, args)
  return extend<tuple<S>>()(
    t.tuple.fix(guards, $),
    { toString: toString.tuple(guards) }
  )
}
