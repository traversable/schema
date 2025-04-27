import {
  Array_isArray,
  getConfig,
  Number_isFinite,
  Number_isSafeInteger,
  Object_hasOwn,
  Object_values,
  symbol,
  URI,
} from '@traversable/registry'
import { Json as JSON } from '@traversable/json'
import { t } from '@traversable/schema'

import type { ValidationError, Validator } from './types.js'
import type { Options } from './options.js'
import { defaults } from './options.js'
import { NO_ERRORS } from './errors.js'
import * as Json from './json.js'
import { defaultPath } from './shared.js'


export function any(options?: Options): Validator<any>
export function any({ errors: { any: ERRORS = defaults.errors.any } = defaults.errors }: Options = defaults): Validator<any> {
  function validateAny(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] { return ERRORS(got, path) }
  validateAny.tag = URI.any
  return validateAny
}

export function unknown(options?: Options): Validator<unknown>
export function unknown({ errors: { unknown: ERRORS = defaults.errors.unknown } = defaults.errors }: Options = defaults): Validator<unknown> {
  function validateUnknown(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] { return ERRORS(got, path) }
  validateUnknown.tag = URI.unknown
  return validateUnknown
}

export function never(options?: Options): Validator<never>
export function never({ errors: { never: ERRORS = defaults.errors.never } = defaults.errors }: Options = defaults): Validator<never> {
  function validateNever(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] { return ERRORS(got, path) }
  validateNever.tag = URI.never
  return validateNever
}

export { void_ as void }
function void_(options?: Options): Validator<never>
function void_({ errors: { void: ERRORS = defaults.errors.never } = defaults.errors }: Options = defaults): Validator<never> {
  function validateVoid(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] { return got === void 0 ? NO_ERRORS : ERRORS(got, path) }
  validateVoid.tag = URI.void
  return validateVoid
}

export { symbol_ as symbol }
function symbol_(options?: Options): Validator<symbol>
function symbol_({ errors: { symbol: ERRORS = defaults.errors.symbol } = defaults.errors }: Options = defaults): Validator<symbol> {
  function validateSymbol(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] { return typeof got === 'symbol' ? NO_ERRORS : ERRORS(got, path) }
  validateSymbol.tag = URI.symbol
  return validateSymbol
}

export { undefined_ as undefined }
function undefined_(options?: Options): Validator<undefined>
function undefined_({ errors: { undefined: ERRORS = defaults.errors.undefined } = defaults.errors }: Options = defaults): Validator<undefined> {
  function validateUndefined(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] { return got === undefined ? NO_ERRORS : ERRORS(got, path) }
  validateUndefined.tag = URI.undefined
  return validateUndefined
}

export { null_ as null }
function null_(options?: Options): Validator<null>
function null_({ errors: { null: ERRORS = defaults.errors.null } = defaults.errors }: Options = defaults): Validator<null> {
  function validateNull(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] { return got === null ? NO_ERRORS : ERRORS(got, path) }
  validateNull.tag = URI.null
  return validateNull
}

export function boolean(options?: Options): Validator<boolean>
export function boolean({ errors: { boolean: ERRORS = defaults.errors.boolean } = defaults.errors }: Options = defaults): Validator<boolean> {
  function validateBoolean(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] { return typeof got === 'boolean' ? NO_ERRORS : ERRORS(got, path) }
  validateBoolean.tag = URI.boolean
  return validateBoolean
}

export function integer(schema: t.integer, options?: Options): Validator<number>
export function integer(
  x: t.integer, {
    errors: {
      integer: ERRORS = defaults.errors.integer,
      integerAboveMaximum: TOO_BIG = defaults.errors.integerAboveMaximum,
      integerBelowMinimum: TOO_SMALL = defaults.errors.integerBelowMinimum,
    } = defaults.errors
  }: Options = defaults
): Validator<number> {
  function validateInteger(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    if (!Number_isSafeInteger(got)) return ERRORS(got, path)
    else if (typeof x.maximum === 'number' && got > x.maximum) return TOO_BIG(x.maximum, got, path)
    else if (typeof x.minimum === 'number' && got < x.minimum) return TOO_SMALL(x.minimum, got, path)
    else return NO_ERRORS
  }
  validateInteger.tag = URI.integer
  return validateInteger
}

