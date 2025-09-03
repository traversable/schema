import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'

const Builder = zxTest.SeedGenerator({
  exclude: ['promise']
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepStrict❳: property tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          try {
            vi.assert.equal(
              zx.toString(
                zx.deepStrict(
                  zxTest.seedToSchema(seed)
                )
              ),
              zx.toString(
                zx.deepStrict(
                  zx.deepNonStrict(
                    zx.deepStrict(
                      zxTest.seedToSchema(seed)
                    )
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
  console.group('FAILURE: property test for zx.deepStrict')
  console.debug('zx.toString(schema):', zx.toString(zxTest.seedToSchema(seed)))
  console.debug('zx.deepStrict(schema):', zx.deepStrict.writeable(zxTest.seedToSchema(seed)))
  console.debug(
    'zx.deepNonStrict(zx.deepStrict(schema)):',
    zx.deepNonStrict.writeable(zx.deepStrict(zxTest.seedToSchema(seed))),
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepStrict with schema: ${zx.toString(zxTest.seedToSchema(seed))}`)
}
