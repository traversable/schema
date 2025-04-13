import { has as has_, URI } from '@traversable/registry'
import type { Schema, SchemaLike } from './types.js'
import type { of } from './schemas/of.js'
import type * as t from './schemas/unknown.js'

export interface has<KS extends readonly (keyof any)[], S> {
  tag: URI.has
  (u: unknown): u is this['_type']
  _type: has_<KS, S['_type' & keyof S]>
  get def(): [path: KS, predicate: S]
}

export function has<KS extends readonly (keyof any)[], S extends SchemaLike>(...args: readonly [...path: KS, leafSchema?: S]): has<KS, of<S>>
export function has<KS extends readonly (keyof any)[], S extends Schema>(...args: readonly [...path: KS, leafSchema?: S]): has<KS, S>
export function has<KS extends readonly (keyof any)[]>(...path: readonly [...KS]): has<KS, t.unknown>
export function has<KS extends readonly (keyof any)[]>(...args: readonly [...KS]) {
  return has_(...args)
}
