import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { SeedGenerator, seedToSchema } from '@traversable/graphql-test'
import * as F from '@traversable/graphql-types'

function format(src: string) {
  return prettier.format(src, { parser: 'graphql', printWidth: 60 })
}

const Builder = SeedGenerator()

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/graphql-test❳', () => {
  vi.test('〖⛳️〗› ❲SeedGenerator❳: generates valid seeds', () => {
    fc.assert(
      fc.property(
        Builder.Document,
        (seed) => {
          const schema = seedToSchema(seed)
          vi.assert.doesNotThrow(() => format(F.toString(schema)))
        }
      ),
      {
        endOnFailure: true,
        // numRuns: 4_000,
      }
    )
  })
})
