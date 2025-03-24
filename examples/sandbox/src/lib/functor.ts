import type * as T from '@traversable/registry'
import { fn } from '@traversable/registry'
import { t } from '@traversable/schema'

import {
  MapSymbol,
  SetSymbol,
  URI,
} from './shared'

import type { Free, Fixpoint } from './shared'
import { set } from './set'
import { map } from './map'

export const Functor: T.Functor<Free, Fixpoint> = {
  map(f) {
    return (x) => {
      switch (true) {
        case x.tag === URI.set: return set(f(x.def))
        case x.tag === URI.map: return map(f(x.def[0]), f(x.def[1]))
        default: return t.Functor.map(f)(x)
      }
    }
  }
}

export const IndexedFunctor: T.Functor.Ix<t.Functor.Index, Free, Fixpoint> = {
  ...Functor,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x.tag === URI.set: return set(f(x.def, [...ix, SetSymbol]))
        case x.tag === URI.map: return map(f(x.def[0], [...ix, MapSymbol]), f(x.def[1], [...ix, MapSymbol]))
        case t.is(x): return t.IndexedFunctor.mapWithIndex(f)(x, ix)
      }
    }
  },
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
export const foldWithIndex = fn.cataIx(IndexedFunctor)

export namespace Recursive {
  export const toString: T.Algebra<Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.set: return 'Set<' + x.def + '>'
      case x.tag === URI.map: return 'Map<' + x.def + '>'
      case t.is(x): return t.recurse.toString(x)
    }
  }
}
