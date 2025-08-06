import * as vi from 'vitest'
import * as fc from 'fast-check'

import { __fromPath as fromPath } from '@traversable/registry'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema❳', () => {
  let leaf = Symbol.for('leaf')
  vi.test('〖⛳️〗‹ ❲t.has❳', () => {
    fc.check(
      fc.property(
        fc.array(fc.string()),
        (path) => vi.assert.isTrue(t.has(...path)(fromPath(path, leaf)))
      )
    )
  })
})
