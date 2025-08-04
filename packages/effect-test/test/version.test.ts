import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { VERSION } from '@traversable/effect-test'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/effect-test❳', () => {
  vi.it('〖⛳️〗› ❲VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
