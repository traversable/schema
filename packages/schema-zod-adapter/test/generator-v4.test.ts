import * as vi from 'vitest'
import * as fc from 'fast-check'
import type { z } from 'zod4'
import { v4 } from '@traversable/schema-zod-adapter'

const peek = <T>(arbitrary: fc.Arbitrary<T>) => fc.sample(arbitrary, 1)[0]
const stringify = (_: string, v: unknown) => typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

type LogFailureDeps = {
  msg: string
  seed: v4.Seed.Fixpoint
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
  console.debug('\r\nschema: ', v4.toString(schema))
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
            v4.SeedReproduciblyValidGenerator,
            (seed) => {
              const schema = v4.seedToSchema(seed)
              const data = v4.seedToValidData(seed)
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
            v4.SeedReproduciblyInvalidGenerator,
            (seed) => {
              const schema = v4.seedToSchema(seed)
              const data = v4.seedToInvalidData(seed)
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
