import {
  Array_isArray,
  has,
  Object_keys,
  Object_hasOwn,
  typeName,
  URI,
} from '@traversable/registry'
import type { t } from '../../_exports.js'
import { getConfig } from '../../_exports.js'
import type { ValidationError, Validator, ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors, Errors, UnaryErrors } from '@traversable/derive-validators'

/** @internal */
let isObject = (u: unknown): u is { [x: string]: unknown } =>
  !!u && typeof u === 'object' && !Array_isArray(u)

/** @internal */
let isKeyOf = <T extends {}>(k: keyof any, u: T): k is keyof T =>
  !!u && (typeof u === 'function' || typeof u === 'object') && k in u

/** @internal */
let isOptional = has('tag', (tag) => tag === URI.optional)


export type validate<S> = never | ValidationFn<S['_type' & keyof S]>

export function validate<S extends { [x: string]: Validator }>(objectSchema: t.object<S>): validate<S>
export function validate<S extends { [x: string]: t.Schema }>(objectSchema: t.object<S>): validate<S>
export function validate(objectSchema: t.object<{ [x: string]: Validator }>): validate<{ [x: string]: unknown }> {
  validateObject.tag = URI.object
  function validateObject(u: unknown, path_ = Array.of<keyof any>()) {
    // if (objectSchema(u)) return true
    if (!isObject(u)) return [Errors.object(u, path_)]
    let errors = Array.of<ValidationError>()
    let { schema: { optionalTreatment } } = getConfig()
    let keys = Object_keys(objectSchema.def)
    if (optionalTreatment === 'exactOptional') {
      for (let i = 0, len = keys.length; i < len; i++) {
        let k = keys[i]
        let path = [...path_, k]
        if (Object_hasOwn(u, k) && u[k] === undefined) {
          if (isOptional(objectSchema.def[k].validate)) {
            let tag = typeName(objectSchema.def[k].validate)
            if (isKeyOf(tag, NullaryErrors)) {
              let args = [u[k], path, tag] as never as [unknown, (keyof any)[]]
              errors.push(NullaryErrors[tag](...args))
            }
            else if (isKeyOf(tag, UnaryErrors)) {
              errors.push(UnaryErrors[tag as keyof typeof UnaryErrors].invalid(u[k], path))
            }
          }
          let results = objectSchema.def[k].validate(u[k], path)
          if (results === true) continue
          let tag = typeName(objectSchema.def[k].validate)
          if (isKeyOf(tag, NullaryErrors)) {
            errors.push(NullaryErrors[tag](u[k], path, tag))
          }
          else if (isKeyOf(tag, UnaryErrors)) {
            errors.push(UnaryErrors[tag].invalid(u[k], path))
          }
          errors.push(...results)
        }
        else if (Object_hasOwn(u, k)) {
          let results = objectSchema.def[k].validate(u[k], path)
          if (results === true) continue
          errors.push(...results)
          continue
        } else {
          errors.push(UnaryErrors.object.missing(u, path))
          continue
        }
      }
    }
    else {
      for (let i = 0, len = keys.length; i < len; i++) {
        let k = keys[i]
        let path = [...path_, k]
        if (!Object_hasOwn(u, k)) {
          if (!isOptional(objectSchema.def[k].validate)) {
            errors.push(UnaryErrors.object.missing(u, path))
            continue
          }
          else {
            if (!Object_hasOwn(u, k)) continue
            if (isOptional(objectSchema.def[k].validate) && Object_hasOwn(u, k)) {
              if (u[k] === undefined) continue
              let results = objectSchema.def[k].validate(u[k], path)
              if (results === true) continue
              for (let j = 0; j < results.length; j++) {
                let result = results[j]
                errors.push(result)
                continue
              }
            }
          }
        }
        let results = objectSchema.def[k].validate(u[k], path)
        if (results === true) continue
        for (let l = 0; l < results.length; l++) {
          let result = results[l]
          errors.push(result)
        }
      }
    }
    return errors.length === 0 || errors
  }

  return validateObject
}
