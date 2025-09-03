import type {
  Natural,
  NegativeInteger,
  NegativeNumber,
  NonNegativeInteger,
  NonNegativeNumber,
  NonPositiveInteger,
  NonPositiveNumber,
  NonUnion,
  PositiveNumber,
  StringifiedNatural,
} from '@traversable/registry'
import { Match } from '@traversable/registry/satisfies'
import * as vi from 'vitest'

const _0 = 0 as const
const _1 = 1 as const
const _2 = 2 as const
const _3 = 3 as const
const _4 = 4 as const
const _5 = 5 as const
const _6 = 6 as const
const _7 = 7 as const
const _8 = 8 as const
const _9 = 9 as const
const _10 = 10 as const
const _11 = 11 as const
const _12 = 12 as const
const _13 = 13 as const
const _14 = 14 as const
const _15 = 15 as const
const _16 = 16 as const
const $1 = `${1}` as const
const $NUMBER = `${Number()}` as const
const NEGATIVE_ONE = -1 as const
const ONE_POINT_ONE = 1.1 as const
const NEGATIVE_ONE_POINT_ONE = -1.1 as const

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲NonUnion❳', () => {
    function nonunion<const T extends NonUnion<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(nonunion(1)).toEqualTypeOf(_1)
    vi.expectTypeOf(nonunion(Number())).toBeNumber()
    // FAILURE
    vi.expectTypeOf(nonunion(
      /** @ts-expect-error */
      Math.random() > 0.5 ? _0 : _1
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲Natural❳', () => {
    function natural<T extends Natural<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(natural(+1)).toEqualTypeOf(_1)
    vi.expectTypeOf(natural(Number())).toBeNumber()
    vi.expectTypeOf(natural(0)).toEqualTypeOf(0 as const)
    // FAILURE
    vi.expectTypeOf(natural(
      /** @ts-expect-error */
      -1
    )).toBeNever()
    vi.expectTypeOf(natural(
      /** @ts-expect-error */
      +1.1
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲StringifiedNatural❳', () => {
    function stringifiedNatural<const T extends StringifiedNatural<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(stringifiedNatural('1')).toEqualTypeOf($1)
    vi.expectTypeOf(stringifiedNatural(`${Number()}`)).toEqualTypeOf($NUMBER)
    // FAILURE
    vi.expectTypeOf(stringifiedNatural(
      /** @ts-expect-error */
      '-0'
    )).toBeNever()
    vi.expectTypeOf(stringifiedNatural(
      /** @ts-expect-error */
      '1.1'
    )).toBeNever()
    vi.expectTypeOf(stringifiedNatural(
      /** @ts-expect-error */
      '01'
    )).toBeNever()
    vi.expectTypeOf(stringifiedNatural(
      /** @ts-expect-error */
      ' 1'
    )).toBeNever()
    vi.expectTypeOf(stringifiedNatural(
      /** @ts-expect-error */
      '-1'
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲NegativeInteger❳', () => {
    function negativeInteger<const T extends NegativeInteger<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(negativeInteger(-1)).toEqualTypeOf(NEGATIVE_ONE)
    vi.expectTypeOf(negativeInteger(Number())).toBeNumber()
    // FAILURE
    vi.expectTypeOf(negativeInteger(
      /** @ts-expect-error */
      +1
    )).toBeNever()
    vi.expectTypeOf(negativeInteger(
      /** @ts-expect-error */
      +0
    )).toBeNever()
    vi.expectTypeOf(negativeInteger(
      /** @ts-expect-error */
      -0
    )).toBeNever()
    vi.expectTypeOf(negativeInteger(
      /** @ts-expect-error */
      -1.1
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲NonPositiveInteger❳', () => {
    function nonPositiveInteger<T extends NonPositiveInteger<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(nonPositiveInteger(+0)).toEqualTypeOf(_0)
    vi.expectTypeOf(nonPositiveInteger(-0)).toEqualTypeOf(_0)
    vi.expectTypeOf(nonPositiveInteger(-1)).toEqualTypeOf(NEGATIVE_ONE)
    vi.expectTypeOf(nonPositiveInteger(Number())).toBeNumber()
    // FAILURE
    vi.expectTypeOf(nonPositiveInteger(
      /** @ts-expect-error */
      +1
    )).toBeNever()
    vi.expectTypeOf(nonPositiveInteger(
      /** @ts-expect-error */
      -1.1
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲NonNegativeInteger❳', () => {
    function nonNegativeInteger<T extends NonNegativeInteger<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(nonNegativeInteger(+0)).toEqualTypeOf(_0)
    vi.expectTypeOf(nonNegativeInteger(-0)).toEqualTypeOf(_0)
    vi.expectTypeOf(nonNegativeInteger(+1)).toEqualTypeOf(_1)
    vi.expectTypeOf(nonNegativeInteger(Number())).toBeNumber()
    // FAILURE
    vi.expectTypeOf(nonNegativeInteger(
      /** @ts-expect-error */
      -1.1
    )).toBeNever()
    vi.expectTypeOf(nonNegativeInteger(
      /** @ts-expect-error */
      +1.1
    )).toBeNever()
    vi.expectTypeOf(nonNegativeInteger(
      /** @ts-expect-error */
      -1
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲NegativeNumber❳', () => {
    function negativeNumber<const T extends NegativeNumber<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(negativeNumber(-1)).toEqualTypeOf(NEGATIVE_ONE)
    vi.expectTypeOf(negativeNumber(-1.1)).toEqualTypeOf(NEGATIVE_ONE_POINT_ONE)
    vi.expectTypeOf(negativeNumber(Number())).toBeNumber()
    // FAILURE
    vi.expectTypeOf(negativeNumber(
      /** @ts-expect-error */
      +0
    )).toBeNever()
    vi.expectTypeOf(negativeNumber(
      /** @ts-expect-error */
      -0
    )).toBeNever()
    vi.expectTypeOf(negativeNumber(
      /** @ts-expect-error */
      1
    )).toBeNever()
    vi.expectTypeOf(negativeNumber(
      /** @ts-expect-error */
      1.1
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲PositiveNumber❳', () => {
    function positiveNumber<const T extends PositiveNumber<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(positiveNumber(+1)).toEqualTypeOf(_1)
    vi.expectTypeOf(positiveNumber(+1.1)).toEqualTypeOf(ONE_POINT_ONE)
    vi.expectTypeOf(positiveNumber(Number())).toBeNumber()
    // FAILURE
    vi.expectTypeOf(positiveNumber(
      /** @ts-expect-error */
      +0
    )).toBeNever()
    vi.expectTypeOf(positiveNumber(
      /** @ts-expect-error */
      -0
    )).toBeNever()
    vi.expectTypeOf(positiveNumber(
      /** @ts-expect-error */
      -1
    )).toBeNever()
    vi.expectTypeOf(positiveNumber(
      /** @ts-expect-error */
      -1.1
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲NonNegativeNumber❳', () => {
    function nonNegativeNumber<T extends NonNegativeNumber<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(nonNegativeNumber(+1)).toEqualTypeOf(_1)
    vi.expectTypeOf(nonNegativeNumber(+0)).toEqualTypeOf(_0)
    vi.expectTypeOf(nonNegativeNumber(-0)).toEqualTypeOf(_0)
    vi.expectTypeOf(nonNegativeNumber(+1.1)).toEqualTypeOf(ONE_POINT_ONE)
    vi.expectTypeOf(nonNegativeNumber(Number())).toBeNumber()
    // FAILURE
    vi.expectTypeOf(nonNegativeNumber(
      /** @ts-expect-error */
      -1
    )).toBeNever()
    vi.expectTypeOf(nonNegativeNumber(
      /** @ts-expect-error */
      -1.1
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: smart constructors', () => {
  vi.test('〖⛳️〗› ❲NonPositiveNumber❳', () => {
    function nonPositiveNumber<T extends NonPositiveNumber<T>>(x: T): T { return x }
    // SUCCESS
    vi.expectTypeOf(nonPositiveNumber(-1)).toEqualTypeOf(NEGATIVE_ONE)
    vi.expectTypeOf(nonPositiveNumber(-1.1)).toEqualTypeOf(NEGATIVE_ONE_POINT_ONE)
    vi.expectTypeOf(nonPositiveNumber(+0)).toEqualTypeOf(_0)
    vi.expectTypeOf(nonPositiveNumber(-0)).toEqualTypeOf(_0)
    vi.expectTypeOf(nonPositiveNumber(Number())).toBeNumber()
    // FAILURE
    vi.expectTypeOf(nonPositiveNumber(
      /** @ts-expect-error */
      +1
    )).toBeNever()
    vi.expectTypeOf(nonPositiveNumber(
      /** @ts-expect-error */
      +1.1
    )).toBeNever()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: Match', () => {
  vi.test('〖⛳️〗› ❲Match.match❳', () => {
    // FINITE
    vi.expectTypeOf(Match.match([1], [2])).toEqualTypeOf(_1)
    vi.expectTypeOf(Match.match([1], { b: 2 })).toEqualTypeOf(_2)
    vi.expectTypeOf(Match.match({ a: 1 }, [2])).toEqualTypeOf(_3)
    vi.expectTypeOf(Match.match({ a: 1 }, { b: 2 })).toEqualTypeOf(_4)
    // MIXED
    vi.expectTypeOf(Match.match(Array(Number() || String()), [2])).toEqualTypeOf(_5)
    vi.expectTypeOf(Match.match([1], Array(Number() || String()))).toEqualTypeOf(_6)
    vi.expectTypeOf(Match.match([1], { [Number()]: 2 })).toEqualTypeOf(_7)
    vi.expectTypeOf(Match.match({ [Number()]: 1 }, [2])).toEqualTypeOf(_8)
    vi.expectTypeOf(Match.match({ a: 1 }, Array(Number() || String()))).toEqualTypeOf(_9)
    vi.expectTypeOf(Match.match(Array(Number() || String()), { a: 2 })).toEqualTypeOf(_10)
    vi.expectTypeOf(Match.match({ [Number()]: 1 }, { b: 2 })).toEqualTypeOf(_11)
    vi.expectTypeOf(Match.match({ a: 1 }, { [Number()]: 2 })).toEqualTypeOf(_12)
    // NON-FINITE
    vi.expectTypeOf(Match.match(Array(Number() || String()), Array(Number() || String()))).toEqualTypeOf(_13)
    vi.expectTypeOf(Match.match(Array(Number() || String()), { [String()]: Number() })).toEqualTypeOf(_14)
    vi.expectTypeOf(Match.match({ [String()]: Number() }, Array(Number() || String()))).toEqualTypeOf(_15)
    vi.expectTypeOf(Match.match({ [Number()]: String() }, { [String()]: Number() })).toEqualTypeOf(_16)
  })
})
