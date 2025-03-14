import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'

import { JsonSchema } from './specification.js'

export const Functor: T.Functor<JsonSchema.Free, JsonSchema.Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case JsonSchema.Nullary(x): return x
        case JsonSchema.enum(x): return x
        case JsonSchema.const(x): return x
        case JsonSchema.union(x): return { ...x, anyOf: fn.map(x.anyOf, f) }
        case JsonSchema.intersect(x): return { ...x, allOf: fn.map(x.allOf, f) }
        case JsonSchema.tuple(x): return { ...x, items: fn.map(x.items, f) }
        case JsonSchema.array(x): return { ...x, items: f(x.items) }
        case JsonSchema.object(x): return { ...x, properties: fn.map(x.properties, f) }
        case JsonSchema.record(x): return { ...x, additionalProperties: f(x.additionalProperties) }
      }
    }
  },
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
