import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'

import * as JsonSchema from './specification.js'
type JsonSchema = import('./specification.js').JsonSchema

export type Index = {
  depth: number
  path: (string | number)[]
}

export const defaultIndex = {
  depth: 0,
  path: [],
} satisfies Index

export declare namespace Functor { export { Index } }
export const Functor: T.Functor.Ix<Index, JsonSchema.Free, JsonSchema> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case JsonSchema.is.nullary(x): return x
        case JsonSchema.is.enum(x): return x
        case JsonSchema.is.ref(x): return x
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
  mapWithIndex(f) {
    return (x, ix) => {
      const { depth, path } = ix
      switch (true) {
        default: return fn.exhaustive(x)
        case JsonSchema.is.nullary(x): return x
        case JsonSchema.is.enum(x): return x
        case JsonSchema.is.const(x): return x
        case JsonSchema.is.ref(x): return x
        case JsonSchema.is.tuple(x): return { ...x, items: fn.map(x.items, (v, i) => f(v, { depth: depth + 1, path: [...path, i] }, x)) }
        case JsonSchema.is.array(x): return { ...x, items: f(x.items, { depth: depth + 1, path }, x) }
        case JsonSchema.is.union(x): return { ...x, anyOf: fn.map(x.anyOf, (v, i) => f(v, { depth: depth + 1, path: [...path, i] }, x)) }
        case JsonSchema.is.intersect(x): return { ...x, allOf: fn.map(x.allOf, (v, i) => f(v, { depth: depth + 1, path: [...path, i] }, x)) }
        case JsonSchema.is.object(x): return { ...x, properties: fn.map(x.properties, (v, k) => f(v, { depth: depth + 1, path: [...path, k] }, x)) }
        case JsonSchema.is.record(x): return { ...x, additionalProperties: f(x.additionalProperties, { depth: depth + 1, path }, x) }
      }
    }
  }
}


export const fold = fn.cataIx(Functor, defaultIndex)
