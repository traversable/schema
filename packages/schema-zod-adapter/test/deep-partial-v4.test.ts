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

    vi.expectTypeOf(
      v4.deepPartial(schema, { typelevel: 'applyToSchema' })
    ).toEqualTypeOf(
      z.object({
        a: z.number().optional(),
        b: z.string().optional(),
        c: z.object({
          d: z.array(z.object({
            e: z.number().max(1).optional(),
            f: z.boolean().optional()
          })).length(10).optional()
        }).optional()
      })
    )

    vi.expect(
      v4.toString(v4.deepPartial(schema), { format: true, maxWidth: 60 }),
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

    vi.expectTypeOf(v4.deepPartial(schema, { typelevel: 'none' })).toEqualTypeOf(schema)
    vi.expectTypeOf(v4.deepPartial(schema, { typelevel: 'semanticWrapperOnly' })).toEqualTypeOf<v4.deepPartial.Semantics<typeof schema>>()

    vi.expectTypeOf(
      v4.deepPartial(schema, { typelevel: 'applyToOutputType' })
    ).toEqualTypeOf
      <z.ZodType<{
        b?: string | undefined
        a?: number | undefined
        c?: {
          d?: {
            e?: number | undefined
            f?: boolean | undefined
          }[] | undefined
        } | undefined
      }, unknown>>()
  })
})
