import type { Join } from '@traversable/registry'
import { Array_isArray } from '@traversable/registry'
import type { t } from '../../_exports.js'
import { callToString } from '@traversable/schema-to-string'

export interface toString<S, T = S['def' & keyof S]> {
  (): never | [T] extends [readonly []] ? 'unknown'
    /* @ts-expect-error */
    : `(${Join<{ [I in keyof T]: Returns<T[I]['toString']> }, ' & '>})`
}

export function toString<S>(intersectSchema: t.intersect<S>): toString<S>
export function toString<S>({ def }: t.intersect<S>): () => string {
  function intersectToString() {
    return Array_isArray(def) ? def.length === 0 ? 'never' : `(${def.map(callToString).join(' & ')})` : 'unknown'
  }
  return intersectToString
}
