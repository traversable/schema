import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'

const Builder = zxTest.SeedGenerator({
  exclude: ['promise']
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
                zxTest.seedToSchema(seed)
              ),
              zx.toString(
                zx.deepNonStrict(
                  zx.deepStrict(
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
  console.group('FAILURE: property test for zx.deepNonStrict')
  console.debug('zx.toString(schema):', zx.toString(zxTest.seedToSchema(seed)))
  console.debug('zx.deepNonStrict(schema):', zx.deepNonStrict.writeable(zxTest.seedToSchema(seed)))
  console.debug(
    'zx.deepNonStrict(zx.deepStrict(schema)):',
    zx.deepNonStrict.writeable(zx.deepStrict(zxTest.seedToSchema(seed))),
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepNonStrict with schema: ${zx.toString(zxTest.seedToSchema(seed))}`)
}
