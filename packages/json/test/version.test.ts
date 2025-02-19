import { VERSION } from '@traversable/json'
import * as vi from 'vitest'
import pkg from '../package.json'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json❳', () => {
  vi.it('〖⛳️〗› ❲Json#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})