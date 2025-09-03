import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { SeedGenerator, seedToValidData, seedToSchema } from '@traversable/zod-test'

const Builder = SeedGenerator({
  exclude: [
    'promise',
    // https://github.com/colinhacks/zod/issues/5201
    'intersection',
  ]
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepLoose❳: property tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          try {
            vi.assert.equal(
              zx.toString(
                zx.deepLoose(
                  seedToSchema(seed)
                )
              ),
              zx.toString(
                zx.deepLoose(
                  zx.deepNonLoose(
                    zx.deepLoose(
                      seedToSchema(seed)
                    )
                  )
                )
              )
            )
          } catch (e) {
            logFailure(seed, e)
          }
          // exercise the schema to make sure it's well-formed
          try {
            const schema = zx.deepLoose(seedToSchema(seed))
            const data = seedToValidData(seed)
            vi.assert.doesNotThrow(() => schema.safeParse(data))
          } catch (e) {
            logFailure(seed, e)
          }
        }
      ), {
      // numRuns: 10_000,
      endOnFailure: true,
    })
  })
})

type Infer<S> = S extends fc.Arbitrary<infer T> ? T : never

function logFailure(seed: Infer<typeof Builder['*']>, error: unknown) {
  console.group('FAILURE: property test for zx.deepNonLoose')
  console.error('ERROR:', error)
  console.debug('zx.toString(schema):', zx.toString(seedToSchema(seed)))
  console.debug('zx.deepLoose(schema):', zx.deepLoose.writeable(seedToSchema(seed)))
  console.debug(
    'zx.deepNonLoose(zx.deepLoose(schema)):',
    zx.deepNonLoose.writeable(zx.deepLoose(seedToSchema(seed))),
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepLoose with schema: ${zx.toString(seedToSchema(seed))}`)
}
