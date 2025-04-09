import type { t } from '@traversable/schema'
import type * as T from '@traversable/registry'
import { has } from '@traversable/registry'
import type { SizeBounds } from '@traversable/schema-to-json-schema'

export type toJsonSchema<T> = never | T.Force<
  & { type: 'array', items: T.Returns<T['toJsonSchema' & keyof T]> }
  & T.PickIfDefined<T['def' & keyof T], keyof SizeBounds>
>
export function toJsonSchema<T extends t.array<t.Schema>>(arraySchema: T): () => toJsonSchema<T>
export function toJsonSchema<T extends { def: unknown, minLength?: number, maxLength?: number }>(arraySchema: T): () => toJsonSchema<T>
export function toJsonSchema(
  { def, minLength, maxLength }: { def: unknown, minLength?: number, maxLength?: number },
): () => {
  type: 'array'
  items: unknown
  minLength?: number
  maxLength?: number
} {
  return () => {
    let items = has('toJsonSchema', (x) => typeof x === 'function')(def) ? def.toJsonSchema() : def
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
}
