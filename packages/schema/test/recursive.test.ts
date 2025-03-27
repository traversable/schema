import * as vi from 'vitest'
import { recurse, t, '~!trim' as trim } from '@traversable/schema'


vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('〖⛳️〗› ❲recurse.trim❳', () => {
    vi.assert.equal(trim(), 'undefined')
  })

  vi.it('〖⛳️〗› ❲recurse.toTypeString❳', () => {
    vi.assert.equal(recurse.toTypeString(t.object({})), '{}')
  })
})
