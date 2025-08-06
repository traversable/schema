import * as vi from 'vitest'
import {
  boundedArray,
  boundedBigInt,
  boundedInteger,
  boundedNumber,
  boundedString,
} from '@traversable/schema/bounded'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: bounded', () => {
  vi.test('〖⛳️〗‹ ❲boundedInteger❳', () => {
    // SUCCESS
    vi.assert.isTrue(boundedInteger({})(0))
    vi.assert.isTrue(boundedInteger({ minimum: 0 })(1))
    vi.assert.isTrue(boundedInteger({ minimum: 0 })(0))
    vi.assert.isTrue(boundedInteger({ maximum: 1 })(0))
    vi.assert.isTrue(boundedInteger({ maximum: 1 })(1))
    vi.assert.isTrue(boundedInteger({ minimum: 0, maximum: 1 })(0))
    vi.assert.isTrue(boundedInteger({ minimum: 0, maximum: 1 })(1))
    // FAILURE
    vi.assert.isFalse(boundedInteger({})(0.1))
    vi.assert.isFalse(boundedInteger({ minimum: 1 })(0))
    vi.assert.isFalse(boundedInteger({ maximum: 1 })(2))
    vi.assert.isFalse(boundedInteger({ minimum: 1, maximum: 2 })(0))
    vi.assert.isFalse(boundedInteger({ minimum: 1, maximum: 2 })(3))
  })

  vi.test('〖⛳️〗‹ ❲boundedBigInt❳', () => {
    // SUCCESS
    vi.assert.isTrue(boundedBigInt({})(0n))
    vi.assert.isTrue(boundedBigInt({ minimum: 0n })(1n))
    vi.assert.isTrue(boundedBigInt({ minimum: 0n })(0n))
    vi.assert.isTrue(boundedBigInt({ maximum: 1n })(0n))
    vi.assert.isTrue(boundedBigInt({ maximum: 1n })(1n))
    vi.assert.isTrue(boundedBigInt({ minimum: 0n, maximum: 1n })(0n))
    vi.assert.isTrue(boundedBigInt({ minimum: 0n, maximum: 1n })(1n))
    // FAILURE
    vi.assert.isFalse(boundedBigInt({})('0n'))
    vi.assert.isFalse(boundedBigInt({ minimum: 1n })(0n))
    vi.assert.isFalse(boundedBigInt({ maximum: 1n })(2n))
    vi.assert.isFalse(boundedBigInt({ minimum: 1n, maximum: 2n })(0n))
    vi.assert.isFalse(boundedBigInt({ minimum: 1n, maximum: 2n })(3n))
    // EDGE CASES
    vi.assert.isTrue(boundedBigInt({ minimum: 1n, maximum: 0n, })(0n))
  })

  vi.test('〖⛳️〗‹ ❲boundedString❳', () => {
    // SUCCESS
    vi.assert.isTrue(boundedString({})(''))
    vi.assert.isTrue(boundedString({ minimum: 0 })(''))
    vi.assert.isTrue(boundedString({ minimum: 0 })('1'))
    vi.assert.isTrue(boundedString({ maximum: 1 })(''))
    vi.assert.isTrue(boundedString({ maximum: 1 })('1'))
    vi.assert.isTrue(boundedString({ minimum: 0, maximum: 1 })(''))
    vi.assert.isTrue(boundedString({ minimum: 0, maximum: 1 })('1'))
    // FAILURE
    vi.assert.isFalse(boundedString({})(0))
    vi.assert.isFalse(boundedString({ minimum: 1 })(''))
    vi.assert.isFalse(boundedString({ maximum: 1 })('12'))
    vi.assert.isFalse(boundedString({ minimum: 1, maximum: 2 })(''))
    vi.assert.isFalse(boundedString({ minimum: 1, maximum: 2 })('123'))
  })

  vi.test('〖⛳️〗‹ ❲boundedNumber❳', () => {
    // SUCCESS
    vi.assert.isTrue(boundedNumber({})(1))
    vi.assert.isTrue(boundedNumber({ minimum: 0 })(1))
    vi.assert.isTrue(boundedNumber({ minimum: 0 })(0))
    vi.assert.isTrue(boundedNumber({ maximum: 1 })(0))
    vi.assert.isTrue(boundedNumber({ maximum: 1 })(1))
    vi.assert.isTrue(boundedNumber({ minimum: 0, maximum: 1 })(0))
    vi.assert.isTrue(boundedNumber({ minimum: 0, maximum: 1 })(1))
    // FAILURE
    vi.assert.isFalse(boundedNumber({})('0'))
    vi.assert.isFalse(boundedNumber({ minimum: 1 })(0))
    vi.assert.isFalse(boundedNumber({ maximum: 1 })(2))
    vi.assert.isFalse(boundedNumber({ exclusiveMinimum: 1 })(1))
    vi.assert.isFalse(boundedNumber({ exclusiveMaximum: 1 })(1))
  })

  vi.test('〖⛳️〗‹ ❲boundedArray❳', () => {
    // SUCCESS
    vi.assert.isTrue(boundedArray({}, () => true)([]))
    vi.assert.isTrue(boundedArray({ minimum: 0 }, () => true)([]))
    vi.assert.isTrue(boundedArray({ minimum: 0 }, () => true)([0]))
    vi.assert.isTrue(boundedArray({ maximum: 1 }, () => true)([]))
    vi.assert.isTrue(boundedArray({ maximum: 1 }, () => true)([0]))
    vi.assert.isTrue(boundedArray({ minimum: 0, maximum: 1 }, () => true)([]))
    vi.assert.isTrue(boundedArray({ minimum: 0, maximum: 1 }, () => true)([1]))
    // FAILURE
    vi.assert.isFalse(boundedArray({}, () => true)(0))
    vi.assert.isFalse(boundedArray({}, () => false)([0]))
    vi.assert.isFalse(boundedArray({ minimum: 1 }, () => true)([]))
    vi.assert.isFalse(boundedArray({ maximum: 1 }, () => true)([1, 2]))
    vi.assert.isFalse(boundedArray({ minimum: 1, maximum: 2 }, () => true)([]))
    vi.assert.isFalse(boundedArray({ minimum: 1, maximum: 2 }, () => true)([1, 2, 3]))
  })


  vi.test('〖⛳️〗‹ ❲boundedNumber❳: gracefully handles conflicts', () => {
    /**
     * in the presence of both maximum and exclusiveMaximum, boundedNumber keeps the _lesser_ of the two
     */
    // SUCCESS
    vi.assert.isTrue(boundedNumber({ maximum: 2, exclusiveMaximum: 1 })(0))
    vi.assert.isTrue(boundedNumber({ maximum: 1, exclusiveMaximum: 2 })(1))
    // FAILURE
    vi.assert.isFalse(boundedNumber({ maximum: 2, exclusiveMaximum: 1 })(1))
    vi.assert.isFalse(boundedNumber({ maximum: 1, exclusiveMaximum: 2 })(2))

    /**
     * in the presence of both minimum and exclusiveMinimum, boundedNumber keeps the _greater_ of the two
     */
    // SUCCESS
    vi.assert.isTrue(boundedNumber({ minimum: 2, exclusiveMinimum: 1 })(2))
    vi.assert.isTrue(boundedNumber({ minimum: 1, exclusiveMinimum: 2 })(3))
    // FAILURE
    vi.assert.isFalse(boundedNumber({ minimum: 2, exclusiveMinimum: 1 })(1))
    vi.assert.isFalse(boundedNumber({ minimum: 1, exclusiveMinimum: 2 })(2))
  })
})
