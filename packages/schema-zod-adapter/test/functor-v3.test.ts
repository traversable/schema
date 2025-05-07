import * as vi from "vitest"
import { z } from "zod3"

import { v3 } from "@traversable/schema-zod-adapter"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳", () => {
  vi.it("〖️⛳️〗› ❲zod.toString❳", () => {
    vi.expect(v3.toString(z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])))
      .toMatchInlineSnapshot(`"z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])"`)

    vi.expect(v3.toString(z.array(z.string())))
      .toMatchInlineSnapshot(`"z.array(z.string())"`)

    vi.expect(v3.toString(z.union([z.enum(["1", "2", "3"]), z.nativeEnum({ x: 0, y: 16, z: 32 })])))
      .toMatchInlineSnapshot(`"z.union([z.enum(["1", "2", "3"]), z.nativeEnum({ x: 0, y: 16, z: 32 })])"`)

    vi.expect(v3.toString(z.tuple([z.number()]).rest(z.boolean())))
      .toMatchInlineSnapshot(`"z.tuple([z.number()]).rest(z.boolean())"`)

    vi.expect(v3.toString(z.object({ a: z.string() }).catchall(z.boolean())))
      .toMatchInlineSnapshot(`"z.object({ a: z.string() }).catchall(z.boolean())"`)

    vi.expect(v3.toString(z.discriminatedUnion("tag", [z.object({ tag: z.literal("Nothing") }), z.object({ tag: z.literal("Just"), value: z.unknown() })])))
      .toMatchInlineSnapshot(`"z.discriminatedUnion("tag", [z.object({ tag: z.literal("Nothing") }), z.object({ tag: z.literal("Just"), value: z.unknown() })])"`)

    vi.expect(v3.toString(z.discriminatedUnion("tag", [z.object({ tag: z.literal("Nothing") }), z.object({ tag: z.literal("Just"), value: z.unknown() })])))
      .toMatchInlineSnapshot(`"z.discriminatedUnion("tag", [z.object({ tag: z.literal("Nothing") }), z.object({ tag: z.literal("Just"), value: z.unknown() })])"`)

    vi.expect(v3.toString(z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])))
      .toMatchInlineSnapshot(`"z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])"`)

    vi.expect(v3.toString(z.string().array()))
      .toMatchInlineSnapshot(`"z.array(z.string())"`)

    vi.expect(v3.toString(z.record(z.record(z.array(z.number())))))
      .toMatchInlineSnapshot(`"z.record(z.record(z.array(z.number())))"`)

    vi.expect(v3.toString(z.lazy(() => z.record(z.array(z.number())))))
      .toMatchInlineSnapshot(`"z.lazy(() => z.record(z.array(z.number())))"`)

    vi.expect(v3.toString(z.date()))
      .toMatchInlineSnapshot(`"z.date()"`)

    vi.expect(v3.toString(z.object({ v: z.number().int().finite(), w: z.number().min(0).lt(2), x: z.number().multipleOf(2), y: z.number().max(2).gt(0), z: z.number().nullable() })))
      .toMatchInlineSnapshot(`"z.object({ v: z.number().int().finite(), w: z.number().min(0).lt(2), x: z.number().multipleOf(2), y: z.number().max(2).gt(0), z: z.number().nullable() })"`)

    vi.expect(v3.toString(z.object({ x: z.array(z.number()).min(0).max(1), y: z.array(z.number()).length(1), z: z.array(z.array(z.array(z.literal('z')).min(9000)).max(9001)).length(9001) })))
      .toMatchInlineSnapshot(`"z.object({ x: z.array(z.number()).min(0).max(1), y: z.array(z.number()).length(1), z: z.array(z.array(z.array(z.literal("z")).min(9000)).max(9001)).length(9001) })"`)

    vi.expect(v3.toString(z.number().readonly()))
      .toMatchInlineSnapshot(`"z.number().readonly()"`)

    vi.expect(v3.toString(z.number().brand()))
      .toMatchInlineSnapshot(`"z.number().brand()"`)

    vi.expect(v3.toString(z.set(z.number())))
      .toMatchInlineSnapshot(`"z.set(z.number())"`)

    vi.expect(v3.toString(z.map(z.array(z.boolean()), z.set(z.number().optional()))))
      .toMatchInlineSnapshot(`"z.map(z.array(z.boolean()), z.set(z.number().optional()))"`)

    vi.expect(v3.toString(z.promise(z.literal("promise"))))
      .toMatchInlineSnapshot(`"z.promise(z.literal("promise"))"`)

    vi.expect(v3.toString(z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))))
      .toMatchInlineSnapshot(`"z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))"`)

    vi.expect(v3.toString(z.lazy(() => z.tuple([]))))
      .toMatchInlineSnapshot(`"z.lazy(() => z.tuple([]))"`)

    vi.expect(v3.toString(z.number().pipe(z.bigint())))
      .toMatchInlineSnapshot(`"z.number().pipe(z.bigint())"`)

    vi.expect(v3.toString(z.number().catch(0)))
      .toMatchInlineSnapshot(`"z.number().catch(0)"`)

    vi.expect(v3.toString(z.array(z.string()).catch(["a", "b"])))
      .toMatchInlineSnapshot(`"z.array(z.string()).catch(["a", "b"])"`)

    vi.expect(v3.toString(z.object({ powerlevel: z.union([z.string(), z.number()]).default(9001) })))
      .toMatchInlineSnapshot(`"z.object({ powerlevel: z.union([z.string(), z.number()]).default(9001) })"`)
  })
})
