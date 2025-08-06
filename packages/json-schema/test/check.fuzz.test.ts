import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { JsonSchema } from '@traversable/json-schema'
import { fn } from '@traversable/registry'
import { JsonSchemaTest } from '@traversable/json-schema-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  seed: JsonSchemaTest.Seed.Seed.Fixpoint
  schema: JsonSchema
  data: unknown
}

function logger({ seed, data, schema }: LoggerDeps) {
  console.group('FAILURE:')
  console.debug('seed: ', seed)
  console.debug('data: ', data === '' ? '<empty string>' : data)
  console.debug('check: ', format(JsonSchema.check.writeable(schema)))
  console.debug('schema: ', schema)
  console.groupEnd()
}

const validSeedWithAdditionalProps = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchemaTest.seedsThatPreventGeneratingValidData,
  record: { additionalPropertiesOnly: true },
})['*']

const validSeedWithPatternProps = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchemaTest.seedsThatPreventGeneratingValidData,
  record: { patternPropertiesOnly: true },
})['*']

const InvalidSeedAdditionalProps = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchemaTest.seedsThatPreventGeneratingInvalidData,
  record: { additionalPropertiesOnly: true },
})

const InvalidSeedPatternProps = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchemaTest.seedsThatPreventGeneratingInvalidData,
  record: { patternPropertiesOnly: true },
})

const invalidSeedWithAdditionalProps = fn.pipe(
  InvalidSeedAdditionalProps,
  ($) => fc.oneof(
    $.object,
    $.tuple,
    $.array,
    $.record,
  )
)

const invalidSeedWithPatternProps = fn.pipe(
  InvalidSeedPatternProps,
  ($) => fc.oneof(
    $.object,
    $.tuple,
    $.array,
    $.record,
  )
)

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖️⛳️〗› ❲JsonSchema.check❳: accepts valid data (additionalProperties)', () => {
    fc.assert(
      fc.property(
        validSeedWithAdditionalProps,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const validData = JsonSchemaTest.seedToValidData(seed)
          const check = JsonSchema.check(schema)
          const result = check(validData)
          if (result === false) {
            logger({ data: validData, schema, seed })
            vi.assert.fail('check(validData) !== true')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check❳: rejects invalid data (additionalProperties)', () => {
    fc.assert(
      fc.property(
        invalidSeedWithAdditionalProps,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const invalidData = JsonSchemaTest.seedToInvalidData(seed)
          const result = JsonSchema.check(schema)(invalidData)
          if (result === true) {
            logger({ data: invalidData, schema, seed })
            vi.assert.fail('check(invalidData) !== false')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check❳: accepts valid data (patternProperties)', () => {
    fc.assert(
      fc.property(
        validSeedWithPatternProps,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const validData = JsonSchemaTest.seedToValidData(seed)
          const check = JsonSchema.check(schema)
          const result = check(validData)
          if (result === false) {
            logger({ data: validData, schema, seed })
            vi.assert.fail('check(validData) !== true')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check❳: rejects invalid data (patternProperties)', () => {
    fc.assert(
      fc.property(
        invalidSeedWithPatternProps,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const invalidData = JsonSchemaTest.seedToInvalidData(seed)
          const result = JsonSchema.check(schema)(invalidData)
          if (result === true) {
            logger({ data: invalidData, schema, seed })
            vi.assert.fail('check(invalidData) !== false')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.classic❳: accepts valid data', () => {
    fc.assert(
      fc.property(
        JsonSchemaTest.SeedValidDataGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const validData = JsonSchemaTest.seedToValidData(seed)
          const result = JsonSchema.check.classic(schema)(validData)
          if (result === false) {
            console.log('schema', schema)
            logger({ data: validData, schema, seed })
            vi.assert.fail('check(validData) !== true')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.classic❳: rejects invalid data', () => {
    fc.assert(
      fc.property(
        JsonSchemaTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const invalidData = JsonSchemaTest.seedToInvalidData(seed)
          const result = JsonSchema.check.classic(schema)(invalidData)
          if (result === true) {
            logger({ data: invalidData, schema, seed })
            vi.assert.fail('check(invalidData) !== false')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
