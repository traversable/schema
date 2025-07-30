import * as vi from 'vitest'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-codec❳', () => {
  vi.it('〖⛳️〗› ❲pre-install❳', () => vi.assert.isFalse(t.has('codec')(t.string)))

  vi.it('〖⛳️〗› ❲post-install❳', () => {
    import('@traversable/schema-codec/install')
      .then(() => vi.assert.isTrue(t.has('codec')(t.string)))
      .catch((e) => vi.assert.fail(e.message))
  })
})
