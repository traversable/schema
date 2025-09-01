import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepNonNullable❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepNonNullable(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepNonNullable❳', () => {
    vi.expect.soft(format(
      zx.deepNonNullable.writeable(
        z.object({
          a: z.number().nullable(),
          b: z.string().nullable(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1).nullable(),
              f: z.boolean().nullable()
            })).length(10)
          })
        })
      )
    )).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number(),
        b: z.string(),
        c: z.object({
          d: z.array(z.object({ e: z.number().max(1), f: z.boolean() })).length(10),
        }),
      })
      "
    `)
  })
})
