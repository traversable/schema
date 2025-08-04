import * as vi from 'vitest'
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

import prettier from "@prettier/sync"

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

const array: unknown[] = []
const object: object = {}
const symbol = Symbol()
const date = new Date()

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: vx.deepEqual.writeable', () => {
  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.never', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.never()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.any', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.any()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: any, r: any) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.unknown', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.unknown()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: unknown, r: unknown) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.void', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.void()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: void, r: void) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.undefined', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.undefined()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: undefined, r: undefined) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.null', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.null()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: null, r: null) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.boolean', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.boolean()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: boolean, r: boolean) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.symbol', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.symbol()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: symbol, r: symbol) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.nan', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.nan()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.int', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.pipe(
          v.number(),
          v.integer(),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.bigint', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.bigint()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: bigint, r: bigint) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.number', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.number()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.string', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.string()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: string, r: string) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.picklist', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.picklist([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.picklist(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: "a", r: "a") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.picklist(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: "a" | "b", r: "a" | "b") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.enum', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.enum({})
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.enum({ A: 'a' })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: "a", r: "a") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.enum({ A: 'a', B: 'b' })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: "a" | "b", r: "a" | "b") {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.literal', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.literal('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: "a", r: "a") {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.file', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.file()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: File, r: File) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.blob', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.blob()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Blob, r: Blob) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.date', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(v.date())
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Date, r: Date) {
        if (!Object.is(l?.getTime(), r?.getTime())) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.lazy', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.lazy(() => v.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: number, r: number) {
        if (l === r) return true
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.optional', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.optional(v.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: undefined | number, r: undefined | number) {
        if (l === r) return true
        if ((l === undefined || r == undefined) && l !== r) return false
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.nullable', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.nullable(v.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: null | number, r: null | number) {
        if (l === r) return true
        if ((l === null || r === null) && l !== r) return false
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.set', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.set(v.number()),
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Set<number>, r: Set<number>) {
        if (l === r) return true
        if (l?.size !== r?.size) return false
        const l_values = Array.from(l).sort()
        const r_values = Array.from(r).sort()
        let length = l_values.length
        for (let ix = length; ix-- !== 0; ) {
          const l_value = l_values[ix]
          const r_value = r_values[ix]
          if (l_value !== r_value && (l_value === l_value || r_value === r_value))
            return false
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.map', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.map(v.number(), v.unknown()),
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Map<number, unknown>, r: Map<number, unknown>) {
        if (l === r) return true
        if (l?.size !== r?.size) return false
        const l_entries = Array.from(l).sort()
        const r_entries = Array.from(r).sort()
        for (let ix = 0, len = l_entries.length; ix < len; ix++) {
          const [l_key, l_value] = l_entries[ix]
          const [r_key, r_value] = r_entries[ix]
          if (l_key !== r_key && (l_key === l_key || r_key === r_key)) return false
          if (!Object.is(l_value, r_value)) return false
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.array', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.array(
          v.object({
            a: v.array(
              v.object({
                b: v.array(v.string()),
                c: v.optional(v.string()),
              })
            ),
            d: v.optional(
              v.array(
                v.object({
                  e: v.optional(v.array(v.string())),
                  f: v.string(),
                })
              )
            )
          })
        ), { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{
        a: Array<{ b: Array<string>; c?: undefined | string }>
        d?: undefined | Array<{ e?: undefined | Array<string>; f: string }>
      }>
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item.a !== r_item.a) {
            const length1 = l_item.a.length
            if (length1 !== r_item.a.length) return false
            for (let ix = length1; ix-- !== 0; ) {
              const l_item_a_item = l_item.a[ix]
              const r_item_a_item = r_item.a[ix]
              if (l_item_a_item.b !== r_item_a_item.b) {
                const length2 = l_item_a_item.b.length
                if (length2 !== r_item_a_item.b.length) return false
                for (let ix = length2; ix-- !== 0; ) {
                  const l_item_a_item_b_item = l_item_a_item.b[ix]
                  const r_item_a_item_b_item = r_item_a_item.b[ix]
                  if (l_item_a_item_b_item !== r_item_a_item_b_item) return false
                }
              }
              if (
                (l_item_a_item.c === undefined || r_item_a_item.c == undefined) &&
                l_item_a_item.c !== r_item_a_item.c
              )
                return false
              if (l_item_a_item.c !== r_item_a_item.c) return false
            }
          }
          if (
            (l_item.d === undefined || r_item.d === undefined) &&
            l_item.d !== r_item.d
          )
            return false
          if (l_item.d !== r_item.d) {
            const length3 = l_item.d.length
            if (length3 !== r_item.d.length) return false
            for (let ix = length3; ix-- !== 0; ) {
              const l_item_d_item = l_item.d[ix]
              const r_item_d_item = r_item.d[ix]
              if (
                (l_item_d_item.e === undefined || r_item_d_item.e === undefined) &&
                l_item_d_item.e !== r_item_d_item.e
              )
                return false
              if (l_item_d_item.e !== r_item_d_item.e) {
                const length4 = l_item_d_item.e.length
                if (length4 !== r_item_d_item.e.length) return false
                for (let ix = length4; ix-- !== 0; ) {
                  const l_item_d_item_e_item = l_item_d_item.e[ix]
                  const r_item_d_item_e_item = r_item_d_item.e[ix]
                  if (l_item_d_item_e_item !== r_item_d_item_e_item) return false
                }
              }
              if (l_item_d_item.f !== r_item_d_item.f) return false
            }
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.array(v.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Array<number>, r: Array<number>) {
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
      vx.deepEqual.writeable(
        v.array(v.object({
          c: v.object({
            d: v.string(),
            e: v.array(v.string()),
          })
        })), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{ c: { d: string; e: Array<string> } }>
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item.c !== r_item.c) {
            if (l_item.c.d !== r_item.c.d) return false
            if (l_item.c.e !== r_item.c.e) {
              const length1 = l_item.c.e.length
              if (length1 !== r_item.c.e.length) return false
              for (let ix = length1; ix-- !== 0; ) {
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
      vx.deepEqual.writeable(
        v.object({
          a: v.array(v.string()),
          b: v.array(v.object({
            c: v.object({
              d: v.string(),
              e: v.array(v.string()),
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
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
          const length = l.a.length
          if (length !== r.a.length) return false
          for (let ix = length; ix-- !== 0; ) {
            const l_a_item = l.a[ix]
            const r_a_item = r.a[ix]
            if (l_a_item !== r_a_item) return false
          }
        }
        if (l.b !== r.b) {
          const length1 = l.b.length
          if (length1 !== r.b.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l_b_item = l.b[ix]
            const r_b_item = r.b[ix]
            if (l_b_item.c !== r_b_item.c) {
              if (l_b_item.c.d !== r_b_item.c.d) return false
              if (l_b_item.c.e !== r_b_item.c.e) {
                const length2 = l_b_item.c.e.length
                if (length2 !== r_b_item.c.e.length) return false
                for (let ix = length2; ix-- !== 0; ) {
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

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.tuple', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(v.tuple([]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.length !== r.length) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(v.tuple([v.string(), v.string()]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        if (l[0] !== r[0]) return false
        if (l[1] !== r[1]) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.tuple([v.number(), v.tuple([v.object({ a: v.boolean() })])])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(
        l: [number, [{ a: boolean }]],
        r: [number, [{ a: boolean }]],
      ) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        if (l[0] !== r[0] && (l[0] === l[0] || r[0] === r[0])) return false
        if (l[1] !== r[1]) {
          const length1 = l[1].length
          if (length1 !== r[1].length) return false
          if (l[1][0] !== r[1][0]) {
            if (l[1][0].a !== r[1][0].a) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(v.object({
        a: v.tuple([v.string(), v.string()]),
        b: v.optional(v.tuple([v.string(), v.optional(v.tuple([v.string()]))]))
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: [string, string]
        b?: undefined | [string, undefined | [string]]
      }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
          const length = l.a.length
          if (length !== r.a.length) return false
          if (l.a[0] !== r.a[0]) return false
          if (l.a[1] !== r.a[1]) return false
        }
        if ((l.b === undefined || r.b === undefined) && l.b !== r.b) return false
        if (l.b !== r.b) {
          const length1 = l.b.length
          if (length1 !== r.b.length) return false
          if (l.b[0] !== r.b[0]) return false
          if ((l.b[1] === undefined || r.b[1] === undefined) && l.b[1] !== r.b[1])
            return false
          if (l.b[1] !== r.b[1]) {
            const length2 = l.b[1].length
            if (length2 !== r.b[1].length) return false
            if (l.b[1][0] !== r.b[1][0]) return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.tupleWithRest', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.tupleWithRest(
          [
            v.string(),
            v.string()
          ],
          v.number()
        ), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string, ...number[]]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        if (l[0] !== r[0]) return false
        if (l[1] !== r[1]) return false
        if (length > 2) {
          for (let ix = length; ix-- !== 2; ) {
            const l_item = l[ix]
            const r_item = r[ix]
            if (l_item !== r_item && (l_item === l_item || r_item === r_item))
              return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.tupleWithRest(
          [
            v.object({ a: v.string() }),
            v.object({ b: v.string() })
          ],
          v.object({ c: v.number() })
        ), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ a: string }, { b: string }, ...{ c: number }[]]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        if (l[0] !== r[0]) {
          if (l[0].a !== r[0].a) return false
        }
        if (l[1] !== r[1]) {
          if (l[1].b !== r[1].b) return false
        }
        if (length > 2) {
          for (let ix = length; ix-- !== 2; ) {
            const l_item = l[ix]
            const r_item = r[ix]
            if (
              l_item.c !== r_item.c &&
              (l_item.c === l_item.c || r_item.c === r_item.c)
            )
              return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.object', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(v.object({}))
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: {}, r: {}) {
        if (l === r) return true
        if (Object.keys(l).length !== Object.keys(r).length) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(v.object({
        street1: v.string(),
        street2: v.optional(v.string()),
        city: v.string(),
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: undefined | string; city: string }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.street1 !== r.street1) return false
        if (
          (l.street2 === undefined || r.street2 == undefined) &&
          l.street2 !== r.street2
        )
          return false
        if (l.street2 !== r.street2) return false
        if (l.city !== r.city) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.object({
          a: v.object({
            b: v.string(),
            c: v.string(),
          }),
          d: v.optional(v.string()),
          e: v.object({
            f: v.string(),
            g: v.optional(
              v.object({
                h: v.string(),
                i: v.string(),
              })
            )
          })
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: { b: string; c: string }
        d?: undefined | string
        e: { f: string; g?: undefined | { h: string; i: string } }
      }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
          if (l.a.b !== r.a.b) return false
          if (l.a.c !== r.a.c) return false
        }
        if ((l.d === undefined || r.d == undefined) && l.d !== r.d) return false
        if (l.d !== r.d) return false
        if (l.e !== r.e) {
          if (l.e.f !== r.e.f) return false
          if ((l.e.g === undefined || r.e.g === undefined) && l.e.g !== r.e.g)
            return false
          if (l.e.g !== r.e.g) {
            if (l.e.g.h !== r.e.g.h) return false
            if (l.e.g.i !== r.e.g.i) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(v.object({
        b: v.array(v.string()),
        '0b': v.array(v.string()),
        '00b': v.array(v.string()),
        '-00b': v.array(v.string()),
        '00b0': v.array(v.string()),
        '--00b0': v.array(v.string()),
        '-^00b0': v.array(v.string()),
        '': v.array(v.string()),
        '_': v.array(v.string()),
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
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.b !== r.b) {
          const length = l.b.length
          if (length !== r.b.length) return false
          for (let ix = length; ix-- !== 0; ) {
            const l_b_item = l.b[ix]
            const r_b_item = r.b[ix]
            if (l_b_item !== r_b_item) return false
          }
        }
        if (l["0b"] !== r["0b"]) {
          const length1 = l["0b"].length
          if (length1 !== r["0b"].length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l__0b___item = l["0b"][ix]
            const r__0b___item = r["0b"][ix]
            if (l__0b___item !== r__0b___item) return false
          }
        }
        if (l["00b"] !== r["00b"]) {
          const length2 = l["00b"].length
          if (length2 !== r["00b"].length) return false
          for (let ix = length2; ix-- !== 0; ) {
            const l__00b___item = l["00b"][ix]
            const r__00b___item = r["00b"][ix]
            if (l__00b___item !== r__00b___item) return false
          }
        }
        if (l["-00b"] !== r["-00b"]) {
          const length3 = l["-00b"].length
          if (length3 !== r["-00b"].length) return false
          for (let ix = length3; ix-- !== 0; ) {
            const l___00b___item = l["-00b"][ix]
            const r___00b___item = r["-00b"][ix]
            if (l___00b___item !== r___00b___item) return false
          }
        }
        if (l["00b0"] !== r["00b0"]) {
          const length4 = l["00b0"].length
          if (length4 !== r["00b0"].length) return false
          for (let ix = length4; ix-- !== 0; ) {
            const l__00b0___item = l["00b0"][ix]
            const r__00b0___item = r["00b0"][ix]
            if (l__00b0___item !== r__00b0___item) return false
          }
        }
        if (l["--00b0"] !== r["--00b0"]) {
          const length5 = l["--00b0"].length
          if (length5 !== r["--00b0"].length) return false
          for (let ix = length5; ix-- !== 0; ) {
            const l____00b0___item = l["--00b0"][ix]
            const r____00b0___item = r["--00b0"][ix]
            if (l____00b0___item !== r____00b0___item) return false
          }
        }
        if (l["-^00b0"] !== r["-^00b0"]) {
          const length6 = l["-^00b0"].length
          if (length6 !== r["-^00b0"].length) return false
          for (let ix = length6; ix-- !== 0; ) {
            const l____00b0__1_item = l["-^00b0"][ix]
            const r____00b0__1_item = r["-^00b0"][ix]
            if (l____00b0__1_item !== r____00b0__1_item) return false
          }
        }
        if (l[""] !== r[""]) {
          const length7 = l[""].length
          if (length7 !== r[""].length) return false
          for (let ix = length7; ix-- !== 0; ) {
            const l_____item = l[""][ix]
            const r_____item = r[""][ix]
            if (l_____item !== r_____item) return false
          }
        }
        if (l._ !== r._) {
          const length8 = l._.length
          if (length8 !== r._.length) return false
          for (let ix = length8; ix-- !== 0; ) {
            const l___item = l._[ix]
            const r___item = r._[ix]
            if (l___item !== r___item) return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.objectWithRest', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.objectWithRest(
          {
            street1: v.string(),
            street2: v.optional(v.string()),
            city: v.string(),
          },
          v.boolean()
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: undefined | string; city: string } & {
        [x: string]: boolean
      }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const l_keys = Object.keys(l)
        const length = l_keys.length
        if (length !== Object.keys(r).length) return false
        if (l.street1 !== r.street1) return false
        if (
          (l.street2 === undefined || r.street2 == undefined) &&
          l.street2 !== r.street2
        )
          return false
        if (l.street2 !== r.street2) return false
        if (l.city !== r.city) return false
        for (let ix = length; ix-- !== 0; ) {
          const key = l_keys[ix]
          if (key === "street1" || key === "street2" || key === "city") continue
          const l_value = l[key]
          const r_value = r[key]
          if (l_value !== r_value) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.objectWithRest(
          {
            b: v.array(v.string()),
            '0b': v.array(v.string()),
            '00b': v.array(v.string()),
            '-00b': v.array(v.string()),
            '00b0': v.array(v.string()),
            '--00b0': v.array(v.string()),
            '-^00b0': v.array(v.string()),
            '': v.array(v.string()),
            '_': v.array(v.string()),
          },
          v.array(v.array(v.string()))
        ),
        { typeName: 'Type' }
      )
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
      } & { [x: string]: Array<Array<string>> }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const l_keys = Object.keys(l)
        const length = l_keys.length
        if (length !== Object.keys(r).length) return false
        if (l.b !== r.b) {
          const length3 = l.b.length
          if (length3 !== r.b.length) return false
          for (let ix = length3; ix-- !== 0; ) {
            const l_b_item = l.b[ix]
            const r_b_item = r.b[ix]
            if (l_b_item !== r_b_item) return false
          }
        }
        if (l["0b"] !== r["0b"]) {
          const length4 = l["0b"].length
          if (length4 !== r["0b"].length) return false
          for (let ix = length4; ix-- !== 0; ) {
            const l__0b___item = l["0b"][ix]
            const r__0b___item = r["0b"][ix]
            if (l__0b___item !== r__0b___item) return false
          }
        }
        if (l["00b"] !== r["00b"]) {
          const length5 = l["00b"].length
          if (length5 !== r["00b"].length) return false
          for (let ix = length5; ix-- !== 0; ) {
            const l__00b___item = l["00b"][ix]
            const r__00b___item = r["00b"][ix]
            if (l__00b___item !== r__00b___item) return false
          }
        }
        if (l["-00b"] !== r["-00b"]) {
          const length6 = l["-00b"].length
          if (length6 !== r["-00b"].length) return false
          for (let ix = length6; ix-- !== 0; ) {
            const l___00b___item = l["-00b"][ix]
            const r___00b___item = r["-00b"][ix]
            if (l___00b___item !== r___00b___item) return false
          }
        }
        if (l["00b0"] !== r["00b0"]) {
          const length7 = l["00b0"].length
          if (length7 !== r["00b0"].length) return false
          for (let ix = length7; ix-- !== 0; ) {
            const l__00b0___item = l["00b0"][ix]
            const r__00b0___item = r["00b0"][ix]
            if (l__00b0___item !== r__00b0___item) return false
          }
        }
        if (l["--00b0"] !== r["--00b0"]) {
          const length8 = l["--00b0"].length
          if (length8 !== r["--00b0"].length) return false
          for (let ix = length8; ix-- !== 0; ) {
            const l____00b0___item = l["--00b0"][ix]
            const r____00b0___item = r["--00b0"][ix]
            if (l____00b0___item !== r____00b0___item) return false
          }
        }
        if (l["-^00b0"] !== r["-^00b0"]) {
          const length9 = l["-^00b0"].length
          if (length9 !== r["-^00b0"].length) return false
          for (let ix = length9; ix-- !== 0; ) {
            const l____00b0__1_item = l["-^00b0"][ix]
            const r____00b0__1_item = r["-^00b0"][ix]
            if (l____00b0__1_item !== r____00b0__1_item) return false
          }
        }
        if (l[""] !== r[""]) {
          const length10 = l[""].length
          if (length10 !== r[""].length) return false
          for (let ix = length10; ix-- !== 0; ) {
            const l_____item = l[""][ix]
            const r_____item = r[""][ix]
            if (l_____item !== r_____item) return false
          }
        }
        if (l._ !== r._) {
          const length11 = l._.length
          if (length11 !== r._.length) return false
          for (let ix = length11; ix-- !== 0; ) {
            const l___item = l._[ix]
            const r___item = r._[ix]
            if (l___item !== r___item) return false
          }
        }
        for (let ix = length; ix-- !== 0; ) {
          const key = l_keys[ix]
          if (
            key === "b" ||
            key === "0b" ||
            key === "00b" ||
            key === "-00b" ||
            key === "00b0" ||
            key === "--00b0" ||
            key === "-^00b0" ||
            key === "" ||
            key === "_"
          )
            continue
          const l_value = l[key]
          const r_value = r[key]
          const length1 = l_value?.length
          if (length1 !== r_value?.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l_value1_item = l_value[ix]
            const r_value1_item = r_value[ix]
            const length2 = l_value1_item?.length
            if (length2 !== r_value1_item?.length) return false
            for (let ix = length2; ix-- !== 0; ) {
              const l_value__item_item = l_value1_item[ix]
              const r_value__item_item = r_value1_item[ix]
              if (l_value__item_item !== r_value__item_item) return false
            }
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.variant', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.variant(
          "tag",
          [
            v.object({ tag: v.literal('A'), onA: v.boolean() }),
            v.object({ tag: v.literal('B'), onB: v.boolean() }),
          ]
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "A"; onA: boolean } | { tag: "B"; onB: boolean }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (l.tag === "A") {
          if (l.tag !== r.tag) return false
          if (l.onA !== r.onA) return false
          satisfied = true
        }
        if (l.tag === "B") {
          if (l.tag !== r.tag) return false
          if (l.onB !== r.onB) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.union', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: never, r: never) {
        if (l === r) return true
        let satisfied = false
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.union([
          v.object({ tag: v.literal('ABC'), abc: v.number() }),
          v.object({ tag: v.literal('DEF'), def: v.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: bigint }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "ABC" &&
            Number.isFinite(value.abc)
          )
        }
        if (check(l) && check(r)) {
          if (l.tag !== r.tag) return false
          if (l.abc !== r.abc && (l.abc === l.abc || r.abc === r.abc)) return false
          satisfied = true
        }
        function check1(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "DEF" &&
            typeof value.def === "bigint"
          )
        }
        if (check1(l) && check1(r)) {
          if (l.tag !== r.tag) return false
          if (l.def !== r.def) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.union([
          v.object({ tag: v.literal('NON_DISCRIMINANT'), abc: v.number() }),
          v.object({ tag: v.literal('NON_DISCRIMINANT'), def: v.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: "NON_DISCRIMINANT"; abc: number }
        | { tag: "NON_DISCRIMINANT"; def: bigint }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "NON_DISCRIMINANT" &&
            Number.isFinite(value.abc)
          )
        }
        if (check(l) && check(r)) {
          if (l.tag !== r.tag) return false
          if (l.abc !== r.abc && (l.abc === l.abc || r.abc === r.abc)) return false
          satisfied = true
        }
        function check1(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "NON_DISCRIMINANT" &&
            typeof value.def === "bigint"
          )
        }
        if (check1(l) && check1(r)) {
          if (l.tag !== r.tag) return false
          if (l.def !== r.def) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.union([
          v.object({
            tag1: v.literal('ABC'),
            abc: v.union([
              v.object({
                tag2: v.literal('ABC_JKL'),
                jkl: v.union([
                  v.object({
                    tag3: v.literal('ABC_JKL_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              v.object({
                tag2: v.literal('ABC_MNO'),
                mno: v.union([
                  v.object({
                    tag3: v.literal('ABC_MNO_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          v.object({
            tag1: v.literal('DEF'),
            def: v.union([
              v.object({
                tag2: v.literal('DEF_PQR'),
                pqr: v.union([
                  v.object({
                    tag3: v.literal('DEF_PQR_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              v.object({
                tag2: v.literal('DEF_STU'),
                stu: v.union([
                  v.object({
                    tag3: v.literal('DEF_STU_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('DEF_STU_TWO'),
                  }),
                ])
              }),
            ])
          }),
        ]),
        { typeName: 'Type' }
      ),
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | {
            tag1: "ABC"
            abc:
              | {
                  tag2: "ABC_JKL"
                  jkl: { tag3: "ABC_JKL_ONE" } | { tag3: "ABC_JKL_TWO" }
                }
              | {
                  tag2: "ABC_MNO"
                  mno: { tag3: "ABC_MNO_ONE" } | { tag3: "ABC_MNO_TWO" }
                }
          }
        | {
            tag1: "DEF"
            def:
              | {
                  tag2: "DEF_PQR"
                  pqr: { tag3: "DEF_PQR_ONE" } | { tag3: "DEF_PQR_TWO" }
                }
              | {
                  tag2: "DEF_STU"
                  stu: { tag3: "DEF_STU_ONE" } | { tag3: "DEF_STU_TWO" }
                }
          }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag1 === "ABC" &&
            ((!!value.abc &&
              typeof value.abc === "object" &&
              value.abc.tag2 === "ABC_JKL" &&
              ((!!value.abc.jkl &&
                typeof value.abc.jkl === "object" &&
                value.abc.jkl.tag3 === "ABC_JKL_ONE") ||
                (!!value.abc.jkl &&
                  typeof value.abc.jkl === "object" &&
                  value.abc.jkl.tag3 === "ABC_JKL_TWO"))) ||
              (!!value.abc &&
                typeof value.abc === "object" &&
                value.abc.tag2 === "ABC_MNO" &&
                ((!!value.abc.mno &&
                  typeof value.abc.mno === "object" &&
                  value.abc.mno.tag3 === "ABC_MNO_ONE") ||
                  (!!value.abc.mno &&
                    typeof value.abc.mno === "object" &&
                    value.abc.mno.tag3 === "ABC_MNO_TWO"))))
          )
        }
        if (check(l) && check(r)) {
          if (l.tag1 !== r.tag1) return false
          let satisfied1 = false
          function check1(value) {
            return (
              !!value &&
              typeof value === "object" &&
              value.tag2 === "ABC_JKL" &&
              ((!!value.jkl &&
                typeof value.jkl === "object" &&
                value.jkl.tag3 === "ABC_JKL_ONE") ||
                (!!value.jkl &&
                  typeof value.jkl === "object" &&
                  value.jkl.tag3 === "ABC_JKL_TWO"))
            )
          }
          if (check1(l.abc) && check1(r.abc)) {
            if (l.abc.tag2 !== r.abc.tag2) return false
            let satisfied2 = false
            function check2(value) {
              return (
                !!value && typeof value === "object" && value.tag3 === "ABC_JKL_ONE"
              )
            }
            if (check2(l.abc.jkl) && check2(r.abc.jkl)) {
              if (l.abc.jkl.tag3 !== r.abc.jkl.tag3) return false
              satisfied2 = true
            }
            function check3(value) {
              return (
                !!value && typeof value === "object" && value.tag3 === "ABC_JKL_TWO"
              )
            }
            if (check3(l.abc.jkl) && check3(r.abc.jkl)) {
              if (l.abc.jkl.tag3 !== r.abc.jkl.tag3) return false
              satisfied2 = true
            }
            if (!satisfied2) return false
            satisfied1 = true
          }
          function check4(value) {
            return (
              !!value &&
              typeof value === "object" &&
              value.tag2 === "ABC_MNO" &&
              ((!!value.mno &&
                typeof value.mno === "object" &&
                value.mno.tag3 === "ABC_MNO_ONE") ||
                (!!value.mno &&
                  typeof value.mno === "object" &&
                  value.mno.tag3 === "ABC_MNO_TWO"))
            )
          }
          if (check4(l.abc) && check4(r.abc)) {
            if (l.abc.tag2 !== r.abc.tag2) return false
            let satisfied3 = false
            function check5(value) {
              return (
                !!value && typeof value === "object" && value.tag3 === "ABC_MNO_ONE"
              )
            }
            if (check5(l.abc.mno) && check5(r.abc.mno)) {
              if (l.abc.mno.tag3 !== r.abc.mno.tag3) return false
              satisfied3 = true
            }
            function check6(value) {
              return (
                !!value && typeof value === "object" && value.tag3 === "ABC_MNO_TWO"
              )
            }
            if (check6(l.abc.mno) && check6(r.abc.mno)) {
              if (l.abc.mno.tag3 !== r.abc.mno.tag3) return false
              satisfied3 = true
            }
            if (!satisfied3) return false
            satisfied1 = true
          }
          if (!satisfied1) return false
          satisfied = true
        }
        function check7(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag1 === "DEF" &&
            ((!!value.def &&
              typeof value.def === "object" &&
              value.def.tag2 === "DEF_PQR" &&
              ((!!value.def.pqr &&
                typeof value.def.pqr === "object" &&
                value.def.pqr.tag3 === "DEF_PQR_ONE") ||
                (!!value.def.pqr &&
                  typeof value.def.pqr === "object" &&
                  value.def.pqr.tag3 === "DEF_PQR_TWO"))) ||
              (!!value.def &&
                typeof value.def === "object" &&
                value.def.tag2 === "DEF_STU" &&
                ((!!value.def.stu &&
                  typeof value.def.stu === "object" &&
                  value.def.stu.tag3 === "DEF_STU_ONE") ||
                  (!!value.def.stu &&
                    typeof value.def.stu === "object" &&
                    value.def.stu.tag3 === "DEF_STU_TWO"))))
          )
        }
        if (check7(l) && check7(r)) {
          if (l.tag1 !== r.tag1) return false
          let satisfied4 = false
          function check8(value) {
            return (
              !!value &&
              typeof value === "object" &&
              value.tag2 === "DEF_PQR" &&
              ((!!value.pqr &&
                typeof value.pqr === "object" &&
                value.pqr.tag3 === "DEF_PQR_ONE") ||
                (!!value.pqr &&
                  typeof value.pqr === "object" &&
                  value.pqr.tag3 === "DEF_PQR_TWO"))
            )
          }
          if (check8(l.def) && check8(r.def)) {
            if (l.def.tag2 !== r.def.tag2) return false
            let satisfied5 = false
            function check9(value) {
              return (
                !!value && typeof value === "object" && value.tag3 === "DEF_PQR_ONE"
              )
            }
            if (check9(l.def.pqr) && check9(r.def.pqr)) {
              if (l.def.pqr.tag3 !== r.def.pqr.tag3) return false
              satisfied5 = true
            }
            function check10(value) {
              return (
                !!value && typeof value === "object" && value.tag3 === "DEF_PQR_TWO"
              )
            }
            if (check10(l.def.pqr) && check10(r.def.pqr)) {
              if (l.def.pqr.tag3 !== r.def.pqr.tag3) return false
              satisfied5 = true
            }
            if (!satisfied5) return false
            satisfied4 = true
          }
          function check11(value) {
            return (
              !!value &&
              typeof value === "object" &&
              value.tag2 === "DEF_STU" &&
              ((!!value.stu &&
                typeof value.stu === "object" &&
                value.stu.tag3 === "DEF_STU_ONE") ||
                (!!value.stu &&
                  typeof value.stu === "object" &&
                  value.stu.tag3 === "DEF_STU_TWO"))
            )
          }
          if (check11(l.def) && check11(r.def)) {
            if (l.def.tag2 !== r.def.tag2) return false
            let satisfied6 = false
            function check12(value) {
              return (
                !!value && typeof value === "object" && value.tag3 === "DEF_STU_ONE"
              )
            }
            if (check12(l.def.stu) && check12(r.def.stu)) {
              if (l.def.stu.tag3 !== r.def.stu.tag3) return false
              satisfied6 = true
            }
            function check13(value) {
              return (
                !!value && typeof value === "object" && value.tag3 === "DEF_STU_TWO"
              )
            }
            if (check13(l.def.stu) && check13(r.def.stu)) {
              if (l.def.stu.tag3 !== r.def.stu.tag3) return false
              satisfied6 = true
            }
            if (!satisfied6) return false
            satisfied4 = true
          }
          if (!satisfied4) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.union([
          v.object({
            tag: v.literal('ABC'),
            abc: v.union([
              v.object({
                tag: v.literal('ABC_JKL'),
                jkl: v.union([
                  v.object({
                    tag: v.literal('ABC_JKL_ONE'),
                  }),
                  v.object({
                    tag: v.literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              v.object({
                tag: v.literal('ABC_MNO'),
                mno: v.union([
                  v.object({
                    tag: v.literal('ABC_MNO_ONE'),
                  }),
                  v.object({
                    tag: v.literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          v.object({
            tag: v.literal('DEF'),
            def: v.union([
              v.object({
                tag: v.literal('DEF_PQR'),
                pqr: v.union([
                  v.object({
                    tag: v.literal('DEF_PQR_ONE'),
                  }),
                  v.object({
                    tag: v.literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              v.object({
                tag: v.literal('DEF_STU'),
                stu: v.union([
                  v.object({
                    tag: v.literal('DEF_STU_ONE'),
                  }),
                  v.object({
                    tag: v.literal('DEF_STU_TWO'),
                  }),
                ])
              }),
            ])
          }),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | {
            tag: "ABC"
            abc:
              | {
                  tag: "ABC_JKL"
                  jkl: { tag: "ABC_JKL_ONE" } | { tag: "ABC_JKL_TWO" }
                }
              | {
                  tag: "ABC_MNO"
                  mno: { tag: "ABC_MNO_ONE" } | { tag: "ABC_MNO_TWO" }
                }
          }
        | {
            tag: "DEF"
            def:
              | {
                  tag: "DEF_PQR"
                  pqr: { tag: "DEF_PQR_ONE" } | { tag: "DEF_PQR_TWO" }
                }
              | {
                  tag: "DEF_STU"
                  stu: { tag: "DEF_STU_ONE" } | { tag: "DEF_STU_TWO" }
                }
          }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "ABC" &&
            ((!!value.abc &&
              typeof value.abc === "object" &&
              value.abc.tag === "ABC_JKL" &&
              ((!!value.abc.jkl &&
                typeof value.abc.jkl === "object" &&
                value.abc.jkl.tag === "ABC_JKL_ONE") ||
                (!!value.abc.jkl &&
                  typeof value.abc.jkl === "object" &&
                  value.abc.jkl.tag === "ABC_JKL_TWO"))) ||
              (!!value.abc &&
                typeof value.abc === "object" &&
                value.abc.tag === "ABC_MNO" &&
                ((!!value.abc.mno &&
                  typeof value.abc.mno === "object" &&
                  value.abc.mno.tag === "ABC_MNO_ONE") ||
                  (!!value.abc.mno &&
                    typeof value.abc.mno === "object" &&
                    value.abc.mno.tag === "ABC_MNO_TWO"))))
          )
        }
        if (check(l) && check(r)) {
          if (l.tag !== r.tag) return false
          let satisfied1 = false
          function check1(value) {
            return (
              !!value &&
              typeof value === "object" &&
              value.tag === "ABC_JKL" &&
              ((!!value.jkl &&
                typeof value.jkl === "object" &&
                value.jkl.tag === "ABC_JKL_ONE") ||
                (!!value.jkl &&
                  typeof value.jkl === "object" &&
                  value.jkl.tag === "ABC_JKL_TWO"))
            )
          }
          if (check1(l.abc) && check1(r.abc)) {
            if (l.abc.tag !== r.abc.tag) return false
            let satisfied2 = false
            function check2(value) {
              return (
                !!value && typeof value === "object" && value.tag === "ABC_JKL_ONE"
              )
            }
            if (check2(l.abc.jkl) && check2(r.abc.jkl)) {
              if (l.abc.jkl.tag !== r.abc.jkl.tag) return false
              satisfied2 = true
            }
            function check3(value) {
              return (
                !!value && typeof value === "object" && value.tag === "ABC_JKL_TWO"
              )
            }
            if (check3(l.abc.jkl) && check3(r.abc.jkl)) {
              if (l.abc.jkl.tag !== r.abc.jkl.tag) return false
              satisfied2 = true
            }
            if (!satisfied2) return false
            satisfied1 = true
          }
          function check4(value) {
            return (
              !!value &&
              typeof value === "object" &&
              value.tag === "ABC_MNO" &&
              ((!!value.mno &&
                typeof value.mno === "object" &&
                value.mno.tag === "ABC_MNO_ONE") ||
                (!!value.mno &&
                  typeof value.mno === "object" &&
                  value.mno.tag === "ABC_MNO_TWO"))
            )
          }
          if (check4(l.abc) && check4(r.abc)) {
            if (l.abc.tag !== r.abc.tag) return false
            let satisfied3 = false
            function check5(value) {
              return (
                !!value && typeof value === "object" && value.tag === "ABC_MNO_ONE"
              )
            }
            if (check5(l.abc.mno) && check5(r.abc.mno)) {
              if (l.abc.mno.tag !== r.abc.mno.tag) return false
              satisfied3 = true
            }
            function check6(value) {
              return (
                !!value && typeof value === "object" && value.tag === "ABC_MNO_TWO"
              )
            }
            if (check6(l.abc.mno) && check6(r.abc.mno)) {
              if (l.abc.mno.tag !== r.abc.mno.tag) return false
              satisfied3 = true
            }
            if (!satisfied3) return false
            satisfied1 = true
          }
          if (!satisfied1) return false
          satisfied = true
        }
        function check7(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "DEF" &&
            ((!!value.def &&
              typeof value.def === "object" &&
              value.def.tag === "DEF_PQR" &&
              ((!!value.def.pqr &&
                typeof value.def.pqr === "object" &&
                value.def.pqr.tag === "DEF_PQR_ONE") ||
                (!!value.def.pqr &&
                  typeof value.def.pqr === "object" &&
                  value.def.pqr.tag === "DEF_PQR_TWO"))) ||
              (!!value.def &&
                typeof value.def === "object" &&
                value.def.tag === "DEF_STU" &&
                ((!!value.def.stu &&
                  typeof value.def.stu === "object" &&
                  value.def.stu.tag === "DEF_STU_ONE") ||
                  (!!value.def.stu &&
                    typeof value.def.stu === "object" &&
                    value.def.stu.tag === "DEF_STU_TWO"))))
          )
        }
        if (check7(l) && check7(r)) {
          if (l.tag !== r.tag) return false
          let satisfied4 = false
          function check8(value) {
            return (
              !!value &&
              typeof value === "object" &&
              value.tag === "DEF_PQR" &&
              ((!!value.pqr &&
                typeof value.pqr === "object" &&
                value.pqr.tag === "DEF_PQR_ONE") ||
                (!!value.pqr &&
                  typeof value.pqr === "object" &&
                  value.pqr.tag === "DEF_PQR_TWO"))
            )
          }
          if (check8(l.def) && check8(r.def)) {
            if (l.def.tag !== r.def.tag) return false
            let satisfied5 = false
            function check9(value) {
              return (
                !!value && typeof value === "object" && value.tag === "DEF_PQR_ONE"
              )
            }
            if (check9(l.def.pqr) && check9(r.def.pqr)) {
              if (l.def.pqr.tag !== r.def.pqr.tag) return false
              satisfied5 = true
            }
            function check10(value) {
              return (
                !!value && typeof value === "object" && value.tag === "DEF_PQR_TWO"
              )
            }
            if (check10(l.def.pqr) && check10(r.def.pqr)) {
              if (l.def.pqr.tag !== r.def.pqr.tag) return false
              satisfied5 = true
            }
            if (!satisfied5) return false
            satisfied4 = true
          }
          function check11(value) {
            return (
              !!value &&
              typeof value === "object" &&
              value.tag === "DEF_STU" &&
              ((!!value.stu &&
                typeof value.stu === "object" &&
                value.stu.tag === "DEF_STU_ONE") ||
                (!!value.stu &&
                  typeof value.stu === "object" &&
                  value.stu.tag === "DEF_STU_TWO"))
            )
          }
          if (check11(l.def) && check11(r.def)) {
            if (l.def.tag !== r.def.tag) return false
            let satisfied6 = false
            function check12(value) {
              return (
                !!value && typeof value === "object" && value.tag === "DEF_STU_ONE"
              )
            }
            if (check12(l.def.stu) && check12(r.def.stu)) {
              if (l.def.stu.tag !== r.def.stu.tag) return false
              satisfied6 = true
            }
            function check13(value) {
              return (
                !!value && typeof value === "object" && value.tag === "DEF_STU_TWO"
              )
            }
            if (check13(l.def.stu) && check13(r.def.stu)) {
              if (l.def.stu.tag !== r.def.stu.tag) return false
              satisfied6 = true
            }
            if (!satisfied6) return false
            satisfied4 = true
          }
          if (!satisfied4) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.union([v.object({ tag: v.literal('A') }), v.object({ tag: v.literal('B') }), v.object({ tag: v.array(v.string()) })]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "A" } | { tag: "B" } | { tag: Array<string> }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return !!value && typeof value === "object" && value.tag === "A"
        }
        if (check(l) && check(r)) {
          if (l.tag !== r.tag) return false
          satisfied = true
        }
        function check1(value) {
          return !!value && typeof value === "object" && value.tag === "B"
        }
        if (check1(l) && check1(r)) {
          if (l.tag !== r.tag) return false
          satisfied = true
        }
        function check2(value) {
          return (
            !!value &&
            typeof value === "object" &&
            Array.isArray(value.tag) &&
            value.tag.every((value) => typeof value === "string")
          )
        }
        if (check2(l) && check2(r)) {
          if (l.tag !== r.tag) {
            const length = l.tag.length
            if (length !== r.tag.length) return false
            for (let ix = length; ix-- !== 0; ) {
              const l_tag_item = l.tag[ix]
              const r_tag_item = r.tag[ix]
              if (l_tag_item !== r_tag_item) return false
            }
          }
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.union([v.number(), v.array(v.string())])
      ))).toMatchInlineSnapshot
      (`
        "function deepEqual(l: number | Array<string>, r: number | Array<string>) {
          if (Object.is(l, r)) return true
          let satisfied = false
          if (typeof l === "number" && typeof r === "number") {
            if (l !== r && (l === l || r === r)) return false
            satisfied = true
          }
          function check(value) {
            return (
              Array.isArray(value) && value.every((value) => typeof value === "string")
            )
          }
          if (check(l) && check(r)) {
            const length = l.length
            if (length !== r.length) return false
            for (let ix = length; ix-- !== 0; ) {
              const l_item = l[ix]
              const r_item = r[ix]
              if (l_item !== r_item) return false
            }
            satisfied = true
          }
          if (!satisfied) return false
          return true
        }
        "
      `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.union([
          v.union([
            v.object({ abc: v.string() }),
            v.object({ def: v.string() })
          ]),
          v.union([
            v.object({ ghi: v.string() }),
            v.object({ jkl: v.string() })
          ])
        ]), {
        typeName: 'Type'
      }
      ))).toMatchInlineSnapshot
      (`
        "type Type =
          | ({ abc: string } | { def: string })
          | ({ ghi: string } | { jkl: string })
        function deepEqual(l: Type, r: Type) {
          if (l === r) return true
          let satisfied = false
          function check(value) {
            return (
              (!!value && typeof value === "object" && typeof value.abc === "string") ||
              (!!value && typeof value === "object" && typeof value.def === "string")
            )
          }
          if (check(l) && check(r)) {
            let satisfied1 = false
            function check1(value) {
              return (
                !!value && typeof value === "object" && typeof value.abc === "string"
              )
            }
            if (check1(l) && check1(r)) {
              if (l.abc !== r.abc) return false
              satisfied1 = true
            }
            function check2(value) {
              return (
                !!value && typeof value === "object" && typeof value.def === "string"
              )
            }
            if (check2(l) && check2(r)) {
              if (l.def !== r.def) return false
              satisfied1 = true
            }
            if (!satisfied1) return false
            satisfied = true
          }
          function check3(value) {
            return (
              (!!value && typeof value === "object" && typeof value.ghi === "string") ||
              (!!value && typeof value === "object" && typeof value.jkl === "string")
            )
          }
          if (check3(l) && check3(r)) {
            let satisfied2 = false
            function check4(value) {
              return (
                !!value && typeof value === "object" && typeof value.ghi === "string"
              )
            }
            if (check4(l) && check4(r)) {
              if (l.ghi !== r.ghi) return false
              satisfied2 = true
            }
            function check5(value) {
              return (
                !!value && typeof value === "object" && typeof value.jkl === "string"
              )
            }
            if (check5(l) && check5(r)) {
              if (l.jkl !== r.jkl) return false
              satisfied2 = true
            }
            if (!satisfied2) return false
            satisfied = true
          }
          if (!satisfied) return false
          return true
        }
        "
      `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.intersect', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.intersect([
          v.object({
            abc: v.string()
          }),
          v.object({
            def: v.string()
          })
        ]), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string } & { def: string }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.abc !== r.abc) return false
        if (l.def !== r.def) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.intersect([
          v.object({
            abc: v.string(),
            def: v.object({
              ghi: v.string(),
              jkl: v.string()
            })
          }),
          v.object({
            mno: v.string(),
            pqr: v.object({
              stu: v.string(),
              vwx: v.string(),
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
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.abc !== r.abc) return false
        if (l.def !== r.def) {
          if (l.def.ghi !== r.def.ghi) return false
          if (l.def.jkl !== r.def.jkl) return false
        }
        if (l.mno !== r.mno) return false
        if (l.pqr !== r.pqr) {
          if (l.pqr.stu !== r.pqr.stu) return false
          if (l.pqr.vwx !== r.pqr.vwx) return false
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.writeable❳: v.record', () => {
    vi.expect.soft(format(
      vx.deepEqual.writeable(
        v.record(v.string(), v.record(v.string(), v.string())), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, string>>
      function deepEqual(l: Type, r: Type) {
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
      vx.deepEqual.writeable(
        v.object({
          a: v.record(v.string(), v.string()),
          b: v.record(
            v.string(),
            v.object({
              c: v.object({
                d: v.string(),
                e: v.record(
                  v.string(),
                  v.array(v.string()),
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
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
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
        }
        if (l.b !== r.b) {
          const l_b_keys = Object.keys(l.b)
          const r_b_keys = Object.keys(r.b)
          const length1 = l_b_keys.length
          if (length1 !== r_b_keys.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const k = l_b_keys[ix]
            if (!r_b_keys.includes(k)) return false
            const l_b_k_ = l.b[k]
            const r_b_k_ = r.b[k]
            if (l_b_k_.c !== r_b_k_.c) {
              if (l_b_k_.c.d !== r_b_k_.c.d) return false
              if (l_b_k_.c.e !== r_b_k_.c.e) {
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
            }
          }
        }
        return true
      }
      "
    `)
  })

})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: vx.deepEqual', () => {
  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.never', () => {
    /////////////////
    const equals = vx.deepEqual(v.never())
    //    success
    vi.expect.soft(equals(undefined as never, undefined as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(undefined as never, null as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.void', () => {
    /////////////////
    const equals = vx.deepEqual(v.void())
    //    success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(void 0, null as never)).toBeFalsy()
    vi.expect.soft(equals(null as never, void 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.any', () => {
    /////////////////
    const equals = vx.deepEqual(v.any())
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.unknown', () => {
    /////////////////
    const equals = vx.deepEqual(v.unknown())
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.null', () => {
    /////////////////
    const equals = vx.deepEqual(v.null())
    //    success
    vi.expect.soft(equals(null, null)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(null, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, null)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.nan', () => {
    /////////////////
    const equals = vx.deepEqual(v.nan())
    //    success
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.symbol', () => {
    /////////////////
    const equals = vx.deepEqual(v.symbol())
    //    success
    vi.expect.soft(equals(symbol, symbol)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(symbol, Symbol())).toBeFalsy()
    vi.expect.soft(equals(Symbol(), symbol)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.boolean', () => {
    /////////////////
    const equals = vx.deepEqual(v.boolean())
    //    success
    vi.expect.soft(equals(false, false)).toBeTruthy()
    vi.expect.soft(equals(true, true)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.int', () => {
    /////////////////
    const equals = vx.deepEqual(
      v.pipe(
        v.number(),
        v.integer(),
      )
    )
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.bigint', () => {
    /////////////////
    const equals = vx.deepEqual(v.bigint())
    //    success
    vi.expect.soft(equals(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals(1n, 1n)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals(0n, 1n)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.number', () => {
    /////////////////
    const equals = vx.deepEqual(v.number())
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.string', () => {
    /////////////////
    const equals = vx.deepEqual(v.string())
    //    success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.literal', () => {
    /////////////////
    const equals = vx.deepEqual(v.literal(1))
    //    success
    vi.expect.soft(equals(1, 1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1, 2 as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.enum', () => {
    /////////////////
    const equals = vx.deepEqual(v.enum({ A: '1', B: '2' }))
    //    success
    vi.expect.soft(equals('1', '1')).toBeTruthy()
    vi.expect.soft(equals('2', '2')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('1', '2')).toBeFalsy()
    vi.expect.soft(equals('2', '1')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.date', () => {
    /////////////////
    const equals = vx.deepEqual(v.date())
    //    success
    vi.expect.soft(equals(date, date)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(date, new Date())).toBeFalsy()
    vi.expect.soft(equals(new Date(), date)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.optional', () => {
    /////////////////
    const equals = vx.deepEqual(v.optional(v.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(undefined, undefined)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, undefined)).toBeFalsy()
    vi.expect.soft(equals(undefined, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.nonOptional', () => {
    /////////////////
    const equals = vx.deepEqual(v.nonOptional(v.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.nullable', () => {
    /////////////////
    const equals = vx.deepEqual(v.nullable(v.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, null)).toBeFalsy()
    vi.expect.soft(equals(null, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.array', () => {
    /////////////////
    const equals_01 = vx.deepEqual(
      v.array(
        v.pipe(
          v.number(),
          v.integer(),
        )
      )
    )
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.set', () => {
    /////////////////
    const equals_01 = vx.deepEqual(
      v.set(
        v.pipe(
          v.number(),
          v.integer(),
        )
      )
    )
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.map', () => {
    /////////////////
    const equals_01 = vx.deepEqual(
      v.map(
        v.array(
          v.pipe(
            v.number(),
            v.integer()
          ),
        ),
        v.pipe(
          v.number(),
          v.integer(),
        )
      )
    )
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.record', () => {
    /////////////////
    const equals_01 = vx.deepEqual(
      v.record(
        v.string(),
        v.pipe(
          v.number(),
          v.integer(),
        )
      )
    )
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.lazy', () => {
    /////////////////
    const equals = vx.deepEqual(v.lazy(() => v.string()))
    //    success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.union', () => {
    /////////////////
    const equals_01 = vx.deepEqual(v.union([]))
    //    success
    vi.expect.soft(equals_01('' as never, '' as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01('' as never, 'hey' as never)).toBeFalsy()

    /////////////////
    const equals_02 = vx.deepEqual(
      v.union([
        v.pipe(
          v.number(),
          v.integer(),
        )
      ])
    )
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
    const equals_03 = vx.deepEqual(
      v.union([
        v.pipe(
          v.number(),
          v.integer(),
        ),
        v.bigint(),
      ])
    )
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

    /////////////////
    const equals_04 = vx.deepEqual(v.union([
      v.object({ tag: v.literal('ABC'), abc: v.number() }),
      v.object({ tag: v.literal('DEF'), def: v.bigint() }),
    ]))
    //    success
    vi.expect.soft(equals_04({ tag: 'ABC', abc: 0 }, { tag: 'ABC', abc: 0 })).toBeTruthy()
    vi.expect.soft(equals_04({ tag: 'DEF', def: 0n }, { tag: 'DEF', def: 0n })).toBeTruthy()
    //    failure
    vi.expect.soft(equals_04({ tag: 'ABC', abc: 0 }, { tag: 'ABC', abc: 1 })).toBeFalsy()
    vi.expect.soft(equals_04({ tag: 'ABC', abc: 1 }, { tag: 'ABC', abc: 0 })).toBeFalsy()
    vi.expect.soft(equals_04({ tag: 'DEF', def: 0n }, { tag: 'DEF', def: 1n })).toBeFalsy()
    vi.expect.soft(equals_04({ tag: 'DEF', def: 1n }, { tag: 'DEF', def: 0n })).toBeFalsy()
    vi.expect.soft(equals_04({ tag: 'ABC', abc: 0 }, { tag: 'DEF', def: 0n })).toBeFalsy()
    vi.expect.soft(equals_04({ tag: 'DEF', def: 0n }, { tag: 'ABC', abc: 0 })).toBeFalsy()

    /////////////////
    const equals_05 = vx.deepEqual(
      v.union([
        v.object({
          tag1: v.literal('ABC'),
          abc: v.union([
            v.object({
              tag2: v.literal('ABC_JKL'),
              jkl: v.union([
                v.object({
                  tag3: v.literal('ABC_JKL_ONE'),
                }),
                v.object({
                  tag3: v.literal('ABC_JKL_TWO'),
                }),
              ])
            }),
            v.object({
              tag2: v.literal('ABC_MNO'),
              mno: v.union([
                v.object({
                  tag3: v.literal('ABC_MNO_ONE'),
                }),
                v.object({
                  tag3: v.literal('ABC_MNO_TWO'),
                }),
              ])
            }),
          ])
        }),
        v.object({
          tag1: v.literal('DEF'),
          def: v.union([
            v.object({
              tag2: v.literal('DEF_PQR'),
              pqr: v.union([
                v.object({
                  tag3: v.literal('DEF_PQR_ONE'),
                }),
                v.object({
                  tag3: v.literal('DEF_PQR_TWO'),
                }),
              ])
            }),
            v.object({
              tag2: v.literal('DEF_STU'),
              stu: v.union([
                v.object({
                  tag3: v.literal('DEF_STU_ONE'),
                }),
                v.object({
                  tag3: v.literal('DEF_STU_TWO'),
                }),
              ])
            }),
          ])
        }),
      ])
    )

    //    success
    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_ONE' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_ONE' } } },
    )).toBeTruthy()
    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_TWO' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_TWO' } } },
    )).toBeTruthy()

    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_ONE' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_ONE' } } },
    )).toBeTruthy()
    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_TWO' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_TWO' } } },
    )).toBeTruthy()

    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_ONE' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_ONE' } } },
    )).toBeTruthy()
    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_TWO' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_TWO' } } },
    )).toBeTruthy()

    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_ONE' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_ONE' } } },
    )).toBeTruthy()
    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_TWO' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_TWO' } } },
    )).toBeTruthy()

    //    failure
    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_ONE' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_TWO' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_TWO' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_ONE' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_TWO' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_TWO' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_ONE' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_TWO' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_TWO' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_ONE' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_TWO' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_TWO' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_ONE' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_ONE' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_MNO', mno: { tag3: 'ABC_MNO_ONE' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_ONE' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_ONE' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_STU', stu: { tag3: 'DEF_STU_ONE' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_05(
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_ONE' } } },
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_ONE' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_05(
      { tag1: 'DEF', def: { tag2: 'DEF_PQR', pqr: { tag3: 'DEF_PQR_ONE' } } },
      { tag1: 'ABC', abc: { tag2: 'ABC_JKL', jkl: { tag3: 'ABC_JKL_ONE' } } },
    )).toBeFalsy()

    /////////////////
    const equals_06 = vx.deepEqual(
      v.union([
        v.object({
          tag: v.literal('ABC'),
          abc: v.union([
            v.object({
              tag: v.literal('ABC_JKL'),
              jkl: v.union([
                v.object({
                  tag: v.literal('ABC_JKL_ONE'),
                }),
                v.object({
                  tag: v.literal('ABC_JKL_TWO'),
                }),
              ])
            }),
            v.object({
              tag: v.literal('ABC_MNO'),
              mno: v.union([
                v.object({
                  tag: v.literal('ABC_MNO_ONE'),
                }),
                v.object({
                  tag: v.literal('ABC_MNO_TWO'),
                }),
              ])
            }),
          ])
        }),
        v.object({
          tag: v.literal('DEF'),
          def: v.union([
            v.object({
              tag: v.literal('DEF_PQR'),
              pqr: v.union([
                v.object({
                  tag: v.literal('DEF_PQR_ONE'),
                }),
                v.object({
                  tag: v.literal('DEF_PQR_TWO'),
                }),
              ])
            }),
            v.object({
              tag: v.literal('DEF_STU'),
              stu: v.union([
                v.object({
                  tag: v.literal('DEF_STU_ONE'),
                }),
                v.object({
                  tag: v.literal('DEF_STU_TWO'),
                }),
              ])
            }),
          ])
        }),
      ])
    )

    //    success
    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_ONE' } } },
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_ONE' } } },
    )).toBeTruthy()
    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_TWO' } } },
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_TWO' } } },
    )).toBeTruthy()

    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_ONE' } } },
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_ONE' } } },
    )).toBeTruthy()
    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_TWO' } } },
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_TWO' } } },
    )).toBeTruthy()

    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_ONE' } } },
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_ONE' } } },
    )).toBeTruthy()
    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_TWO' } } },
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_TWO' } } },
    )).toBeTruthy()

    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_ONE' } } },
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_ONE' } } },
    )).toBeTruthy()
    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_TWO' } } },
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_TWO' } } },
    )).toBeTruthy()

    //    failure
    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_ONE' } } },
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_TWO' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_TWO' } } },
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_ONE' } } },
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_TWO' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_TWO' } } },
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_ONE' } } },
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_TWO' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_TWO' } } },
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_ONE' } } },
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_TWO' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_TWO' } } },
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_ONE' } } },
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_ONE' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_MNO', mno: { tag: 'ABC_MNO_ONE' } } },
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_ONE' } } },
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_ONE' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_STU', stu: { tag: 'DEF_STU_ONE' } } },
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_ONE' } } },
    )).toBeFalsy()

    vi.expect.soft(equals_06(
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_ONE' } } },
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_ONE' } } },
    )).toBeFalsy()
    vi.expect.soft(equals_06(
      { tag: 'DEF', def: { tag: 'DEF_PQR', pqr: { tag: 'DEF_PQR_ONE' } } },
      { tag: 'ABC', abc: { tag: 'ABC_JKL', jkl: { tag: 'ABC_JKL_ONE' } } },
    )).toBeFalsy()

  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.intersect', () => {
    /////////////////
    const equals_01 = vx.deepEqual(
      v.intersect([
        v.object({ a: v.number() }),
        v.object({ b: v.string() }),
      ])
    )
    //    success
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1, b: '' })).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01({ a: 1 } as never, { a: 1, b: '' })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1 } as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.tuple', () => {
    /////////////////
    const equals_01 = vx.deepEqual(v.tuple([]))
    //    success
    vi.expect.soft(equals_01([], [])).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01([], [undefined] as never)).toBeFalsy()
    vi.expect.soft(equals_01([undefined] as never, [])).toBeFalsy()

    /////////////////
    const equals_02 = vx.deepEqual(
      v.tuple([
        v.string(),
        v.pipe(
          v.number(),
          v.integer(),
        )
      ])
    )
    //    success
    vi.expect.soft(equals_02(['', 0], ['', 0])).toBeTruthy()
    vi.expect.soft(equals_02(['hey', 1], ['hey', 1])).toBeTruthy()
    //    failure
    vi.expect.soft(equals_02(['', 0], ['', 1])).toBeFalsy()
    vi.expect.soft(equals_02(['', 1], ['', 0])).toBeFalsy()
    vi.expect.soft(equals_02(['', 0], ['hey', 0])).toBeFalsy()
    vi.expect.soft(equals_02(['hey', 0], ['', 0])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.tupleWithRest', () => {
    /////////////////
    const equals = vx.deepEqual(
      v.tupleWithRest(
        [
          v.string(),
          v.pipe(
            v.number(),
            v.integer(),
          )
        ],
        v.boolean()
      )
    )
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.object', () => {
    /////////////////
    const equals = vx.deepEqual(v.object({ a: v.number(), b: v.string(), c: v.boolean() }))
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.object w/ optional props', () => {
    /////////////////
    const equals_01 = vx.deepEqual(v.object({}))
    //    success
    vi.expect.soft(equals_01({}, {})).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01({ a: undefined } as never, {})).toBeFalsy()
    vi.expect.soft(equals_01({}, { a: undefined } as never)).toBeFalsy()

    /////////////////
    const equals_02 = vx.deepEqual(v.object({ a: v.optional(v.boolean()), b: v.optional(v.symbol()) }))
    //    success
    vi.expect.soft(equals_02({}, {})).toBeTruthy()
    vi.expect.soft(equals_02({ a: false }, { a: false })).toBeTruthy()
    vi.expect.soft(equals_02({ b: symbol }, { b: symbol })).toBeTruthy()
    vi.expect.soft(equals_02({ a: false, b: symbol }, { a: false, b: symbol })).toBeTruthy()
    //    failure
    vi.expect.soft(equals_02({}, { a: false })).toBeFalsy()
    vi.expect.soft(equals_02({ a: false }, {})).toBeFalsy()
    vi.expect.soft(equals_02({ a: false }, { a: true })).toBeFalsy()
    vi.expect.soft(equals_02({}, { b: symbol })).toBeFalsy()
    vi.expect.soft(equals_02({ b: symbol }, {})).toBeFalsy()
    vi.expect.soft(equals_02({ b: symbol }, { b: Symbol() })).toBeFalsy()
    vi.expect.soft(equals_02({ b: Symbol() }, { b: symbol })).toBeFalsy()
    vi.expect.soft(equals_02({ a: false, b: symbol }, { a: true, b: symbol })).toBeFalsy()
    vi.expect.soft(equals_02({ a: true, b: symbol }, { a: false, b: symbol })).toBeFalsy()
    vi.expect.soft(equals_02({ a: false, b: symbol }, { a: false, b: Symbol() })).toBeFalsy()
    vi.expect.soft(equals_02({ a: false, b: Symbol() }, { a: false, b: symbol })).toBeFalsy()
    vi.expect.soft(equals_02({ a: false, b: symbol }, { a: true, b: Symbol() })).toBeFalsy()
    vi.expect.soft(equals_02({ a: true, b: Symbol() }, { a: false, b: symbol })).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: v.objectWithRest', () => {
    const stringIndex = { [String()]: '' }
    const aFalse1: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex } as never
    const aFalse2: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex, b: 'hey' } as never
    const aFalse3: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex, b: 'ho' } as never
    const aTrue1: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex } as never
    const aTrue2: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex, b: 'hey' } as never
    const aTrue3: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex, b: 'ho' } as never

    /////////////////
    const equals = vx.deepEqual(
      v.objectWithRest(
        { a: v.boolean() },
        v.string(),
      )
    )
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
})
