import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import * as v from 'valibot'
import type { AnyValibotSchema } from '@traversable/valibot-types'
import { vx } from '@traversable/valibot'
import { vxTest } from '@traversable/valibot-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })
const print = (x: unknown) =>
  JSON.stringify(x, (_k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)

type LogFailureDeps = {
  schema: AnyValibotSchema
  data: unknown
  error: unknown
  clone?: unknown
}

const logFailure = ({ schema, data, clone, error }: LogFailureDeps) => {
  console.group('FAILURE: property test for vx.deepClone')
  console.error('ERROR:', error)
  console.debug('schema:', vx.toString(schema))
  console.debug('deepClone:', format(vx.deepClone.writeable(schema, { typeName: 'Type' })))
  console.debug('data:', print(data))
  if (data === undefined || clone !== undefined) {
    console.debug('clone:', print(clone))
  }
  console.groupEnd()
}

const Builder = vxTest.SeedGenerator({
  include: [
    'array',
    'bigint',
    'boolean',
    'date',
    'enum',
    'file',
    'blob',
    'lazy',
    'literal',
    'map',
    'nan',
    'null',
    'number',
    'object',
    'optional',
    'record',
    'set',
    'string',
    'tuple',
    'undefined',
    'void',
    // 'non_optional',
    // 'non_nullable',
    // 'non_nullish',
    // 'symbol',
    // 'union',
    // 'variant',
  ],
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳', () => {
  vi.test('〖⛳️〗› ❲vx.deepClone❳: fuzz tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const deepClone = vx.deepClone(schema)
          const data = vxTest.seedToValidData(seed)
          try {
            vi.expect.soft(deepClone(data)).to.deep.equal(data)
          } catch (error) {
            try {
              const clone = deepClone(data)
              logFailure({ schema, data, clone, error })
              vi.expect.fail('Cloned data was not equal')
            } catch (error) {
              logFailure({ schema, data, error })
              vi.expect.fail('Failed to clone data')
            }
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      numRuns: 10_000,
    })
  })
})
