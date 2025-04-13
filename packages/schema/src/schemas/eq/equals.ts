import type { Equal } from '@traversable/registry'
import { t } from '../../_exports.js'

export type equals<T> = never | Equal<T['def' & keyof T]>
export function equals<V>(eqSchema: t.eq<V>): equals<typeof eqSchema>
export function equals(): Equal<unknown> {
  return (left: unknown, right: unknown) => t.eq(left)(right)
}
