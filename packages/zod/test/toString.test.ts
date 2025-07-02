import * as vi from "vitest"
import { z } from "zod/v4"

import { toString } from "@traversable/zod"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳: toString", () => {
  vi.it("〖️⛳️〗› ❲z.brand❳ ", () => {
    vi.expect(toString(
      z.number().brand())
    ).toMatchInlineSnapshot
      (`"z.number()"`)
  })

  vi.it("〖️⛳️〗› ❲z.brand❳: TODO", () => {
    vi.expect(toString(
      z.number().brand())
    ).toMatchInlineSnapshot
      (`"z.number()"`)
  })

  vi.it("〖️⛳️〗› ❲z.date❳", () => {
    vi.expect(toString(
      z.date()
    )).toMatchInlineSnapshot
      (`"z.date()"`)
  })

  vi.it("〖️⛳️〗› ❲z.array❳", () => {
    vi.expect(toString(
      z.array(z.string())
    )).toMatchInlineSnapshot
      (`"z.array(z.string())"`)

    vi.expect(toString(
      z.string().array()
    )).toMatchInlineSnapshot
      (`"z.array(z.string())"`)
  })

  vi.it("〖️⛳️〗› ❲z.record❳", () => {
    vi.expect(toString(
      z.record(z.string(), z.record(z.string(), z.array(z.number())))
    )).toMatchInlineSnapshot
      (`"z.record(z.string(), z.record(z.string(), z.array(z.number())))"`)
  })

  vi.it("〖️⛳️〗› ❲z.union❳", () => {
    vi.expect(toString(
      z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])
    )).toMatchInlineSnapshot
      (`"z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])"`)
  })

  vi.it("〖️⛳️〗› ❲z.intersection❳", () => {
    vi.expect(toString(
      z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))
    )).toMatchInlineSnapshot
      (`"z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))"`)
  })


  vi.it("〖️⛳️〗› ❲z.tuple❳", () => {
    vi.expect(toString(
      z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])
    )).toMatchInlineSnapshot
      (`"z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])"`)
    vi.expect(toString(
      z.tuple([z.number()]).rest(z.boolean())
    )).toMatchInlineSnapshot
      (`"z.tuple([z.number()]).rest(z.boolean())"`)
  })


  vi.it("〖️⛳️〗› ❲z.object❳", () => {
    vi.expect(toString(
      z.object({ powerlevel: z.union([z.string(), z.number()]).default(9001) })
    )).toMatchInlineSnapshot
      (`"z.object({ powerlevel: z.union([z.string(), z.number()]).default(9001) })"`)

    vi.expect(toString(
      z.object({ a: z.string() }).catchall(z.boolean())
    )).toMatchInlineSnapshot
      (`"z.object({ a: z.string() }).catchall(z.boolean())"`)

    vi.expect(toString(
      z.object({
        v: z.number().int(),
        w: z.number().min(0).lt(2),
        x: z.number().multipleOf(2),
        y: z.number().max(2).gt(0),
        z: z.number().nullable()
      }),
      { format: true },
    )).toMatchInlineSnapshot(`"z.object({ v: z.number().int(),w: z.number().min(0).lt(2),x: z.number().int(),y: z.number().max(2).gt(0),z: z.number().nullable() })"`)

    vi.expect(toString(
      z.object({
        x: z.array(z.number()).min(0).max(1),
        y: z.array(z.number()).length(1),
        z: z.array(z.array(z.array(z.literal('z')).min(1)).max(2)).length(3)
      }),
      { format: true },
    )).toMatchInlineSnapshot
      (`"z.object({ x: z.array(z.number()).min(0).max(1),y: z.array(z.number()).length(1),z: z.array(z.array(z.array(z.literal("z")).min(1)).max(2)).length(3) })"`)
  })

  vi.it("〖️⛳️〗› ❲z.readonly❳", () => {
    vi.expect(toString(
      z.number().readonly()
    )).toMatchInlineSnapshot
      (`"z.number().readonly()"`)
  })

  vi.it("〖️⛳️〗› ❲z.optional❳", () => {
    vi.expect(toString(
      z.number().optional()
    )).toMatchInlineSnapshot
      (`"z.number().optional()"`)
  })

  vi.it("〖️⛳️〗› ❲z.nullable❳", () => {
    vi.expect(toString(
      z.number().optional()
    )).toMatchInlineSnapshot
      (`"z.number().optional()"`)
  })

  vi.it("〖️⛳️〗› ❲z.nonnullable❳", () => {
    vi.expect(toString(
      z.number().nonoptional()
    )).toMatchInlineSnapshot
      (`"z.nonoptional(z.number())"`)
  })

  vi.it("〖️⛳️〗› ❲z.lazy❳", () => {
    vi.expect(toString(
      z.lazy(() => z.record(z.string(), z.array(z.number())))
    )).toMatchInlineSnapshot
      (`"z.lazy(() => z.record(z.string(), z.array(z.number())))"`)
  })

  vi.it("〖️⛳️〗› ❲z.catch❳", () => {
    vi.expect(toString(
      z.array(z.string()).catch(["a", "b"])
    )).toMatchInlineSnapshot
      (`"z.array(z.string()).catch(["a", "b"])"`)
  })

  vi.it("〖️⛳️〗› ❲z.set❳", () => {
    vi.expect(toString(
      z.set(z.number())
    )).toMatchInlineSnapshot
      (`"z.set(z.number())"`)
  })

  vi.it("〖️⛳️〗› ❲z.map❳", () => {
    vi.expect(toString(
      z.map(z.array(z.boolean()), z.set(z.number().optional()))
    )).toMatchInlineSnapshot
      (`"z.map(z.array(z.boolean()), z.set(z.number().optional()))"`)
  })

  vi.it("〖️⛳️〗› ❲z.promise❳", () => {
    vi.expect(toString(
      z.promise(z.never())
    )).toMatchInlineSnapshot
      (`"z.promise(z.never())"`)
  })

  vi.it("〖️⛳️〗› ❲z.enum❳", () => {
    vi.expect(toString(
      z.enum([])
    )).toMatchInlineSnapshot
      (`"z.enum({})"`)
    vi.expect(toString(
      z.enum(['one', 'two', 'three'])
    )).toMatchInlineSnapshot
      (`"z.enum({ one: "one", two: "two", three: "three" })"`)
    vi.expect(toString(
      z.enum({
        Gob: "The Magician",
        Lindsay: "The Humanitarian",
        Byron: "The Scholar",
        Tobias: "The Analrapist",
      })
    )).toMatchInlineSnapshot
      (`"z.enum({ Gob: "The Magician", Lindsay: "The Humanitarian", Byron: "The Scholar", Tobias: "The Analrapist" })"`)
  })

  vi.it("〖️⛳️〗› ❲z.literal❳", () => {
    vi.expect(toString(
      z.literal("My name is Inigo Montoya")
    )).toMatchInlineSnapshot
      (`"z.literal("My name is Inigo Montoya")"`)
  })

  vi.it("〖️⛳️〗› ❲z.templateLiteral❳", () => {
    vi.expect(toString(
      z.templateLiteral([])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([])"`)

    vi.expect(toString(
      z.templateLiteral([null])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([null])"`)

    vi.expect(toString(
      z.templateLiteral([undefined])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([undefined])"`)

    vi.expect(toString(
      z.templateLiteral([""])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([""])"`)

    vi.expect(toString(
      z.templateLiteral(["a"])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral(["a"])"`)

    vi.expect(toString(
      z.templateLiteral([1n])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([1n])"`)

    vi.expect(toString(
      z.templateLiteral([1, 2])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([1, 2])"`)

    vi.expect(toString(
      z.templateLiteral([z.string()])
    )).toMatchInlineSnapshot
      (`"z.templateLiteral([z.string()])"`)
  })
})

