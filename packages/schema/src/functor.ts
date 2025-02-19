import * as T from './types.js'
import { t } from './model.js'
import { URI } from './uri.js'
import * as fn from './function.js'

export const Functor: T.Functor<t.Free, t.Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case t.isLeaf(x): return x
        case x.tag === URI.eq: return t.Eq.fix(f(x.def))
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
