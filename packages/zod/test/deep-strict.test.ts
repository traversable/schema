import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepStrict❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepStrict(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepStrict❳: converts z.object to z.strictObject schemas', () => {
    vi.expect.soft(format(
      zx.deepStrict.writeable(
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
                  .catchall(z.never()),
              )
              .length(10),
          })
          .catchall(z.never()),
      }).catchall(z.never())
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepStrict❳: converts z.looseObject to z.strictObject schemas', () => {
    vi.expect.soft(format(
      zx.deepStrict.writeable(
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
        c: z
          .object({
            d: z
              .array(
                z
                  .object({ e: z.number().max(1), f: z.boolean() })
                  .catchall(z.never()),
              )
              .length(10),
          })
          .catchall(z.never()),
      }).catchall(z.never())
      "
    `)
  })
})
