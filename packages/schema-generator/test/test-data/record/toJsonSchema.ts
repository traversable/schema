import type { t } from '@traversable/schema'
import type * as T from '@traversable/registry'
import { getSchema } from '@traversable/schema-to-json-schema'

export interface toJsonSchema<S, T = S['def' & keyof S]> {
  (): {
    type: 'object'
    additionalProperties: T.Returns<T['toJsonSchema' & keyof T]>
  }
}

export function toJsonSchema<S extends t.Schema>(recordSchema: t.record<S>): toJsonSchema<typeof recordSchema>
export function toJsonSchema<S>(recordSchema: t.record<S>): toJsonSchema<typeof recordSchema>
export function toJsonSchema({ def }: { def: unknown }): () => { type: 'object', additionalProperties: unknown } {
  return function recordToJsonSchema() {
    return {
      type: 'object' as const,
      additionalProperties: getSchema(def),
    }
  }
}
