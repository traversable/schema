import * as T from '@traversable/registry'
import { fn, URI } from '@traversable/registry'
import { t } from './model.js'

export const Functor: T.Functor<t.Free, t.Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case t.isLeaf(x): return x
        case x.tag === URI.eq: return t.Eq.fix(x.def as never)
        case x.tag === URI.array: return t.Array.fix(f(x.def))
        case x.tag === URI.record: return t.Record.fix(f(x.def))
        case x.tag === URI.optional: return t.Optional.fix(f(x.def))
        case x.tag === URI.tuple: return t.Tuple.fix(fn.map(x.def, f))
        case x.tag === URI.object: return t.Object.fix(fn.map(x.def, f))
        case x.tag === URI.union: return t.Union.fix(fn.map(x.def, f))
        case x.tag === URI.intersect: return t.Intersect.fix(fn.map(x.def, f))
      }
    }
  }
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
