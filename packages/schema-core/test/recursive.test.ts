import * as vi from 'vitest'
import { recurse, t, __trim as trim } from '@traversable/schema-core'


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-core❳', () => {
  vi.it('〖⛳️〗› ❲recurse.trim❳', () => {
    vi.assert.equal(trim(), 'undefined')
  })

  vi.it('〖⛳️〗› ❲recurse.toTypeString❳', () => {
    vi.assert.equal(recurse.toTypeString(t.object({})), '{}')
  })
})
