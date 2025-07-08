import * as vi from 'vitest'
import { z } from 'zod/v4'

import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.equals.compile', () => {
  vi.test('〖⛳️〗› ❲zx.equals.compile❳: z.tuple', () => {
    const equals_01 = zx.equals.compile(z.tuple([]))
    vi.expect(equals_01([], [])).toEqual(true)
    vi.expect(equals_01([], [null] as never)).toEqual(false)
    vi.expect(equals_01([null] as never, [])).toEqual(false)
  })

  vi.test('〖⛳️〗› ❲zx.equals.compile❳: z.object', () => {
    const equals_01 = zx.equals.compile(z.object({}))
    vi.expect(equals_01({}, {})).toEqual(true)
    vi.expect(equals_01({}, { a: 1 } as never)).toEqual(false)
    vi.expect(equals_01({ a: 1 } as never, {})).toEqual(false)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.equals', () => {
  const array: unknown[] = []
  const object: object = {}
  const symbol = Symbol()
  const date = new Date()

  vi.test('〖⛳️〗› ❲zx.equals❳: z.never', () => {
    const equals = zx.equals(z.never())
    // failure
    vi.expect.soft(equals(void 0 as never, void 0 as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.void', () => {
    const equals = zx.equals(z.void())
    // success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    // failure
    vi.expect.soft(equals(void 0, null as never)).toBeFalsy()
    vi.expect.soft(equals(null as never, void 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.any', () => {
    const equals = zx.equals(z.any())
    // success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    vi.expect.soft(equals(array, array)).toBeTruthy()
    vi.expect.soft(equals(object, object)).toBeTruthy()
    // failure
    vi.expect.soft(equals(array, [])).toBeFalsy()
    vi.expect.soft(equals([], array)).toBeFalsy()
    vi.expect.soft(equals(object, {})).toBeFalsy()
    vi.expect.soft(equals({}, object)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.unknown', () => {
    const equals = zx.equals(z.unknown())
    // success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    vi.expect.soft(equals(array, array)).toBeTruthy()
    vi.expect.soft(equals(object, object)).toBeTruthy()
    // failure
    vi.expect.soft(equals(array, [])).toBeFalsy()
    vi.expect.soft(equals([], array)).toBeFalsy()
    vi.expect.soft(equals(object, {})).toBeFalsy()
    vi.expect.soft(equals({}, object)).toBeFalsy()
  })


  vi.test('〖⛳️〗› ❲zx.equals❳: z.null', () => {
    const equals = zx.equals(z.null())
    // success
    vi.expect.soft(equals(null, null)).toBeTruthy()
    // failure
    vi.expect.soft(equals(null, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, null)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.nan', () => {
    const equals = zx.equals(z.nan())
    // success
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.symbol', () => {
    const equals = zx.equals(z.symbol())
    // success
    vi.expect.soft(equals(symbol, symbol)).toBeTruthy()
    // failure
    vi.expect.soft(equals(symbol, Symbol())).toBeFalsy()
    vi.expect.soft(equals(Symbol(), symbol)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.boolean', () => {
    const equals = zx.equals(z.boolean())
    // success
    vi.expect.soft(equals(false, false)).toBeTruthy()
    vi.expect.soft(equals(true, true)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.int', () => {
    const equals = zx.equals(z.int())
    // success
    vi.expect.soft(equals(-0, -0)).toBeTruthy()
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, -0)).toBeFalsy()
    vi.expect.soft(equals(-0, 0)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.bigint', () => {
    const equals = zx.equals(z.bigint())
    // success
    vi.expect.soft(equals(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals(1n, 1n)).toBeTruthy()
    // failure
    vi.expect.soft(equals(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals(0n, 1n)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.number', () => {
    const equals = zx.equals(z.number())
    // success
    vi.expect.soft(equals(-0, -0)).toBeTruthy()
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    vi.expect.soft(equals(-0.1, -0.1)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    // failure
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
    const equals = zx.equals(z.string())
    // success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    // failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.literal', () => {
    const equals = zx.equals(z.literal(1))
    // success
    vi.expect.soft(equals(1, 1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(1, 2 as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.enum', () => {
    const equals = zx.equals(z.enum(['1', '2']))
    // success
    vi.expect.soft(equals('1', '1')).toBeTruthy()
    vi.expect.soft(equals('2', '2')).toBeTruthy()
    // failure
    vi.expect.soft(equals('1', '2')).toBeFalsy()
    vi.expect.soft(equals('2', '1')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.templateLiteral', () => {
    const equals = zx.equals(z.templateLiteral(['1', '2']))
    // success
    vi.expect.soft(equals('12', '12')).toBeTruthy()
    // failure
    vi.expect.soft(equals('1' as never, '12')).toBeFalsy()
    vi.expect.soft(equals('12', '1' as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.date', () => {
    const equals = zx.equals(z.date())
    // success
    vi.expect.soft(equals(date, date)).toBeTruthy()
    // failure
    vi.expect.soft(equals(date, new Date())).toBeFalsy()
    vi.expect.soft(equals(new Date(), date)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.optional', () => {
    const equals = zx.equals(z.optional(z.boolean()))
    // success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(undefined, undefined)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, undefined)).toBeFalsy()
    vi.expect.soft(equals(undefined, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.nonoptional', () => {
    const equals = zx.equals(z.nonoptional(z.boolean()))
    // success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.nullable', () => {
    const equals = zx.equals(z.nullable(z.boolean()))
    // success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, null)).toBeFalsy()
    vi.expect.soft(equals(null, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.array', () => {
    const equals_01 = zx.equals(z.array(z.int()))
    // success
    vi.expect.soft(equals_01([], [])).toBeTruthy()
    vi.expect.soft(equals_01([], array as [])).toBeTruthy()
    vi.expect.soft(equals_01(array as [], [])).toBeTruthy()
    vi.expect.soft(equals_01([1], [1])).toBeTruthy()
    vi.expect.soft(equals_01([1, 2], [1, 2])).toBeTruthy()
    // failure
    vi.expect.soft(equals_01([], [1])).toBeFalsy()
    vi.expect.soft(equals_01([1], [])).toBeFalsy()
    vi.expect.soft(equals_01([1], [1, 2])).toBeFalsy()
    vi.expect.soft(equals_01([1, 2], [1])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.set', () => {
    const equals_01 = zx.equals(z.set(z.int()))
    // success
    vi.expect.soft(equals_01(new Set([]), new Set([]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1]), new Set([1]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1, 2]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([2, 1]))).toBeTruthy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1, 2, 1, 2]))).toBeTruthy()
    // failure
    vi.expect.soft(equals_01(new Set([]), new Set([1]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1]), new Set([]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1]), new Set([1, 2]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1, 2, 3]), new Set([1, 2, 1, 2]))).toBeFalsy()
    vi.expect.soft(equals_01(new Set([1, 2]), new Set([1, 2, 1, 2, 3]))).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.map', () => {
    const equals_01 = zx.equals(z.map(z.array(z.int()), z.int()))
    // success
    vi.expect.soft(equals_01(new Map([]), new Map([]))).toBeTruthy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1]]), new Map([[[], 0], [[1], 1]]))).toBeTruthy()
    vi.expect.soft(equals_01(new Map([[[], 0], [[1], 1], [[2, 2], 2]]), new Map([[[], 0], [[1], 1], [[2, 2], 2]]))).toBeTruthy()
    // failure
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
    const equals_01 = zx.equals(z.record(z.string(), z.int()))
    // success
    vi.expect.soft(equals_01({}, {})).toBeTruthy()
    vi.expect.soft(equals_01(object as {}, {})).toBeTruthy()
    vi.expect.soft(equals_01({}, object as {})).toBeTruthy()
    vi.expect.soft(equals_01({ a: 1 }, { a: 1 })).toBeTruthy()
    vi.expect.soft(equals_01({ a: 1, b: 2 }, { a: 1, b: 2 })).toBeTruthy()
    // failure
    vi.expect.soft(equals_01({}, { a: 1 })).toBeFalsy()
    vi.expect.soft(equals_01({}, { a: 1 })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1 }, { a: 1, b: 2 })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: 2 }, { a: 1 })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.lazy', () => {
    const equals = zx.equals(z.lazy(() => z.string()))
    // success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    // failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.union', () => {
    const equals_01 = zx.equals(z.union([]))
    // success
    vi.expect.soft(equals_01('' as never, '' as never)).toBeTruthy()
    // failure
    vi.expect.soft(equals_01('' as never, 'hey' as never)).toBeFalsy()

    const equals_02 = zx.equals(z.union([z.int()]))
    // success
    vi.expect.soft(equals_02(0, 0)).toBeTruthy()
    vi.expect.soft(equals_02(-0, -0)).toBeTruthy()
    // failure
    vi.expect.soft(equals_02(0, -0)).toBeFalsy()
    vi.expect.soft(equals_02(-0, 0)).toBeFalsy()

    const equals_03 = zx.equals(z.union([z.int(), z.bigint()]))
    // success
    vi.expect.soft(equals_03(0, 0)).toBeTruthy()
    vi.expect.soft(equals_03(-0, -0)).toBeTruthy()
    vi.expect.soft(equals_03(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals_03(1n, 1n)).toBeTruthy()
    // failure
    vi.expect.soft(equals_03(0, 1)).toBeFalsy()
    vi.expect.soft(equals_03(1, 0)).toBeFalsy()
    vi.expect.soft(equals_03(0n, 1n)).toBeFalsy()
    vi.expect.soft(equals_03(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals_03(0, 0n)).toBeFalsy()
    vi.expect.soft(equals_03(0n, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.intersection', () => {
    const equals_01 = zx.equals(z.intersection(z.object({ a: z.number() }), z.object({ b: z.string() })))
    // success
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1, b: '' })).toBeTruthy()
    // failure
    vi.expect.soft(equals_01({ a: 1 } as never, { a: 1, b: '' })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1 } as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.tuple', () => {
    const equals = zx.equals(z.tuple([z.string(), z.int()]))
    // success
    vi.expect.soft(equals(['', 0], ['', 0])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1], ['hey', 1])).toBeTruthy()
    // failure
    vi.expect.soft(equals(['', 0], ['', 1])).toBeFalsy()
    vi.expect.soft(equals(['', 1], ['', 0])).toBeFalsy()
    vi.expect.soft(equals(['', 0], ['hey', 0])).toBeFalsy()
    vi.expect.soft(equals(['hey', 0], ['', 0])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.tuple w/ rest', () => {
    const equals = zx.equals(z.tuple([z.string(), z.int()], z.boolean()))
    // success
    vi.expect.soft(equals(['', 0], ['', 0])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1], ['hey', 1])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, true], ['hey', 1, true])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, false], ['hey', 1, false])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, true, true], ['hey', 1, true, true])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, true, false], ['hey', 1, true, false])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1, false, false], ['hey', 1, false, false])).toBeTruthy()

    // failure
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

  vi.test('〖⛳️〗› ❲zx.equals❳: z.object', () => {
    const equals = zx.equals(z.object({ a: z.number(), b: z.string(), c: z.boolean() }))
    // success
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 0, b: '', c: false })).toBeTruthy()
    vi.expect.soft(equals({ a: 9000, b: '', c: false }, { a: 9000, b: '', c: false })).toBeTruthy()
    vi.expect.soft(equals({ a: 0, b: 'hey', c: false }, { a: 0, b: 'hey', c: false })).toBeTruthy()
    vi.expect.soft(equals({ a: 0, b: '', c: true }, { a: 0, b: '', c: true })).toBeTruthy()
    // failure
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 0, b: '', c: true })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 0, b: 'hey', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: '', c: false }, { a: 1, b: '', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: '', c: true }, { a: 0, b: '', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 0, b: 'hey', c: false }, { a: 0, b: '', c: false })).toBeFalsy()
    vi.expect.soft(equals({ a: 1, b: '', c: false }, { a: 0, b: '', c: false })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.object w/ optional props', () => {
    const equals = zx.equals(z.object({ a: z.optional(z.boolean()), b: z.optional(z.symbol()) }))
    // success
    vi.expect.soft(equals({}, {})).toBeTruthy()
    vi.expect.soft(equals({ a: false }, { a: false })).toBeTruthy()
    vi.expect.soft(equals({ b: symbol }, { b: symbol })).toBeTruthy()
    vi.expect.soft(equals({ a: false, b: symbol }, { a: false, b: symbol })).toBeTruthy()
    // failure
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

    const equals = zx.equals(z.object({ a: z.boolean() }).catchall(z.string()))
    // success
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
    // failure
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

  vi.test('〖⛳️〗› ❲zx.equals❳: z.pipe', () => {
    const equals = zx.equals(z.pipe(z.number(), z.int()))
    // success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.default', () => {
    const equals = zx.equals(z.number().default(1))
    // success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.prefault', () => {
    const equals = zx.equals(z.number().prefault(1))
    // success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.catch', () => {
    const equals = zx.equals(z.number().catch(1))
    // success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.equals❳: z.success', () => {
    const equals = zx.equals(z.success(z.number()))
    // success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.equals.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.never', () => {
    vi.expect.soft(zx.equals.writeable(
      z.never()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: never, r: never) {
        return false
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.any', () => {
    vi.expect.soft(zx.equals.writeable(
      z.any()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: any, r: any) {
        return true
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.unknown', () => {
    vi.expect.soft(zx.equals.writeable(
      z.unknown()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: unknown, r: unknown) {
        return true
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.void', () => {
    vi.expect.soft(zx.equals.writeable(
      z.void()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: void, r: void) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.undefined', () => {
    vi.expect.soft(zx.equals.writeable(
      z.undefined()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: undefined, r: undefined) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.null', () => {
    vi.expect.soft(zx.equals.writeable(
      z.null()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: null, r: null) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.boolean', () => {
    vi.expect.soft(zx.equals.writeable(
      z.boolean()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: boolean, r: boolean) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.symbol', () => {
    vi.expect.soft(zx.equals.writeable(
      z.symbol()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: symbol, r: symbol) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.nan', () => {
    vi.expect.soft(zx.equals.writeable(
      z.int()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.int', () => {
    vi.expect.soft(zx.equals.writeable(
      z.int()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.bigint', () => {
    vi.expect.soft(zx.equals.writeable(
      z.bigint()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: bigint, r: bigint) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.number', () => {
    vi.expect.soft(zx.equals.writeable(
      z.number()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.string', () => {
    vi.expect.soft(zx.equals.writeable(
      z.string()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: string, r: string) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.enum', () => {
    vi.expect.soft(zx.equals.writeable(
      z.enum([])
    )).toMatchInlineSnapshot
      (`
      "function equals(l: never, r: never) {
        return Object.is(l, r)
      }"
    `)
    vi.expect.soft(zx.equals.writeable(
      z.enum(['a'])
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a", r: "a") {
        return Object.is(l, r)
      }"
    `)
    vi.expect.soft(zx.equals.writeable(
      z.enum(['a', 'b'])
    )).toMatchInlineSnapshot
      (`
      "function equals(l: ("a" | "b"), r: ("a" | "b")) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.literal', () => {
    vi.expect.soft(zx.equals.writeable(
      z.literal([])
    )).toMatchInlineSnapshot
      (`
      "function equals(l: , r: ) {
        return Object.is(l, r)
      }"
    `)
    vi.expect.soft(zx.equals.writeable(
      z.literal('a')
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a", r: "a") {
        return Object.is(l, r)
      }"
    `)
    vi.expect.soft(zx.equals.writeable(
      z.literal(['a', 'b'])
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a" | "b", r: "a" | "b") {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.literal', () => {
    vi.expect.soft(zx.equals.writeable(
      z.templateLiteral([])
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "", r: "") {
        return Object.is(l, r)
      }"
    `)
    vi.expect.soft(zx.equals.writeable(
      z.templateLiteral(['a'])
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a", r: "a") {
        return Object.is(l, r)
      }"
    `)
    vi.expect.soft(zx.equals.writeable(
      z.templateLiteral(['a', 'b'])
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "ab", r: "ab") {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.file', () => {
    vi.expect.soft(zx.equals.writeable(
      z.file()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: File, r: File) {
        return false
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.date', () => {
    vi.expect.soft(zx.equals.writeable(
      z.date()
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Date, r: Date) {
        return l?.getTime() === r?.getTime()
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.success', () => {
    vi.expect.soft(zx.equals.writeable(
      z.success(z.number())
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.lazy', () => {
    vi.expect.soft(zx.equals.writeable(
      z.lazy(() => z.number())
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        return Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.optional', () => {
    vi.expect.soft(zx.equals.writeable(
      z.optional(z.number())
    )).toMatchInlineSnapshot
      (`
      "function equals(l: undefined | number, r: undefined | number) {
        return Object.is(l, r) || Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.nullable', () => {
    vi.expect.soft(zx.equals.writeable(
      z.nullable(z.number())
    )).toMatchInlineSnapshot
      (`
      "function equals(l: null | number, r: null | number) {
        return Object.is(l, r) || Object.is(l, r)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.set', () => {
    vi.expect.soft(
      zx.equals.writeable(
        z.set(z.number()),
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: Set<number>, r: Set<number>) {
        return Object.is(l, r) || (l.size === r.size && (() => {
          const lValues = Array.from(l).sort()
          const rValues = Array.from(r).sort()
          for (let ix = 0, len = lValues.length; ix < len; ix++) {
            const lValue = lValues[ix]
            const rValue = rValues[ix]
            if (!Object.is(lValue, rValue)) return false
          }
          return true
        })())
      }"
    `)
  })


  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.map', () => {
    vi.expect.soft(
      zx.equals.writeable(
        z.map(z.number(), z.unknown()),
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: Map<number, unknown>, r: Map<number, unknown>) {
        return Object.is(l, r) || (l.size === r.size && (() => {
          const lEntries = Array.from(l).sort()
          const rEntries = Array.from(r).sort()
          for (let ix = 0, len = lEntries.length; ix < len; ix++) {
            const [lKey, lValue] = lEntries[ix]
            const [rKey, rValue] = rEntries[ix]
            if (!Object.is(lKey, rKey)) return false
            if (!true) return false
          }
          return true
        })())
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.union', () => {
    vi.expect.soft(
      zx.equals.writeable(
        z.union([])
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: never, r: never) {
        return Object.is(l, r)
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(
        z.union([z.number(), z.string()])
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: (number | string), r: (number | string)) {
        return Object.is(l, r) || ((Object.is(l, r)) || (Object.is(l, r)))
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(
        z.union([z.array(z.number()), z.record(z.string(), z.boolean())])
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: (Array<number> | Record<string, boolean>), r: (Array<number> | Record<string, boolean>)) {
        return Object.is(l, r) || ((Array.isArray(l) && Array.isArray(r) && l.length === r.length && l.every(
        (l1, i) => {
          const r1 = r[i];
          return Object.is(l1, r1)
        })) || (!!l && typeof l === 'object' && !Array.isArray(l) && !!r && typeof r === 'object' && !Array.isArray(r) && Object.is(l, r) || (() => {
        const lKeys = Object.keys(l)
        const rKeys = Object.keys(r)
        return lKeys.length === rKeys.length && 
        (lKeys.every((k1) => {
          const l1 = l[k1]
          if (!Object.hasOwn(r, k1)) return false
          else {
            const r1 = r[k1]
            return Object.is(l1, r1)
          }
        }))
      })()))
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.array', () => {
    vi.expect.soft(
      zx.equals.writeable(
        z.array(z.number()),
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: Array<number>, r: Array<number>) {
        return l.length === r.length && l.every(
        (l1, i) => {
          const r1 = r[i];
          return Object.is(l1, r1)
        })
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.record', () => {
    vi.expect.soft(
      zx.equals.writeable(
        z.record(z.string(), z.number()),
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: Record<string, number>, r: Record<string, number>) {
        return Object.is(l, r) || (() => {
        const lKeys = Object.keys(l)
        const rKeys = Object.keys(r)
        return lKeys.length === rKeys.length && 
        (lKeys.every((k1) => {
          const l1 = l[k1]
          if (!Object.hasOwn(r, k1)) return false
          else {
            const r1 = r[k1]
            return Object.is(l1, r1)
          }
        }))
      })()
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.tuple', () => {
    vi.expect.soft(
      zx.equals.writeable(
        z.tuple([]),
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: [], r: []) {
        return Object.is(l, r) || l.length === 0 && r.length === 0
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(
        z.tuple([z.number()]),
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: [number], r: [number]) {
        return Object.is(l, r) || (l.length === r.length && (() => {
        const
          l0 = l[0],
          r0 = r[0]
        return (Object.is(l0, r0))
      })())
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(
        z.tuple([z.number(), z.tuple([z.string()])]),
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: [number, [string]], r: [number, [string]]) {
        return Object.is(l, r) || (l.length === r.length && (() => {
        const
          l0 = l[0],
          r0 = r[0],
          l1 = l[1],
          r1 = r[1]
        return (Object.is(l0, r0)) && (Object.is(l1, r1) || (l1.length === r1.length && (() => {
          const
            l10 = l1[0],
            r10 = r1[0]
          return (Object.is(l10, r10))
      })()))
      })())
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(
        z.tuple([z.number(), z.tuple([z.string(), z.optional(z.boolean())])]),
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: [number, [string, _?: boolean]], r: [number, [string, _?: boolean]]) {
        return Object.is(l, r) || (l.length === r.length && (() => {
        const
          l0 = l[0],
          r0 = r[0],
          l1 = l[1],
          r1 = r[1]
        return (Object.is(l0, r0)) && (Object.is(l1, r1) || (l1.length === r1.length && (() => {
          const
            l10 = l1[0],
            r10 = r1[0],
            l11 = l1[1],
            r11 = r1[1]
          return (Object.is(l10, r10)) && (Object.is(l11, r11) || Object.is(l11, r11))
      })()))
      })())
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(
        z.tuple([z.number(), z.tuple([z.string()], z.object({ a: z.boolean() }))])
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: [number, [string, ...{ a: boolean }[]]], r: [number, [string, ...{ a: boolean }[]]]) {
        return Object.is(l, r) || (l.length === r.length && (() => {
        const
          l0 = l[0],
          r0 = r[0],
          l1 = l[1],
          r1 = r[1]
        return (Object.is(l0, r0)) && (Object.is(l1, r1) || (l1.length === r1.length && (() => {
          const
            l10 = l1[0],
            r10 = r1[0]
          if (!Object.is(l10, r10)) return false
          for (let ix = 1, len = l1.length; ix < len; ix++) {
            const l1Value = l1[ix]
            const r1Value = r1[ix]
            if (!(Object.is(l1Value, r1Value) || (() => {
          const
            l1Valuea = l1Value.a,
            r1Valuea = r1Value.a
          return (Object.is(l1Valuea, r1Valuea))
      })())) return false
          }
          return true
      })()))
      })())
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(
        z.tuple([z.number(), z.tuple([z.object({ a: z.boolean() })])])
      )
    ).toMatchInlineSnapshot
      (`
      "function equals(l: [number, [{ a: boolean }]], r: [number, [{ a: boolean }]]) {
        return Object.is(l, r) || (l.length === r.length && (() => {
        const
          l0 = l[0],
          r0 = r[0],
          l1 = l[1],
          r1 = r[1]
        return (Object.is(l0, r0)) && (Object.is(l1, r1) || (l1.length === r1.length && (() => {
          const
            l10 = l1[0],
            r10 = r1[0]
          return (Object.is(l10, r10) || (() => {
            const
              l10a = l10.a,
              r10a = r10.a
            return (Object.is(l10a, r10a))
      })())
      })()))
      })())
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.equals.writeable❳: z.object', () => {
    vi.expect.soft(
      zx.equals.writeable(z.object({}))
    ).toMatchInlineSnapshot
      (`
      "function equals(l: {}, r: {}) {
        return Object.is(l, r) || (() => {
        return Object.keys(l).length === 0 && Object.keys(r).length === 0
      })()
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(z.object({
        a: z.number(),
        b: z.object({
          c: z.boolean()
        }),
      }))
    ).toMatchInlineSnapshot
      (`
      "function equals(l: { a: number, b: { c: boolean } }, r: { a: number, b: { c: boolean } }) {
        return Object.is(l, r) || (() => {
        const
          la = l.a,
          ra = r.a,
          lb = l.b,
          rb = r.b
        return (Object.is(la, ra)) && (Object.is(lb, rb) || (() => {
          const
            lbc = lb.c,
            rbc = rb.c
          return (Object.is(lbc, rbc))
      })())
      })()
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(z.object({ a: z.array(z.number()), b: z.object({ c: z.boolean() }) }), { typeName: 'Type' })
    ).toMatchInlineSnapshot
      (`
      "type Type = { a: Array<number>, b: { c: boolean } }
      function equals(l: Type, r: Type) {
        return Object.is(l, r) || (() => {
        const
          la = l.a,
          ra = r.a,
          lb = l.b,
          rb = r.b
        return (la.length === ra.length && la.every(
          (l2, i) => {
            const r2 = ra[i];
            return Object.is(l2, r2)
          })) && (Object.is(lb, rb) || (() => {
          const
            lbc = lb.c,
            rbc = rb.c
          return (Object.is(lbc, rbc))
      })())
      })()
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(z.object({ a: z.number() }).catchall(z.boolean()), { typeName: 'Type' })
    ).toMatchInlineSnapshot
      (`
      "type Type = { a: number } & { [x: string]: boolean }
      function equals(l: Type, r: Type) {
        return Object.is(l, r) || (() => {
        const
          la = l.a,
          ra = r.a
        const knownKeys_1 = { "a": true }
        const allKeys = new Set(Object.keys(l).concat(Object.keys(r)))
        return (Object.is(la, ra))
          && Array.from(allKeys).every((key) => {
            if (knownKeys_1[key]) return true
            else {
              const lValue = l[key]
              const rValue = r[key]
              return Object.is(lValue, rValue)
            }
          })
      })()
      }"
    `)

    vi.expect.soft(
      zx.equals.writeable(
        z.object({
          a: z.number(),
          b: z.object({
            d: z.optional(z.date())
          }).catchall(
            z.array(z.record(z.string(), z.array(z.boolean())))
          ),
          c: z.record(z.string(), z.boolean())
        }).catchall(z.boolean()),
        { typeName: 'Type' }
      )
    ).toMatchInlineSnapshot
      (`
      "type Type = { a: number, b: { d?: Date } & { [x: string]: Array<Record<string, Array<boolean>>> }, c: Record<string, boolean> } & { [x: string]: boolean }
      function equals(l: Type, r: Type) {
        return Object.is(l, r) || (() => {
        const
          la = l.a,
          ra = r.a,
          lb = l.b,
          rb = r.b,
          lc = l.c,
          rc = r.c
        const knownKeys_1 = { "a": true, "b": true, "c": true }
        const allKeys = new Set(Object.keys(l).concat(Object.keys(r)))
        return (Object.is(la, ra)) && (Object.is(lb, rb) || (() => {
          const
            lbd = lb?.d,
            rbd = rb?.d
          const knownKeys_2 = { "d": true }
          const allKeys = new Set(Object.keys(lb).concat(Object.keys(rb)))
          return (Object.is(lbd, rbd) || lbd?.getTime() === rbd?.getTime())
            && Array.from(allKeys).every((key) => {
              if (knownKeys_2[key]) return true
              else {
                const lbValue = lb[key]
                const rbValue = rb[key]
                return lbValue.length === rbValue.length && lbValue.every(
          (l2, i) => {
            const r2 = rbValue[i];
            return Object.is(l2, r2) || (() => {
            const l2Keys = Object.keys(l2)
            const r2Keys = Object.keys(r2)
            return l2Keys.length === r2Keys.length && 
            (l2Keys.every((k3) => {
              const l3 = l2[k3]
              if (!Object.hasOwn(r2, k3)) return false
              else {
                const r3 = r2[k3]
                return l3.length === r3.length && l3.every(
              (l4, i) => {
                const r4 = r3[i];
                return Object.is(l4, r4)
              })
              }
            }))
      })()
          })
              }
            })
      })()) && (Object.is(lc, rc) || (() => {
          const lcKeys = Object.keys(lc)
          const rcKeys = Object.keys(rc)
          return lcKeys.length === rcKeys.length && 
          (lcKeys.every((k2) => {
            const l2 = lc[k2]
            if (!Object.hasOwn(rc, k2)) return false
            else {
              const r2 = rc[k2]
              return Object.is(l2, r2)
            }
          }))
      })())
          && Array.from(allKeys).every((key) => {
            if (knownKeys_1[key]) return true
            else {
              const lValue = l[key]
              const rValue = r[key]
              return Object.is(lValue, rValue)
            }
          })
      })()
      }"
    `)

    vi.expect.soft(
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
    ).toMatchInlineSnapshot
      (`
      "type Type = { b: Array<string>, "0b": Array<string>, "00b": Array<string>, "-00b": Array<string>, "00b0": Array<string>, "--00b0": Array<string>, "-^00b0": Array<string>, "": Array<string>, _: Array<string> }
      function equals(l: Type, r: Type) {
        return Object.is(l, r) || (() => {
        const
          lb = l.b,
          rb = r.b,
          l_b = l["0b"],
          r_b = r["0b"],
          l_0b = l["00b"],
          r_0b = r["00b"],
          l_00b = l["-00b"],
          r_00b = r["-00b"],
          l_0b0 = l["00b0"],
          r_0b0 = r["00b0"],
          l__00b0 = l["--00b0"],
          r__00b0 = r["--00b0"],
          l__00b01 = l["-^00b0"],
          r__00b01 = r["-^00b0"],
          l_ = l[""],
          r_ = r[""],
          l_1 = l._,
          r_1 = r._
        return (lb.length === rb.length && lb.every(
          (l2, i) => {
            const r2 = rb[i];
            return Object.is(l2, r2)
          })) && (l_b.length === r_b.length && l_b.every(
          (l2, i) => {
            const r2 = r_b[i];
            return Object.is(l2, r2)
          })) && (l_0b.length === r_0b.length && l_0b.every(
          (l2, i) => {
            const r2 = r_0b[i];
            return Object.is(l2, r2)
          })) && (l_00b.length === r_00b.length && l_00b.every(
          (l2, i) => {
            const r2 = r_00b[i];
            return Object.is(l2, r2)
          })) && (l_0b0.length === r_0b0.length && l_0b0.every(
          (l2, i) => {
            const r2 = r_0b0[i];
            return Object.is(l2, r2)
          })) && (l__00b0.length === r__00b0.length && l__00b0.every(
          (l2, i) => {
            const r2 = r__00b0[i];
            return Object.is(l2, r2)
          })) && (l__00b01.length === r__00b01.length && l__00b01.every(
          (l2, i) => {
            const r2 = r__00b01[i];
            return Object.is(l2, r2)
          })) && (l_.length === r_.length && l_.every(
          (l2, i) => {
            const r2 = r_[i];
            return Object.is(l2, r2)
          })) && (l_1.length === r_1.length && l_1.every(
          (l2, i) => {
            const r2 = r_1[i];
            return Object.is(l2, r2)
          }))
      })()
      }"
    `)

    // TODO: figure out why `newtype` isn't coming in
    vi.expect.soft(
      zx.equals.writeable(z.object({}), { typeName: 'Type', preferInterface: true })
    ).toMatchInlineSnapshot
      (`
      "interface Type extends newtype<{}> {}
      function equals(l: Type, r: Type) {
        return Object.is(l, r) || (() => {
        return Object.keys(l).length === 0 && Object.keys(r).length === 0
      })()
      }"
    `)
  })



})
