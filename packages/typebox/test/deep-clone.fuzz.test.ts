import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import * as T from '@sinclair/typebox'
import { box } from '@traversable/typebox'
import { boxTest } from '@traversable/typebox-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })
const print = (x: unknown) =>
  JSON.stringify(x, (_, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)

type LogFailureDeps = {
  schema: T.TSchema
  data: unknown
  error: unknown
  clone?: unknown
}

const logFailure = ({ schema, data, clone, error }: LogFailureDeps) => {
  console.group('\n\nFAILURE: property test for box.deepClone\n\n')
  console.error('ERROR:', error)
  console.debug('schema:', box.toString(schema))
  console.debug('deepClone:', format(box.deepClone.writeable(schema, { typeName: 'Type' })))
  console.debug('data:', print(data))
  if (data === undefined || clone !== undefined) {
    console.debug('clone:', print(clone))
  }
  console.groupEnd()
}

const Builder = boxTest.SeedGenerator({
  include: [
    'array',
    'bigint',
    'boolean',
    'date',
    'integer',
    'null',
    'number',
    'object',
    'optional',
    'record',
    'string',
    'tuple',
    'undefined',
    'void',
    'intersect',
    // 'union',
  ],
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/typebox❳', () => {
  vi.test('〖⛳️〗› ❲box.deepClone❳: fuzz tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const deepClone = box.deepClone(schema)
          const data = boxTest.seedToValidData(seed)
          try {
            vi.expect.soft(deepClone(data)).to.deep.equal(data)
          } catch (error) {
            try {
              const clone = deepClone(data)
              logFailure({ schema, data, clone, error })
              vi.expect.fail('Cloned data was not equal')
            } catch (error) {
              logFailure({ schema, data, error })
              vi.expect.fail('Failed to create deepClone function')
            }
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
