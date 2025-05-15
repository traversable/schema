import * as vi from 'vitest'
import { z } from 'zod4'
import { v4 } from '@traversable/schema-zod-adapter'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it("〖️⛳️〗› ❲v4.deepPartial❳", () => {
    const schema = z.object({
      a: z.number(),
      b: z.optional(z.string()),
      c: z.object({
        d: z.array(z.object({
          e: z.number().max(1),
          f: z.boolean()
        })).length(10)
      })
    })

    vi.expect(
      v4.toString(v4.deepPartial(schema), { format: true, maxWidth: 50 }),
    ).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number().optional(),
        b: z.string().optional(),
        c: z.object({
          d: z.array(z.object({
            e: z.number().max(1).optional(),
            f: z.boolean().optional()
          })).length(10).optional()
        }).optional()
      })"
    `)

    vi.expectTypeOf(v4.deepPartial(schema)).toEqualTypeOf<v4.deepPartial.Semantics<typeof schema>>()
    vi.expectTypeOf(v4.deepPartial(schema, 'preserveSchemaType')).toEqualTypeOf(schema)
    vi.expectTypeOf(
      v4.deepPartial(schema, 'applyToOutputType')
    ).toEqualTypeOf
      <
        z.ZodType<{
          b?: string
          a?: number
          c?: {
            d?: {
              e?: number
              f?: boolean
            }[]
          }
        }>
      >()

  })

  vi.it('〖️⛳️〗› ❲v4.deepPartial❳: write', () => {
    vi.expect(v4.deepPartial.write(
      z.object({
        abc: z.optional(z.boolean()),
        def: z.object({
          ghi: z.tuple([z.number(), z.object({ jkl: z.literal(1) })]),
          mno: z.null().nullable(),
        }),
      })
    )).toMatchInlineSnapshot
      (`"z.object({ abc: z.boolean().optional(), def: z.object({ ghi: z.tuple([z.number(), z.object({ jkl: z.literal(1).optional() })]).optional(), mno: z.null().nullable().optional() }).optional() })"`)
  })
})
