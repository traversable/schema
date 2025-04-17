import type { Equal } from '@traversable/registry'
import { laxEquals } from '@traversable/registry'
import type { t } from '@traversable/schema-core'

export type equals<T> = never | Equal<T['def' & keyof T]>
export function equals<V>(eqSchema: t.eq<V>): equals<typeof eqSchema>
export function equals(): Equal<unknown> {
  return function eqEquals(left: any, right: any) {
    return laxEquals(left, right)
  }
}
