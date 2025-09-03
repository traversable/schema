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
  vi.test('〖⛳️〗› ❲zx.deepNonStrict❳: property tests', () => {
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
                zx.deepNonStrict(
                  zx.deepStrict(
                    seedToSchema(seed)
                  )
                )
              )
            )
          } catch (e) {
            logFailure(seed, e)
          }
          // exercise the schema to make sure it's well-formed
          try {
            const schema = zx.deepNonStrict(seedToSchema(seed))
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
  console.group('FAILURE: property test for zx.deepNonStrict')
  console.error('ERROR:', error)
  console.debug('zx.toString(schema):', zx.toString(seedToSchema(seed)))
  console.debug('zx.deepNonStrict(schema):', zx.deepNonStrict.writeable(seedToSchema(seed)))
  console.debug(
    'zx.deepNonStrict(zx.deepStrict(schema)):',
    zx.deepNonStrict.writeable(zx.deepStrict(seedToSchema(seed))),
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepNonStrict with schema: ${zx.toString(seedToSchema(seed))}`)
}
