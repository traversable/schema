import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { VERSION } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema❳', () => {
  vi.it('〖⛳️〗› ❲schema#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})