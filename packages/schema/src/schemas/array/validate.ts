import { URI } from '@traversable/registry'
import type { t } from '../../_exports.js'
import type { ValidationError, ValidationFn, Validator } from '@traversable/derive-validators'
import { Errors, NullaryErrors } from '@traversable/derive-validators'

export type validate<S> = never | ValidationFn<S['_type' & keyof S]>
export function validate<S extends Validator>(arraySchema: t.array<S>): validate<typeof arraySchema>
export function validate<S extends t.Schema>(arraySchema: t.array<S>): validate<typeof arraySchema>
export function validate(
  { def: { validate = () => true }, minLength, maxLength }: t.array<Validator>
) {
  validateArray.tag = URI.array
  function validateArray(u: unknown, path = Array.of<keyof any>()) {
    if (!Array.isArray(u)) return [NullaryErrors.array(u, path)]
    let errors = Array.of<ValidationError>()
    if (typeof minLength === 'number' && u.length < minLength) errors.push(Errors.arrayMinLength(u, path, minLength))
    if (typeof maxLength === 'number' && u.length > maxLength) errors.push(Errors.arrayMaxLength(u, path, maxLength))
    for (let i = 0, len = u.length; i < len; i++) {
      let y = u[i]
      let results = validate(y, [...path, i])
      if (results === true) continue
      else errors.push(...results)
    }
    return errors.length === 0 || errors
  }
  return validateArray
}