export function bigint(schema: t.bigint, options?: Options): Validator<bigint>
export function bigint(
  x: t.bigint, {
    errors: {
      bigint: ERRORS = defaults.errors.bigint,
      bigintAboveMaximum: TOO_BIG = defaults.errors.bigintAboveMaximum,
      bigintBelowMinimum: TOO_SMALL = defaults.errors.bigintBelowMinimum,
    } = defaults.errors
  }: Options = defaults
): Validator<bigint> {
  function validateBigInt(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    if (typeof got !== 'bigint') return ERRORS(got, path)
    else if (typeof x.maximum === 'bigint' && got > x.maximum) return TOO_BIG(x.maximum, got, path)
    else if (typeof x.minimum === 'bigint' && got < x.minimum) return TOO_SMALL(x.minimum, got, path)
    else return NO_ERRORS
  }
  validateBigInt.tag = URI.bigint
  typeof x.maximum === 'bigint' && void (validateBigInt.maximum = x.maximum)
  typeof x.minimum === 'bigint' && void (validateBigInt.minimum = x.minimum)
  return validateBigInt
}

export function number(schema: t.number, options?: Options): Validator<number>
export function number(
  x: t.number, {
    errors: {
      number: ERRORS = defaults.errors.number,
      numberAboveExclusiveMaximum: ABOVE_EXCLUSIVE_MAX = defaults.errors.numberAboveExclusiveMaximum,
      numberBelowExclusiveMinimum: BELOW_EXCLUSIVE_MIN = defaults.errors.numberBelowExclusiveMinimum,
      numberAboveMaximum: ABOVE_MAX = defaults.errors.numberAboveMaximum,
      numberBelowMinimum: BELOW_MIN = defaults.errors.numberBelowMinimum,
    } = defaults.errors
  }: Options = defaults
): Validator<number> {
  function validateNumber(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    if (!Number_isFinite(got))
      return ERRORS(got, path)
    else if (typeof x.exclusiveMaximum === 'number' && got >= x.exclusiveMaximum)
      return ABOVE_EXCLUSIVE_MAX(x.exclusiveMaximum, got, path)
    else if (typeof x.exclusiveMinimum === 'number' && got <= x.exclusiveMinimum)
      return BELOW_EXCLUSIVE_MIN(x.exclusiveMinimum, got, path)
    else if (typeof x.maximum === 'number' && got > x.maximum)
      return ABOVE_MAX(x.maximum, got, path)
    else if (typeof x.minimum === 'number' && got < x.minimum)
      return BELOW_MIN(x.minimum, got, path)
    else return NO_ERRORS
  }
  validateNumber.tag = URI.number
  typeof x.exclusiveMaximum === 'number' && void (validateNumber.exclusiveMaximum = x.exclusiveMaximum)
  typeof x.exclusiveMinimum === 'number' && void (validateNumber.exclusiveMinimum = x.exclusiveMinimum)
  typeof x.maximum === 'number' && void (validateNumber.maximum = x.maximum)
  typeof x.minimum === 'number' && void (validateNumber.minimum = x.minimum)
  return validateNumber
}

export function string(schema: t.string, options?: Options): Validator<string>
export function string(x: t.string, {
  errors: {
    string: ERRORS = defaults.errors.string,
    stringAboveMaximum: TOO_LONG_ERRORS = defaults.errors.stringAboveMaximum,
    stringBelowMinimum: TOO_SHORT_ERRORS = defaults.errors.stringBelowMinimum,
  } = defaults.errors
}: Options = defaults): Validator<string> {
  function validateString(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    if (typeof got !== 'string') return ERRORS(got, path)
    else if (typeof x.maxLength === 'number' && got.length > x.maxLength) return TOO_LONG_ERRORS(x.maxLength, got, path)
    else if (typeof x.minLength === 'number' && got.length < x.minLength) return TOO_SHORT_ERRORS(x.minLength, got, path)
    else return NO_ERRORS
  }
  validateString.tag = URI.string
  return validateString
}

