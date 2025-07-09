import * as vi from 'vitest'
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepReadonly❳', () => {
    vi.expect.soft(
      zx.deepReadonly.writeable(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1),
              f: z.boolean()
            })).length(10)
          })
        })
      )
    ).toMatchInlineSnapshot
      (`"z.object({a:z.number().readonly(),b:z.string().readonly(),c:z.object({d:z.array(z.object({e:z.number().max(1).readonly(),f:z.boolean().readonly()}).readonly()).length(10).readonly()}).readonly()}).readonly()"`)
  })
})
