import * as vi from 'vitest'
import { recurse, t, __trim as trim } from '@traversable/schema'


vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('〖⛳️〗› ❲recurse.trim❳', () => {
    vi.assert.equal(trim(), 'undefined')
  })

  vi.it('〖⛳️〗› ❲recurse.toTypeString❳', () => {
    vi.assert.equal(recurse.toTypeString(t.object({})), '{}')
  })

  vi.it('〖⛳️〗› ❲recurse.toString❳', () => {
    vi.assert.equal(recurse.toString(t.integer), 't.integer')
  })
})
