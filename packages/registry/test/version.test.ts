import * as vi from 'vitest'
import { VERSION } from '@traversable/registry'
import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳', () => {
  vi.it('〖⛳️〗› ❲VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
