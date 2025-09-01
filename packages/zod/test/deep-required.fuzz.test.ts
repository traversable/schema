import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { SeedGenerator, seedToSchema } from '@traversable/zod-test'

const Builder = SeedGenerator({
  exclude: ['optional', 'promise']
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepRequired❳: property tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          try {
            vi.assert.equal(
              zx.toString(
                seedToSchema(seed)
              ),
              zx.toString(
                zx.deepRequired(
                  zx.deepOptional(
                    seedToSchema(seed)
                  )
                )
              )
            )
          } catch (e) {
            logFailure(seed)
          }
        }
      ), {
      // numRuns: 10_000,
      endOnFailure: true,
    })
  })
})

type Infer<S> = S extends fc.Arbitrary<infer T> ? T : never

function logFailure(seed: Infer<typeof Builder['*']>) {
  console.group('FAILURE: property test for zx.deepRequired')
  console.debug('zx.toString(schema):', zx.toString(seedToSchema(seed)))
  console.debug('zx.deepRequired(schema):', zx.deepRequired.writeable(seedToSchema(seed)))
  console.debug(
    'zx.deepRequired(zx.deepOptional(schema)):',
    zx.deepRequired.writeable(zx.deepOptional(seedToSchema(seed), 'preserveSchemaType')),
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepRequired with schema: ${zx.toString(seedToSchema(seed))}`)
}
