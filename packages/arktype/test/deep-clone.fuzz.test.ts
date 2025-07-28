import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { type } from 'arktype'
import { ark } from '@traversable/arktype'
import { arkTest } from '@traversable/arktype-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })
const print = (src: unknown) => JSON.stringify(src, null, 2)

type LogFailureDeps = {
  schema: type.Any
  data: unknown
  clone: unknown
  error: unknown
}

function logFailure({ schema, data, clone, error }: LogFailureDeps) {
  console.group('\n\n\rFAILURE: property test for ark.deepClone\n\n\r')
  console.error('ERROR:', error)
  console.debug('schema:\n\r', print(schema), '\n\r')
  console.debug(
    'cloneDeep:\n\r',
    format(ark.deepClone.writeable(schema, { typeName: 'Type' }))
  )
  console.debug('data:\n\r', print(data), '\n\r')
  if (data === undefined || clone !== undefined) {
    console.debug('clone:\n\r', print(clone), '\n\r')
  }
  console.groupEnd()
}

const include = [
  'array',
  'boolean',
  'enum',
  'intersection',
  'null',
  'number',
  'object',
  'record',
  'string',
  'tuple',
  // 'union',
] as const

const Builder = arkTest.SeedGenerator({ include })

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
          try { deepEqual(clone, data) }
          catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail('deepEqual(clone, data) === false')
          }
          try { oracle !== data && vi.assert.isTrue(clone !== data) }
          catch (error) {
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
