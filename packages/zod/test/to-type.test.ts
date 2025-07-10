import * as vi from "vitest"
import { z } from "zod/v4"

import { zx } from "@traversable/zod"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.toType", () => {
  vi.it("〖️⛳️〗› ❲z.never❳ ", () => {
    vi.expect.soft(zx.toType(
      z.never()
    )).toMatchInlineSnapshot
      (`"never"`)
  })

  vi.it("〖️⛳️〗› ❲z.any❳ ", () => {
    vi.expect.soft(zx.toType(
      z.any()
    )).toMatchInlineSnapshot
      (`"any"`)
  })

  vi.it("〖️⛳️〗› ❲z.unknown❳ ", () => {
    vi.expect.soft(zx.toType(
      z.unknown()
    )).toMatchInlineSnapshot
      (`"unknown"`)
  })

  vi.it("〖️⛳️〗› ❲z.void❳ ", () => {
    vi.expect.soft(zx.toType(
      z.void()
    )).toMatchInlineSnapshot
      (`"void"`)
  })

  vi.it("〖️⛳️〗› ❲z.undefined❳ ", () => {
    vi.expect.soft(zx.toType(
      z.undefined()
    )).toMatchInlineSnapshot
      (`"undefined"`)
  })

  vi.it("〖️⛳️〗› ❲z.null❳ ", () => {
    vi.expect.soft(zx.toType(
      z.null()
    )).toMatchInlineSnapshot
      (`"null"`)
  })

  vi.it("〖️⛳️〗› ❲z.symbol❳ ", () => {
    vi.expect.soft(zx.toType(
      z.symbol()
    )).toMatchInlineSnapshot
      (`"symbol"`)
  })

  vi.it("〖️⛳️〗› ❲z.boolean❳ ", () => {
    vi.expect.soft(zx.toType(
      z.boolean()
    )).toMatchInlineSnapshot
      (`"boolean"`)
  })

  vi.it("〖️⛳️〗› ❲z.nan❳ ", () => {
    vi.expect.soft(zx.toType(
      z.nan()
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.it("〖️⛳️〗› ❲z.bigint❳ ", () => {
    vi.expect.soft(zx.toType(
      z.bigint()
    )).toMatchInlineSnapshot
      (`"bigint"`)
  })

  vi.it("〖️⛳️〗› ❲z.number❳ ", () => {
    vi.expect.soft(zx.toType(
      z.number()
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.it("〖️⛳️〗› ❲z.string❳ ", () => {
    vi.expect.soft(zx.toType(
      z.string()
    )).toMatchInlineSnapshot
      (`"string"`)
  })

  vi.it("〖️⛳️〗› ❲z.date❳ ", () => {
    vi.expect.soft(zx.toType(
      z.date()
    )).toMatchInlineSnapshot
      (`"Date"`)
  })

  vi.it("〖️⛳️〗› ❲z.file❳ ", () => {
    vi.expect.soft(zx.toType(
      z.file()
    )).toMatchInlineSnapshot
      (`"File"`)
  })

  vi.it("〖️⛳️〗› ❲z.literal❳", () => {
    vi.expect.soft(zx.toType(
      z.literal(null)
    )).toMatchInlineSnapshot
      (`"null"`)
    vi.expect.soft(zx.toType(
      z.literal(undefined)
    )).toMatchInlineSnapshot
      (`"undefined"`)
    vi.expect.soft(zx.toType(
      z.literal("My name is Inigo Montoya")
    )).toMatchInlineSnapshot
      (`""My name is Inigo Montoya""`)
    vi.expect.soft(zx.toType(
      z.literal(["bulbasaur", "ivysaur", "venusaur"])
    )).toMatchInlineSnapshot
      (`""bulbasaur" | "ivysaur" | "venusaur""`)
  })

  vi.it("〖️⛳️〗› ❲z.templateLiteral❳", () => {
    vi.expect.soft(zx.toType(
      z.templateLiteral([])
    )).toMatchInlineSnapshot
      (`""""`)
    vi.expect.soft(zx.toType(
      z.templateLiteral([undefined])
    )).toMatchInlineSnapshot
      (`""""`)
    vi.expect.soft(zx.toType(
      z.templateLiteral([null])
    )).toMatchInlineSnapshot
      (`""null""`)
    vi.expect.soft(zx.toType(
      z.templateLiteral([undefined, null])
    )).toMatchInlineSnapshot
      (`""null""`)
    vi.expect.soft(zx.toType(
      z.templateLiteral([1, -1n, 9000])
    )).toMatchInlineSnapshot
      (`""1-19000""`)
    vi.expect.soft(zx.toType(
      z.templateLiteral([z.boolean()])
    )).toMatchInlineSnapshot
      (`""true" | "false""`)
    vi.expect.soft(zx.toType(
      z.templateLiteral(['a', z.boolean(), 'b'])
    )).toMatchInlineSnapshot
      (`""atrueb" | "afalseb""`)
    vi.expect.soft(zx.toType(
      z.templateLiteral(["charmander", "charmeleon", "charizard"])
    )).toMatchInlineSnapshot
      (`""charmandercharmeleoncharizard""`)
    vi.expect.soft(zx.toType(
      z.templateLiteral([z.boolean(), ' ', z.boolean(), ' ', z.boolean()])
    )).toMatchInlineSnapshot
      (`""true true true" | "true true false" | "true false true" | "true false false" | "false true true" | "false true false" | "false false true" | "false false false""`)
    vi.expect.soft(zx.toType(
      z.templateLiteral([z.literal(['a', 'b']), ' ', z.literal(['c', 'd']), ' ', z.literal(['e', 'f']), ' ', z.literal(['g', 'h'])])
    )).toMatchInlineSnapshot
      (`""a c e g" | "a c e h" | "a c f g" | "a c f h" | "a d e g" | "a d e h" | "a d f g" | "a d f h" | "b c e g" | "b c e h" | "b c f g" | "b c f h" | "b d e g" | "b d e h" | "b d f g" | "b d f h""`)
  })

  vi.it("〖️⛳️〗› ❲z.enum❳", () => {
    vi.expect.soft(zx.toType(
      z.enum([])
    )).toMatchInlineSnapshot
      (`"never"`)
    vi.expect.soft(zx.toType(
      z.enum(['one', 'two', 'three'])
    )).toMatchInlineSnapshot
      (`"("one" | "two" | "three")"`)
    vi.expect.soft(zx.toType(
      z.enum({
        Gob: "The Magician",
        Lindsay: "The Humanitarian",
        Byron: "The Scholar",
        Tobias: "The Analrapist",
      })
    )).toMatchInlineSnapshot
      (`"("The Magician" | "The Humanitarian" | "The Scholar" | "The Analrapist")"`)
  })

  vi.it("〖️⛳️〗› ❲z.set❳ ", () => {
    vi.expect.soft(zx.toType(
      z.set(z.literal(1))
    )).toMatchInlineSnapshot
      (`"Set<1>"`)
  })

  vi.it("〖️⛳️〗› ❲z.map❳ ", () => {
    vi.expect.soft(zx.toType(
      z.map(z.literal(1), z.literal(2))
    )).toMatchInlineSnapshot
      (`"Map<1, 2>"`)
  })

  vi.it("〖️⛳️〗› ❲z.readonly❳ ", () => {
    vi.expect.soft(zx.toType(
      z.readonly(z.literal(1))
    )).toMatchInlineSnapshot
      (`"1"`)

    vi.expect.soft(zx.toType(
      z.lazy(() => z.any()).readonly()
    )).toMatchInlineSnapshot
      (`"any"`)
  })

  vi.it("〖️⛳️〗› ❲z.optional❳ ", () => {
    vi.expect.soft(zx.toType(
      z.optional(z.literal(1))
    )).toMatchInlineSnapshot
      (`"undefined | 1"`)
    vi.expect.soft(zx.toType(
      z.object({ a: z.optional(z.literal(1)) })
    )).toMatchInlineSnapshot
      (`"{ a?: 1 }"`)
  })

  vi.it("〖️⛳️〗› ❲z.nullable❳ ", () => {
    vi.expect.soft(zx.toType(
      z.nullable(z.literal(1))
    )).toMatchInlineSnapshot
      (`"null | 1"`)
  })

  vi.it("〖️⛳️〗› ❲z.array❳ ", () => {
    vi.expect.soft(zx.toType(
      z.array(z.literal(1))
    )).toMatchInlineSnapshot
      (`"Array<1>"`)
  })

  vi.it("〖️⛳️〗› ❲z.record❳ ", () => {
    vi.expect.soft(zx.toType(
      z.record(z.string(), z.literal(1))
    )).toMatchInlineSnapshot
      (`"Record<string, 1>"`)
    vi.expect.soft(zx.toType(
      z.record(z.enum([]), z.literal(1))
    )).toMatchInlineSnapshot
      (`"Record<never, 1>"`)
    vi.expect.soft(zx.toType(
      z.record(z.enum(['a', 'b', 'c']), z.literal(1))
    )).toMatchInlineSnapshot
      (`"Record<("a" | "b" | "c"), 1>"`)
    vi.expect.soft(zx.toType(
      z.record(z.number(), z.literal(1))
    )).toMatchInlineSnapshot
      (`"Record<number, 1>"`)
    vi.expect.soft(zx.toType(
      z.record(z.union([z.string(), z.number(), z.symbol()]), z.literal(1))
    )).toMatchInlineSnapshot
      (`"Record<(string | number | symbol), 1>"`)
  })

  vi.it("〖️⛳️〗› ❲z.intersection❳ ", () => {
    vi.expect.soft(zx.toType(
      z.intersection(z.object({ a: z.literal(1) }), z.object({ b: z.literal(2) }))
    )).toMatchInlineSnapshot
      (`"{ a: 1 } & { b: 2 }"`)
    vi.expect.soft(zx.toType(
      z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))
    )).toMatchInlineSnapshot
      (`"number & (1 | 2 | 3)"`)
  })

  vi.it("〖️⛳️〗› ❲z.union❳ ", () => {
    vi.expect.soft(zx.toType(
      z.union([])
    )).toMatchInlineSnapshot
      (`"never"`)
    vi.expect.soft(zx.toType(
      z.union([z.literal(1)])
    )).toMatchInlineSnapshot
      (`"(1)"`)
    vi.expect.soft(zx.toType(
      z.union([z.literal(1), z.literal(2)])
    )).toMatchInlineSnapshot
      (`"(1 | 2)"`)
    vi.expect.soft(zx.toType(
      z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])
    )).toMatchInlineSnapshot
      (`"(null | symbol | Map<string, void> | never | any)"`)
  })

  vi.it("〖️⛳️〗› ❲z.lazy❳ ", () => {
    vi.expect.soft(zx.toType(
      z.lazy(() => z.literal(1))
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.it("〖️⛳️〗› ❲z.pipe❳ ", () => {
    vi.expect.soft(zx.toType(
      z.pipe(z.number(), z.int())
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.it("〖️⛳️〗› ❲z.default❳ ", () => {
    vi.expect.soft(zx.toType(
      z.literal(1).default(1)
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.it("〖️⛳️〗› ❲z.prefault❳ ", () => {
    vi.expect.soft(zx.toType(
      z.literal(1).prefault(1)
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.it("〖️⛳️〗› ❲z.catch❳ ", () => {
    vi.expect.soft(zx.toType(
      z.literal(1).catch(1)
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.it("〖️⛳️〗› ❲z.nonoptional❳ ", () => {
    vi.expect.soft(zx.toType(
      z.nonoptional(z.literal(1))
    )).toMatchInlineSnapshot
      (`"Exclude<1, undefined>"`)
    vi.expect.soft(zx.toType(
      z.nonoptional(z.union([z.literal(1), z.undefined()]))
    )).toMatchInlineSnapshot
      (`"Exclude<(1 | undefined), undefined>"`)
    vi.expect.soft(zx.toType(
      z.nonoptional(z.optional(z.literal(1)))
    )).toMatchInlineSnapshot
      (`"Exclude<undefined | 1, undefined>"`)
  })

  vi.it("〖️⛳️〗› ❲z.tuple❳", () => {
    vi.expect.soft(zx.toType(
      z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])
    )).toMatchInlineSnapshot
      (`"[string, number, { pointsScored: number }]"`)
    vi.expect.soft(zx.toType(
      z.tuple([z.number()]).rest(z.boolean())
    )).toMatchInlineSnapshot
      (`"[number, ...boolean[]]"`)
  })

  vi.it("〖️⛳️〗› ❲z.object❳", () => {
    vi.expect.soft(zx.toType(
      z.object({ powerlevel: z.union([z.string(), z.number()]).default(9001) })
    )).toMatchInlineSnapshot
      (`"{ powerlevel: (string | number) }"`)
    vi.expect.soft(zx.toType(
      z.object({ a: z.string() }).catchall(z.boolean())
    )).toMatchInlineSnapshot
      (`"{ a: string } & { [x: string]: boolean }"`)
    vi.expect.soft(zx.toType(
      z.object({
        v: z.number().int(),
        w: z.number().min(0).lt(2),
        x: z.number().multipleOf(2),
        y: z.number().max(2).gt(0),
        z: z.number().nullable()
      }),
    )).toMatchInlineSnapshot
      (`"{ v: number, w: number, x: number, y: number, z: null | number }"`)
    vi.expect.soft(zx.toType(
      z.object({
        x: z.array(z.number()).min(0).max(1),
        y: z.array(z.number()).length(1),
        z: z.array(z.array(z.array(z.literal('z')).min(1)).max(2)).length(3)
      }),
    )).toMatchInlineSnapshot
      (`"{ x: Array<number>, y: Array<number>, z: Array<Array<Array<"z">>> }"`)
  })

  /** @deprecated */
  vi.it("〖️⛳️〗› ❲z.promise❳", () => {
    vi.expect.soft(zx.toType(
      z.promise(z.never())
    )).toMatchInlineSnapshot
      (`"Promise<never>"`)
  })
})

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.toType w/ typeName", () => {
  vi.it("〖️⛳️〗› ❲z.object❳", () => {
    vi.expect.soft(
      zx.toType(z.object({ a: z.optional(z.number()) }), { typeName: 'MyType' })
    ).toMatchInlineSnapshot
      (`"type MyType = { a?: number }"`)
  })
})
