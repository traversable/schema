import * as vi from 'vitest'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-deep-equal❳', () => {
  vi.test('〖⛳️〗› ❲pre-install❳', () => vi.assert.isFalse(t.has('equals')(t.string)))

  vi.test('〖⛳️〗› ❲post-install❳', () => {
    import('@traversable/schema-deep-equal/install')
      .then(() => vi.assert.isTrue(t.has('equals')(t.string)))
      .catch((e) => vi.assert.fail(e.message))
  })
})
