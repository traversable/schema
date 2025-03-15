import * as vi from 'vitest'
import { core } from '@traversable/schema-core'

import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@schema-core❳', () => {
  vi.it('〖⛳️〗› ❲schemaCore.VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(core.VERSION, expected)
  })
})
