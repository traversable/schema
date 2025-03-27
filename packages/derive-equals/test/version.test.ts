import * as vi from 'vitest'
import { VERSION } from '@traversable/derive-equals'
import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', () => {
  vi.it('〖⛳️〗› ❲Eq#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
