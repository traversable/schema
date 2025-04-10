import { URI } from '@traversable/registry'
import { t } from '@traversable/schema'
import type { ValidationError, Validate, Validator } from '@traversable/derive-validators'

export type validate<T> = Validate<T['_type' & keyof T]>

export function validate<S extends readonly Validator[]>(unionSchema: t.union<S>): validate<S>
export function validate<S extends readonly t.Schema[]>(unionSchema: t.union<S>): validate<S>
export function validate({ def }: t.union<readonly Validator[]>) {
  validateUnion.tag = URI.union
  function validateUnion(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
    // if (this.def.every((x) => t.optional.is(x.validate))) validateUnion.optional = 1;
    let errors = Array.of<ValidationError>()
    for (let i = 0; i < def.length; i++) {
      let results = def[i].validate(u, path)
      if (results === true) {
        // validateUnion.optional = 0
        return true
      }
      for (let j = 0; j < results.length; j++) errors.push(results[j])
    }
    // validateUnion.optional = 0
    return errors.length === 0 || errors
  }
  return validateUnion
}
