import * as vi from "vitest"
import { z } from "zod4"

import { v4 } from "@traversable/schema-zod-adapter"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳", () => {
  vi.it("〖️⛳️〗› ❲zod.toString❳", () => {

    vi.expect(v4.toString(
      z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])
    )).toMatchInlineSnapshot
      (`"z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])"`)

    vi.expect(v4.toString(z.array(z.string())))
      .toMatchInlineSnapshot
      (`"z.array(z.string())"`)

    vi.expect(v4.toString(
      z.tuple([z.number()]).rest(z.boolean())
    )).toMatchInlineSnapshot
      (`"z.tuple([z.number()]).rest(z.boolean())"`)

    vi.expect(v4.toString(
      z.object({ a: z.string() }).catchall(z.boolean())
    )).toMatchInlineSnapshot
      (`"z.object({ a: z.string() }).catchall(z.boolean())"`)

    vi.expect(v4.toString(
      z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])
    )).toMatchInlineSnapshot
      (`"z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])"`)

    vi.expect(v4.toString(
      z.string().array()
    )).toMatchInlineSnapshot
      (`"z.array(z.string())"`)

    vi.expect(v4.toString(
      z.record(z.string(), z.record(z.string(), z.array(z.number())))
    )).toMatchInlineSnapshot
      (`"z.record(z.string(), z.record(z.string(), z.array(z.number())))"`)

    vi.expect(v4.toString(
      z.lazy(() => z.record(z.string(), z.array(z.number())))
    )).toMatchInlineSnapshot
      (`"z.lazy(() => z.record(z.string(), z.array(z.number())))"`)

    vi.expect(v4.toString(z.date()))
      .toMatchInlineSnapshot(`"z.date()"`)

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

    vi.expect(v4.toString(
      z.number().readonly()
    )).toMatchInlineSnapshot
      (`"z.number().readonly()"`)

    vi.expect(v4.toString(
      z.number().brand())
    ).toMatchInlineSnapshot
      (`"z.number()"`)

    vi.expect(v4.toString(
      z.set(z.number())
    )).toMatchInlineSnapshot
      (`"z.set(z.number())"`)

    vi.expect(v4.toString(
      z.map(z.array(z.boolean()), z.set(z.number().optional()))
    )).toMatchInlineSnapshot
      (`"z.map(z.array(z.boolean()), z.set(z.number().optional()))"`)

    vi.expect(v4.toString(
      z.promise(z.literal("promise"))
    )).toMatchInlineSnapshot
      (`"z.promise(z.literal("promise"))"`)

    vi.expect(v4.toString(
      z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))
    )).toMatchInlineSnapshot
      (`"z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))"`)

    vi.expect(v4.toString(
      z.lazy(() => z.tuple([]))
    )).toMatchInlineSnapshot
      (`"z.lazy(() => z.tuple([]))"`)

    vi.expect(v4.toString(
      z.number().catch(0)
    )).toMatchInlineSnapshot
      (`"z.number().catch(z.number(), 0)"`)

    vi.expect(v4.toString(
      z.array(z.string()).catch(["a", "b"])
    )).toMatchInlineSnapshot
      (`"z.array(z.string()).catch(z.array(z.string()), ["a", "b"])"`)

    vi.expect(v4.toString(
      z.object({ powerlevel: z.union([z.string(), z.number()]).default(9001) })
    )).toMatchInlineSnapshot
      (`"z.object({ powerlevel: z.union([z.string(), z.number()]).default(9001) })"`)
  })
})

