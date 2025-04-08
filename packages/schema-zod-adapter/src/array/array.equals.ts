import { type Equal } from '@traversable/registry'
import { has, Array_isArray, Object_is } from '@traversable/registry'
import { t } from '@traversable/schema'

export function arrayEquals<S extends t.Schema>(schema: S): Equal<S['_type'][]>
export function arrayEquals<S>(schema: S): Equal<S['_type' & keyof S][]>
export function arrayEquals({ def }: { def: unknown }): Equal {
  let equals = has('equals', (x): x is Equal => typeof x === 'function')(def) ? def.equals : Object_is
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
