import * as vi from 'vitest'
import { VERSION } from '@traversable/schema-to-validator'
import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-validator❳', () => {
  vi.it('〖⛳️〗› ❲deriveValidators#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
