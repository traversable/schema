import type * as T from '@traversable/registry'
import { fn, isValidIdentifier, parseKey, symbol, URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

/** @internal */
let isProp = t.union(t.string, t.number)

export type F<T> =
  | t.Leaf
  | t.eq<T>
  | t.array<T>
  | t.record<T>
  | t.optional<T>
  | t.union<T[]>
  | t.intersect<readonly T[]>
  | t.tuple<T[]>
  | t.object<[k: string, v: T][]>

export type Fixpoint =
  | t.Leaf
  | t.eq<Fixpoint>
  | t.array<Fixpoint>
  | t.record<Fixpoint>
  | t.optional<Fixpoint>
  | t.union<Fixpoint[]>
  | t.intersect<Fixpoint[]>
  | t.tuple<Fixpoint[]>
  | t.object<[k: string, v: Fixpoint][]>

export interface Free extends T.HKT { [-1]: F<this[0]> }

export function keyAccessor(key: keyof any | undefined, $: Index) {
  return typeof key === 'string' ? isValidIdentifier(key) ? $.isOptional
    ? `?.${key}`
    : `.${key}`
    : `[${parseKey(key)}]`
    : ''
}

// Reading `x` to access the "preSortIndex" is a hack to make sure
// we preserve the original order of the tuple, even while sorting
export function indexAccessor(index: keyof any | undefined, $: { isOptional?: boolean }, x?: any) {
  return 'preSortIndex' in x
    ? $.isOptional ? `?.[${x.preSortIndex}]` : `[${x.preSortIndex}]`
    : typeof index === 'number' ? $.isOptional
      ? `?.[${index}]`
      : `[${index}]`
      : ''
}

export let defaultIndex: Index = {
  siblingCount: 0,
  offset: 2,
  dataPath: [],
  schemaPath: [],
  varName: 'value',
  isRoot: true,
  isOptional: false,
}

/** @internal */
let map
  : T.Functor<Free, Fixpoint>['map']
  = (f) => function jitMap(xs) {
    switch (true) {
      default: return fn.exhaustive(xs)
      case t.isNullary(xs): return xs
      case t.isBoundable(xs): return xs
      case xs.tag === URI.eq: return t.eq(xs.def as never)
      case xs.tag === URI.optional: return t.optional.def(f(xs.def))
      case xs.tag === URI.array: return t.array.def(f(xs.def))
      case xs.tag === URI.record: return t.record.def(f(xs.def))
      case xs.tag === URI.union: return t.union.def(xs.def.map(f))
      case xs.tag === URI.intersect: return t.intersect.def(xs.def.map(f))
      case xs.tag === URI.tuple: return t.tuple.def(xs.def.map(f))
      case xs.tag === URI.object: return t.object.def(
        xs.def.map(([k, v]) => [k, f(v)] satisfies [any, any]),
        undefined,
        xs.opt,
      )
    }
  }

export function makeFunctor<Opts>(updateIndex: UpdateIndex<Opts>): T.Functor.Ix<Opts, Free> {
  return {
    map,
    mapWithIndex(f) {
      return function jitMap(xs, ix) {
        switch (true) {
          default: return fn.exhaustive(xs)
          case t.isNullary(xs): return xs
          case t.isBoundable(xs): return xs
          case xs.tag === URI.eq: return t.eq(xs.def as never)
          case xs.tag === URI.optional: return t.optional.def(f(xs.def, updateIndex(ix, xs, [symbol.optional])))
          case xs.tag === URI.array: return t.array.def(f(xs.def, updateIndex(ix, xs, [symbol.array])))
          case xs.tag === URI.record: return t.record.def(f(xs.def, updateIndex(ix, xs, [symbol.record])))
          case xs.tag === URI.union: return t.union.def(xs.def.map((x, i) => f(x, updateIndex(ix, xs, [symbol.union, i]))))
          case xs.tag === URI.intersect: return t.intersect.def(xs.def.map((x, i) => f(x, updateIndex(ix, xs, [symbol.intersect, i]))))
          case xs.tag === URI.tuple: return t.tuple.def(xs.def.map((x, i) => f(x, updateIndex(ix, xs, [i]))))
          case xs.tag === URI.object: return t.object.def(
            xs.def.map(([k, v]) => [k, f(v, updateIndex(ix, xs, [k]))] satisfies [any, any]),
            undefined,
            xs.opt,
          )
        }
      }
    }
  }
}

export function makeFold<T, Opts extends Index>(
  algebra: Algebra<T, Opts>,
  updateIndex: UpdateIndex<Opts>
): <S>(term: F<S>, ix: Opts) => T

export function makeFold<T>(
  algebra: Algebra<T, Index>,
  updateIndex: UpdateIndex<Index>
): (term: F<unknown>, ix: Index) => T {
  return fn.cataIx(makeFunctor(updateIndex))(algebra)
}

export type Index = {
  siblingCount: number
  offset: number
  dataPath: (string | number)[]
  isOptional: boolean
  isRoot: boolean
  schemaPath: (keyof any)[]
  varName: string
}

export type Algebra<T, Opts extends Index = Index> = T.IndexedAlgebra<Opts, Free, T>
export type UpdateIndex<Opts> = (prev: Opts, x: F<any>, i: (keyof any)[]) => Opts

export interface Functor<Opts extends Index> extends T.Functor.Ix<Opts, Free> {}
export declare namespace Functor { export { Algebra, Index } }

export let Functor = makeFunctor((prev: Index, x, ix) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case t.isNullary(x): return prev
    case t.isBoundable(x): return prev
    case x.tag === URI.eq: return prev
    case x.tag === URI.optional: return {
      dataPath: prev.dataPath,
      offset: prev.offset + 2,
      isOptional: true,
      isRoot: false,
      schemaPath: [...prev.schemaPath, symbol.optional],
      siblingCount: 0,
      varName: prev.varName,
    }
    case x.tag === URI.array: return {
      dataPath: prev.dataPath,
      offset: prev.offset + 2,
      isOptional: prev.isOptional,
      isRoot: false,
      schemaPath: [...prev.schemaPath, symbol.array],
      siblingCount: 0,
      varName: 'value',
    }
    case x.tag === URI.record: return {
      dataPath: prev.dataPath,
      offset: prev.offset + 2,
      isOptional: prev.isOptional,
      isRoot: false,
      schemaPath: [...prev.schemaPath, symbol.record],
      siblingCount: 0,
      varName: prev.varName,
    }
    case x.tag === URI.union: return {
      dataPath: prev.dataPath,
      offset: prev.offset + 2,
      isOptional: prev.isOptional,
      isRoot: false,
      schemaPath: [...prev.schemaPath, symbol.union, ...ix],
      siblingCount: Math.max(x.def.length - 1, 0),
      varName: prev.varName,
    }
    case x.tag === URI.intersect: return {
      dataPath: prev.dataPath,
      offset: prev.offset + 2,
      isOptional: prev.isOptional,
      isRoot: false,
      schemaPath: [...prev.schemaPath, symbol.intersect, ...ix],
      siblingCount: Math.max(x.def.length - 1, 0),
      varName: prev.varName,
    }
    case x.tag === URI.tuple: return {
      dataPath: [...prev.dataPath, ...ix.filter(isProp)],
      offset: prev.offset + 2,
      isOptional: prev.isOptional,
      isRoot: false,
      schemaPath: [...prev.schemaPath, ...ix],
      siblingCount: Math.max(x.def.length - 1, 0),
      varName: prev.varName + indexAccessor(ix[0], prev),
    }
    case x.tag === URI.object: {
      return {
        dataPath: [...prev.dataPath, ...ix.filter(isProp)],
        offset: prev.offset + 2,
        isOptional: prev.isOptional,
        isRoot: false,
        schemaPath: [...prev.schemaPath, ...ix],
        siblingCount: Math.max(Object.keys(x.def).length - 1, 0),
        varName: prev.varName + keyAccessor(ix[0], prev),
      }
    }
  }
})

export let fold
  : <T>(algebra: T.IndexedAlgebra<Index, Free, T>) => <S extends t.Schema>(schema: S, index?: Index) => T
  = (algebra) => (schema, index = defaultIndex) => fn.cataIx(Functor)(algebra)(schema as never, index)
