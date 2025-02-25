import * as vi from 'vitest'
import pkg from '../package.json'
import { valibot } from '@traversable/schema-valibot-adapter'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-valibot-adapter❳', () => {
  vi.it('〖⛳️〗› ❲valibot#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(valibot.VERSION, expected)
  })
})