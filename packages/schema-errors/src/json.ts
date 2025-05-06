import type { Mutable, Unknown } from '@traversable/registry'
import {
  fn,
  Object_entries,
  Object_hasOwn,
  NS,
} from '@traversable/registry'
import type { Scalar } from '@traversable/json'
import { Json as JSON } from '@traversable/json'

import type { ValidationError, Validator } from './types.js'
import type { Options } from './options.js'
import { defaults } from './options.js'
import { NO_ERRORS } from './errors.js'
import { defaultPath } from './shared.js'

export function scalar<T extends Scalar>(value: T, options?: Options): Validator<T>
export function scalar<T extends Scalar>(
  x: T, {
    errors: {
      jsonScalar: ERRORS = defaults.errors.jsonScalar,
    } = defaults.errors
  }: Options = defaults
): Validator<T> {
  function validateJsonScalar(got: T | Unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    return got === x ? NO_ERRORS : ERRORS(x, got, path)
  }
  validateJsonScalar.tag = `${NS}json_scalar`
  return validateJsonScalar
}

export function array<T extends readonly unknown[]>(
  validators: { [I in keyof T]: Validator<T[I]> },
  options?: Options
): Validator<Mutable<T>>
export function array<T extends readonly unknown[]>(
  validators: { [I in keyof T]: Validator<T[I]> }, {
    errors: {
      jsonArray: ERRORS = defaults.errors.jsonArray,
    } = defaults.errors
  }: Options = defaults
): Validator<Mutable<T>> {
  function validateJsonArray(got: T | Unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    return !JSON.isArray(got)
      ? ERRORS(got, path)
      : validators.flatMap((v, i) => v(got[i], [...path, i]))
  }
  validateJsonArray.tag = `${NS}json_array`
  return validateJsonArray
}

export function object<T extends { [x: string]: unknown }>(
  validators: { [K in keyof T]: Validator<T[K]> },
  options?: Options
): Validator<T>
export function object<T extends { [x: string]: unknown }>(
  validators: { [K in keyof T]: Validator<T[K]> }, {
    errors: {
      jsonObject: ERRORS = defaults.errors.jsonObject,
      jsonObjectKey: KEY_ERRORS = defaults.errors.jsonObjectKey,
    } = defaults.errors
  }: Options = defaults
): Validator<T> {
  function validateJsonObject(got: T | Unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    return !JSON.isObject(got)
      ? ERRORS(got, path)
      : Object_entries(validators).flatMap(([k, validator]) => Object_hasOwn(got, k)
        ? validator(got[k], [...path, k])
        : KEY_ERRORS(k, got, path)
      )
  }
  validateJsonObject.tag = `${NS}json_object`
  return validateJsonObject
}

export const fold
  : (json: JSON, options?: Options) => Validator<JSON>
  = (json, options = defaults) => JSON.fold<Validator>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case JSON.isScalar(x): return scalar(x, options)
      case JSON.isArray(x): return array(x, options)
      case JSON.isObject(x): return object(x, options)
    }
  })(json)
