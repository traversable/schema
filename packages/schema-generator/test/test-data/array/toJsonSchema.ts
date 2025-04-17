import type { t } from '@traversable/schema-core'
import type * as T from '@traversable/registry'
import type { SizeBounds } from '@traversable/schema-to-json-schema'
import { hasSchema } from '@traversable/schema-to-json-schema'

export interface toJsonSchema<T> {
  (): never | T.Force<
    & { type: 'array', items: T.Returns<T['def' & keyof T]['toJsonSchema' & keyof T['def' & keyof T]]> }
    & T.PickIfDefined<T, keyof SizeBounds>
  >
}

export function toJsonSchema<T extends t.array<t.Schema>>(arraySchema: T): toJsonSchema<typeof arraySchema>
export function toJsonSchema<T extends { def: unknown }>(arraySchema: T): toJsonSchema<typeof arraySchema>
export function toJsonSchema(
  { def, minLength, maxLength }: { def: unknown, minLength?: number, maxLength?: number },
): () => {
  type: 'array'
  items: unknown
  minLength?: number
  maxLength?: number
} {
  function arrayToJsonSchema() {
    let items = hasSchema(def) ? def.toJsonSchema() : def
    let out = {
      type: 'array' as const,
      items,
      minLength,
      maxLength,
    }
    if (typeof minLength !== 'number') delete out.minLength
    if (typeof maxLength !== 'number') delete out.maxLength
    return out
  }
  return arrayToJsonSchema
}
