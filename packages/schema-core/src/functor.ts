import * as T from '@traversable/registry'
import { fn, URI, symbol } from '@traversable/registry'
import { t } from './core.js'

export declare namespace Functor {
  type Index = (keyof any)[]
}

export const Functor: T.Functor<t.Free, t.Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case t.isLeaf(x): return x
        case x.tag === URI.eq: return t.Eq.def(x.def as never)
        case x.tag === URI.array: return t.Array.def(f(x.def))
        case x.tag === URI.record: return t.Record.def(f(x.def))
        case x.tag === URI.optional: return t.Optional.def(f(x.def))
        case x.tag === URI.tuple: return t.Tuple.def(fn.map(x.def, f))
        case x.tag === URI.object: return t.Object.def(fn.map(x.def, f))
        case x.tag === URI.union: return t.Union.def(fn.map(x.def, f))
        case x.tag === URI.intersect: return t.Intersect.def(fn.map(x.def, f))
      }
    }
  }
}

export const IndexedFunctor: T.Functor.Ix<Functor.Index, t.Free, t.Fixpoint> = {
  ...Functor,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case t.isLeaf(x): return x
        case x.tag === URI.eq: return t.Eq.def(x.def as never)
        case x.tag === URI.array: return t.Array.def(f(x.def, ix))
        case x.tag === URI.record: return t.Record.def(f(x.def, ix))
        case x.tag === URI.optional: return t.Optional.def(f(x.def, ix))
        case x.tag === URI.tuple: return t.Tuple.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])))
        case x.tag === URI.object: return t.Object.def(fn.map(x.def, (y, iy) => f(y, [...ix, iy])))
        case x.tag === URI.union: return t.Union.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.union, iy])))
        case x.tag === URI.intersect: return t.Intersect.def(fn.map(x.def, (y, iy) => f(y, [...ix, symbol.intersect, iy])))
      }
    }
  },
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
const foldWithIndex_ = fn.cataIx(IndexedFunctor)
export const foldWithIndex
  : <T>(algebra: T.IndexedAlgebra<Functor.Index, t.Free, T>) => <S extends t.Fixpoint>(x: S, ix?: Functor.Index) => T
  = (algebra) => (x, ix) => foldWithIndex_(algebra)(x, ix ?? [])
