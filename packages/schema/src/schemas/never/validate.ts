import type { t } from '../../_exports.js'
import { URI } from '@traversable/registry'
import { NullaryErrors, type ValidationFn } from '@traversable/derive-validators'

export type validate = ValidationFn<never>
export function validate(_?: t.never): validate {
  validateNever.tag = URI.never
  function validateNever(u: unknown, path = Array.of<keyof any>()) { return [NullaryErrors.never(u, path)] }
  return validateNever
}
