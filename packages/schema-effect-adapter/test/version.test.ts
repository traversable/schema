import * as vi from 'vitest'
import pkg from '../package.json'
import { schemaEffectAdapter } from '@traversable/schema-effect-adapter'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-effect-adapter❳', () => {
  vi.it('〖⛳️〗› ❲schemaEffectAdapter#VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(schemaEffectAdapter.VERSION, expected)
  })
})