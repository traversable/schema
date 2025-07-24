import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'

import prettier from "@prettier/sync"

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

const array: unknown[] = []
const object: object = {}
const symbol = Symbol()
const date = new Date()

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.deepEqual.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.never', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.any', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.unknown', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.void', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.undefined', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.null', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.boolean', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.symbol', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.nan', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.int()
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.int', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.int()
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.bigint', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.number', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.number()
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.string', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.enum', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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
      zx.deepEqual.writeable(
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
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.literal', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.literal([])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: never, r: never) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.literal('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a", r: "a") {
        if (l !== r) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.literal(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: "a" | "b", r: "a" | "b") {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.templateLiteral', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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
      zx.deepEqual.writeable(
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
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.file', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.date', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(z.date())
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Date, r: Date) {
        if (!Object.is(l?.getTime(), r?.getTime())) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.lazy', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.lazy(() => z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: number, r: number) {
        if (l === r) return true
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.optional', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.optional(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: undefined | number, r: undefined | number) {
        if (l === r) return true
        if ((l === undefined || r === undefined) && l !== r) return false
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.nullable', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.nullable(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: null | number, r: null | number) {
        if (l === r) return true
        if ((l === null || r === null) && l !== r) return false
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.set', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.set(z.number()),
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Set<number>, r: Set<number>) {
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.map', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.map(z.number(), z.unknown()),
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Map<number, unknown>, r: Map<number, unknown>) {
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.array', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.array(
          z.object({
            a: z.array(
              z.object({
                b: z.array(z.string()),
                c: z.optional(z.string()),
              })
            ),
            d: z.optional(
              z.array(
                z.object({
                  e: z.optional(z.array(z.string())),
                  f: z.string(),
                })
              )
            )
          })
        ), { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{
        a: Array<{ b: Array<string>; c?: string }>
        d?: Array<{ e?: Array<string>; f: string }>
      }>
      function equals(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item.a !== r_item.a) {
            const length2 = l_item.a.length
            if (length2 !== r_item.a.length) return false
            for (let ix = length2; ix-- !== 0; ) {
              const l_item_a_item = l_item.a[ix]
              const r_item_a_item = r_item.a[ix]
              if (l_item_a_item.b !== r_item_a_item.b) {
                const length4 = l_item_a_item.b.length
                if (length4 !== r_item_a_item.b.length) return false
                for (let ix = length4; ix-- !== 0; ) {
                  const l_item_a_item_b_item = l_item_a_item.b[ix]
                  const r_item_a_item_b_item = r_item_a_item.b[ix]
                  if (l_item_a_item_b_item !== r_item_a_item_b_item) return false
                }
              }
              if (
                (l_item_a_item.c === undefined || r_item_a_item.c === undefined) &&
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
            const length5 = l_item.d.length
            if (length5 !== r_item.d.length) return false
            for (let ix = length5; ix-- !== 0; ) {
              const l_item_d_item = l_item.d[ix]
              const r_item_d_item = r_item.d[ix]
              if (
                (l_item_d_item.e === undefined || r_item_d_item.e === undefined) &&
                l_item_d_item.e !== r_item_d_item.e
              )
                return false
              if (l_item_d_item.e !== r_item_d_item.e) {
                const length7 = l_item_d_item.e.length
                if (length7 !== r_item_d_item.e.length) return false
                for (let ix = length7; ix-- !== 0; ) {
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
      zx.deepEqual.writeable(
        z.array(z.number())
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
      zx.deepEqual.writeable(
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
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item.c !== r_item.c) {
            if (l_item.c.d !== r_item.c.d) return false
            if (l_item.c.e !== r_item.c.e) {
              const length3 = l_item.c.e.length
              if (length3 !== r_item.c.e.length) return false
              for (let ix = length3; ix-- !== 0; ) {
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
      zx.deepEqual.writeable(
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
          const length1 = l.a.length
          if (length1 !== r.a.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l_a_item = l.a[ix]
            const r_a_item = r.a[ix]
            if (l_a_item !== r_a_item) return false
          }
        }
        if (l.b !== r.b) {
          const length2 = l.b.length
          if (length2 !== r.b.length) return false
          for (let ix = length2; ix-- !== 0; ) {
            const l_b_item = l.b[ix]
            const r_b_item = r.b[ix]
            if (l_b_item.c !== r_b_item.c) {
              if (l_b_item.c.d !== r_b_item.c.d) return false
              if (l_b_item.c.e !== r_b_item.c.e) {
                const length5 = l_b_item.c.e.length
                if (length5 !== r_b_item.c.e.length) return false
                for (let ix = length5; ix-- !== 0; ) {
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.tuple', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(z.tuple([]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.length !== r.length) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepEqual.writeable(z.tuple([z.string(), z.string()]), { typeName: 'Type' })
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
      zx.deepEqual.writeable(
        z.tuple([z.number(), z.tuple([z.object({ a: z.boolean() })])])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: [number, [{ a: boolean }]], r: [number, [{ a: boolean }]]) {
        if (l === r) return true
        if (l[0] !== r[0] && (l[0] === l[0] || r[0] === r[0])) return false
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
      zx.deepEqual.writeable(z.object({
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
        if ((l.b === undefined || r.b === undefined) && l.b !== r.b) return false
        if (l.b !== r.b) {
          if (l.b[0] !== r.b[0]) return false
          if ((l.b[1] === undefined || r.b[1] === undefined) && l.b[1] !== r.b[1])
            return false
          if (l.b[1] !== r.b[1]) {
            if (l.b[1][0] !== r.b[1][0]) return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.tuple w/ rest', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(z.tuple([z.string(), z.string()], z.number()), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string, ...number[]]
      function equals(l: Type, r: Type) {
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
      zx.deepEqual.writeable(z.tuple([z.object({ a: z.string() }), z.object({ b: z.string() })], z.object({ c: z.number() })), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ a: string }, { b: string }, ...{ c: number }[]]
      function equals(l: Type, r: Type) {
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.object', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(z.object({}))
    )).toMatchInlineSnapshot
      (`
      "function equals(l: {}, r: {}) {
        if (l === r) return true
        if (Object.keys(l).length !== Object.keys(r).length) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepEqual.writeable(z.object({
        street1: z.string(),
        street2: z.optional(z.string()),
        city: z.string(),
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: string; city: string }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.street1 !== r.street1) return false
        if (
          (l.street2 === undefined || r.street2 === undefined) &&
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
      zx.deepEqual.writeable(
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
        if ((l.d === undefined || r.d === undefined) && l.d !== r.d) return false
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
      zx.deepEqual.writeable(z.object({
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
          const length1 = l.b.length
          if (length1 !== r.b.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l_b_item = l.b[ix]
            const r_b_item = r.b[ix]
            if (l_b_item !== r_b_item) return false
          }
        }
        if (l["0b"] !== r["0b"]) {
          const length2 = l["0b"].length
          if (length2 !== r["0b"].length) return false
          for (let ix = length2; ix-- !== 0; ) {
            const l__0b___item = l["0b"][ix]
            const r__0b___item = r["0b"][ix]
            if (l__0b___item !== r__0b___item) return false
          }
        }
        if (l["00b"] !== r["00b"]) {
          const length3 = l["00b"].length
          if (length3 !== r["00b"].length) return false
          for (let ix = length3; ix-- !== 0; ) {
            const l__00b___item = l["00b"][ix]
            const r__00b___item = r["00b"][ix]
            if (l__00b___item !== r__00b___item) return false
          }
        }
        if (l["-00b"] !== r["-00b"]) {
          const length4 = l["-00b"].length
          if (length4 !== r["-00b"].length) return false
          for (let ix = length4; ix-- !== 0; ) {
            const l___00b___item = l["-00b"][ix]
            const r___00b___item = r["-00b"][ix]
            if (l___00b___item !== r___00b___item) return false
          }
        }
        if (l["00b0"] !== r["00b0"]) {
          const length5 = l["00b0"].length
          if (length5 !== r["00b0"].length) return false
          for (let ix = length5; ix-- !== 0; ) {
            const l__00b0___item = l["00b0"][ix]
            const r__00b0___item = r["00b0"][ix]
            if (l__00b0___item !== r__00b0___item) return false
          }
        }
        if (l["--00b0"] !== r["--00b0"]) {
          const length6 = l["--00b0"].length
          if (length6 !== r["--00b0"].length) return false
          for (let ix = length6; ix-- !== 0; ) {
            const l____00b0___item = l["--00b0"][ix]
            const r____00b0___item = r["--00b0"][ix]
            if (l____00b0___item !== r____00b0___item) return false
          }
        }
        if (l["-^00b0"] !== r["-^00b0"]) {
          const length7 = l["-^00b0"].length
          if (length7 !== r["-^00b0"].length) return false
          for (let ix = length7; ix-- !== 0; ) {
            const l____00b0__1_item = l["-^00b0"][ix]
            const r____00b0__1_item = r["-^00b0"][ix]
            if (l____00b0__1_item !== r____00b0__1_item) return false
          }
        }
        if (l[""] !== r[""]) {
          const length8 = l[""].length
          if (length8 !== r[""].length) return false
          for (let ix = length8; ix-- !== 0; ) {
            const l_____item = l[""][ix]
            const r_____item = r[""][ix]
            if (l_____item !== r_____item) return false
          }
        }
        if (l._ !== r._) {
          const length9 = l._.length
          if (length9 !== r._.length) return false
          for (let ix = length9; ix-- !== 0; ) {
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.object w/ catchall', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.object({
          street1: z.string(),
          street2: z.optional(z.string()),
          city: z.string(),
        }).catchall(z.boolean()),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: string; city: string } & {
        [x: string]: boolean
      }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        if (l.street1 !== r.street1) return false
        if (
          (l.street2 === undefined || r.street2 === undefined) &&
          l.street2 !== r.street2
        )
          return false
        if (l.street2 !== r.street2) return false
        if (l.city !== r.city) return false
        const l_keys = Object.keys(l)
        const length = l_keys.length
        if (length !== Object.keys(r).length) return false
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
      zx.deepEqual.writeable(
        z.object({
          b: z.array(z.string()),
          '0b': z.array(z.string()),
          '00b': z.array(z.string()),
          '-00b': z.array(z.string()),
          '00b0': z.array(z.string()),
          '--00b0': z.array(z.string()),
          '-^00b0': z.array(z.string()),
          '': z.array(z.string()),
          '_': z.array(z.string()),
        }).catchall(z.array(z.array(z.string()))),
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
      function equals(l: Type, r: Type) {
        if (l === r) return true
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
        const l_keys = Object.keys(l)
        const length = l_keys.length
        if (length !== Object.keys(r).length) return false
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.union', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: never, r: never) {
        if (l === r) return true
        let satisfied = false
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.union([
          z.object({ tag: z.literal('ABC'), abc: z.number() }),
          z.object({ tag: z.literal('DEF'), def: z.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: bigint }
      function equals(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (l.tag === "ABC") {
          if (l.tag !== r.tag) return false
          if (l.abc !== r.abc && (l.abc === l.abc || r.abc === r.abc)) return false
          satisfied = true
        }
        if (l.tag === "DEF") {
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
      zx.deepEqual.writeable(
        z.union([
          z.object({ tag: z.literal('NON_DISCRIMINANT'), abc: z.number() }),
          z.object({ tag: z.literal('NON_DISCRIMINANT'), def: z.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: "NON_DISCRIMINANT"; abc: number }
        | { tag: "NON_DISCRIMINANT"; def: bigint }
      function equals(l: Type, r: Type) {
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
      zx.deepEqual.writeable(
        z.union([
          z.object({
            tag1: z.literal('ABC'),
            abc: z.union([
              z.object({
                tag2: z.literal('ABC_JKL'),
                jkl: z.union([
                  z.object({
                    tag3: z.literal('ABC_JKL_ONE'),
                  }),
                  z.object({
                    tag3: z.literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              z.object({
                tag2: z.literal('ABC_MNO'),
                mno: z.union([
                  z.object({
                    tag3: z.literal('ABC_MNO_ONE'),
                  }),
                  z.object({
                    tag3: z.literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          z.object({
            tag1: z.literal('DEF'),
            def: z.union([
              z.object({
                tag2: z.literal('DEF_PQR'),
                pqr: z.union([
                  z.object({
                    tag3: z.literal('DEF_PQR_ONE'),
                  }),
                  z.object({
                    tag3: z.literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              z.object({
                tag2: z.literal('DEF_STU'),
                stu: z.union([
                  z.object({
                    tag3: z.literal('DEF_STU_ONE'),
                  }),
                  z.object({
                    tag3: z.literal('DEF_STU_TWO'),
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
      function equals(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (l.tag1 === "ABC") {
          if (l.tag1 !== r.tag1) return false
          let satisfied1 = false
          if (l.abc.tag2 === "ABC_JKL") {
            if (l.abc.tag2 !== r.abc.tag2) return false
            let satisfied2 = false
            if (l.abc.jkl.tag3 === "ABC_JKL_ONE") {
              if (l.abc.jkl.tag3 !== r.abc.jkl.tag3) return false
              satisfied2 = true
            }
            if (l.abc.jkl.tag3 === "ABC_JKL_TWO") {
              if (l.abc.jkl.tag3 !== r.abc.jkl.tag3) return false
              satisfied2 = true
            }
            if (!satisfied2) return false
            satisfied1 = true
          }
          if (l.abc.tag2 === "ABC_MNO") {
            if (l.abc.tag2 !== r.abc.tag2) return false
            let satisfied3 = false
            if (l.abc.mno.tag3 === "ABC_MNO_ONE") {
              if (l.abc.mno.tag3 !== r.abc.mno.tag3) return false
              satisfied3 = true
            }
            if (l.abc.mno.tag3 === "ABC_MNO_TWO") {
              if (l.abc.mno.tag3 !== r.abc.mno.tag3) return false
              satisfied3 = true
            }
            if (!satisfied3) return false
            satisfied1 = true
          }
          if (!satisfied1) return false
          satisfied = true
        }
        if (l.tag1 === "DEF") {
          if (l.tag1 !== r.tag1) return false
          let satisfied4 = false
          if (l.def.tag2 === "DEF_PQR") {
            if (l.def.tag2 !== r.def.tag2) return false
            let satisfied5 = false
            if (l.def.pqr.tag3 === "DEF_PQR_ONE") {
              if (l.def.pqr.tag3 !== r.def.pqr.tag3) return false
              satisfied5 = true
            }
            if (l.def.pqr.tag3 === "DEF_PQR_TWO") {
              if (l.def.pqr.tag3 !== r.def.pqr.tag3) return false
              satisfied5 = true
            }
            if (!satisfied5) return false
            satisfied4 = true
          }
          if (l.def.tag2 === "DEF_STU") {
            if (l.def.tag2 !== r.def.tag2) return false
            let satisfied6 = false
            if (l.def.stu.tag3 === "DEF_STU_ONE") {
              if (l.def.stu.tag3 !== r.def.stu.tag3) return false
              satisfied6 = true
            }
            if (l.def.stu.tag3 === "DEF_STU_TWO") {
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
      zx.deepEqual.writeable(
        z.union([
          z.object({
            tag: z.literal('ABC'),
            abc: z.union([
              z.object({
                tag: z.literal('ABC_JKL'),
                jkl: z.union([
                  z.object({
                    tag: z.literal('ABC_JKL_ONE'),
                  }),
                  z.object({
                    tag: z.literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              z.object({
                tag: z.literal('ABC_MNO'),
                mno: z.union([
                  z.object({
                    tag: z.literal('ABC_MNO_ONE'),
                  }),
                  z.object({
                    tag: z.literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          z.object({
            tag: z.literal('DEF'),
            def: z.union([
              z.object({
                tag: z.literal('DEF_PQR'),
                pqr: z.union([
                  z.object({
                    tag: z.literal('DEF_PQR_ONE'),
                  }),
                  z.object({
                    tag: z.literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              z.object({
                tag: z.literal('DEF_STU'),
                stu: z.union([
                  z.object({
                    tag: z.literal('DEF_STU_ONE'),
                  }),
                  z.object({
                    tag: z.literal('DEF_STU_TWO'),
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
      function equals(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (l.tag === "ABC") {
          if (l.tag !== r.tag) return false
          let satisfied1 = false
          if (l.abc.tag === "ABC_JKL") {
            if (l.abc.tag !== r.abc.tag) return false
            let satisfied2 = false
            if (l.abc.jkl.tag === "ABC_JKL_ONE") {
              if (l.abc.jkl.tag !== r.abc.jkl.tag) return false
              satisfied2 = true
            }
            if (l.abc.jkl.tag === "ABC_JKL_TWO") {
              if (l.abc.jkl.tag !== r.abc.jkl.tag) return false
              satisfied2 = true
            }
            if (!satisfied2) return false
            satisfied1 = true
          }
          if (l.abc.tag === "ABC_MNO") {
            if (l.abc.tag !== r.abc.tag) return false
            let satisfied3 = false
            if (l.abc.mno.tag === "ABC_MNO_ONE") {
              if (l.abc.mno.tag !== r.abc.mno.tag) return false
              satisfied3 = true
            }
            if (l.abc.mno.tag === "ABC_MNO_TWO") {
              if (l.abc.mno.tag !== r.abc.mno.tag) return false
              satisfied3 = true
            }
            if (!satisfied3) return false
            satisfied1 = true
          }
          if (!satisfied1) return false
          satisfied = true
        }
        if (l.tag === "DEF") {
          if (l.tag !== r.tag) return false
          let satisfied4 = false
          if (l.def.tag === "DEF_PQR") {
            if (l.def.tag !== r.def.tag) return false
            let satisfied5 = false
            if (l.def.pqr.tag === "DEF_PQR_ONE") {
              if (l.def.pqr.tag !== r.def.pqr.tag) return false
              satisfied5 = true
            }
            if (l.def.pqr.tag === "DEF_PQR_TWO") {
              if (l.def.pqr.tag !== r.def.pqr.tag) return false
              satisfied5 = true
            }
            if (!satisfied5) return false
            satisfied4 = true
          }
          if (l.def.tag === "DEF_STU") {
            if (l.def.tag !== r.def.tag) return false
            let satisfied6 = false
            if (l.def.stu.tag === "DEF_STU_ONE") {
              if (l.def.stu.tag !== r.def.stu.tag) return false
              satisfied6 = true
            }
            if (l.def.stu.tag === "DEF_STU_TWO") {
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
      zx.deepEqual.writeable(
        z.union([z.object({ tag: z.literal('A') }), z.object({ tag: z.literal('B') }), z.object({ tag: z.array(z.string()) })]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "A" } | { tag: "B" } | { tag: Array<string> }
      function equals(l: Type, r: Type) {
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
            const length3 = l.tag.length
            if (length3 !== r.tag.length) return false
            for (let ix = length3; ix-- !== 0; ) {
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
      zx.deepEqual.writeable(
        z.union([z.number(), z.array(z.string())])
      ))).toMatchInlineSnapshot
      (`
        "function equals(l: number | Array<string>, r: number | Array<string>) {
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
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.intersection', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
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
        if (l.abc !== r.abc) return false
        if (l.def !== r.def) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepEqual.writeable(
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

  vi.test('〖⛳️〗› ❲zx.deepEqual.writeable❳: z.record', () => {
    vi.expect.soft(format(
      zx.deepEqual.writeable(
        z.record(z.string(), z.record(z.string(), z.string())), {
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
      zx.deepEqual.writeable(
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
          const l_a_keys = Object.keys(l.a)
          const r_a_keys = Object.keys(r.a)
          const length1 = l_a_keys.length
          if (length1 !== r_a_keys.length) return false
          for (let ix = length1; ix-- !== 0; ) {
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
          const length2 = l_b_keys.length
          if (length2 !== r_b_keys.length) return false
          for (let ix = length2; ix-- !== 0; ) {
            const k = l_b_keys[ix]
            if (!r_b_keys.includes(k)) return false
            const l_b_k_ = l.b[k]
            const r_b_k_ = r.b[k]
            if (l_b_k_.c !== r_b_k_.c) {
              if (l_b_k_.c.d !== r_b_k_.c.d) return false
              if (l_b_k_.c.e !== r_b_k_.c.e) {
                const l_b_k__c_e_keys = Object.keys(l_b_k_.c.e)
                const r_b_k__c_e_keys = Object.keys(r_b_k_.c.e)
                const length5 = l_b_k__c_e_keys.length
                if (length5 !== r_b_k__c_e_keys.length) return false
                for (let ix = length5; ix-- !== 0; ) {
                  const k = l_b_k__c_e_keys[ix]
                  if (!r_b_k__c_e_keys.includes(k)) return false
                  const l_b_k__c_e_k_ = l_b_k_.c.e[k]
                  const r_b_k__c_e_k_ = r_b_k_.c.e[k]
                  const length6 = l_b_k__c_e_k_.length
                  if (length6 !== r_b_k__c_e_k_.length) return false
                  for (let ix = length6; ix-- !== 0; ) {
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


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.deepEqual', () => {
  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.never', () => {
    /////////////////
    const equals = zx.deepEqual(z.never())
    //    success
    vi.expect.soft(equals(undefined as never, undefined as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(undefined as never, null as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.void', () => {
    /////////////////
    const equals = zx.deepEqual(z.void())
    //    success
    vi.expect.soft(equals(void 0, void 0)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(void 0, null as never)).toBeFalsy()
    vi.expect.soft(equals(null as never, void 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.any', () => {
    /////////////////
    const equals = zx.deepEqual(z.any())
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.unknown', () => {
    /////////////////
    const equals = zx.deepEqual(z.unknown())
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.null', () => {
    /////////////////
    const equals = zx.deepEqual(z.null())
    //    success
    vi.expect.soft(equals(null, null)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(null, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, null)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.nan', () => {
    /////////////////
    const equals = zx.deepEqual(z.nan())
    //    success
    vi.expect.soft(equals(NaN, NaN)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, NaN)).toBeFalsy()
    vi.expect.soft(equals(NaN, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.symbol', () => {
    /////////////////
    const equals = zx.deepEqual(z.symbol())
    //    success
    vi.expect.soft(equals(symbol, symbol)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(symbol, Symbol())).toBeFalsy()
    vi.expect.soft(equals(Symbol(), symbol)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.boolean', () => {
    /////////////////
    const equals = zx.deepEqual(z.boolean())
    //    success
    vi.expect.soft(equals(false, false)).toBeTruthy()
    vi.expect.soft(equals(true, true)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, false)).toBeFalsy()
    vi.expect.soft(equals(false, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.int', () => {
    /////////////////
    const equals = zx.deepEqual(z.int())
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.bigint', () => {
    /////////////////
    const equals = zx.deepEqual(z.bigint())
    //    success
    vi.expect.soft(equals(0n, 0n)).toBeTruthy()
    vi.expect.soft(equals(1n, 1n)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1n, 0n)).toBeFalsy()
    vi.expect.soft(equals(0n, 1n)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.number', () => {
    /////////////////
    const equals = zx.deepEqual(z.number())
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.string', () => {
    /////////////////
    const equals = zx.deepEqual(z.string())
    //    success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.literal', () => {
    /////////////////
    const equals = zx.deepEqual(z.literal(1))
    //    success
    vi.expect.soft(equals(1, 1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(1, 2 as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.enum', () => {
    /////////////////
    const equals = zx.deepEqual(z.enum(['1', '2']))
    //    success
    vi.expect.soft(equals('1', '1')).toBeTruthy()
    vi.expect.soft(equals('2', '2')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('1', '2')).toBeFalsy()
    vi.expect.soft(equals('2', '1')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.templateLiteral', () => {
    /////////////////
    const equals = zx.deepEqual(z.templateLiteral(['1', '2']))
    //    success
    vi.expect.soft(equals('12', '12')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('1' as never, '12')).toBeFalsy()
    vi.expect.soft(equals('12', '1' as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.date', () => {
    /////////////////
    const equals = zx.deepEqual(z.date())
    //    success
    vi.expect.soft(equals(date, date)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(date, new Date())).toBeFalsy()
    vi.expect.soft(equals(new Date(), date)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.optional', () => {
    /////////////////
    const equals = zx.deepEqual(z.optional(z.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(undefined, undefined)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, undefined)).toBeFalsy()
    vi.expect.soft(equals(undefined, true)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.nonoptional', () => {
    /////////////////
    const equals = zx.deepEqual(z.nonoptional(z.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, undefined as never)).toBeFalsy()
    vi.expect.soft(equals(undefined as never, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.nullable', () => {
    /////////////////
    const equals = zx.deepEqual(z.nullable(z.boolean()))
    //    success
    vi.expect.soft(equals(true, true)).toBeTruthy()
    vi.expect.soft(equals(false, false)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(true, null)).toBeFalsy()
    vi.expect.soft(equals(null, false)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.array', () => {
    /////////////////
    const equals_01 = zx.deepEqual(z.array(z.int()))
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.set', () => {
    /////////////////
    const equals_01 = zx.deepEqual(z.set(z.int()))
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.map', () => {
    /////////////////
    const equals_01 = zx.deepEqual(z.map(z.array(z.int()), z.int()))
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.record', () => {
    /////////////////
    const equals_01 = zx.deepEqual(z.record(z.string(), z.int()))
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.lazy', () => {
    /////////////////
    const equals = zx.deepEqual(z.lazy(() => z.string()))
    //    success
    vi.expect.soft(equals('', '')).toBeTruthy()
    vi.expect.soft(equals('hey', 'hey')).toBeTruthy()
    //    failure
    vi.expect.soft(equals('', 'hey')).toBeFalsy()
    vi.expect.soft(equals('hey', '')).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.union', () => {
    /////////////////
    const equals_01 = zx.deepEqual(z.union([]))
    //    success
    vi.expect.soft(equals_01('' as never, '' as never)).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01('' as never, 'hey' as never)).toBeFalsy()

    /////////////////
    const equals_02 = zx.deepEqual(z.union([z.int()]))
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
    const equals_03 = zx.deepEqual(z.union([z.int(), z.bigint()]))
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
    const equals_04 = zx.deepEqual(z.union([
      z.object({ tag: z.literal('ABC'), abc: z.number() }),
      z.object({ tag: z.literal('DEF'), def: z.bigint() }),
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
    const equals_05 = zx.deepEqual(
      z.union([
        z.object({
          tag1: z.literal('ABC'),
          abc: z.union([
            z.object({
              tag2: z.literal('ABC_JKL'),
              jkl: z.union([
                z.object({
                  tag3: z.literal('ABC_JKL_ONE'),
                }),
                z.object({
                  tag3: z.literal('ABC_JKL_TWO'),
                }),
              ])
            }),
            z.object({
              tag2: z.literal('ABC_MNO'),
              mno: z.union([
                z.object({
                  tag3: z.literal('ABC_MNO_ONE'),
                }),
                z.object({
                  tag3: z.literal('ABC_MNO_TWO'),
                }),
              ])
            }),
          ])
        }),
        z.object({
          tag1: z.literal('DEF'),
          def: z.union([
            z.object({
              tag2: z.literal('DEF_PQR'),
              pqr: z.union([
                z.object({
                  tag3: z.literal('DEF_PQR_ONE'),
                }),
                z.object({
                  tag3: z.literal('DEF_PQR_TWO'),
                }),
              ])
            }),
            z.object({
              tag2: z.literal('DEF_STU'),
              stu: z.union([
                z.object({
                  tag3: z.literal('DEF_STU_ONE'),
                }),
                z.object({
                  tag3: z.literal('DEF_STU_TWO'),
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
    const equals_06 = zx.deepEqual(
      z.union([
        z.object({
          tag: z.literal('ABC'),
          abc: z.union([
            z.object({
              tag: z.literal('ABC_JKL'),
              jkl: z.union([
                z.object({
                  tag: z.literal('ABC_JKL_ONE'),
                }),
                z.object({
                  tag: z.literal('ABC_JKL_TWO'),
                }),
              ])
            }),
            z.object({
              tag: z.literal('ABC_MNO'),
              mno: z.union([
                z.object({
                  tag: z.literal('ABC_MNO_ONE'),
                }),
                z.object({
                  tag: z.literal('ABC_MNO_TWO'),
                }),
              ])
            }),
          ])
        }),
        z.object({
          tag: z.literal('DEF'),
          def: z.union([
            z.object({
              tag: z.literal('DEF_PQR'),
              pqr: z.union([
                z.object({
                  tag: z.literal('DEF_PQR_ONE'),
                }),
                z.object({
                  tag: z.literal('DEF_PQR_TWO'),
                }),
              ])
            }),
            z.object({
              tag: z.literal('DEF_STU'),
              stu: z.union([
                z.object({
                  tag: z.literal('DEF_STU_ONE'),
                }),
                z.object({
                  tag: z.literal('DEF_STU_TWO'),
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.intersection', () => {
    /////////////////
    const equals_01 = zx.deepEqual(z.intersection(z.object({ a: z.number() }), z.object({ b: z.string() })))
    //    success
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1, b: '' })).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01({ a: 1 } as never, { a: 1, b: '' })).toBeFalsy()
    vi.expect.soft(equals_01({ a: 1, b: '' }, { a: 1 } as never)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.tuple', () => {
    /////////////////
    const equals_01 = zx.deepEqual(z.tuple([]))
    //    success
    vi.expect.soft(equals_01([], [])).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01([], [undefined] as never)).toBeFalsy()
    vi.expect.soft(equals_01([undefined] as never, [])).toBeFalsy()

    /////////////////
    const equals_02 = zx.deepEqual(z.tuple([z.string(), z.int()]))
    //    success
    vi.expect.soft(equals_02(['', 0], ['', 0])).toBeTruthy()
    vi.expect.soft(equals_02(['hey', 1], ['hey', 1])).toBeTruthy()
    //    failure
    vi.expect.soft(equals_02(['', 0], ['', 1])).toBeFalsy()
    vi.expect.soft(equals_02(['', 1], ['', 0])).toBeFalsy()
    vi.expect.soft(equals_02(['', 0], ['hey', 0])).toBeFalsy()
    vi.expect.soft(equals_02(['hey', 0], ['', 0])).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.tuple w/ rest', () => {
    /////////////////
    const equals = zx.deepEqual(z.tuple([z.string(), z.int()], z.boolean()))
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.object', () => {
    /////////////////
    const equals = zx.deepEqual(z.object({ a: z.number(), b: z.string(), c: z.boolean() }))
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.object w/ optional props', () => {
    /////////////////
    const equals_01 = zx.deepEqual(z.object({}))
    //    success
    vi.expect.soft(equals_01({}, {})).toBeTruthy()
    //    failure
    vi.expect.soft(equals_01({ a: undefined } as never, {})).toBeFalsy()
    vi.expect.soft(equals_01({}, { a: undefined } as never)).toBeFalsy()

    /////////////////
    const equals_02 = zx.deepEqual(z.object({ a: z.optional(z.boolean()), b: z.optional(z.symbol()) }))
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.object w/ catchall', () => {
    const stringIndex = { [String()]: '' }
    const aFalse1: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex } as never
    const aFalse2: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex, b: 'hey' } as never
    const aFalse3: { a: boolean } & typeof stringIndex = { a: false, ...stringIndex, b: 'ho' } as never
    const aTrue1: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex } as never
    const aTrue2: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex, b: 'hey' } as never
    const aTrue3: { a: boolean } & typeof stringIndex = { a: true, ...stringIndex, b: 'ho' } as never

    /////////////////
    const equals = zx.deepEqual(z.object({ a: z.boolean() }).catchall(z.string()))
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

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.pipe', () => {
    /////////////////
    const equals = zx.deepEqual(z.pipe(z.number(), z.int()))
    //    success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: z.catch', () => {
    /////////////////
    const equals = zx.deepEqual(z.number().catch(1))
    //    success
    vi.expect.soft(equals(0, 0)).toBeTruthy()
    vi.expect.soft(equals(0.1, 0.1)).toBeTruthy()
    //    failure
    vi.expect.soft(equals(0, 0.1)).toBeFalsy()
    vi.expect.soft(equals(0.1, 0)).toBeFalsy()
  })
})
