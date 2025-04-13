import type { t } from '../../_exports.js'
import { URI } from '@traversable/registry'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate = ValidationFn<null>
export function validate(nullSchema: t.null): validate {
  validateNull.tag = URI.null
  function validateNull(u: unknown, path = Array.of<keyof any>()) {
    return nullSchema(u) || [NullaryErrors.null(u, path)]
  }
  return validateNull
}
