import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { JsonSchema } from '@traversable/json-schema'
import { fn } from '@traversable/registry'
import { JsonSchemaTest } from '@traversable/json-schema-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: JsonSchemaTest.Seed.Seed.Fixpoint
  schema: JsonSchema
  errors?: unknown[]
  data: unknown
}

const fail = (e: unknown, { msg, seed, data, schema }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\ncheck: ', format(JsonSchema.check.writeable(schema)))
  console.debug('\r\nschema: ', JSON.stringify(schema, null, 2))
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

const validSeedWithAdditionalProps = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchemaTest.seedsThatPreventGeneratingValidData,
  record: { additionalPropertiesOnly: true },
})['*']

const InvalidSeedAdditionalProps = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchemaTest.seedsThatPreventGeneratingInvalidData,
  record: { additionalPropertiesOnly: true },
})

const InvalidSeedPatternProps = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchemaTest.seedsThatPreventGeneratingInvalidData,
  record: { patternPropertiesOnly: true },
})

const validSeedWithPatternProps = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchemaTest.seedsThatPreventGeneratingValidData,
  record: { patternPropertiesOnly: true },
})['*']

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
  vi.it('〖️⛳️〗› ❲JsonSchema.check❳: accepts valid data (additionalProperties)', () => {
    fc.assert(
      fc.property(
        validSeedWithAdditionalProps,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const validData = JsonSchemaTest.seedToValidData(seed)
          const check = JsonSchema.check(schema)
          const result = check(validData)
          if (result === false) {
            fail('expected check to succeed', { msg: 'check(schema)(validData)', data: validData, schema, seed })
            vi.assert.fail()
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.check❳: rejects invalid data (additionalProperties)', () => {
    fc.assert(
      fc.property(
        invalidSeedWithAdditionalProps,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const invalidData = JsonSchemaTest.seedToInvalidData(seed)
          const result = JsonSchema.check(schema)(invalidData)
          if (result === true) {
            fail('expected check to fail', { msg: 'check(schema)(validData)', data: invalidData, schema, seed })
            vi.assert.fail()
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.check❳: accepts valid data (patternProperties)', () => {
    fc.assert(
      fc.property(
        validSeedWithPatternProps,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const validData = JsonSchemaTest.seedToValidData(seed)
          const check = JsonSchema.check(schema)
          const result = check(validData)
          if (result === false) {
            fail('expected check to succeed', { msg: 'check(schema)(validData)', data: validData, schema, seed })
            vi.assert.fail()
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.check❳: rejects invalid data (patternProperties)', () => {
    fc.assert(
      fc.property(
        invalidSeedWithPatternProps,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const invalidData = JsonSchemaTest.seedToInvalidData(seed)
          const result = JsonSchema.check(schema)(invalidData)
          if (result === true) {
            fail('expected check to fail', { msg: 'check(schema)(validData)', data: invalidData, schema, seed })
            vi.assert.fail()
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.check.classic❳: accepts valid data', () => {
    fc.assert(
      fc.property(
        JsonSchemaTest.SeedValidDataGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const validData = JsonSchemaTest.seedToValidData(seed)
          const result = JsonSchema.check.classic(schema)(validData)
          if (result === false) {
            console.log('schema', schema)
            fail('expected check to succeed', { msg: 'check(schema)(validData)', data: validData, schema, seed })
            vi.assert.fail()
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.check.classic❳: rejects invalid data', () => {
    fc.assert(
      fc.property(
        JsonSchemaTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const invalidData = JsonSchemaTest.seedToInvalidData(seed)
          const result = JsonSchema.check.classic(schema)(invalidData)
          if (result === true) {
            fail('expected check to fail', { msg: 'check(schema)(validData)', data: invalidData, schema, seed })
            vi.assert.fail()
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
