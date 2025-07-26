import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { JsonSchema } from '@traversable/json-schema'
import { deriveUnequalValue } from '@traversable/registry'
import { JsonSchemaTest } from '@traversable/json-schema-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })
const print = (x: unknown) => JSON.stringify(x, null, 2)

type LogFailureDeps = {
  schema: JsonSchema
  left: unknown
  right: unknown
  error: unknown
}

const logFailureEqualData = ({ schema, left, right, error }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for JsonSchema.deepEqual (with EQUAL data)\n\n\r')
  console.error('ERROR:', error)
  console.debug('schema:\n\r', print(schema), '\n\r')
  console.debug('deepEqual:\n\r', format(JsonSchema.deepEqual.writeable(schema)), '\n\r')
  console.debug('left:\n\r', print(left), '\n\r')
  console.debug('right:\n\r', print(right), '\n\r')
  console.groupEnd()
}

const logFailureUnequalData = ({ schema, left, right, error }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for JsonSchema.deepEqual (with UNEQUAL data)\n\n\r')
  console.error('ERROR:', error)
  console.debug('schema:\n\r', print(schema), '\n\r')
  console.debug('deepEqual:\n\r', format(JsonSchema.deepEqual.writeable(schema)), '\n\r')
  console.debug('left:\n\r', print(left), '\n\r')
  console.debug('right:\n\r', print(right), '\n\r')
  console.groupEnd()
}

const exclude = [
  'never',
  'unknown',
] as const

const additionalPropsGenerator = JsonSchemaTest.SeedGenerator({ exclude, record: { additionalPropertiesOnly: true } })['*']
const patternPropsGenerator = JsonSchemaTest.SeedGenerator({ exclude, record: { patternPropertiesOnly: true } })['*']

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.deepEqual❳: equal data (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        additionalPropsGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepEqual = JsonSchema.deepEqual(schema)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const duplicate = fc.clone(arbitrary, 2)
          const [left, right] = fc.sample(duplicate, 1)[0]
          try { vi.assert.isTrue(deepEqual(left, right)) }
          catch (error) {
            logFailureEqualData({ schema, left, right, error })
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
        patternPropsGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepEqual = JsonSchema.deepEqual(schema)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const duplicate = fc.clone(arbitrary, 2)
          const [left, right] = fc.sample(duplicate, 1)[0]
          try { vi.assert.isTrue(deepEqual(left, right)) }
          catch (error) {
            logFailureEqualData({ schema, left, right, error })
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
        additionalPropsGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try {
            const deepEqual = JsonSchema.deepEqual(schema)
            vi.assert.isFalse(deepEqual(data, unequal))
          }
          catch (error) {
            logFailureUnequalData({ schema, left: data, right: unequal, error })
            vi.expect.fail('deepEqual(data, unequal) === true (additionalPropertiesOnly)')
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
        patternPropsGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try {
            const deepEqual = JsonSchema.deepEqual(schema)
            vi.assert.isFalse(deepEqual(data, unequal))
          }
          catch (error) {
            logFailureUnequalData({ schema, left: data, right: unequal, error })
            vi.expect.fail('deepEqual(data, unequal) === true (patternPropertiesOnly)')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
