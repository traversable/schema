import { schemaZodAdapter } from '@traversable/schema-zod-adapter'
import * as vi from 'vitest'
import pkg from '../package.json'

vi.describe('schema-zod-adapter', () => {
  vi.it('schemaZodAdapter.VERSION', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(schemaZodAdapter.VERSION, expected)
  })
})