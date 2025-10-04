import * as vi from 'vitest'
import * as fc from 'fast-check'
import type { z } from 'zod'

import { zxTest } from '@traversable/zod-test'

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: zxTest.Seed.Seed.Fixpoint
  result: z.ZodSafeParseResult<unknown>
  data: unknown
}

const fail = (e: unknown, { msg, seed, result, data }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nZodError: (JSON.stringify)', JSON.stringify(result?.error, stringify, 2))
  console.debug('\r\nZodError: ', result?.error)
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/zod-test❳', () => {
  vi.test('〖️⛳️〗› ❲zxTest.SeedValidDataGenerator❳: fuzz test', () => {
    fc.assert(
      fc.property(
        zxTest.SeedValidDataGenerator,
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const data = zxTest.seedToValidData(seed)
          const result = schema.safeParse(data)
          try { vi.assert.isTrue(result.success) }
          catch (e) { fail(e, { msg: 'schema.parse(validData)', data, result, seed }) }
        }
      ), {
      endOnFailure: true,
      examples: [
        [[20]],
      ],
      // numRuns: 10_000,
    })
  })

  vi.test('〖️⛳️〗› ❲zxTest.SeedInvalidDataGenerator❳: integration test', () => {
    fc.assert(
      fc.property(
        zxTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const data = zxTest.seedToInvalidData(seed)
          const result = schema.safeParse(data)
          try { vi.assert.isFalse(result.success) }
          catch (e) { fail(e, { msg: 'schema.parse(invalidData)', data, result, seed }) }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  }
  )
})

