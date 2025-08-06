import * as vi from 'vitest'
import { VERSION } from '@traversable/json'
import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json❳', () => {
  vi.test('〖⛳️〗› ❲Json#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})