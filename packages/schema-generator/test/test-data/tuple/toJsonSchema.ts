import type { Returns } from '@traversable/registry'
import type { t } from '@traversable/schema'
import { applyTupleOptionality, minItems } from '@traversable/schema-to-json-schema'
import type { MinItems } from '@traversable/schema-to-json-schema'

export interface toJsonSchema<S, T = S['def' & keyof S]> {
  (): {
    type: 'array',
    items: { [I in keyof T]: Returns<T[I]['toJsonSchema' & keyof T[I]]> }
    additionalItems: false
    minItems: MinItems<S>
    maxItems: T['length' & keyof T]
  }
}

export function toJsonSchema<S extends readonly unknown[]>(tupleSchema: t.tuple<S>): toJsonSchema<typeof tupleSchema>
export function toJsonSchema<S extends readonly unknown[]>(tupleSchema: t.tuple<S>): toJsonSchema<typeof tupleSchema>
export function toJsonSchema<S extends readonly unknown[]>({ def }: t.tuple<S>): () => {
  type: 'array'
  items: unknown
  additionalItems: false
  minItems?: number
  maxItems?: number
} {
  let min = minItems(def)
  let max = def.length
  let items = applyTupleOptionality(def, { min, max })
  function tupleToJsonSchema() {
    return {
      type: 'array' as const,
      additionalItems: false as const,
      items,
      minItems: min,
      maxItems: max,
    }
  }
  return tupleToJsonSchema
}
