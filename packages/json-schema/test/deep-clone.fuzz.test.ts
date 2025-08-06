import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import { JsonSchema } from '@traversable/json-schema'
import { JsonSchemaTest } from '@traversable/json-schema-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LogFailureDeps = {
  schema: JsonSchema
  data: unknown
  clone: unknown
  error: unknown
}

function logFailure({ schema, data, clone, error }: LogFailureDeps) {
  console.group('FAILURE: property test for JsonSchema.deepClone')
  console.error('ERROR:', error)
  console.debug('schema:', schema)
  console.debug('cloneDeep:', format(JsonSchema.deepClone.writeable(schema, { typeName: 'Type' })))
  console.debug('data:', data)
  if (data === undefined || clone !== undefined) console.debug('clone:', clone)
  console.groupEnd()
}

const BuilderAdditionalProperties = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchema.deepClone.unfuzzable,
  record: { additionalPropertiesOnly: true }
})

const BuilderPatternProperties = JsonSchemaTest.SeedGenerator({
  exclude: JsonSchema.deepClone.unfuzzable,
  record: { patternPropertiesOnly: true }
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: fuzz tests (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        BuilderAdditionalProperties['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepClone = JsonSchema.deepClone(schema)
          const deepEqual = JsonSchema.deepEqual(schema)
          const data = JsonSchemaTest.seedToValidData(seed)
          const clone = deepClone(data)
          const oracle = JSON.parse(JSON.stringify(data))
          try {
            vi.expect.soft(clone).to.deep.equal(data)
            vi.assert.isTrue(deepEqual(clone, data))
          } catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail('deepEqual(clone, data) !== true')
          }
          try {
            if (oracle !== data) vi.assert.isTrue(clone !== data)
          } catch (error) {
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
        BuilderPatternProperties['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const deepClone = JsonSchema.deepClone(schema)
          const deepEqual = JsonSchema.deepEqual(schema)
          const data = JsonSchemaTest.seedToValidData(seed)
          const clone = deepClone(data)
          const oracle = JSON.parse(JSON.stringify(data))
          try {
            vi.expect.soft(clone).to.deep.equal(data)
            vi.assert.isTrue(deepEqual(clone, data))
          }
          catch (error) {
            logFailure({ schema, data, clone, error })
            vi.expect.fail('deepEqual(clone, data) !== true')
          }
          try {
            if (oracle !== data) vi.assert.isTrue(clone !== data)
          }
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
