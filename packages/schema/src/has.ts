import type { Target } from '@traversable/registry'
import { has as has_ } from '@traversable/registry'
import * as t from './schema.js'

export const key = t.union(t.string, t.number, t.symbol)

export function has<KS extends readonly (keyof any)[], V extends t.Predicate>(...args: readonly [...path: KS, leafSchema?: V]): (u: unknown) => u is has_<KS, Target<V>>
export function has<KS extends readonly (keyof any)[]>(...path: readonly [...KS]): (u: unknown) => u is has_<KS, {} | null>
export function has<KS extends readonly (keyof any)[]>(...args: readonly [...KS]) {
  return has_(...args)
}
