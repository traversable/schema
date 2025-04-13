import type { Equal } from '@traversable/registry'
import { Object_is } from '@traversable/registry'
import type { t } from '../../_exports.js'

export type equals<S> = Equal<S['_type' & keyof S]>
export function equals<S extends readonly { equals: Equal }[]>(unionSchema: t.union<[...S]>): equals<typeof unionSchema>
export function equals<S extends readonly t.Schema[]>(unionSchema: t.union<[...S]>): equals<typeof unionSchema>
export function equals({ def }: t.union<{ equals: Equal }[]>): Equal<unknown> {
  function unionEquals(l: unknown, r: unknown): boolean {
    if (Object_is(l, r)) return true
    for (let ix = def.length; ix-- !== 0;)
      if (def[ix].equals(l, r)) return true
    return false
  }
  return unionEquals
}
