import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'

import { __fromPath as fromPath } from '@traversable/registry'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema❳', () => {
  let leaf = Symbol.for('leaf')

  test.prop([fc.array(fc.string())])('〖⛳️〗‹ ❲t.has❳', (path) => {
    vi.assert.isTrue(t.has(...path)(fromPath(path, leaf)))
  })
})
