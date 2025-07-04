import * as vi from "vitest"
import * as v from "valibot"

import { valibot } from "@traversable/schema-valibot-adapter"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/schema-valibot-adapter❳", () => {
  vi.it("〖️⛳️〗› ❲valibot.toString❳", () => {
    vi.expect.soft(valibot.toString(v.tuple([v.string(), v.number(), v.object({ pointsScored: v.number() })])))
      .toMatchInlineSnapshot(`"v.tuple([v.string(), v.number(), v.object({ pointsScored: v.number() })])"`)

    vi.expect.soft(valibot.toString(v.array(v.string())))
      .toMatchInlineSnapshot(`"v.array(v.string())"`)

    vi.expect.soft(valibot.toString(v.union([v.enum({ x: "1", y: "2", z: "3" })])))
      .toMatchInlineSnapshot(`"v.union([v.enum({ x: "1", y: "2", z: "3" })])"`)

    vi.expect.soft(valibot.toString(v.tuple([v.number()])))
      .toMatchInlineSnapshot(`"v.tuple([v.number()])"`)

    vi.expect.soft(valibot.toString(v.looseTuple([v.string()])))
      .toMatchInlineSnapshot(`"v.looseTuple([v.string()])"`)

    vi.expect.soft(valibot.toString(v.strictTuple([v.string()])))
      .toMatchInlineSnapshot(`"v.strictTuple([v.string()])"`)

    vi.expect.soft(valibot.toString(v.tupleWithRest([v.number()], v.boolean())))
      .toMatchInlineSnapshot(`"v.tupleWithRest([v.number()], v.boolean())"`)

    vi.expect.soft(valibot.toString(v.object({ a: v.string() })))
      .toMatchInlineSnapshot(`"v.object({ a: v.string() })"`)

    vi.expect.soft(valibot.toString(v.looseObject({ a: v.string() })))
      .toMatchInlineSnapshot(`"v.looseObject({ a: v.string() })"`)

    vi.expect.soft(valibot.toString(v.strictObject({ a: v.string() })))
      .toMatchInlineSnapshot(`"v.strictObject({ a: v.string() })"`)

    vi.expect.soft(valibot.toString(v.objectWithRest({ a: v.string() }, v.boolean())))
      .toMatchInlineSnapshot(`"v.objectWithRest({ a: v.string() }, v.boolean())"`)

    vi.expect.soft(valibot.toString(v.variant("tag", [v.object({ tag: v.literal("Nothing") }), v.object({ tag: v.literal("Just"), value: v.unknown() })])))
      .toMatchInlineSnapshot(`"v.variant("tag", [v.object({ tag: v.literal("Nothing") }), v.object({ tag: v.literal("Just"), value: v.unknown() })])"`)

    vi.expect.soft(valibot.toString(v.variant("tag", [v.object({ tag: v.literal("Nothing") }), v.object({ tag: v.literal("Just"), value: v.unknown() })])))
      .toMatchInlineSnapshot(`"v.variant("tag", [v.object({ tag: v.literal("Nothing") }), v.object({ tag: v.literal("Just"), value: v.unknown() })])"`)

    vi.expect.soft(valibot.toString(v.union([v.null(), v.symbol(), v.map(v.string(), v.void()), v.never(), v.any()])))
      .toMatchInlineSnapshot(`"v.union([v.null(), v.symbol(), v.map(v.string(), v.void()), v.never(), v.any()])"`)

    vi.expect.soft(valibot.toString(v.array(v.string())))
      .toMatchInlineSnapshot(`"v.array(v.string())"`)

    vi.expect.soft(valibot.toString(v.record(v.string(), v.record(v.string(), v.array(v.number())))))
      .toMatchInlineSnapshot(`"v.record(v.string(), v.record(v.string(), v.array(v.number())))"`)

    vi.expect.soft(valibot.toString(v.lazy(() => v.record(v.string(), v.array(v.number())))))
      .toMatchInlineSnapshot(`"v.lazy(() => v.record(v.string(), v.array(v.number())))"`)

    vi.expect.soft(valibot.toString(v.date()))
      .toMatchInlineSnapshot(`"v.date()"`)

    vi.expect.soft(valibot.toString(v.object({ v: v.number(), w: v.number(), x: v.number(), y: v.number(), z: v.number() })))
      .toMatchInlineSnapshot(`"v.object({ v: v.number(), w: v.number(), x: v.number(), y: v.number(), z: v.number() })"`)

    vi.expect.soft(valibot.toString(v.object({ x: v.array(v.number()), y: v.array(v.number()), z: v.array(v.array(v.array(v.literal('z')))) })))
      .toMatchInlineSnapshot(`"v.object({ x: v.array(v.number()), y: v.array(v.number()), z: v.array(v.array(v.array(v.literal("z")))) })"`)

    vi.expect.soft(valibot.toString(v.set(v.number())))
      .toMatchInlineSnapshot(`"v.set(v.number())"`)

    vi.expect.soft(valibot.toString(v.map(v.array(v.boolean()), v.set(v.number()))))
      .toMatchInlineSnapshot(`"v.map(v.array(v.boolean()), v.set(v.number()))"`)

    vi.expect.soft(valibot.toString(v.nonNullable(v.any())))
      .toMatchInlineSnapshot(`"v.nonNullable(v.any())"`)

    vi.expect.soft(valibot.toString(v.promise()))
      .toMatchInlineSnapshot(`"v.promise()"`)

    vi.expect.soft(valibot.toString(v.intersect([v.number(), v.union([v.literal(1), v.literal(2), v.literal(3)])])))
      .toMatchInlineSnapshot(`"v.intersect([v.number(), v.union([v.literal(1), v.literal(2), v.literal(3)])])"`)

    vi.expect.soft(valibot.toString(v.lazy(() => v.tuple([]))))
      .toMatchInlineSnapshot(`"v.lazy(() => v.tuple([]))"`)

    vi.expect.soft(valibot.toString(v.object({ powerlevel: v.union([v.string(), v.number()]) })))
      .toMatchInlineSnapshot(`"v.object({ powerlevel: v.union([v.string(), v.number()]) })"`)
  })
})

