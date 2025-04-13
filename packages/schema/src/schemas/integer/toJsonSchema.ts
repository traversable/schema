import type { Force, PickIfDefined } from '@traversable/registry'
import type { t } from '../../_exports.js'
import type { NumericBounds } from '@traversable/schema-to-json-schema'
import { getNumericBounds } from '@traversable/schema-to-json-schema'

export interface toJsonSchema<T> { (): Force<{ type: 'integer' } & PickIfDefined<T, keyof NumericBounds>> }

export function toJsonSchema<S extends t.integer>(schema: S): toJsonSchema<S>
export function toJsonSchema(schema: t.integer): toJsonSchema<t.integer> {
  function integerToJsonSchema() {
    const { exclusiveMaximum, exclusiveMinimum, maximum, minimum } = getNumericBounds(schema)
    let bounds: NumericBounds = {}
    if (typeof exclusiveMinimum === 'number') bounds.exclusiveMinimum = exclusiveMinimum
    if (typeof exclusiveMaximum === 'number') bounds.exclusiveMaximum = exclusiveMaximum
    if (typeof minimum === 'number') bounds.minimum = minimum
    if (typeof maximum === 'number') bounds.maximum = maximum
    return {
      type: 'integer' as const,
      ...bounds,
    }
  }
  return integerToJsonSchema
}
