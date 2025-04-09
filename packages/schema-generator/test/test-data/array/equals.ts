import type * as T from '@traversable/registry'
import { has, Array_isArray, Object_is } from '@traversable/registry'
import type { t } from '@traversable/schema'

export type equals<T> = never | T.Equal<T['_type' & keyof T]>
export function equals<S extends t.array<t.Schema>>(arraySchema: S): equals<S>
export function equals<S>(arraySchema: S): equals<S>
export function equals({ def: { def } }: { def: { def: unknown } }): T.Equal {
  let equals = has('equals', (x): x is T.Equal => typeof x === 'function')(def) ? def.equals : Object_is
  return (l, r) => {
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
}
