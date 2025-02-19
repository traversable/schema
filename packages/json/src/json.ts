// import type * as T from '../../schema/src/types.js'
// import * as fn from '../../schema/src/function.js'
// import { parseKey } from '../../schema/src/parse.js'

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

export const isScalar = (x: unknown) => x == null
  || typeof x === 'boolean'
  || typeof x === 'number'
  || typeof x === 'string'

/** 
 * ## {@link Fixpoint `Json.Fixpoint`}
 * 
 * The recursive definition of JSON. 
 * 
 * On the one hand, this definition is correct. 
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
 * {@link Unary `Unary`} instead.
 */
export type Fixpoint
  = Scalar
  | readonly Fixpoint[]
  | { [x: string]: Fixpoint }

export type Unary<T>
  = Scalar
  | readonly T[]
  | { [x: string]: T }


export const isArray = <T>(x: unknown): x is readonly T[] => globalThis.Array.isArray(x)
export const isObject = <T>(x: unknown): x is { [x: string]: T } => !!x && typeof x === 'object' && !isArray(x)

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
  // export const toString: T.Functor.Algebra<Json.Free, string> = (x) => {
  //   switch (true) {
  //     default: return fn.exhaustive(x)
  //     case typeof x === 'string': return JSON_stringify(x, null, 1)
  //     case isScalar(x): return globalThis.String(x)
  //     case isArray(x): return x.length === 0 ? '[]' : '[' + x.join(', ') + ']'
  //     case isObject(x): {
  //       const xs = Object_entries(x)
  //       return xs.length === 0 ? '{}' : '{ ' + xs.map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' }'
  //     }
  //   }
  // }
}

type Nullary
  = undefined
  | null
  | boolean
  | number
  | string
  ;

type Json
  = Nullary
  | readonly Json[]
  | { [x: string]: Json }
  ;

type F<T>
  = Nullary
  | readonly T[]
  | { [x: string]: T }
  ;

// interface Free extends T.HKT { [-1]: F<this[0]> }

declare namespace Json {
  export {
    Nullary,
    F,
    Json as Fixpoint,
    // Free,
  }
}

// export const Functor: T.Functor<Json.Free, Json.Fixpoint> = {
//   map(f) {
//     return (x) => {
//       switch (true) {
//         default: return fn.exhaustive(x)
//         case is.scalar(x): return x
//         case is.array(x): return fn.map(x, f)
//         case is.object(x): return fn.map(x, f)
//       }
//     }
//   }
// }

namespace Json {
  is.scalar = isScalar
  is.array = isArray
  is.object = isObject

  export function is(u: unknown): u is Json {
    return isScalar(u)
      || (isArray(u) && u.every(Json.is))
      || (isObject(u) && Object_values(u).every(Json.is))
  }


  // export const fold = fn.cata(Json.Functor)
  // export const unfold = fn.ana(Json.Functor)

  /** @internal */
  // const toString_ = fold(Recursive.toString)

  // export const toString = (x: unknown) => !Json.is(x) ? JSON_stringify(x, null, 2) : toString_(x)
}
