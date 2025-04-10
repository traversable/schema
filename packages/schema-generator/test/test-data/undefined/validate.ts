import type { t } from '@traversable/schema'
import { URI } from '@traversable/registry'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate = ValidationFn<undefined>
export function validate(undefinedSchema: t.undefined): validate {
  validateUndefined.tag = URI.undefined
  function validateUndefined(u: unknown, path = Array.of<keyof any>()) {
    return undefinedSchema(u) || [NullaryErrors.undefined(u, path)]
  }
  return validateUndefined
}
