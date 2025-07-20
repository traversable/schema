import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { z } from 'zod'
import { zx } from '@traversable/zod'

const Builder = zx.SeedGenerator({
  include: [
    'array',
    'bigint',
    'boolean',
    'catch',
    'date',
    'default',
    'enum',
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
  vi.test('〖⛳️〗› ❲zx.clone❳: fuzz tests', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = zx.seedToSchema(seed)
          const clonedSchema = z.clone(schema)
          const data = zx.seedToValidData(seed)
          const deepClone = zx.clone(schema)
          try { vi.expect.soft(deepClone(data)).to.deep.equal(data) }
          catch (e) {
            console.error('OUTER BLOCK', e)
            try {
              const clonedData = deepClone(data)
              logFailure({ schema: clonedSchema, data, clonedData })
              vi.expect.fail()
            } catch (e) {
              console.error('INNER BLOCK', e)
              logFailure({ schema: clonedSchema, data })
              vi.expect.fail()
            }
          }
        }
      ), {
      endOnFailure: true,
      examples: [
        [[3500, [2500, [2500, [15]]]]],
        [[8000, [[7500, [["$$NN0$5$$g$", [15]], ["_812", [2500, [15]]]]], [2500, [15]]]]],
        [[7500, [["f$$R2Ru_1", [2500, [50]]], ["__J0$$5_64_", [15]]]]],
      ],
      numRuns: 10_000,
    })
  })
})

type LogFailureDeps = { schema: z.ZodType, data: unknown, clonedData?: unknown }
const logFailure = ({ schema, data, clonedData }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for zx.clone\n\n\r')
  console.debug('zx.toString(schema):\n\r', zx.toString(schema), '\n\r')
  console.debug('zx.clone.writeable(schema):\n\r', format(zx.clone.writeable(schema, { typeName: 'Type' })), '\n\r')
  console.debug('stringify(data):\n\r', stringify(data), '\n\r')
  console.debug('data:\n\r', data, '\n\r')
  if (data === undefined || clonedData !== undefined) {
    console.debug('stringify(clonedData):\n\r', stringify(clonedData), '\n\r')
    console.debug('clonedData:\n\r', clonedData, '\n\r')
  }
  console.groupEnd()
}

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

const stringify = (x: unknown) => {
  return JSON.stringify(x, (k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)
}
