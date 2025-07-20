import * as vi from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'

const logFailure = (schema: z.core.$ZodType) => {
  console.group('\n\nFAILURE: property test for zx.deepNonNullable\n\n')
  console.debug('zx.toString(schema):\n', zx.toString(schema), '\n')
  console.debug('zx.deepNonNullable.writeable(schema):\n', zx.deepNonNullable.writeable(schema), '\n')
  console.debug(
    'zx.deepRequired.writeable(zx.deepNonNullable(schema)):\n',
    zx.deepRequired.writeable(zx.deepNonNullable(schema, 'preserveSchemaType')),
    '\n'
  )
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {

  vi.test('〖⛳️〗› ❲zx.deepNonNullable❳: property tests', () => {
    fc.assert(
      fc.property(
        zxTest.SeedGenerator({ exclude: ['nullable', 'promise'] })['*'],
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          try {
            vi.assert.equal(
              zx.toString(schema),
              zx.deepNonNullable.writeable(zx.deepNullable(schema, 'preserveSchemaType'))
            )
          } catch (e) {
            logFailure(schema)
            vi.expect.fail(`Roundtrip failed for zx.deepNonNullable with schema:\n\n${zx.toString(schema)}`)
          }
        }
      ), {
      // numRuns: 10_000,
      endOnFailure: true,
    })
  })

  vi.test('〖⛳️〗› ❲zx.deepNonNullable❳', () => {
    vi.expect.soft(
      zx.deepNonNullable.writeable(
        z.object({
          a: z.number().nullable(),
          b: z.string().nullable(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1).nullable(),
              f: z.boolean().nullable()
            })).length(10)
          })
        })
      )
    ).toMatchInlineSnapshot
      (`"z.object({a:z.number(),b:z.string(),c:z.object({d:z.array(z.object({e:z.number().max(1),f:z.boolean()})).length(10)})})"`)
  })

  vi.test('〖⛳️〗› ❲zx.deepNonNullable❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepNonNullable(Circular), 'Circular schema detected')
  })
})
