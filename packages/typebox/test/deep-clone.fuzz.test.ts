import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import * as T from '@sinclair/typebox'
import { box } from '@traversable/typebox'
import { boxTest } from '@traversable/typebox-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LogFailureDeps = {
  schema: T.TSchema
  data: unknown
  error: unknown
  clone?: unknown
}

const logFailure = ({ schema, data, clone, error }: LogFailureDeps) => {
  console.group('FAILURE: property test for box.deepClone')
  console.error('ERROR:', error)
  console.debug('schema:', box.toString(schema))
  console.debug('deepClone:', format(box.deepClone.writeable(schema, { typeName: 'Type' })))
  console.debug('data:', data)
  if (data === undefined || clone !== undefined) console.debug('clone:', clone)
  console.groupEnd()
}

const Builder = boxTest.SeedGenerator({
  exclude: box.deepClone.unfuzzable,
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/typebox❳', () => {
  vi.test('〖⛳️〗› ❲box.deepClone❳: fuzz tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const deepClone = box.deepClone(schema)
          const deepEqual = box.deepEqual(schema)
          const data = boxTest.seedToValidData(seed)
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
