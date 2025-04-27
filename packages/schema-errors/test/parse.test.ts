import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { Seed } from '@traversable/schema-seed'

import { unsafeParse } from '@traversable/schema-errors'

const exclude = [
  // exclude `never` because a schema containing `never` is impossible to satisfy
  'never',
  // exclude `intersect` because some intersections are impossible to satisfy
  'intersect',
  // exclude `symbol`, otherwise Symbol('invalidValue') won't cause the check to fail
  'symbol',
  // exclude `unknown`, otherwise Symbol('invalidValue') won't cause the check to fail
  'unknown',
  // exclude `any`, otherwise Symbol('invalidValue') won't cause the check to fail
  'any'
] as const satisfies any[]

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-errors❳', () => {
  test.prop([Seed.schemaWithMinDepth({
    exclude
  }, 3)], {
    // numRuns: 10_000,
    endOnFailure: true,
  })(
    '〖⛳️〗› ❲unsafeParse❳', (schema) => {
      let parser = unsafeParse(schema)
      let validArbitrary = Seed.arbitraryFromSchema(schema)
      let invalidArbitrary = Seed.invalidArbitraryFromSchema(schema)
      let validData = fc.sample(validArbitrary, 1)[0]
      let invalidData = fc.sample(invalidArbitrary, 1)[0]
      vi.assert.doesNotThrow(() => parser(validData))
      vi.assert.throws(() => parser(invalidData))
    }
  )
})
