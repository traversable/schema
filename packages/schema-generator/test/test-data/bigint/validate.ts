import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
import type { t } from '@traversable/schema-core'
import { URI } from '@traversable/registry'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate = ValidationFn<bigint>
export function validate<S extends t.bigint>(bigIntSchema: S): validate {
  validateBigInt.tag = URI.bigint
  function validateBigInt(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
    return bigIntSchema(u) || [NullaryErrors.bigint(u, path)]
  }
  return validateBigInt
}
