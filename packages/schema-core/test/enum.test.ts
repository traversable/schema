import * as vi from 'vitest'
import { t } from '@traversable/schema-core'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-core❳', () => {
  vi.it('〖⛳️〗‹ ❲t.enum❳', () => {
    vi.assert.isFalse(t.enum()(1))
    vi.assert.isFalse(t.enum.def([])(1))
  })
})
