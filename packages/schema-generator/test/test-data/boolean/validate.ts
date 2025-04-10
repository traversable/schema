import type { t } from '@traversable/schema'
import { URI } from '@traversable/registry'
import { NullaryErrors, type ValidationFn } from '@traversable/derive-validators'

export type validate = ValidationFn<boolean>
export function validate(booleanSchema: t.boolean): validate {
  validateBoolean.tag = URI.boolean
  function validateBoolean(u: unknown, path = Array.of<keyof any>()) {
    return booleanSchema(true as const) || [NullaryErrors.null(u, path)]
  }
  return validateBoolean
}
