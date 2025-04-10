import type { Join } from '@traversable/registry'
import { Array_isArray } from '@traversable/registry'
import { t } from '@traversable/schema'
import { callToString } from '@traversable/schema-to-string'

export type toString<T> = never | [T] extends [readonly []] ? 'never'
  /* @ts-expect-error */
  : `(${Join<{ [I in keyof T]: ReturnType<T[I]['toString']> }, ' & '>})`

export function toString<S>(intersectSchema: t.intersect<S>): toString<S>
export function toString<S>({ def }: t.intersect<S>): string {
  return Array_isArray(def) ? def.length === 0 ? 'never' : `(${def.map(callToString).join(' & ')})` : 'unknown'
}
