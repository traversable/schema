import type { t } from '@traversable/schema-core'
import { URI } from '@traversable/registry'
import type { ValidationFn } from '@traversable/derive-validators'

export type validate = ValidationFn<any>
export function validate(_?: t.any): validate {
  validateAny.tag = URI.any
  function validateAny() { return true as const }
  return validateAny
}
