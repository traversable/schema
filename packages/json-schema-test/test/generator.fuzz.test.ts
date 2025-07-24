import * as vi from 'vitest'
import * as fc from 'fast-check'

import type { JsonSchema } from '@traversable/json-schema-types'
import { check } from '@traversable/json-schema-types'
import { JsonSchemaTest } from '@traversable/json-schema-test'

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: JsonSchemaTest.Seed.Seed.Fixpoint
  schema: JsonSchema
  errors?: unknown[]
  data: unknown
}

const fail = (e: unknown, { msg, seed, data }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema-test❳', () => {
  vi.it('〖️⛳️〗› ❲JsonSchemaTest.SeedValidDataGenerator❳: integration test', () => {
    fc.assert(
      fc.property(
        JsonSchemaTest.SeedValidDataGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const validData = JsonSchemaTest.seedToValidData(seed)
          const result = check.classic(schema)(validData)

          if (result === false) {
            console.log('schema', schema)
            fail('expected check to succeed', { msg: 'check(schema)(validData)', data: validData, schema, seed })
            vi.assert.fail()
          }
        }
      ), {
      endOnFailure: true,
      examples: [
        [[200, [-0, null, null, true, false]]]
      ],
      // numRuns: 10_000,
    })
  })

  vi.it('〖️⛳️〗› ❲JsonSchemaTest.SeedInvalidDataGenerator❳: integration test', () => {
    fc.assert(
      fc.property(
        JsonSchemaTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const invalidData = JsonSchemaTest.seedToInvalidData(seed)
          const result = check.classic(schema)(invalidData)
          if (result === true) {
            fail('expected check to fail', { msg: 'check(schema)(validData)', data: invalidData, schema, seed })
            vi.assert.fail()
          }
        }
      ), {
      endOnFailure: true,
      // numRuns: 10_000,
    })
  })
})
