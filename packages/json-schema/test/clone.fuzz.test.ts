import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { JsonSchema } from '@traversable/json-schema'
import { jsonSchemaTest } from '@traversable/json-schema-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LogFailureDeps = { schema: JsonSchema, data: unknown, clonedData?: unknown }

function logFailure({ schema, data, clonedData }: LogFailureDeps) {
  console.group('\n\n\rFAILURE: property test for JsonSchema.clone\n\n\r')
  console.debug('schema:\n\r', JSON.stringify(schema, null, 2), '\n\r')
  console.debug('JsonSchema.clone.writeable(schema):\n\r',
    format(JsonSchema.clone.writeable(schema, { typeName: 'Type' })),
    '\n\r'
  )
  console.debug('stringify(data):\n\r', JSON.stringify(data, null, 2), '\n\r')
  console.debug('data:\n\r', data, '\n\r')
  if (data === undefined || clonedData !== undefined) {
    console.debug('stringify(clonedData):\n\r', JSON.stringify(clonedData, null, 2), '\n\r')
    console.debug('clonedData:\n\r', clonedData, '\n\r')
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

const additionalPropertiesBuilder = jsonSchemaTest.SeedGenerator({
  include,
  record: {
    additionalPropertiesOnly: true
  }
})

const patternPropertiesBuilder = jsonSchemaTest.SeedGenerator({
  include,
  record: {
    patternPropertiesOnly: true
  }
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.clone❳: fuzz tests (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        additionalPropertiesBuilder['*'],
        (seed) => {
          const schema = jsonSchemaTest.seedToSchema(seed)
          const data = jsonSchemaTest.seedToValidData(seed)
          const deepClone = JsonSchema.clone(schema)
          try {
            vi.expect.soft(deepClone(data)).to.deep.equal(data)
          } catch (e) {
            try {
              const clonedData = deepClone(data)
              logFailure({ schema, data, clonedData })
              vi.expect.fail('Cloned data was not equal')
            } catch (e) {
              logFailure({ schema, data })
              vi.expect.fail('Failed to clone data')
            }
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲JsonSchema.clone❳: fuzz tests (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        patternPropertiesBuilder['*'],
        (seed) => {
          const schema = jsonSchemaTest.seedToSchema(seed)
          const data = jsonSchemaTest.seedToValidData(seed)
          const deepClone = JsonSchema.clone(schema)
          try {
            vi.expect.soft(deepClone(data)).to.deep.equal(data)
          } catch (e) {
            try {
              const clonedData = deepClone(data)
              logFailure({ schema, data, clonedData })
              vi.expect.fail('Cloned data was not equal')
            } catch (e) {
              logFailure({ schema, data })
              vi.expect.fail('Failed to clone data')
            }
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
