import type { Join } from '@traversable/registry'
import { Array_isArray } from '@traversable/registry'
import { t } from '../../_exports.js'
import { callToString } from '@traversable/schema-to-string'

export interface toString<S, T = S['def' & keyof S]> {
  (): never | [T] extends [readonly []] ? 'never'
    /* @ts-expect-error */
    : `(${Join<{ [I in keyof T]: ReturnType<T[I]['toString']> }, ' | '>})`
}

export function toString<S>(unionSchema: t.union<S>): toString<S>
export function toString<S>({ def }: t.union<S>): () => string {
  function unionToString() {
    return Array_isArray(def) ? def.length === 0 ? 'never' : `(${def.map(callToString).join(' | ')})` : 'unknown'
  }
  return unionToString
}
