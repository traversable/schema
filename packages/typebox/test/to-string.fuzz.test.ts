import * as vi from 'vitest'
import * as T from '@sinclair/typebox'
import { Check } from '@sinclair/typebox/value'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { box } from '@traversable/typebox'
import {
  seedToSchema,
  seedToValidData,
  seedToInvalidData,
  SeedInvalidDataGenerator,
} from '@traversable/typebox-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: T.TSchema
  data: unknown
  error: unknown
}

function logger({ schema, data, error }: LoggerDeps) {
  console.group('FAILURE: property test for box.toString')
  console.error('Error:', error)
  console.debug('schema:', format(box.toString(schema)))
  console.debug('data:', data)
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/typebox❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲box.toString❳: roundtrip property', () => {
    fc.assert(
      fc.property(
        SeedInvalidDataGenerator,
        (seed) => {
          const inputSchema = seedToSchema(seed)
          const validData = seedToValidData(seed)
          const invalidData = seedToInvalidData(seed)
          const outputSchema: T.TSchema = eval(`(() => {
            const T = require('@sinclair/typebox')
            return ${box.toString(inputSchema)}
          })()`)

          // sanity check:
          vi.assert.isTrue(Check(inputSchema, [], validData))
          vi.assert.isFalse(Check(inputSchema, [], invalidData))

          try {
            vi.assert.isTrue(Check(outputSchema, [], validData))
          } catch (error) {
            logger({ schema: outputSchema, data: validData, error })
            vi.expect.fail('v.parse(outputSchema, invalidData) succeeded')
          }

          try {
            vi.assert.isFalse(Check(outputSchema, [], invalidData))
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
