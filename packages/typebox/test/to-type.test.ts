import * as vi from "vitest"
import * as T from "@sinclair/typebox"

import { box } from "@traversable/typebox"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: box.toType", () => {
  vi.test("〖️⛳️〗› ❲T.Never❳ ", () => {
    vi.expect.soft(box.toType(
      T.Never()
    )).toMatchInlineSnapshot
      (`"never"`)
  })

  vi.test("〖️⛳️〗› ❲T.Any❳ ", () => {
    vi.expect.soft(box.toType(
      T.Any()
    )).toMatchInlineSnapshot
      (`"any"`)
  })

  vi.test("〖️⛳️〗› ❲T.Unknown❳ ", () => {
    vi.expect.soft(box.toType(
      T.Unknown()
    )).toMatchInlineSnapshot
      (`"unknown"`)
  })

  vi.test("〖️⛳️〗› ❲T.Void❳ ", () => {
    vi.expect.soft(box.toType(
      T.Void()
    )).toMatchInlineSnapshot
      (`"void"`)
  })

  vi.test("〖️⛳️〗› ❲T.Undefined❳ ", () => {
    vi.expect.soft(box.toType(
      T.Undefined()
    )).toMatchInlineSnapshot
      (`"undefined"`)
  })

  vi.test("〖️⛳️〗› ❲T.Null❳ ", () => {
    vi.expect.soft(box.toType(
      T.Null()
    )).toMatchInlineSnapshot
      (`"null"`)
  })

  vi.test("〖️⛳️〗› ❲T.Symbol❳ ", () => {
    vi.expect.soft(box.toType(
      T.Symbol()
    )).toMatchInlineSnapshot
      (`"symbol"`)
  })

  vi.test("〖️⛳️〗› ❲T.Boolean❳ ", () => {
    vi.expect.soft(box.toType(
      T.Boolean()
    )).toMatchInlineSnapshot
      (`"boolean"`)
  })

  vi.test("〖️⛳️〗› ❲T.BigInt❳ ", () => {
    vi.expect.soft(box.toType(
      T.BigInt()
    )).toMatchInlineSnapshot
      (`"bigint"`)
  })

  vi.test("〖️⛳️〗› ❲T.Number❳ ", () => {
    vi.expect.soft(box.toType(
      T.Number()
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.test("〖️⛳️〗› ❲T.String❳ ", () => {
    vi.expect.soft(box.toType(
      T.String()
    )).toMatchInlineSnapshot
      (`"string"`)
  })

  vi.test("〖️⛳️〗› ❲T.Date❳ ", () => {
    vi.expect.soft(box.toType(
      T.Date()
    )).toMatchInlineSnapshot
      (`"Date"`)
  })

  vi.test("〖️⛳️〗› ❲T.Literal❳", () => {
    vi.expect.soft(box.toType(
      T.Literal("My name is Inigo Montoya")
    )).toMatchInlineSnapshot
      (`""My name is Inigo Montoya""`)
  })

  vi.test("〖️⛳️〗› ❲T.Enum❳", () => {
    vi.expect.soft(box.toType(
      T.Enum({
        Gob: "The Magician",
        Lindsay: "The Humanitarian",
        Byron: "The Scholar",
        Tobias: "The Analrapist",
      })
    )).toMatchInlineSnapshot
      (`""The Magician" | "The Humanitarian" | "The Scholar" | "The Analrapist""`)
  })

  vi.test("〖️⛳️〗› ❲T.Readonly❳ ", () => {
    vi.expect.soft(box.toType(
      T.Readonly(T.Literal(1))
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.test("〖️⛳️〗› ❲T.Optional❳ ", () => {
    vi.expect.soft(box.toType(
      T.Optional(T.Literal(1))
    )).toMatchInlineSnapshot
      (`"undefined | 1"`)
    vi.expect.soft(box.toType(
      T.Object({ a: T.Optional(T.Literal(1)) })
    )).toMatchInlineSnapshot
      (`"{ a?: 1 }"`)
  })

  vi.test("〖️⛳️〗› ❲T.Array❳ ", () => {
    vi.expect.soft(box.toType(
      T.Array(T.Literal(1))
    )).toMatchInlineSnapshot
      (`"Array<1>"`)
  })

  vi.test("〖️⛳️〗› ❲T.Record❳ ", () => {
    vi.expect.soft(box.toType(
      T.Record(T.String(), T.Literal(1))
    )).toMatchInlineSnapshot
      (`"Record<string, 1>"`)
    vi.expect.soft(box.toType(
      T.Record(T.Enum({ a: 'A', b: 'B', c: 'C' }), T.Literal(1))
    )).toMatchInlineSnapshot
      (`"{ A: 1, B: 1, C: 1 }"`)
    vi.expect.soft(box.toType(
      T.Record(T.Number(), T.Literal(1))
    )).toMatchInlineSnapshot
      (`"Record<number, 1>"`)
  })

  vi.test("〖️⛳️〗› ❲T.Intersect❳ ", () => {
    vi.expect.soft(box.toType(
      T.Intersect([T.Object({ a: T.Literal(1) }), T.Object({ b: T.Literal(2) })])
    )).toMatchInlineSnapshot
      (`"{ a: 1 } & { b: 2 }"`)
    vi.expect.soft(box.toType(
      T.Intersect([T.Number(), T.Union([T.Literal(1), T.Literal(2), T.Literal(3)])])
    )).toMatchInlineSnapshot
      (`"number & (1 | 2 | 3)"`)
  })

  vi.test("〖️⛳️〗› ❲T.Union❳ ", () => {
    vi.expect.soft(box.toType(
      T.Union([])
    )).toMatchInlineSnapshot
      (`"never"`)
    vi.expect.soft(box.toType(
      T.Union([T.Literal(1)])
    )).toMatchInlineSnapshot
      (`"1"`)
    vi.expect.soft(box.toType(
      T.Union([T.Literal(1), T.Literal(2)])
    )).toMatchInlineSnapshot
      (`"1 | 2"`)
  })

  vi.test("〖️⛳️〗› ❲T.Tuple❳", () => {
    vi.expect.soft(box.toType(
      T.Tuple([T.String(), T.Number(), T.Object({ pointsScored: T.Number() })])
    )).toMatchInlineSnapshot
      (`"[string, number, { pointsScored: number }]"`)
    vi.expect.soft(box.toType(
      T.Tuple([T.Number()])
    )).toMatchInlineSnapshot
      (`"[number]"`)
  })

  vi.test("〖️⛳️〗› ❲T.Object❳", () => {
    vi.expect.soft(box.toType(
      T.Object({ powerlevel: T.Union([T.String(), T.Number()]) })
    )).toMatchInlineSnapshot
      (`"{ powerlevel: (string | number) }"`)
    vi.expect.soft(box.toType(
      T.Object({
        x: T.Optional(T.Array(T.Number())),
        y: T.Optional(T.Array(T.Number())),
        z: T.Optional(T.Array(T.Number())),
      }),
    )).toMatchInlineSnapshot
      (`"{ x?: Array<number>, y?: Array<number>, z?: Array<number> }"`)
  })
})

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: box.toType w/ typeName", () => {
  vi.test("〖️⛳️〗› ❲T.Object❳", () => {
    vi.expect.soft(
      box.toType(T.Object({ a: T.Optional(T.Number()) }), { typeName: 'MyType' })
    ).toMatchInlineSnapshot
      (`"type MyType = { a?: number }"`)
  })
})

