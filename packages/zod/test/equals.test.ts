import * as vi from 'vitest'
import { z } from 'zod/v4'

import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  const array: unknown[] = []
  const object: object = {}
  const symbol = Symbol()
  const date = new Date()

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.never', () => {
    const equals = zx.equals(z.never())
    // failure
    vi.expect.soft(equals(void 0 as never, void 0 as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.void', () => {
    const equals = zx.equals(z.void())
    // success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    // failure
    vi.expect.soft(equals(void 0, null as never)).toBeFalsy()
    vi.expect.soft(equals(null as never, void 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.any', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.unknown', () => {
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


  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.null', () => {
    const equals = zx.equals(z.null())
    // success
    vi.expect.soft(equals(null, null)).toBeTruthy()
    // failure
    vi.expect.soft(equals(null, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, null)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.nan', () => {
    const equals = zx.equals(z.nan())
    // success
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.symbol', () => {
    const equals = zx.equals(z.symbol())
    // success
    vi.expect.soft(equals(symbol, symbol)).toBeTruthy()
    // failure
    vi.expect.soft(equals(symbol, Symbol())).toBeFalsy()
    vi.expect.soft(equals(Symbol(), symbol)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.boolean', () => {
    const equals = zx.equals(z.boolean())
    // success
    vi.expect.soft(equals(false, false)).toBeTruthy()
    vi.expect.soft(equals(true, true)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.int', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.bigint', () => {
    const equals = zx.equals(z.bigint())
    // success
    vi.expect.soft(equals(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals(1n, 1n)).toBeTruthy()
    // failure
    vi.expect.soft(equals(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals(0n, 1n)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.number', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.string', () => {
    const equals = zx.equals(z.string())
    // success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    // failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.literal', () => {
    const equals = zx.equals(z.literal(1))
    // success
    vi.expect.soft(equals(1, 1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(1, 2 as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.enum', () => {
    const equals = zx.equals(z.enum(['1', '2']))
    // success
    vi.expect.soft(equals('1', '1')).toBeTruthy()
    vi.expect.soft(equals('2', '2')).toBeTruthy()
    // failure
    vi.expect.soft(equals('1', '2')).toBeFalsy()
    vi.expect.soft(equals('2', '1')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.templateLiteral', () => {
    const equals = zx.equals(z.templateLiteral(['1', '2']))
    // success
    vi.expect.soft(equals('12', '12')).toBeTruthy()
    // failure
    vi.expect.soft(equals('1' as never, '12')).toBeFalsy()
    vi.expect.soft(equals('12', '1' as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.date', () => {
    const equals = zx.equals(z.date())
    // success
    vi.expect.soft(equals(date, date)).toBeTruthy()
    // failure
    vi.expect.soft(equals(date, new Date())).toBeFalsy()
    vi.expect.soft(equals(new Date(), date)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.optional', () => {
    const equals = zx.equals(z.optional(z.boolean()))
    // success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(undefined, undefined)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, undefined)).toBeFalsy()
    vi.expect.soft(equals(undefined, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.nonoptional', () => {
    const equals = zx.equals(z.nonoptional(z.boolean()))
    // success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.nullable', () => {
    const equals = zx.equals(z.nullable(z.boolean()))
    // success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, null)).toBeFalsy()
    vi.expect.soft(equals(null, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.array', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.set', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.map', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.record', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.lazy', () => {
    const equals = zx.equals(z.lazy(() => z.string()))
    // success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    // failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.union', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.intersection', () => {
    const equals_01 = zx.equals(z.intersection(z.object({ a: z.number() }), z.object({ b: z.string() })))
    // success
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1, b: '' })).toBeTruthy()
    // failure
    vi.expect.soft(equals_01({ a: 1 } as never, { a: 1, b: '' })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1 } as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.tuple', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.tuple w/ rest', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.object', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.object w/ optional props', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.object w/ catchall', () => {
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

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.pipe', () => {
    const equals = zx.equals(z.pipe(z.number(), z.int()))
    // success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.default', () => {
    const equals = zx.equals(z.number().default(1))
    // success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.prefault', () => {
    const equals = zx.equals(z.number().prefault(1))
    // success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.catch', () => {
    const equals = zx.equals(z.number().catch(1))
    // success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    // failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.classic.equals❳: z.success', () => {
    const equals = zx.equals(z.success(z.number()))
    // success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    // failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })


})
