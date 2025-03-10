import * as vi from 'vitest'
import pkg from '../package.json'
import { VERSION } from '@traversable/schema-to-string'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-string❳', () => {
  vi.it('〖⛳️〗› ❲toString#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})