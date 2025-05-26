import { Object_assign } from '@traversable/registry/globalThis'
import * as symbol from './symbol.js'

/** @internal */
const Object_hasOwnProperty = globalThis.Object.prototype.hasOwnProperty

/** @internal */
const isComposite = <T>(u: unknown): u is { [x: string]: T } => !!u && typeof u === 'object'

/** @internal */
function hasOwn<K extends keyof any>(u: unknown, key: K): u is { [P in K]: unknown }
function hasOwn(u: unknown, key: keyof any): u is { [x: string]: unknown } {
  return !isComposite(u)
    ? typeof u === 'function' && key in u
    : typeof key === 'symbol'
      ? isComposite(u) && key in u
      : Object_hasOwnProperty.call(u, key)
}

/** 
 * @internal 
 * 
 * {@link get `get`} uses {@link symbol.notfound `symbol.notfound`} as a
 * sentinel-like to differentiate between the separate cases of 
 * "path not found" and "value at path was undefined"
 */
export function get<T>(x: T, ks: (keyof any)[]) {
  let out: unknown = x
  let k: keyof any | undefined
  while ((k = ks.shift()) !== undefined) {
    if (hasOwn(out, k)) void (out = out[k])
    else if (k === '') continue
    else return symbol.notfound
  }
  return out
}

get.lazy = function get_lazy(...ks: (keyof any)[]) { return <T>(x: T) => get(x, ks) }

export function set<T>(x: T, k: keyof any, v: unknown): T {
  return !!x && (typeof x === 'object' || typeof x === 'function')
    ? has(k)(x) && x[k] === v ? x
      : Object_assign({}, x, { [k]: v })
    : x
}

set.lazy = function set_lazy(k: keyof any): <V>(v: V) => <T>(x: T) => T { return (v) => (x) => set(x, k, v) }

export function modify<T, K extends keyof T>(x: T, k: K, f: (y: T[K]) => T[K]): T {
  if (!has(k)(x)) {
    return x
  } else {
    const prev = x[k]
    const next = f(prev)
    if (prev === next) return x
    else return Object_assign(x, { [k]: next })
  }
}

modify.lazy = function modify_lazy<T, K extends keyof T>(k: K, f: (y: T[K]) => T[K]): (x: T) => T {
  return (x) => modify(x, k, f)
}

export function fromPath(ks: (keyof any)[], seed: unknown) {
  let out: unknown = seed
  let k: keyof any | undefined
  while ((k = ks.pop()) !== undefined) out = { [k]: out }
  return out
}

const isKey = (u: unknown) => typeof u === 'symbol' || typeof u === 'number' || typeof u === 'string'

/** @internal */
export function parsePath(xs: readonly (keyof any)[] | readonly [...(keyof any)[], (u: unknown) => boolean]):
  [path: (keyof any)[], check: (u: any) => u is any]
export function parsePath(xs: readonly (keyof any)[] | readonly [...(keyof any)[], (u: unknown) => boolean]) {
  return Array.isArray(xs) && xs.every(isKey)
    ? [xs, () => true]
    : [xs.slice(0, -1), xs[xs.length - 1]]
}

export type has<KS extends readonly (keyof any)[], T = {}> = has.loop<KS, T>

export declare namespace has {
  export type loop<KS extends readonly unknown[], T>
    = KS extends readonly [...infer Todo, infer K extends keyof any]
    ? has.loop<Todo, { [P in K]: T }>
    : T extends infer U extends {} ? U : never
}

/** 
 * ## {@link has `tree.has`}
 * 
 * The {@link has `tree.has`} utility accepts a path
 * into a tree and an optional type-guard, and returns 
 * a predicate that returns true if its argument
 * 'has' the specified path.
 * 
 * If the optional type-guard is provided, {@link has `tree.has`}
 * will also apply the type-guard to the value it finds at
 * the provided path.
 */
export function has<KS extends readonly (keyof any)[]>(...params: [...KS]): (u: unknown) => u is has<KS>
export function has<const KS extends readonly (keyof any)[], T>(...params: [...KS, (u: unknown) => u is T]): (u: unknown) => u is has<KS, T>
// impl.
export function has(
  ...args:
    | [...path: (keyof any)[]]
    | [...path: (keyof any)[], check: (u: any) => u is any]
) {
  return (u: unknown) => {
    const [path, check] = parsePath(args)
    const got = get(u, path)
    return got !== symbol.notfound && check(got)
  }
}
