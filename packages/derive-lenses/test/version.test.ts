import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { deriveLenses } from '@traversable/derive-lenses'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-lenses❳', () => {
  vi.it('〖⛳️〗› ❲deriveLenses#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(deriveLenses.VERSION, expected)
  })
})