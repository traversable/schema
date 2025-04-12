import * as vi from 'vitest'
import { t } from '@traversable/schema-core'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-core❳', () => {
  vi.it('〖⛳️〗‹ ❲t.intersect❳: if t.intersect.def receives a non-function, it returns `constTrue`', () => {
    vi.assert.isTrue(t.intersect.def([1])(1))
  })
})
