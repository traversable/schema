import * as vi from "vitest"
import { z } from "zod"

import { zx } from "@traversable/zod"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.paths", () => {
  vi.test("〖️⛳️〗› ❲zx.toPaths❳: z.object ", () => {
    vi.expect.soft(zx.toPaths(z.object())).toMatchInlineSnapshot
      (`[]`)

    vi.expect.soft(zx.toPaths(z.object({}))).toMatchInlineSnapshot
      (`[]`)

    vi.expect.soft(zx.toPaths(z.object({ a: z.string(), b: z.number() }))).toMatchInlineSnapshot
      (`
      [
        [
          "a",
        ],
        [
          "b",
        ],
      ]
    `)

    vi.expect.soft(zx.toPaths(z.object({ a: z.object({ b: z.string() }), c: z.object({ d: z.number() }) }))).toMatchInlineSnapshot
      (`
      [
        [
          "a",
          "b",
        ],
        [
          "c",
          "d",
        ],
      ]
    `)
  })

  vi.test("〖️⛳️〗› ❲zx.toPaths❳: z.record", () => {
    vi.expect.soft(zx.toPaths(
      z.record(z.enum([]), z.object({
        a: z.number(),
        b: z.object({
          c: z.string(),
          d: z.boolean(),
        }),
      }))
    )).toMatchInlineSnapshot
      (`[]`)

    // https://github.com/traversable/schema/issues/554
    vi.expect.soft(zx.toPaths(
      z.record(z.enum(['left', 'right']), z.object({
        a: z.number(),
        b: z.object({
          c: z.string(),
          d: z.boolean(),
        }),
      }))
    )).toMatchInlineSnapshot
      (`
      [
        [
          "left",
          "a",
        ],
        [
          "right",
          "a",
        ],
        [
          "left",
          "b",
          "c",
        ],
        [
          "right",
          "b",
          "c",
        ],
        [
          "left",
          "b",
          "d",
        ],
        [
          "right",
          "b",
          "d",
        ],
      ]
    `)
  })
})
