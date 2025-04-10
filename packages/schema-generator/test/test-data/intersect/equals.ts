import type { Equal } from '@traversable/registry'
import { Object_is } from '@traversable/registry'
import type { t } from '@traversable/schema'

export type equals<S> = Equal<S['_type' & keyof S]>
export function equals<S extends readonly { equals: Equal }[]>(intersectSchema: t.intersect<[...S]>): equals<typeof intersectSchema>
export function equals<S extends readonly t.Schema[]>(intersectSchema: t.intersect<[...S]>): equals<typeof intersectSchema>
export function equals({ def }: t.intersect<{ equals: Equal }[]>): Equal<unknown> {
  function intersectEquals(l: unknown, r: unknown): boolean {
    if (Object_is(l, r)) return true
    for (let ix = def.length; ix-- !== 0;)
      if (!def[ix].equals(l, r)) return false
    return true
  }
  return intersectEquals
}
