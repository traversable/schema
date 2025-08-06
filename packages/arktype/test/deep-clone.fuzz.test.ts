import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { type } from 'arktype'
import { ark } from '@traversable/arktype'
import { arkTest } from '@traversable/arktype-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LogFailureDeps = {
  schema: type.Any
  data: unknown
  clone: unknown
  error: unknown
}

function logFailure({ schema, data, clone, error }: LogFailureDeps) {
  console.group('FAILURE: property test for ark.deepClone')
  console.error('ERROR:', error)
  console.debug('schema:', schema)
  console.debug('cloneDeep:', format(ark.deepClone.writeable(schema, { typeName: 'Type' })))
  console.debug('data:', data)
  if (data === undefined || clone !== undefined) console.debug('clone:', clone)
  console.groupEnd()
}

const Builder = arkTest.SeedGenerator({
  exclude: ark.deepClone.unfuzzable
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/arktype❳', () => {
  vi.test('〖⛳️〗› ❲ark.deepClone❳: fuzz tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = arkTest.seedToSchema(seed)
          const deepClone = ark.deepClone(schema)
          const deepEqual = ark.deepEqual(schema)
          const data = arkTest.seedToValidData(seed)
          const clone = deepClone(data)
          const oracle = JSON.parse(JSON.stringify(data))
          try {
            vi.expect.soft(clone).to.deep.equal(data)
            vi.assert.isTrue(deepEqual(clone, data))
          } catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail('deepEqual(clone, data) !== true')
          }
          try {
            if (oracle !== data) vi.assert.isTrue(clone !== data)
          } catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail(`(clone !== data) === false`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
