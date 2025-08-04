import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as v from 'valibot'

import { vxTest } from '@traversable/valibot-test'
import * as vxTypes from '@traversable/valibot-types'

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: vxTest.Seed.Seed.Fixpoint
  schema: vxTypes.F.LowerBound
  errors?: [v.BaseIssue<unknown>, ...v.BaseIssue<unknown>[]] | undefined
  data: unknown
}

function fail(e: unknown, { msg, seed, schema, data, errors }: LogFailureDeps) {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  console.debug('\r\nschema: ', vxTypes.toString(schema))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\n\n')
  if (errors) {
    console.debug('\r\nvxTest Error: (JSON.stringify)', JSON.stringify([...errors], stringify, 2))
    console.debug('\r\nvxTest Errors: ', [...errors])
  }
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/valibot-test❳', () => {
  vi.it('〖️⛳️〗› ❲vxTest.SeedValidDataGenerator❳: integration test', () => {
    fc.assert(
      fc.property(
        vxTest.SeedValidDataGenerator,
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const validData = vxTest.seedToValidData(seed)
          let result = v.safeParse(schema, validData)
          try { vi.assert.isTrue(result.success) }
          catch (error) {
            fail(error, {
              msg: 'v.safeParse(schema, validData)',
              data: validData,
              errors: result.issues,
              schema,
              seed,
            })
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.it('〖️⛳️〗› ❲vxTest.SeedInvalidDataGenerator❳: integration test', () => {
    fc.assert(
      fc.property(
        vxTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const invalidData = vxTest.seedToInvalidData(seed)
          let result = v.safeParse(schema, invalidData)
          try { vi.assert.isFalse(result.success) }
          catch (error) {
            fail(error, {
              msg: 'v.safeParse(schema, invalidData)',
              data: invalidData,
              schema,
              seed,
            })
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
