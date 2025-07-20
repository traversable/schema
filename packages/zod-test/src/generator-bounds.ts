import * as fc from 'fast-check'

import type { newtype } from '@traversable/registry'
import { fn, Number_isFinite, Number_isNatural, Number_isSafeInteger } from '@traversable/registry'

/** @internal */
const nullable = <T>(model: fc.Arbitrary<T>) => fc.oneof(fc.constant(null), fc.constant(null), model)

/** @internal */
const isBigInt = (x: unknown) => typeof x === 'bigint'

export const defaultDoubleConstraints = {
  noNaN: true,
  noDefaultInfinity: true,
} satisfies fc.DoubleConstraints

const defaultIntBounds = [-0x1000, +0x1000, null] satisfies Bounds_int
const defaultBigIntBounds = [-0x1000000n, 0x1000000n, null] satisfies Bounds_bigint
const defaultNumberBounds = [-0x10000, +0x10000, null, false, false] satisfies Bounds_number
const defaultStringBounds = [0, +0x40] satisfies Bounds_string
const defaultArrayBounds = [0, +0x10] satisfies Bounds_array

export const defaults = {
  int: defaultIntBounds,
  number: defaultNumberBounds,
  bigint: defaultBigIntBounds,
  string: defaultStringBounds,
  array: defaultArrayBounds,
}

const clampMin
  : <T extends number | bigint>(min: T, max: T, predicate: (x: T | null) => x is T) => (x: T | null, y: T | null) => T | null
  = (min, max, predicate) => (x, y) => {
    if (!predicate(x)) {
      return null
    } else if (!predicate(y)) {
      return x < min ? min : max < x ? max : x
    } else {
      const z = x < y ? x : y
      return z < min ? min : max < z ? max : z
    }
  }

const clampMax
  : <T extends number | bigint>(min: T, max: T, predicate: (x: T | null) => x is T) => (x: T | null, y: T | null) => T | null
  = (min, max, predicate) => (x, y) => {
    if (!predicate(x)) {
      return null
    } else if (!predicate(y)) {
      return x < min ? min : max < x ? max : x
    } else {
      const z = x > y ? x : y
      return z < min ? min : max < z ? max : z
    }
  }

const clampIntMin = clampMin(defaults.int[0], defaults.int[1], Number_isSafeInteger)
const clampIntMax = clampMax(defaults.int[0], defaults.int[1], Number_isSafeInteger)
const clampBigIntMin = clampMin(defaults.bigint[0], defaults.bigint[1], isBigInt)
const clampBigIntMax = clampMax(defaults.bigint[0], defaults.bigint[1], isBigInt)
const clampNumberMin = clampMin(defaults.number[0], defaults.number[1], Number_isFinite)
const clampNumberMax = clampMin(defaults.number[0], defaults.number[1], Number_isFinite)
const clampStringMin = clampMin(defaults.string[0], defaults.string[1], Number_isNatural)
const clampStringMax = clampMax(defaults.string[0], defaults.string[1], Number_isNatural)
const clampArrayMin = clampMin(defaults.array[0], defaults.array[1], Number_isNatural)
const clampArrayMax = clampMax(defaults.array[0], defaults.array[1], Number_isNatural)

export const makeInclusiveBounds = <T>(model: fc.Arbitrary<T>) => ({ minimum: model, maximum: model })

export { Bounds_int as int }
interface Bounds_int extends newtype<[
  minimum: number | null,
  maximum: number | null,
  multipleOf: number | null,
]> {}



const Bounds_int
  : (model: fc.Arbitrary<number>) => fc.Arbitrary<Bounds_int>
  = (model) => fc.tuple(nullable(model), nullable(model), nullable(model)).map(([x, y, multipleOf]) => [
    clampIntMin(x, y),
    clampIntMax(y, x),
    multipleOf,
    // clampInt(multipleOf),
  ])

export { Bounds_bigint as bigint }
interface Bounds_bigint extends newtype<[
  minimum: bigint | null,
  maximum: bigint | null,
  multipleOf: bigint | null,
]> {}

const Bounds_bigint
  : (model: fc.Arbitrary<bigint>) => fc.Arbitrary<Bounds_bigint>
  = (model) => fc.tuple(nullable(model), nullable(model), nullable(model)).map(([x, y, multipleOf]) => [
    clampBigIntMin(x, y),
    clampBigIntMax(y, x),
    multipleOf, // clampBigInt(multipleOf),
  ])

