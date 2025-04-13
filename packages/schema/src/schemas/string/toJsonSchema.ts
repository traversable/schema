import type { Force, PickIfDefined } from '@traversable/registry'
import type { t } from '../../_exports.js'
import { has } from '@traversable/registry'
import type { SizeBounds } from '@traversable/schema-to-json-schema'

export interface toJsonSchema<T> {
  (): Force<{ type: 'string' } & PickIfDefined<T, keyof SizeBounds>>
}

export function toJsonSchema<S extends t.string>(schema: S): toJsonSchema<S>
export function toJsonSchema(schema: t.string): () => { type: 'string' } & Partial<SizeBounds> {
  function stringToJsonSchema() {
    const minLength = has('minLength', (u: any) => typeof u === 'number')(schema) ? schema.minLength : null
    const maxLength = has('maxLength', (u: any) => typeof u === 'number')(schema) ? schema.maxLength : null
    let out: { type: 'string' } & Partial<SizeBounds> = { type: 'string' }
    minLength !== null && void (out.minLength = minLength)
    maxLength !== null && void (out.maxLength = maxLength)

    return out
  }
  return stringToJsonSchema
}
