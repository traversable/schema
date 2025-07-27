import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })
const print = (x: unknown) =>
  JSON.stringify(x, (k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)

type LogFailureDeps = {
  schema: z.core.$ZodType
  data: unknown
  error: unknown
  clone?: unknown
}

const logFailure = ({ schema, data, clone, error }: LogFailureDeps) => {
  console.group('\n\nFAILURE: property test for zx.deepClone\n\n')
  console.error('ERROR:', error)
  console.debug('schema:', zx.toString(schema))
  console.debug('deepClone:', format(zx.deepClone.writeable(schema, { typeName: 'Type' })))
  console.debug('data:', print(data))
  if (data === undefined || clone !== undefined) {
    console.debug('clone:', print(clone))
  }
  console.groupEnd()
}

const Builder = zxTest.SeedGenerator({
  include: [
    'array',
    'bigint',
    'boolean',
    'catch',
    'date',
    'default',
    'enum',
    'file',
    'int',
    'intersection',
    'lazy',
    'literal',
    'map',
    'nan',
    // 'nonoptional',
    'null',
    'number',
    'object',
    'optional',
    'pipe',
    'prefault',
    'readonly',
    'record',
    'set',
    'string',
    // 'symbol',
    'template_literal',
    'tuple',
    'undefined',
    // 'union',
    'void',
  ],
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepClone❳: fuzz tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const deepClone = zx.deepClone(schema)
          const data = zxTest.seedToValidData(seed)
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
      // numRuns: 10_000,
    })
  })
})
