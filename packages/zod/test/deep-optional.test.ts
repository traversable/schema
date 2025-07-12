import * as vi from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod'
import { zx } from '@traversable/zod'

const logFailure = (schema: z.ZodType) => {
  console.group('\n\nFAILURE: property test for zx.deepOptional\n\n')
  console.debug('zx.toString(schema):\n', zx.toString(schema), '\n')
  console.debug('zx.deepOptional.writeable(schema):\n', zx.deepOptional.writeable(schema), '\n')
  console.debug(
    'zx.deepRequired.writeable(zx.deepOptional(schema)):\n',
    zx.deepRequired.writeable(zx.deepOptional(schema, 'preserveSchemaType')),
    '\n'
  )
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {

  vi.test('〖⛳️〗› ❲zx.deepOptional❳: property tests', () => {
    fc.assert(
      fc.property(
        zx.SeedGenerator({ exclude: ['optional', 'promise'] })['*'],
        (seed) => {
          const schema = zx.seedToSchema(seed)
          try {
            vi.assert.equal(
              zx.toString(schema),
              zx.deepRequired.writeable(zx.deepOptional(schema, 'preserveSchemaType'))
            )
          } catch (e) {
            logFailure(schema)
            vi.expect.fail(`Roundtrip failed for zx.deepOptional with schema:\n\n${zx.toString(schema)}`)
          }
        }
      ), {
      // numRuns: 10_000,
      endOnFailure: true,
    })
  })

  vi.test('〖⛳️〗› ❲zx.deepOptional❳', () => {
    vi.expect.soft(
      zx.deepOptional.writeable(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.tuple([
              z.bigint(),
              z.object({
                e: z.number().max(1),
                f: z.boolean()
              }),
            ])
          })
        })
      )
    ).toMatchInlineSnapshot
      (`"z.object({a:z.number().optional(),b:z.string().optional(),c:z.object({d:z.tuple([z.bigint().optional(),z.object({e:z.number().max(1).optional(),f:z.boolean().optional()}).optional()]).optional()}).optional()}).optional()"`)
  })

  vi.test('〖⛳️〗› ❲zx.deepOptional❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepOptional(Circular), 'Circular schema detected')
  })
})
