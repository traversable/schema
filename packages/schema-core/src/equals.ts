export { equals }

/** @internal */
const Object_keys = globalThis.Object.keys
/** @internal */
const Object_is = globalThis.Object.is
/** @internal */
const Array_isArray
  : (u: unknown) => u is readonly unknown[]
  = globalThis.Array.isArray

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

/** 
 * ## {@link equals `equals`}
 * 
 * Compare two vaules for value equality. 
 * 
 * Comparisons with {@link equals `equals`} are transitive
 * and symmetric (switching the order of the arguments does not change
 * the result), and is very fast. 
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
    if (Array_isArray(y)) return false
    const yks = Object_keys(y)
    void (ks = Object_keys(x))
    void (len = ks.length)
    if (len !== yks.length) return false
    for (ix = len; ix-- !== 0;) {
      const k = ks[ix]
      if (!yks.includes(k)) return false
      if (!equals(x[k], y[k])) return false
    }
    return true
  }
  return false
}

export function laxEquals<T>(x: T, y: T): boolean
export function laxEquals(x: T, y: T): boolean
export function laxEquals(x: T, y: T): boolean {
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
    if (Array_isArray(y)) return false
    const yks = Object_keys(y).filter((k) => y[k] !== void 0)
    void (ks = Object_keys(x).filter((k) => x[k] !== void 0))
    void (len = ks.length)
    if (len !== yks.length) return false
    for (ix = len; ix-- !== 0;) {
      const k = ks[ix]


      if (!yks.includes(k)) return false
      if (!equals(x[k], y[k])) return false
    }
    return true
  }
  return false
}


