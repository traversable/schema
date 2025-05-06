import type { HKT } from '@traversable/registry'
import { NS, URI as URI_, symbol as symbol_ } from '@traversable/registry'
import { has } from '@traversable/registry'
import { t } from '@traversable/schema'

import type { set } from './set'
import type { map } from './map'

export const URI = {
  ...URI_,
  set: `${NS}set`,
  map: `${NS}map`,
} as const

export const SetSymbol = Symbol.for(URI.set)
export const MapSymbol = Symbol.for(URI.map)

export const symbol = {
  ...symbol_,
  set: SetSymbol,
  map: MapSymbol,
}

export const hasToType = has('toType', (u): u is () => string => typeof u === 'function')

export function is<T>(u: unknown): u is t.LowerBound<T> {
  return t.intersect(
    t.has('tag', t.string),
    t.has('def'),
  )(u)
}

export type F<S> =
  | t.F<S>
  | set<S>
  | map<S, S>

export interface Free extends HKT { [-1]: F<this[0]> }

export type Fixpoint =
  | t.Fixpoint
  | set<Fixpoint>
  | map<Fixpoint, Fixpoint>
