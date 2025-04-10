import type { Key } from '@traversable/registry'
import type { t } from '@traversable/schema'
import { stringify } from '@traversable/schema-to-string'

export interface toString<S, T = S['def' & keyof S]> {
  (): [Key<T>] extends [never]
    ? [T] extends [symbol] ? 'symbol' : 'symbol'
    : [T] extends [string] ? `'${T}'` : Key<T>
}

export function toString<V>(eqSchema: t.eq<V>): toString<typeof eqSchema>
export function toString<V>({ def }: t.eq<V>): () => string {
  function eqToString(): string {
    return typeof def === 'symbol' ? 'symbol' : stringify(def)
  }
  return eqToString
}
