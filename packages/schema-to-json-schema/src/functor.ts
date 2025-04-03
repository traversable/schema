import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'

import * as JsonSchema from './specification.js'
type JsonSchema = import('./specification.js').JsonSchema

export const Functor: T.Functor<JsonSchema.Free, JsonSchema> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case JsonSchema.is.nullary(x): return x
        case JsonSchema.is.enum(x): return x
        case JsonSchema.is.const(x): return x
        case JsonSchema.is.union(x): return { ...x, anyOf: fn.map(x.anyOf, f) }
        case JsonSchema.is.intersect(x): return { ...x, allOf: fn.map(x.allOf, f) }
        case JsonSchema.is.tuple(x): return { ...x, items: fn.map(x.items, f) }
        case JsonSchema.is.array(x): return { ...x, items: f(x.items) }
        case JsonSchema.is.object(x): return { ...x, properties: fn.map(x.properties, f) }
        case JsonSchema.is.record(x): return { ...x, additionalProperties: f(x.additionalProperties) }
      }
    }
  },
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
