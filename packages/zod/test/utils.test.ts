import * as vi from 'vitest'
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.isOptional❳', () => {
    vi.expect.soft(zx.isOptional(z.optional(z.string()))).to.be.true
    vi.expect.soft(z.tuple([z.boolean(), z.optional(z.boolean())])._zod.def.items.filter(zx.isOptional)).to.have.lengthOf(1)
  })
})
