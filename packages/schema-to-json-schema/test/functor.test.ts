import * as vi from 'vitest'
import { test } from '@fast-check/vitest'

import { fn } from '@traversable/registry'
import { Functor } from '@traversable/schema-to-json-schema/functor'
import { Gen } from '@traversable/schema-to-json-schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-json-schema❳', () => {
  test.prop([Gen.any()], {
    endOnFailure: true,
    // numRuns: 5_000,
  })(
    '〖⛳️〗› ❲Functor laws❳: Functor preserves identity', (tree) => {
      const fold = fn.cataIx(Functor, { depth: 0, path: [] })
      const id = fold((x) => x)
      vi.assert.deepEqual(id(tree), tree)
    }
  )
})
