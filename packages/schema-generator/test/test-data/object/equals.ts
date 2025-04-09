import type * as T from '@traversable/registry'
import {
  Array_isArray,
  Object_hasOwn,
  Object_is,
} from '@traversable/registry'
import type { t } from '@traversable/schema'

export type equals<T> = never | T.Equal<T['_type' & keyof T]>
export function equals<S extends t.object<{ [x: string]: { equals: T.Equal } }>>(objectSchema: S): equals<S>
export function equals<S extends t.object>(objectSchema: S): equals<S>
export function equals(objectSchema: t.object<{ [x: string]: { equals: T.Equal } }>): T.Equal<{ [x: string]: unknown }> {
  return (l, r) => {
    if (Object_is(l, r)) return true
    if (!l || typeof l !== 'object' || Array_isArray(l)) return false
    if (!r || typeof r !== 'object' || Array_isArray(r)) return false
    for (const k in objectSchema.def) {
      const lHas = Object_hasOwn(l, k)
      const rHas = Object_hasOwn(r, k)
      if (lHas) {
        if (!rHas) return false
        if (!objectSchema.def[k].equals(l[k], r[k])) return false
      }
      if (rHas) {
        if (!lHas) return false
        if (!objectSchema.def[k].equals(l[k], r[k])) return false
      }
      if (!objectSchema.def[k].equals(l[k], r[k])) return false
    }
    return true
  }
}
