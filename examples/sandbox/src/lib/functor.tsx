import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'
import { t } from '@traversable/schema'

import type { Free, Fixpoint } from './shared'
import { MapSymbol, SetSymbol, URI } from './shared'

import { set as Set } from './set'
import { map as Map } from './map'

const map: T.Functor<Free, t.Schema>['map'] = (f) => (x) => {
  switch (true) {
    case x.tag === URI.set: return Set(f(x.def))
    case x.tag === URI.map: return Map(f(x.def[0]), f(x.def[1]))
    default: return t.Functor.map(f)(x)
  }
}

export const Functor: T.Functor.Ix<t.Functor.Index, Free, Fixpoint> = {
  map,
  mapWithIndex(f) {
    return (x, ix) => {
      const { depth, path } = ix
      switch (true) {
        default: return fn.exhaustive(x)
        case x.tag === URI.set: return Set(f(x.def, { path: [...path, SetSymbol], depth: depth + 1 }, x))
        case x.tag === URI.map: return Map(
          f(x.def[0], { path: [...path, MapSymbol, 0], depth: depth + 1 }, x),
          f(x.def[1], { path: [...path, MapSymbol, 0], depth: depth + 1 }, x)
        )
        case x.tag === URI.ref: return t.ref.def(f(x.def, ix, x), x.id)
        case t.isCore(x): return t.IndexedFunctor.mapWithIndex(f)(x, ix)
      }
    }
  },
}

export const fold = fn.cataIx(Functor)
