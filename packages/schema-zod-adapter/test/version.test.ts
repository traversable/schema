import { VERSION, RAISE_ISSUE_URL } from '@traversable/schema-zod-adapter'
import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it('〖⛳️〗› ❲zod.VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(VERSION, expected)
  })

  vi.it('〖⛳️〗› ❲zod.RAISE_ISSUE_URL❳', () => {
    vi.assert.equal(RAISE_ISSUE_URL, pkg.bugs.url)
  })
})
