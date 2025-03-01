import type { Eq, Kind } from '@traversable/registry'
import { fn, URI } from '@traversable/registry'
import { t } from './schema.js'
import { Json } from '@traversable/json'
import { Equal } from '@traversable/schema-core'

/** @internal */
const Object_keys = globalThis.Object.keys

/**
 * ## {@link type `Eq.type`}
 * 
 * TC39-compliant implementation of
 * [`SameType`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-sametype)
 */
const type = (
  (l, r) => (l === undefined && r === undefined)
    || (l === null && r === null)
    || (typeof l === 'boolean' && typeof r === 'boolean')
    || (typeof l === 'number' && typeof r === 'number')
    || (typeof l === 'string' && typeof r === 'string')
    || (typeof l === 'object' && typeof r === 'object')
    || (typeof l === 'bigint' && typeof r === 'bigint')
    || (typeof l === 'symbol' && typeof r === 'symbol')
) satisfies Eq<unknown>

/** 
 * ## {@link strict `Eq.strict`}
 * 
 * TC39-compliant implementation of
 * [`IsStrictlyEqual`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal)
 */
const strict = <T>(l: T, r: T): boolean => l === r

/** 
 * ### {@link sameValueNumber `sameValueNumber`}
 * TC39-compliant implementation of
 * [`Number::sameValue`](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-sameValue)
 */
const sameValueNumber = (
  (l, r) => typeof l === 'number' && typeof r === 'number'
    ? l === 0 && r === 0
      ? (1 / l === 1 / r)
      : (l !== l ? r !== r : l === r)
    : false
) satisfies Eq<number>

declare const TypeMap: {
  unknown: unknown
  any: any
  never: never
  void: void
  undefined: undefined
  null: null
  symbol: symbol
  boolean: boolean
  bigint: bigint
  number: number
  string: string
  eq: Json
}

const defaults = {
  unknown: strict<unknown>,
  any: strict<any>,
  void: strict<void>,
  never: strict<never>,
  undefined: strict,
  null: strict<null>,
  boolean: strict<boolean>,
  bigint: strict<bigint>,
  symbol: strict<symbol>,
  string: strict<string>,
  eq: Equal.deep<Json>,
  number: sameValueNumber,
} as const satisfies { [K in keyof typeof TypeMap]: Eq<typeof TypeMap[K]> }

namespace Recursive {
  export function fromSchema(x: t.F<Eq<unknown>>): Eq<unknown>
  export function fromSchema<T>(x: Kind<t.Free, Eq<T>>) {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.unknown: return defaults.unknown
      case x.tag === URI.any: return defaults.any
      case x.tag === URI.void: return defaults.void
      case x.tag === URI.never: return defaults.never
      case x.tag === URI.undefined: return defaults.undefined
      case x.tag === URI.null: return defaults.null
      case x.tag === URI.symbol_: return defaults.symbol
      case x.tag === URI.boolean: return defaults.boolean
      case x.tag === URI.bigint: return defaults.bigint
      case x.tag === URI.number: return defaults.number
      case x.tag === URI.string: return defaults.string
      case x.tag === URI.eq: return ((l, r) => defaults.eq(l, r)) satisfies Eq<Json>
      case x.tag === URI.union: return ((l, r) => x.def.some((equalsFn) => equalsFn(l, r))) satisfies Eq<T>
      case x.tag === URI.intersect: return ((l, r) => x.def.every((equalsFn) => equalsFn(l, r))) satisfies Eq<T>
      case x.tag === URI.optional: return ((l, r) => defaults.undefined(l, r) || x.def(l, r)) satisfies Eq<T>
      case x.tag === URI.array: return ((l, r) => {
        let len = l.length
        if (len !== r.length) return false
        for (let ix = len; ix-- !== 0;)
          if (!x.def(l[ix], r[ix])) return false
        return true
      }) satisfies Eq<readonly T[]>
      case x.tag === URI.record: return ((l, r) => {
        let keys = Object_keys(l)
        let len = keys.length
        if (len !== Object_keys(r).length)
          for (let ix = len; ix-- !== 0;) {
            const k = keys[ix]
            if (!(x.def(l[k], r[k]))) return false
          }
        return true
      }) satisfies Eq<{ [x: string]: T }>
      case x.tag === URI.object: return ((l, r) => {
        for (const k in x.def) {
          const equalsFn = x.def[k]
          if (!equalsFn(l[k], r[k])) return false
        }
        return true
      }) satisfies Eq<{ [x: string]: T }>
      case x.tag === URI.tuple: return ((l, r) => {
        const len = x.def.length;
        for (let ix = len; ix-- !== 0;) {
          const equalsFn = x.def[ix]
          if (!equalsFn(l[ix], r[ix])) return false
        }
        return true
      }) satisfies Eq<readonly T[]>
    }
  }
}

export const fromSchema
  : <S extends t.Schema>(term: S) => Eq<S['_type']>
  = fn.cata(t.Functor)(Recursive.fromSchema) as never
