import * as vi from "vitest"
import { z } from "zod"
import prettier from '@prettier/sync'

import { zx } from "@traversable/zod"

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.toType (jsdocs)", () => {
  vi.test("〖️⛳️〗› ❲zx.toType❳: jsdocs", () => {
    vi.expect.soft(format(
      zx.toType(
        z.object({
          abc: z.number().meta({ description: 'stuff' })
        }),
        { preserveJsDocs: true }
      )
    )).toMatchInlineSnapshot
      (`
      "{
        /**
         * stuff
         */
        abc: number
      }
      "
    `)


    vi.expect.soft(format(
      zx.toType(
        z.object({
          abc: z.number().meta({ description: 'stuff', example: 1 })
        }),
        { preserveJsDocs: true }
      )
    )).toMatchInlineSnapshot
      (`
      "{
        /**
         * stuff
         *
         * @example 1
         */
        abc: number
      }
      "
    `)

    vi.expect.soft(format(
      zx.toType(
        z.object({
          abc: z.number().meta({ description: 'stuff */', example: ['1*/'] })
        }),
        { preserveJsDocs: true }
      )
    )).toMatchInlineSnapshot
      (`
      "{
        /**
         * stuff *\\/
         *
         * @example ["1*\\/"]
         */
        abc: number
      }
      "
    `)
  })
})

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.toType", () => {
  vi.test("〖️⛳️〗› ❲z.never❳ ", () => {
    vi.expect.soft(zx.toType(
      z.never()
    )).toMatchInlineSnapshot
      (`"never"`)
  })

  vi.test("〖️⛳️〗› ❲z.any❳ ", () => {
    vi.expect.soft(zx.toType(
      z.any()
    )).toMatchInlineSnapshot
      (`"any"`)
  })

  vi.test("〖️⛳️〗› ❲z.unknown❳ ", () => {
    vi.expect.soft(zx.toType(
      z.unknown()
    )).toMatchInlineSnapshot
      (`"unknown"`)
  })

  vi.test("〖️⛳️〗› ❲z.void❳ ", () => {
    vi.expect.soft(zx.toType(
      z.void()
    )).toMatchInlineSnapshot
      (`"void"`)
  })

  vi.test("〖️⛳️〗› ❲z.undefined❳ ", () => {
    vi.expect.soft(zx.toType(
      z.undefined()
    )).toMatchInlineSnapshot
      (`"undefined"`)
  })

  vi.test("〖️⛳️〗› ❲z.null❳ ", () => {
    vi.expect.soft(zx.toType(
      z.null()
    )).toMatchInlineSnapshot
      (`"null"`)
  })

  vi.test("〖️⛳️〗› ❲z.symbol❳ ", () => {
    vi.expect.soft(zx.toType(
      z.symbol()
    )).toMatchInlineSnapshot
      (`"symbol"`)
  })

  vi.test("〖️⛳️〗› ❲z.boolean❳ ", () => {
    vi.expect.soft(zx.toType(
      z.boolean()
    )).toMatchInlineSnapshot
      (`"boolean"`)
  })

  vi.test("〖️⛳️〗› ❲z.nan❳ ", () => {
    vi.expect.soft(zx.toType(
      z.nan()
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.test("〖️⛳️〗› ❲z.bigint❳ ", () => {
    vi.expect.soft(zx.toType(
      z.bigint()
    )).toMatchInlineSnapshot
      (`"bigint"`)
  })

  vi.test("〖️⛳️〗› ❲z.number❳ ", () => {
    vi.expect.soft(zx.toType(
      z.number()
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.test("〖️⛳️〗› ❲z.string❳ ", () => {
    vi.expect.soft(zx.toType(
      z.string()
    )).toMatchInlineSnapshot
      (`"string"`)
  })

  vi.test("〖️⛳️〗› ❲z.date❳ ", () => {
    vi.expect.soft(zx.toType(
      z.date()
    )).toMatchInlineSnapshot
      (`"Date"`)
  })

  vi.test("〖️⛳️〗› ❲z.file❳ ", () => {
    vi.expect.soft(zx.toType(
      z.file()
    )).toMatchInlineSnapshot
      (`"File"`)
  })

  vi.test("〖️⛳️〗› ❲z.literal❳", () => {
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

  vi.test("〖️⛳️〗› ❲z.templateLiteral❳", () => {
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

    // https://github.com/traversable/schema/issues/521
    // `${number}px` | "nullpx"
    vi.expect.soft(
      zx.toType(
        z.templateLiteral([
          z.number().nullable(),
          "px",
        ])
      )
    ).toEqual('`${number}px` | "nullpx"')

    vi.expect.soft(
      zx.toType(
        z.templateLiteral([
          z.boolean().nullable()
        ])
      )
    ).toEqual('"true" | "false" | "null"')

    vi.expect.soft(
      zx.toType(
        z.templateLiteral([
          'a',
          z.boolean().nullable()
        ])
      )
    ).toEqual('"atrue" | "afalse" | "anull"')

    vi.expect.soft(
      zx.toType(
        z.templateLiteral([
          ' a ',
          z.number().nullable(),
          ' b ',
          z.number().nullable(),
          ' c ',
        ])
      )
    ).toEqual('` a ${number} b ${number} c ` | ` a ${number} b null c ` | ` a null b ${number} c ` | " a null b null c "')

    vi.expect.soft(
      zx.toType(
        z.templateLiteral([
          z.number().optional(),
          "px",
        ])
      )
    ).toEqual('`${number}px` | "px"')

    vi.expect.soft(
      zx.toType(
        z.templateLiteral([
          ' a ',
          z.number().optional(),
          ' b ',
          z.number().optional(),
          ' c ',
        ])
      )
    ).toEqual('` a ${number} b ${number} c ` | ` a ${number} b  c ` | ` a  b ${number} c ` | " a  b  c "')

    vi.expect.soft(
      zx.toType(
        z.templateLiteral([
          z.number().nullable(),
          "px",
        ])
      )
    ).toMatchInlineSnapshot
      (`"\`\${number}px\` | "nullpx""`)

    vi.expect.soft(
      zx.toType(
        z.templateLiteral([
          z.enum(["A", "B"]),
          z.literal(["c", "d"]),
        ])
      )
    ).toEqual('"Ac" | "Ad" | "Bc" | "Bd"')
  })

  vi.test("〖️⛳️〗› ❲z.enum❳", () => {
    vi.expect.soft(zx.toType(
      z.enum([])
    )).toMatchInlineSnapshot
      (`"never"`)
    vi.expect.soft(zx.toType(
      z.enum(['one', 'two', 'three'])
    )).toMatchInlineSnapshot
      (`""one" | "two" | "three""`)
    vi.expect.soft(zx.toType(
      z.enum({
        Gob: "The Magician",
        Lindsay: "The Humanitarian",
        Byron: "The Scholar",
        Tobias: "The Analrapist",
      })
    )).toMatchInlineSnapshot
      (`""The Magician" | "The Humanitarian" | "The Scholar" | "The Analrapist""`)
  })

  vi.test("〖️⛳️〗› ❲z.set❳ ", () => {
    vi.expect.soft(zx.toType(
      z.set(z.literal(1))
    )).toMatchInlineSnapshot
      (`"Set<1>"`)
  })

  vi.test("〖️⛳️〗› ❲z.map❳ ", () => {
    vi.expect.soft(zx.toType(
      z.map(z.literal(1), z.literal(2))
    )).toMatchInlineSnapshot
      (`"Map<1, 2>"`)
  })

  vi.test("〖️⛳️〗› ❲z.readonly❳ ", () => {
    vi.expect.soft(zx.toType(
      z.readonly(z.literal(1))
    )).toMatchInlineSnapshot
      (`"1"`)

    vi.expect.soft(zx.toType(
      z.lazy(() => z.any()).readonly()
    )).toMatchInlineSnapshot
      (`"any"`)
  })

  vi.test("〖️⛳️〗› ❲z.optional❳ ", () => {
    vi.expect.soft(zx.toType(
      z.optional(z.literal(1))
    )).toMatchInlineSnapshot
      (`"undefined | 1"`)
    vi.expect.soft(zx.toType(
      z.object({ a: z.optional(z.literal(1)) })
    )).toMatchInlineSnapshot
      (`"{ a?: 1 }"`)
  })

  vi.test("〖️⛳️〗› ❲z.nullable❳ ", () => {
    vi.expect.soft(zx.toType(
      z.nullable(z.literal(1))
    )).toMatchInlineSnapshot
      (`"null | 1"`)
  })

  vi.test("〖️⛳️〗› ❲z.array❳ ", () => {
    vi.expect.soft(zx.toType(
      z.array(z.literal(1))
    )).toMatchInlineSnapshot
      (`"Array<1>"`)
  })

  vi.test("〖️⛳️〗› ❲z.record❳ ", () => {
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

  vi.test("〖️⛳️〗› ❲z.intersection❳ ", () => {
    vi.expect.soft(zx.toType(
      z.intersection(z.object({ a: z.literal(1) }), z.object({ b: z.literal(2) }))
    )).toMatchInlineSnapshot
      (`"{ a: 1 } & { b: 2 }"`)
    vi.expect.soft(zx.toType(
      z.intersection(z.number(), z.union([z.literal(1), z.literal(2), z.literal(3)]))
    )).toMatchInlineSnapshot
      (`"number & (1 | 2 | 3)"`)
  })

  vi.test("〖️⛳️〗› ❲z.union❳ ", () => {
    vi.expect.soft(zx.toType(
      z.union([z.literal(1)])
    )).toMatchInlineSnapshot
      (`"1"`)
    vi.expect.soft(zx.toType(
      z.union([z.literal(1), z.literal(2)])
    )).toMatchInlineSnapshot
      (`"1 | 2"`)
    vi.expect.soft(zx.toType(
      z.union([z.null(), z.symbol(), z.map(z.string(), z.void()), z.never(), z.any()])
    )).toMatchInlineSnapshot
      (`"null | symbol | Map<string, void> | never | any"`)
  })

  vi.test("〖️⛳️〗› ❲z.lazy❳ ", () => {
    vi.expect.soft(zx.toType(
      z.lazy(() => z.literal(1))
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.test("〖️⛳️〗› ❲z.pipe❳ ", () => {
    vi.expect.soft(zx.toType(
      z.pipe(z.number(), z.int())
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.test("〖️⛳️〗› ❲z.default❳ ", () => {
    vi.expect.soft(zx.toType(
      z.literal(1).default(1)
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.test("〖️⛳️〗› ❲z.prefault❳ ", () => {
    vi.expect.soft(zx.toType(
      z.literal(1).prefault(1)
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.test("〖️⛳️〗› ❲z.catch❳ ", () => {
    vi.expect.soft(zx.toType(
      z.literal(1).catch(1)
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.test("〖️⛳️〗› ❲z.nonoptional❳ ", () => {
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

  vi.test("〖️⛳️〗› ❲z.tuple❳", () => {
    vi.expect.soft(zx.toType(
      z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })])
    )).toMatchInlineSnapshot
      (`"[string, number, { pointsScored: number }]"`)
    vi.expect.soft(zx.toType(
      z.tuple([z.number()]).rest(z.boolean())
    )).toMatchInlineSnapshot
      (`"[number, ...boolean[]]"`)
  })

  vi.test("〖️⛳️〗› ❲z.object❳", () => {
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
})

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.toType w/ typeName", () => {
  vi.test("〖️⛳️〗› ❲z.object❳", () => {
    vi.expect.soft(
      zx.toType(z.object({ a: z.optional(z.number()) }), { typeName: 'MyType' })
    ).toMatchInlineSnapshot
      (`"type MyType = { a?: number }"`)
  })
})
