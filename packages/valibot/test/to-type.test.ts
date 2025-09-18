import * as vi from 'vitest'
import * as v from 'valibot'
import prettier from '@prettier/sync'

import { vx } from '@traversable/valibot'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/valibot❳: vx.toType', () => {
  vi.test('〖️⛳️〗› ❲vx.toType❳: jsdoc descriptions', () => {
    vi.expect.soft(format(
      vx.toType(
        v.object({}),
        { preserveJsDocs: true }
      )
    )).toMatchInlineSnapshot
      (`
      "{
      }
      "
    `)
    vi.expect.soft(format(
      vx.toType(
        v.object({
          abc: v.pipe(v.number(), v.description('abc description')),
          def: v.pipe(v.number(), v.description('def description')),
        }),
        { typeName: 'Type', preserveJsDocs: true }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        /**
         * @description abc description
         */
        abc: number
        /**
         * @description def description
         */
        def: number
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲vx.toType❳: jsdoc metadata', () => {
    vi.expect.soft(format(
      vx.toType(
        v.object({
          abc: v.pipe(
            v.string(),
            v.metadata({ a: 1, b: [2, 3, 4, 5] })
          )
        }),
        { preserveJsDocs: true }
      )
    )).toMatchInlineSnapshot
      (`
      "{
        /**
         * @metadata
         * {
         *   "a": 1,
         *   "b": [
         *     2,
         *     3,
         *     4,
         *     5
         *   ]
         * }
         */
        abc: string
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲vx.toType❳: setting `preserveJsDocs` to false ignores jsdocs', () => {
    vi.expect.soft(format(
      vx.toType(
        v.object({
          abc: v.pipe(v.number(), v.description('abc description')),
          def: v.pipe(v.number(), v.description('def description')),
        }),
        { typeName: 'Type', preserveJsDocs: false }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: number; def: number }
      "
    `)
  })
})

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/valibot❳: vx.toType', () => {
  vi.test("〖️⛳️〗› ❲v.never❳ ", () => {
    vi.expect.soft(vx.toType(
      v.never()
    )).toMatchInlineSnapshot
      (`"never"`)
  })

  vi.test("〖️⛳️〗› ❲v.any❳ ", () => {
    vi.expect.soft(vx.toType(
      v.any()
    )).toMatchInlineSnapshot
      (`"any"`)
  })

  vi.test("〖️⛳️〗› ❲v.unknown❳ ", () => {
    vi.expect.soft(vx.toType(
      v.unknown()
    )).toMatchInlineSnapshot
      (`"unknown"`)
  })

  vi.test("〖️⛳️〗› ❲v.void❳ ", () => {
    vi.expect.soft(vx.toType(
      v.void()
    )).toMatchInlineSnapshot
      (`"void"`)
  })

  vi.test("〖️⛳️〗› ❲v.undefined❳ ", () => {
    vi.expect.soft(vx.toType(
      v.undefined()
    )).toMatchInlineSnapshot
      (`"undefined"`)
  })

  vi.test("〖️⛳️〗› ❲v.null❳ ", () => {
    vi.expect.soft(vx.toType(
      v.null()
    )).toMatchInlineSnapshot
      (`"null"`)
  })

  vi.test("〖️⛳️〗› ❲v.symbol❳ ", () => {
    vi.expect.soft(vx.toType(
      v.symbol()
    )).toMatchInlineSnapshot
      (`"symbol"`)
  })

  vi.test("〖️⛳️〗› ❲v.boolean❳ ", () => {
    vi.expect.soft(vx.toType(
      v.boolean()
    )).toMatchInlineSnapshot
      (`"boolean"`)
  })

  vi.test("〖️⛳️〗› ❲v.nan❳ ", () => {
    vi.expect.soft(vx.toType(
      v.nan()
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.test("〖️⛳️〗› ❲v.bigint❳ ", () => {
    vi.expect.soft(vx.toType(
      v.bigint()
    )).toMatchInlineSnapshot
      (`"bigint"`)
  })

  vi.test("〖️⛳️〗› ❲v.number❳ ", () => {
    vi.expect.soft(vx.toType(
      v.number()
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.test("〖️⛳️〗› ❲v.string❳ ", () => {
    vi.expect.soft(vx.toType(
      v.string()
    )).toMatchInlineSnapshot
      (`"string"`)
  })

  vi.test("〖️⛳️〗› ❲v.date❳ ", () => {
    vi.expect.soft(vx.toType(
      v.date()
    )).toMatchInlineSnapshot
      (`"Date"`)
  })

  vi.test("〖️⛳️〗› ❲v.file❳ ", () => {
    vi.expect.soft(vx.toType(
      v.file()
    )).toMatchInlineSnapshot
      (`"File"`)
  })

  vi.test("〖️⛳️〗› ❲v.blob❳ ", () => {
    vi.expect.soft(vx.toType(
      v.blob()
    )).toMatchInlineSnapshot
      (`"Blob"`)
  })

  vi.test("〖️⛳️〗› ❲v.literal❳", () => {
    vi.expect.soft(vx.toType(
      v.literal("")
    )).toMatchInlineSnapshot
      (`""""`)
    vi.expect.soft(vx.toType(
      v.literal(0)
    )).toMatchInlineSnapshot
      (`"0"`)
    vi.expect.soft(vx.toType(
      v.literal(-0)
    )).toMatchInlineSnapshot
      (`"0"`)
    vi.expect.soft(vx.toType(
      v.literal(false)
    )).toMatchInlineSnapshot
      (`"false"`)
  })

  vi.test("〖️⛳️〗› ❲v.picklist❳", () => {
    vi.expect.soft(vx.toType(
      v.picklist([])
    )).toMatchInlineSnapshot
      (`"never"`)
    vi.expect.soft(vx.toType(
      v.picklist(['one', 'two', 'three'])
    )).toMatchInlineSnapshot
      (`""one" | "two" | "three""`)
  })

  vi.test("〖️⛳️〗› ❲v.enum❳", () => {
    vi.expect.soft(vx.toType(
      v.enum({})
    )).toMatchInlineSnapshot
      (`"never"`)
    vi.expect.soft(vx.toType(
      v.enum({
        Gob: "The Magician",
        Lindsay: "The Humanitarian",
        Byron: "The Scholar",
        Tobias: "The Analrapist",
      })
    )).toMatchInlineSnapshot
      (`""The Magician" | "The Humanitarian" | "The Scholar" | "The Analrapist""`)
  })

  vi.test("〖️⛳️〗› ❲v.set❳ ", () => {
    vi.expect.soft(vx.toType(
      v.set(v.literal(1))
    )).toMatchInlineSnapshot
      (`"Set<1>"`)
  })

  vi.test("〖️⛳️〗› ❲v.map❳ ", () => {
    vi.expect.soft(vx.toType(
      v.map(v.literal(1), v.literal(2))
    )).toMatchInlineSnapshot
      (`"Map<1, 2>"`)
  })

  vi.test("〖️⛳️〗› ❲v.readonly❳ ", () => {
    vi.expect.soft(vx.toType(
      v.pipe(v.literal(1), v.readonly())
    )).toMatchInlineSnapshot
      (`"1"`)
    vi.expect.soft(vx.toType(
      v.pipe(v.array(v.literal(1)), v.readonly())
    )).toMatchInlineSnapshot
      (`"ReadonlyArray<1>"`)
    vi.expect.soft(vx.toType(
      v.pipe(v.tuple([v.literal(1)]), v.readonly())
    )).toMatchInlineSnapshot
      (`"readonly [1]"`)
    vi.expect.soft(vx.toType(
      v.pipe(v.looseTuple([v.literal(1)]), v.readonly())
    )).toMatchInlineSnapshot
      (`"readonly [1]"`)
    vi.expect.soft(vx.toType(
      v.pipe(v.strictTuple([v.literal(1)]), v.readonly())
    )).toMatchInlineSnapshot
      (`"readonly [1]"`)
    vi.expect.soft(vx.toType(
      v.pipe(v.tupleWithRest([v.literal(1)], v.literal(2)), v.readonly())
    )).toMatchInlineSnapshot
      (`"readonly [1, ...2[]]"`)
    vi.expect.soft(vx.toType(
      v.object({
        abc: v.pipe(v.literal(1), v.readonly()),
        def: v.literal(2),
      })
    )).toMatchInlineSnapshot
      (`"{ readonly abc: 1, def: 2 }"`)
    vi.expect.soft(vx.toType(
      v.looseObject({
        abc: v.pipe(v.literal(1), v.readonly()),
        def: v.literal(2),
      })
    )).toMatchInlineSnapshot
      (`"{ readonly abc: 1, def: 2 }"`)
    vi.expect.soft(vx.toType(
      v.strictObject({
        abc: v.pipe(v.literal(1), v.readonly()),
        def: v.literal(2),
      })
    )).toMatchInlineSnapshot
      (`"{ readonly abc: 1, def: 2 }"`)
    vi.expect.soft(vx.toType(
      v.objectWithRest({
        abc: v.pipe(v.literal(1), v.readonly()),
        def: v.literal(2),
      }, v.boolean())
    )).toMatchInlineSnapshot
      (`"{ readonly abc: 1, def: 2 } & { [x: string]: boolean }"`)
    vi.expect.soft(vx.toType(
      v.pipe(
        v.object({
          abc: v.pipe(v.literal(1), v.readonly()),
          def: v.literal(2),
        }),
        v.readonly(),
      )
    )).toMatchInlineSnapshot
      (`"Readonly<{ readonly abc: 1, def: 2 }>"`)
    vi.expect.soft(vx.toType(
      v.pipe(
        v.looseObject({
          abc: v.pipe(v.literal(1), v.readonly()),
          def: v.literal(2),
        }),
        v.readonly(),
      )
    )).toMatchInlineSnapshot
      (`"Readonly<{ readonly abc: 1, def: 2 }>"`)
    vi.expect.soft(vx.toType(
      v.pipe(
        v.strictObject({
          abc: v.pipe(v.literal(1), v.readonly()),
          def: v.literal(2),
        }),
        v.readonly(),
      )
    )).toMatchInlineSnapshot
      (`"Readonly<{ readonly abc: 1, def: 2 }>"`)
    vi.expect.soft(vx.toType(
      v.pipe(
        v.objectWithRest({
          abc: v.pipe(v.literal(1), v.readonly()),
          def: v.literal(2),
        }, v.literal(3)),
        v.readonly(),
      )
    )).toMatchInlineSnapshot
      (`"Readonly<{ readonly abc: 1, def: 2 } & { [x: string]: 3 }>"`)
  })

  vi.test("〖️⛳️〗› ❲v.optional❳ ", () => {
    vi.expect.soft(vx.toType(
      v.optional(v.literal(1))
    )).toMatchInlineSnapshot
      (`"undefined | 1"`)
    vi.expect.soft(vx.toType(
      v.object({ a: v.optional(v.literal(1)) })
    )).toMatchInlineSnapshot
      (`"{ a?: undefined | 1 }"`)
  })

  vi.test("〖️⛳️〗› ❲v.exactOptional❳ ", () => {
    vi.expect.soft(vx.toType(
      v.exactOptional(v.literal(1))
    )).toMatchInlineSnapshot
      (`"undefined | 1"`)
    vi.expect.soft(vx.toType(
      v.object({ a: v.exactOptional(v.literal(1)) })
    )).toMatchInlineSnapshot
      (`"{ a?: undefined | 1 }"`)
  })

  vi.test("〖️⛳️〗› ❲v.nullable❳ ", () => {
    vi.expect.soft(vx.toType(
      v.nullable(v.literal(1))
    )).toMatchInlineSnapshot
      (`"null | 1"`)
    vi.expect.soft(vx.toType(
      v.nullable(v.tuple([v.enum({ $B$i_kx$Bsk: "_Nd0$W55", _n_5_4UR6_: "f64__Q_I4rW", $$7y_$mA9: "$_$p$4_r", dA7_1: "v$_6_", v5$_w: "q$$8z4", _NW$7h67: "_h", $CWH$A9: "$$$_J", K5X6: "_84_Ysi", _qq$: "PK4$iv$5_", $pUw$$_$__: "_c7i5m_n$_4", $$77$6: "J", v_$$_: "_G_2_$W$_" })]))
    )).toMatchInlineSnapshot
      (`"null | [("_Nd0$W55" | "f64__Q_I4rW" | "$_$p$4_r" | "v$_6_" | "q$$8z4" | "_h" | "$$$_J" | "_84_Ysi" | "PK4$iv$5_" | "_c7i5m_n$_4" | "J" | "_G_2_$W$_")]"`)
    vi.expect.soft(vx.toType(
      v.nullable(v.tuple([v.any()])),
      { typeName: 'Type' }
    )).toMatchInlineSnapshot
      (`"type Type = null | [any]"`)
  })

  vi.test("〖️⛳️〗› ❲v.array❳ ", () => {
    vi.expect.soft(vx.toType(
      v.array(v.literal(1))
    )).toMatchInlineSnapshot
      (`"Array<1>"`)
  })

  vi.test("〖️⛳️〗› ❲v.record❳ ", () => {
    vi.expect.soft(vx.toType(
      v.record(v.string(), v.literal(1))
    )).toMatchInlineSnapshot
      (`"Record<string, 1>"`)
    vi.expect.soft(vx.toType(
      v.record(v.picklist([]), v.literal(1))
    )).toMatchInlineSnapshot
      (`"Record<never, 1>"`)
    vi.expect.soft(vx.toType(
      v.record(v.picklist(['a', 'b', 'c']), v.literal(1))
    )).toMatchInlineSnapshot
      (`"Record<("a" | "b" | "c"), 1>"`)
    vi.expect.soft(vx.toType(
      v.record(v.enum({ A: 'a', B: 'b', C: 'c' }), v.literal(1))
    )).toMatchInlineSnapshot
      (`"Record<("a" | "b" | "c"), 1>"`)
  })

  vi.test("〖️⛳️〗› ❲v.intersection❳ ", () => {
    vi.expect.soft(vx.toType(
      v.intersect([v.object({ a: v.literal(1) }), v.object({ b: v.literal(2) })])
    )).toMatchInlineSnapshot
      (`"{ a: 1 } & { b: 2 }"`)
    vi.expect.soft(vx.toType(
      v.intersect([v.number(), v.union([v.literal(1), v.literal(2), v.literal(3)])])
    )).toMatchInlineSnapshot
      (`"number & (1 | 2 | 3)"`)
  })

  vi.test("〖️⛳️〗› ❲v.union❳ ", () => {
    vi.expect.soft(vx.toType(
      v.union([])
    )).toMatchInlineSnapshot
      (`"never"`)
    vi.expect.soft(vx.toType(
      v.union([v.literal(1)])
    )).toMatchInlineSnapshot
      (`"1"`)
    vi.expect.soft(vx.toType(
      v.union([v.literal(1), v.literal(2)])
    )).toMatchInlineSnapshot
      (`"1 | 2"`)
    vi.expect.soft(vx.toType(
      v.union([v.null(), v.symbol(), v.map(v.string(), v.void()), v.never(), v.any()])
    )).toMatchInlineSnapshot
      (`"null | symbol | Map<string, void> | never | any"`)
  })

  vi.test("〖️⛳️〗› ❲v.variant❳ ", () => {
    vi.expect.soft(vx.toType(
      v.variant('', [])
    )).toMatchInlineSnapshot
      (`"never"`)
    vi.expect.soft(vx.toType(
      v.variant('', [v.object({ '': v.literal('A') })])
    )).toMatchInlineSnapshot
      (`"{ "": "A" }"`)
    vi.expect.soft(vx.toType(
      v.variant(
        '',
        [
          v.object({ '': v.literal('A') }),
          v.object({ '': v.literal('B') }),
        ]
      )
    )).toMatchInlineSnapshot
      (`"{ "": "A" } | { "": "B" }"`)
    vi.expect.soft(vx.toType(
      v.variant(
        '',
        [
          v.object({ '': v.literal('A'), onA: v.literal(1) }),
          v.object({ '': v.literal('B'), onB: v.literal(2) }),
        ]
      )
    )).toMatchInlineSnapshot
      (`"{ "": "A", onA: 1 } | { "": "B", onB: 2 }"`)
  })

  vi.test("〖️⛳️〗› ❲v.lazy❳ ", () => {
    vi.expect.soft(vx.toType(
      v.lazy(() => v.literal(1))
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.test("〖️⛳️〗› ❲v.nonOptional❳ ", () => {
    vi.expect.soft(vx.toType(
      v.nonOptional(v.literal(1))
    )).toMatchInlineSnapshot
      (`"Exclude<1, undefined>"`)
    vi.expect.soft(vx.toType(
      v.nonOptional(v.union([v.literal(1), v.undefined()]))
    )).toMatchInlineSnapshot
      (`"Exclude<(1 | undefined), undefined>"`)
    vi.expect.soft(vx.toType(
      v.nonOptional(v.optional(v.literal(1)))
    )).toMatchInlineSnapshot
      (`"Exclude<undefined | 1, undefined>"`)
  })

  vi.test("〖️⛳️〗› ❲v.undefinedable❳ ", () => {
    vi.expect.soft(vx.toType(
      v.undefinedable(v.literal(1))
    )).toMatchInlineSnapshot
      (`"undefined | 1"`)
    vi.expect.soft(vx.toType(
      v.undefinedable(v.union([v.literal(1), v.undefined()]))
    )).toMatchInlineSnapshot
      (`"undefined | (1 | undefined)"`)
    vi.expect.soft(vx.toType(
      v.undefinedable(v.optional(v.literal(1)))
    )).toMatchInlineSnapshot
      (`"undefined | undefined | 1"`)
  })

  vi.test("〖️⛳️〗› ❲v.nonNullable❳ ", () => {
    vi.expect.soft(vx.toType(
      v.nonNullable(v.literal(1))
    )).toMatchInlineSnapshot
      (`"Exclude<1, null>"`)
    vi.expect.soft(vx.toType(
      v.nonNullable(v.union([v.literal(1), v.undefined()]))
    )).toMatchInlineSnapshot
      (`"Exclude<(1 | undefined), null>"`)
    vi.expect.soft(vx.toType(
      v.nonNullable(v.nullable(v.literal(1)))
    )).toMatchInlineSnapshot
      (`"Exclude<null | 1, null>"`)
  })

  vi.test("〖️⛳️〗› ❲v.nullish❳ ", () => {
    vi.expect.soft(vx.toType(
      v.nullish(v.literal(1))
    )).toMatchInlineSnapshot
      (`"null | undefined | 1"`)
    vi.expect.soft(vx.toType(
      v.nullish(v.union([v.literal(1), v.undefined()]))
    )).toMatchInlineSnapshot
      (`"null | undefined | (1 | undefined)"`)
    vi.expect.soft(vx.toType(
      v.nullish(v.optional(v.literal(1)))
    )).toMatchInlineSnapshot
      (`"null | undefined | undefined | 1"`)
  })

  vi.test("〖️⛳️〗› ❲v.nonNullish❳ ", () => {
    vi.expect.soft(vx.toType(
      v.nonNullish(v.literal(1))
    )).toMatchInlineSnapshot
      (`"NonNullable<1>"`)
    vi.expect.soft(vx.toType(
      v.nonNullish(v.union([v.literal(1), v.undefined()]))
    )).toMatchInlineSnapshot
      (`"NonNullable<(1 | undefined)>"`)
    vi.expect.soft(vx.toType(
      v.nonNullish(v.nullish(v.literal(1)))
    )).toMatchInlineSnapshot
      (`"NonNullable<null | undefined | 1>"`)
  })

  vi.test("〖️⛳️〗› ❲v.tuple❳", () => {
    vi.expect.soft(vx.toType(
      v.tuple([])
    )).toMatchInlineSnapshot
      (`"[]"`)
    vi.expect.soft(vx.toType(
      v.tuple([
        v.string(),
        v.number(),
        v.object({ pointsScored: v.number() })
      ])
    )).toMatchInlineSnapshot
      (`"[string, number, { pointsScored: number }]"`)
  })

  vi.test("〖️⛳️〗› ❲v.looseTuple❳", () => {
    vi.expect.soft(vx.toType(
      v.looseTuple([])
    )).toMatchInlineSnapshot
      (`"[]"`)
    vi.expect.soft(vx.toType(
      v.looseTuple([
        v.string(),
        v.number(),
        v.object({ pointsScored: v.number() })
      ])
    )).toMatchInlineSnapshot
      (`"[string, number, { pointsScored: number }]"`)
  })

  vi.test("〖️⛳️〗› ❲v.strictTuple❳", () => {
    vi.expect.soft(vx.toType(
      v.strictTuple([])
    )).toMatchInlineSnapshot
      (`"[]"`)
    vi.expect.soft(vx.toType(
      v.strictTuple([
        v.string(),
        v.number(),
        v.object({ pointsScored: v.number() })
      ])
    )).toMatchInlineSnapshot
      (`"[string, number, { pointsScored: number }]"`)
  })

  vi.test("〖️⛳️〗› ❲v.tupleWithRest❳", () => {
    vi.expect.soft(vx.toType(
      v.tupleWithRest([], v.literal(1))
    )).toMatchInlineSnapshot
      (`"[...1[]]"`)
    vi.expect.soft(vx.toType(
      v.tupleWithRest([
        v.string(),
        v.number(),
        v.object({ pointsScored: v.number() })
      ], v.literal(2))
    )).toMatchInlineSnapshot
      (`"[string, number, { pointsScored: number }, ...2[]]"`)
  })

  vi.test("〖️⛳️〗› ❲v.object❳", () => {
    vi.expect.soft(vx.toType(
      v.object({ powerlevel: v.union([v.string(), v.number()]) })
    )).toMatchInlineSnapshot
      (`"{ powerlevel: (string | number) }"`)
    vi.expect.soft(vx.toType(
      v.object({ a: v.string() })
    )).toMatchInlineSnapshot
      (`"{ a: string }"`)
    vi.expect.soft(vx.toType(
      v.object({
        v: v.number(),
        w: v.number(),
        x: v.number(),
        y: v.number(),
        z: v.number(),
      }),
    )).toMatchInlineSnapshot
      (`"{ v: number, w: number, x: number, y: number, z: number }"`)
    vi.expect.soft(vx.toType(
      v.object({
        x: v.array(v.number()),
        y: v.array(v.number()),
        z: v.array(v.array(v.array(v.literal('z')))),
      }),
    )).toMatchInlineSnapshot
      (`"{ x: Array<number>, y: Array<number>, z: Array<Array<Array<"z">>> }"`)
  })

  vi.test("〖️⛳️〗› ❲v.looseObject❳", () => {
    vi.expect.soft(vx.toType(
      v.looseObject({ powerlevel: v.union([v.string(), v.number()]) })
    )).toMatchInlineSnapshot
      (`"{ powerlevel: (string | number) }"`)
    vi.expect.soft(vx.toType(
      v.looseObject({ a: v.string() })
    )).toMatchInlineSnapshot
      (`"{ a: string }"`)
    vi.expect.soft(vx.toType(
      v.looseObject({
        v: v.number(),
        w: v.number(),
        x: v.number(),
        y: v.number(),
        z: v.number(),
      }),
    )).toMatchInlineSnapshot
      (`"{ v: number, w: number, x: number, y: number, z: number }"`)
    vi.expect.soft(vx.toType(
      v.looseObject({
        x: v.array(v.number()),
        y: v.array(v.number()),
        z: v.array(v.array(v.array(v.literal('z')))),
      }),
    )).toMatchInlineSnapshot
      (`"{ x: Array<number>, y: Array<number>, z: Array<Array<Array<"z">>> }"`)
  })

  vi.test("〖️⛳️〗› ❲v.strictObject❳", () => {
    vi.expect.soft(vx.toType(
      v.strictObject({ powerlevel: v.union([v.string(), v.number()]) })
    )).toMatchInlineSnapshot
      (`"{ powerlevel: (string | number) }"`)
    vi.expect.soft(vx.toType(
      v.strictObject({ a: v.string() })
    )).toMatchInlineSnapshot
      (`"{ a: string }"`)
    vi.expect.soft(vx.toType(
      v.looseObject({
        v: v.number(),
        w: v.number(),
        x: v.number(),
        y: v.number(),
        z: v.number(),
      }),
    )).toMatchInlineSnapshot
      (`"{ v: number, w: number, x: number, y: number, z: number }"`)
    vi.expect.soft(vx.toType(
      v.strictObject({
        x: v.array(v.number()),
        y: v.array(v.number()),
        z: v.array(v.array(v.array(v.literal('z')))),
      }),
    )).toMatchInlineSnapshot
      (`"{ x: Array<number>, y: Array<number>, z: Array<Array<Array<"z">>> }"`)
  })

  vi.test("〖️⛳️〗› ❲v.objectWithRest❳", () => {
    vi.expect.soft(vx.toType(
      v.objectWithRest({}, v.literal(1))
    )).toMatchInlineSnapshot
      (`"{}"`)
    vi.expect.soft(vx.toType(
      v.objectWithRest({
        powerlevel: v.union([v.string(), v.number()])
      }, v.literal(2))
    )).toMatchInlineSnapshot
      (`"{ powerlevel: (string | number) } & { [x: string]: 2 }"`)
    vi.expect.soft(vx.toType(
      v.objectWithRest({
        v: v.number(),
        w: v.number(),
        x: v.number(),
        y: v.number(),
        z: v.number(),
      }, v.literal(3)),
    )).toMatchInlineSnapshot
      (`"{ v: number, w: number, x: number, y: number, z: number } & { [x: string]: 3 }"`)
    vi.expect.soft(vx.toType(
      v.objectWithRest({
        x: v.array(v.number()),
        y: v.array(v.number()),
        z: v.array(v.array(v.array(v.literal('z')))),
      }, v.literal(4)),
    )).toMatchInlineSnapshot
      (`"{ x: Array<number>, y: Array<number>, z: Array<Array<Array<"z">>> } & { [x: string]: 4 }"`)
  })
})

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/valibot❳: vx.toType w/ typeName", () => {
  vi.test("〖️⛳️〗› ❲v.object❳", () => {
    vi.expect.soft(
      vx.toType(v.object({ a: v.optional(v.number()) }), { typeName: 'MyType' })
    ).toMatchInlineSnapshot
      (`"type MyType = { a?: undefined | number }"`)
  })
})