export function eq<T extends JSON.Mut<T>>(value: T, options?: Options): Validator<T>
export function eq<T extends JSON.Mut<T>>(value: T, options?: Options): Validator<T> {
  function validateEq(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] { return Json.fold(value, options)(got, path) }
  validateEq.tag = URI.eq
  return validateEq
}

export function optional<T>(optionalSchema: t.optional<Validator<T>>, options?: Options): Validator<undefined | T>
export function optional<T>(x: t.optional<Validator<T>>, options?: Options): Validator<undefined | T> {
  function validateOptional(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    return got === undefined
      ? NO_ERRORS
      : x.def(got, path)
  }
  validateOptional[symbol.optional] = 1
  validateOptional.tag = URI.optional
  return validateOptional
}

export function array<T>(arraySchema: t.array<Validator<T>>, options?: Options): Validator<T[]>
export function array<T>(
  x: t.array<Validator<T>>, {
    errors: {
      array: ERRORS = defaults.errors.array,
      arrayAboveMaximum: TOO_LONG_ERRORS = defaults.errors.arrayAboveMaximum,
      arrayBelowMinimum: TOO_SHORT_ERRORS = defaults.errors.arrayBelowMinimum,
    } = defaults.errors
  }: Options = defaults
): Validator<T[]> {
  function validateArray(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    if (!Array_isArray(got))
      return ERRORS(got, path)
    else if (typeof x.minLength === 'number' && got.length < x.minLength)
      return TOO_SHORT_ERRORS(x.minLength, got, path)
    else if (typeof x.maxLength === 'number' && got.length > x.maxLength)
      return TOO_LONG_ERRORS(x.maxLength, got, path)
    else
      return got.flatMap((got, i) => x.def(got, [...path, i]))
  }
  validateArray.tag = URI.array
  typeof x.maxLength === 'number' && void (validateArray.maxLength = x.maxLength)
  typeof x.minLength === 'number' && void (validateArray.minLength = x.minLength)
  return validateArray
}

export function record<T>(recordSchema: t.record<Validator<T>>, options?: Options): Validator<Record<string, T>>
export function record<T>(
  x: t.record<Validator<T>>, {
    errors: {
      record: ERRORS = defaults.errors.record,
    } = defaults.errors
  }: Options = defaults
): Validator<Record<string, T>> {
  function validateRecord(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    const ARRAYS_ARE_OK = getConfig().schema.treatArraysAsObjects
    return (!got || typeof got !== 'object' || (ARRAYS_ARE_OK ? false : Array_isArray(got)))
      ? ERRORS(got, path)
      : Object_values(got).flatMap((got, k) => x.def(got, [...path, k]))
  }
  validateRecord.tag = URI.record
  return validateRecord
}

export function intersect<T extends readonly unknown[]>(
  intersectSchema: t.intersect<{ [I in keyof T]: Validator<T[I]> }>,
  options?: Options
): Validator
export function intersect<T extends readonly unknown[]>(x: t.intersect<{ [I in keyof T]: Validator<T[I]> }>): Validator {
  function validateIntersect(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    return x.def.flatMap((fn) => fn(got, path))
  }
  validateIntersect.tag = URI.intersect
  return validateIntersect
}

