import { URI } from '@traversable/registry'
import type { t } from '@traversable/schema-core'
import type { ValidationError, Validate, Validator } from '@traversable/derive-validators'

export type validate<T> = Validate<T['_type' & keyof T]>

export function validate<S extends readonly Validator[]>(intersectSchema: t.intersect<S>): validate<S>
export function validate<S extends readonly t.Schema[]>(intersectSchema: t.intersect<S>): validate<S>
export function validate({ def }: t.intersect<readonly Validator[]>) {
  validateIntersect.tag = URI.intersect
  function validateIntersect(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
    let errors = Array.of<ValidationError>()
    for (let i = 0; i < def.length; i++) {
      let results = def[i].validate(u, path)
      if (results !== true)
        for (let j = 0; j < results.length; j++) errors.push(results[j])
    }
    return errors.length === 0 || errors
  }
  return validateIntersect
}
