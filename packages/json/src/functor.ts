import type * as T from '@traversable/registry'
import type { Json } from './exports.js'
import { Cache } from './cache.js'
import { fn, parseKey } from '@traversable/registry'

/** @internal */
const Object_entries = globalThis.Object.entries
/** @internal */
const JSON_stringify = globalThis.JSON.stringify
/** @internal */
const Object_values = globalThis.Object.values

/**
 * ## {@link Scalar `Json.Scalar`}
 * 
 * a.k.a "leaves" or "terminal nodes"
 * 
 * Note: strictly speaking, `undefined` is not a valid JSON value. It's
 * included here because in practice `JSON.stringify(undefined)` returns
 * `undefined` instead of the empty string.
 */
export type Scalar
  = undefined
  | null
  | boolean
  | number
  | string

/** 
 * ## {@link Fixpoint `Json.Fixpoint`}
 * 
 * This type represents the what's called (to get math-y)
 * the "fixpoint" of the Json Functor.
 * 
 * There are reasons to use {@link Fixpoint `Json.Fixpoint`} over
 * {@link Unary `Json.Unary`}, and vice-versa.
 * 
 * Note that, on the one hand, this definition is correct. 
 * 
 * On the other hand, it's also infinite. And since types
 * aren't tied to actual data, we don't have a type-level 
 * "base case" we can fall back on.
 * 
 * In fact, the only reason our IDE doesn't start
 * slogging is because TypeScript compiler does extra work
 * to "cache" this type, and detect the circular reference.
 * 
 * While this type happens to work in this case, it's also brittle:
 * a small change in its definition could cause the TS compiler to
 * cache things differently, and we might wind up with a very
 * difference performance profile.
 * 
 * If you'd prefer to avoid this problem (and others like it), use 
 * {@link Unary `Json.Unary`} instead.
 */
export type Fixpoint
  = Scalar
  | readonly Fixpoint[]
  | { [x: string]: Fixpoint }

export type NonJson =
  | symbol
  | bigint
  | globalThis.Date
  | globalThis.RegExp
  | globalThis.Set<any>
  | globalThis.Map<any, any>
  | { (...args: any): any }

export type Mut<T>
  = [T] extends [infer U extends Scalar] ? U
  : { -readonly [I in keyof T]: Mut<T[I]> }

/**
 * ## {@link Unary `Json.Unary`}
 * 
 * Non-recursive definition of JSON.
 * 
 * Non-recursive because the recursion is "factored out". 
 * 
 * The use case for {@link Unary `Json.Unary`} is when you've
 * also factored the recursion out of a recursive algorithm, which is
 * what this project is all about: leveraging well-known, well-founded
 * ideas from math to "factor out" recursion.
 */
export type Unary<T>
  = Scalar
  | readonly T[]
  | { [x: string]: T }

/**
 * ## {@link Free `Json.Free`}
 * 
 * Like {@link Unary `Json.Unary`}, but unapplied.
 */
export interface Free extends T.HKT { [-1]: Unary<this[0]> }

export const isScalar = (x: unknown) => x == null
  || typeof x === 'boolean'
  || typeof x === 'number'
  || typeof x === 'string'

export const isArray
  : <T>(x: unknown) => x is readonly T[]
  = globalThis.Array.isArray

export const isObject = <T>(x: unknown): x is { [x: string]: T } =>
  !!x && typeof x === 'object' && !isArray(x)

/** 
 * ## {@link isJson `Json.is`}
 * 
 * Validates that its input is a valid JSON value.
 * 
 * **Note:** the implementation of {@link is `Json.is`}
 * is recursive.
 */
export function isJson(u: unknown): u is Json {
  return isScalar(u)
    || (isArray(u) && u.every(isJson))
    || (isObject(u) && Object_values(u).every(isJson))
}

/**
 * ## {@link Functor `Json.Functor`}
 * 
 * You can think of a Functor as a container. It exposes
 * a port called `map` that lets us apply an arbitrary
 * function to the value(s) inside.
 */
export const Functor: T.Functor<Free, Json> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return x
        case isScalar(x): return x
        case isArray(x): return fn.map(x, f)
        case isObject(x): return fn.map(x, f)
      }
    }
  }
}

export const defaultIndex = {
  depth: 0,
  path: Array.of<string | number>(),
} satisfies Functor.Index

export declare namespace Functor {
  export interface Index {
    depth: number
    path: (string | number)[]
  }
}

const IndexedFunctor: T.Functor.Ix<Functor.Index, Json.Free, Json.Fixpoint> = {
  ...Functor,
  mapWithIndex(f) {
    return (x, { depth, path }) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isScalar(x): return x
        case isArray(x): return fn.map(x, (s, i) => f(s, { path: [...path, i], depth: depth + 1 }, x))
        case isObject(x): return fn.map(x, (s, k) => f(s, { path: [...path, k], depth: depth + 1 }, x))
      }
    }
  },
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
export const foldWithIndex = fn.cataIx(IndexedFunctor)

/** 
 * ## {@link toString `Json.toString`}
 */
export const toString = (x: unknown) => !isJson(x)
  ? JSON_stringify(x, null, 2)
  : fold<string>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case typeof x === 'string': return JSON_stringify(x, null, 1)
      case isScalar(x): return globalThis.String(x)
      case isArray(x): return x.length === 0 ? '[]' : '[' + x.join(', ') + ']'
      case isObject(x): {
        const xs = Object_entries(x)
        return xs.length === 0
          ? '{}'
          : '{ ' + xs.map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' }'
      }
    }
  })(x)
