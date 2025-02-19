import { json } from '@traversable/json'
import * as vi from 'vitest'
import pkg from '../package.json'

vi.describe('〖⛳️〗‹‹‹ ❲@json❳', () => {
  vi.it('〖⛳️〗› ❲json.VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(json.VERSION, expected)
  })
})