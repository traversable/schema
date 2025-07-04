import * as vi from 'vitest'
import { z } from 'zod/v4'
import { v4 } from '@traversable/schema-zod-adapter'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it('〖️⛳️〗› ❲v4.deepNullable❳', () => {
    const schema = z.object({
      a: z.number(),
      b: z.nullable(z.string()),
      c: z.object({
        d: z.array(z.object({
          e: z.number().max(1),
          f: z.boolean()
        })).length(10)
      })
    })

    vi.expect.soft(
      v4.toString(v4.deepNullable(schema), { format: true, maxWidth: 50 }),
    ).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number().nullable(),
        b: z.string().nullable(),
        c: z.object({
          d: z.array(z.object({
            e: z.number().max(1).nullable(),
            f: z.boolean().nullable()
          }).nullable()).length(10).nullable()
        }).nullable()
      }).nullable()"
    `)

    vi.expectTypeOf(v4.deepNullable(schema)).toEqualTypeOf<v4.deepNullable.Semantics<typeof schema>>()
    vi.expectTypeOf(v4.deepNullable(schema, 'preserveSchemaType')).toEqualTypeOf(schema)
    vi.expectTypeOf(
      v4.deepNullable(schema, 'applyToOutputType')
    ).toEqualTypeOf
      <
        z.ZodType<{
          b: string | null
          a: number | null
          c: {
            d: {
              e: number | null
              f: boolean | null
            }[] | null
          } | null
        }>
      >()
  })

  vi.it('〖️⛳️〗› ❲v4.deepNullable❳: write', () => {
    vi.expect.soft(v4.deepNullable.write(
      z.object({
        abc: z.optional(z.boolean()),
        def: z.object({
          ghi: z.tuple([z.number(), z.object({ jkl: z.literal(1) })]),
          mno: z.null().nullable(),
        }),
      })
    )).toMatchInlineSnapshot
      (`"z.object({ abc: z.boolean().nullable().optional().nullable(), def: z.object({ ghi: z.tuple([z.number().nullable(), z.object({ jkl: z.literal(1).nullable() }).nullable()]).nullable(), mno: z.null().nullable() }).nullable() }).nullable()"`)
  })
})
