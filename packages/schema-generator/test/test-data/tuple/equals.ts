import type { Equal } from '@traversable/registry'
import { Array_isArray, Object_hasOwn, Object_is } from '@traversable/registry'
import { t } from '@traversable/schema'

export type equals<S> = Equal<S['_type' & keyof S]>

export function equals<S extends readonly { equals: Equal }[]>(tupleSchema: t.tuple<readonly [...S]>): equals<typeof tupleSchema>
export function equals<S extends readonly t.Schema[]>(tupleSchema: t.tuple<S>): equals<typeof tupleSchema>
export function equals(tupleSchema: t.tuple<readonly { equals: Equal }[]>) {
  function tupleEquals(l: typeof tupleSchema['_type'], r: typeof tupleSchema['_type']): boolean {
    if (Object_is(l, r)) return true
    if (Array_isArray(l)) {
      if (!Array_isArray(r)) return false
      for (let ix = tupleSchema.def.length; ix-- !== 0;) {
        if (!Object_hasOwn(l, ix) && !Object_hasOwn(r, ix)) continue
        if (Object_hasOwn(l, ix) && !Object_hasOwn(r, ix)) return false
        if (!Object_hasOwn(l, ix) && Object_hasOwn(r, ix)) return false
        if (Object_hasOwn(l, ix) && Object_hasOwn(r, ix)) {
          if (!tupleSchema.def[ix].equals(l[ix], r[ix])) return false
        }
      }
      return true
    }
    return false
  }
  return tupleEquals
}
