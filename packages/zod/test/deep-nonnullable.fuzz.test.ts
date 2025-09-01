import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'

const Builder = zxTest.SeedGenerator({
  exclude: ['nullable', 'promise']
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepNonNullable❳: property tests', () => {
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
                zx.deepNonNullable(
                  zx.deepNullable(
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
  console.group('FAILURE: property test for zx.deepNonNullable')
  console.debug('zx.toString(schema):', zx.toString(zxTest.seedToSchema(seed)))
  console.debug('zx.deepNonNullable(schema):', zx.deepNonNullable.writeable(zxTest.seedToSchema(seed)))
  console.debug(
    'zx.deepNonNullable(zx.deepNullable(schema)):',
    zx.deepNonNullable.writeable(zx.deepNullable(zxTest.seedToSchema(seed))),
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepNonNullable with schema: ${zx.toString(zxTest.seedToSchema(seed))}`)
}
