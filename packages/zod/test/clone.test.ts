import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.clone.writeable', () => {

  vi.test.only('', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.array(
          z.object({
            firstName: z.string(),
            lastName: z.optional(z.string()),
            address: z.object({
              street1: z.string(),
              street2: z.optional(z.string()),
              city: z.string(),
            })
          })
        ), {
        typeName: 'Type'
      }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{
        firstName: string
        lastName?: string
        address: { street1: string; street2?: string; city: string }
      }>
      function clone(prev: Type) {
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          const next_item1 = Object.create(null)
          const prev_item1 = prev_item
          next_item1.firstName = prev_item1.firstName
          if (prev_item1.lastName !== undefined)
            next_item1.lastName = prev_item1.lastName
          const next_item__address = Object.create(null)
          const prev_item__address = prev_item1.address
          next_item__address.street1 = prev_item__address.street1
          if (prev_item__address.street2 !== undefined)
            next_item__address.street2 = prev_item__address.street2
          next_item__address.city = prev_item__address.city
          next_item1.address = next_item__address
          next[ix] = next_item
        }
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.never', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.never()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.any', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.any()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: any) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.unknown', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.unknown()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: unknown) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.void', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.void()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: void) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.undefined', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.undefined()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: undefined) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.null', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.null()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: null) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.boolean', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.boolean()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: boolean) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.symbol', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.symbol()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: symbol) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.nan', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.int()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: number) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.int', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.int()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: number) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.bigint', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.bigint()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: bigint) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.number', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.number()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: number) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.string', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.string()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: string) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.enum', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.enum([])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.enum(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a") {
        prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.enum(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a" | "b") {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.literal', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.literal([])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.literal('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a") {
        prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.literal(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a" | "b") {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.templateLiteral', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.templateLiteral([])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "") {
        prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.templateLiteral(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a") {
        prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.templateLiteral(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "ab") {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.file', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.file()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: File) {
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.date', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.date())
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Date) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.lazy', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.lazy(() => z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: number) {
        prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.optional', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.optional(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: undefined | number) {
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.nullable', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.nullable(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: null | number) {
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.set', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.set(z.number()),
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Set<number>) {
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.map', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.map(z.number(), z.unknown()),
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Map<number, unknown>) {
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.array', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.array(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Array<number>) {
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          prev_item
          next[ix] = next_item
        }
        return next
      }
      "
    `)



    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          const next_item1 = Object.create(null)
          const prev_item1 = prev_item
          const next_item__c = Object.create(null)
          const prev_item__c = prev_item1.c
          next_item__c.d = prev_item__c.d
          const length1 = prev_item__c.e.length
          const next_item__c_e = new Array(length1)
          for (let ix = length1; ix-- !== 0; ) {
            const prev_item__c_e_item = prev_item__c.e[ix]
            prev_item__c_e_item
            next_item__c_e[ix] = next_item__c_e_item
          }
          next_item__c.e = next_item__c_e
          next_item1.c = next_item__c
          next[ix] = next_item
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        const next = Object.create(null)
        const length = prev.a.length
        const next_a = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_a_item = prev.a[ix]
          prev_a_item
          next_a[ix] = next_a_item
        }
        next.a = next_a
        const length1 = prev.b.length
        const next_b = new Array(length1)
        for (let ix = length1; ix-- !== 0; ) {
          const prev_b_item = prev.b[ix]
          const next_b_item1 = Object.create(null)
          const prev_b_item1 = prev_b_item
          const next_b_item__c = Object.create(null)
          const prev_b_item__c = prev_b_item1.c
          next_b_item__c.d = prev_b_item__c.d
          const length2 = prev_b_item__c.e.length
          const next_b_item__c_e = new Array(length2)
          for (let ix = length2; ix-- !== 0; ) {
            const prev_b_item__c_e_item = prev_b_item__c.e[ix]
            prev_b_item__c_e_item
            next_b_item__c_e[ix] = next_b_item__c_e_item
          }
          next_b_item__c.e = next_b_item__c_e
          next_b_item1.c = next_b_item__c
          next_b[ix] = next_b_item
        }
        next.b = next_b
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.tuple', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([z.string(), z.string()]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.tuple([z.number(), z.tuple([z.object({ a: z.boolean() })])])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: [number, [{ a: boolean }]]) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.object({
        a: z.tuple([z.string(), z.string()]),
        b: z.optional(z.tuple([z.string(), z.optional(z.tuple([z.string()]))]))
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: [string, string]; b?: [string, _?: [string]] }
      function clone(prev: Type) {
        const next = Object.create(null)

        next.a = undefined

        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.tuple w/ rest', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([z.string(), z.string()], z.number()), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string, ...number[]]
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([z.object({ a: z.string() }), z.object({ b: z.string() })], z.object({ c: z.number() })), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ a: string }, { b: string }, ...{ c: number }[]]
      function clone(prev: Type) {
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.object', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.object({}))
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: {}) {
        const next = Object.create(null)
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.object({
          firstName: z.string(),
          lastName: z.optional(z.string()),
          address: z.object({
            street1: z.string(),
            street2: z.optional(z.string()),
            city: z.string(),
          })
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        firstName: string
        lastName?: string
        address: { street1: string; street2?: string; city: string }
      }
      function clone(prev: Type) {
        const next = Object.create(null)
        next.firstName = prev.firstName
        if (prev.lastName !== undefined) next.lastName = prev.lastName
        const next_address = Object.create(null)
        const prev_address = prev.address
        next_address.street1 = prev_address.street1
        if (prev_address.street2 !== undefined)
          next_address.street2 = prev_address.street2
        next_address.city = prev_address.city
        next.address = next_address
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.object({
        street1: z.string(),
        street2: z.optional(z.string()),
        city: z.string(),
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: string; city: string }
      function clone(prev: Type) {
        const next = Object.create(null)
        next.street1 = prev.street1
        if (prev.street2 !== undefined) next.street2 = prev.street2
        next.city = prev.city
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: { b: string; c: string }
        d?: string
        e: { f: string; g?: { h: string; i: string } }
      }
      function clone(prev: Type) {
        const next = Object.create(null)
        const next_a = Object.create(null)
        const prev_a = prev.a
        next_a.b = prev_a.b
        next_a.c = prev_a.c
        next.a = next_a
        if (prev.d !== undefined) next.d = prev.d
        const next_e = Object.create(null)
        const prev_e = prev.e
        next_e.f = prev_e.f

        next.e = next_e
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.object({
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
      function clone(prev: Type) {
        const next = Object.create(null)
        const length = prev.b.length
        const next_b = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_b_item = prev.b[ix]
          prev_b_item
          next_b[ix] = next_b_item
        }
        next.b = next_b
        const length1 = prev["0b"].length
        const next__0b__ = new Array(length1)
        for (let ix = length1; ix-- !== 0; ) {
          const prev__0b___item = prev["0b"][ix]
          prev__0b___item
          next__0b__[ix] = next__0b___item
        }
        next["0b"] = next__0b__
        const length2 = prev["00b"].length
        const next__00b__ = new Array(length2)
        for (let ix = length2; ix-- !== 0; ) {
          const prev__00b___item = prev["00b"][ix]
          prev__00b___item
          next__00b__[ix] = next__00b___item
        }
        next["00b"] = next__00b__
        const length3 = prev["-00b"].length
        const next___00b__ = new Array(length3)
        for (let ix = length3; ix-- !== 0; ) {
          const prev___00b___item = prev["-00b"][ix]
          prev___00b___item
          next___00b__[ix] = next___00b___item
        }
        next["-00b"] = next___00b__
        const length4 = prev["00b0"].length
        const next__00b0__ = new Array(length4)
        for (let ix = length4; ix-- !== 0; ) {
          const prev__00b0___item = prev["00b0"][ix]
          prev__00b0___item
          next__00b0__[ix] = next__00b0___item
        }
        next["00b0"] = next__00b0__
        const length5 = prev["--00b0"].length
        const next____00b0__ = new Array(length5)
        for (let ix = length5; ix-- !== 0; ) {
          const prev____00b0___item = prev["--00b0"][ix]
          prev____00b0___item
          next____00b0__[ix] = next____00b0___item
        }
        next["--00b0"] = next____00b0__
        const length6 = prev["-^00b0"].length
        const next____00b0__1 = new Array(length6)
        for (let ix = length6; ix-- !== 0; ) {
          const prev____00b0___item1 = prev["-^00b0"][ix]
          prev____00b0___item1
          next____00b0__1[ix] = next____00b0___item1
        }
        next["-^00b0"] = next____00b0__1
        const length7 = prev[""].length
        const next____ = new Array(length7)
        for (let ix = length7; ix-- !== 0; ) {
          const prev_____item = prev[""][ix]
          prev_____item
          next____[ix] = next_____item
        }
        next[""] = next____
        const length8 = prev._.length
        const next__ = new Array(length8)
        for (let ix = length8; ix-- !== 0; ) {
          const prev___item = prev._[ix]
          prev___item
          next__[ix] = next___item
        }
        next._ = next__
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.object w/ catchall', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        const next = Object.create(null)
        next.street1 = prev.street1
        if (prev.street2 !== undefined) next.street2 = prev.street2
        next.city = prev.city
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        const next = Object.create(null)
        const length = prev.b.length
        const next_b = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_b_item = prev.b[ix]
          prev_b_item
          next_b[ix] = next_b_item
        }
        next.b = next_b
        const length1 = prev["0b"].length
        const next__0b__ = new Array(length1)
        for (let ix = length1; ix-- !== 0; ) {
          const prev__0b___item = prev["0b"][ix]
          prev__0b___item
          next__0b__[ix] = next__0b___item
        }
        next["0b"] = next__0b__
        const length2 = prev["00b"].length
        const next__00b__ = new Array(length2)
        for (let ix = length2; ix-- !== 0; ) {
          const prev__00b___item = prev["00b"][ix]
          prev__00b___item
          next__00b__[ix] = next__00b___item
        }
        next["00b"] = next__00b__
        const length3 = prev["-00b"].length
        const next___00b__ = new Array(length3)
        for (let ix = length3; ix-- !== 0; ) {
          const prev___00b___item = prev["-00b"][ix]
          prev___00b___item
          next___00b__[ix] = next___00b___item
        }
        next["-00b"] = next___00b__
        const length4 = prev["00b0"].length
        const next__00b0__ = new Array(length4)
        for (let ix = length4; ix-- !== 0; ) {
          const prev__00b0___item = prev["00b0"][ix]
          prev__00b0___item
          next__00b0__[ix] = next__00b0___item
        }
        next["00b0"] = next__00b0__
        const length5 = prev["--00b0"].length
        const next____00b0__ = new Array(length5)
        for (let ix = length5; ix-- !== 0; ) {
          const prev____00b0___item = prev["--00b0"][ix]
          prev____00b0___item
          next____00b0__[ix] = next____00b0___item
        }
        next["--00b0"] = next____00b0__
        const length6 = prev["-^00b0"].length
        const next____00b0__1 = new Array(length6)
        for (let ix = length6; ix-- !== 0; ) {
          const prev____00b0___item1 = prev["-^00b0"][ix]
          prev____00b0___item1
          next____00b0__1[ix] = next____00b0___item1
        }
        next["-^00b0"] = next____00b0__1
        const length7 = prev[""].length
        const next____ = new Array(length7)
        for (let ix = length7; ix-- !== 0; ) {
          const prev_____item = prev[""][ix]
          prev_____item
          next____[ix] = next_____item
        }
        next[""] = next____
        const length8 = prev._.length
        const next__ = new Array(length8)
        for (let ix = length8; ix-- !== 0; ) {
          const prev___item = prev._[ix]
          prev___item
          next__[ix] = next___item
        }
        next._ = next__
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.union', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([
          z.object({ tag: z.literal('ABC'), abc: z.number() }),
          z.object({ tag: z.literal('DEF'), def: z.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: bigint }
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([z.object({ tag: z.literal('A') }), z.object({ tag: z.literal('B') }), z.object({ tag: z.array(z.string()) })]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "A" } | { tag: "B" } | { tag: Array<string> }
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([z.number(), z.array(z.string())])
      ))).toMatchInlineSnapshot
      (`
        "function clone(prev: number | Array<string>) {
          return next
        }
        "
      `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
        function clone(prev: Type) {
          return next
        }
        "
      `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.intersection', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.record', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.record(z.string(), z.record(z.string(), z.string())), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, string>>
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
      function clone(prev: Type) {
        const next = Object.create(null)

        next.a = undefined

        next.b = undefined
        return next
      }
      "
    `)
  })

})
