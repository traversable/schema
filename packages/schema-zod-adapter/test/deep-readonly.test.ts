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
      }), { typelevel: 'applyToSchema' }),
    ).toEqualTypeOf
      <
        z.ZodReadonly<z.ZodObject<{
          a: z.ZodNumber
          b: z.ZodString
          c: z.ZodReadonly<z.ZodObject<{
            d: z.ZodReadonly<z.ZodArray<z.ZodReadonly<z.ZodObject<{
              e: z.ZodNumber
              f: z.ZodBoolean
            }, {}>>>>
          }, {}>>
        }, {}>>
      >()

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
        a: z.number(),
        b: z.string(),
        c: z.object({
          d: z.array(z.object({
            e: z.number().max(1),
            f: z.boolean()
          }).readonly()).readonly()
        }).readonly()
      }).readonly()"
    `)

    vi.expectTypeOf(v4.deepReadonly(schema, { typelevel: 'none' }))
      .toEqualTypeOf(schema)

    vi.expectTypeOf(v4.deepReadonly(schema, { typelevel: 'semanticWrapperOnly' }))
      .toEqualTypeOf<v4.deepNullable.Semantics<typeof schema>>()

    vi.expectTypeOf(
      v4.deepReadonly(schema)
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
})

