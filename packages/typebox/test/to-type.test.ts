import * as vi from "vitest"
import * as T from "@sinclair/typebox"

import { box } from "@traversable/typebox"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: box.toType", () => {
  vi.it("〖️⛳️〗› ❲T.Never❳ ", () => {
    vi.expect.soft(box.toType(
      T.Never()
    )).toMatchInlineSnapshot
      (`"never"`)
  })

  vi.it("〖️⛳️〗› ❲T.Any❳ ", () => {
    vi.expect.soft(box.toType(
      T.Any()
    )).toMatchInlineSnapshot
      (`"any"`)
  })

  vi.it("〖️⛳️〗› ❲T.Unknown❳ ", () => {
    vi.expect.soft(box.toType(
      T.Unknown()
    )).toMatchInlineSnapshot
      (`"unknown"`)
  })

  vi.it("〖️⛳️〗› ❲T.Void❳ ", () => {
    vi.expect.soft(box.toType(
      T.Void()
    )).toMatchInlineSnapshot
      (`"void"`)
  })

  vi.it("〖️⛳️〗› ❲T.Undefined❳ ", () => {
    vi.expect.soft(box.toType(
      T.Undefined()
    )).toMatchInlineSnapshot
      (`"undefined"`)
  })

  vi.it("〖️⛳️〗› ❲T.Null❳ ", () => {
    vi.expect.soft(box.toType(
      T.Null()
    )).toMatchInlineSnapshot
      (`"null"`)
  })

  vi.it("〖️⛳️〗› ❲T.Symbol❳ ", () => {
    vi.expect.soft(box.toType(
      T.Symbol()
    )).toMatchInlineSnapshot
      (`"symbol"`)
  })

  vi.it("〖️⛳️〗› ❲T.Boolean❳ ", () => {
    vi.expect.soft(box.toType(
      T.Boolean()
    )).toMatchInlineSnapshot
      (`"boolean"`)
  })

  vi.it("〖️⛳️〗› ❲T.BigInt❳ ", () => {
    vi.expect.soft(box.toType(
      T.BigInt()
    )).toMatchInlineSnapshot
      (`"bigint"`)
  })

  vi.it("〖️⛳️〗› ❲T.Number❳ ", () => {
    vi.expect.soft(box.toType(
      T.Number()
    )).toMatchInlineSnapshot
      (`"number"`)
  })

  vi.it("〖️⛳️〗› ❲T.String❳ ", () => {
    vi.expect.soft(box.toType(
      T.String()
    )).toMatchInlineSnapshot
      (`"string"`)
  })

  vi.it("〖️⛳️〗› ❲T.Date❳ ", () => {
    vi.expect.soft(box.toType(
      T.Date()
    )).toMatchInlineSnapshot
      (`"Date"`)
  })

  vi.it("〖️⛳️〗› ❲T.Literal❳", () => {
    vi.expect.soft(box.toType(
      T.Literal("My name is Inigo Montoya")
    )).toMatchInlineSnapshot
      (`""My name is Inigo Montoya""`)
  })

  vi.it("〖️⛳️〗› ❲T.Enum❳", () => {
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

  vi.it("〖️⛳️〗› ❲T.Readonly❳ ", () => {
    vi.expect.soft(box.toType(
      T.Readonly(T.Literal(1))
    )).toMatchInlineSnapshot
      (`"1"`)
  })

  vi.it("〖️⛳️〗› ❲T.Optional❳ ", () => {
    vi.expect.soft(box.toType(
      T.Optional(T.Literal(1))
    )).toMatchInlineSnapshot
      (`"undefined | 1"`)
    vi.expect.soft(box.toType(
      T.Object({ a: T.Optional(T.Literal(1)) })
    )).toMatchInlineSnapshot
      (`"{ a?: 1 }"`)
  })

  vi.it("〖️⛳️〗› ❲T.Array❳ ", () => {
    vi.expect.soft(box.toType(
      T.Array(T.Literal(1))
    )).toMatchInlineSnapshot
      (`"Array<1>"`)
  })

  vi.it("〖️⛳️〗› ❲T.Record❳ ", () => {
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

  vi.it("〖️⛳️〗› ❲T.Intersect❳ ", () => {
    vi.expect.soft(box.toType(
      T.Intersect([T.Object({ a: T.Literal(1) }), T.Object({ b: T.Literal(2) })])
    )).toMatchInlineSnapshot
      (`"{ a: 1 } & { b: 2 }"`)
    vi.expect.soft(box.toType(
      T.Intersect([T.Number(), T.Union([T.Literal(1), T.Literal(2), T.Literal(3)])])
    )).toMatchInlineSnapshot
      (`"number & (1 | 2 | 3)"`)
  })

  vi.it("〖️⛳️〗› ❲T.Union❳ ", () => {
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

  vi.it("〖️⛳️〗› ❲T.Tuple❳", () => {
    vi.expect.soft(box.toType(
      T.Tuple([T.String(), T.Number(), T.Object({ pointsScored: T.Number() })])
    )).toMatchInlineSnapshot
      (`"[string, number, { pointsScored: number }]"`)
    vi.expect.soft(box.toType(
      T.Tuple([T.Number()])
    )).toMatchInlineSnapshot
      (`"[number]"`)
  })

  vi.it("〖️⛳️〗› ❲T.Object❳", () => {
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
  vi.it("〖️⛳️〗› ❲T.Object❳", () => {
    vi.expect.soft(
      box.toType(T.Object({ a: T.Optional(T.Number()) }), { typeName: 'MyType' })
    ).toMatchInlineSnapshot
      (`"type MyType = { a?: number }"`)
  })
})

