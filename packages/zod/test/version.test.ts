import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.it('〖⛳️〗› ❲zx.VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(zx.VERSION, expected)
  })
})
