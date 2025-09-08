import type {
  BoundableErrors as Boundable,
  JsonErrors as Json,
  MissingErrors as Missing,
  NullaryErrors as Nullary,
  UnaryErrors as Unary,
  ValidationError,
} from './types.js'

import { accessor, toPath } from './shared.js'
export const NO_ERRORS = Array.of<ValidationError>()

const NO_ERRORS_ = () => NO_ERRORS

export { Nullary }
const Nullary = {
  any: NO_ERRORS_,
  unknown: NO_ERRORS_,
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
} satisfies Nullary

export { Unary }
const Unary = {
  eq: NO_ERRORS_,
  ref: NO_ERRORS_,
  optional: NO_ERRORS_,
  intersect: NO_ERRORS_,
  union: NO_ERRORS_,
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
} satisfies Unary

const Missing = {
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
} satisfies Missing

export { Boundable }
const Boundable = {
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
} satisfies Boundable

export { Json }
const Json = {
  jsonScalar: (scalarLiteral, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be ${scalarLiteral}`,
  }],
  jsonArray: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be an array`,
  }],
  jsonObject: (got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to be an object`,
  }],
  jsonObjectKey: (key, got, path) => [{
    got,
    path: toPath(path),
    message: `Expected ${accessor(path)} to have property '${key}'`
  }],
} satisfies Json

export type Errors =
  & Boundable
  & Json
  & Missing
  & Nullary
  & Unary

export const defaults = {
  ...Boundable,
  ...Json,
  ...Missing,
  ...Nullary,
  ...Unary,
} satisfies Errors
