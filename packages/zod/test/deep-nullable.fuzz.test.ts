import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { SeedGenerator, seedToSchema } from '@traversable/zod-test'

const Builder = SeedGenerator({
  exclude: ['nullable', 'promise']
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
  console.group('FAILURE: property test for zx.deepNullable')
  console.debug('zx.toString(schema):', zx.toString(seedToSchema(seed)))
  console.debug('zx.deepNullable(schema):', zx.deepNullable.writeable(seedToSchema(seed)))
  console.debug(
    'zx.deepNonNullable(zx.deepNullable(schema)):',
    zx.deepNonNullable.writeable(zx.deepNullable(seedToSchema(seed)))
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepNullable with schema: ${zx.toString(seedToSchema(seed))}`)
}
