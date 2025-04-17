import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
import type { t } from '@traversable/schema-core'
import { URI } from '@traversable/registry'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate = ValidationFn<number>
export function validate<S extends t.integer>(integerSchema: S): validate {
  validateInteger.tag = URI.integer
  function validateInteger(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
    return integerSchema(u) || [NullaryErrors.integer(u, path)]
  }
  return validateInteger
}
