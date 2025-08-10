import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { JsonSchema } from '@traversable/json-schema'
import { deriveUnequalValue } from '@traversable/registry'
import { JsonSchemaTest } from '@traversable/json-schema-test'
import { Diff as oracle } from '@sinclair/typebox/value'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: JsonSchema
  left: unknown
  right: unknown
  error: unknown
}

function logger({ schema, left, right, error }: LoggerDeps) {
  console.group('FAILURE: property test for JsonSchema.diff')
  console.error('ERROR:', error)
  console.debug('schema:', JSON.stringify(schema, null, 2))
  console.debug('diffFn:', format(JsonSchema.diff.writeable(schema)))
  console.debug('diff:', JSON.stringify(JsonSchema.diff(schema)(left, right), null, 2))
  console.debug('oracle:', JSON.stringify(oracle(left, right), null, 2))
  console.debug('left:', left)
  console.debug('right:', right)
  console.groupEnd()
}

const Builder = {
  additionalProperties: JsonSchemaTest.SeedGenerator({
    exclude: JsonSchema.diff.unfuzzable,
    record: { additionalPropertiesOnly: true },
    number: { noNaN: true },
  }),
  patternProperties: JsonSchemaTest.SeedGenerator({
    exclude: JsonSchema.diff.unfuzzable,
    record: { patternPropertiesOnly: true },
    number: { noNaN: true },
  })
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test.skip('〖⛳️〗› ❲JsonSchema.diff❳: equal data (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        Builder.additionalProperties['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const diff = JsonSchema.diff(schema)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const duplicate = fc.clone(arbitrary, 2)
          const [left, right] = fc.sample(duplicate, 1)[0]
          try {
            vi.assert.deepEqual(diff(left, right), oracle(left, right))
          } catch (error) {
            logger({ schema, left, right, error })
            vi.expect.fail('diff(left, right) !== oracle(left, right) (additionalPropertiesOnly)')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      numRuns: 10_000,
    })
  })
})
