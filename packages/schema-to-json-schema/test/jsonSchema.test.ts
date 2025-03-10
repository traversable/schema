import * as vi from 'vitest'
import { JsonSchema as j } from '@traversable/schema-to-json-schema'


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-json-schema❳', () => {
  vi.it('〖⛳️〗› ❲JsonSchema.minItems❳', () => {
    vi.assert.equal(j.minItems([]), 0)
    vi.assert.equal(j.minItems([j.optional(j.string)]), 0)
    vi.assert.equal(j.minItems([j.number, j.optional(j.string)]), 1)
    vi.assert.equal(j.minItems([j.number, j.optional(j.string), j.boolean]), 1)
    vi.assert.equal(j.minItems([j.number, j.optional(j.string), j.optional(j.boolean)]), 1)
    vi.assert.equal(j.minItems([j.number, j.boolean]), 2)
  })
})
