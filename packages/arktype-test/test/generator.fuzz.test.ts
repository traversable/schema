import * as vi from 'vitest'
import * as fc from 'fast-check'
import { type } from 'arktype'
import { arkTest } from '@traversable/arktype-test'

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: arkTest.Seed.Seed.Fixpoint
  schema: type.Any
  data: unknown
}

const fail = (e: unknown, { msg, seed, schema, data }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/arktype-test❳', () => {
  vi.test('〖️⛳️〗› ❲arkTest.SeedValidDataGenerator❳: integration test', () => {
    fc.assert(
      fc.property(
        arkTest.SeedValidDataGenerator,
        (seed) => {
          const schema = arkTest.seedToSchema(seed)
          const validData = arkTest.seedToValidData(seed)
          let result = schema(validData)
          try { vi.assert.isFalse(result instanceof type.errors) }
          catch (error) {
            console.error('schema.expression:', schema.expression)
            console.error('Errors:', result)
            fail(error, { msg: 'schema(validData) instanceof type.errors', data: validData, schema, seed })
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖️⛳️〗› ❲arkTest.SeedInvalidDataGenerator❳: integration test', () => {
    fc.assert(
      fc.property(
        arkTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = arkTest.seedToSchema(seed)
          const invalidData = arkTest.seedToInvalidData(seed)
          let result = schema(invalidData)
          try { vi.assert.instanceOf(result, type.errors) }
          catch (error) {
            fail(error, { msg: '!(schema(invalidData) instanceof type.errors)', data: invalidData, schema, seed })
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
