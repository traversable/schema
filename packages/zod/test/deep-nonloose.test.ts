import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepNonLoose❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepNonLoose(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepNonLoose❳: converts z.looseObject to z.object schemas', () => {
    vi.expect.soft(format(
      zx.deepNonLoose.writeable(
        z.looseObject({
          a: z.number(),
          b: z.nullable(z.string()),
          c: z.looseObject({
            d: z.array(
              z.looseObject({
                e: z.number().max(1),
                f: z.boolean()
              })
            ).length(10)
          })
        })
      ))
    ).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number(),
        b: z.string().nullable(),
        c: z.object({
          d: z.array(z.object({ e: z.number().max(1), f: z.boolean() })).length(10),
        }),
      })
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepNonLoose❳: leaves z.strictObject schemas alone', () => {
    vi.expect.soft(format(
      zx.deepNonLoose.writeable(
        z.strictObject({
          a: z.number(),
          b: z.nullable(z.string()),
          c: z.strictObject({
            d: z.array(
              z.strictObject({
                e: z.number().max(1),
                f: z.boolean()
              })
            ).length(10)
          })
        })
      ))
    ).toMatchInlineSnapshot
      (`
      "z.strictObject({
        a: z.number(),
        b: z.string().nullable(),
        c: z.strictObject({
          d: z
            .array(z.strictObject({ e: z.number().max(1), f: z.boolean() }))
            .length(10),
        }),
      })
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepNonLoose❳: leaves non-unknown catchall schemas alone', () => {
    vi.expect.soft(format(
      zx.deepNonLoose.writeable(
        z.object({
          a: z.number(),
          b: z.nullable(z.string()),
          c: z.object({
            d: z.array(
              z.object({
                e: z.number().max(1),
                f: z.boolean()
              }).catchall(z.boolean())
            ).length(10)
          }).catchall(z.number())
        }).catchall(z.string())
      ))
    ).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number(),
        b: z.string().nullable(),
        c: z
          .object({
            d: z
              .array(
                z
                  .object({ e: z.number().max(1), f: z.boolean() })
                  .catchall(z.boolean()),
              )
              .length(10),
          })
          .catchall(z.number()),
      }).catchall(z.string())
      "
    `)
  })
})
