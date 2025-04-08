import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { schemaGenerator } from '@traversable/schema-generator'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-generator❳', () => {
  vi.it('〖⛳️〗› ❲schemaGenerator#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(schemaGenerator.VERSION, expected)
  })
})