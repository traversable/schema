import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { SeedGenerator, seedToValidData, seedToSchema } from '@traversable/zod-test'

const Builder = SeedGenerator({
  exclude: [
    'optional',
    'promise',
    // https://github.com/colinhacks/zod/issues/5201
    'intersection',
  ]
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepPartial❳: property tests', () => {
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
                  zx.deepPartial(
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
            const schema = zx.deepPartial(seedToSchema(seed))
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
  console.group('FAILURE: property test for zx.deepPartial')
  console.error('ERROR:', error)
  console.debug('zx.toString(schema):', zx.toString(seedToSchema(seed)))
  console.debug('zx.deepPartial(schema):', zx.deepPartial.writeable(seedToSchema(seed)))
  console.debug(
    'zx.deepRequired(zx.deepPartial(schema)):',
    zx.deepRequired.writeable(zx.deepPartial(seedToSchema(seed), 'preserveSchemaType')),
  )
  console.groupEnd()
  vi.expect.fail(`Roundtrip failed for zx.deepPartial with schema: ${zx.toString(seedToSchema(seed))}`)
}
