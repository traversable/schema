import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { VERSION } from '@traversable/json-schema-test'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json-schema-test❳', () => {
  vi.test('〖⛳️〗› ❲VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
