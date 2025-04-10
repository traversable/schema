import type { Force } from '@traversable/registry'
import type { Returns } from '@traversable/registry'
import { symbol } from '@traversable/registry'
import type { t } from '@traversable/schema'
import { getSchema, wrapOptional } from '@traversable/schema-to-json-schema'

type Nullable<T> = Force<T & { nullable: true }>

export interface toJsonSchema<S, T = S['def' & keyof S]> {
  (): Nullable<Returns<T['toJsonSchema' & keyof T]>>
  [symbol.optional]: number
}

export function toJsonSchema<S>(optionalSchema: t.optional<S>): toJsonSchema<S>
export function toJsonSchema({ def }: t.optional<unknown>) {
  function optionalToJsonSchema() { return getSchema(def) }
  optionalToJsonSchema[symbol.optional] = wrapOptional(def)
  return optionalToJsonSchema
}
