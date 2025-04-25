import type * as T from '@traversable/registry'
import type { Mutable, Unknown } from '@traversable/registry'
import { Json } from '@traversable/json'
import {
  Array_isArray,
  fn,
  getConfig,
  isValidIdentifier,
  Number_isFinite,
  Number_isSafeInteger,
  Object_hasOwn,
  Object_values,
  parseKey,
  symbol,
  URI,
} from '@traversable/registry'
import { t } from '@traversable/schema'

interface ValidationError {
  got: unknown
  message: string
  path: (string | number)[]
}

interface Validator<T = unknown> {
  (got: T | Unknown, path: (keyof any)[]): ValidationError[]
  [symbol.optional]?: number
}

const toPath = (xs: (keyof any)[]) => xs.filter((x) => typeof x !== 'symbol')

const keyAccessor = (k: keyof any) => {
  switch (true) {
    default: return '' as const
    case typeof k === 'string': return isValidIdentifier(k) ? `.${k}` as const : `["${parseKey(k)}"]` as const
    case typeof k === 'number': return `[${k}]` as const
  }
}

const accessor = (xs: (keyof any)[]) => xs.slice(1).reduce((acc: string, x) => acc += keyAccessor(x), String(xs[0]))

const NO_ERRORS = Array.of<ValidationError>()

type NullaryErrors = Record<
  T.TypeName<t.NullaryTag>,
  (got: unknown, path: (keyof any)[]) => ValidationError[]
>

const defaultNullaryErrors = {
  any: () => NO_ERRORS,
  unknown: () => NO_ERRORS,
  never: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to never have a value`
  }],
  void: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be void`,
  }],
  null: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be null`,
  }],
  undefined: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be undefined`,
  }],
  symbol: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be a symbol`,
  }],
  boolean: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be a boolean`,
  }],
} satisfies NullaryErrors

type UnaryErrors = Record<
  T.TypeName<t.UnaryTag>,
  (got: unknown, path: (keyof any)[]) => ValidationError[]
>

const defaultUnaryErrors = {
  eq: () => NO_ERRORS,
  optional: () => NO_ERRORS,
  intersect: () => NO_ERRORS,
  union: () => NO_ERRORS,
  array: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be an array`,
  }],
  record: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be an object`,
  }],
  tuple: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be an array`,
  }],
  object: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expacted ${accessor(path)} to be an object`,
  }],
} satisfies UnaryErrors

type MissingErrors = Record<
  | 'tupleIndex'
  | 'objectKey'
  | 'tupleIndexExactOptional'
  | 'objectKeyExactOptional'
  , (k: keyof any, got: unknown, path: (keyof any)[]) => ValidationError[]
>

const defaultMissingErrors = {
  tupleIndex: (index, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to have at least ${index as number + 1} elements`,
  }],
  tupleIndexExactOptional: (index, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to either have fewer than ${index as number + 1} elements or for ${accessor([...path, index])} to be defined`
  }],
  objectKey: (key, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to have property '${String(key)}'`,
  }],
  objectKeyExactOptional: (key, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to either not have property '${String(key)}' or for ${accessor([...path, key])} to be defined`,
  }],
} satisfies MissingErrors

type BoundableErrors =
  & Record<T.TypeName<t.BoundableTag>, (got: unknown, path: (keyof any)[]) => ValidationError[]>
  & Record<
    | 'arrayBelowMinimum'
    | 'arrayAboveMaximum'
    | 'integerBelowMinimum'
    | 'integerAboveMaximum'
    | 'bigintBelowMinimum'
    | 'bigintAboveMaximum'
    | 'numberBelowMinimum'
    | 'numberAboveMaximum'
    | 'numberBelowExclusiveMinimum'
    | 'numberAboveExclusiveMaximum'
    | 'stringBelowMinimum'
    | 'stringAboveMaximum'
    , (bound: number | bigint, got: unknown, path: (keyof any)[]) => ValidationError[]
  >

