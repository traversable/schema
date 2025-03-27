import * as vi from 'vitest'
import { VERSION } from '@traversable/derive-validators'
import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-validators❳', () => {
  vi.it('〖⛳️〗› ❲deriveValidators#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
