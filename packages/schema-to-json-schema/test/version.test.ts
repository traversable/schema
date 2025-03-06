import * as vi from 'vitest'
import pkg from '../package.json'
import { VERSION } from '@traversable/schema-to-json-schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-json-schema❳', () => {
  vi.it('〖⛳️〗› ❲JsonSchema#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
