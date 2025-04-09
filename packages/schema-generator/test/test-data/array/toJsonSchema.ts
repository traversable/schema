import type { t } from '@traversable/schema'
import type * as T from '@traversable/registry'
import { has } from '@traversable/registry'
import type { SizeBounds } from '@traversable/schema-to-json-schema'

export const extension = {
  type: 'toJsonSchema(): toJsonSchema<S, this>',
  term: 'toJsonSchema: toJsonSchema(self)',
}

export type toJsonSchema<S, T> = never | T.Force<
  & { type: 'array', items: T.Returns<S['toJsonSchema' & keyof S]> }
  & T.PickIfDefined<T, keyof SizeBounds>
>
export function toJsonSchema<T extends t.array<t.Schema>>(self: T): () => toJsonSchema<T['def'], T>
export function toJsonSchema<T extends { def: unknown, minLength?: number, maxLength?: number }>(self: T): () => toJsonSchema<T['def'], T>
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
