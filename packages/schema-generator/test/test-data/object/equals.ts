import type * as T from '@traversable/registry'
import { Array_isArray, Object_hasOwn, Object_is } from '@traversable/registry'
import type { t } from '@traversable/schema-core'

export type equals<T> = never | T.Equal<T['_type' & keyof T]>
export function equals<S extends { [x: string]: { equals: T.Equal } }>(objectSchema: t.object<S>): equals<t.object<S>>
export function equals<S extends { [x: string]: t.Schema }>(objectSchema: t.object<S>): equals<t.object<S>>
export function equals<S extends { [x: string]: { equals: T.Equal } }>({ def }: t.object<S>): equals<t.object<S>> {
  function objectEquals(l: { [x: string]: unknown }, r: { [x: string]: unknown }) {
    if (Object_is(l, r)) return true
    if (!l || typeof l !== 'object' || Array_isArray(l)) return false
    if (!r || typeof r !== 'object' || Array_isArray(r)) return false
    for (const k in def) {
      const lHas = Object_hasOwn(l, k)
      const rHas = Object_hasOwn(r, k)
      if (lHas) {
        if (!rHas) return false
        if (!def[k].equals(l[k], r[k])) return false
      }
      if (rHas) {
        if (!lHas) return false
        if (!def[k].equals(l[k], r[k])) return false
      }
      if (!def[k].equals(l[k], r[k])) return false
    }
    return true
  }
  return objectEquals
}
