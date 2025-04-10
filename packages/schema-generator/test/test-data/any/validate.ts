import type { t } from '@traversable/schema'
import { URI } from '@traversable/registry'
import type { ValidationFn } from '@traversable/derive-validators'

export type validate = ValidationFn<unknown>
export function validate(_?: t.unknown): validate {
  validateUnknown.tag = URI.unknown
  function validateUnknown() { return true as const }
  return validateUnknown
}
