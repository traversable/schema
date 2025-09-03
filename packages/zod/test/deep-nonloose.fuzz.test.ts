import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'

const Builder = zxTest.SeedGenerator({
  exclude: ['promise']
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepNonLoose❳: property tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          try {
            vi.assert.equal(
              zx.toString(
                zxTest.seedToSchema(seed)
              ),
              zx.toString(
                zx.deepNonLoose(
                  zx.deepLoose(
                    zxTest.seedToSchema(seed)
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
  console.group('FAILURE: property test for zx.deepNonLoose')
  console.debug('zx.toString(schema):', zx.toString(zxTest.seedToSchema(seed)))
  console.debug('zx.deepNonLoose(schema):', zx.deepNonLoose.writeable(zxTest.seedToSchema(seed)))
  console.debug(
    'zx.deepNonLoose(zx.deepLoose(schema)):',
    zx.deepNonLoose.writeable(zx.deepLoose(zxTest.seedToSchema(seed))),
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepNonLoose with schema: ${zx.toString(zxTest.seedToSchema(seed))}`)
}
