import * as vi from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod'
import { zx } from '@traversable/zod'

const logFailure = (schema: z.ZodType) => {
  console.group('\n\nFAILURE: property test for zx.deepPartial\n\n')
  console.debug('zx.toString(schema):\n', zx.toString(schema), '\n')
  console.debug('zx.deepPartial.writeable(schema):\n', zx.deepPartial.writeable(schema), '\n')
  console.debug(
    'zx.deepRequired.writeable(zx.deepPartial(schema)):\n',
    zx.deepRequired.writeable(zx.deepPartial(schema, 'preserveSchemaType')),
    '\n'
  )
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepPartial❳: property tests', () => {
    fc.assert(
      fc.property(
        zx.SeedGenerator({ exclude: ['optional', 'promise'] })['*'],
        (seed) => {
          const schema = zx.seedToSchema(seed)
          try {
            vi.assert.equal(
              zx.toString(schema),
              zx.deepRequired.writeable(zx.deepPartial(schema, 'preserveSchemaType'))
            )
          } catch (e) {
            logFailure(schema)
            vi.expect.fail(`Roundtrip failed for zx.deepPartial with schema:\n\n${zx.toString(schema)}`)
          }
        }
      ), {
      // numRuns: 10_000,
      endOnFailure: true,
    })
  })

  vi.test('〖⛳️〗› ❲zx.deepPartial❳', () => {
    vi.expect.soft(
      zx.deepPartial.writeable(
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
      (`"z.object({a:z.number().optional(),b:z.string().optional(),c:z.object({d:z.array(z.object({e:z.number().max(1).optional(),f:z.boolean().optional()})).length(10).optional()}).optional()})"`)
  })

  vi.test('〖⛳️〗› ❲zx.deepPartial❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepPartial(Circular), 'Circular schema detected')
  })
})
