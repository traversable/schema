import * as vi from 'vitest'
import pkg from '../package.json' with { type: 'json' }
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('〖⛳️〗› ❲t.VERSION❳', () => {
    const expected = `${pkg.name}@${pkg.version}`
    vi.assert.equal(t.VERSION, expected)
  })
})
