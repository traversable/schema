import * as vi from 'vitest'
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

import prettier from "@prettier/sync"

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

const array: unknown[] = []
const object: object = {}
const symbol = Symbol()
const date = new Date()

/**
 * TODO: turn `rest` back on
 */
// vi.test('〖⛳️〗› ❲zx.equals❳: z.tuple w/ rest', () => {
//   /////////////////
//   const equals = zx.equals(z.tuple([z.string(), z.int()], z.boolean()))
//   //    success
//   vi.expect.soft(equals(['', 0], ['', 0])).toBeTruthy()
//   vi.expect.soft(equals(['hey', 1], ['hey', 1])).toBeTruthy()
//   vi.expect.soft(equals(['hey', 1, true], ['hey', 1, true])).toBeTruthy()
//   vi.expect.soft(equals(['hey', 1, false], ['hey', 1, false])).toBeTruthy()
//   vi.expect.soft(equals(['hey', 1, true, true], ['hey', 1, true, true])).toBeTruthy()
//   vi.expect.soft(equals(['hey', 1, true, false], ['hey', 1, true, false])).toBeTruthy()
//   vi.expect.soft(equals(['hey', 1, false, false], ['hey', 1, false, false])).toBeTruthy()
//   //    failure
//   vi.expect.soft(equals(['', 0], ['', 1])).toBeFalsy()
//   vi.expect.soft(equals(['', 1], ['', 0])).toBeFalsy()
//   vi.expect.soft(equals(['', 0], ['hey', 0])).toBeFalsy()
//   vi.expect.soft(equals(['hey', 0], ['', 0])).toBeFalsy()
//   vi.expect.soft(equals(['', 0], ['', 0, false])).toBeFalsy()
//   vi.expect.soft(equals(['', 0], ['', 0, true])).toBeFalsy()
//   vi.expect.soft(equals(['', 0, true], ['', 0])).toBeFalsy()
//   vi.expect.soft(equals(['', 0, false], ['', 0])).toBeFalsy()
//   vi.expect.soft(equals(['', 0, true], ['', 0, false])).toBeFalsy()
//   vi.expect.soft(equals(['', 0, false], ['', 0, true])).toBeFalsy()
//   vi.expect.soft(equals(['', 0, false], ['', 0, false, false])).toBeFalsy()
//   vi.expect.soft(equals(['', 0, false, false], ['', 0, false])).toBeFalsy()
//   vi.expect.soft(equals(['', 0, false, true], ['', 0, false, false])).toBeFalsy()
//   vi.expect.soft(equals(['', 0, false, false], ['', 0, false, true])).toBeFalsy()
// })


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.equals', () => {
  vi.test('〖⛳️〗› ❲zx.equals❳: z.never', () => {
    /////////////////
    const equals = zx.equals(z.never())
    //    success
    vi.expect.soft(equals(undefined as never, undefined as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(undefined as never, null as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.void', () => {
    /////////////////
    const equals = zx.equals(z.void())
    //    success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(void 0, null as never)).toBeFalsy()
    vi.expect.soft(equals(null as never, void 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.any', () => {
    /////////////////
    const equals = zx.equals(z.any())
    //    success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    vi.expect.soft(equals(array, array)).toBeTruthy()
    vi.expect.soft(equals(object, object)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(array, [])).toBeFalsy()
    vi.expect.soft(equals([], array)).toBeFalsy()
    vi.expect.soft(equals(object, {})).toBeFalsy()
    vi.expect.soft(equals({}, object)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.unknown', () => {
    /////////////////
    const equals = zx.equals(z.unknown())
    //    success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    vi.expect.soft(equals(array, array)).toBeTruthy()
    vi.expect.soft(equals(object, object)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(array, [])).toBeFalsy()
    vi.expect.soft(equals([], array)).toBeFalsy()
    vi.expect.soft(equals(object, {})).toBeFalsy()
    vi.expect.soft(equals({}, object)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.null', () => {
    /////////////////
    const equals = zx.equals(z.null())
    //    success
    vi.expect.soft(equals(null, null)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(null, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, null)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.nan', () => {
    /////////////////
    const equals = zx.equals(z.nan())
    //    success
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.symbol', () => {
    /////////////////
    const equals = zx.equals(z.symbol())
    //    success
    vi.expect.soft(equals(symbol, symbol)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(symbol, Symbol())).toBeFalsy()
    vi.expect.soft(equals(Symbol(), symbol)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.boolean', () => {
    /////////////////
    const equals = zx.equals(z.boolean())
    //    success
    vi.expect.soft(equals(false, false)).toBeTruthy()
    vi.expect.soft(equals(true, true)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.int', () => {
    /////////////////
    const equals = zx.equals(z.int())
    //    success
    vi.expect.soft(equals(-0, -0)).toBeTruthy()
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, -0)).toBeFalsy()
    vi.expect.soft(equals(-0, 0)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.bigint', () => {
    /////////////////
    const equals = zx.equals(z.bigint())
    //    success
    vi.expect.soft(equals(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals(1n, 1n)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals(0n, 1n)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.number', () => {
    /////////////////
    const equals = zx.equals(z.number())
    //    success
    vi.expect.soft(equals(-0, -0)).toBeTruthy()
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    vi.expect.soft(equals(-0.1, -0.1)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, -0)).toBeFalsy()
    vi.expect.soft(equals(-0, 0)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
    vi.expect.soft(equals(0.1, -0.1)).toBeFalsy()
    vi.expect.soft(equals(-0.1, 0.1)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, NaN)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.string', () => {
    /////////////////
    const equals = zx.equals(z.string())
    //    success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.literal', () => {
    /////////////////
    const equals = zx.equals(z.literal(1))
    //    success
    vi.expect.soft(equals(1, 1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1, 2 as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.enum', () => {
    /////////////////
    const equals = zx.equals(z.enum(['1', '2']))
    //    success
    vi.expect.soft(equals('1', '1')).toBeTruthy()
    vi.expect.soft(equals('2', '2')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('1', '2')).toBeFalsy()
    vi.expect.soft(equals('2', '1')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.templateLiteral', () => {
    /////////////////
    const equals = zx.equals(z.templateLiteral(['1', '2']))
    //    success
    vi.expect.soft(equals('12', '12')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('1' as never, '12')).toBeFalsy()
    vi.expect.soft(equals('12', '1' as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.date', () => {
    /////////////////
    const equals = zx.equals(z.date())
    //    success
    vi.expect.soft(equals(date, date)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(date, new Date())).toBeFalsy()
    vi.expect.soft(equals(new Date(), date)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.optional', () => {
    /////////////////
    const equals = zx.equals(z.optional(z.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(undefined, undefined)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, undefined)).toBeFalsy()
    vi.expect.soft(equals(undefined, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.nonoptional', () => {
    /////////////////
    const equals = zx.equals(z.nonoptional(z.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.nullable', () => {
    /////////////////
    const equals = zx.equals(z.nullable(z.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, null)).toBeFalsy()
    vi.expect.soft(equals(null, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.array', () => {
    /////////////////
    const equals_01 = zx.equals(z.array(z.int()))
    //    success
    vi.expect.soft(equals_01([], [])).toBeTruthy()
    vi.expect.soft(equals_01([], array as [])).toBeTruthy()
    vi.expect.soft(equals_01(array as [], [])).toBeTruthy()
    vi.expect.soft(equals_01([1], [1])).toBeTruthy()
    vi.expect.soft(equals_01([1, 2], [1, 2])).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01([], [1])).toBeFalsy()
    vi.expect.soft(equals_01([1], [])).toBeFalsy()
    vi.expect.soft(equals_01([1], [1, 2])).toBeFalsy()
    vi.expect.soft(equals_01([1, 2], [1])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.set', () => {
    /////////////////
    const equals_01 = zx.equals(z.set(z.int()))
    //    success
    vi.expect.soft(equals_01(new Set([]), new Set([]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1]), new Set([1]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1, 2]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([2, 1]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1, 2, 1, 2]))).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01(new Set([]), new Set([1]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1]), new Set([]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1]), new Set([1, 2]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1, 2, 3]), new Set([1, 2, 1, 2]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1, 2, 1, 2, 3]))).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.map', () => {
    /////////////////
    const equals_01 = zx.equals(z.map(z.array(z.int()), z.int()))
    //    success
    vi.expect.soft(equals_01(new Map([]), new Map([]))).toBeTruthy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[1], 1]]))).toBeTruthy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 2]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01(new Map([]), new Map([[[], 0]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0]]), new Map([]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0]]), new Map([[[], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 1]]), new Map([[[], 0]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[2], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[2], 1]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[1], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 2]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[2], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[2], 1]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 2]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 2]]), new Map([[[], 0], [[1], 1], [[2, 2], 3]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 3]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 2]]), new Map([[[], 0], [[1], 1], [[2, 3], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 3], 2]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.record', () => {
    /////////////////
    const equals_01 = zx.equals(z.record(z.string(), z.int()))
    //    success
    vi.expect.soft(equals_01({}, {})).toBeTruthy()
    vi.expect.soft(equals_01(object as {}, {})).toBeTruthy()
    vi.expect.soft(equals_01({}, object as {})).toBeTruthy()
    vi.expect.soft(equals_01({ a: 1 }, { a: 1 })).toBeTruthy()
    vi.expect.soft(equals_01({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01({}, { a: 1 })).toBeFalsy()
    vi.expect.soft(equals_01({}, { a: 1 })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1 }, { a: 1, b: 2 })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: 2 }, { a: 1 })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.lazy', () => {
    /////////////////
    const equals = zx.equals(z.lazy(() => z.string()))
    //    success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.union', () => {
    /////////////////
    const equals_01 = zx.equals(z.union([]))
    //    success
    vi.expect.soft(equals_01('' as never, '' as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01('' as never, 'hey' as never)).toBeFalsy()

    /////////////////
    const equals_02 = zx.equals(z.union([z.int()]))
    //    success
    vi.expect.soft(equals_02(0, 0)).toBeTruthy()
    vi.expect.soft(equals_02(-0, -0)).toBeTruthy()
    // //    failure
    vi.expect.soft(equals_02(0, -0)).toBeFalsy()
    vi.expect.soft(equals_02(-0, 0)).toBeFalsy()

    /////////////////
    const equals_03 = zx.equals(z.union([z.int(), z.bigint()]))
    //    success
    vi.expect.soft(equals_03(0, 0)).toBeTruthy()
    vi.expect.soft(equals_03(-0, -0)).toBeTruthy()
    vi.expect.soft(equals_03(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals_03(1n, 1n)).toBeTruthy()
    //    failure
    vi.expect.soft(equals_03(0, 1)).toBeFalsy()
    vi.expect.soft(equals_03(1, 0)).toBeFalsy()
    vi.expect.soft(equals_03(0n, 1n)).toBeFalsy()
    vi.expect.soft(equals_03(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals_03(0, 0n)).toBeFalsy()
    vi.expect.soft(equals_03(0n, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.intersection', () => {
    /////////////////
    const equals_01 = zx.equals(z.intersection(z.object({ a: z.number() }), z.object({ b: z.string() })))
    //    success
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1, b: '' })).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01({ a: 1 } as never, { a: 1, b: '' })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1 } as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.tuple', () => {
    /////////////////
    const equals = zx.equals(z.tuple([z.string(), z.int()]))
    //    success
    vi.expect.soft(equals(['', 0], ['', 0])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1], ['hey', 1])).toBeTruthy()
    //    failure
    vi.expect.soft(equals(['', 0], ['', 1])).toBeFalsy()
    vi.expect.soft(equals(['', 1], ['', 0])).toBeFalsy()
    vi.expect.soft(equals(['', 0], ['hey', 0])).toBeFalsy()
    vi.expect.soft(equals(['hey', 0], ['', 0])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.object', () => {
    /////////////////
    const equals = zx.equals(z.object({ a: z.number(), b: z.string(), c: z.boolean() }))
    //    success
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 0, b: '', c: false })).toBeTruthy()
    vi.expect.soft(equals({ a: 9000, b: '', c: false }, { a: 9000, b: '', c: false })).toBeTruthy()
    vi.expect.soft(equals({ a: 0, b: 'hey', c: false }, { a: 0, b: 'hey', c: false })).toBeTruthy()
    vi.expect.soft(equals({ a: 0, b: '', c: true }, { a: 0, b: '', c: true })).toBeTruthy()
    //    failure
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 0, b: '', c: true })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 0, b: 'hey', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 1, b: '', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: '', c: true }, { a: 0, b: '', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: 'hey', c: false }, { a: 0, b: '', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 1, b: '', c: false }, { a: 0, b: '', c: false })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.object w/ optional props', () => {
    /////////////////
    const equals = zx.equals(z.object({ a: z.optional(z.boolean()), b: z.optional(z.symbol()) }))
    //    success
    vi.expect.soft(equals({}, {})).toBeTruthy()
    vi.expect.soft(equals({ a: false }, { a: false })).toBeTruthy()
    vi.expect.soft(equals({ b: symbol }, { b: symbol })).toBeTruthy()
    vi.expect.soft(equals({ a: false, b: symbol }, { a: false, b: symbol })).toBeTruthy()
    //    failure
    vi.expect.soft(equals({}, { a: false })).toBeFalsy()
    vi.expect.soft(equals({ a: false }, {})).toBeFalsy()
    vi.expect.soft(equals({ a: false }, { a: true })).toBeFalsy()
    vi.expect.soft(equals({}, { b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ b: symbol }, {})).toBeFalsy()
    vi.expect.soft(equals({ b: symbol }, { b: Symbol() })).toBeFalsy()
    vi.expect.soft(equals({ b: Symbol() }, { b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ a: false, b: symbol }, { a: true, b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ a: true, b: symbol }, { a: false, b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ a: false, b: symbol }, { a: false, b: Symbol() })).toBeFalsy()
    vi.expect.soft(equals({ a: false, b: Symbol() }, { a: false, b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ a: false, b: symbol }, { a: true, b: Symbol() })).toBeFalsy()
    vi.expect.soft(equals({ a: true, b: Symbol() }, { a: false, b: symbol })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.object w/ catchall', () => {
    const stringIndex = { [String()]: '' }
    const aFalse1: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex } as never
    const aFalse2: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex, b: 'hey' } as never
    const aFalse3: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex, b: 'ho' } as never
    const aTrue1: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex } as never
    const aTrue2: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex, b: 'hey' } as never
    const aTrue3: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex, b: 'ho' } as never

    /////////////////
    const equals = zx.equals(z.object({ a: z.boolean() }).catchall(z.string()))
    //    success
    vi.expect.soft(equals({ a: false } as never, { a: false } as never)).toBeTruthy()
    vi.expect.soft(equals({ a: true } as never, { a: true } as never)).toBeTruthy()
    vi.expect.soft(equals(aFalse1, aFalse1)).toBeTruthy()
    vi.expect.soft(equals(aFalse2, aFalse2)).toBeTruthy()
    vi.expect.soft(equals(aFalse3, aFalse3)).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse1 }, { ...aFalse1 })).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse2 }, { ...aFalse2 })).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse3 }, { ...aFalse3 })).toBeTruthy()
    vi.expect.soft(equals(aFalse1, { ...aFalse1 })).toBeTruthy()
    vi.expect.soft(equals(aFalse2, { ...aFalse2 })).toBeTruthy()
    vi.expect.soft(equals(aFalse3, { ...aFalse3 })).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse1 }, aFalse1)).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse2 }, aFalse2)).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse3 }, aFalse3)).toBeTruthy()
    vi.expect.soft(equals(aTrue1, aTrue1)).toBeTruthy()
    vi.expect.soft(equals(aTrue2, aTrue2)).toBeTruthy()
    vi.expect.soft(equals(aTrue3, aTrue3)).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue1 }, { ...aTrue1 })).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue2 }, { ...aTrue2 })).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue3 }, { ...aTrue3 })).toBeTruthy()
    vi.expect.soft(equals(aTrue1, { ...aTrue1 })).toBeTruthy()
    vi.expect.soft(equals(aTrue2, { ...aTrue2 })).toBeTruthy()
    vi.expect.soft(equals(aTrue3, { ...aTrue3 })).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue1 }, aTrue1)).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue2 }, aTrue2)).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue3 }, aTrue3)).toBeTruthy()
    //    failure
    vi.expect.soft(equals({ a: false } as never, { a: true } as never)).toBeFalsy()
    vi.expect.soft(equals({ a: true } as never, { a: false } as never)).toBeFalsy()
    vi.expect.soft(equals(aTrue1, aFalse1)).toBeFalsy()
    vi.expect.soft(equals(aFalse1, aTrue1)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue1 }, { ...aFalse1 })).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse1 }, { ...aTrue1 })).toBeFalsy()
    vi.expect.soft(equals(aTrue2, aFalse2)).toBeFalsy()
    vi.expect.soft(equals(aFalse2, aTrue2)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue2 }, { ...aFalse2 })).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse2 }, { ...aTrue2 })).toBeFalsy()
    vi.expect.soft(equals(aTrue3, aFalse3)).toBeFalsy()
    vi.expect.soft(equals(aFalse3, aTrue3)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue3 }, { ...aFalse3 })).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse3 }, { ...aTrue3 })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.pipe', () => {
    /////////////////
    const equals = zx.equals(z.pipe(z.number(), z.int()))
    //    success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.catch', () => {
    /////////////////
    const equals = zx.equals(z.number().catch(1))
    //    success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.equals.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.never', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.never()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.any', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.any()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: any, r: any) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.unknown', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.unknown()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: unknown, r: unknown) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.void', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.void()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: void, r: void) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.undefined', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.undefined()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: undefined, r: undefined) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.null', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.null()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: null, r: null) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.boolean', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.boolean()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: boolean, r: boolean) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.symbol', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.symbol()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: symbol, r: symbol) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.nan', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.int()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.int', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.int()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.bigint', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.bigint()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: bigint, r: bigint) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.number', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.number()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.string', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.string()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: string, r: string) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.enum', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.enum([])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      zx.equals.writeable(
        z.enum(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a", r: "a") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      zx.equals.writeable(
        z.enum(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a" | "b", r: "a" | "b") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.literal', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.literal([])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      zx.equals.writeable(
        z.literal('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a", r: "a") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      zx.equals.writeable(
        z.literal(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a" | "b", r: "a" | "b") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.templateLiteral', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.templateLiteral([])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "", r: "") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      zx.equals.writeable(
        z.templateLiteral(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a", r: "a") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      zx.equals.writeable(
        z.templateLiteral(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "ab", r: "ab") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.file', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.file()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: File, r: File) {
        if (l === r) return true
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.date', () => {
    vi.expect.soft(format(
      zx.equals.writeable(z.date())
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Date, r: Date) {
        if (!Object.is(l.getTime(), r.getTime())) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.lazy', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.lazy(() => z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        if (l === r) return true
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.optional', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.optional(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: undefined | number, r: undefined | number) {
        if (l === r) return true
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.nullable', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.nullable(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: null | number, r: null | number) {
        if (l === r) return true
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.set', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.set(z.number()),
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Set<number>, r: Set<number>) {
        if (l === r) return true
        if (l.size !== r.size) return false
        {
          const l_values = Array.from(l).sort()
          const r_values = Array.from(r).sort()
          for (let ix = 0, len = l_values.length; ix < len; ix++) {
            const l_values_ix_ = l_values[ix]
            const r_values_ix_ = r_values[ix]
            if (!Object.is(l_values_ix_, r_values_ix_)) return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.map', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.map(z.number(), z.unknown()),
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Map<number, unknown>, r: Map<number, unknown>) {
        if (l === r) return true
        if (l.size !== r.size) return false
        {
          const l_entries = Array.from(l).sort()
          const r_entries = Array.from(r).sort()
          for (let ix = 0, len = l_entries.length; ix < len; ix++) {
            const [l_key, l_value] = l_entries[ix]
            const [r_key, r_value] = r_entries[ix]
            if (!Object.is(l_key, r_key)) return false
            if (!Object.is(l_value, r_value)) return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.record', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.record(z.string(), z.record(z.string(), z.string())), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, string>>
      function equals(l: Type, r: Type) {
        if (l === r) return true
        const l_val = l
        const r_val = r
        const l_keys = Object.keys(l_val).sort()
        const r_keys = Object.keys(r_val).sort()
        if (l_keys.length !== r_keys.length) return false
        for (let ix = 0, len = l_keys.length; ix < len; ix++) {
          if (l_keys[ix] !== r_keys[ix]) return false
          const l_value = l_val[l_keys[ix]]
          const r_value = r_val[r_keys[ix]]
          const l_value_val = l_value
          const r_value_val = r_value
          const l_value_keys = Object.keys(l_value_val).sort()
          const r_value_keys = Object.keys(r_value_val).sort()
          if (l_value_keys.length !== r_value_keys.length) return false
          for (let ix = 0, len = l_value_keys.length; ix < len; ix++) {
            if (l_value_keys[ix] !== r_value_keys[ix]) return false
            const l_value_value = l_value_val[l_value_keys[ix]]
            const r_value_value = r_value_val[r_value_keys[ix]]
            if (l_value_value !== r_value_value) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(
        z.object({
          a: z.record(z.string(), z.string()),
          b: z.record(
            z.string(),
            z.object({
              c: z.object({
                d: z.string(),
                e: z.record(
                  z.string(),
                  z.array(z.string()),
                )
              })
            })
          )
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: Record<string, string>
        b: Record<string, { c: { d: string; e: Record<string, Array<string>> } }>
      }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
          const l_a_val = l.a
          const r_a_val = r.a
          const l_a_keys = Object.keys(l_a_val).sort()
          const r_a_keys = Object.keys(r_a_val).sort()
          if (l_a_keys.length !== r_a_keys.length) return false
          for (let ix = 0, len = l_a_keys.length; ix < len; ix++) {
            if (l_a_keys[ix] !== r_a_keys[ix]) return false
            const l_a_value = l_a_val[l_a_keys[ix]]
            const r_a_value = r_a_val[r_a_keys[ix]]
            if (l_a_value !== r_a_value) return false
          }
        }
        if (l.b !== r.b) {
          const l_b_val = l.b
          const r_b_val = r.b
          const l_b_keys = Object.keys(l_b_val).sort()
          const r_b_keys = Object.keys(r_b_val).sort()
          if (l_b_keys.length !== r_b_keys.length) return false
          for (let ix = 0, len = l_b_keys.length; ix < len; ix++) {
            if (l_b_keys[ix] !== r_b_keys[ix]) return false
            const l_b_value = l_b_val[l_b_keys[ix]]
            const r_b_value = r_b_val[r_b_keys[ix]]
            if (l_b_value.c !== r_b_value.c) {
              if (l_b_value.c.d !== r_b_value.c.d) return false
              if (l_b_value.c.e !== r_b_value.c.e) {
                const l_b_value_c_e_val = l_b_value.c.e
                const r_b_value_c_e_val = r_b_value.c.e
                const l_b_value_c_e_keys = Object.keys(l_b_value_c_e_val).sort()
                const r_b_value_c_e_keys = Object.keys(r_b_value_c_e_val).sort()
                if (l_b_value_c_e_keys.length !== r_b_value_c_e_keys.length)
                  return false
                for (let ix = 0, len = l_b_value_c_e_keys.length; ix < len; ix++) {
                  if (l_b_value_c_e_keys[ix] !== r_b_value_c_e_keys[ix]) return false
                  const l_b_value_c_e_value =
                    l_b_value_c_e_val[l_b_value_c_e_keys[ix]]
                  const r_b_value_c_e_value =
                    r_b_value_c_e_val[r_b_value_c_e_keys[ix]]
                  if (l_b_value_c_e_value.length !== r_b_value_c_e_value.length)
                    return false
                  for (let ix = 0, len = l_b_value_c_e_value.length; ix < len; ix++) {
                    const l_b_value_c_e_value_item = l_b_value_c_e_value[ix]
                    const r_b_value_c_e_value_item = r_b_value_c_e_value[ix]
                    if (l_b_value_c_e_value_item !== r_b_value_c_e_value_item)
                      return false
                  }
                }
              }
            }
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.array', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.array(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Array<number>, r: Array<number>) {
        if (l === r) return true
        if (l.length !== r.length) return false
        for (let ix = 0, len = l.length; ix < len; ix++) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (!Object.is(l_item, r_item)) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(
        z.array(z.object({
          c: z.object({
            d: z.string(),
            e: z.array(z.string()),
          })
        })), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{ c: { d: string; e: Array<string> } }>
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.length !== r.length) return false
        for (let ix = 0, len = l.length; ix < len; ix++) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item.c !== r_item.c) {
            if (l_item.c.d !== r_item.c.d) return false
            if (l_item.c.e !== r_item.c.e) {
              if (l_item.c.e.length !== r_item.c.e.length) return false
              for (let ix = 0, len = l_item.c.e.length; ix < len; ix++) {
                const l_item_c_e_item = l_item.c.e[ix]
                const r_item_c_e_item = r_item.c.e[ix]
                if (l_item_c_e_item !== r_item_c_e_item) return false
              }
            }
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(
        z.object({
          a: z.array(z.string()),
          b: z.array(z.object({
            c: z.object({
              d: z.string(),
              e: z.array(z.string()),
            })
          }))
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: Array<string>
        b: Array<{ c: { d: string; e: Array<string> } }>
      }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
          if (l.a.length !== r.a.length) return false
          for (let ix = 0, len = l.a.length; ix < len; ix++) {
            const l_a_item = l.a[ix]
            const r_a_item = r.a[ix]
            if (l_a_item !== r_a_item) return false
          }
        }
        if (l.b !== r.b) {
          if (l.b.length !== r.b.length) return false
          for (let ix = 0, len = l.b.length; ix < len; ix++) {
            const l_b_item = l.b[ix]
            const r_b_item = r.b[ix]
            if (l_b_item.c !== r_b_item.c) {
              if (l_b_item.c.d !== r_b_item.c.d) return false
              if (l_b_item.c.e !== r_b_item.c.e) {
                if (l_b_item.c.e.length !== r_b_item.c.e.length) return false
                for (let ix = 0, len = l_b_item.c.e.length; ix < len; ix++) {
                  const l_b_item_c_e_item = l_b_item.c.e[ix]
                  const r_b_item_c_e_item = r_b_item.c.e[ix]
                  if (l_b_item_c_e_item !== r_b_item_c_e_item) return false
                }
              }
            }
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.tuple', () => {
    vi.expect.soft(format(
      zx.equals.writeable(z.tuple([]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function equals(l: Type, r: Type) {
        if (l === r) return true
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(z.tuple([z.string(), z.string()]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l[0] !== r[0]) return false
        if (l[1] !== r[1]) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(
        z.tuple([z.number(), z.tuple([z.object({ a: z.boolean() })])])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: [number, [{ a: boolean }]], r: [number, [{ a: boolean }]]) {
        if (l === r) return true
        if (!Object.is(l[0], r[0])) return false
        if (l[1] !== r[1]) {
          if (l[1][0] !== r[1][0]) {
            if (l[1][0].a !== r[1][0].a) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(z.object({
        a: z.tuple([z.string(), z.string()]),
        b: z.optional(z.tuple([z.string(), z.optional(z.tuple([z.string()]))]))
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: [string, string]; b?: [string, _?: [string]] }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
          if (l.a[0] !== r.a[0]) return false
          if (l.a[1] !== r.a[1]) return false
        }
        if (l.b !== r.b) {
          if (l.b?.[0] !== r.b?.[0]) return false
          if (l.b?.[1] !== r.b?.[1]) {
            if (l.b[1]?.[0] !== r.b[1]?.[0]) return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.object', () => {
    vi.expect.soft(format(
      zx.equals.writeable(z.object({}))
    )).toMatchInlineSnapshot
      (`
      "function equals(l: {}, r: {}) {
        if (l === r) return true
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(
        z.object({
          a: z.object({
            b: z.string(),
            c: z.string(),
          }),
          d: z.optional(z.string()),
          e: z.object({
            f: z.string(),
            g: z.optional(
              z.object({
                h: z.string(),
                i: z.string(),
              })
            )
          })
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot(
      `
      "type Type = {
        a: { b: string; c: string }
        d?: string
        e: { f: string; g?: { h: string; i: string } }
      }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
          if (l.a.b !== r.a.b) return false
          if (l.a.c !== r.a.c) return false
        }
        if (l.d !== r.d) return false
        if (l.e !== r.e) {
          if (l.e.f !== r.e.f) return false
          if (l.e.g !== r.e.g) {
            if (l.e.g?.h !== r.e.g?.h) return false
            if (l.e.g?.i !== r.e.g?.i) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(z.object({
        b: z.array(z.string()),
        '0b': z.array(z.string()),
        '00b': z.array(z.string()),
        '-00b': z.array(z.string()),
        '00b0': z.array(z.string()),
        '--00b0': z.array(z.string()),
        '-^00b0': z.array(z.string()),
        '': z.array(z.string()),
        '_': z.array(z.string()),
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        b: Array<string>
        "0b": Array<string>
        "00b": Array<string>
        "-00b": Array<string>
        "00b0": Array<string>
        "--00b0": Array<string>
        "-^00b0": Array<string>
        "": Array<string>
        _: Array<string>
      }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.b !== r.b) {
          if (l.b.length !== r.b.length) return false
          for (let ix = 0, len = l.b.length; ix < len; ix++) {
            const l_b_item = l.b[ix]
            const r_b_item = r.b[ix]
            if (l_b_item !== r_b_item) return false
          }
        }
        if (l["0b"] !== r["0b"]) {
          if (l["0b"].length !== r["0b"].length) return false
          for (let ix = 0, len = l["0b"].length; ix < len; ix++) {
            const l__0b___item = l["0b"][ix]
            const r__0b___item = r["0b"][ix]
            if (l__0b___item !== r__0b___item) return false
          }
        }
        if (l["00b"] !== r["00b"]) {
          if (l["00b"].length !== r["00b"].length) return false
          for (let ix = 0, len = l["00b"].length; ix < len; ix++) {
            const l__00b___item = l["00b"][ix]
            const r__00b___item = r["00b"][ix]
            if (l__00b___item !== r__00b___item) return false
          }
        }
        if (l["-00b"] !== r["-00b"]) {
          if (l["-00b"].length !== r["-00b"].length) return false
          for (let ix = 0, len = l["-00b"].length; ix < len; ix++) {
            const l___00b___item = l["-00b"][ix]
            const r___00b___item = r["-00b"][ix]
            if (l___00b___item !== r___00b___item) return false
          }
        }
        if (l["00b0"] !== r["00b0"]) {
          if (l["00b0"].length !== r["00b0"].length) return false
          for (let ix = 0, len = l["00b0"].length; ix < len; ix++) {
            const l__00b0___item = l["00b0"][ix]
            const r__00b0___item = r["00b0"][ix]
            if (l__00b0___item !== r__00b0___item) return false
          }
        }
        if (l["--00b0"] !== r["--00b0"]) {
          if (l["--00b0"].length !== r["--00b0"].length) return false
          for (let ix = 0, len = l["--00b0"].length; ix < len; ix++) {
            const l____00b0___item = l["--00b0"][ix]
            const r____00b0___item = r["--00b0"][ix]
            if (l____00b0___item !== r____00b0___item) return false
          }
        }
        if (l["-^00b0"] !== r["-^00b0"]) {
          if (l["-^00b0"].length !== r["-^00b0"].length) return false
          for (let ix = 0, len = l["-^00b0"].length; ix < len; ix++) {
            const l____00b0___item = l["-^00b0"][ix]
            const r____00b0___item = r["-^00b0"][ix]
            if (l____00b0___item !== r____00b0___item) return false
          }
        }
        if (l[""] !== r[""]) {
          if (l[""].length !== r[""].length) return false
          for (let ix = 0, len = l[""].length; ix < len; ix++) {
            const l_____item = l[""][ix]
            const r_____item = r[""][ix]
            if (l_____item !== r_____item) return false
          }
        }
        if (l._ !== r._) {
          if (l._.length !== r._.length) return false
          for (let ix = 0, len = l._.length; ix < len; ix++) {
            const l___item = l._[ix]
            const r___item = r._[ix]
            if (l___item !== r___item) return false
          }
        }
        return true
      }
      "
    `)

    /**
     * TODO: turn on `catchall` support again
     */
    //   vi.expect.soft(format(
    // zx.equals.writeable(
    //   z.object({
    //     a: z.number(),
    //     b: z.object({
    //       d: z.optional(z.date())
    //     }).catchall(
    //       z.array(z.record(z.string(), z.array(z.boolean())))
    //     ),
    //     c: z.record(z.string(), z.boolean())
    //   }).catchall(z.boolean()),
    //   { typeName: 'Type' }
    // )
    //   )).toMatchInlineSnapshot
    // ()

    /**
     * TODO: turn on `catchall` support again
     */
    // vi.expect.soft(
    //   zx.equals.writeable(z.object({ a: z.number() }).catchall(z.boolean()), { typeName: 'Type' })
    // ).toMatchInlineSnapshot
    //   (`
    //   "type Type = { a: number } & { [x: string]: boolean }
    //   function equals(l: Type, r: Type) {
    //     if (l === r) return true;
    //     const
    //       la = l.a,
    //       ra = r.a
    //     const knownKeys_1 = { "a": true }
    //     const allKeys = new Set(Object.keys(l).concat(Object.keys(r)))
    //     if(!(Object.is(la, ra))) return false;
    //       && Array.from(allKeys).every((key) => {
    //         if (knownKeys_1[key]) return true
    //         else {
    //           const lValue = l[key]
    //           const rValue = r[key]
    //           lValue === rValue
    //         }
    //       })
    //   }"
    // `)

  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.union', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: never, r: never) {
        if (l === r) return true
        {
          let satisfied = false
          if (!satisfied) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(
        z.union([z.number(), z.array(z.string())])
      ))).toMatchInlineSnapshot
      (`
        "function equals(l: number | Array<string>, r: number | Array<string>) {
          if (Object.is(l, r)) return true
          {
            let satisfied = false
            function check_0(value) {
              return Number.isFinite(value)
            }
            if (check_0(l) && check_0(r)) {
              satisfied = true
              if (!Object.is(l, r)) return false
            }
            function check_1(value) {
              return (
                Array.isArray(value) &&
                value.every((value) => typeof value === "string")
              )
            }
            if (check_1(l) && check_1(r)) {
              satisfied = true
              if (l.length !== r.length) return false
              for (let ix = 0, len = l.length; ix < len; ix++) {
                const l_item = l[ix]
                const r_item = r[ix]
                if (l_item !== r_item) return false
              }
            }
            if (!satisfied) return false
          }
          return true
        }
        "
      `)

    vi.expect.soft(format(
      zx.equals.writeable(
        z.union([
          z.union([
            z.object({ abc: z.string() }),
            z.object({ def: z.string() })
          ]),
          z.union([
            z.object({ ghi: z.string() }),
            z.object({ jkl: z.string() })
          ])
        ]), {
        typeName: 'Type'
      }
      ))).toMatchInlineSnapshot
      (`
        "type Type =
          | ({ abc: string } | { def: string })
          | ({ ghi: string } | { jkl: string })
        function equals(l: Type, r: Type) {
          if (l === r) return true
          {
            let satisfied = false
            function check_0(value) {
              return (
                (!!value &&
                  typeof value === "object" &&
                  typeof value.abc === "string") ||
                (!!value && typeof value === "object" && typeof value.def === "string")
              )
            }
            if (check_0(l) && check_0(r)) {
              satisfied = true
              {
                let satisfied = false
                function check_0(value) {
                  return (
                    !!value &&
                    typeof value === "object" &&
                    typeof value.abc === "string"
                  )
                }
                if (check_0(l) && check_0(r)) {
                  satisfied = true
                  if (l.abc !== r.abc) return false
                }
                function check_1(value) {
                  return (
                    !!value &&
                    typeof value === "object" &&
                    typeof value.def === "string"
                  )
                }
                if (check_1(l) && check_1(r)) {
                  satisfied = true
                  if (l.def !== r.def) return false
                }
                if (!satisfied) return false
              }
            }
            function check_1(value) {
              return (
                (!!value &&
                  typeof value === "object" &&
                  typeof value.ghi === "string") ||
                (!!value && typeof value === "object" && typeof value.jkl === "string")
              )
            }
            if (check_1(l) && check_1(r)) {
              satisfied = true
              {
                let satisfied = false
                function check_0(value) {
                  return (
                    !!value &&
                    typeof value === "object" &&
                    typeof value.ghi === "string"
                  )
                }
                if (check_0(l) && check_0(r)) {
                  satisfied = true
                  if (l.ghi !== r.ghi) return false
                }
                function check_1(value) {
                  return (
                    !!value &&
                    typeof value === "object" &&
                    typeof value.jkl === "string"
                  )
                }
                if (check_1(l) && check_1(r)) {
                  satisfied = true
                  if (l.jkl !== r.jkl) return false
                }
                if (!satisfied) return false
              }
            }
            if (!satisfied) return false
          }
          return true
        }
        "
      `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.intersection', () => {
    vi.expect.soft(format(
      zx.equals.writeable(
        z.intersection(
          z.object({
            abc: z.string()
          }),
          z.object({
            def: z.string()
          })
        ), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string } & { def: string }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        {
          if (l.abc !== r.abc) return false
        }
        {
          if (l.def !== r.def) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.equals.writeable(
        z.intersection(
          z.object({
            abc: z.string(),
            def: z.object({
              ghi: z.string(),
              jkl: z.string()
            })
          }),
          z.object({
            mno: z.string(),
            pqr: z.object({
              stu: z.string(),
              vwx: z.string(),
            })
          })
        ), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string; def: { ghi: string; jkl: string } } & {
        mno: string
        pqr: { stu: string; vwx: string }
      }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        {
          if (l.abc !== r.abc) return false
          if (l.def !== r.def) {
            if (l.def.ghi !== r.def.ghi) return false
            if (l.def.jkl !== r.def.jkl) return false
          }
        }
        {
          if (l.mno !== r.mno) return false
          if (l.pqr !== r.pqr) {
            if (l.pqr.stu !== r.pqr.stu) return false
            if (l.pqr.vwx !== r.pqr.vwx) return false
          }
        }
        return true
      }
      "
    `)
  })

})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.equals.classic', () => {

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.never', () => {
    /////////////////
    const equals = zx.equals.classic(z.never())
    //    success
    vi.expect.soft(equals(undefined as never, undefined as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(undefined as never, null as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.void', () => {
    /////////////////
    const equals = zx.equals.classic(z.void())
    //    success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(void 0, null as never)).toBeFalsy()
    vi.expect.soft(equals(null as never, void 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.any', () => {
    /////////////////
    const equals = zx.equals.classic(z.any())
    //    success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    vi.expect.soft(equals(array, array)).toBeTruthy()
    vi.expect.soft(equals(object, object)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(array, [])).toBeFalsy()
    vi.expect.soft(equals([], array)).toBeFalsy()
    vi.expect.soft(equals(object, {})).toBeFalsy()
    vi.expect.soft(equals({}, object)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.unknown', () => {
    /////////////////
    const equals = zx.equals.classic(z.unknown())
    //    success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    vi.expect.soft(equals(array, array)).toBeTruthy()
    vi.expect.soft(equals(object, object)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(array, [])).toBeFalsy()
    vi.expect.soft(equals([], array)).toBeFalsy()
    vi.expect.soft(equals(object, {})).toBeFalsy()
    vi.expect.soft(equals({}, object)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.null', () => {
    /////////////////
    const equals = zx.equals.classic(z.null())
    //    success
    vi.expect.soft(equals(null, null)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(null, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, null)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.nan', () => {
    /////////////////
    const equals = zx.equals.classic(z.nan())
    //    success
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.symbol', () => {
    /////////////////
    const equals = zx.equals.classic(z.symbol())
    //    success
    vi.expect.soft(equals(symbol, symbol)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(symbol, Symbol())).toBeFalsy()
    vi.expect.soft(equals(Symbol(), symbol)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.boolean', () => {
    /////////////////
    const equals = zx.equals.classic(z.boolean())
    //    success
    vi.expect.soft(equals(false, false)).toBeTruthy()
    vi.expect.soft(equals(true, true)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.int', () => {
    /////////////////
    const equals = zx.equals.classic(z.int())
    //    success
    vi.expect.soft(equals(-0, -0)).toBeTruthy()
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, -0)).toBeFalsy()
    vi.expect.soft(equals(-0, 0)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.bigint', () => {
    /////////////////
    const equals = zx.equals.classic(z.bigint())
    //    success
    vi.expect.soft(equals(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals(1n, 1n)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals(0n, 1n)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.number', () => {
    /////////////////
    const equals = zx.equals.classic(z.number())
    //    success
    vi.expect.soft(equals(-0, -0)).toBeTruthy()
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    vi.expect.soft(equals(-0.1, -0.1)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, -0)).toBeFalsy()
    vi.expect.soft(equals(-0, 0)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
    vi.expect.soft(equals(0.1, -0.1)).toBeFalsy()
    vi.expect.soft(equals(-0.1, 0.1)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, NaN)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.string', () => {
    /////////////////
    const equals = zx.equals.classic(z.string())
    //    success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.literal', () => {
    /////////////////
    const equals = zx.equals.classic(z.literal(1))
    //    success
    vi.expect.soft(equals(1, 1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1, 2 as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.enum', () => {
    /////////////////
    const equals = zx.equals.classic(z.enum(['1', '2']))
    //    success
    vi.expect.soft(equals('1', '1')).toBeTruthy()
    vi.expect.soft(equals('2', '2')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('1', '2')).toBeFalsy()
    vi.expect.soft(equals('2', '1')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.templateLiteral', () => {
    /////////////////
    const equals = zx.equals.classic(z.templateLiteral(['1', '2']))
    //    success
    vi.expect.soft(equals('12', '12')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('1' as never, '12')).toBeFalsy()
    vi.expect.soft(equals('12', '1' as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.date', () => {
    /////////////////
    const equals = zx.equals.classic(z.date())
    //    success
    vi.expect.soft(equals(date, date)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(date, new Date())).toBeFalsy()
    vi.expect.soft(equals(new Date(), date)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.optional', () => {
    /////////////////
    const equals = zx.equals.classic(z.optional(z.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(undefined, undefined)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, undefined)).toBeFalsy()
    vi.expect.soft(equals(undefined, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.nonoptional', () => {
    /////////////////
    const equals = zx.equals.classic(z.nonoptional(z.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.nullable', () => {
    /////////////////
    const equals = zx.equals.classic(z.nullable(z.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, null)).toBeFalsy()
    vi.expect.soft(equals(null, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.array', () => {
    /////////////////
    const equals_01 = zx.equals.classic(z.array(z.int()))
    //    success
    vi.expect.soft(equals_01([], [])).toBeTruthy()
    vi.expect.soft(equals_01([], array as [])).toBeTruthy()
    vi.expect.soft(equals_01(array as [], [])).toBeTruthy()
    vi.expect.soft(equals_01([1], [1])).toBeTruthy()
    vi.expect.soft(equals_01([1, 2], [1, 2])).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01([], [1])).toBeFalsy()
    vi.expect.soft(equals_01([1], [])).toBeFalsy()
    vi.expect.soft(equals_01([1], [1, 2])).toBeFalsy()
    vi.expect.soft(equals_01([1, 2], [1])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.set', () => {
    /////////////////
    const equals_01 = zx.equals.classic(z.set(z.int()))
    //    success
    vi.expect.soft(equals_01(new Set([]), new Set([]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1]), new Set([1]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1, 2]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([2, 1]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1, 2, 1, 2]))).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01(new Set([]), new Set([1]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1]), new Set([]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1]), new Set([1, 2]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1, 2, 3]), new Set([1, 2, 1, 2]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1, 2, 1, 2, 3]))).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.map', () => {
    /////////////////
    const equals_01 = zx.equals.classic(z.map(z.array(z.int()), z.int()))
    //    success
    vi.expect.soft(equals_01(new Map([]), new Map([]))).toBeTruthy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[1], 1]]))).toBeTruthy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 2]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01(new Map([]), new Map([[[], 0]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0]]), new Map([]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0]]), new Map([[[], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 1]]), new Map([[[], 0]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[2], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[2], 1]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[1], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 2]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[2], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[2], 1]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 2]]), new Map([[[], 0], [[1], 1]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 2]]), new Map([[[], 0], [[1], 1], [[2, 2], 3]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 3]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 2]]), new Map([[[], 0], [[1], 1], [[2, 3], 2]]))).toBeFalsy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 3], 2]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.record', () => {
    /////////////////
    const equals_01 = zx.equals.classic(z.record(z.string(), z.int()))
    //    success
    vi.expect.soft(equals_01({}, {})).toBeTruthy()
    vi.expect.soft(equals_01(object as {}, {})).toBeTruthy()
    vi.expect.soft(equals_01({}, object as {})).toBeTruthy()
    vi.expect.soft(equals_01({ a: 1 }, { a: 1 })).toBeTruthy()
    vi.expect.soft(equals_01({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01({}, { a: 1 })).toBeFalsy()
    vi.expect.soft(equals_01({}, { a: 1 })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1 }, { a: 1, b: 2 })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: 2 }, { a: 1 })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.lazy', () => {
    /////////////////
    const equals = zx.equals.classic(z.lazy(() => z.string()))
    //    success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.union', () => {
    /////////////////
    const equals_01 = zx.equals.classic(z.union([]))
    //    success
    vi.expect.soft(equals_01('' as never, '' as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01('' as never, 'hey' as never)).toBeFalsy()

    /////////////////
    const equals_02 = zx.equals.classic(z.union([z.int()]))
    //    success
    vi.expect.soft(equals_02(0, 0)).toBeTruthy()
    vi.expect.soft(equals_02(-0, -0)).toBeTruthy()
    //    failure
    vi.expect.soft(equals_02(0, -0)).toBeFalsy()
    vi.expect.soft(equals_02(-0, 0)).toBeFalsy()

    /////////////////
    const equals_03 = zx.equals.classic(z.union([z.int(), z.bigint()]))
    //    success
    vi.expect.soft(equals_03(0, 0)).toBeTruthy()
    vi.expect.soft(equals_03(-0, -0)).toBeTruthy()
    vi.expect.soft(equals_03(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals_03(1n, 1n)).toBeTruthy()
    //    failure
    vi.expect.soft(equals_03(0, 1)).toBeFalsy()
    vi.expect.soft(equals_03(1, 0)).toBeFalsy()
    vi.expect.soft(equals_03(0n, 1n)).toBeFalsy()
    vi.expect.soft(equals_03(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals_03(0, 0n)).toBeFalsy()
    vi.expect.soft(equals_03(0n, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.intersection', () => {
    /////////////////
    const equals_01 = zx.equals.classic(z.intersection(z.object({ a: z.number() }), z.object({ b: z.string() })))
    //    success
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1, b: '' })).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01({ a: 1 } as never, { a: 1, b: '' })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1 } as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.tuple', () => {
    /////////////////
    const equals = zx.equals.classic(z.tuple([z.string(), z.int()]))
    //    success
    vi.expect.soft(equals(['', 0], ['', 0])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1], ['hey', 1])).toBeTruthy()
    //    failure
    vi.expect.soft(equals(['', 0], ['', 1])).toBeFalsy()
    vi.expect.soft(equals(['', 1], ['', 0])).toBeFalsy()
    vi.expect.soft(equals(['', 0], ['hey', 0])).toBeFalsy()
    vi.expect.soft(equals(['hey', 0], ['', 0])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.tuple w/ rest', () => {
    /////////////////
    const equals = zx.equals.classic(z.tuple([z.string(), z.int()], z.boolean()))
    //    success
    vi.expect.soft(equals(['', 0], ['', 0])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1], ['hey', 1])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, true], ['hey', 1, true])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, false], ['hey', 1, false])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, true, true], ['hey', 1, true, true])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, true, false], ['hey', 1, true, false])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, false, false], ['hey', 1, false, false])).toBeTruthy()

    //    failure
    vi.expect.soft(equals(['', 0], ['', 1])).toBeFalsy()
    vi.expect.soft(equals(['', 1], ['', 0])).toBeFalsy()
    vi.expect.soft(equals(['', 0], ['hey', 0])).toBeFalsy()
    vi.expect.soft(equals(['hey', 0], ['', 0])).toBeFalsy()
    vi.expect.soft(equals(['', 0], ['', 0, false])).toBeFalsy()
    vi.expect.soft(equals(['', 0], ['', 0, true])).toBeFalsy()
    vi.expect.soft(equals(['', 0, true], ['', 0])).toBeFalsy()
    vi.expect.soft(equals(['', 0, false], ['', 0])).toBeFalsy()
    vi.expect.soft(equals(['', 0, true], ['', 0, false])).toBeFalsy()
    vi.expect.soft(equals(['', 0, false], ['', 0, true])).toBeFalsy()
    vi.expect.soft(equals(['', 0, false], ['', 0, false, false])).toBeFalsy()
    vi.expect.soft(equals(['', 0, false, false], ['', 0, false])).toBeFalsy()
    vi.expect.soft(equals(['', 0, false, true], ['', 0, false, false])).toBeFalsy()
    vi.expect.soft(equals(['', 0, false, false], ['', 0, false, true])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.object', () => {
    /////////////////
    const equals = zx.equals.classic(z.object({ a: z.number(), b: z.string(), c: z.boolean() }))
    //    success
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 0, b: '', c: false })).toBeTruthy()
    vi.expect.soft(equals({ a: 9000, b: '', c: false }, { a: 9000, b: '', c: false })).toBeTruthy()
    vi.expect.soft(equals({ a: 0, b: 'hey', c: false }, { a: 0, b: 'hey', c: false })).toBeTruthy()
    vi.expect.soft(equals({ a: 0, b: '', c: true }, { a: 0, b: '', c: true })).toBeTruthy()
    //    failure
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 0, b: '', c: true })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 0, b: 'hey', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 1, b: '', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: '', c: true }, { a: 0, b: '', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: 'hey', c: false }, { a: 0, b: '', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 1, b: '', c: false }, { a: 0, b: '', c: false })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.object w/ optional props', () => {
    /////////////////
    const equals = zx.equals.classic(z.object({ a: z.optional(z.boolean()), b: z.optional(z.symbol()) }))
    //    success
    vi.expect.soft(equals({}, {})).toBeTruthy()
    vi.expect.soft(equals({ a: false }, { a: false })).toBeTruthy()
    vi.expect.soft(equals({ b: symbol }, { b: symbol })).toBeTruthy()
    vi.expect.soft(equals({ a: false, b: symbol }, { a: false, b: symbol })).toBeTruthy()
    //    failure
    vi.expect.soft(equals({}, { a: false })).toBeFalsy()
    vi.expect.soft(equals({ a: false }, {})).toBeFalsy()
    vi.expect.soft(equals({ a: false }, { a: true })).toBeFalsy()
    vi.expect.soft(equals({}, { b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ b: symbol }, {})).toBeFalsy()
    vi.expect.soft(equals({ b: symbol }, { b: Symbol() })).toBeFalsy()
    vi.expect.soft(equals({ b: Symbol() }, { b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ a: false, b: symbol }, { a: true, b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ a: true, b: symbol }, { a: false, b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ a: false, b: symbol }, { a: false, b: Symbol() })).toBeFalsy()
    vi.expect.soft(equals({ a: false, b: Symbol() }, { a: false, b: symbol })).toBeFalsy()
    vi.expect.soft(equals({ a: false, b: symbol }, { a: true, b: Symbol() })).toBeFalsy()
    vi.expect.soft(equals({ a: true, b: Symbol() }, { a: false, b: symbol })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.object w/ catchall', () => {
    const stringIndex = { [String()]: '' }
    const aFalse1: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex } as never
    const aFalse2: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex, b: 'hey' } as never
    const aFalse3: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex, b: 'ho' } as never
    const aTrue1: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex } as never
    const aTrue2: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex, b: 'hey' } as never
    const aTrue3: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex, b: 'ho' } as never

    /////////////////
    const equals = zx.equals.classic(z.object({ a: z.boolean() }).catchall(z.string()))
    //    success
    vi.expect.soft(equals({ a: false } as never, { a: false } as never)).toBeTruthy()
    vi.expect.soft(equals({ a: true } as never, { a: true } as never)).toBeTruthy()
    vi.expect.soft(equals(aFalse1, aFalse1)).toBeTruthy()
    vi.expect.soft(equals(aFalse2, aFalse2)).toBeTruthy()
    vi.expect.soft(equals(aFalse3, aFalse3)).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse1 }, { ...aFalse1 })).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse2 }, { ...aFalse2 })).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse3 }, { ...aFalse3 })).toBeTruthy()
    vi.expect.soft(equals(aFalse1, { ...aFalse1 })).toBeTruthy()
    vi.expect.soft(equals(aFalse2, { ...aFalse2 })).toBeTruthy()
    vi.expect.soft(equals(aFalse3, { ...aFalse3 })).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse1 }, aFalse1)).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse2 }, aFalse2)).toBeTruthy()
    vi.expect.soft(equals({ ...aFalse3 }, aFalse3)).toBeTruthy()
    vi.expect.soft(equals(aTrue1, aTrue1)).toBeTruthy()
    vi.expect.soft(equals(aTrue2, aTrue2)).toBeTruthy()
    vi.expect.soft(equals(aTrue3, aTrue3)).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue1 }, { ...aTrue1 })).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue2 }, { ...aTrue2 })).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue3 }, { ...aTrue3 })).toBeTruthy()
    vi.expect.soft(equals(aTrue1, { ...aTrue1 })).toBeTruthy()
    vi.expect.soft(equals(aTrue2, { ...aTrue2 })).toBeTruthy()
    vi.expect.soft(equals(aTrue3, { ...aTrue3 })).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue1 }, aTrue1)).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue2 }, aTrue2)).toBeTruthy()
    vi.expect.soft(equals({ ...aTrue3 }, aTrue3)).toBeTruthy()
    //    failure
    vi.expect.soft(equals({ a: false } as never, { a: true } as never)).toBeFalsy()
    vi.expect.soft(equals({ a: true } as never, { a: false } as never)).toBeFalsy()
    vi.expect.soft(equals(aFalse1, aFalse2)).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse1 }, { ...aFalse2 })).toBeFalsy()
    vi.expect.soft(equals(aFalse2, aFalse1)).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse2 }, { ...aFalse1 })).toBeFalsy()
    vi.expect.soft(equals(aFalse2, aFalse3)).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse2 }, { ...aFalse3 })).toBeFalsy()
    vi.expect.soft(equals(aFalse3, aFalse2)).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse3 }, { ...aFalse2 })).toBeFalsy()
    vi.expect.soft(equals(aFalse3, aFalse1)).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse3 }, { ...aFalse1 })).toBeFalsy()
    vi.expect.soft(equals(aFalse1, aFalse3)).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse1 }, { ...aFalse3 })).toBeFalsy()
    vi.expect.soft(equals(aTrue1, aTrue2)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue1 }, { ...aTrue2 })).toBeFalsy()
    vi.expect.soft(equals(aTrue2, aTrue1)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue2 }, { ...aTrue1 })).toBeFalsy()
    vi.expect.soft(equals(aTrue2, aTrue3)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue2 }, { ...aTrue3 })).toBeFalsy()
    vi.expect.soft(equals(aTrue3, aTrue2)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue3 }, { ...aTrue2 })).toBeFalsy()
    vi.expect.soft(equals(aTrue3, aTrue1)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue3 }, { ...aTrue1 })).toBeFalsy()
    vi.expect.soft(equals(aTrue1, aTrue3)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue1 }, { ...aTrue3 })).toBeFalsy()
    vi.expect.soft(equals(aTrue1, aFalse1)).toBeFalsy()
    vi.expect.soft(equals(aFalse1, aTrue1)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue1 }, { ...aFalse1 })).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse1 }, { ...aTrue1 })).toBeFalsy()
    vi.expect.soft(equals(aTrue2, aFalse2)).toBeFalsy()
    vi.expect.soft(equals(aFalse2, aTrue2)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue2 }, { ...aFalse2 })).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse2 }, { ...aTrue2 })).toBeFalsy()
    vi.expect.soft(equals(aTrue3, aFalse3)).toBeFalsy()
    vi.expect.soft(equals(aFalse3, aTrue3)).toBeFalsy()
    vi.expect.soft(equals({ ...aTrue3 }, { ...aFalse3 })).toBeFalsy()
    vi.expect.soft(equals({ ...aFalse3 }, { ...aTrue3 })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.pipe', () => {
    /////////////////
    const equals = zx.equals.classic(z.pipe(z.number(), z.int()))
    //    success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  // vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.default', () => {
  //   /////////////////
  //   const equals = zx.equals.classic(z.number().default(1))
  //   //    success
  //   vi.expect.soft(equals(0, 0)).toBeTruthy()
  //   vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
  //   //    failure
  //   vi.expect.soft(equals(0, 0.1)).toBeFalsy()
  //   vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  // })

  // vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.prefault', () => {
  //   /////////////////
  //   const equals = zx.equals.classic(z.number().prefault(1))
  //   //    success
  //   vi.expect.soft(equals(0, 0)).toBeTruthy()
  //   vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
  //   //    failure
  //   vi.expect.soft(equals(0, 0.1)).toBeFalsy()
  //   vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  // })

  vi.test('〖⛳️〗› ❲zx.equals.classic❳: z.catch', () => {
    /////////////////
    const equals = zx.equals.classic(z.number().catch(1))
    //    success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

})
