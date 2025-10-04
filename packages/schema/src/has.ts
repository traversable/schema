import { has as has_, URI } from '@traversable/registry'
import * as t from './schema.js'

export const key = t.union(t.string, t.number, t.symbol)

export interface has<KS extends readonly (keyof any)[], S> {
  tag: URI.has
  (u: unknown): u is this['_type']
  _type: has_<KS, S['_type' & keyof S]>
  def: [path: KS, predicate: S]
}

export function has<KS extends readonly (keyof any)[], S extends t.Predicate>(...args: readonly [...path: KS, leafSchema?: S]): has<KS, t.of<S>>
export function has<KS extends readonly (keyof any)[], S extends t.Schema>(...args: readonly [...path: KS, leafSchema?: S]): has<KS, S>
export function has<KS extends readonly (keyof any)[]>(...path: readonly [...KS]): has<KS, t.union<[t.nonnullable, t.null]>>
export function has<KS extends readonly (keyof any)[]>(...args: readonly [...KS]): unknown {
  return has_(...args)
}
