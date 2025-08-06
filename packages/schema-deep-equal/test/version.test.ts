import * as vi from 'vitest'
import { VERSION } from '@traversable/schema-deep-equal'
import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-deep-equal❳', () => {
  vi.test('〖⛳️〗› ❲Eq#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
