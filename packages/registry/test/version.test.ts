import { registry } from '@traversable/registry'
import * as vi from 'vitest'
import pkg from '../package.json'

vi.describe('〖⛳️〗‹‹‹ ❲@registry❳', () => {
  vi.it('〖⛳️〗› ❲registry.VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(registry.VERSION, expected)
  })
})