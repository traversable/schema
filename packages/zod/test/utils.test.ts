import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.isOptional❳', () => {
    vi.expect.soft(zx.isOptional(z.optional(z.string()))).to.be.true
    vi.expect.soft(z.tuple([z.boolean(), z.optional(z.boolean())])._zod.def.items.filter(zx.isOptional)).to.have.lengthOf(1)
  })
  vi.test('〖⛳️〗› ❲zx.hasOptional❳', () => {
    vi.assert.isFalse(zx.hasOptional(z.object({ a: z.undefined() })._zod.def.shape.a))
  })
})
