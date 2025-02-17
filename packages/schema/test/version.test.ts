import { schema } from '@traversable/schema'
import * as vi from 'vitest'
import pkg from '../package.json'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema/version❳', () => {
  vi.it('schema#VERSION', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(schema.VERSION, expected)
  })
})