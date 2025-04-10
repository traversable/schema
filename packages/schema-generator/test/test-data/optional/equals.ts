import type { Equal } from '@traversable/registry'
import { Object_is } from '@traversable/registry'
import type { t } from '@traversable/schema'

export type equals<T> = never | Equal<T['_type' & keyof T]>
export function equals<S extends { equals: Equal }>(optionalSchema: t.optional<S>): equals<typeof optionalSchema>
export function equals<S extends t.Schema>(optionalSchema: t.optional<S>): equals<typeof optionalSchema>
export function equals({ def }: t.optional<{ equals: Equal }>): Equal<unknown> {
  return function optionalEquals(l: unknown, r: unknown): boolean {
    if (Object_is(l, r)) return true
    return def.equals(l, r)
  }
}
