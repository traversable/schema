import * as vi from 'vitest'
import { VERSION } from '@traversable/schema-seed'
import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-seed❳', () => {
  vi.test('〖⛳️〗› ❲seed#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
