import * as vi from 'vitest'
import { t } from '@traversable/schema-core'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-json-schema❳', () => {
  vi.it('〖⛳️〗› ❲t.optional❳', () => {
    vi.assert.deepEqual(t.object({ a: t.number, b: t.optional(t.string) }).opt, ['b'])
    vi.assert.isTrue(t.object({ a: t.number, b: t.optional(t.string) })({ a: 0 }))
  })
})
