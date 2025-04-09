import type { Returns } from '@traversable/registry'
import { applyTupleOptionality, minItems } from '@traversable/schema-to-json-schema'
import type { MinItems } from '@traversable/schema-to-json-schema'
import type { t } from '@traversable/schema'

export interface toJsonSchema<S, T = S['def' & keyof S]> {
  type: 'array',
  items: { [I in keyof T]: Returns<T[I]['toJsonSchema' & keyof T[I]]> }
  additionalItems: false
  minItems: MinItems<S>
  maxItems: T['length' & keyof T]
}

export function toJsonSchema<S extends readonly unknown[]>(tupleSchema: t.tuple<S>): toJsonSchema<typeof tupleSchema>
export function toJsonSchema<S extends readonly unknown[]>({ def }: t.tuple<S>) {
  const min = minItems(def)
  const max = def.length
  return {
    type: 'array' as const,
    additionalItems: false as const,
    items: applyTupleOptionality(def, { min, max }) as never,
    minItems: min as never,
    maxItems: max,
  }
}
