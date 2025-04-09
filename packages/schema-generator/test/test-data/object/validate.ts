import type { Unknown } from '@traversable/registry'
import {
  Array_isArray,
  Object_keys,
  Object_hasOwn,
  typeName,
  URI,
} from '@traversable/registry'
import { t, getConfig } from '@traversable/schema'
import type { ValidationError, Validator, ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors, Errors, UnaryErrors } from '@traversable/derive-validators'

/** @internal */
let isObject = (u: unknown): u is { [x: string]: unknown } =>
  !!u && typeof u === 'object' && !Array_isArray(u)

/** @internal */
let isKeyOf = <T extends {}>(k: keyof any, u: T): k is keyof T =>
  !!u && (typeof u === 'function' || typeof u === 'object') && k in u

/** @internal */
let isOptional = t.has('tag', t.eq(URI.optional))

validate.tag = URI.object

export type validate<S> = never | ValidationFn<S['_type' & keyof S]>

export function validate<S extends { [x: string]: Validator }>(
  objectSchema: t.object<S>,
  u: t.object<S>['_type'] | Unknown,
  path?: (keyof any)[]
): true | ValidationError[]

export function validate<S extends { [x: string]: t.Schema }>(
  objectSchema: t.object<S>,
  u: t.object<S>['_type'] | Unknown,
  path?: (keyof any)[]
): true | ValidationError[]

export function validate<S extends { [x: string]: Validator }>(
  objectSchema: t.object<S>,
  u: unknown,
  path: (keyof any)[] = []
): true | ValidationError[] {
  if (!isObject(u)) return [Errors.object(u, path)]
  let errors = Array.of<ValidationError>()
  let { schema: { optionalTreatment } } = getConfig()
  let keys = Object_keys(objectSchema.def)
  if (optionalTreatment === 'exactOptional') {
    for (let i = 0, len = keys.length; i < len; i++) {
      let k = keys[i]
      let path_ = [...path, k]
      if (Object_hasOwn(u, k) && u[k] === undefined) {
        if (isOptional(objectSchema.def[k].validate)) {
          let tag = typeName(objectSchema.def[k].validate)
          if (isKeyOf(tag, NullaryErrors)) {
            let args = [u[k], path_, tag] as never as [unknown, (keyof any)[]]
            errors.push(NullaryErrors[tag](...args))
          }
          else if (isKeyOf(tag, UnaryErrors)) {
            errors.push(UnaryErrors[tag as keyof typeof UnaryErrors].invalid(u[k], path_))
          }
        }
        let results = objectSchema.def[k].validate(u[k], path_)
        if (results === true) continue
        let tag = typeName(objectSchema.def[k].validate)
        if (isKeyOf(tag, NullaryErrors)) {
          errors.push(NullaryErrors[tag](u[k], path_, tag))
        }
        else if (isKeyOf(tag, UnaryErrors)) {
          errors.push(UnaryErrors[tag].invalid(u[k], path_))
        }
        errors.push(...results)
      }
      else if (Object_hasOwn(u, k)) {
        let results = objectSchema.def[k].validate(u[k], path_)
        if (results === true) continue
        errors.push(...results)
        continue
      } else {
        errors.push(UnaryErrors.object.missing(u, path_))
        continue
      }
    }
  }
  else {
    for (let i = 0, len = keys.length; i < len; i++) {
      let k = keys[i]
      let path_ = [...path, k]
      if (!Object_hasOwn(u, k)) {
        if (!isOptional(objectSchema.def[k].validate)) {
          errors.push(UnaryErrors.object.missing(u, path_))
          continue
        }
        else {
          if (!Object_hasOwn(u, k)) continue
          if (isOptional(objectSchema.def[k].validate) && Object_hasOwn(u, k)) {
            if (u[k] === undefined) continue
            let results = objectSchema.def[k].validate(u[k], path_)
            if (results === true) continue
            for (let j = 0; j < results.length; j++) {
              let result = results[j]
              errors.push(result)
              continue
            }
          }
        }
      }
      let results = objectSchema.def[k].validate(u[k], path_)
      if (results === true) continue
      for (let l = 0; l < results.length; l++) {
        let result = results[l]
        errors.push(result)
      }
    }
  }
  return errors.length === 0 || errors
}
