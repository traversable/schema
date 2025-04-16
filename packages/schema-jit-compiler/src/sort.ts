import type * as T from '@traversable/registry'
import { fn, symbol, typeName, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import type { Index } from './functor.js'
import { defaultIndex, keyAccessor, indexAccessor } from './functor.js'

export let WeightByTypeName = {
  never: 0,
  any: 10,
  unknown: 20,
  void: 30,
  undefined: 40,
  null: 50,
  symbol: 60,
  boolean: 70,
  integer: 80,
  bigint: 90,
  number: 100,
  string: 110,
  optional: 120,
  intersect: 130,
  union: 140,
  tuple: 150,
  object: 160,
  array: 170,
  record: 180,
  eq: 190,
} as const

export interface Free extends T.HKT { [-1]: IR<this[0]> }
export type Algebra<T = string> = T.IndexedAlgebra<Index, Free, T>

export type IR<T = any> =
  | t.Leaf
  | t.eq<T>
  | t.array<T>
  | t.record<T>
  | t.optional<T>
  | t.union<T[]>
  | t.intersect<readonly T[]>
  | t.tuple<T[]>
  | t.object<[k: string, T][]>


export let map: T.Functor<Free>['map'] = (f) => {
  return (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isNullary(x): return x
      case t.isBoundable(x): return x
      case x.tag === URI.eq: return t.eq.def(x.def as never)
      case x.tag === URI.optional: return t.optional.def(f(x.def))
      case x.tag === URI.array: return t.array.def(f(x.def))
      case x.tag === URI.record: return t.record.def(f(x.def))
      case x.tag === URI.union: return t.union.def(fn.map(x.def, f))
      case x.tag === URI.intersect: return t.intersect.def(fn.map(x.def, f))
      case x.tag === URI.tuple: return t.tuple.def(fn.map(x.def, f))
      case x.tag === URI.object: return t.object.def(
        fn.map(x.def, ([k, v]) => [k, f(v)] satisfies [any, any]),
        undefined,
        x.opt,
      )
    }
  }
}

export let Functor: T.Functor.Ix<Index, Free> = {
  map,
  mapWithIndex(f) {
    return (xs, ix) => {
      switch (true) {
        default: return fn.exhaustive(xs)
        case t.isNullary(xs): return xs
        case t.isBoundable(xs): return xs
        case xs.tag === URI.eq: return xs as never
        case xs.tag === URI.optional: return t.optional.def(f(xs.def, {
          dataPath: ix.dataPath,
          isOptional: true,
          isRoot: false,
          offset: ix.offset + 2,
          schemaPath: [...ix.schemaPath, symbol.optional],
          siblingCount: 0,
          varName: ix.varName,
        }))
        case xs.tag === URI.array: return t.array.def(f(xs.def, {
          dataPath: ix.dataPath,
          isOptional: ix.isOptional,
          isRoot: false,
          offset: ix.offset + 2,
          schemaPath: [...ix.schemaPath, symbol.array],
          siblingCount: 0,
          varName: 'value',
        }))
        case xs.tag === URI.record: return t.record.def(f(xs.def, {
          dataPath: ix.dataPath,
          isOptional: ix.isOptional,
          isRoot: false,
          offset: ix.offset + 2,
          schemaPath: [...ix.schemaPath, symbol.array],
          siblingCount: 0,
          varName: 'value',
        }))
        case xs.tag === URI.union: return t.union.def(fn.map(xs.def, (x, i) => f(x, {
          dataPath: ix.dataPath,
          isOptional: ix.isOptional,
          isRoot: false,
          offset: ix.offset + 2,
          schemaPath: [...ix.schemaPath, i],
          siblingCount: Math.max(xs.def.length - 1, 0),
          varName: ix.varName,
        })))
        case xs.tag === URI.intersect: return t.intersect.def(fn.map(xs.def, (x, i) => f(x, {
          dataPath: ix.dataPath,
          isOptional: ix.isOptional,
          isRoot: false,
          offset: ix.offset + 2,
          schemaPath: [...ix.schemaPath, i],
          siblingCount: Math.max(xs.def.length - 1, 0),
          varName: ix.varName,
        })))
        case xs.tag === URI.tuple: return t.tuple.def(fn.map(xs.def, (x, i) => f(x, {
          dataPath: [...ix.dataPath, i],
          isOptional: ix.isOptional,
          isRoot: false,
          offset: ix.offset + 2,
          schemaPath: [...ix.schemaPath, i],
          siblingCount: Math.max(xs.def.length - 1, 0),
          varName: ix.varName + indexAccessor(i, ix),
        })))
        case xs.tag === URI.object: {
          return t.object.def(
            fn.map(xs.def, ([k, v]) => [k, f(v, {
              dataPath: [...ix.dataPath, k],
              isOptional: ix.isOptional,
              isRoot: false,
              offset: ix.offset + 2,
              schemaPath: [...ix.schemaPath, k],
              siblingCount: Math.max(Object.keys(xs.def).length - 1, 0),
              varName: ix.varName + keyAccessor(k, ix),
            })] satisfies [any, any]),
            undefined,
            xs.opt,
          )
        }
      }
    }
  },
}

