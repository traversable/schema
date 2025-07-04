import * as vi from "vitest"
import { z } from "zod/v4"

import { zx } from "@traversable/zod"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.paths", () => {
  vi.it("〖️⛳️〗› ❲zx.paths❳ ", () => {
    vi.expect.soft(zx.paths(z.object())).toMatchInlineSnapshot
      (`[]`)

    vi.expect.soft(zx.paths(z.object({}))).toMatchInlineSnapshot
      (`[]`)

    vi.expect.soft(zx.paths(z.object({ a: z.string(), b: z.number() }))).toMatchInlineSnapshot
      (`
      [
        [
          ".a",
        ],
        [
          ".b",
        ],
      ]
    `)

    vi.expect.soft(zx.paths(z.object({ a: z.object({ b: z.string() }), c: z.object({ d: z.number() }) }))).toMatchInlineSnapshot
      (`
      [
        [
          ".a",
          ".b",
        ],
        [
          ".c",
          ".d",
        ],
      ]
    `)

  })
})
