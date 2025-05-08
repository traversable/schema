import * as vi from 'vitest'
import { z } from 'zod4'
import { v4 } from '@traversable/schema-zod-adapter'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it("〖️⛳️〗› ❲v4.deepNullable❳", () => {
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

    vi.expectTypeOf(
      v4.deepNullable(schema, { typelevel: 'applyToSchema' }),
    ).toEqualTypeOf(
      z.object({
        a: z.number().nullable(),
        b: z.string().nullable(),
        c: z.object({
          d: z.array(z.object({
            e: z.number().max(1).nullable(),
            f: z.boolean().nullable()
          })).length(10).nullable()
        }).nullable()
      })
    )

    vi.expect(
      v4.toString(v4.deepNullable(schema), { format: true, maxWidth: 60 }),
    ).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number().nullable(),
        b: z.string().nullable(),
        c: z.object({
          d: z.array(z.object({
            e: z.number().max(1).nullable(),
            f: z.boolean().nullable()
          })).length(10).nullable()
        }).nullable()
      })"
    `)

    vi.expectTypeOf(v4.deepNullable(schema, { typelevel: 'none' })).toEqualTypeOf(schema)
    vi.expectTypeOf(v4.deepNullable(schema, { typelevel: 'semanticWrapperOnly' })).toEqualTypeOf<v4.deepNullable.Semantics<typeof schema>>()

    vi.expectTypeOf(
      v4.deepNullable(schema)
    ).toEqualTypeOf
      <z.ZodType<{
        b: string | null
        a: number | null
        c: {
          d: {
            e: number | null
            f: boolean | null
          }[] | null
        } | null
      }, unknown>>()
  })
})

