import type * as T from '@traversable/registry'
import { fn, get, accessor, symbol } from '@traversable/registry'
import * as JsonSchema from './types.js'
type JsonSchema = import('./types.js').JsonSchema

export interface Index {
  dataPath: (string | number)[]
  schemaPath: (keyof any)[]
  isOptional: boolean
  refs: Map<string, () => any>
  refHandler?: (x: JsonSchema.Ref) => unknown
  canonicalizeRefName?: (x: JsonSchema.Ref['$ref']) => string
}

export interface CompilerIndex extends Index {
  varName: string
  isProperty: boolean
}

export type Algebra<T> = {
  (src: JsonSchema.F<T>, ix?: Partial<Index>): { result: T, refs: Record<string, () => T> }
  (src: JsonSchema, ix?: Partial<Index>): { result: T, refs: Record<string, () => T> }
  (src: JsonSchema.F<T>, ix?: Partial<Index>): { result: T, refs: Record<string, () => T> }
}

export type Fold = <T>(g: (src: JsonSchema.F<T>, ix: Index, x: JsonSchema) => T) => Algebra<T>

export const defaultIndex = {
  dataPath: [],
  schemaPath: [],
  isOptional: false,
  refs: new Map()
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
        case JsonSchema.isRef(x): return ix.refHandler ? ix.refHandler(x) as never : x
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
              x.properties || {},
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

export const fold = (<T>(g: (src: JsonSchema.F<T>, ix: Index, x: JsonSchema) => T) => (x: JsonSchema.F<T>, ix?: Index) => {
  const { byRef } = resolveRefs(x)
  const foldedRefs = new Map<string, () => unknown>()
  for (let [ref, schema] of byRef) {
    foldedRefs.set(ref, () => ix?.refHandler ? ix.refHandler({ $ref: ref }) : fold_(g)(schema, ix))
  }
  const result = fold_(g)(x, { ...defaultIndex, refs: foldedRefs })
  const refs = ix?.canonicalizeRefName
    ? Object.fromEntries(Array.from(foldedRefs).map(([k, v]) => [ix.canonicalizeRefName!(k), v]))
    : Object.fromEntries(foldedRefs)
  return { result, refs }
}) as Fold

function resolveRefs<T>(schema: JsonSchema.F<T>): {
  byRef: Map<string, JsonSchema.F<T>>
  byValue: Map<JsonSchema.F<T>, string>
} {
  const refs = Array.of<string>()

  void fold_((x) => {
    JsonSchema.isRef(x) && refs.push(x.$ref)
  })(schema)

  const references = refs.map((ref) => {
    const path = (ref.startsWith('#') ? ref.substring(1) : ref.startsWith('#/') ? ref.substring(2) : ref)
      .split('/')
      .filter((_) => _.length > 0)
    return [ref, get(schema, path) as JsonSchema.F<T>] satisfies [any, any]
  })

  return {
    byRef: new Map(references),
    byValue: new Map(references.map(([ref, schema]) => [schema, ref]))
  }
}


export const CompilerFunctor: T.Functor.Ix<CompilerIndex, JsonSchema.Free> = {
  map: Functor.map,
  mapWithIndex(g) {
    return (x, _ix) => {
      const ix = { ..._ix, isProperty: false } satisfies CompilerIndex
      switch (true) {
        default: return x satisfies never
        case JsonSchema.isRef(x): return ix.refs?.get(x.$ref) ?? x.$ref
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

export const compile = fn.catamorphism(CompilerFunctor, defaultCompilerIndex)
