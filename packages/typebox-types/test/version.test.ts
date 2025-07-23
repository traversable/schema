import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { VERSION } from '@traversable/typebox-types'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/typebox-types❳', () => {
  vi.it('〖⛳️〗› ❲VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
