import type { HKT } from '@traversable/registry'
import { URI as URI_ } from '@traversable/registry'
import { has } from '@traversable/registry'
import { t } from '@traversable/schema'

import type { set } from './set'
import type { map } from './map'

export const URI = {
  ...URI_,
  set: `@traversable/schema-ext/set`,
  map: `@traversable/schema-ext/map`,
} as const

export const SetSymbol = Symbol.for(URI.set)
export const MapSymbol = Symbol.for(URI.map)

export const hasToString = has('toString', (u) => typeof u === 'function')

export type F<S> =
  | t.F<S>
  | set<S>
  | map<S, S>

export interface Free extends HKT { [-1]: F<this[0]> }

export type Fixpoint =
  | t.Fixpoint
  | set<Fixpoint>
  | map<Fixpoint, Fixpoint>
