import * as vi from 'vitest'

import { configure, t, toString } from '@traversable/schema'

configure({
  schema: {
    optionalTreatment: 'treatUndefinedAndOptionalAsTheSame',
  }
})


t.optional(t.array(t.number)).toString()
t.array(t.number).toString()
t.record(t.array(t.number)).toString()
t.union(t.array(t.number), t.array(t.string)).toString()
t.intersect(t.array(t.number), t.array(t.string)).toString()
t.object({ a: t.string })._type


toString.object({ a: t.number, b: t.string })

t.eq(100).toString()

const mySchema = t.object({
  X: t.string,
  Y: t.array(
    t.record(
      t.object({
        Z: t.tuple(t.number, t.boolean)
      })
    )
  ),
  A: t.tuple(
    t.object({
      B: t.optional(t.boolean),
      C: t.number,
      D: t.object({
        E: t.eq(100)
      })
    })
  ),
  D: t.string,
  E: t.optional(t.object({ F: t.null })),
  ABC: t.object({
    Y: t.array(
      t.record(
        t.object({
          Z: t.tuple(t.number, t.boolean)
        })
      )
    ),
    A: t.tuple(
      t.object({
        B: t.optional(t.boolean),
        C: t.number,
        D: t.object({
          E: t.eq(100)
        })
      })
    ),
    D: t.string,
    E: t.optional(t.object({ F: t.null })),
  }),
  DEF: t.object({
    F: t.array(
      t.record(
        t.object({
          Z: t.tuple(t.number, t.boolean)
        })
      )
    ),
    G: t.tuple(
      t.object({
        H: t.optional(t.boolean),
        I: t.number,
        J: t.object({
          E: t.eq(100)
        })
      })
    ),
    K: t.string,
    L: t.optional(t.object({ F: t.null })),
  }),
  MM: t.object({
    N: t.array(
      t.record(
        t.object({
          O: t.tuple(t.number, t.boolean)
        })
      )
    ),
    P: t.tuple(
      t.object({
        Q: t.optional(t.boolean),
        R: t.number,
        S: t.object({
          T: t.eq(100)
        })
      })
    ),
    U: t.string,
    V: t.optional(t.object({ W: t.null })),
  }),
})

const sxas = mySchema.toString()


vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('〖⛳️〗› ❲t.schema❳: parity with oracle (zod)', () => {

    vi.expect(t.toString(t.void)).toMatchInlineSnapshot(`"t.void"`)
    vi.expect(t.toString(t.never)).toMatchInlineSnapshot(`"t.never"`)
    vi.expect(t.toString(t.any)).toMatchInlineSnapshot(`"t.any"`)
    vi.expect(t.toString(t.unknown)).toMatchInlineSnapshot(`"t.unknown"`)
    vi.expect(t.toString(t.null)).toMatchInlineSnapshot(`"t.null"`)
    vi.expect(t.toString(t.undefined)).toMatchInlineSnapshot(`"t.undefined"`)
    vi.expect(t.toString(t.symbol)).toMatchInlineSnapshot(`"t.symbol"`)
    vi.expect(t.toString(t.boolean)).toMatchInlineSnapshot(`"t.boolean"`)
    vi.expect(t.toString(t.bigint)).toMatchInlineSnapshot(`"t.bigint"`)
    vi.expect(t.toString(t.number)).toMatchInlineSnapshot(`"t.number"`)
    vi.expect(t.toString(t.string)).toMatchInlineSnapshot(`"t.string"`)

    vi.expect(t.toString(t.optional(t.void))).toMatchInlineSnapshot(`"t.optional(t.void)"`)
    vi.expect(t.toString(t.optional(t.never))).toMatchInlineSnapshot(`"t.optional(t.never)"`)
    vi.expect(t.toString(t.optional(t.any))).toMatchInlineSnapshot(`"t.optional(t.any)"`)
    vi.expect(t.toString(t.optional(t.unknown))).toMatchInlineSnapshot(`"t.optional(t.unknown)"`)
    vi.expect(t.toString(t.optional(t.null))).toMatchInlineSnapshot(`"t.optional(t.null)"`)
    vi.expect(t.toString(t.optional(t.undefined))).toMatchInlineSnapshot(`"t.optional(t.undefined)"`)
    vi.expect(t.toString(t.optional(t.symbol))).toMatchInlineSnapshot(`"t.optional(t.symbol)"`)
    vi.expect(t.toString(t.optional(t.boolean))).toMatchInlineSnapshot(`"t.optional(t.boolean)"`)
    vi.expect(t.toString(t.optional(t.bigint))).toMatchInlineSnapshot(`"t.optional(t.bigint)"`)
    vi.expect(t.toString(t.optional(t.number))).toMatchInlineSnapshot(`"t.optional(t.number)"`)
    vi.expect(t.toString(t.optional(t.string))).toMatchInlineSnapshot(`"t.optional(t.string)"`)

    vi.expect(t.toString(t.array(t.void))).toMatchInlineSnapshot(`"t.array(t.void)"`)
    vi.expect(t.toString(t.array(t.never))).toMatchInlineSnapshot(`"t.array(t.never)"`)
    vi.expect(t.toString(t.array(t.any))).toMatchInlineSnapshot(`"t.array(t.any)"`)
    vi.expect(t.toString(t.array(t.unknown))).toMatchInlineSnapshot(`"t.array(t.unknown)"`)
    vi.expect(t.toString(t.array(t.null))).toMatchInlineSnapshot(`"t.array(t.null)"`)
    vi.expect(t.toString(t.array(t.undefined))).toMatchInlineSnapshot(`"t.array(t.undefined)"`)
    vi.expect(t.toString(t.array(t.symbol))).toMatchInlineSnapshot(`"t.array(t.symbol)"`)
    vi.expect(t.toString(t.array(t.boolean))).toMatchInlineSnapshot(`"t.array(t.boolean)"`)
    vi.expect(t.toString(t.array(t.bigint))).toMatchInlineSnapshot(`"t.array(t.bigint)"`)
    vi.expect(t.toString(t.array(t.number))).toMatchInlineSnapshot(`"t.array(t.number)"`)
    vi.expect(t.toString(t.array(t.string))).toMatchInlineSnapshot(`"t.array(t.string)"`)

    vi.expect(t.toString(t.record(t.void))).toMatchInlineSnapshot(`"t.record(t.void)"`)
    vi.expect(t.toString(t.record(t.never))).toMatchInlineSnapshot(`"t.record(t.never)"`)
    vi.expect(t.toString(t.record(t.any))).toMatchInlineSnapshot(`"t.record(t.any)"`)
    vi.expect(t.toString(t.record(t.unknown))).toMatchInlineSnapshot(`"t.record(t.unknown)"`)
    vi.expect(t.toString(t.record(t.null))).toMatchInlineSnapshot(`"t.record(t.null)"`)
    vi.expect(t.toString(t.record(t.undefined))).toMatchInlineSnapshot(`"t.record(t.undefined)"`)
    vi.expect(t.toString(t.record(t.symbol))).toMatchInlineSnapshot(`"t.record(t.symbol)"`)
    vi.expect(t.toString(t.record(t.boolean))).toMatchInlineSnapshot(`"t.record(t.boolean)"`)
    vi.expect(t.toString(t.record(t.bigint))).toMatchInlineSnapshot(`"t.record(t.bigint)"`)
    vi.expect(t.toString(t.record(t.number))).toMatchInlineSnapshot(`"t.record(t.number)"`)
    vi.expect(t.toString(t.record(t.string))).toMatchInlineSnapshot(`"t.record(t.string)"`)

    vi.expect(t.toString(t.union(t.void))).toMatchInlineSnapshot(`"t.union(t.void)"`)
    vi.expect(t.toString(t.union(t.never))).toMatchInlineSnapshot(`"t.union(t.never)"`)
    vi.expect(t.toString(t.union(t.any))).toMatchInlineSnapshot(`"t.union(t.any)"`)
    vi.expect(t.toString(t.union(t.unknown))).toMatchInlineSnapshot(`"t.union(t.unknown)"`)
    vi.expect(t.toString(t.union(t.null))).toMatchInlineSnapshot(`"t.union(t.null)"`)
    vi.expect(t.toString(t.union(t.undefined))).toMatchInlineSnapshot(`"t.union(t.undefined)"`)
    vi.expect(t.toString(t.union(t.symbol))).toMatchInlineSnapshot(`"t.union(t.symbol)"`)
    vi.expect(t.toString(t.union(t.boolean))).toMatchInlineSnapshot(`"t.union(t.boolean)"`)
    vi.expect(t.toString(t.union(t.bigint))).toMatchInlineSnapshot(`"t.union(t.bigint)"`)
    vi.expect(t.toString(t.union(t.number))).toMatchInlineSnapshot(`"t.union(t.number)"`)
    vi.expect(t.toString(t.union(t.string))).toMatchInlineSnapshot(`"t.union(t.string)"`)

    vi.expect(t.toString(t.union(t.void, t.never))).toMatchInlineSnapshot(`"t.union(t.void, t.never)"`)
    vi.expect(t.toString(t.union(t.never, t.never))).toMatchInlineSnapshot(`"t.union(t.never, t.never)"`)
    vi.expect(t.toString(t.union(t.any, t.never))).toMatchInlineSnapshot(`"t.union(t.any, t.never)"`)
    vi.expect(t.toString(t.union(t.unknown, t.never))).toMatchInlineSnapshot(`"t.union(t.unknown, t.never)"`)
    vi.expect(t.toString(t.union(t.null, t.never))).toMatchInlineSnapshot(`"t.union(t.null, t.never)"`)
    vi.expect(t.toString(t.union(t.undefined, t.never))).toMatchInlineSnapshot(`"t.union(t.undefined, t.never)"`)
    vi.expect(t.toString(t.union(t.symbol, t.never))).toMatchInlineSnapshot(`"t.union(t.symbol, t.never)"`)
    vi.expect(t.toString(t.union(t.boolean, t.never))).toMatchInlineSnapshot(`"t.union(t.boolean, t.never)"`)
    vi.expect(t.toString(t.union(t.bigint, t.never))).toMatchInlineSnapshot(`"t.union(t.bigint, t.never)"`)
    vi.expect(t.toString(t.union(t.number, t.never))).toMatchInlineSnapshot(`"t.union(t.number, t.never)"`)
    vi.expect(t.toString(t.union(t.string, t.never))).toMatchInlineSnapshot(`"t.union(t.string, t.never)"`)

    vi.expect(t.toString(t.intersect(t.void))).toMatchInlineSnapshot(`"t.intersect(t.void)"`)
    vi.expect(t.toString(t.intersect(t.never))).toMatchInlineSnapshot(`"t.intersect(t.never)"`)
    vi.expect(t.toString(t.intersect(t.any))).toMatchInlineSnapshot(`"t.intersect(t.any)"`)
    vi.expect(t.toString(t.intersect(t.unknown))).toMatchInlineSnapshot(`"t.intersect(t.unknown)"`)
    vi.expect(t.toString(t.intersect(t.null))).toMatchInlineSnapshot(`"t.intersect(t.null)"`)
    vi.expect(t.toString(t.intersect(t.undefined))).toMatchInlineSnapshot(`"t.intersect(t.undefined)"`)
    vi.expect(t.toString(t.intersect(t.symbol))).toMatchInlineSnapshot(`"t.intersect(t.symbol)"`)
    vi.expect(t.toString(t.intersect(t.boolean))).toMatchInlineSnapshot(`"t.intersect(t.boolean)"`)
    vi.expect(t.toString(t.intersect(t.bigint))).toMatchInlineSnapshot(`"t.intersect(t.bigint)"`)
    vi.expect(t.toString(t.intersect(t.number))).toMatchInlineSnapshot(`"t.intersect(t.number)"`)
    vi.expect(t.toString(t.intersect(t.string))).toMatchInlineSnapshot(`"t.intersect(t.string)"`)

    vi.expect(t.toString(t.intersect(t.void, t.never))).toMatchInlineSnapshot(`"t.intersect(t.void, t.never)"`)
    vi.expect(t.toString(t.intersect(t.never, t.never))).toMatchInlineSnapshot(`"t.intersect(t.never, t.never)"`)
    vi.expect(t.toString(t.intersect(t.any, t.never))).toMatchInlineSnapshot(`"t.intersect(t.any, t.never)"`)
    vi.expect(t.toString(t.intersect(t.unknown, t.never))).toMatchInlineSnapshot(`"t.intersect(t.unknown, t.never)"`)
    vi.expect(t.toString(t.intersect(t.null, t.never))).toMatchInlineSnapshot(`"t.intersect(t.null, t.never)"`)
    vi.expect(t.toString(t.intersect(t.undefined, t.never))).toMatchInlineSnapshot(`"t.intersect(t.undefined, t.never)"`)
    vi.expect(t.toString(t.intersect(t.symbol, t.never))).toMatchInlineSnapshot(`"t.intersect(t.symbol, t.never)"`)
    vi.expect(t.toString(t.intersect(t.boolean, t.never))).toMatchInlineSnapshot(`"t.intersect(t.boolean, t.never)"`)
    vi.expect(t.toString(t.intersect(t.bigint, t.never))).toMatchInlineSnapshot(`"t.intersect(t.bigint, t.never)"`)
    vi.expect(t.toString(t.intersect(t.number, t.never))).toMatchInlineSnapshot(`"t.intersect(t.number, t.never)"`)
    vi.expect(t.toString(t.intersect(t.string, t.never))).toMatchInlineSnapshot(`"t.intersect(t.string, t.never)"`)

    vi.expect(t.toString(t.tuple(t.void))).toMatchInlineSnapshot(`"t.tuple(t.void)"`)
    vi.expect(t.toString(t.tuple(t.never))).toMatchInlineSnapshot(`"t.tuple(t.never)"`)
    vi.expect(t.toString(t.tuple(t.any))).toMatchInlineSnapshot(`"t.tuple(t.any)"`)
    vi.expect(t.toString(t.tuple(t.unknown))).toMatchInlineSnapshot(`"t.tuple(t.unknown)"`)
    vi.expect(t.toString(t.tuple(t.null))).toMatchInlineSnapshot(`"t.tuple(t.null)"`)
    vi.expect(t.toString(t.tuple(t.undefined))).toMatchInlineSnapshot(`"t.tuple(t.undefined)"`)
    vi.expect(t.toString(t.tuple(t.symbol))).toMatchInlineSnapshot(`"t.tuple(t.symbol)"`)
    vi.expect(t.toString(t.tuple(t.boolean))).toMatchInlineSnapshot(`"t.tuple(t.boolean)"`)
    vi.expect(t.toString(t.tuple(t.bigint))).toMatchInlineSnapshot(`"t.tuple(t.bigint)"`)
    vi.expect(t.toString(t.tuple(t.number))).toMatchInlineSnapshot(`"t.tuple(t.number)"`)
    vi.expect(t.toString(t.tuple(t.string))).toMatchInlineSnapshot(`"t.tuple(t.string)"`)

    vi.expect(t.toString(t.tuple(t.void, t.never))).toMatchInlineSnapshot(`"t.tuple(t.void, t.never)"`)
    vi.expect(t.toString(t.tuple(t.never, t.never))).toMatchInlineSnapshot(`"t.tuple(t.never, t.never)"`)
    vi.expect(t.toString(t.tuple(t.any, t.never))).toMatchInlineSnapshot(`"t.tuple(t.any, t.never)"`)
    vi.expect(t.toString(t.tuple(t.unknown, t.never))).toMatchInlineSnapshot(`"t.tuple(t.unknown, t.never)"`)
    vi.expect(t.toString(t.tuple(t.null, t.never))).toMatchInlineSnapshot(`"t.tuple(t.null, t.never)"`)
    vi.expect(t.toString(t.tuple(t.undefined, t.never))).toMatchInlineSnapshot(`"t.tuple(t.undefined, t.never)"`)
    vi.expect(t.toString(t.tuple(t.symbol, t.never))).toMatchInlineSnapshot(`"t.tuple(t.symbol, t.never)"`)
    vi.expect(t.toString(t.tuple(t.boolean, t.never))).toMatchInlineSnapshot(`"t.tuple(t.boolean, t.never)"`)
    vi.expect(t.toString(t.tuple(t.bigint, t.never))).toMatchInlineSnapshot(`"t.tuple(t.bigint, t.never)"`)
    vi.expect(t.toString(t.tuple(t.number, t.never))).toMatchInlineSnapshot(`"t.tuple(t.number, t.never)"`)
    vi.expect(t.toString(t.tuple(t.string, t.never))).toMatchInlineSnapshot(`"t.tuple(t.string, t.never)"`)

    vi.expect(t.toString(t.object({ a: t.void }))).toMatchInlineSnapshot(`"t.object({ a: t.void })"`)
    vi.expect(t.toString(t.object({ a: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.any }))).toMatchInlineSnapshot(`"t.object({ a: t.any })"`)
    vi.expect(t.toString(t.object({ a: t.unknown }))).toMatchInlineSnapshot(`"t.object({ a: t.unknown })"`)
    vi.expect(t.toString(t.object({ a: t.null }))).toMatchInlineSnapshot(`"t.object({ a: t.null })"`)
    vi.expect(t.toString(t.object({ a: t.undefined }))).toMatchInlineSnapshot(`"t.object({ a: t.undefined })"`)
    vi.expect(t.toString(t.object({ a: t.symbol }))).toMatchInlineSnapshot(`"t.object({ a: t.symbol })"`)
    vi.expect(t.toString(t.object({ a: t.boolean }))).toMatchInlineSnapshot(`"t.object({ a: t.boolean })"`)
    vi.expect(t.toString(t.object({ a: t.bigint }))).toMatchInlineSnapshot(`"t.object({ a: t.bigint })"`)
    vi.expect(t.toString(t.object({ a: t.number }))).toMatchInlineSnapshot(`"t.object({ a: t.number })"`)
    vi.expect(t.toString(t.object({ a: t.string }))).toMatchInlineSnapshot(`"t.object({ a: t.string })"`)

    vi.expect(t.toString(t.object({ a: t.void, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.void, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.never, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.never, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.any, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.any, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.unknown, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.unknown, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.null, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.null, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.undefined, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.undefined, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.symbol, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.symbol, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.boolean, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.boolean, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.bigint, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.bigint, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.number, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.number, b: t.never })"`)
    vi.expect(t.toString(t.object({ a: t.string, b: t.never }))).toMatchInlineSnapshot(`"t.object({ a: t.string, b: t.never })"`)

    vi.expect(t.toString(t.eq(null))).toMatchInlineSnapshot(`"t.eq(null)"`)
    vi.expect(t.toString(t.eq(0))).toMatchInlineSnapshot(`"t.eq(0)"`)
    vi.expect(t.toString(t.eq(1e+29))).toMatchInlineSnapshot(`"t.eq(1e+29)"`)
    vi.expect(t.toString(t.eq("1.0"))).toMatchInlineSnapshot(`"t.eq("1.0")"`)
    vi.expect(t.toString(t.eq({ _: undefined }))).toMatchInlineSnapshot(`"t.eq({ _: undefined })"`)
    vi.expect(t.toString(t.eq({ _: null }))).toMatchInlineSnapshot(`"t.eq({ _: null })"`)
    vi.expect(t.toString(t.eq(null))).toMatchInlineSnapshot(`"t.eq(null)"`)
    vi.expect(t.toString(t.eq(0))).toMatchInlineSnapshot(`"t.eq(0)"`)
    vi.expect(t.toString(t.eq(1e+29))).toMatchInlineSnapshot(`"t.eq(1e+29)"`)
    vi.expect(t.toString(t.eq("1.0"))).toMatchInlineSnapshot(`"t.eq("1.0")"`)
    vi.expect(t.toString(t.eq([]))).toMatchInlineSnapshot(`"t.eq([])"`)
    vi.expect(t.toString(t.eq([undefined]))).toMatchInlineSnapshot(`"t.eq([undefined])"`)
    vi.expect(t.toString(t.eq([null]))).toMatchInlineSnapshot(`"t.eq([null])"`)
    vi.expect(t.toString(t.eq([[[]]]))).toMatchInlineSnapshot(`"t.eq([[[]]])"`)
    vi                                                                         /// TODO: look into missing `__proto__` property
      .expect(t.toString(t.eq({ '': undefined, _: undefined, '\\': undefined, ['__proto__']: undefined, ['toString']: undefined })))
      .toMatchInlineSnapshot(`"t.eq({ "": undefined, _: undefined, "\\\\": undefined, toString: undefined })"`)
    vi
      .expect(t.toString(t.eq({ '': null, _: null, '\\': null, ['__proto__']: null, ['toString']: null })))
      .toMatchInlineSnapshot(`"t.eq({ "": null, _: null, "\\\\": null, toString: null })"`)
  })
})
