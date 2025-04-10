import type { t } from '@traversable/schema'
import { URI } from '@traversable/registry'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate = ValidationFn<void>
export function validate(voidSchema: t.void): validate {
  validateVoid.tag = URI.void
  function validateVoid(u: unknown, path = Array.of<keyof any>()) {
    return voidSchema(u) || [NullaryErrors.void(u, path)]
  }
  return validateVoid
}
