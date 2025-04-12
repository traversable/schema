import * as vi from 'vitest'
import { URI } from '@traversable/registry'
import { t } from '@traversable/schema-core'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-core❳', () => {
  vi.it('〖⛳️〗‹ ❲t.optional❳: t.optional.is', () => {
    vi.assert.isTrue(t.optional.is(t.optional(t.string)))
    vi.assert.isTrue(t.optional.is({ tag: URI.optional }))

    vi.assert.isFalse(t.optional.is({ tag: URI.string }))
    vi.assert.isFalse(t.optional.is({ tag: 1 }))
    vi.assert.isFalse(t.optional.is(1))
    vi.assert.isFalse(t.optional.is(t.undefined))
    vi.assert.isFalse(t.optional.is(t.void))
  })
})
