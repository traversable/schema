import * as vi from 'vitest'
import pkg from '../package.json'
import { schemaToJsonSchema } from '@traversable/schema-to-json-schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-json-schema❳', () => {
  vi.it('〖⛳️〗› ❲schemaToJsonSchema#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(schemaToJsonSchema.VERSION, expected)
  })
})