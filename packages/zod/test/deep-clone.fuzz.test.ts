import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LogFailureDeps = {
  schema: z.core.$ZodType
  data: unknown
  error: unknown
  clone?: unknown
}

const logFailure = ({ schema, data, clone, error }: LogFailureDeps) => {
  console.group('FAILURE: property test for zx.deepClone')
  console.error('ERROR:', error)
  console.debug('schema:', zx.toString(schema))
  console.debug('deepClone:', format(zx.deepClone.writeable(schema)))
  console.debug('data:', data)
  if (data === undefined || clone !== undefined) console.debug('clone:', clone)
  console.groupEnd()
}

const Builder = zxTest.SeedGenerator({
  exclude: zx.deepClone.unfuzzable
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepClone❳: fuzz tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const deepClone = zx.deepClone(schema)
          const deepEqual = zx.deepEqual(schema)
          const data = zxTest.seedToValidData(seed)
          const clone = deepClone(data)
          try {
            vi.expect.soft(clone).to.deep.equal(data)
            vi.assert.isTrue(deepEqual(clone, data))
          } catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail('deepEqual(clone, data) !== true')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