const defaultBoundableErrors = {
  integer: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be an integer`,
  }],
  bigint: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be a bigint`,
  }],
  number: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be a number`,
  }],
  string: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be a string`,
  }],
  //
  integerAboveMaximum: (max, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be at most ${max}`,
  }],
  integerBelowMinimum: (min, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be at least ${min}`,
  }],
  bigintAboveMaximum: (maximum, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be at most ${maximum}n`,
  }],
  bigintBelowMinimum: (minimum, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be at least ${minimum}n`,
  }],
  numberAboveExclusiveMaximum: (exclusiveMaximum, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be less than ${exclusiveMaximum}`,
  }],
  numberBelowExclusiveMinimum: (exclusiveMinimum, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be greater than ${exclusiveMinimum}`,
  }],
  numberAboveMaximum: (maximum, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be at most ${maximum}`,
  }],
  numberBelowMinimum: (minimum, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be at least ${minimum}`,
  }],
  stringAboveMaximum: (maxLength, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be at most ${maxLength} characters long`,
  }],
  stringBelowMinimum: (minLength, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be at least ${minLength} characters long`,
  }],
  arrayAboveMaximum: (maxLength, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to have at most ${maxLength} elements`,
  }],
  arrayBelowMinimum: (minLength, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to have at least ${minLength} elements`,
  }],
} satisfies BoundableErrors

type JsonLiteralErrors = {
  jsonScalarLiteral: (literal: Json.Scalar, got: unknown, path: (keyof any)[]) => ValidationError[]
  jsonArrayLiteral: (got: unknown, path: (keyof any)[]) => ValidationError[]
  jsonObjectLiteral: (got: unknown, path: (keyof any)[]) => ValidationError[]
  jsonObjectLiteralKey: (key: string, got: unknown, path: (keyof any)[]) => ValidationError[]
}

const defaultJsonLiteralErrors = {
  jsonScalarLiteral: (scalarLiteral, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be ${scalarLiteral}`,
  }],
  jsonArrayLiteral: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be an array`,
  }],
  jsonObjectLiteral: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be an object`,
  }],
  jsonObjectLiteralKey: (key, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to have property '${key}'`
  }],
} satisfies JsonLiteralErrors

type Errors =
  & BoundableErrors
  & NullaryErrors
  & MissingErrors
  & UnaryErrors
  & JsonLiteralErrors


const defaultErrors = {
  ...defaultNullaryErrors,
  ...defaultBoundableErrors,
  ...defaultMissingErrors,
  ...defaultUnaryErrors,
  ...defaultJsonLiteralErrors,
} satisfies Errors

type Options = {
  errors?: Partial<Errors>
}

const defaults = {
  errors: defaultErrors,
} satisfies Required<Options>

export function any(options?: Options): Validator<any>
export function any({ errors: { any: ERRORS = defaults.errors.any } = defaults.errors }: Options = defaults): Validator<any> {
  return function validateAny(got: unknown, path: (keyof any)[]): ValidationError[] { return ERRORS(got, path) }
}

export function unknown(options?: Options): Validator<unknown>
export function unknown({ errors: { unknown: ERRORS = defaults.errors.unknown } = defaults.errors }: Options = defaults): Validator<unknown> {
  return function validateUnknown(got: unknown, path: (keyof any)[]): ValidationError[] { return ERRORS(got, path) }
}

export function never(options?: Options): Validator<never>
export function never({ errors: { never: ERRORS = defaults.errors.never } = defaults.errors }: Options = defaults): Validator<never> {
  return function validateNever(got: unknown, path: (keyof any)[]): ValidationError[] { return ERRORS(got, path) }
}

export function void_(options?: Options): Validator<never>
export function void_({ errors: { void: ERRORS = defaults.errors.never } = defaults.errors }: Options = defaults): Validator<never> {
  return function validateVoid(got: unknown, path: (keyof any)[]): ValidationError[] {
    return got === void 0 ? NO_ERRORS : ERRORS(got, path)
  }
}

function symbol_(options?: Options): Validator<symbol>
function symbol_({ errors: { symbol: ERRORS = defaults.errors.symbol } = defaults.errors }: Options = defaults): Validator<symbol> {
  return function validateSymbol(got: unknown, path: (keyof any)[]) { return typeof got === 'symbol' ? NO_ERRORS : ERRORS(got, path) }
}

function undefined_(options?: Options): Validator<undefined>
function undefined_({ errors: { undefined: ERRORS = defaults.errors.undefined } = defaults.errors }: Options = defaults): Validator<undefined> {
  return function validateUndefined(got, path): ValidationError[] { return got === undefined ? NO_ERRORS : ERRORS(got, path) }
}

function null_(options?: Options): Validator<null>
function null_({ errors: { null: ERRORS = defaults.errors.null } = defaults.errors }: Options = defaults): Validator<null> {
  return function validateNull(got, path): ValidationError[] {
    return got === null ? NO_ERRORS : ERRORS(got, path)
  }
}

