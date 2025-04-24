import type { Equal } from '@traversable/registry'
import { has, Array_isArray, Object_is } from '@traversable/registry'
import type { t } from '@traversable/schema-core'

export type equals<T> = never | Equal<T['_type' & keyof T]>

export function equals<S extends { equals: Equal }>(arraySchema: t.array<S>): equals<typeof arraySchema>
export function equals<S extends t.Schema>(arraySchema: t.array<S>): equals<typeof arraySchema>
export function equals({ def }: t.array<{ equals: Equal }>): Equal<unknown[]> {
  let equals = has('equals', (x): x is Equal => typeof x === 'function')(def) ? def.equals : Object_is
  function arrayEquals(l: unknown[], r: unknown[]): boolean {
    if (Object_is(l, r)) return true
    if (Array_isArray(l)) {
      if (!Array_isArray(r)) return false
      let len = l.length
      if (len !== r.length) return false
      for (let ix = len; ix-- !== 0;)
        if (!equals(l[ix], r[ix])) return false
      return true
    } else return false
  }
  return arrayEquals
}
