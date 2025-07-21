import * as vi from 'vitest'
import * as fc from 'fast-check'

import type { JsonSchema } from '@traversable/json-schema-types'
import { jsonSchemaTest } from '@traversable/json-schema-test'

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: jsonSchemaTest.Seed.Seed.Fixpoint
  schema: JsonSchema
  errors: unknown[]
  data: unknown
}

type Result<T, E> = Ok<T> | Err<E>
interface Ok<T> { tag: 'Ok', ok: T }
interface Err<T> { tag: 'Err', err: T }
function isOk<T, E>(x: Result<T, E>): x is Ok<T> {
  return x.tag === 'Ok'
}
function isErr<T, E>(x: Result<T, E>): x is Err<E> {
  return x.tag === 'Err'
}
function check(jsonSchema: JsonSchema): (x: unknown) => Result<unknown, unknown[]> {
  return (x) => {
    return { tag: 'Err', err: [] }
  }
}

const fail = (e: unknown, { msg, seed, data, errors }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\njsonSchemaTest Error: (JSON.stringify)', JSON.stringify([...errors], stringify, 2))
  console.debug('\r\njsonSchemaTest: ', [...errors])
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

vi.describe(
  '〖️⛳️〗‹‹‹ ❲@traversable/json-schema-test❳',
  // { timeout: 20_000 },
  () => {

    vi.it(
      '〖️⛳️〗› ❲jsonSchemaTest.SeedValidDataGenerator❳: integration test',
      // { timeout: 10_000 },
      () => {
        fc.assert(
          fc.property(
            jsonSchemaTest.SeedValidDataGenerator,
            (seed) => {
              const schema = jsonSchemaTest.seedToSchema(seed)
              const validData = jsonSchemaTest.seedToValidData(seed)
              const result = check(schema)(validData)

              // console.log('\n\nSCHEMA:', JSON.stringify(schema, null, 2))

              // if (!isOk(result)) {
              //   console.log('\n\nSCHEMA:', JSON.stringify(schema, null, 2))
              //   fail('not ok', { msg: 'check(schema)(validData)', data: validData, errors: result.err, schema, seed })
              //   vi.assert.fail()
              // }
            }
          ), {
          endOnFailure: true,
          examples: [],
          // numRuns: 10_000,
        })
      }
    )

    vi.it(
      '〖️⛳️〗› ❲jsonSchemaTest.SeedInvalidDataGenerator❳: integration test',
      // { timeout: 10_000 },
      () => {
        fc.assert(
          fc.property(
            jsonSchemaTest.SeedInvalidDataGenerator,
            (seed) => {
              const schema = jsonSchemaTest.seedToSchema(seed)
              const invalidData = jsonSchemaTest.seedToInvalidData(seed)
              const result = check(schema)(invalidData)

              // console.log('\n\nSCHEMA:', JSON.stringify(schema, null, 2))

              // if (!isOk(result)) {
              //   console.log('\n\nSCHEMA:', JSON.stringify(schema, null, 2))
              //   fail('not ok', { msg: 'check(schema)(validData)', data: invalidData, errors: result.err, schema, seed })
              //   vi.assert.fail()
              // }
            }
          ), {
          endOnFailure: true,
          examples: [],
          // numRuns: 10_000,
        })
      }
    )

  }
)

