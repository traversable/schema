import type { Returns } from '@traversable/registry'
import { t } from '@traversable/schema'
import { getSchema } from '@traversable/schema-to-json-schema'

export interface toJsonSchema<S> {
  (): {
    allOf: { [I in keyof S]: Returns<S[I]['toJsonSchema' & keyof S[I]]> }
  }
}

export function toJsonSchema<S extends readonly { toJsonSchema(): unknown }[]>(intersectSchema: t.intersect<S>): toJsonSchema<S>
export function toJsonSchema<S extends readonly t.Schema[]>(intersectSchema: t.intersect<S>): toJsonSchema<S>
export function toJsonSchema<S extends readonly { toJsonSchema(): unknown }[]>({ def }: t.intersect<S>): () => {} {
  function intersectToJsonSchema() {
    return {
      allOf: def.map(getSchema)
    }
  }
  return intersectToJsonSchema
}
