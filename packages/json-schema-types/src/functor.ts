import type * as T from '@traversable/registry'
import { fn, get, has, accessor, symbol } from '@traversable/registry'
import * as JsonSchema from './types.js'
type JsonSchema = import('./types.js').JsonSchema

export interface Index<T = any> {
  dataPath: (string | number)[]
  schemaPath: (keyof any)[]
  isOptional: boolean
  refs: Record<string, () => T>
}

export interface CompilerIndex<T = any> extends Index<T> {
  varName: string
  isProperty: boolean
}

export type Algebra<T> = {
  (src: JsonSchema.F<T>, ix?: Partial<Index<T>>): { result: T, refs: Record<string, () => T> }
  (src: JsonSchema, ix?: Partial<Index<T>>): { result: T, refs: Record<string, () => T> }
  (src: JsonSchema.F<T>, ix?: Partial<Index<T>>): { result: T, refs: Record<string, () => T> }
}

export type Fold = <T>(g: (src: JsonSchema.F<T>, ix: Index<T>, x: JsonSchema) => T) => Algebra<T>

export type CompilerAlgebra<T> = {
  (src: JsonSchema.F<T>, ix?: Partial<CompilerIndex<T>>): { result: T, refs: Record<string, () => T> }
  (src: JsonSchema, ix?: Partial<CompilerIndex<T>>): { result: T, refs: Record<string, () => T> }
  (src: JsonSchema.F<T>, ix?: Partial<CompilerIndex<T>>): { result: T, refs: Record<string, () => T> }
}

export type Compiler = <T>(g: (src: JsonSchema.F<T>, ix: CompilerIndex<T>, x: JsonSchema) => T) => CompilerAlgebra<T>

export const defaultIndex = {
  dataPath: [],
  schemaPath: [],
  isOptional: false,
  refs: Object.create(null),
} satisfies Index

export const defaultCompilerIndex = {
  ...defaultIndex,
  isProperty: false,
  varName: 'value',
} satisfies CompilerIndex

