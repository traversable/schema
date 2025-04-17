import * as vi from 'vitest'
import { t } from '@traversable/schema-core'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/derive-validators❳', () => {
  vi.it('〖⛳️〗› ❲pre-install❳', () => vi.assert.isFalse(t.has('toJsonSchema')(t.string)))

  vi.it('〖⛳️〗› ❲post-install❳', () => {
    import('@traversable/schema-to-json-schema/install')
      .then(() => vi.assert.isTrue(t.has('toJsonSchema')(t.string)))
      .catch((e) => vi.assert.fail(e.message))
  })
})
