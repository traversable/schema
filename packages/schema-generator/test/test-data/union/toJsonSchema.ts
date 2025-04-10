import type { Returns } from '@traversable/registry'
import { t } from '@traversable/schema'
import { getSchema } from '@traversable/schema-to-json-schema'

export interface toJsonSchema<S> {
  (): { anyOf: { [I in keyof S]: Returns<S[I]['toJsonSchema' & keyof S[I]]> } }
}

export function toJsonSchema<S extends readonly { toJsonSchema(): unknown }[]>(unionSchema: t.union<S>): toJsonSchema<S>
export function toJsonSchema<S extends readonly t.Schema[]>(unionSchema: t.union<S>): toJsonSchema<S>
export function toJsonSchema<S extends readonly { toJsonSchema(): unknown }[]>({ def }: t.union<S>): () => {} {
  return function unionToJsonSchema() {
    return {
      anyOf: def.map(getSchema)
    }
  }
}
