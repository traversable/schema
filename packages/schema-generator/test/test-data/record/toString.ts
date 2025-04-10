import type { Returns } from '@traversable/registry'
import type { t } from '@traversable/schema'
import { callToString } from '@traversable/schema-to-string'

export interface toString<T> {
  /* @ts-expect-error */
  (): never | `Record<string, ${Returns<T['def']['toString']>}>`
}

export function toString<S extends t.record<t.Schema>>(recordSchema: S): toString<typeof recordSchema>
export function toString<S>(recordSchema: t.record<S>): toString<typeof recordSchema>
export function toString({ def }: { def: unknown }): () => string {
  function recordToString() {
    return `Record<string, ${callToString(def)}>`
  }
  return recordToString
}
