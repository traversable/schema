import type * as T from '@traversable/registry'
import { fn, symbol, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import { indexAccessor, keyAccessor } from './shared.js'

export type Index = {
  siblingCount: number
  offset: number
  dataPath: (string | number)[]
  isOptional: boolean
  isRoot: boolean
  schemaPath: (keyof any)[]
  varName: string
}

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

export let defaultIndex: Index = {
  siblingCount: 0,
  offset: 2,
  dataPath: [],
  schemaPath: [],
  varName: 'value',
  isRoot: true,
  isOptional: false,
}


let map: T.Functor<Free>['map'] = (f) => (x) => {
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

let mapWithIndex: T.Functor.Ix<Index, Free>['mapWithIndex'] = (f) => (xs, ix) => {
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
    case xs.tag === URI.tuple:
      return t.tuple.def(fn.map(xs.def, (x, i) => f(x, {
        dataPath: [...ix.dataPath, i],
        isOptional: ix.isOptional,
        isRoot: false,
        offset: ix.offset + 2,
        schemaPath: [...ix.schemaPath, i],
        siblingCount: Math.max(xs.def.length - 1, 0),
        /** 
         * Passing `x` to `indexAccessor` is a hack to make sure
         * we preserve the original order of the tuple while we're
         * applying a sorting optimization
         */
        varName: ix.varName + indexAccessor(i, ix, x),
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

export let Functor: T.Functor.Ix<Index, Free> = { map, mapWithIndex }
export let fold = <T>(algebra: Algebra<T>) => (x: IR) => fn.cataIx(Functor)(algebra)(x, defaultIndex)
