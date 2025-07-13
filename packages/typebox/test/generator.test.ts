import * as vi from 'vitest'
import * as fc from 'fast-check'
import type * as T from '@sinclair/typebox'
import { Check } from '@sinclair/typebox/value'
import type { ValueErrorIterator } from '@sinclair/typebox/errors'
import { Errors } from '@sinclair/typebox/errors'

import { box } from '@traversable/typebox'

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: box.Seed.Seed.Fixpoint
  schema: T.TSchema
  errors: ValueErrorIterator
  data: unknown
}

const fail = (e: unknown, { msg, seed, schema, data, errors }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nTypeBox Error: (JSON.stringify)', JSON.stringify([...errors], stringify, 2))
  console.debug('\r\nTypeBox: ', [...errors])
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  console.debug('\r\nschema: ', box.toString(schema))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

vi.describe(
  '〖️⛳️〗‹‹‹ ❲@traversable/typebox❳',
  // { timeout: 20_000 },
  () => {
    vi.it(
      '〖️⛳️〗› ❲box.SeedReproduciblyValidGenerator❳: integration test',
      // { timeout: 10_000 },
      () => {
        fc.assert(
          fc.property(
            box.SeedReproduciblyValidGenerator,
            (seed) => {
              const schema = box.seedToSchema(seed)
              const validData = box.seedToValidData(seed)
              let result = Check(schema, [], validData)
              try { vi.assert.isTrue(result) }
              catch (e) {
                const errors = Errors(schema, [], validData)
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

    vi.it(
      '〖️⛳️〗› ❲box.SeedReproduciblyInvalidGenerator❳: integration test',
      // { timeout: 10_000 },
      () => {
        fc.assert(
          fc.property(
            box.SeedReproduciblyInvalidGenerator,
            (seed) => {
              const schema = box.seedToSchema(seed)
              const invalidData = box.seedToInvalidData(seed)
              let result = Check(schema, [], invalidData)
              try { vi.assert.isFalse(result) }
              catch (e) {
                const errors = Errors(schema, [], invalidData)
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
