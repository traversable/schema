import * as vi from 'vitest'
import { VERSION } from '@traversable/schema-codec'
import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-codec❳', () => {
  vi.it('〖⛳️〗› ❲VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
