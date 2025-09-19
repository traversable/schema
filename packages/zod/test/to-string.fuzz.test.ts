import * as vi from 'vitest'
import * as z from 'zod'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { fn } from '@traversable/registry'
import { zx } from '@traversable/zod'
import {
  seedToSchema,
  seedToValidData,
  seedToInvalidData,
  SeedGenerator,
} from '@traversable/zod-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: z.ZodType
  data: unknown
  error: unknown
}

function logger({ schema, data, error }: LoggerDeps) {
  console.group('FAILURE: property test for zx.toString')
  console.error('Error:', error)
  console.debug('schema:', format(zx.toString(schema)))
  console.debug('data:', data)
  console.groupEnd()
}

const Generator = fn.pipe(
  SeedGenerator({
    exclude: [
      'any',
      'catch',
      'custom',
      'default',
      'prefault',
      'never',
      'nonoptional',
      'pipe',
      'promise',
      'symbol',
      'transform',
      'unknown',
      'success',
      'prefault',
      'template_literal',
    ]
  }),
  ($) => fc.oneof(
    $.object,
    $.tuple,
    $.array,
    $.record,
  )
)

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲zx.toString❳: roundtrip property', () => {
    fc.assert(
      fc.property(
        Generator,
        (seed) => {
          const inputSchema = seedToSchema(seed)
          const validData = seedToValidData(seed)
          const invalidData = seedToInvalidData(seed)
          const outputSchema: z.ZodType = eval(`(() => {
            const z = require('zod')
            return ${zx.toString(inputSchema)}
          })()`)

          // sanity check:
          vi.assert.throws(() => inputSchema.parse(invalidData))
          vi.assert.doesNotThrow(() => inputSchema.parse(validData))

          try {
            vi.assert.throws(() => outputSchema.parse(invalidData))
          } catch (error) {
            logger({ schema: outputSchema, data: validData, error })
            vi.expect.fail('v.parse(outputSchema, invalidData) succeeded')
          }

          try {
            vi.assert.doesNotThrow(() => outputSchema.parse(validData))
          } catch (error) {
            logger({ schema: outputSchema, data: validData, error })
            vi.expect.fail('v.parse(outputSchema, validData) failed')
          }
        }
      ),
      {
        endOnFailure: true,
        // numRuns: 5_000,
      }
    )
  })
})
