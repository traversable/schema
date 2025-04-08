import type { t } from '@traversable/schema'
import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
import type * as T from '@traversable/registry'
import { URI } from '@traversable/registry'
import { Errors, NullaryErrors } from '@traversable/derive-validators'

export const extension = {
  type: `validate(u: this['_type'] | T.Unknown): true | ValidationError[]`,
  term: `validate: validate(x)`,
} as const

export type validate<S> = never | ValidationFn<S['_type' & keyof S]>;

export function validate<S extends t.Schema>(
  itemsSchema: S,
  bounds?: { minLength?: number, maxLength?: number }
): validate<S>
export function validate<S>(
  itemsSchema: S,
  bounds?: { minLength?: number, maxLength?: number }
): validate<S>
//
export function validate(
  { def }: { def: unknown },
  { minLength, maxLength }: { minLength?: number, maxLength?: number } = {}
): ValidationFn {
  let validate = <ValidationFn>((
    !!def
    && typeof def === 'object'
    && 'validate' in def
    && typeof def.validate === 'function'
  ) ? def.validate
    : () => true)
  validateArray.tag = URI.array
  function validateArray(u: unknown, path: (keyof any)[] = []) {
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
