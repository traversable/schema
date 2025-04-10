import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
import type { t } from '@traversable/schema'
import { URI } from '@traversable/registry'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate = ValidationFn<number>
export function validate<S extends t.number>(numberSchema: S): validate {
  validateNumber.tag = URI.number
  function validateNumber(u: unknown, path: (keyof any)[] = []): true | ValidationError[] {
    return numberSchema(u) || [NullaryErrors.number(u, path)]
  }
  return validateNumber
}