export let fold = <T>(algebra: Algebra<T>) => (x: IR) => fn.cataIx(Functor)(algebra)(x, defaultIndex)
export let print = fold((x) => t.isNullary(x) ? x.tag : t.isBoundable(x) ? x.tag : x.def)
export let toIR = t.fold<IR>(
  (x) => x.tag !== URI.object ? x : t.object.def(
    Object.entries(x.def),
    undefined,
    Array.of<string>().concat(x.opt),
  )
)

let aggregateWeights
  : (acc: number, curr: t.Schema) => number
  = (acc, curr) => Math.max(acc, getWeight(curr))

let weightComparator: T.Comparator<IR> = (l, r) => {
  let lw = getWeight(l)
  let rw = getWeight(r)
  return lw < rw ? -1 : rw < lw ? +1 : 0
}

function getWeight(x: IR<t.Schema>): number
function getWeight(x: t.Schema): number
function getWeight(x: IR<t.Schema>): number {
  let w = WeightByTypeName[typeName(x)]
  switch (true) {
    default: return fn.exhaustive(x)
    case t.isNullary(x): return w
    case t.isBoundable(x): return w
    case x.tag === URI.eq: return w
    case x.tag === URI.optional: return w + getWeight(x.def)
    case x.tag === URI.array: return w + getWeight(x.def)
    case x.tag === URI.record: return w + getWeight(x.def)
    case x.tag === URI.union: return w + x.def.reduce(aggregateWeights, 0)
    case x.tag === URI.intersect: return w + x.def.reduce(aggregateWeights, 0)
    case x.tag === URI.tuple: return w + x.def.reduce(aggregateWeights, 0)
    case x.tag === URI.object: return w + x.def.map(([, v]) => v).reduce(aggregateWeights, 0)
  }
}

let sortAlgebra: Algebra<IR> = (x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case t.isNullary(x): return x
    case t.isBoundable(x): return x
    case x.tag === URI.eq: return x
    case x.tag === URI.optional: return t.optional.def(x.def)
    case x.tag === URI.array: return t.array.def(x.def)
    case x.tag === URI.record: return t.record.def(x.def)
    case x.tag === URI.union: return t.union.def(x.def.sort(weightComparator))
    case x.tag === URI.intersect: return t.intersect.def([...x.def].sort(weightComparator))
    case x.tag === URI.tuple: return t.tuple.def(x.def.sort(weightComparator))
    case x.tag === URI.object: return t.object.def(
      x.def.sort(([, l], [, r]) => weightComparator(l, r)),
      undefined,
      x.opt,
    )
  }
}

export let sort
  : (schema: t.Schema) => IR
  = fn.flow(toIR, fold(sortAlgebra))
