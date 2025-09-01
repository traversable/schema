import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false, printWidth: 50 })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepReadonly❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepReadonly(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepRequired❳', () => {
    vi.expect.soft(format(
      zx.deepRequired.writeable(
        z.object({
          a: z.optional(z.number()),
          b: z.optional(z.string()),
          c: z.object({
            d: z.optional(
              z.array(
                z.optional(
                  z.object({
                    e: z.number().max(1),
                    f: z.optional(z.optional(z.boolean()))
                  })
                )
              )
            )
          })
        })
      )
    )).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number(),
        b: z.string(),
        c: z.object({
          d: z.array(
            z
              .object({
                e: z.number().max(1),
                f: z.boolean().optional(),
              })
              .optional(),
          ),
        }),
      })
      "
    `)
  })
})
