import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepNoDefaults❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepNoDefaults(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepNoDefaults❳: defaultOptions', () => {
    vi.expect.soft(format(
      zx.deepNoDefaults.writeable(
        z.object({
          a: z.number().default(0),
          b: z.boolean().default(false).optional(),
          c: z.boolean().optional().default(false),
          d: z.union([z.string().default(''), z.number().default(0)]),
          e: z.array(
            z.object({
              f: z.number().default(0),
              g: z.boolean().default(false).optional(),
              h: z.boolean().optional().default(false),
              i: z.union([z.string().default(''), z.number().default(0)]),
            }).default({
              f: 0,
              g: false,
              h: false,
              i: '',
            })
          ).default([])
        })
      )
    )).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number().optional(),
        b: z.boolean().optional(),
        c: z.boolean().optional(),
        d: z.union([z.string(), z.number()]).optional(),
        e: z
          .array(
            z.object({
              f: z.number().optional(),
              g: z.boolean().optional(),
              h: z.boolean().optional(),
              i: z.union([z.string(), z.number()]).optional(),
            }),
          )
          .optional(),
      })
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepNoDefaults❳: { replaceWithOptional: false }', () => {
    vi.expect.soft(format(
      zx.deepNoDefaults.writeable(
        z.object({
          a: z.number().default(0),
          b: z.boolean().default(false).optional(),
          c: z.boolean().optional().default(false),
          d: z.union([z.string().default(''), z.number().default(0)]),
          e: z.array(
            z.object({
              f: z.number().default(0),
              g: z.boolean().default(false).optional(),
              h: z.boolean().optional().default(false),
              i: z.union([z.string().default(''), z.number().default(0)]),
            }).default({
              f: 0,
              g: false,
              h: false,
              i: '',
            })
          ).default([])
        }),
        { replaceWithOptional: false }
      )
    )).toMatchInlineSnapshot
      (`
      "z.object({
        a: z.number(),
        b: z.boolean().optional(),
        c: z.boolean().optional(),
        d: z.union([z.string(), z.number()]),
        e: z.array(
          z.object({
            f: z.number(),
            g: z.boolean().optional(),
            h: z.boolean().optional(),
            i: z.union([z.string(), z.number()]),
          }),
        ),
      })
      "
    `)
  })
})
