import type * as T from '@traversable/registry'
import type { Json } from './exports.js'
import { Cache } from './cache.js'
import { fn, parseKey, symbol } from '@traversable/registry'

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
 * {@link Unary `Json.Unary`} in higher-kind (unapplied) form.
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
        default: return fn.exhaustive(x)
        case isScalar(x): return x
        case isArray(x): return fn.map(x, f)
        case isObject(x): return fn.map(x, f)
      }
    }
  }
}

export declare namespace Functor {
  export interface Index {
    depth: number
    path: (string | number)[]
  }
}

const next
  : (prev: Functor.Index, ...segments: Functor.Index['path']) => Functor.Index
  = ({ depth, path }, ...segments) => ({ depth: depth + 1, path: [...path, ...segments] })

function mapWithIndex<S, T>(f: (s: S, ix: Functor.Index) => T): (x: Unary<S>, ix: Functor.Index) => Unary<T> {
  let root: Unary<S>
  let cached: ReturnType<typeof Cache.new>
  return (x, ix) => {
    if (!root) return (root = x, cached = Cache.new(x), mapWithIndex(f)(x, ix))
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null:
      case x === undefined:
      case x === true:
      case x === false:
      case typeof x === 'number':
      case typeof x === 'string': return x
      case isArray(x): return fn.map(x, (s, i) => f(s, next(ix, i)))
      case isObject(x): return cached(x, ix) || fn.map(x, (s, k) => f(s, next(ix, k)))
    }
  }
}

const IndexedFunctor
  : T.Functor.Ix<Functor.Index, Json.Free, Json.Fixpoint> = {
  map: Functor.map,
  mapWithIndex,
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
export const foldWithIndex = fn.cataIx(IndexedFunctor)

export namespace Recursive {
  const toStringImpl: T.Functor.Algebra<Free, string> = (x) => {
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
  }

  export const toString = fold(toStringImpl)
}

/** 
 * ## {@link toString `Json.toString`}
 */
export const toString = (x: unknown) =>
  !isJson(x) ? JSON_stringify(x, null, 2)
    : Recursive.toString(x)

