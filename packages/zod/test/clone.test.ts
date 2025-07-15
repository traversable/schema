import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.clone.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.never', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.never()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(x: never) {
        x
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
      "function clone(x: any) {
        x
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
      "function clone(x: unknown) {
        x
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
      "function clone(x: void) {
        x
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
      "function clone(x: undefined) {
        x
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
      "function clone(x: null) {
        x
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
      "function clone(x: boolean) {
        x
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
      "function clone(x: symbol) {
        x
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
      "function clone(x: number) {
        x
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
      "function clone(x: number) {
        x
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
      "function clone(x: bigint) {
        x
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
      "function clone(x: number) {
        x
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
      "function clone(x: string) {
        x
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
      "function clone(x: never) {
        x
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.enum(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(x: "a") {
        x
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.enum(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(x: "a" | "b") {
        x
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
      "function clone(x: never) {
        x
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.literal('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(x: "a") {
        x
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.literal(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(x: "a" | "b") {
        x
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
      "function clone(x: "") {
        x
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.templateLiteral(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(x: "a") {
        x
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.templateLiteral(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(x: "ab") {
        x
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
      "function clone(x: File) {}
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.date', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.date())
    )).toMatchInlineSnapshot
      (`
      "function clone(x: Date) {
        x
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
      "function clone(x: number) {
        x
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
      "function clone(x: undefined | number) {}
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
      "function clone(x: null | number) {}
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
      "function clone(x: Set<number>) {}
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
      "function clone(x: Map<number, unknown>) {}
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
      "function clone(x: Array<number>) {
        const length = x.length
        const out = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev = x[ix]
          const next = Object.create(null)
        }
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
      function clone(x: Type) {
        const length = x.length
        const out = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev = x[ix]
          const next = Object.create(null)
        }
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
      function clone(x: Type) {
        const out = Object.create(null)
        const length1 = x.a.length
        const out1 = new Array(length1)
        for (let ix = length1; ix-- !== 0; ) {
          const prev1 = x.a[ix]
          const next = Object.create(null)
        }
        const length2 = x.b.length
        const out2 = new Array(length2)
        for (let ix = length2; ix-- !== 0; ) {
          const prev2 = x.b[ix]
          const next1 = Object.create(null)
        }
        return out
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
      function clone(x: Type) {}
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([z.string(), z.string()]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function clone(x: Type) {}
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.tuple([z.number(), z.tuple([z.object({ a: z.boolean() })])])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(x: [number, [{ a: boolean }]]) {}
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
      function clone(x: Type) {
        const out = Object.create(null)

        return out
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
      function clone(x: Type) {}
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([z.object({ a: z.string() }), z.object({ b: z.string() })], z.object({ c: z.number() })), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ a: string }, { b: string }, ...{ c: number }[]]
      function clone(x: Type) {}
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.object', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.object({}))
    )).toMatchInlineSnapshot
      (`
      "function clone(x: {}) {
        const out = Object.create(null)
        return out
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
      function clone(x: Type) {
        const out = Object.create(null)
        out.street1 = prev.street1
        if (prev.street2 !== undefined) out.street2 = prev.street2
        out.city = prev.city
        return out
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
      function clone(x: Type) {
        const out = Object.create(null)
        const out1 = Object.create(null)
        out1.b = prev1.b
        out1.c = prev1.c
        return out1
        if (prev.d !== undefined) out.d = prev.d
        const out2 = Object.create(null)
        out2.f = prev2.f

        return out2
        return out
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
      function clone(x: Type) {
        const out = Object.create(null)
        const length1 = x.b.length
        const out1 = new Array(length1)
        for (let ix = length1; ix-- !== 0; ) {
          const prev1 = x.b[ix]
          const next = Object.create(null)
        }
        const length2 = x["0b"].length
        const out2 = new Array(length2)
        for (let ix = length2; ix-- !== 0; ) {
          const prev2 = x["0b"][ix]
          const next1 = Object.create(null)
        }
        const length3 = x["00b"].length
        const out3 = new Array(length3)
        for (let ix = length3; ix-- !== 0; ) {
          const prev3 = x["00b"][ix]
          const next2 = Object.create(null)
        }
        const length4 = x["-00b"].length
        const out4 = new Array(length4)
        for (let ix = length4; ix-- !== 0; ) {
          const prev4 = x["-00b"][ix]
          const next3 = Object.create(null)
        }
        const length5 = x["00b0"].length
        const out5 = new Array(length5)
        for (let ix = length5; ix-- !== 0; ) {
          const prev5 = x["00b0"][ix]
          const next4 = Object.create(null)
        }
        const length6 = x["--00b0"].length
        const out6 = new Array(length6)
        for (let ix = length6; ix-- !== 0; ) {
          const prev6 = x["--00b0"][ix]
          const next5 = Object.create(null)
        }
        const length7 = x["-^00b0"].length
        const out7 = new Array(length7)
        for (let ix = length7; ix-- !== 0; ) {
          const prev7 = x["-^00b0"][ix]
          const next6 = Object.create(null)
        }
        const length8 = x[""].length
        const out8 = new Array(length8)
        for (let ix = length8; ix-- !== 0; ) {
          const prev8 = x[""][ix]
          const next7 = Object.create(null)
        }
        const length9 = x._.length
        const out9 = new Array(length9)
        for (let ix = length9; ix-- !== 0; ) {
          const prev9 = x._[ix]
          const next8 = Object.create(null)
        }
        return out
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
      function clone(x: Type) {
        const out = Object.create(null)
        out.street1 = prev.street1
        if (prev.street2 !== undefined) out.street2 = prev.street2
        out.city = prev.city
        return out
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
      function clone(x: Type) {
        const out = Object.create(null)
        const length1 = x.b.length
        const out1 = new Array(length1)
        for (let ix = length1; ix-- !== 0; ) {
          const prev1 = x.b[ix]
          const next = Object.create(null)
        }
        const length2 = x["0b"].length
        const out2 = new Array(length2)
        for (let ix = length2; ix-- !== 0; ) {
          const prev2 = x["0b"][ix]
          const next1 = Object.create(null)
        }
        const length3 = x["00b"].length
        const out3 = new Array(length3)
        for (let ix = length3; ix-- !== 0; ) {
          const prev3 = x["00b"][ix]
          const next2 = Object.create(null)
        }
        const length4 = x["-00b"].length
        const out4 = new Array(length4)
        for (let ix = length4; ix-- !== 0; ) {
          const prev4 = x["-00b"][ix]
          const next3 = Object.create(null)
        }
        const length5 = x["00b0"].length
        const out5 = new Array(length5)
        for (let ix = length5; ix-- !== 0; ) {
          const prev5 = x["00b0"][ix]
          const next4 = Object.create(null)
        }
        const length6 = x["--00b0"].length
        const out6 = new Array(length6)
        for (let ix = length6; ix-- !== 0; ) {
          const prev6 = x["--00b0"][ix]
          const next5 = Object.create(null)
        }
        const length7 = x["-^00b0"].length
        const out7 = new Array(length7)
        for (let ix = length7; ix-- !== 0; ) {
          const prev7 = x["-^00b0"][ix]
          const next6 = Object.create(null)
        }
        const length8 = x[""].length
        const out8 = new Array(length8)
        for (let ix = length8; ix-- !== 0; ) {
          const prev8 = x[""][ix]
          const next7 = Object.create(null)
        }
        const length9 = x._.length
        const out9 = new Array(length9)
        for (let ix = length9; ix-- !== 0; ) {
          const prev9 = x._[ix]
          const next8 = Object.create(null)
        }
        return out
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
      "function clone(x: never) {}
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
      function clone(x: Type) {}
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
      function clone(x: Type) {}
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
      function clone(x: Type) {}
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
      function clone(x: Type) {}
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
      function clone(x: Type) {}
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([z.number(), z.array(z.string())])
      ))).toMatchInlineSnapshot
      (`
        "function clone(x: number | Array<string>) {}
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
        function clone(x: Type) {}
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
      function clone(x: Type) {}
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
      function clone(x: Type) {}
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
      function clone(x: Type) {}
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
      function clone(x: Type) {
        const out = Object.create(null)

        return out
      }
      "
    `)
  })

})
