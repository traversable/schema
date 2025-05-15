import * as vi from 'vitest'
import { z } from 'zod4'
import { v4 } from '@traversable/schema-zod-adapter'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it("〖️⛳️〗› ❲v4.deepReadonly❳", () => {
    const schema = z.object({
      a: z.number(),
      b: z.string().readonly(),
      c: z.object({
        d: z.array(
          z.object({
            e: z.number().max(1),
            f: z.boolean()
          })
        ).length(10)
      })
    })

    vi.expect(
      v4.toString(v4.deepReadonly(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(
              z.object({
                e: z.number().max(1),
                f: z.boolean()
              })
            ).length(10)
          })
        })), { format: true, maxWidth: 50 }),
    ).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number().readonly(),
        b: z.string().readonly(),
        c: z.object({
          d: z.array(z.object({
            e: z.number().max(1).readonly(),
            f: z.boolean().readonly()
          }).readonly()).readonly()
        }).readonly()
      })"
    `)

    vi.expectTypeOf(v4.deepReadonly(schema)).toEqualTypeOf<v4.deepNullable.Semantics<typeof schema>>()
    vi.expectTypeOf(v4.deepReadonly(schema, 'preserveSchemaType')).toEqualTypeOf(schema)
    vi.expectTypeOf(
      v4.deepReadonly(z.object({
        a: z.number(),
        b: z.string(),
        c: z.object({
          d: z.array(
            z.object({
              e: z.number().max(1),
              f: z.boolean()
            })
          ).length(10)
        })
      }), 'applyToOutputType')
    ).toEqualTypeOf
      <
        z.ZodType<{
          readonly a: number
          readonly b: string
          readonly c: {
            readonly d: readonly {
              readonly e: number
              readonly f: boolean
            }[]
          }
        }>
      >()
  })

  vi.it('〖️⛳️〗› ❲v4.deepReadonly❳: write', () => {
    vi.expect(v4.deepReadonly.write(
      z.object({
        abc: z.readonly(z.boolean()),
        def: z.object({
          ghi: z.tuple([z.number(), z.object({ jkl: z.literal(1) })]),
          mno: z.null().readonly(),
        }),
      })
    )).toMatchInlineSnapshot
      (`"z.object({ abc: z.boolean().readonly(), def: z.object({ ghi: z.tuple([z.number().readonly(), z.object({ jkl: z.literal(1).readonly() }).readonly()]).readonly(), mno: z.null().readonly() }).readonly() })"`)
  })

})

