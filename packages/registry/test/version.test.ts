import { VERSION } from '@traversable/registry'
import * as vi from 'vitest'
import pkg from '../package.json'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳', () => {
  vi.it('〖⛳️〗› ❲VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
