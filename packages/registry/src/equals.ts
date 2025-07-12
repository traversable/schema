import type { Equal } from './types.js'

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const Object_is = globalThis.Object.is

/** @internal */
const Array_isArray
  : (u: unknown) => u is readonly unknown[]
  = globalThis.Array.isArray

/**
 * ## {@link SameType `Equal.SameType`}
 * 
 * TC39-compliant implementation of
 * [`SameType`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-sametype)
 */
export const SameType = (
  (l, r) => (l === undefined && r === undefined)
    || (l === null && r === null)
    || (typeof l === 'boolean' && typeof r === 'boolean')
    || (typeof l === 'number' && typeof r === 'number')
    || (typeof l === 'string' && typeof r === 'string')
    || (typeof l === 'object' && typeof r === 'object')
    || (typeof l === 'bigint' && typeof r === 'bigint')
    || (typeof l === 'symbol' && typeof r === 'symbol')
) satisfies Equal<unknown>

/** 
 * ## {@link IsStrictlyEqual `Equal.IsStrictlyEqual`}
 * 
 * Specified by TC39's
 * [`IsStrictlyEqual`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal)
 */
export const IsStrictlyEqual = <T>(l: T, r: T): boolean => l === r

/** 
 * ## {@link SameValueNumber `Equal.SameValueNumber`}
 * 
 * Specified by TC39's
 * [`Number::sameValue`](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-sameValue)
 */
export const SameValueNumber = (
  (l, r) => Object_is(l, r) || typeof l === 'number' && typeof r === 'number'
    ? l === 0 && r === 0
      ? (1 / l === 1 / r)
      : (l !== l ? r !== r : l === r)
    : false
) satisfies Equal<number>

/** 
 * ## {@link SameValue `Equal.SameValue`}
 *
 * Specified by TC39's
 * [`SameValue`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue)
 */
export const SameValue
  : <T>(l: T, r: T) => boolean
  = globalThis.Object.is

/** 
 * Roughly equivalent to unknown, but with a narrowing profile that's
 * suitable for {@link deepEquals `Equal.deep`}'s use case.
 */
type T =
  | null
  | undefined
  | symbol
  | boolean
  | number
  | bigint
  | string
  | readonly unknown[]
  | { [x: string]: unknown }

export { deepEquals as deep }

/** 
 * ## {@link deepEquals `Equal.deep`}
 * 
 * Compare two vaules for value equality. 
 * 
 * Comparisons with {@link equals `equals`} are transitive
 * and symmetric (switching the order of the arguments does not change
 * the result), and are performed very quickly. 
 */
function deepEquals<T>(x: T, y: T): boolean
function deepEquals(x: T, y: T): boolean
function deepEquals(x: T, y: T): boolean {
  if (Object_is(x, y)) return true
  let len: number | undefined
  let ix: number | undefined
  let ks: string[]

  if (Array_isArray(x)) {
    if (!Array_isArray(y)) return false
    void (len = x.length)
    if (len !== y.length) return false
    for (ix = len; ix-- !== 0;)
      if (!deepEquals(x[ix], y[ix])) return false
    return true
  }

  if (x && y && typeof x === "object" && typeof y === "object") {
    if (Array_isArray(y)) return false
    const yks = Object_keys(y)
    void (ks = Object_keys(x))
    void (len = ks.length)
    if (len !== yks.length) return false
    for (ix = len; ix-- !== 0;) {
      const k = ks[ix]
      if (!yks.includes(k)) return false
      if (!deepEquals(x[k], y[k])) return false
    }
    return true
  }
  return false
}

export { laxEquals as lax }

/** 
 * ## {@link laxEquals `Equal.lax`}
 * 
 * Compare two vaules for value equality.
 * 
 * Unlike {@link deepEquals `Equal.deep`}, {@link laxEquals `Equal.lax`}'s
 * logic does not predicate on the existence of a given key (given an object)
 * or index (given an array) -- only an object's _values_ are candidates
 * for comparison.
 * 
 * Usually, you'll want to use {@link deepEquals `Equal.deep`}, or better yet,
 * derive a more fine-grained equals function from a schema using the 
 * `@traversable/derive-equals` package.
 * 
 * This implementation mostly exists to maintain feature parity with validation
 * libraries like Zod, who do not support 
 * [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig/#exactOptionalPropertyTypes).
 */

function laxEquals<T>(x: T, y: T): boolean
function laxEquals(x: T, y: T): boolean
function laxEquals(x: T, y: T): boolean {
  if (x === y) return true
  let len: number | undefined
  let ix: number | undefined
  let ks: string[]

  if (Array_isArray(x)) {
    if (!Array_isArray(y)) return false
    void (len = x.length)
    if (len !== y.length) return false
    for (ix = len; ix-- !== 0;)
      if (!deepEquals(x[ix], y[ix])) return false
    return true
  }

  if (x && y && typeof x === "object" && typeof y === "object") {
    if (Array_isArray(y)) return false
    const yks = Object_keys(y).filter((k) => y[k] !== void 0)
    void (ks = Object_keys(x).filter((k) => x[k] !== void 0))
    void (len = ks.length)
    if (len !== yks.length) return false
    for (ix = len; ix-- !== 0;) {
      const k = ks[ix]
      if (!yks.includes(k)) return false
      if (!deepEquals(x[k], y[k])) return false
    }
    return true
  }
  return false
}
