import * as vi from 'vitest'
import * as v from 'valibot'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { vx } from '@traversable/valibot'
import {
  seedToSchema,
  seedToValidData,
  seedToInvalidData,
  SeedInvalidDataGenerator,
} from '@traversable/valibot-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: v.BaseSchema<any, any, any>
  data: unknown
  error: unknown
}

function logger({ schema, data, error }: LoggerDeps) {
  console.group('FAILURE: property test for vx.toString')
  console.error('Error:', error)
  console.debug('schema:', format(vx.toString(schema)))
  console.debug('data:', data)
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲vx.toString❳: roundtrip property', () => {
    fc.assert(
      fc.property(
        SeedInvalidDataGenerator,
        (seed) => {
          const inputSchema = seedToSchema(seed)
          const validData = seedToValidData(seed)
          const invalidData = seedToInvalidData(seed)
          const outputSchema: vx.AnyValibotSchema = eval(`(() => {
            const v = require('valibot')
            return ${vx.toString(inputSchema)}
          })()`)

          // sanity check:
          vi.assert.throws(() => v.parse(inputSchema, invalidData))
          vi.assert.doesNotThrow(() => v.parse(inputSchema, validData))

          try {
            vi.assert.throws(() => v.parse(outputSchema, invalidData))
          } catch (error) {
            logger({ schema: outputSchema, data: validData, error })
            vi.expect.fail('v.parse(outputSchema, invalidData) succeeded')
          }

          try {
            vi.assert.doesNotThrow(() => v.parse(outputSchema, validData))
          } catch (error) {
            logger({ schema: outputSchema, data: validData, error })
            vi.expect.fail('v.parse(outputSchema, validData) failed')
          }
        }
      ),
      {
        endOnFailure: true,
        // numRuns: 10_000,
      }
    )
  })
})
