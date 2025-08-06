import * as vi from 'vitest'
import * as fc from 'fast-check'

import { fn } from '@traversable/registry'
import { Functor } from '@traversable/schema-to-json-schema/functor'
import { Gen } from '@traversable/schema-to-json-schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-json-schema❳', () => {
  vi.test('〖⛳️〗› ❲Functor laws❳: Functor preserves identity', () => {
    fc.check(
      fc.property(
        Gen.any(),
        (tree) => {
          const fold = fn.cataIx(Functor, { depth: 0, path: [] })
          const id = fold((x) => x)
          vi.assert.deepEqual(id(tree), tree)
        }
      ), {
      endOnFailure: true,
      // numRuns: 5_000,
    })
  })
})
