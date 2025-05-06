import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { VERSION } from '@traversable/schema-errors'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-errors❳', () => {
  vi.it('〖⛳️〗› ❲schemaErrors#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})