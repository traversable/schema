import * as vi from 'vitest'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-validator❳', () => {
  vi.test('〖⛳️〗› ❲pre-install❳', () => vi.assert.isFalse(t.has('toJsonSchema')(t.string)))

  vi.test('〖⛳️〗› ❲post-install❳', () => {
    import('@traversable/schema-to-json-schema/install')
      .then(() => vi.assert.isTrue(t.has('toJsonSchema')(t.string)))
      .catch((e) => vi.assert.fail(e.message))
  })
})


