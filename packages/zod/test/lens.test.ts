import * as vi from 'vitest'
import { z } from 'zod/v4'
import { makeLens } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.it('〖⛳️〗› ❲makeLens❳', () => {
    vi.expectTypeOf
    const sas = makeLens(
      z.union([
        z.object({ tag: z.literal('A') }),
        z.object({ tag: z.literal('B') }),
        z.object({ tag: z.literal('C') })
      ]),
      (proxy) => proxy.ꖛA
      // ^?
    )

    // sas.modify(x => x.tag, { tag: 'A' })
    //         ^?

  })
})

