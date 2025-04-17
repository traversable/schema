import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import type { Free } from './shared'
import { MapSymbol, SetSymbol, URI } from './shared'

import { set as Set } from './set'
import { map as Map } from './map'

let map: T.Functor<Free, t.Schema>['map'] = (f) => (x) => {
  switch (true) {
    case x.tag === URI.set: return Set(f(x.def))
    case x.tag === URI.map: return Map(f(x.def[0]), f(x.def[1]))
    default: return t.Functor.map(f)(x)
  }
}

export const Functor: T.Functor.Ix<t.Functor.Index, Free, t.Fixpoint> = {
  map,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        case x.tag === URI.set: return Set(f(x.def, [...ix, SetSymbol]))
        case x.tag === URI.map: return Map(f(x.def[0], [...ix, MapSymbol, 0]), f(x.def[1], [...ix, MapSymbol, 1]))
        default: return t.IndexedFunctor.mapWithIndex(f)(x, ix)
      }
    }
  }
}

export const fold = fn.cataIx(Functor)
