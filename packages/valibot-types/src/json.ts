import * as v from 'valibot'
import type * as T from '@traversable/registry'
import { Array_isArray, fn } from '@traversable/registry'
import { Json } from '@traversable/json'

import * as F from './functor.js'

const next
  : (prev: F.Functor.Index, ...segments: F.Functor.Index['path']) => F.Functor.Index
  = ({ depth, path }, ...segments) => ({ depth: depth + 1, path: [...path, ...segments] })

export const Iso: T.Functor.Ix<F.Functor.Index, Json.Free, Json.Fixpoint> = {
  map: Json.Functor.map,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case x === true:
        case x === false:
        case typeof x === 'number':
        case typeof x === 'string': return x
        case Array_isArray(x): return fn.map(x, (s, i) => f(s, next(ix, i), x))
        case !!x && typeof x === 'object': return fn.map(x, (s, k) => f(s, next(ix, k), x))
      }
    }
  }
}


/** 
 * ## {@link fromConstant `valibot.fromConstant`}
 */
export const fromConstant = Json.fold<F.LowerBound>((x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case x === null: return v.null()
    case x === undefined: return v.undefined()
    case typeof x === 'symbol':
    case typeof x === 'boolean':
    case typeof x === 'number':
    case typeof x === 'bigint':
    case typeof x === 'string': return v.literal(x)
    case Array_isArray(x): return x.length === 0 ? v.tuple([]) : v.strictTuple(x)
    case !!x && typeof x === 'object': return v.strictObject(x)
  }
})
