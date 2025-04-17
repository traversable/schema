import * as vi from 'vitest'
import { t } from '@traversable/schema-core'
import { fc, test } from '@fast-check/vitest'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-core❳', () => {
  vi.it('〖⛳️〗‹ ❲t.nonnullable❳: failure case', () => {
    vi.assert.isFalse(t.nonnullable(null))
    vi.assert.isFalse(t.nonnullable(void 0))
  })
  test.prop([fc.anything().filter((_) => _ != null)], {})(
    '〖⛳️〗‹ ❲t.nonnullable❳: success case',
    (_) => vi.assert.isTrue(t.nonnullable(_))
  )
})

