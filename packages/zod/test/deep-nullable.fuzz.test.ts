import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { SeedGenerator, seedToValidData, seedToSchema } from '@traversable/zod-test'

const Builder = SeedGenerator({
  exclude: [
    'nullable',
    'promise',
    // https://github.com/colinhacks/zod/issues/5201
    'intersection',
  ]
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepNullable❳: property tests', () => {
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
                zx.deepNonNullable(
                  zx.deepNullable(
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
            const schema = zx.deepNullable(seedToSchema(seed))
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
  console.group('FAILURE: property test for zx.deepNullable')
  console.error('ERROR:', error)
  console.debug('zx.toString(schema):', zx.toString(seedToSchema(seed)))
  console.debug('zx.deepNullable(schema):', zx.deepNullable.writeable(seedToSchema(seed)))
  console.debug(
    'zx.deepNonNullable(zx.deepNullable(schema)):',
    zx.deepNonNullable.writeable(zx.deepNullable(seedToSchema(seed)))
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepNullable with schema: ${zx.toString(seedToSchema(seed))}`)
}
