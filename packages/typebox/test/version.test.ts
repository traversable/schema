import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { box } from '@traversable/typebox'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/typebox❳', () => {
  vi.test('〖⛳️〗› ❲box.VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(box.VERSION, expected)
  })
})