export { Bounds_string as string }
interface Bounds_string extends newtype<[
  minLength: number | null,
  maxLength: number | null,
]> {}

const Bounds_string
  : (model: fc.Arbitrary<number>) => fc.Arbitrary<Bounds_string>
  = (model) => fc.tuple(nullable(model), nullable(model), nullable(model)).map(
    ([x, y, length]) => Number_isNatural(length)
      ? [null, null] satisfies [any, any]
      // [clampString(length), clampString(length)]
      : [clampStringMin(x, y), clampStringMax(y, x)]
  )

export { Bounds_number as number }
interface Bounds_number extends newtype<[
  minimum: number | null,
  maximum: number | null,
  multipleOf: number | null,
  exclusiveMinimum: boolean,
  exclusiveMaximum: boolean,
]> {}

const deltaIsSubEpsilon = (x: number, y: number) => Math.abs(x - y) < Number.EPSILON

const Bounds_number
  : (model: fc.Arbitrary<number>) => fc.Arbitrary<Bounds_number>
  = (model) => fc.tuple(
    nullable(model),
    nullable(model),
    nullable(model),
    fc.boolean(),
    fc.boolean()
  ).map(
    fn.flow(
      ([x, y, multipleOf, minExcluded, maxExcluded]): Bounds_number => [
        clampNumberMin(x, y),
        clampNumberMax(y, x),
        // clampNumber(multipleOf),
        multipleOf,
        minExcluded,
        maxExcluded,
      ],
      ([min, max, multipleOf, minExcluded, maxExcluded]): Bounds_number => [
        min,
        ((minExcluded || maxExcluded) && min != null && max != null && deltaIsSubEpsilon(min, max)) ? max + 1 : max,
        multipleOf,
        minExcluded,
        maxExcluded
      ],
    )
  )

export { Bounds_array as array }
interface Bounds_array extends newtype<[
  minLength: number | null,
  maxLength: number | null,
]> {}

const Bounds_array
  : (model: fc.Arbitrary<number>) => fc.Arbitrary<Bounds_array>
  = (model) => fc.tuple(
    nullable(model),
    nullable(model),
    fc.constant(null)
  ).map(([x, y, exactLength]) =>
    Number_isNatural(exactLength)
      ? [null, null]
      : [clampArrayMin(x, y), clampArrayMax(y, x)]
  )


export const intBoundsToIntegerConstraints
  : (bounds?: Bounds_int) => fc.IntegerConstraints
  = (bounds = defaultIntBounds) => {
    const [min, max, multipleOf] = bounds
    return {
      max: max ?? void 0,
      min: min ?? void 0,
    } satisfies fc.IntegerConstraints
  }

export const bigintBoundsToBigIntConstraints
  : (bounds?: Bounds_bigint) => fc.BigIntConstraints
  = (bounds = defaultBigIntBounds) => {
    const [min, max, multipleOf] = bounds
    return {
      max: max ?? void 0,
      min: min ?? void 0,
    } satisfies fc.BigIntConstraints
  }

export const numberBoundsToDoubleConstraints
  : (bounds?: Bounds_number) => fc.DoubleConstraints
  = (bounds = defaultNumberBounds) => {
    const [min, max, multipleOf, minExcluded, maxExcluded] = bounds
    return {
      ...defaultDoubleConstraints, max: max ?? void 0,
      min: min ?? void 0,
      minExcluded,
      maxExcluded,
    } satisfies fc.DoubleConstraints
  }

export const stringBoundsToStringConstraints
  : (bounds?: Bounds_string) => fc.StringConstraints
  = ([minLength, maxLength] = defaultStringBounds) => ({
    minLength: minLength ?? void 0,
    maxLength: maxLength ?? void 0
  }) satisfies fc.StringConstraints

export const arrayBoundsToArrayConstraints
  : (bounds?: Bounds_array) => fc.ArrayConstraints
  = ([minLength, maxLength] = defaultArrayBounds) => ({
    minLength: minLength ?? void 0,
    maxLength: maxLength ?? void 0
  }) satisfies fc.ArrayConstraints
