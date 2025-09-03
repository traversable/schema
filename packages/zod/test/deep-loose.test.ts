import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepLoose❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepLoose(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepLoose❳: converts z.object to z.looseObject schemas', () => {

    vi.expect.soft(format(
      zx.toString(
        z.looseObject({
          a: z.number(),
        })
      ))
    ).toMatchInlineSnapshot
      (`
      "z.object({ a: z.number() }).catchall(z.unknown())
      "
    `)

    vi.expect.soft(format(
      zx.deepLoose.writeable(
        z.object({
          a: z.number(),
          b: z.nullable(z.string()),
          c: z.object({
            d: z.array(
              z.object({
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
        c: z
          .object({
            d: z
              .array(
                z
                  .object({ e: z.number().max(1), f: z.boolean() })
                  .catchall(z.unknown()),
              )
              .length(10),
          })
          .catchall(z.unknown()),
      }).catchall(z.unknown())
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepLoose❳: converts z.strictObject to z.looseObject schemas', () => {
    vi.expect.soft(format(
      zx.deepLoose.writeable(
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
      "z.object({
        a: z.number(),
        b: z.string().nullable(),
        c: z
          .object({
            d: z
              .array(
                z
                  .object({ e: z.number().max(1), f: z.boolean() })
                  .catchall(z.unknown()),
              )
              .length(10),
          })
          .catchall(z.unknown()),
      }).catchall(z.unknown())
      "
    `)
  })
})
