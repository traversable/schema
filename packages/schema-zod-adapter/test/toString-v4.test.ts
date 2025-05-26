import * as vi from "vitest"
import { z } from "zod/v4"

import { v4 } from "@traversable/schema-zod-adapter"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳: v4.toString", () => {
  vi.it("〖️⛳️〗› ❲z.brand❳ ", () => {
    vi.expect(v4.toString(
      z.number().brand())
    ).toMatchInlineSnapshot
      (`"z.number()"`)
  })

  vi.it("〖️⛳️〗› ❲z.brand❳: TODO", () => {
    vi.expect(v4.toString(
      z.number().brand())
    ).toMatchInlineSnapshot
      (`"z.number()"`)
  })

  vi.it("〖️⛳️〗› ❲z.date❳", () => {
    vi.expect(v4.toString(
      z.date()
    )).toMatchInlineSnapshot
      (`"z.date()"`)
  })

  vi.it("〖️⛳️〗› ❲z.array❳", () => {
    vi.expect(v4.toString(
      z.array(z.string())
    )).toMatchInlineSnapshot
      (`"z.array(z.string())"`)

    vi.expect(v4.toString(
      z.string().array()
    )).toMatchInlineSnapshot
      (`"z.array(z.string())"`)
  })

  vi.it("〖️⛳️〗› ❲z.record❳", () => {
    vi.expect(v4.toString(
      z.record(z.string(), z.record(z.string(), z.array(z.number())))
    )).toMatchInlineSnapshot
      (`"z.record(z.string(), z.record(z.string(), z.array(z.number())))"`)
  })

  vi.it("〖️⛳️〗› ❲z.union❳", () => {
    vi.expect(v4.toString(
      z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])
    )).toMatchInlineSnapshot
      (`"z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])"`)
  })

  vi.it("〖️⛳️〗› ❲z.intersection❳", () => {
    vi.expect(v4.toString(
      z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))
    )).toMatchInlineSnapshot
      (`"z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))"`)
  })


  vi.it("〖️⛳️〗› ❲z.tuple❳", () => {
    vi.expect(v4.toString(
      z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])
    )).toMatchInlineSnapshot
      (`"z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])"`)
    vi.expect(v4.toString(
      z.tuple([z.number()]).rest(z.boolean())
    )).toMatchInlineSnapshot
      (`"z.tuple([z.number()]).rest(z.boolean())"`)
  })


  vi.it("〖️⛳️〗› ❲z.object❳", () => {
    vi.expect(v4.toString(
      z.object({ powerlevel: z.union([z.string(), z.number()]).default(9001) })
    )).toMatchInlineSnapshot
      (`"z.object({ powerlevel: z.union([z.string(), z.number()]).default(9001) })"`)

    vi.expect(v4.toString(
      z.object({ a: z.string() }).catchall(z.boolean())
    )).toMatchInlineSnapshot
      (`"z.object({ a: z.string() }).catchall(z.boolean())"`)

    vi.expect(v4.toString(
      z.object({
        v: z.number().int(),
        w: z.number().min(0).lt(2),
        x: z.number().multipleOf(2),
        y: z.number().max(2).gt(0),
        z: z.number().nullable()
      }),
      { format: true },
    )).toMatchInlineSnapshot(`
        "z.object({
          v: z.number().int(),
          w: z.number().min(0).lt(2),
          x: z.number().int(),
          y: z.number().max(2).gt(0),
          z: z.number().nullable()
        })"
      `)

    vi.expect(v4.toString(
      z.object({
        x: z.array(z.number()).min(0).max(1),
        y: z.array(z.number()).length(1),
        z: z.array(z.array(z.array(z.literal('z')).min(1)).max(2)).length(3)
      }),
      { format: true },
    )).toMatchInlineSnapshot
      (`
      "z.object({
        x: z.array(z.number()).min(0).max(1),
        y: z.array(z.number()).length(1),
        z: z.array(z.array(z.array(z.literal("z")).min(1)).max(2)).length(3)
      })"
    `)
  })

  vi.it("〖️⛳️〗› ❲z.readonly❳", () => {
    vi.expect(v4.toString(
      z.number().readonly()
    )).toMatchInlineSnapshot
      (`"z.number().readonly()"`)
  })

  vi.it("〖️⛳️〗› ❲z.optional❳", () => {
    vi.expect(v4.toString(
      z.number().optional()
    )).toMatchInlineSnapshot
      (`"z.number().optional()"`)
  })

  vi.it("〖️⛳️〗› ❲z.nullable❳", () => {
    vi.expect(v4.toString(
      z.number().optional()
    )).toMatchInlineSnapshot
      (`"z.number().optional()"`)
  })

  vi.it("〖️⛳️〗› ❲z.nonnullable❳", () => {
    vi.expect(v4.toString(
      z.number().nonoptional()
    )).toMatchInlineSnapshot
      (`"z.nonoptional(z.number())"`)
  })

  vi.it("〖️⛳️〗› ❲z.lazy❳", () => {
    vi.expect(v4.toString(
      z.lazy(() => z.record(z.string(), z.array(z.number())))
    )).toMatchInlineSnapshot
      (`"z.lazy(() => z.record(z.string(), z.array(z.number())))"`)
  })

  vi.it("〖️⛳️〗› ❲z.catch❳", () => {
    vi.expect(v4.toString(
      z.array(z.string()).catch(["a", "b"])
    )).toMatchInlineSnapshot
      (`"z.array(z.string()).catch(["a", "b"])"`)
  })

  vi.it("〖️⛳️〗› ❲z.set❳", () => {
    vi.expect(v4.toString(
      z.set(z.number())
    )).toMatchInlineSnapshot
      (`"z.set(z.number())"`)
  })

  vi.it("〖️⛳️〗› ❲z.map❳", () => {
    vi.expect(v4.toString(
      z.map(z.array(z.boolean()), z.set(z.number().optional()))
    )).toMatchInlineSnapshot
      (`"z.map(z.array(z.boolean()), z.set(z.number().optional()))"`)
  })

  vi.it("〖️⛳️〗› ❲z.promise❳", () => {
    vi.expect(v4.toString(
      z.promise(z.never())
    )).toMatchInlineSnapshot
      (`"z.promise(z.never())"`)
  })

  vi.it("〖️⛳️〗› ❲z.enum❳", () => {
    vi.expect(v4.toString(
      z.enum([])
    )).toMatchInlineSnapshot
      (`"z.enum({})"`)
    vi.expect(v4.toString(
      z.enum(['one', 'two', 'three'])
    )).toMatchInlineSnapshot
      (`"z.enum({ one: "one", two: "two", three: "three" })"`)
    vi.expect(v4.toString(
      z.enum({
        Gob: "The Magician",
        Lindsay: "The Humanitarian",
        Tobias: "The Analrapist",
        Byron: "The Scholar",
      })
    )).toMatchInlineSnapshot
      (`"z.enum({ Gob: "The Magician", Lindsay: "The Humanitarian", Tobias: "The Analrapist", Byron: "The Scholar" })"`)
  })

  vi.it("〖️⛳️〗› ❲z.literal❳", () => {
    vi.expect(v4.toString(
      z.literal("My name is Inigo Montoya")
    )).toMatchInlineSnapshot
      (`"z.literal("My name is Inigo Montoya")"`)
  })

  vi.it("〖️⛳️〗› ❲z.templateLiteral❳", () => {
    vi.expect(v4.toString(
      z.templateLiteral([])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([])"`)

    vi.expect(v4.toString(
      z.templateLiteral([null])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([null])"`)

    vi.expect(v4.toString(
      z.templateLiteral([undefined])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([undefined])"`)

    vi.expect(v4.toString(
      z.templateLiteral([""])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([""])"`)

    vi.expect(v4.toString(
      z.templateLiteral(["a"])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral(["a"])"`)

    vi.expect(v4.toString(
      z.templateLiteral([1n])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([1n])"`)

    vi.expect(v4.toString(
      z.templateLiteral([1, 2])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([1, 2])"`)

    vi.expect(v4.toString(
      z.templateLiteral([z.string()])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([z.string()])"`)
  })
})

