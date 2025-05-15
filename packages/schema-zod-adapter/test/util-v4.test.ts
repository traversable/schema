import * as vi from 'vitest'
import { v4 } from '@traversable/schema-zod-adapter'
import { z } from 'zod4'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it('〖⛳️〗› ❲v4.typeof❳', () => {
    vi.assert.equal(v4.typeof(z.string()), 'string')
  })
})
