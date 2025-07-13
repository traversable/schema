import * as vi from 'vitest'
import * as T from '@sinclair/typebox'
import { box } from '@traversable/typebox'

import prettier from "@prettier/sync"

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

const array: unknown[] = []
const object: object = {}
const symbol = Symbol()
const date = new Date()


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: box.equals', () => {
  vi.test('〖⛳️〗› ❲box.equals❳: T.Never', () => {
    /////////////////
    const equals = box.equals(T.Never())
    //    success
    vi.expect.soft(equals(undefined as never, undefined as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(undefined as never, null as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Void', () => {
    /////////////////
    const equals = box.equals(T.Void())
    //    success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(void 0, null as never)).toBeFalsy()
    vi.expect.soft(equals(null as never, void 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Any', () => {
    /////////////////
    const equals = box.equals(T.Any())
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

  vi.test('〖⛳️〗› ❲box.equals❳: T.Unknown', () => {
    /////////////////
    const equals = box.equals(T.Unknown())
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

  vi.test('〖⛳️〗› ❲box.equals❳: T.Null', () => {
    /////////////////
    const equals = box.equals(T.Null())
    //    success
    vi.expect.soft(equals(null, null)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(null, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, null)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Symbol', () => {
    /////////////////
    const equals = box.equals(T.Symbol())
    //    success
    vi.expect.soft(equals(symbol, symbol)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(symbol, Symbol())).toBeFalsy()
    vi.expect.soft(equals(Symbol(), symbol)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Boolean', () => {
    /////////////////
    const equals = box.equals(T.Boolean())
    //    success
    vi.expect.soft(equals(false, false)).toBeTruthy()
    vi.expect.soft(equals(true, true)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Integer', () => {
    /////////////////
    const equals = box.equals(T.Integer())
    //    success
    vi.expect.soft(equals(-0, -0)).toBeTruthy()
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    vi.expect.soft(equals(0, -0)).toBeTruthy()
    vi.expect.soft(equals(-0, 0)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.BigInt', () => {
    /////////////////
    const equals = box.equals(T.BigInt())
    //    success
    vi.expect.soft(equals(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals(1n, 1n)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals(0n, 1n)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Number', () => {
    /////////////////
    const equals = box.equals(T.Number())
    //    success
    vi.expect.soft(equals(-0, -0)).toBeTruthy()
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    vi.expect.soft(equals(-0.1, -0.1)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    vi.expect.soft(equals(0, -0)).toBeTruthy()
    vi.expect.soft(equals(-0, 0)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
    vi.expect.soft(equals(0.1, -0.1)).toBeFalsy()
    vi.expect.soft(equals(-0.1, 0.1)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, NaN)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.String', () => {
    /////////////////
    const equals = box.equals(T.String())
    //    success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Literal', () => {
    /////////////////
    const equals = box.equals(T.Literal(1))
    //    success
    vi.expect.soft(equals(1, 1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1, 2 as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Enum', () => {
    /////////////////
    const equals = box.equals(T.Enum({ one: '1', two: '2' }))
    //    success
    vi.expect.soft(equals('1', '1')).toBeTruthy()
    vi.expect.soft(equals('2', '2')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('1', '2')).toBeFalsy()
    vi.expect.soft(equals('2', '1')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Date', () => {
    /////////////////
    const equals = box.equals(T.Date())
    //    success
    vi.expect.soft(equals(date, date)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(date, new Date())).toBeFalsy()
    vi.expect.soft(equals(new Date(), date)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Optional', () => {
    /////////////////
    const equals = box.equals(T.Optional(T.Boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Array', () => {
    /////////////////
    const equals_01 = box.equals(T.Array(T.Integer()))
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

  vi.test('〖⛳️〗› ❲box.equals❳: T.Record', () => {
    /////////////////
    const equals_01 = box.equals(T.Record(T.String(), T.Integer()))
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

  vi.test('〖⛳️〗› ❲box.equals❳: T.Union', () => {
    /////////////////
    const equals_01 = box.equals(T.Union([]))
    //    success
    vi.expect.soft(equals_01('' as never, '' as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01('' as never, 'hey' as never)).toBeFalsy()

    /////////////////
    const equals_02 = box.equals(T.Union([T.Integer()]))
    //    success
    vi.expect.soft(equals_02(0, 0)).toBeTruthy()
    vi.expect.soft(equals_02(-0, -0)).toBeTruthy()
    vi.expect.soft(equals_02(0, -0)).toBeTruthy()
    vi.expect.soft(equals_02(-0, 0)).toBeTruthy()
    // //    failure
    vi.expect.soft(equals_02(NaN, 0)).toBeFalsy()
    vi.expect.soft(equals_02(0, NaN)).toBeFalsy()
    vi.expect.soft(equals_02(0, 1)).toBeFalsy()
    vi.expect.soft(equals_02(1, 0)).toBeFalsy()

    /////////////////
    const equals_03 = box.equals(T.Union([T.Integer(), T.BigInt()]))
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
    vi.expect.soft(equals_03(0, NaN)).toBeFalsy()
    vi.expect.soft(equals_03(NaN, 0)).toBeFalsy()
    vi.expect.soft(equals_03(0n, NaN)).toBeFalsy()
    vi.expect.soft(equals_03(NaN, 0n)).toBeFalsy()
  })



  vi.test('〖⛳️〗› ❲box.equals❳: T.Intersect', () => {
    /////////////////
    const equals_01 = box.equals(T.Intersect([T.Object({ a: T.Number() }), T.Object({ b: T.String() })]))
    //    success
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1, b: '' })).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01({ a: 1 } as never, { a: 1, b: '' })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1 } as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Tuple', () => {
    /////////////////
    const equals = box.equals(T.Tuple([T.String(), T.Integer()]))
    //    success
    vi.expect.soft(equals(['', 0], ['', 0])).toBeTruthy()
    vi.expect.soft(equals(['hey', 1], ['hey', 1])).toBeTruthy()
    //    failure
    vi.expect.soft(equals(['', 0], ['', 1])).toBeFalsy()
    vi.expect.soft(equals(['', 1], ['', 0])).toBeFalsy()
    vi.expect.soft(equals(['', 0], ['hey', 0])).toBeFalsy()
    vi.expect.soft(equals(['hey', 0], ['', 0])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲box.equals❳: T.Object', () => {
    /////////////////
    const equals = box.equals(T.Object({ a: T.Number(), b: T.String(), c: T.Boolean() }))
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

  vi.test('〖⛳️〗› ❲box.equals❳: T.Object w/ optional props', () => {
    /////////////////
    const equals = box.equals(T.Object({ a: T.Optional(T.Boolean()), b: T.Optional(T.Symbol()) }))
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
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: box.equals.writeable', () => {
  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Never', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Never()
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

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Any', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Any()
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

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Unknown', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Unknown()
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

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Void', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Void()
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

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Undefined', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Undefined()
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

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Null', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Null()
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

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Boolean', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Boolean()
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

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Symbol', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Symbol()
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

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Integer', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Integer()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.BigInt', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.BigInt()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: bigint, r: bigint) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Number', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Number()
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.String', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.String()
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

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Enum', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Enum({})
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
      box.equals.writeable(
        T.Enum({ a: 1, b: 2 })
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: 1 | 2, r: 1 | 2) {
        if (Object.is(l, r)) return true
        {
          let satisfied = false
          function check_0(value) {
            return value === 1
          }
          if (check_0(l) && check_0(r)) {
            satisfied = true
            if (!Object.is(l, r)) return false
          }
          function check_1(value) {
            return value === 2
          }
          if (check_1(l) && check_1(r)) {
            satisfied = true
            if (!Object.is(l, r)) return false
          }
          if (!satisfied) return false
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Literal', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Literal(false)
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: false, r: false) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      box.equals.writeable(
        T.Literal(0)
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: 0, r: 0) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      box.equals.writeable(
        T.Literal('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a", r: "a") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Date', () => {
    vi.expect.soft(format(
      box.equals.writeable(T.Date())
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Date, r: Date) {
        if (!Object.is(l?.getTime(), r?.getTime())) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Optional', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Optional(T.Number())
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Record', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Record(T.String(), T.Record(T.String(), T.String())), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, string>>
      function equals(l: Type, r: Type) {
        if (l === r) return true
        const l_keys = Object.keys(l)
        const r_keys = Object.keys(r)
        const length = l_keys.length
        if (length !== r_keys.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const k = l_keys[ix]
          if (!r_keys.includes(k)) return false
          const l_k_ = l[k]
          const r_k_ = r[k]
          const l_k_1_keys = Object.keys(l_k_)
          const r_k_1_keys = Object.keys(r_k_)
          const length1 = l_k_1_keys.length
          if (length1 !== r_k_1_keys.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const k = l_k_1_keys[ix]
            if (!r_k_1_keys.includes(k)) return false
            const l_k___k_ = l_k_[k]
            const r_k___k_ = r_k_[k]
            if (l_k___k_ !== r_k___k_) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      box.equals.writeable(
        T.Object({
          a: T.Record(T.String(), T.String()),
          b: T.Record(
            T.String(),
            T.Object({
              c: T.Object({
                d: T.String(),
                e: T.Record(
                  T.String(),
                  T.Array(T.String()),
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
        const l_a_keys = Object.keys(l.a)
        const r_a_keys = Object.keys(r.a)
        const length = l_a_keys.length
        if (length !== r_a_keys.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const k = l_a_keys[ix]
          if (!r_a_keys.includes(k)) return false
          const l_a_k_ = l.a[k]
          const r_a_k_ = r.a[k]
          if (l_a_k_ !== r_a_k_) return false
        }
        const l_b_keys = Object.keys(l.b)
        const r_b_keys = Object.keys(r.b)
        const length1 = l_b_keys.length
        if (length1 !== r_b_keys.length) return false
        for (let ix = length1; ix-- !== 0; ) {
          const k = l_b_keys[ix]
          if (!r_b_keys.includes(k)) return false
          const l_b_k_ = l.b[k]
          const r_b_k_ = r.b[k]
          if (l_b_k_.c.d !== r_b_k_.c.d) return false
          const l_b_k__c_e_keys = Object.keys(l_b_k_.c.e)
          const r_b_k__c_e_keys = Object.keys(r_b_k_.c.e)
          const length2 = l_b_k__c_e_keys.length
          if (length2 !== r_b_k__c_e_keys.length) return false
          for (let ix = length2; ix-- !== 0; ) {
            const k = l_b_k__c_e_keys[ix]
            if (!r_b_k__c_e_keys.includes(k)) return false
            const l_b_k__c_e_k_ = l_b_k_.c.e[k]
            const r_b_k__c_e_k_ = r_b_k_.c.e[k]
            const length3 = l_b_k__c_e_k_.length
            if (length3 !== r_b_k__c_e_k_.length) return false
            for (let ix = length3; ix-- !== 0; ) {
              const l_b_k__c_e_k_1_item = l_b_k__c_e_k_[ix]
              const r_b_k__c_e_k_1_item = r_b_k__c_e_k_[ix]
              if (l_b_k__c_e_k_1_item !== r_b_k__c_e_k_1_item) return false
            }
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Array', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Array(T.Number())
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Array<number>, r: Array<number>) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item !== r_item && (l_item === l_item || r_item === r_item))
            return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      box.equals.writeable(
        T.Array(T.Object({
          c: T.Object({
            d: T.String(),
            e: T.Array(T.String()),
          })
        })), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{ c: { d: string; e: Array<string> } }>
      function equals(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item.c.d !== r_item.c.d) return false
          const length1 = l_item.c.e.length
          if (length1 !== r_item.c.e.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l_item_c_e_item = l_item.c.e[ix]
            const r_item_c_e_item = r_item.c.e[ix]
            if (l_item_c_e_item !== r_item_c_e_item) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      box.equals.writeable(
        T.Object({
          a: T.Array(T.String()),
          b: T.Array(T.Object({
            c: T.Object({
              d: T.String(),
              e: T.Array(T.String()),
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
        const length = l.a.length
        if (length !== r.a.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_a_item = l.a[ix]
          const r_a_item = r.a[ix]
          if (l_a_item !== r_a_item) return false
        }
        const length1 = l.b.length
        if (length1 !== r.b.length) return false
        for (let ix = length1; ix-- !== 0; ) {
          const l_b_item = l.b[ix]
          const r_b_item = r.b[ix]
          if (l_b_item.c.d !== r_b_item.c.d) return false
          const length2 = l_b_item.c.e.length
          if (length2 !== r_b_item.c.e.length) return false
          for (let ix = length2; ix-- !== 0; ) {
            const l_b_item_c_e_item = l_b_item.c.e[ix]
            const r_b_item_c_e_item = r_b_item.c.e[ix]
            if (l_b_item_c_e_item !== r_b_item_c_e_item) return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Tuple', () => {
    vi.expect.soft(format(
      box.equals.writeable(T.Tuple([]), { typeName: 'Type' })
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
      box.equals.writeable(T.Tuple([T.String(), T.String()]), { typeName: 'Type' })
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
      box.equals.writeable(
        T.Tuple([T.Number(), T.Tuple([T.Object({ a: T.Boolean() })])])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: [number, [{ a: boolean }]], r: [number, [{ a: boolean }]]) {
        if (l === r) return true
        if (l[0] !== r[0] && (l[0] === l[0] || r[0] === r[0])) return false
        if (l[1][0].a !== r[1][0].a) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      box.equals.writeable(T.Object({
        a: T.Tuple([T.String(), T.String()]),
        b: T.Optional(T.Tuple([T.String(), T.Optional(T.Tuple([T.String()]))]))
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: [string, string]; b?: [string, _?: [string]] }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.a[0] !== r.a[0]) return false
        if (l.a[1] !== r.a[1]) return false
        if (l.b !== r.b) {
          if (l.b[0] !== r.b[0]) return false
          if (l.b?.[1] !== r.b?.[1]) {
            if (l.b[1][0] !== r.b[1][0]) return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Tuple w/ rest', () => {
    vi.expect.soft(format(
      box.equals.writeable(T.Tuple([T.String(), T.String()], T.Number()), { typeName: 'Type' })
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
      box.equals.writeable(T.Tuple([T.Object({ a: T.String() }), T.Object({ b: T.String() })], T.Object({ c: T.Number() })), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ a: string }, { b: string }]
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l[0].a !== r[0].a) return false
        if (l[1].b !== r[1].b) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Object', () => {
    vi.expect.soft(format(
      box.equals.writeable(T.Object({}))
    )).toMatchInlineSnapshot
      (`
      "function equals(l: {}, r: {}) {
        if (l === r) return true
        return true
      }
      "
    `)

    vi.expect.soft(format(
      box.equals.writeable(T.Object({
        street1: T.String(),
        street2: T.Optional(T.String()),
        city: T.String(),
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2: string; city: string }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.street1 !== r.street1) return false
        if (l.street2 !== r.street2) return false
        if (l.city !== r.city) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      box.equals.writeable(
        T.Object({
          a: T.Object({
            b: T.String(),
            c: T.String(),
          }),
          d: T.Optional(T.String()),
          e: T.Object({
            f: T.String(),
            g: T.Optional(
              T.Object({
                h: T.String(),
                i: T.String(),
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
        d: string
        e: { f: string; g?: { h: string; i: string } }
      }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.a.b !== r.a.b) return false
        if (l.a.c !== r.a.c) return false
        if (l.d !== r.d) return false
        if (l.e.f !== r.e.f) return false
        if (l.e.g !== r.e.g) {
          if (l.e.g.h !== r.e.g.h) return false
          if (l.e.g.i !== r.e.g.i) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      box.equals.writeable(T.Object({
        b: T.Array(T.String()),
        '0b': T.Array(T.String()),
        '00b': T.Array(T.String()),
        '-00b': T.Array(T.String()),
        '00b0': T.Array(T.String()),
        '--00b0': T.Array(T.String()),
        '-^00b0': T.Array(T.String()),
        '': T.Array(T.String()),
        '_': T.Array(T.String()),
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
        const length = l.b.length
        if (length !== r.b.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_b_item = l.b[ix]
          const r_b_item = r.b[ix]
          if (l_b_item !== r_b_item) return false
        }
        const length1 = l["0b"].length
        if (length1 !== r["0b"].length) return false
        for (let ix = length1; ix-- !== 0; ) {
          const l__0b___item = l["0b"][ix]
          const r__0b___item = r["0b"][ix]
          if (l__0b___item !== r__0b___item) return false
        }
        const length2 = l["00b"].length
        if (length2 !== r["00b"].length) return false
        for (let ix = length2; ix-- !== 0; ) {
          const l__00b___item = l["00b"][ix]
          const r__00b___item = r["00b"][ix]
          if (l__00b___item !== r__00b___item) return false
        }
        const length3 = l["-00b"].length
        if (length3 !== r["-00b"].length) return false
        for (let ix = length3; ix-- !== 0; ) {
          const l___00b___item = l["-00b"][ix]
          const r___00b___item = r["-00b"][ix]
          if (l___00b___item !== r___00b___item) return false
        }
        const length4 = l["00b0"].length
        if (length4 !== r["00b0"].length) return false
        for (let ix = length4; ix-- !== 0; ) {
          const l__00b0___item = l["00b0"][ix]
          const r__00b0___item = r["00b0"][ix]
          if (l__00b0___item !== r__00b0___item) return false
        }
        const length5 = l["--00b0"].length
        if (length5 !== r["--00b0"].length) return false
        for (let ix = length5; ix-- !== 0; ) {
          const l____00b0___item = l["--00b0"][ix]
          const r____00b0___item = r["--00b0"][ix]
          if (l____00b0___item !== r____00b0___item) return false
        }
        const length6 = l["-^00b0"].length
        if (length6 !== r["-^00b0"].length) return false
        for (let ix = length6; ix-- !== 0; ) {
          const l____00b0__1_item = l["-^00b0"][ix]
          const r____00b0__1_item = r["-^00b0"][ix]
          if (l____00b0__1_item !== r____00b0__1_item) return false
        }
        const length7 = l[""].length
        if (length7 !== r[""].length) return false
        for (let ix = length7; ix-- !== 0; ) {
          const l_____item = l[""][ix]
          const r_____item = r[""][ix]
          if (l_____item !== r_____item) return false
        }
        const length8 = l._.length
        if (length8 !== r._.length) return false
        for (let ix = length8; ix-- !== 0; ) {
          const l___item = l._[ix]
          const r___item = r._[ix]
          if (l___item !== r___item) return false
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Union', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Union([])
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
      box.equals.writeable(
        T.Union([T.Number(), T.Array(T.String())])
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
              if (l !== r && (l === l || r === r)) return false
            }
            function check_1(value) {
              return (
                Array.isArray(value) &&
                value.every((value) => typeof value === "string")
              )
            }
            if (check_1(l) && check_1(r)) {
              satisfied = true
              const length = l.length
              if (length !== r.length) return false
              for (let ix = length; ix-- !== 0; ) {
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
      box.equals.writeable(
        T.Union([
          T.Union([
            T.Object({ abc: T.String() }),
            T.Object({ def: T.String() })
          ]),
          T.Union([
            T.Object({ ghi: T.String() }),
            T.Object({ jkl: T.String() })
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
                (!!value && typeof value === "object" && typeof value === "string") ||
                (!!value && typeof value === "object" && typeof value === "string")
              )
            }
            if (check_0(l) && check_0(r)) {
              satisfied = true
              {
                let satisfied1 = false
                function check_0(value) {
                  return (
                    !!value && typeof value === "object" && typeof value === "string"
                  )
                }
                if (check_0(l) && check_0(r)) {
                  satisfied1 = true
                  if (l.abc !== r.abc) return false
                }
                function check_1(value) {
                  return (
                    !!value && typeof value === "object" && typeof value === "string"
                  )
                }
                if (check_1(l) && check_1(r)) {
                  satisfied1 = true
                  if (l.def !== r.def) return false
                }
                if (!satisfied1) return false
              }
            }
            function check_1(value) {
              return (
                (!!value && typeof value === "object" && typeof value === "string") ||
                (!!value && typeof value === "object" && typeof value === "string")
              )
            }
            if (check_1(l) && check_1(r)) {
              satisfied = true
              {
                let satisfied2 = false
                function check_0(value) {
                  return (
                    !!value && typeof value === "object" && typeof value === "string"
                  )
                }
                if (check_0(l) && check_0(r)) {
                  satisfied2 = true
                  if (l.ghi !== r.ghi) return false
                }
                function check_1(value) {
                  return (
                    !!value && typeof value === "object" && typeof value === "string"
                  )
                }
                if (check_1(l) && check_1(r)) {
                  satisfied2 = true
                  if (l.jkl !== r.jkl) return false
                }
                if (!satisfied2) return false
              }
            }
            if (!satisfied) return false
          }
          return true
        }
        "
      `)
  })


  vi.test('〖⛳️〗› ❲box.equals.writeable❳: T.Intersect', () => {
    vi.expect.soft(format(
      box.equals.writeable(
        T.Intersect([
          T.Object({
            abc: T.String()
          }),
          T.Object({
            def: T.String()
          })
        ]), {
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
      box.equals.writeable(
        T.Intersect([
          T.Object({
            abc: T.String(),
            def: T.Object({
              ghi: T.String(),
              jkl: T.String()
            })
          }),
          T.Object({
            mno: T.String(),
            pqr: T.Object({
              stu: T.String(),
              vwx: T.String(),
            })
          })
        ]), {
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
          if (l.def.ghi !== r.def.ghi) return false
          if (l.def.jkl !== r.def.jkl) return false
        }
        {
          if (l.mno !== r.mno) return false
          if (l.pqr.stu !== r.pqr.stu) return false
          if (l.pqr.vwx !== r.pqr.vwx) return false
        }
        return true
      }
      "
    `)
  })

})