export function union<T extends readonly unknown[]>(
  unionSchema: t.union<{ [I in keyof T]: Validator<T[I]> }>,
  options?: Options
): Validator<T[number]>
export function union<T extends readonly unknown[]>(
  x: t.union<{ [I in keyof T]: Validator<T[I]> }>,
  options?: Options,
): Validator<T[number]> {
  function validateUnion(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    let errors = Array.of<ValidationError>()
    for (let i = 0, len = x.def.length; i < len; i++) {
      const validate = x.def[i]
      const localErrors = validate(got, path)
      if (localErrors.length === 0) return NO_ERRORS
      else errors.push(...localErrors)
    }
    return errors.flat(1)
  }
  validateUnion.tag = URI.union
  return validateUnion
}

export function tuple<T extends readonly unknown[]>(tupleSchema: t.tuple<{ [I in keyof T]: Validator<T[I]> }>, options?: Options): Validator<T>
export function tuple<T extends readonly unknown[]>(
  x: t.tuple<{ [I in keyof T]: Validator<T[I]> }>, {
    errors: {
      tuple: ERRORS = defaults.errors.tuple,
      tupleIndex: INDEX_ERRORS = defaults.errors.tupleIndex,
      tupleIndexExactOptional: INDEX_EXACT_ERRORS = defaults.errors.tupleIndexExactOptional,
    } = defaults.errors
  }: Options = defaults
): Validator<T> {
  function validateTuple(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    return !Array_isArray(got)
      ? ERRORS(got, path)
      : x.def.flatMap((fn, i): ValidationError[] => {
        const EXACT_OPTIONAL = getConfig().schema.optionalTreatment === 'exactOptional'
        const LOCAL_PATH = [...path, i]
        const IS_OPTIONAL = symbol.optional in fn && typeof fn[symbol.optional] === 'number'
        const OUT_OF_BOUNDS = got.length <= i
        return OUT_OF_BOUNDS
          ? IS_OPTIONAL
            ? NO_ERRORS
            : INDEX_ERRORS(i, got, path)
          : (got[i] === undefined && IS_OPTIONAL && EXACT_OPTIONAL)
            ? INDEX_EXACT_ERRORS(i, got, path)
            : fn(got[i], LOCAL_PATH)
      })
  }
  validateTuple.tag = URI.tuple
  return validateTuple
}

export function object<T extends Record<string, unknown>>(objectSchema: t.object<{ [K in keyof T]: Validator<T[K]> }>, options?: Options): Validator<T>
export function object<T extends Record<string, unknown>>(
  x: t.object<{ [K in keyof T]: Validator<T[K]> }>, {
    errors: {
      object: ERRORS = defaults.errors.object,
      objectKey: KEY_MISSING = defaults.errors.objectKey,
      objectKeyExactOptional: OPTIONAL_KEY_WAS_UNDEFINED = defaults.errors.objectKeyExactOptional,
    } = defaults.errors,
    failFast: FAIL_FAST = defaults.failFast,
  }: Options = defaults
): Validator<T> {
  function validateObject(got: unknown, path: (keyof any)[] = defaultPath): ValidationError[] {
    const $ = getConfig().schema
    const EXACT_OPTIONAL = $.optionalTreatment === 'exactOptional'
    const NON_ARRAY_CHECK = $.treatArraysAsObjects ? (got: unknown) => false : Array_isArray
    return (
      got === null
      || typeof got !== 'object'
      || NON_ARRAY_CHECK(got)
    ) ? ERRORS(got, path)
      : Object.entries(x.def).flatMap(([k, validator]): ValidationError[] => {
        const IS_OPTIONAL = symbol.optional in validator && typeof validator[symbol.optional] === 'number'
        let LOCAL_PATH = [...path, k]
        return !Object_hasOwn(got, k)
          ? IS_OPTIONAL
            ? NO_ERRORS
            : KEY_MISSING(k, got, path)
          : got[k] === undefined && IS_OPTIONAL && EXACT_OPTIONAL
            ? OPTIONAL_KEY_WAS_UNDEFINED(k, got, path)
            : validator(got[k], LOCAL_PATH)
      })
  }
  validateObject.tag = URI.object
  return validateObject
}
