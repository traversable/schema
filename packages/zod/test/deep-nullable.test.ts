import * as vi from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'

const logFailure = (schema: z.ZodType) => {
  console.group('\n\nFAILURE: property test for zx.deepNullable\n\n')
  console.debug('zx.toString(schema):\n', zx.toString(schema), '\n')
  console.debug('zx.deepNullable.writeable(schema):\n', zx.deepNullable.writeable(schema), '\n')
  console.debug(
    'zx.deepRequired.writeable(zx.deepNullable(schema)):\n',
    zx.deepRequired.writeable(zx.deepNullable(schema, 'preserveSchemaType')),
    '\n'
  )
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {

  vi.test('〖⛳️〗› ❲zx.deepNullable❳: property tests', () => {
    fc.assert(
      fc.property(
        zx.SeedGenerator({ exclude: ['nullable', 'promise'] })['*'],
        (seed) => {
          const schema = zx.seedToSchema(seed)
          try {
            vi.assert.equal(
              zx.toString(schema),
              zx.deepNonNullable.writeable(zx.deepNullable(schema, 'preserveSchemaType'))
            )
          } catch (e) {
            logFailure(schema)
            vi.expect.fail(`Roundtrip failed for zx.deepNullable with schema:\n\n${zx.toString(schema)}`)
          }
        }
      ), {
      // numRuns: 10_000,
      endOnFailure: true,
    })
  })

  vi.test('〖⛳️〗› ❲zx.deepNullable❳', () => {
    vi.expect.soft(
      zx.deepNullable.writeable(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1),
              f: z.boolean()
            })).length(10)
          })
        })
      )
    ).toMatchInlineSnapshot
      (`"z.object({a:z.number().nullable(),b:z.string().nullable(),c:z.object({d:z.array(z.object({e:z.number().max(1).nullable(),f:z.boolean().nullable()}).nullable()).length(10).nullable()}).nullable()}).nullable()"`)
  })
})
