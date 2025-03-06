import * as vi from 'vitest'
import pkg from '../package.json'
import { deriveValidators } from '@traversable/derive-validators'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-validators❳', () => {
  vi.it('〖⛳️〗› ❲deriveValidators#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(deriveValidators.VERSION, expected)
  })
})