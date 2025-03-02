import * as vi from 'vitest'
import pkg from '../package.json'
import { VERSION } from '@traversable/derive-equals'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-equals❳', () => {
  vi.it('〖⛳️〗› ❲Eq#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
