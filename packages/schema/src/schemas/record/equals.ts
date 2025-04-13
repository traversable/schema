import type { Equal } from '@traversable/registry'
import { Array_isArray, Object_is, Object_keys, Object_hasOwn } from '@traversable/registry'
import type { t } from '../../_exports.js'

export type equals<T> = never | Equal<T['_type' & keyof T]>
export function equals<S extends { equals: Equal }>(recordSchema: t.record<S>): equals<typeof recordSchema>
export function equals<S extends t.Schema>(recordSchema: t.record<S>): equals<typeof recordSchema>
export function equals({ def }: t.record<{ equals: Equal }>): Equal<Record<string, unknown>> {
  function recordEquals(l: Record<string, unknown>, r: Record<string, unknown>): boolean {
    if (Object_is(l, r)) return true
    if (!l || typeof l !== 'object' || Array_isArray(l)) return false
    if (!r || typeof r !== 'object' || Array_isArray(r)) return false
    const lhs = Object_keys(l)
    const rhs = Object_keys(r)
    let len = lhs.length
    let k: string
    if (len !== rhs.length) return false
    for (let ix = len; ix-- !== 0;) {
      k = lhs[ix]
      if (!Object_hasOwn(r, k)) return false
      if (!(def.equals(l[k], r[k]))) return false
    }
    len = rhs.length
    for (let ix = len; ix-- !== 0;) {
      k = rhs[ix]
      if (!Object_hasOwn(l, k)) return false
      if (!(def.equals(l[k], r[k]))) return false
    }
    return true
  }
  return recordEquals
}
