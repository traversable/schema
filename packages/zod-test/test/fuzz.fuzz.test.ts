import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as z from 'zod'
import { zxTest } from '@traversable/zod-test'

type LogFailureDeps = {
  msg: string
  schema: z.ZodType
  result: z.ZodSafeParseResult<unknown>
  data: unknown
}

const stringify = (_: string, v: unknown) =>
  typeof v === 'symbol' ? String(v) : typeof v === 'bigint' ? `${v}n` : v

const fail = (e: unknown, { msg, schema, result, data }: LogFailureDeps) => {
  console.group(`\r\n\nFAILURE: ${msg}`)
  console.error('\r\nError:', e)
  console.debug('\r\nZodError: (JSON.stringify)', JSON.stringify(result?.error, stringify, 2))
  console.debug('\r\nZodError: ', result?.error)
  console.debug('\r\nschema: ', schema)
  console.debug('\r\ndata: ', data === '' ? '<empty string>' : data)
  console.debug('\r\n\n')
  console.groupEnd()
  vi.assert.fail(`\r\nFAILURE: ${msg}`)
}

const Builder = zxTest.SchemaGenerator({
  exclude: [
    'custom',
    'default',
    'prefault',
    'promise',
    'pipe',
    'nonoptional',
    'never',
    'template_literal',
  ],
})

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/zod-test❳', () => {
  vi.test('〖️⛳️〗› ❲zxTest.fuzz❳: fuzz test', () => {
    fc.assert(
      fc.property(
        Builder,
        (schema) => {
          const arbitrary = zxTest.fuzz(schema)
          const [data] = fc.sample(arbitrary, 1)
          const result = schema.safeParse(data)
          try {
            vi.assert.isTrue(result.success)
          } catch (e) {
            fail(e, { msg: 'schema.parse(validData)', data, result, schema })
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
