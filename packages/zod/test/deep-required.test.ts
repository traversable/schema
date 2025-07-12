import * as vi from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod'
import { zx } from '@traversable/zod'

const logFailure = (schema: z.ZodType) => {
  console.group('\n\nFAILURE: property test for zx.deepRequired\n\n')
  console.debug('zx.toString(schema):\n', zx.toString(schema), '\n')
  console.debug('zx.deepRequired.writeable(schema):\n', zx.deepRequired.writeable(schema), '\n')
  console.debug(
    'zx.deepRequired.writeable(zx.deepRequired(schema)):\n',
    zx.deepRequired.writeable(zx.deepRequired(schema, 'preserveSchemaType')),
    '\n'
  )
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepRequired❳: property tests', () => {
    fc.assert(
      fc.property(
        zx.SeedGenerator({ exclude: ['optional', 'promise'] })['*'],
        (seed) => {
          const schema = zx.seedToSchema(seed as never)
          try {
            vi.assert.equal(
              zx.toString(schema),
              zx.deepRequired.writeable(zx.deepOptional(schema, 'preserveSchemaType'))
            )
          } catch (e) {
            logFailure(schema)
            vi.expect.fail(`Roundtrip failed for zx.deepRequired with schema:\n\n${zx.toString(schema)}`)
          }
        }
      ), {
      // numRuns: 10_000,
      endOnFailure: true,
    })
  })

  vi.test('〖⛳️〗› ❲zx.deepRequired❳', () => {
    vi.expect.soft(
      zx.deepRequired.writeable(
        z.object({
          a: z.optional(z.number()),
          b: z.optional(z.string()),
          c: z.object({
            d: z.optional(
              z.array(
                z.optional(
                  z.object({
                    e: z.number().max(1),
                    f: z.optional(z.optional(z.boolean()))
                  })
                )
              )
            )
          })
        })
      )
    ).toMatchInlineSnapshot
      (`"z.object({a:z.number(),b:z.string(),c:z.object({d:z.array(z.object({e:z.number().max(1),f:z.boolean()}))})})"`)
  })

  vi.test('〖⛳️〗› ❲zx.deepReadonly❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepReadonly(Circular), 'Circular schema detected')
  })
})
