import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { JsonSchema } from '@traversable/json-schema'
import { deriveUnequalValue } from '@traversable/registry'
import { JsonSchemaTest } from '@traversable/json-schema-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: JsonSchema
  left: unknown
  right: unknown
  error: unknown
}

function logger({ schema, left, right, error }: LoggerDeps) {
  console.group('FAILURE: property test for JsonSchema.deepEqual')
  console.error('ERROR:', error)
  console.debug('schema:', schema)
  console.debug('deepEqual:', format(JsonSchema.deepEqual.writeable(schema)))
  console.debug('left:', left)
  console.debug('right:', right)
  console.groupEnd()
}

const Builder = {
  additionalProperties: JsonSchemaTest.SeedGenerator({
    exclude: JsonSchema.deepEqual.unfuzzable,
    record: { additionalPropertiesOnly: true }
  }),
  patternProperties: JsonSchemaTest.SeedGenerator({
    exclude: JsonSchema.deepEqual.unfuzzable,
    record: { patternPropertiesOnly: true }
  })
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.deepEqual❳: equal data (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        Builder.additionalProperties['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepEqual = JsonSchema.deepEqual(schema)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const duplicate = fc.clone(arbitrary, 2)
          const [left, right] = fc.sample(duplicate, 1)[0]
          try {
            vi.assert.isTrue(deepEqual(left, right))
          } catch (error) {
            logger({ schema, left, right, error })
            vi.expect.fail('deepEqual(left, right) !== true (additionalPropertiesOnly)')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepEqual❳: equal data (patternProperties only)', () => {
    fc.assert(
      fc.property(
        Builder.patternProperties['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepEqual = JsonSchema.deepEqual(schema)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const duplicate = fc.clone(arbitrary, 2)
          const [left, right] = fc.sample(duplicate, 1)[0]
          try {
            vi.assert.isTrue(deepEqual(left, right))
          } catch (error) {
            logger({ schema, left, right, error })
            vi.expect.fail('deepEqual(left, right) !== true (patternPropertiesOnly)')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  // TODO: turn this back on (re-write `deriveUnequalValue` to parse the **schema**, not just the data)
  vi.test.skip('〖⛳️〗› ❲JsonSchema.deepEqual❳: unequal data (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        Builder.additionalProperties['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepEqual = JsonSchema.deepEqual(schema)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try {
            vi.assert.isFalse(deepEqual(data, unequal))
          } catch (error) {
            logger({ schema, left: data, right: unequal, error })
            vi.expect.fail('deepEqual(data, unequal) !== false (additionalPropertiesOnly)')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  // TODO: turn this back on (re-write `deriveUnequalValue` to parse the **schema**, not just the data)
  vi.test.skip('〖⛳️〗› ❲JsonSchema.deepEqual❳: unequal data (patternProperties only)', () => {
    fc.assert(
      fc.property(
        Builder.patternProperties['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepEqual = JsonSchema.deepEqual(schema)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try {
            vi.assert.isFalse(deepEqual(data, unequal))
          } catch (error) {
            logger({ schema, left: data, right: unequal, error })
            vi.expect.fail('deepEqual(data, unequal) !== false (patternPropertiesOnly)')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
