import * as vi from 'vitest'
import * as fc from 'fast-check'
import type { z } from 'zod/v4'
import { zx } from '@traversable/zod'

const stringify = (_: string, v: unknown) => typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: zx.Seed.Fixpoint
  schema: z.ZodType
  result: z.ZodSafeParseResult<unknown>
  data: unknown
}

const fail = (e: unknown, { msg, seed, schema, result, data }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nZodError: (JSON.stringify)', JSON.stringify(result?.error, stringify, 2))
  console.debug('\r\nZodError: ', result?.error)
  console.debug('\r\nseed: ', JSON.stringify(seed, stringify, 2))
  console.debug('\r\nschema: ', zx.toString(schema))
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

vi.describe(
  '〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳',
  // { timeout: 20_000 },
  () => {
    vi.it(
      '〖️⛳️〗› ❲v4.ValidDataSeed❳',
      // { timeout: 10_000 },
      () => {
        fc.assert(
          fc.property(
            zx.SeedReproduciblyValidGenerator,
            (seed) => {
              const schema = zx.seedToSchema(seed)
              const data = zx.seedToValidData(seed)
              let result = schema.safeParse(data)
              try { vi.assert.isTrue(result.success) }
              catch (e) { fail(e, { msg: 'schema.parse(validData)', data, result, schema, seed }) }
            }
          ), {
          endOnFailure: true,
          examples: [],
          // numRuns: 10_000,
        })
      }
    )

    vi.it(
      '〖️⛳️〗› ❲v4.InvalidDataSeed❳',
      // { timeout: 10_000 },
      () => {
        fc.assert(
          fc.property(
            zx.SeedReproduciblyInvalidGenerator,
            (seed) => {
              const schema = zx.seedToSchema(seed)
              const data = zx.seedToInvalidData(seed)
              let result = schema.safeParse(data)
              try { vi.assert.isFalse(result.success) }
              catch (e) { fail(e, { msg: 'schema.parse(invalidData)', data, result, schema, seed }) }
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

