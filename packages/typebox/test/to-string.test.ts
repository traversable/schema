import * as vi from 'vitest'
import * as T from '@sinclair/typebox'

import { box } from '@traversable/typebox'
import prettier from '@prettier/sync'

const format = (x: string) => prettier.format(x, { parser: 'typescript', semi: false })

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/zod❳: box.toString', () => {
  vi.test('〖️⛳️〗› ❲T.Date❳', () => {
    vi.expect.soft(format(
      box.toString(T.Date())
    )).toMatchInlineSnapshot
      (`
      "T.Date()
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲T.Array❳', () => {
    vi.expect.soft(format(
      box.toString(
        T.Array(T.String())
      )
    )).toMatchInlineSnapshot
      (`
      "T.Array(T.String())
      "
    `)

    vi.expect.soft(format(
      box.toString(
        T.Array(T.String({ minLength: 1, maxLength: 2 }))
      )
    )).toMatchInlineSnapshot
      (`
      "T.Array(T.String({ minLength: 1, maxLength: 2 }))
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲T.Record❳', () => {
    vi.expect.soft(format(
      box.toString(
        T.Record(T.String(), T.Record(T.String(), T.Array(T.Number())))
      )
    )).toMatchInlineSnapshot
      (`
      "T.Record(T.String(), T.Record(T.String(), T.Array(T.Number())))
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲T.Union❳', () => {
    vi.expect.soft(format(
      box.toString(
        T.Union([T.Null(), T.Symbol(), T.Void(), T.Never(), T.Undefined()])
      )
    )).toMatchInlineSnapshot
      (`
      "T.Union([T.Null(), T.Symbol(), T.Void(), T.Never(), T.Undefined()])
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲T.Intersect❳', () => {
    vi.expect.soft(format(
      box.toString(
        T.Intersect([T.Number(), T.Union([T.Literal(1), T.Literal(2), T.Literal(3)])])
      )
    )).toMatchInlineSnapshot
      (`
      "T.Intersect([T.Number(), T.Union([T.Literal(1), T.Literal(2), T.Literal(3)])])
      "
    `)
  })


  vi.test('〖️⛳️〗› ❲T.Tuple❳', () => {
    vi.expect.soft(format(
      box.toString(
        T.Tuple([T.String(), T.Number(), T.Object({ pointsScored: T.Number() })])
      )
    )).toMatchInlineSnapshot
      (`
      "T.Tuple([T.String(), T.Number(), T.Object({ pointsScored: T.Number() })])
      "
    `)
    vi.expect.soft(format(
      box.toString(
        T.Tuple([T.Number()])
      )
    )).toMatchInlineSnapshot
      (`
      "T.Tuple([T.Number()])
      "
    `)
  })


  vi.test("〖️⛳️〗› ❲T.Object❳", () => {
    vi.expect.soft(format(
      box.toString(
        T.Object({ powerlevel: T.Union([T.String(), T.Number()]) })
      )
    )).toMatchInlineSnapshot
      (`
      "T.Object({ powerlevel: T.Union([T.String(), T.Number()]) })
      "
    `)

    vi.expect.soft(format(
      box.toString(
        T.Object({
          v: T.Integer(),
          w: T.Number({ minimum: 0, exclusiveMaximum: 2 }),
          x: T.Number({ multipleOf: 2 }),
          y: T.Number({ maximum: 2, exclusiveMinimum: 0 }),
          z: T.BigInt({ minimum: 1n, maximum: 10n })
        })
      )
    )).toMatchInlineSnapshot
      (`
      "T.Object({
        v: T.Integer(),
        w: T.Number({ minimum: 0, exclusiveMaximum: 2 }),
        x: T.Number(),
        y: T.Number({ maximum: 2, exclusiveMinimum: 0 }),
        z: T.BigInt({ minimum: 1n, maximum: 10n }),
      })
      "
    `)

    vi.expect.soft(format(
      box.toString(
        T.Object({
          x: T.Array(T.Number({ minimum: 0, maximum: 1 })),
          y: T.Array(T.String({ minLength: 1, maxLength: 10 }), {
            minItems: 1,
            maxItems: 1,
          }),
          z: T.Array(
            T.Array(T.Array(T.Literal("z"), { minItems: 1 }), { maxItems: 2 }),
            { minItems: 3, maxItems: 3 }
          )
        })
      )
    )).toMatchInlineSnapshot
      (`
      "T.Object({
        x: T.Array(T.Number({ minimum: 0, maximum: 1 })),
        y: T.Array(T.String({ minLength: 1, maxLength: 10 }), {
          minItems: 1,
          maxItems: 1,
        }),
        z: T.Array(
          T.Array(T.Array(T.Literal("z"), { minItems: 1 }), { maxItems: 2 }),
          { minItems: 3, maxItems: 3 },
        ),
      })
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲T.Optional❳", () => {
    vi.expect.soft(format(
      box.toString(
        T.Optional(T.Number())
      )
    )).toMatchInlineSnapshot
      (`
      "T.Optional(T.Number())
      "
    `)
  })

  T.Enum({ 1: "one", 2: "two", 3: "three" }).anyOf

  vi.test("〖️⛳️〗› ❲T.Enum❳", () => {
    vi.expect.soft(format(
      box.toString(
        T.Enum({ 1: "one", 2: "two", 3: "three" })
      )
    )).toMatchInlineSnapshot
      (`
      "T.Never()
      "
    `)
    vi.expect.soft(format(
      box.toString(
        T.Enum({
          Gob: "The Magician",
          Lindsay: "The Humanitarian",
          Byron: "The Scholar",
          Tobias: "The Analrapist",
        })
      )
    )).toMatchInlineSnapshot
      (`
      "T.Union([
        T.Literal("The Magician"),
        T.Literal("The Humanitarian"),
        T.Literal("The Scholar"),
        T.Literal("The Analrapist"),
      ])
      "
    `)
  })

  vi.test("〖️⛳️〗› ❲T.Literal❳", () => {
    vi.expect.soft(format(
      box.toString(
        T.Literal("My name is Inigo Montoya")
      )
    )).toMatchInlineSnapshot
      (`
      "T.Literal("My name is Inigo Montoya")
      "
    `)
    vi.expect.soft(format(
      box.toString(
        T.Literal(0)
      )
    )).toMatchInlineSnapshot
      (`
      "T.Literal(0)
      "
    `)
    vi.expect.soft(format(
      box.toString(T.Literal(false))
    )).toMatchInlineSnapshot
      (`
      "T.Literal(false)
      "
    `)
  })
})
