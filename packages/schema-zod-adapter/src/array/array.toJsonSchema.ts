import type { t } from '@traversable/schema'
import type * as T from '@traversable/registry'
import { has, Algebra } from '@traversable/registry'
import type { SizeBounds } from '@traversable/schema-to-json-schema'

export type arrayToJsonSchema<S, T> = T.Force<
  & { type: 'array', items: T.Returns<S['toJsonSchema' & keyof S]> }
  & T.PickIfDefined<T, keyof SizeBounds>
>

export function arrayToJsonSchema<S extends t.Schema, Min extends number, Max extends number>(
  itemsSchema: S,
  bounds?: { minLength?: Min, maxLength?: Max }
): arrayToJsonSchema<S['_type'], { minLength: Min, maxLength: Max }>
export function arrayToJsonSchema<S, Min extends number, Max extends number>(
  itemsSchema: S,
  bounds?: { minLength?: Min, maxLength?: Max }
): arrayToJsonSchema<S['_type' & keyof S], { minLength: Min, maxLength: Max }>
export function arrayToJsonSchema(
  { def }: { def: unknown },
  { minLength, maxLength }: { minLength?: number, maxLength?: number } = {}
): {
  type: 'array'
  items: unknown
  minLength?: number
  maxLength?: number
} {
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
