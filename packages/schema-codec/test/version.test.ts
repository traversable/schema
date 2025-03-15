import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { VERSION } from '@traversable/schema-codec'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-codec❳', () => {
  vi.it('〖⛳️〗› ❲schemaCodec#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})