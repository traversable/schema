import * as vi from "vitest"
import { z } from "zod"
import { zx } from "@traversable/zod"
import prettier from '@prettier/sync'

function format(src: string) {
  return prettier.format(src, { parser: 'typescript', printWidth: 60, semi: false })
}

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.toString", () => {
  vi.test("〖️⛳️〗› ❲z.brand❳ ", () => {
    vi.expect.soft(format(zx.toString(
      z.number().brand())
    )).toMatchInlineSnapshot
      (`
      "z.number()
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.date❳", () => {
    vi.expect.soft(format(zx.toString(
      z.date()
    ))).toMatchInlineSnapshot
      (`
      "z.date()
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.array❳", () => {
    vi.expect.soft(format(zx.toString(
      z.array(z.string())
    ))).toMatchInlineSnapshot
      (`
      "z.array(z.string())
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.string().array()
    ))).toMatchInlineSnapshot
      (`
      "z.array(z.string())
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.record❳", () => {
    vi.expect.soft(format(zx.toString(
      z.record(
        z.string(),
        z.record(z.string(), z.array(z.number()))
      )
    ))).toMatchInlineSnapshot
      (`
      "z.record(
        z.string(),
        z.record(z.string(), z.array(z.number())),
      )
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.union❳", () => {
    vi.expect.soft(format(zx.toString(
      z.union([
        z.null(),
        z.symbol(),
        z.map(z.string(), z.void()),
        z.never(),
        z.any()
      ])
    ))).toMatchInlineSnapshot
      (`
      "z.union([
        z.null(),
        z.symbol(),
        z.map(z.string(), z.void()),
        z.never(),
        z.any(),
      ])
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.discriminatedUnion❳", () => {
    vi.expect.soft(format(zx.toString(
      z.object({
        field: z.discriminatedUnion(
          'discriminator', [
          z.object({
            discriminator: z.literal(true).default(true),
            x: z.boolean(),
            y: z.string(),
            z: z.number(),
          }),
          z.object({ discriminator: z.literal(false) }),
        ])
      })
    ))).toMatchInlineSnapshot
      (`
      "z.object({
        field: z.discriminatedUnion([
          "discriminator",
          z.object({
            discriminator: z.literal(true).default(true),
            x: z.boolean(),
            y: z.string(),
            z: z.number(),
          }),
          z.object({ discriminator: z.literal(false) }),
        ]),
      })
      "
    `)

  })

  vi.test("〖️⛳️〗› ❲z.intersection❳", () => {
    vi.expect.soft(format(zx.toString(
      z.intersection(
        z.number(),
        z.union([z.literal(1), z.literal(2), z.literal(3)])
      )
    ))).toMatchInlineSnapshot
      (`
      "z.intersection(
        z.number(),
        z.union([z.literal(1), z.literal(2), z.literal(3)]),
      )
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.default❳", () => {
    // https://github.com/traversable/schema/issues/541
    vi.expect.soft(format(zx.toString(
      z.object({ a: z.string() }).default({ a: '' })
    ))).toMatchInlineSnapshot
      (`
      "z.object({ a: z.string() }).default({ a: "" })
      "
    `)
  })


  vi.test("〖️⛳️〗› ❲z.tuple❳", () => {
    vi.expect.soft(format(zx.toString(
      z.tuple([
        z.string(),
        z.number(),
        z.object({ pointsScored: z.number() })
      ])
    ))).toMatchInlineSnapshot
      (`
      "z.tuple([
        z.string(),
        z.number(),
        z.object({ pointsScored: z.number() }),
      ])
      "
    `)
    vi.expect.soft(format(zx.toString(
      z.tuple([z.number()]).rest(z.boolean())
    ))).toMatchInlineSnapshot
      (`
      "z.tuple([z.number()]).rest(z.boolean())
      "
    `)
  })


  vi.test("〖️⛳️〗› ❲z.object❳", () => {
    vi.expect.soft(format(zx.toString(
      z.object({
        powerlevel: z
          .union([z.string(), z.number()])
          .default(9001)
      })
    ))).toMatchInlineSnapshot
      (`
      "z.object({
        powerlevel: z
          .union([z.string(), z.number()])
          .default(9001),
      })
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.object({ a: z.string() }).catchall(z.boolean())
    ))).toMatchInlineSnapshot
      (`
      "z.object({ a: z.string() }).catchall(z.boolean())
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.object({
        v: z.number().int(),
        w: z.number().min(0).lt(2),
        x: z.number().multipleOf(2),
        y: z.number().max(2).gt(0),
        z: z.number().nullable()
      })
    ))).toMatchInlineSnapshot(`
      "z.object({
        v: z.number().int(),
        w: z.number().min(0).lt(2),
        x: z.number().int(),
        y: z.number().max(2).gt(0),
        z: z.number().nullable(),
      })
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.object({
        x: z.array(z.number()).min(0).max(1),
        y: z.array(z.number()).length(1),
        z: z
          .array(z.array(z.array(z.literal('z')).min(1)).max(2))
          .length(3)
      })
    ))).toMatchInlineSnapshot
      (`
      "z.object({
        x: z.array(z.number()).min(0).max(1),
        y: z.array(z.number()).length(1),
        z: z
          .array(z.array(z.array(z.literal("z")).min(1)).max(2))
          .length(3),
      })
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.readonly❳", () => {
    vi.expect.soft(format(zx.toString(
      z.number().readonly()
    ))).toMatchInlineSnapshot
      (`
      "z.number().readonly()
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.optional❳", () => {
    vi.expect.soft(format(zx.toString(
      z.number().optional()
    ))).toMatchInlineSnapshot
      (`
      "z.number().optional()
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.nullable❳", () => {
    vi.expect.soft(format(zx.toString(
      z.number().optional()
    ))).toMatchInlineSnapshot
      (`
      "z.number().optional()
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.nonnullable❳", () => {
    vi.expect.soft(format(zx.toString(
      z.number().nonoptional()
    ))).toMatchInlineSnapshot
      (`
      "z.nonoptional(z.number())
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.lazy❳", () => {
    vi.expect.soft(format(zx.toString(
      z.lazy(() => z.record(z.string(), z.array(z.number())))
    ))).toMatchInlineSnapshot
      (`
      "z.lazy(() => z.record(z.string(), z.array(z.number())))
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.catch❳", () => {
    vi.expect.soft(format(zx.toString(
      z.array(z.string()).catch(["a", "b"])
    ))).toMatchInlineSnapshot
      (`
      "z.array(z.string()).catch(["a", "b"])
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.set❳", () => {
    vi.expect.soft(format(zx.toString(
      z.set(z.number())
    ))).toMatchInlineSnapshot
      (`
      "z.set(z.number())
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.map❳", () => {
    vi.expect.soft(format(zx.toString(
      z.map(z.array(z.boolean()), z.set(z.number().optional()))
    ))).toMatchInlineSnapshot
      (`
      "z.map(z.array(z.boolean()), z.set(z.number().optional()))
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.promise❳", () => {
    vi.expect.soft(format(zx.toString(
      z.promise(z.never())
    ))).toMatchInlineSnapshot
      (`
      "z.promise(z.never())
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.enum❳", () => {
    vi.expect.soft(format(zx.toString(
      z.enum([])
    ))).toMatchInlineSnapshot
      (`
      "z.enum({})
      "
    `)
    vi.expect.soft(format(zx.toString(
      z.enum(['one', 'two', 'three'])
    ))).toMatchInlineSnapshot
      (`
      "z.enum({ one: "one", two: "two", three: "three" })
      "
    `)
    vi.expect.soft(format(zx.toString(
      z.enum({
        Gob: "The Magician",
        Lindsay: "The Humanitarian",
        Byron: "The Scholar",
        Tobias: "The Analrapist",
      })
    ))).toMatchInlineSnapshot
      (`
      "z.enum({
        Gob: "The Magician",
        Lindsay: "The Humanitarian",
        Byron: "The Scholar",
        Tobias: "The Analrapist",
      })
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.literal❳", () => {
    vi.expect.soft(format(zx.toString(
      z.literal("My name is Inigo Montoya")
    ))).toMatchInlineSnapshot
      (`
      "z.literal("My name is Inigo Montoya")
      "
    `)


    vi.expect.soft(format(zx.toString(
      z.literal(undefined)
    ))).toMatchInlineSnapshot
      (`
      "z.literal(undefined)
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲z.templateLiteral❳", () => {
    vi.expect.soft(format(zx.toString(
      z.templateLiteral([])
    ))).toMatchInlineSnapshot
      (`
      "z.templateLiteral([])
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.templateLiteral([null])
    ))).toMatchInlineSnapshot
      (`
      "z.templateLiteral([null])
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.templateLiteral([undefined])
    ))).toMatchInlineSnapshot
      (`
      "z.templateLiteral([undefined])
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.templateLiteral([""])
    ))).toMatchInlineSnapshot
      (`
      "z.templateLiteral([""])
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.templateLiteral(["a"])
    ))).toMatchInlineSnapshot
      (`
      "z.templateLiteral(["a"])
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.templateLiteral([1n])
    ))).toMatchInlineSnapshot
      (`
      "z.templateLiteral([1n])
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.templateLiteral([1, 2])
    ))).toMatchInlineSnapshot
      (`
      "z.templateLiteral([1, 2])
      "
    `)

    vi.expect.soft(format(zx.toString(
      z.templateLiteral([z.string()])
    ))).toMatchInlineSnapshot
      (`
      "z.templateLiteral([z.string()])
      "
    `)
  })
})
