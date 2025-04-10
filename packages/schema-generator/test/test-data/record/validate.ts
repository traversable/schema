import type { t } from '@traversable/schema'
import { Array_isArray, Object_keys, URI } from '@traversable/registry'
import type { ValidationError, ValidationFn, Validator } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'

export type validate<S> = never | ValidationFn<S['_type' & keyof S]>
export function validate<S extends Validator>(recordSchema: t.record<S>): validate<typeof recordSchema>
export function validate<S extends t.Schema>(recordSchema: t.record<S>): validate<typeof recordSchema>
export function validate<S extends Validator>({ def: { validate = () => true } }: t.record<S>) {
  validateRecord.tag = URI.record
  function validateRecord(u: unknown, path = Array.of<keyof any>()) {
    if (!u || typeof u !== 'object' || Array_isArray(u)) return [NullaryErrors.record(u, path)]
    let errors = Array.of<ValidationError>()
    let keys = Object_keys(u)
    for (let k of keys) {
      let y = u[k]
      let results = validate(y, [...path, k])
      if (results === true) continue
      else errors.push(...results)
    }
    return errors.length === 0 || errors
  }
  return validateRecord
}
