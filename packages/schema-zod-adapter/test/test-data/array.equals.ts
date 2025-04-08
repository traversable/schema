import * as T from '@traversable/registry'
import { has, Array_isArray, Object_is } from '@traversable/registry'
import { t } from '@traversable/schema'

export const extension = {
  type: `equals: equals<this['_type']>`,
  term: 'equals: equals(x)',
} as const

export type equals<T> = never | T.Equal<T>
///
export function equals<S extends t.Schema>(schema: S): equals<S['_type'][]>
export function equals<S>(schema: S): equals<S['_type' & keyof S][]>
export function equals({ def }: { def: unknown }): T.Equal {
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