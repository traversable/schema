import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false, printWidth: 50 })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepOptional❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepOptional(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepOptional❳', () => {
    vi.expect.soft(format(
      zx.deepOptional.writeable(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.tuple([
              z.bigint(),
              z.object({
                e: z.number().max(1),
                f: z.boolean()
              }),
            ])
          })
        })
      )
    )).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number().optional(),
        b: z.string().optional(),
        c: z
          .object({
            d: z
              .tuple([
                z.bigint(),
                z.object({
                  e: z.number().max(1).optional(),
                  f: z.boolean().optional(),
                }),
              ])
              .optional(),
          })
          .optional(),
      })
      "
    `)
  })
})
