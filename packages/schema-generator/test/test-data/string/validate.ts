import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
import type { t } from '@traversable/schema-core'
import { URI } from '@traversable/registry'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate = ValidationFn<string>
export function validate<S extends t.string>(stringSchema: S): validate {
  validateString.tag = URI.string
  function validateString(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
    return stringSchema(u) || [NullaryErrors.number(u, path)]
  }
  return validateString
}

