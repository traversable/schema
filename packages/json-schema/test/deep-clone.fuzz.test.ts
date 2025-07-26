import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { JsonSchema } from '@traversable/json-schema'
import { JsonSchemaTest } from '@traversable/json-schema-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })
const print = (src: unknown) => JSON.stringify(src, null, 2)

type LogFailureDeps = {
  schema: JsonSchema
  data: unknown
  clone: unknown
  error: unknown
}

function logFailure({ schema, data, clone, error }: LogFailureDeps) {
  console.group('\n\n\rFAILURE: property test for JsonSchema.deepClone\n\n\r')
  console.error('ERROR:', error)
  console.debug('schema:\n\r', print(schema), '\n\r')
  console.debug(
    'cloneDeep:\n\r',
    format(JsonSchema.deepClone.writeable(schema, { typeName: 'Type' }))
  )
  console.debug('data:\n\r', print(data), '\n\r')
  if (data === undefined || clone !== undefined) {
    console.debug('clone:\n\r', print(clone), '\n\r')
  }
  console.groupEnd()
}

const include = [
  'array',
  'boolean',
  'enum',
  'const',
  'integer',
  'intersection',
  'null',
  'number',
  'object',
  'record',
  'string',
  'tuple',
  // 'union',
] as const

const additionalPropertiesBuilder = JsonSchemaTest.SeedGenerator({
  include,
  record: {
    additionalPropertiesOnly: true
  }
})

const patternPropertiesBuilder = JsonSchemaTest.SeedGenerator({
  include,
  record: {
    patternPropertiesOnly: true
  }
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: fuzz tests (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        additionalPropertiesBuilder['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepClone = JsonSchema.deepClone(schema)
          const deepEqual = JsonSchema.deepEqual(schema)
          const data = JsonSchemaTest.seedToValidData(seed)
          const clone = deepClone(data)
          const oracle = JSON.parse(JSON.stringify(data))
          try { deepEqual(clone, data) }
          catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail('deepEqual(clone, data) === false')
          }
          try { oracle !== data && vi.assert.isTrue(clone !== data) }
          catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail(`(clone !== data) === false`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: fuzz tests (patternProperties only)', () => {
    fc.assert(
      fc.property(
        patternPropertiesBuilder['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepClone = JsonSchema.deepClone(schema)
          const deepEqual = JsonSchema.deepEqual(schema)
          const data = JsonSchemaTest.seedToValidData(seed)
          const clone = deepClone(data)
          const oracle = JSON.parse(JSON.stringify(data))
          try { deepEqual(clone, data) }
          catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail('deepEqual(clone, data) === false')
          }
          try { oracle !== data && vi.assert.isTrue(clone !== data) }
          catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail(`(clone !== data) === false`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
