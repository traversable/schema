import { URI } from '@traversable/registry'
import type { t } from '@traversable/schema-core'
import type { Validate, Validator, ValidationFn } from '@traversable/derive-validators'

export type validate<T> = Validate<T['_type' & keyof T]>

export function validate<S extends Validator>(optionalSchema: t.optional<S>): validate<S>
export function validate<S extends t.Schema>(optionalSchema: t.optional<S>): validate<S>
export function validate({ def }: t.optional<Validator>): ValidationFn<unknown> {
  validateOptional.tag = URI.optional
  validateOptional.optional = 1
  function validateOptional(u: unknown, path = Array.of<keyof any>()) {
    if (u === void 0) return true
    return def.validate(u, path)
  }
  return validateOptional
}
