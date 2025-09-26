import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { VERSION } from '@traversable/graphql'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/graphql❳', () => {
  vi.test('〖⛳️〗› ❲VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })
})
