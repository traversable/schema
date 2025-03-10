import * as vi from 'vitest'
import { JsonSchema } from '@traversable/schema-to-json-schema'


vi.describe('todo', () => {
  vi.it('flesh me out', () => {
    vi.assert.equal(JsonSchema.indexOfFirstOptional([]), 0)
    vi.assert.equal(JsonSchema.indexOfFirstOptional([JsonSchema.optional(JsonSchema.string)]), 0)
    vi.assert.equal(JsonSchema.indexOfFirstOptional([JsonSchema.number, JsonSchema.optional(JsonSchema.string)]), 1)
    vi.assert.equal(JsonSchema.indexOfFirstOptional([JsonSchema.number, JsonSchema.optional(JsonSchema.string), JsonSchema.boolean]), 1)
    vi.assert.equal(JsonSchema.indexOfFirstOptional([JsonSchema.number, JsonSchema.optional(JsonSchema.string), JsonSchema.optional(JsonSchema.boolean)]), 1)
    vi.assert.equal(JsonSchema.indexOfFirstOptional([JsonSchema.number, JsonSchema.boolean]), 2)
  })
})
