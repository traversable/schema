import * as vi from 'vitest'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.test('〖⛳️〗‹ ❲t.enum❳', () => {
    vi.assert.isFalse(t.enum()(1))
    vi.assert.isFalse(t.enum.def([])(1))
  })
})
