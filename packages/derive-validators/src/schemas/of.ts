import type { t } from '@traversable/schema-core'
import { URI } from '@traversable/registry'
import type { ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate = ValidationFn<void>
export function validate<T>(inlineSchema: t.of<T>): validate {
  validateInline.tag = URI.inline
  function validateInline(u: unknown, path = Array.of<keyof any>()) {
    return inlineSchema(u) || [NullaryErrors.inline(u, path)]
  }
  return validateInline
}

