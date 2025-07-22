import type * as T from '@traversable/registry'
import { fn, symbol } from '@traversable/registry'
import * as JsonSchema from './types.js'

export interface Index {
  dataPath: (string | number)[]
  schemaPath: (keyof any)[]
}

export type Algebra<T> = T.IndexedAlgebra<Index, JsonSchema.Free, T>

export const defaultIndex = {
  dataPath: [],
  schemaPath: [],
} satisfies Index

export const Functor: T.Functor.Ix<Index, JsonSchema.Free, JsonSchema.Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isNullary(x): return x
        case JsonSchema.isArray(x): return { ...x, items: f(x.items) }
        case JsonSchema.isObject(x): return { ...x, properties: fn.map(x.properties, f) }
        case JsonSchema.isUnion(x): return { anyOf: fn.map(x.anyOf, f) }
        case JsonSchema.isIntersection(x): return { allOf: fn.map(x.allOf, f) }
        case JsonSchema.isTuple(x): {
          const { items, prefixItems, ...xs } = x
          return { ...xs, ...items && { items: f(items) }, prefixItems: fn.map(x.prefixItems, f) }
        }
        case JsonSchema.isRecord(x): {
          const { additionalProperties: a, patternProperties: p, ...xs } = x
          return { ...xs, ...a && { additionalProperties: f(a) }, ...p && { patternProperties: fn.map(p, f) } }
        }
        case JsonSchema.isUnknown(x): return x
      }
    }
  },
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isNullary(x): return x
        case JsonSchema.isArray(x): return {
          ...x,
          items: f(x.items, { ...ix, schemaPath: [...ix.schemaPath, symbol.array] }, x)
        }
        case JsonSchema.isUnion(x): return {
          anyOf: fn.map(
            x.anyOf,
            (v) => f(v, { ...ix, schemaPath: [...ix.schemaPath, symbol.union] }, x)
          )
        }
        case JsonSchema.isIntersection(x): return {
          allOf: fn.map(
            x.allOf,
            (v) => f(v, { ...ix, schemaPath: [...ix.schemaPath, symbol.intersect] }, x)
          )
        }
        case JsonSchema.isObject(x): {
          return {
            ...x,
            properties: fn.map(
              x.properties,
              (v, k) => f(v, { ...ix, dataPath: [...ix.dataPath, k], schemaPath: [...ix.schemaPath, k] }, x)
            )
          }
        }
        case JsonSchema.isTuple(x): {
          const { items, prefixItems, ...xs } = x
          return {
            ...xs,
            ...items && { items: f(items, { ...ix, schemaPath: [...ix.schemaPath, symbol.tuple] }, x) },
            prefixItems: fn.map(
              prefixItems,
              (v, i) => f(v, { ...ix, dataPath: [...ix.dataPath, i], schemaPath: [...ix.schemaPath, i] }, x)
            )
          }
        }
        case JsonSchema.isRecord(x): {
          const { additionalProperties: a, patternProperties: p, ...xs } = x
          return {
            ...xs,
            ...a && { additionalProperties: f(a, { ...ix, schemaPath: [...ix.schemaPath, symbol.record] }, x) },
            ...p && { patternProperties: fn.map(p, (v, k) => f(v, { ...ix, schemaPath: [...ix.schemaPath, symbol.record, k] }, x)) },
          }
        }
        case JsonSchema.isUnknown(x): return x
      }
    }
  },
}

export const fold = fn.catamorphism(Functor, defaultIndex)
