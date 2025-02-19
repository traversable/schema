import type * as T from './types.js'
import { scalar as isScalar, array as isArray, composite as isObject } from './predicates.js'
import * as fn from './function.js'
import { parseKey } from './parse.js'

export { Json }

/** @internal */
const Object_entries = globalThis.Object.entries
/** @internal */
const JSON_stringify = globalThis.JSON.stringify
/** @internal */
const Object_values
  : <T extends Record<keyof any, unknown>>(xs: T) => (T[keyof T])[]
  = globalThis.Object.values

namespace Recursive {
  export const toString: T.Functor.Algebra<Json.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case typeof x === 'string': return JSON_stringify(x, null, 1)
      case isScalar(x): return globalThis.String(x)
      case isArray(x): return x.length === 0 ? '[]' : '[' + x.join(', ') + ']'
      case isObject(x): {
        const xs = Object_entries(x)
        return xs.length === 0 ? '{}' : '{ ' + xs.map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' }'
      }
    }
  }
}

/**
 * Technically `undefined` is not a valid JSON value, but since 
 * `JSON.stringify(undefined)` returns `undefined` instead of `""`, in
 * practice, it's been more convenient to include it, at least for our
 * use case.
 */
type Nullary
  = undefined
  | null
  | boolean
  | number
  | string

type Json
  = Nullary
  | readonly Json[]
  | { [x: string]: Json }

interface Free extends T.HKT { [-1]: F<this[0]> }

type F<T>
  = Nullary
  | readonly T[]
  | { [x: string]: T }

declare namespace Json {
  export {
    Nullary,
    F,
    Json as Fixpoint,
    Free,
  }
}

namespace Json {
  is.scalar = isScalar
  is.array = isArray
  is.object = isObject

  export function is(u: unknown): u is Json {
    return isScalar(u)
      || (isArray(u) && u.every(Json.is))
      || (isObject(u) && Object_values(u).every(Json.is))
  }

  export const Functor: T.Functor<Json.Free, Json.Fixpoint> = {
    map(f) {
      return (x) => {
        switch (true) {
          default: return fn.exhaustive(x)
          case is.scalar(x): return x
          case is.array(x): return fn.map(x, f)
          case is.object(x): return fn.map(x, f)
        }
      }
    }
  }

  export const fold = fn.cata(Json.Functor)
  export const unfold = fn.ana(Json.Functor)

  /** @internal */
  const toString_ = fold(Recursive.toString)

  export const toString = (x: unknown) => !Json.is(x) ? JSON_stringify(x, null, 2) : toString_(x)
}
