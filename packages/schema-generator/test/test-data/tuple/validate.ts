import { URI, Array_isArray } from '@traversable/registry'
import { t } from '@traversable/schema'
import type { ValidationError, Validate, Validator } from '@traversable/derive-validators'
import { Errors } from '@traversable/derive-validators'

export type validate<T> = Validate<T['_type' & keyof T]>
export function validate<S extends readonly Validator[]>(tupleSchema: t.tuple<[...S]>): validate<typeof tupleSchema>
export function validate<S extends readonly t.Schema[]>(tupleSchema: t.tuple<[...S]>): validate<typeof tupleSchema>
export function validate<S extends readonly Validator[]>(tupleSchema: t.tuple<[...S]>): Validate<typeof tupleSchema> {
  validateTuple.tag = URI.tuple
  function validateTuple(u: unknown, path = Array.of<keyof any>()) {
    let errors = Array.of<ValidationError>()
    if (!Array_isArray(u)) return [Errors.array(u, path)]
    for (let i = 0; i < tupleSchema.def.length; i++) {
      if (!(i in u) && !(t.optional.is(tupleSchema.def[i].validate))) {
        errors.push(Errors.missingIndex(u, [...path, i]))
        continue
      }
      let results = tupleSchema.def[i].validate(u[i], [...path, i])
      if (results !== true) {
        for (let j = 0; j < results.length; j++) errors.push(results[j])
        results.push(Errors.arrayElement(u[i], [...path, i]))
      }
    }
    if (u.length > tupleSchema.def.length) {
      for (let k = tupleSchema.def.length; k < u.length; k++) {
        let excess = u[k]
        errors.push(Errors.excessItems(excess, [...path, k]))
      }
    }
    return errors.length === 0 || errors
  }
  return validateTuple
}
