import * as vi from 'vitest'
import pkg from '../package.json'
import { schemaParser } from '@traversable/schema-parser'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-parser❳', () => {
  vi.it('〖⛳️〗› ❲schemaParser#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(schemaParser.VERSION, expected)
  })
})