import type * as T from '@traversable/registry'
import { fn, accessor, symbol } from '@traversable/registry'
import * as JsonSchema from './types.js'

export interface Index {
  dataPath: (string | number)[]
  schemaPath: (keyof any)[]
  isOptional: boolean
}

export interface CompilerIndex extends Index {
  varName: string
  isProperty: boolean
}

export type Algebra<T> = (x: JsonSchema.F<T>, ix: Index, input: JsonSchema.Fixpoint) => T
export type IndexedAlgebra<Ix, T> = (x: JsonSchema.F<T>, ix: Ix, input: JsonSchema.Fixpoint) => T

export const defaultIndex = {
  dataPath: [],
  schemaPath: [],
  isOptional: false,
} satisfies Index

export const defaultCompilerIndex = {
  ...defaultIndex,
  isProperty: false,
  varName: 'value',
} satisfies CompilerIndex


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
              (v, k) => f(v, {
                isOptional: !x.required.includes(k),
                dataPath: [...ix.dataPath, k],
                schemaPath: [...ix.schemaPath, k],
              }, x)
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

export const CompilerFunctor: T.Functor.Ix<CompilerIndex, JsonSchema.Free> = {
  map: Functor.map,
  mapWithIndex(g) {
    return (x, _ix) => {
      const ix = { ..._ix, isProperty: false } satisfies CompilerIndex
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isNullary(x): return x
        case JsonSchema.isArray(x): return {
          ...x,
          items: g(x.items, {
            dataPath: ix.dataPath,
            isOptional: ix.isOptional,
            isProperty: ix.isProperty,
            schemaPath: [...ix.schemaPath, symbol.array],
            varName: 'value',
          }, x)
        }
        case JsonSchema.isUnion(x): {
          const { anyOf, ...rest } = x
          return {
            ...rest,
            anyOf: fn.map(
              anyOf,
              (v, i) => g(v, {
                dataPath: ix.dataPath,
                isOptional: ix.isOptional,
                isProperty: ix.isProperty,
                schemaPath: [...ix.schemaPath, symbol.union, i],
                varName: ix.varName,
              }, x)
            )
          }
        }
        case JsonSchema.isIntersection(x): return {
          allOf: fn.map(
            x.allOf,
            (v, i) => g(v, {
              dataPath: ix.dataPath,
              isOptional: ix.isOptional,
              isProperty: ix.isProperty,
              schemaPath: [...ix.schemaPath, symbol.intersect, i],
              varName: ix.varName,
            }, x)
          )
        }
        case JsonSchema.isObject(x): {
          return {
            ...x,
            properties: fn.map(
              x.properties,
              (v, k) => g(v, {
                dataPath: [...ix.dataPath, k],
                isOptional: !x.required.includes(k),
                isProperty: true,
                schemaPath: [...ix.schemaPath, k],
                varName: ix.varName + accessor(k, ix.isOptional),
              }, x)
            )
          }
        }
        case JsonSchema.isTuple(x): {
          const { items, prefixItems, ...xs } = x
          return {
            ...xs,
            ...items &&
            ({
              items: g(items, {
                dataPath: ix.dataPath,
                isOptional: ix.isOptional,
                isProperty: false,
                schemaPath: [...ix.schemaPath, symbol.tuple],
                varName: 'value',
              }, x)
            }),
            prefixItems: fn.map(
              prefixItems,
              (v, i) => g(v, {
                dataPath: [...ix.dataPath, i],
                isOptional: ix.isOptional,
                isProperty: ix.isProperty,
                schemaPath: [...ix.schemaPath, i],
                varName: ix.varName + accessor(i, ix.isOptional),
              }, x)
            )
          }
        }
        case JsonSchema.isRecord(x): {
          const { additionalProperties: a, patternProperties: p, ...xs } = x
          return {
            ...xs,
            ...a &&
            ({
              additionalProperties: g(a, {
                dataPath: ix.dataPath,
                isOptional: ix.isOptional,
                isProperty: false,
                schemaPath: [...ix.schemaPath, symbol.record],
                varName: 'value',
              }, x)
            }),
            ...p &&
            ({
              patternProperties: fn.map(p, (v, k) => g(v, {
                dataPath: ix.dataPath,
                isOptional: ix.isOptional,
                isProperty: false,
                schemaPath: [...ix.schemaPath, symbol.record, k],
                varName: 'value',
              }, x))
            }),
          }
        }
        case JsonSchema.isUnknown(x): return x
      }
    }
  }
}

export const compile = fn.catamorphism(CompilerFunctor, defaultCompilerIndex)
