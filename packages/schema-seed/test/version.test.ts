import * as vi from 'vitest'
import pkg from '../package.json'
import { seed } from '@traversable/schema-seed'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-seed❳', () => {
  vi.it('〖⛳️〗› ❲seed#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(seed.VERSION, expected)
  })
})
