import * as vi from "vitest"
import { z } from "zod/v4"

import { zx } from "@traversable/zod"

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/zod❳: zx.classic.paths", () => {
  vi.it("〖️⛳️〗› ❲zx.classic.paths❳ ", () => {
    vi.expect(zx.classic.paths(z.object())).toMatchInlineSnapshot
      (`[]`)

    vi.expect(zx.classic.paths(z.object({}))).toMatchInlineSnapshot
      (`[]`)

    vi.expect(zx.classic.paths(z.object({ a: z.string(), b: z.number() }))).toMatchInlineSnapshot
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

    vi.expect(zx.classic.paths(z.object({ a: z.object({ b: z.string() }), c: z.object({ d: z.number() }) }))).toMatchInlineSnapshot
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
