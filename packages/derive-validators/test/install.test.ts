import * as vi from 'vitest'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-validators❳', () => {
  vi.it('〖⛳️〗› ❲pre-install❳', () => vi.assert.isFalse(t.has('validate')(t.string)))

  vi.it('〖⛳️〗› ❲post-install❳', () => {
    import('@traversable/derive-validators/install')
      .then(() => vi.assert.isTrue(t.has('validate')(t.string)))
      .catch((e) => vi.assert.fail(e.message))
  })
})