function boolean(options?: Options): Validator<boolean>
function boolean({ errors: { boolean: ERRORS = defaults.errors.boolean } = defaults.errors }: Options = defaults): Validator<boolean> {
  return function validateBoolean(got: unknown, path: (keyof any)[]): ValidationError[] {
    return typeof got === 'boolean' ? NO_ERRORS : ERRORS(got, path)
  }
}

function integer(schema: t.integer, options?: Options): Validator<number>
function integer(
  x: t.integer, {
    errors: {
      integer: ERRORS = defaults.errors.integer,
      integerAboveMaximum: ABOVE_MAX = defaults.errors.integerAboveMaximum,
      integerBelowMinimum: BELOW_MIN = defaults.errors.integerBelowMinimum,
    } = defaults.errors
  }: Options = defaults
): Validator<number> {
  return function validateInteger(got: unknown, path: (keyof any)[]) {
    if (!Number_isSafeInteger(got)) return ERRORS(got, path)
    else if (typeof x.maximum === 'number' && got > x.maximum) return ABOVE_MAX(x.maximum, got, path)
    else if (typeof x.minimum === 'number' && got < x.minimum) return BELOW_MIN(x.minimum, got, path)
    else return NO_ERRORS
  }
}

function bigint(schema: t.bigint, options?: Options): Validator<bigint>
function bigint(
  x: t.bigint, {
    errors: {
      bigint: ERRORS = defaults.errors.bigint,
      bigintAboveMaximum: ABOVE_MAX = defaults.errors.bigintAboveMaximum,
      bigintBelowMinimum: BELOW_MIN = defaults.errors.bigintBelowMinimum,
    } = defaults.errors
  }: Options = defaults
): Validator<number> {
  return function validateBigInt(got: unknown, path: (keyof any)[]) {
    if (typeof got !== 'bigint') return ERRORS(got, path)
    else if (typeof x.maximum === 'bigint' && got > x.maximum) return ABOVE_MAX(x.maximum, got, path)
    else if (typeof x.minimum === 'bigint' && got < x.minimum) return BELOW_MIN(x.minimum, got, path)
    else return NO_ERRORS
  }
}

