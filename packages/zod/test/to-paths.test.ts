import * as vi from "vitest"
import { z } from "zod"

import { zx } from "@traversable/zod"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.paths", () => {
  vi.it("〖️⛳️〗› ❲zx.toPaths❳ ", () => {
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
})
