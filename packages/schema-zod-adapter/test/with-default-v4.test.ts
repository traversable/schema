import * as vi from 'vitest'
import { z } from 'zod/v4'
import { v4 } from '@traversable/schema-zod-adapter'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it("〖️⛳️〗› ❲v4.withDefault❳", () => {

    const schema = z.object({
      a: z.number(),
      b: z.string().readonly(),
      c: z.object({
        d: z.array(
          z.object({
            e: z.number().max(1),
            f: z.boolean()
          })
        ).length(10)
      })
    })

    vi.expect(v4.withDefault(schema)).toMatchInlineSnapshot
      (`
      {
        "a": undefined,
        "b": undefined,
        "c": {
          "d": [
            {
              "e": undefined,
              "f": undefined,
            },
          ],
        },
      }
    `)

    vi.expect(v4.withDefault(
      schema,
      { number: 0, string: '', boolean: false }
    )).toMatchInlineSnapshot
      (`
      {
        "a": 0,
        "b": "",
        "c": {
          "d": [
            {
              "e": 0,
              "f": false,
            },
          ],
        },
      }
    `)

    vi.expect(v4.withDefault(
      z.object({ A: z.record(z.enum(['B', 'C']), z.boolean()) }),
    )).toMatchInlineSnapshot
      (`
      {
        "A": {
          "B": undefined,
          "C": undefined,
        },
      }
    `)
  })
})