export const Functor: T.Functor.Ix<Index, JsonSchema.Free, JsonSchema> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isNullary(x): return x
        case JsonSchema.isArray(x): return { ...x, items: g(x.items) }
        case JsonSchema.isObject(x): return { ...x, properties: fn.map(x.properties, g) }
        case JsonSchema.isUnion(x): return { anyOf: fn.map(x.anyOf, g) }
        case JsonSchema.isDisjointUnion(x): return { oneOf: fn.map(x.oneOf, g) }
        case JsonSchema.isIntersection(x): return { allOf: fn.map(x.allOf, g) }
        case JsonSchema.isTuple(x): {
          const { items, prefixItems, ...xs } = x
          return { ...xs, ...items && { items: g(items) }, prefixItems: fn.map(x.prefixItems, g) }
        }
        case JsonSchema.isRecord(x): {
          const { additionalProperties: a, patternProperties: p, ...xs } = x
          return { ...xs, ...a && { additionalProperties: g(a) }, ...p && { patternProperties: fn.map(p, g) } }
        }
        case JsonSchema.isUnknown(x): return x
      }
    }
  },
  mapWithIndex(g) {
    return (x, ix) => {
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isRef(x): return x
        case JsonSchema.isNullary(x): return x
        case JsonSchema.isArray(x): return {
          ...x,
          items: g(x.items, { ...ix, schemaPath: [...ix.schemaPath, symbol.array] }, x)
        }
        case JsonSchema.isUnion(x): return {
          anyOf: fn.map(
            x.anyOf,
            (v) => g(v, { ...ix, schemaPath: [...ix.schemaPath, symbol.union] }, x)
          )
        }
        case JsonSchema.isDisjointUnion(x): return {
          oneOf: fn.map(
            x.oneOf,
            (v) => g(v, { ...ix, schemaPath: [...ix.schemaPath, symbol.disjoint] }, x)
          )
        }
        case JsonSchema.isIntersection(x): return {
          allOf: fn.map(
            x.allOf,
            (v) => g(v, { ...ix, schemaPath: [...ix.schemaPath, symbol.intersect] }, x)
          )
        }
        case JsonSchema.isObject(x): {
          return {
            ...x,
            properties: fn.map(
              x.properties || Object.create(null),
              (v, k) => g(v, {
                refs: ix.refs,
                isOptional: !x.required || !x.required.includes(k),
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
            ...items && { items: g(items, { ...ix, schemaPath: [...ix.schemaPath, symbol.tuple] }, x) },
            prefixItems: fn.map(
              prefixItems,
              (v, i) => g(v, { ...ix, dataPath: [...ix.dataPath, i], schemaPath: [...ix.schemaPath, i] }, x)
            )
          }
        }
        case JsonSchema.isRecord(x): {
          const { additionalProperties: a, patternProperties: p, ...xs } = x
          return {
            ...xs,
            ...a && { additionalProperties: g(a, { ...ix, schemaPath: [...ix.schemaPath, symbol.record] }, x) },
            ...p && { patternProperties: fn.map(p, (v, k) => g(v, { ...ix, schemaPath: [...ix.schemaPath, symbol.record, k] }, x)) },
          }
        }
        case JsonSchema.isUnknown(x): return x
      }
    }
  },
}

const fold_ = fn.catamorphism(Functor, defaultIndex)

export const fold = (<T>(g: (src: JsonSchema.F<T>, ix: Index<T>, x: JsonSchema) => T) => (x: JsonSchema.F<T>, ix?: Index) => {
  const refs = fn.map(resolveRefs(x), (schema) => () => fold_(g)(schema, ix))
  return {
    refs,
    result: fold_(g)(x, { ...defaultIndex, refs }),
  }
}) as Fold

function refToPath(x: string) {
  return (x.startsWith('#') ? x.substring(1) : x.startsWith('#/') ? x.substring(2) : x)
    .split('/')
    .filter((_) => _.length > 0)
}

function findRefs(schema: unknown) {
  const refs = new Set<string>()
  function go(x: unknown): void {
    if (JsonSchema.isConst(x)) return
    else if (JsonSchema.isRef(x)) refs.add(x.$ref)
    else if (!!x && typeof x === 'object') Object.values(x).forEach(go)
    else if (Array.isArray(x)) x.forEach(go)
  }
  void go(schema)
  return refs
}

function resolveRefs<T>(schema: JsonSchema.F<T>): Record<string, JsonSchema.F<T>> {
  return [...findRefs(schema)].reduce(
    (acc, ref) => {
      const value = get(schema, refToPath(ref)) as JsonSchema.F<T>
      if (typeof value === 'symbol') {
        throw Error('Could not resolve ref: ' + ref)
      } else {
        acc[ref] = value
        return acc
      }
    },
    Object.create(null) as Record<string, JsonSchema.F<T>>
  )
}

export const CompilerFunctor: T.Functor.Ix<CompilerIndex, JsonSchema.Free> = {
  map: Functor.map,
  mapWithIndex(g) {
    return (x, _ix) => {
      const ix = { ..._ix, isProperty: false } satisfies CompilerIndex
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isRef(x): return x
        case JsonSchema.isNullary(x): return x
        case JsonSchema.isArray(x): return {
          ...x,
          items: g(x.items, {
            refs: ix.refs,
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
                refs: ix.refs,
                dataPath: ix.dataPath,
                isOptional: ix.isOptional,
                isProperty: ix.isProperty,
                schemaPath: [...ix.schemaPath, symbol.union, i],
                varName: ix.varName,
              }, x)
            )
          }
        }
        case JsonSchema.isDisjointUnion(x): {
          const { oneOf, ...rest } = x
          return {
            ...rest,
            oneOf: fn.map(
              oneOf,
              (v, i) => g(v, {
                refs: ix.refs,
                dataPath: ix.dataPath,
                isOptional: ix.isOptional,
                isProperty: ix.isProperty,
                schemaPath: [...ix.schemaPath, symbol.disjoint, i],
                varName: ix.varName,
              }, x)
            )
          }
        }
        case JsonSchema.isIntersection(x): return {
          allOf: fn.map(
            x.allOf,
            (v, i) => g(v, {
              refs: ix.refs,
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
                refs: ix.refs,
                dataPath: [...ix.dataPath, k],
                isOptional: !x.required || !x.required.includes(k),
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
                refs: ix.refs,
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
                refs: ix.refs,
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
                refs: ix.refs,
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
                refs: ix.refs,
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

const compile_ = fn.catamorphism(CompilerFunctor, defaultCompilerIndex)

export const compile = (
  <T>(g: (src: JsonSchema.F<T>, ix: CompilerIndex<T>, x: JsonSchema) => T) => (x: JsonSchema.F<T>, ix?: CompilerIndex) => {
    const refs = fn.map(resolveRefs(x), (schema) => () => compile_(g)(schema, { ...defaultCompilerIndex, ...ix }))
    return {
      refs,
      result: compile_(g)(x, { ...defaultCompilerIndex, ...ix, refs }),
    }
  }
) as Compiler

