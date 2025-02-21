import { symbol } from '@traversable/registry'

/** @internal */
const isComposite = <T>(u: unknown): u is { [x: string]: T } => !!u && typeof u === "object"
/** @internal */
const Array_isArray = globalThis.Array.isArray
/** @internal */
const isKey = (u: unknown) => typeof u === 'symbol' || typeof u === 'number' || typeof u === 'string'
/** @internal */
const Object_hasOwnProperty = globalThis.Object.prototype.hasOwnProperty
/** @internal */
function hasOwn<K extends keyof any>(u: unknown, key: K): u is { [P in K]: unknown } {
  return typeof key === "symbol"
    ? isComposite(u) && key in u
    : Object_hasOwnProperty.call(u, key)
}
/** @internal */
function parsePath(xs: (keyof any)[] | [...(keyof any)[], (u: unknown) => boolean]):
  [path: (keyof any)[], check: (u: any) => u is any]
function parsePath(xs: (keyof any)[] | [...(keyof any)[], (u: unknown) => boolean]) {
  return Array_isArray(xs) && xs.every(isKey)
    ? [xs, () => true]
    : [xs.slice(0, -1), xs[xs.length - 1]]
}
/** @internal */
function get(x: unknown, ks: (keyof any)[]) {
  let out = x
  let k: keyof any | undefined
  while ((k = ks.shift()) !== undefined) {
    if (hasOwn(out, k)) void (out = out[k])
    else if (k === "") continue
    else return symbol.notfound
  }
  return out
}

export { has }

/** 
 * ## {@link has `tree.has`}
 * 
 * The {@link has `tree.has`} utility accepts a path
 * into a tree and an optional type-guard, and returns 
 * a predicate that returns true if its argument
 * "has" the specified path.
 * 
 * If the optional type-guard is provided, {@link has `tree.has`}
 * will also apply the type-guard to the value it finds at
 * the provided path.
 */
function has<KS extends readonly (keyof any)[]>(...params: [...KS]): (u: unknown) => u is has<KS>
function has<const KS extends readonly (keyof any)[], T>(...params: [...KS, (u: unknown) => u is T]): (u: unknown) => u is has<KS, T>
/// impl.
function has
  (...args: [...(keyof any)[]] | [...(keyof any)[], (u: any) => u is any]) {
  return (u: unknown) => {
    const [path, check] = parsePath(args)
    const got = get(u, path)
    return got !== symbol.notfound && check(got)
  }
}

type has<KS extends readonly (keyof any)[], T = {}> = has.loop<KS, T>
declare namespace has {
  export type loop<KS extends readonly unknown[], T>
    = KS extends readonly [...infer Todo, infer K extends keyof any]
    ? has.loop<Todo, { [P in K]: T }>
    : T extends infer U extends {} ? U : never
}