function number(schema: t.number, options?: Options): Validator<number>
function number(
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
  return function validateNumber(got: unknown, path: (keyof any)[]) {
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
}

function string(schema: t.string, options?: Options): Validator<string>
function string(x: t.string, {
  errors: {
    string: ERRORS = defaults.errors.string,
    stringAboveMaximum: ABOVE_MAX = defaults.errors.stringAboveMaximum,
    stringBelowMinimum: BELOW_MIN = defaults.errors.stringBelowMinimum,
  } = defaults.errors
}: Options = defaults): Validator<string> {
  return function validateString(got: unknown, path: (keyof any)[]): ValidationError[] {
    if (typeof got !== 'string') return ERRORS(got, path)
    else if (typeof x.maxLength === 'number' && got.length > x.maxLength) return ABOVE_MAX(x.maxLength, got, path)
    else if (typeof x.minLength === 'number' && got.length < x.minLength) return BELOW_MIN(x.minLength, got, path)
    else return NO_ERRORS
  }
}

export function eq<T extends Json.Mut<T>>(value: T, options?: Options): Validator<T>
export function eq<T extends Json.Mut<T>>(value: T, options?: Options): Validator<T> { return fold.json(value, options) }

function optional<T>(optionalSchema: t.optional<Validator<T>>, options?: Options): Validator<undefined | T>
function optional<T>(x: t.optional<Validator<T>>, options?: Options): Validator<undefined | T> {
  let depth = (symbol.optional in x.def && typeof x.def[symbol.optional] === 'number' ? x.def[symbol.optional] : 0) + 1
  validateOptional[symbol.optional] = depth
  function validateOptional(got: unknown, path: (keyof any)[]) {
    return got === undefined
      ? NO_ERRORS
      : x.def(got, path)
  }
  return validateOptional
}

function array<T>(arraySchema: t.array<Validator<T>>, options?: Options): Validator<T[]>
function array<T>(
  x: t.array<Validator<T>>, {
    errors: {
      array: ERRORS = defaults.errors.array,
      arrayAboveMaximum: MAX_ERRORS = defaults.errors.arrayAboveMaximum,
      arrayBelowMinimum: MIN_ERRORS = defaults.errors.arrayBelowMinimum,
    } = defaults.errors
  }: Options = defaults
): Validator<T[]> {
  function arrayValidator(got: unknown, path: (keyof any)[]): ValidationError[] {
    if (!Array_isArray(got))
      return ERRORS(got, path)
    else if (typeof x.minLength === 'number' && got.length < x.minLength)
      return MIN_ERRORS(x.minLength, got, path)
    else if (typeof x.maxLength === 'number' && got.length > x.maxLength)
      return MAX_ERRORS(x.maxLength, got, path)
    else
      return got.flatMap((got, i) => x.def(got, [...path, i]))
  }
  return arrayValidator
}

function record<T>(recordSchema: t.record<Validator<T>>, options?: Options): Validator<Record<string, T>>
function record<T>(
  x: t.record<Validator<T>>, {
    errors: {
      record: ERRORS = defaults.errors.record,
    } = defaults.errors
  }: Options = defaults
): Validator<Record<string, T>> {
  function recordValidator(got: unknown, path: (keyof any)[]): ValidationError[] {
    const ARRAYS_ARE_OK = getConfig().schema.treatArraysAsObjects
    return (!got || typeof got !== 'object' || (ARRAYS_ARE_OK ? false : Array_isArray(got)))
      ? ERRORS(got, path)
      : Object_values(got).flatMap((got, k) => x.def(got, [...path, k]))
  }
  return recordValidator
}

function intersect<T extends readonly unknown[]>(
  intersectSchema: t.intersect<{ [I in keyof T]: Validator<T[I]> }>,
  options?: Options
): Validator
function intersect<T extends readonly unknown[]>(x: t.intersect<{ [I in keyof T]: Validator<T[I]> }>): Validator {
  return function validateIntersect(got: unknown, path: (keyof any)[]): ValidationError[] {
    return x.def.flatMap((fn) => fn(got, path))
  }
}

function union<T extends readonly unknown[]>(
  unionSchema: t.union<{ [I in keyof T]: Validator<T[I]> }>,
  options?: Options
): Validator<T[number]>
function union<T extends readonly unknown[]>(
  x: t.union<{ [I in keyof T]: Validator<T[I]> }>,
  options?: Options,
): Validator<T[number]> {
  return function validateUnion(got: unknown, path: (keyof any)[]): ValidationError[] {
    let errors = Array.of<ValidationError>()
    for (let i = 0, len = x.def.length; i < len; i++) {
      const validate = x.def[i]
      const localErrors = validate(got, path)
      if (localErrors.length === 0) return NO_ERRORS
      else errors.push(...localErrors)
    }
    return errors.flat(1)
  }
}

function tuple<T extends readonly unknown[]>(tupleSchema: t.tuple<{ [I in keyof T]: Validator<T[I]> }>, options?: Options): Validator<T>
function tuple<T extends readonly unknown[]>(
  x: t.tuple<{ [I in keyof T]: Validator<T[I]> }>, {
    errors: {
      tuple: ERRORS = defaults.errors.tuple,
      tupleIndex: INDEX_ERRORS = defaults.errors.tupleIndex,
      tupleIndexExactOptional: INDEX_EXACT_ERRORS = defaults.errors.tupleIndexExactOptional,
    } = defaults.errors
  }: Options = defaults
): Validator<T> {
  function validateTuple(got: unknown, path: (keyof any)[]): ValidationError[] {
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
  return validateTuple
}

function object<T extends Record<string, unknown>>(objectSchema: t.object<{ [K in keyof T]: Validator<T[K]> }>, options?: Options): Validator<T>
function object<T extends Record<string, unknown>>(
  x: t.object<{ [K in keyof T]: Validator<T[K]> }>, {
    errors: {
      object: ERRORS = defaults.errors.object,
      objectKey: KEY_ERRORS = defaults.errors.objectKey,
      objectKeyExactOptional: KEY_EXACT_ERRORS = defaults.errors.objectKeyExactOptional,
    } = defaults.errors
  }: Options = defaults
): Validator<T> {
  function validateObject(got: unknown, path: (keyof any)[]): ValidationError[] {
    const $ = getConfig().schema
    const ARRAYS_ARE_OK = $.treatArraysAsObjects
    return (got === null || typeof got !== 'object' || (ARRAYS_ARE_OK ? false : Array_isArray(got)))
      ? ERRORS(got, path)
      : Object.entries(x.def).flatMap(([k, validator]): ValidationError[] => {
        const EXACT_OPTIONAL = $.optionalTreatment === 'exactOptional'
        const IS_OPTIONAL = symbol.optional in validator && typeof validator[symbol.optional] === 'number'
        let LOCAL_PATH = [...path, k]
        return !Object_hasOwn(got, k)
          ? IS_OPTIONAL
            ? NO_ERRORS
            : KEY_ERRORS(k, got, path)
          : got[k] === undefined && IS_OPTIONAL && EXACT_OPTIONAL
            ? KEY_EXACT_ERRORS(k, got, path)
            : validator(got[k], LOCAL_PATH)
      })
  }
  return validateObject
}

namespace JsonLiteral {
  export function scalar<T extends Json.Scalar>(x: T, options?: Options): Validator<T>
  export function scalar<T extends Json.Scalar>(
    x: T, {
      errors: {
        jsonScalarLiteral: ERRORS = defaults.errors.jsonScalarLiteral,
      } = defaults.errors
    }: Options = defaults
  ): Validator<T> {
    return function validateScalarLiteral(got: T | Unknown, path: (keyof any)[]): ValidationError[] {
      return got === x ? NO_ERRORS : ERRORS(x, got, path)
    }
  }

  export function array<T extends readonly unknown[]>(
    validators: { [I in keyof T]: Validator<T[I]> },
    options?: Options
  ): Validator<Mutable<T>>
  export function array<T extends readonly unknown[]>(
    validators: { [I in keyof T]: Validator<T[I]> }, {
      errors: {
        jsonArrayLiteral: ERRORS = defaults.errors.jsonArrayLiteral,
      } = defaults.errors
    }: Options = defaults
  ): Validator<Mutable<T>> {
    return function validateArrayLiteral(got: T | Unknown, path: (keyof any)[]): ValidationError[] {
      return !Json.isArray(got)
        ? ERRORS(got, path)
        : validators.flatMap((v, i) => v(got[i], [...path, i]))
    }
  }

  export function object<T extends { [x: string]: unknown }>(
    validators: { [K in keyof T]: Validator<T[K]> },
    options?: Options
  ): Validator<T>
  export function object<T extends { [x: string]: unknown }>(
    validators: { [K in keyof T]: Validator<T[K]> }, {
      errors: {
        jsonObjectLiteral: ERRORS = defaults.errors.jsonObjectLiteral,
        jsonObjectLiteralKey: KEY_ERRORS = defaults.errors.jsonObjectLiteralKey,
      } = defaults.errors
    }: Options = defaults
  ): Validator<T> {
    return function validateObjectLiteral(got: T | Unknown, path: (keyof any)[]): ValidationError[] {
      return !Json.isObject(got)
        ? ERRORS(got, path)
        : Object.entries(validators).flatMap(([k, validator]) => Object_hasOwn(got, k)
          ? validator(got[k], [...path, k])
          : KEY_ERRORS(k, got, path)
        )
    }
  }
}

namespace fold {
  export const json
    : (json: Json, options?: Options) => Validator<Json>
    = (json, options = defaults) => Json.fold<Validator>((x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case Json.isScalar(x): return JsonLiteral.scalar(x, options)
        case Json.isArray(x): return JsonLiteral.array(x, options)
        case Json.isObject(x): return JsonLiteral.object(x, options)
      }
    })(json)

  export const schema
    : <S extends t.Schema>(schema: S, options?: Options) => Validator<S['_type']>
    = (schema, options = defaults) => t.fold<Validator>((x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x.tag === URI.any: return any(options)
        case x.tag === URI.unknown: return unknown(options)
        case x.tag === URI.never: return never(options)
        case x.tag === URI.void: return void_(options)
        case x.tag === URI.null: return null_(options)
        case x.tag === URI.undefined: return undefined_(options)
        case x.tag === URI.symbol: return symbol_(options)
        case x.tag === URI.boolean: return boolean(options)
        case x.tag === URI.integer: return integer(x, options)
        case x.tag === URI.bigint: return bigint(x, options)
        case x.tag === URI.number: return number(x, options)
        case x.tag === URI.string: return string(x, options)
        case x.tag === URI.eq: return eq(x.def, options)
        case x.tag === URI.optional: return optional(x)
        case x.tag === URI.array: return array(x, options)
        case x.tag === URI.record: return record(x, options)
        case x.tag === URI.intersect: return intersect(x, options)
        case x.tag === URI.union: return union(x, options)
        case x.tag === URI.tuple: return tuple(x, options)
        case x.tag === URI.object: return object(x, options)
      }
    })(schema)
}

export const foldJson
  : <T extends Json.Mut<T>>(json: T, options?: Options) => Validator<T>
  = fold.json

export const foldSchema
  : <S extends t.Schema>(schema: S, options?: Options) => (data: t.typeof<S> | Unknown) => ValidationError[]
  = (schema, options = defaults) => (data) => fold.schema(schema, options)(data, ['value'])
