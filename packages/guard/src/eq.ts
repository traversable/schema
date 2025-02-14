export { equals }

/** @internal */
const Array_isArray
  : (u: unknown) => u is readonly unknown[]
  = globalThis.Array.isArray
/** @internal */
const Object_keys = globalThis.Object.keys
/** @internal */
const Object_is = globalThis.Object.is

/** 
 * ## {@link equals `equals`}
 * 
 * Compare two vaules for value equality. 
 * 
 * Comparisons with {@link equals `equals`} are symmetric
 * (switching the order of the arguments does not change
 * the result), and is very fast. 
 * 
 * Early benchmarks were consistently ~2x faster than 
 * underscore and 2.5x - 3x faster than lodash.
 */
function equals<T>(x: T, y: T): boolean
function equals(x: T, y: T): boolean
function equals(x: T, y: T): boolean {
  if (Object_is(x, y)) return true
  let len: number | undefined
  let ix: number | undefined
  let ks: string[]

  if (Array_isArray(x)) {
    if (!Array_isArray(y)) return false
    void (len = x.length)
    if (len !== y.length) return false
    for (ix = len; ix-- !== 0;)
      if (!equals(x[ix], y[ix])) return false
    return true
  }

  if (x && y && typeof x === "object" && typeof y === "object") {
    const yks = Object_keys(y)
    void (ks = Object_keys(x))
    void (len = ks.length)
    if (len !== yks.length) return false
    if (Array_isArray(y)) return false
    for (ix = len; ix-- !== 0;) {
      const k = ks[ix]
      /** 
       * 2025-01-23 [AHRJ]: handles a false positive edge case
       * @example
       * equals.deep({ "": [] }, { " ": undefined }) // => true 😵
       */
      if (!yks.includes(k)) return false
      if (!equals(x[k], y[k])) return false
    }
    return true
  }
  return false
}

/** 
 * Equivalent to unknown, but with a narrowing profile that's
 * suitable for {@link equals `equals`}'s use case.
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
  ;
