import * as vi from 'vitest'
import * as fc from 'fast-check'
import type * as T from 'typebox'
import { Check, Errors } from 'typebox/value'
// import type { ValueErrorIterator } from 'typebox/errors'
// import { Errors } from 'typebox/errors'

import { boxTest } from '@traversable/typebox-test'

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: boxTest.Seed.Seed.Fixpoint
  schema: T.TSchema
  errors: unknown[]
  data: unknown
}

const fail = (e: unknown, { msg, seed, schema, data, errors }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nboxTest Error: (JSON.stringify)', JSON.stringify([...errors], stringify, 2))
  console.debug('\r\nboxTest Errors: ', [...errors])
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  // console.debug('\r\nschema: ', box.toString(schema))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

vi.describe(
  '〖️⛳️〗‹‹‹ ❲@traversable/typebox-test❳',
  // { timeout: 20_000 },
  () => {
    vi.test(
      '〖️⛳️〗› ❲boxTest.SeedValidDataGenerator❳: integration test',
      // { timeout: 10_000 },
      () => {
        fc.assert(
          fc.property(
            boxTest.SeedValidDataGenerator,
            (seed) => {
              const schema = boxTest.seedToSchema(seed)
              const validData = boxTest.seedToValidData(seed)
              let result = Check(schema, validData)
              try { vi.assert.isTrue(result) }
              catch (e) {
                const errors = Errors(schema, validData)
                fail(e, { msg: 'Check(schema, [], validData)', data: validData, errors, schema, seed })
              }
            }
          ), {
          endOnFailure: true,
          examples: [],
          // numRuns: 10_000,
        })
      }
    )

    vi.test(
      '〖️⛳️〗› ❲boxTest.SeedInvalidDataGenerator❳: integration test',
      // { timeout: 10_000 },
      () => {
        fc.assert(
          fc.property(
            boxTest.SeedInvalidDataGenerator,
            (seed) => {
              const schema = boxTest.seedToSchema(seed)
              const invalidData = boxTest.seedToInvalidData(seed)
              let result = Check(schema, invalidData)
              try { vi.assert.isFalse(result) }
              catch (e) {
                const errors = Errors(schema, invalidData)
                fail(e, { msg: 'Check(schema, [], invalidData)', data: invalidData, errors, schema, seed })
              }
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
