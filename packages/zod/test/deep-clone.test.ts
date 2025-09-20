import * as vi from 'vitest'
import prettier from '@prettier/sync'
import { z } from 'zod'
import { zx } from '@traversable/zod'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.deepClone.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.never', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.never()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.any', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.any()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: any) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.unknown', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.unknown()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: unknown) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.void', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.void()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: void) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.undefined', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.undefined()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.null', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.null()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.boolean', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.boolean()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: boolean) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.symbol', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.symbol()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: symbol) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.nan', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.int()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.int', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.int()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.bigint', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.bigint()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: bigint) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.number', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.number()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.string', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.string()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: string) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.enum', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.enum([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.enum(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.enum(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a" | "b") {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.literal', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.literal('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.literal(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a" | "b") {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.templateLiteral', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.templateLiteral([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.templateLiteral(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.templateLiteral(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "ab") {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.date', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(z.date())
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Date) {
        return new Date(prev?.getTime())
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.optional(z.date()))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | Date) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.custom', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(z.custom(() => {}), { stripTypes: true })
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.file', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.file()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: File) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.lazy', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.lazy(() => z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.readonly', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(z.readonly(z.object({ a: z.number().readonly() })))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Readonly<{ a: number }>) {
        return {
          a: prev.a,
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.optional', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          a: z.optional(z.undefined())
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { a?: undefined }) {
        return {
          a: prev.a,
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.array(z.optional(z.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<undefined | number>) {
        return prev.slice()
      }
      "
    `)


    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.optional(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | number) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.optional(z.optional(z.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | number) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          abc: z.optional(z.number())
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { abc?: number }) {
        return {
          ...(prev.abc !== undefined && { abc: prev.abc }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.set(z.optional(z.boolean())))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Set<undefined | boolean>) {
        return new Set(prev)
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.map(z.optional(z.boolean()), z.optional(z.boolean())))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Map<undefined | boolean, undefined | boolean>) {
        return new Map(prev)
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.set(z.optional(z.optional(z.boolean()))))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Set<undefined | boolean>) {
        return new Set(prev)
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          a: z.optional(z.number()),
          b: z.optional(z.optional(z.number())),
          c: z.optional(
            z.object({
              d: z.optional(z.number()),
              e: z.optional(z.optional(z.number())),
            })
          )
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {
        a?: number
        b?: undefined | number
        c?: { d?: number; e?: undefined | number }
      }) {
        return {
          ...(prev.a !== undefined && { a: prev.a }),
          ...(prev.b !== undefined && { b: prev.b }),
          ...(prev.c && {
            c: {
              ...(prev.c.d !== undefined && { d: prev.c.d }),
              ...(prev.c.e !== undefined && { e: prev.c.e }),
            },
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.optional(
          z.object({
            a: z.optional(z.number()),
            b: z.optional(z.optional(z.number())),
            c: z.optional(
              z.object({
                d: z.optional(z.number()),
                e: z.optional(z.optional(z.number())),
              })
            )
          })
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(
        prev:
          | undefined
          | {
              a?: number
              b?: undefined | number
              c?: { d?: number; e?: undefined | number }
            },
      ) {
        return prev === undefined
          ? prev
          : {
              ...(prev.a !== undefined && { a: prev.a }),
              ...(prev.b !== undefined && { b: prev.b }),
              ...(prev.c && {
                c: {
                  ...(prev.c.d !== undefined && { d: prev.c.d }),
                  ...(prev.c.e !== undefined && { e: prev.c.e }),
                },
              }),
            }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.tuple([z.string(), z.optional(z.string())])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [string, _?: string]) {
        return [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.optional(z.tuple([z.string(), z.optional(z.string())]))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | [string, _?: string]) {
        return prev === undefined ? prev : [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.tuple([
          z.string(),
          z.optional(z.string()),
          z.optional(
            z.tuple([
              z.string(),
              z.optional(z.string())
            ])
          )]
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [string, _?: string, _?: [string, _?: string]]) {
        return [
          prev[0],
          prev[1],
          prev[2] === undefined ? prev[2] : [prev[2][0], prev[2][1]],
        ]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.optional(z.tuple([z.string(), z.optional(z.string()), z.optional(z.tuple([z.string(), z.optional(z.string())]))])),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = undefined | [string, _?: string, _?: [string, _?: string]]
      function deepClone(prev: Type) {
        return prev === undefined
          ? prev
          : [
              prev[0],
              prev[1],
              prev[2] === undefined ? prev[2] : [prev[2][0], prev[2][1]],
            ]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.record(z.string(), z.optional(z.string())))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Record<string, undefined | string>) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, Object.create(null))
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.optional(z.record(z.string(), z.optional(z.string()))))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | Record<string, undefined | string>) {
        return prev === undefined
          ? prev
          : Object.entries(prev).reduce((acc, [key, value]) => {
              acc[key] = value
              return acc
            }, Object.create(null))
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          a: z.optional(z.record(z.string(), z.optional(z.string())))
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a?: Record<string, undefined | string> }
      function deepClone(prev: Type) {
        return {
          ...(prev.a && {
            a: Object.entries(prev.a).reduce((acc, [key, value]) => {
              acc[key] = value
              return acc
            }, Object.create(null)),
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          a: z.optional(
            z.record(
              z.string(),
              z.object({
                b: z.optional(z.string())
              })
            )
          )
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a?: Record<string, { b?: string }> }
      function deepClone(prev: Type) {
        return {
          ...(prev.a && {
            a: Object.entries(prev.a).reduce((acc, [key, value]) => {
              acc[key] = {
                ...(value.b !== undefined && { b: value.b }),
              }
              return acc
            }, Object.create(null)),
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          a: z.optional(
            z.record(
              z.string(),
              z.optional(
                z.object({
                  b: z.optional(
                    z.record(
                      z.string(),
                      z.optional(z.object({
                        c: z.optional(z.string())
                      }))
                    )
                  )
                })
              )
            )
          )
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a?: Record<
          string,
          undefined | { b?: Record<string, undefined | { c?: string }> }
        >
      }
      function deepClone(prev: Type) {
        return {
          ...(prev.a && {
            a: Object.entries(prev.a).reduce((acc, [key, value]) => {
              acc[key] =
                value === undefined
                  ? value
                  : {
                      ...(value.b && {
                        b: Object.entries(value.b).reduce((acc, [key, value]) => {
                          acc[key] =
                            value === undefined
                              ? value
                              : {
                                  ...(value.c !== undefined && { c: value.c }),
                                }
                          return acc
                        }, Object.create(null)),
                      }),
                    }
              return acc
            }, Object.create(null)),
          }),
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.nullable', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.nullable(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null | number) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          abc: z.nullable(z.number())
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { abc: null | number }) {
        return {
          abc: prev.abc,
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.array', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.array(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<number>) {
        return prev.slice()
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.array(z.array(z.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<Array<number>>) {
        return prev.map((value) => {
          return value.slice()
        })
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.array(
          z.object({
            c: z.object({
              d: z.string(),
              e: z.array(z.string()),
            })
          })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{ c: { d: string; e: Array<string> } }>
      function deepClone(prev: Type) {
        return prev.map((value) => {
          return {
            c: {
              d: value.c.d,
              e: value.c.e.slice(),
            },
          }
        })
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.array(
          z.object({
            firstName: z.string(),
            lastName: z.optional(z.string()),
            address: z.object({
              street1: z.string(),
              street2: z.optional(z.string()),
              city: z.string(),
            })
          })
        ), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{
        firstName: string
        lastName?: string
        address: { street1: string; street2?: string; city: string }
      }>
      function deepClone(prev: Type) {
        return prev.map((value) => {
          return {
            firstName: value.firstName,
            ...(value.lastName !== undefined && { lastName: value.lastName }),
            address: {
              street1: value.address.street1,
              ...(value.address.street2 !== undefined && {
                street2: value.address.street2,
              }),
              city: value.address.city,
            },
          }
        })
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.record', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.record(z.string(), z.record(z.string(), z.string())), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, string>>
      function deepClone(prev: Type) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = Object.entries(value).reduce((acc, [key, value]) => {
            acc[key] = value
            return acc
          }, Object.create(null))
          return acc
        }, Object.create(null))
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          a: z.record(z.string(), z.string()),
          b: z.record(
            z.string(),
            z.object({
              c: z.object({
                d: z.string(),
                e: z.record(
                  z.string(),
                  z.array(z.string()),
                )
              })
            })
          )
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: Record<string, string>
        b: Record<string, { c: { d: string; e: Record<string, Array<string>> } }>
      }
      function deepClone(prev: Type) {
        return {
          a: Object.entries(prev.a).reduce((acc, [key, value]) => {
            acc[key] = value
            return acc
          }, Object.create(null)),
          b: Object.entries(prev.b).reduce((acc, [key, value]) => {
            acc[key] = {
              c: {
                d: value.c.d,
                e: Object.entries(value.c.e).reduce((acc, [key, value]) => {
                  acc[key] = value.slice()
                  return acc
                }, Object.create(null)),
              },
            }
            return acc
          }, Object.create(null)),
        }
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.tuple', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(z.tuple([]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function deepClone(prev: Type) {
        return []
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.tuple([z.string(), z.string()]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function deepClone(prev: Type) {
        return [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.tuple([z.number(), z.tuple([z.object({ a: z.boolean() })])])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [number, [{ a: boolean }]]) {
        return [
          prev[0],
          [
            {
              a: prev[1][0].a,
            },
          ],
        ]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.object({
        a: z.tuple([z.string(), z.string()]),
        b: z.optional(z.tuple([z.string(), z.optional(z.tuple([z.string()]))]))
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: [string, string]; b?: [string, _?: [string]] }
      function deepClone(prev: Type) {
        return {
          a: [prev.a[0], prev.a[1]],
          ...(prev.b && {
            b: [prev.b[0], prev.b[1] === undefined ? prev.b[1] : [prev.b[1][0]]],
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.tuple([
          z.object({
            A: z.optional(z.boolean())
          }),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: boolean }]
      function deepClone(prev: Type) {
        return [
          {
            ...(prev[0].A !== undefined && { A: prev[0].A }),
          },
        ]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.tuple([
          z.object({
            A: z.optional(
              z.tuple([
                z.object({
                  B: z.optional(z.boolean())
                })
              ])
            )
          })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: [{ B?: boolean }] }]
      function deepClone(prev: Type) {
        return [
          {
            ...(prev[0].A && {
              A: [
                {
                  ...(prev[0].A[0].B !== undefined && { B: prev[0].A[0].B }),
                },
              ],
            }),
          },
        ]
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.tuple w/ rest', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(z.tuple([z.string(), z.string()], z.number()), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string, ...number[]]
      function deepClone(prev: Type) {
        return [prev[0], prev[1], ...(prev.slice(2) as Array<number>)]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.tuple(
          [z.boolean(), z.string(), z.date()],
          z.array(z.number())
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [boolean, string, Date, ...Array<number>[]]) {
        return [
          prev[0],
          prev[1],
          new Date(prev[2]?.getTime()),
          ...(prev.slice(3) as Array<Array<number>>).map((value) => value.slice()),
        ]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.tuple([z.tuple([z.boolean()], z.boolean())], z.boolean())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [[boolean, ...boolean[]], ...boolean[]]) {
        return [
          [prev[0][0], ...(prev[0].slice(1) as Array<boolean>)],
          ...(prev.slice(1) as Array<boolean>),
        ]
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.tuple(
          [
            z.object({
              a: z.tuple(
                [
                  z.object({
                    b: z.tuple(
                      [
                        z.object({
                          c: z.tuple(
                            [
                              z.object({
                                d: z.string(),
                              })
                            ],
                            z.object({
                              E: z.tuple(
                                [
                                  z.string(),
                                ], z.object({
                                  F: z.string(),
                                })
                              )
                            })
                          ),
                        })
                      ],
                      z.object({
                        G: z.string()
                      })
                    )
                  })
                ], z.object({
                  G: z.string()
                })
              )
            })
          ],
          z.object({
            H: z.tuple([z.string()], z.object({
              I: z.string(),
            }))
          })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [
        {
          a: [
            {
              b: [
                { c: [{ d: string }, ...{ E: [string, ...{ F: string }[]] }[]] },
                ...{ G: string }[],
              ]
            },
            ...{ G: string }[],
          ]
        },
        ...{ H: [string, ...{ I: string }[]] }[],
      ]
      function deepClone(prev: Type) {
        return [
          {
            a: [
              {
                b: [
                  {
                    c: [
                      {
                        d: prev[0].a[0].b[0].c[0].d,
                      },
                      ...(
                        prev[0].a[0].b[0].c.slice(1) as Array<{
                          E: [string, ...{ F: string }[]]
                        }>
                      ).map((value) => ({
                        E: [
                          value.E[0],
                          ...(value.E.slice(1) as Array<{ F: string }>).map(
                            (value) => ({
                              F: value.F,
                            }),
                          ),
                        ],
                      })),
                    ],
                  },
                  ...(prev[0].a[0].b.slice(1) as Array<{ G: string }>).map(
                    (value) => ({
                      G: value.G,
                    }),
                  ),
                ],
              },
              ...(prev[0].a.slice(1) as Array<{ G: string }>).map((value) => ({
                G: value.G,
              })),
            ],
          },
          ...(prev.slice(1) as Array<{ H: [string, ...{ I: string }[]] }>).map(
            (value) => ({
              H: [
                value.H[0],
                ...(value.H.slice(1) as Array<{ I: string }>).map((value) => ({
                  I: value.I,
                })),
              ],
            }),
          ),
        ]
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.object', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(z.object({}))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return {}
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.object({
        street1: z.string(),
        street2: z.optional(z.string()),
        city: z.string(),
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: string; city: string }
      function deepClone(prev: Type) {
        return {
          street1: prev.street1,
          ...(prev.street2 !== undefined && { street2: prev.street2 }),
          city: prev.city,
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          a: z.object({
            b: z.string(),
            c: z.string(),
          }),
          d: z.optional(z.string()),
          e: z.object({
            f: z.string(),
            g: z.optional(
              z.object({
                h: z.string(),
                i: z.string(),
              })
            )
          })
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: { b: string; c: string }
        d?: string
        e: { f: string; g?: { h: string; i: string } }
      }
      function deepClone(prev: Type) {
        return {
          a: {
            b: prev.a.b,
            c: prev.a.c,
          },
          ...(prev.d !== undefined && { d: prev.d }),
          e: {
            f: prev.e.f,
            ...(prev.e.g && {
              g: {
                h: prev.e.g.h,
                i: prev.e.g.i,
              },
            }),
          },
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          b: z.array(
            z.object({
              c: z.array(
                z.object({
                  d: z.string()
                })
              ),
            })
          )
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { b: Array<{ c: Array<{ d: string }> }> }
      function deepClone(prev: Type) {
        return {
          b: prev.b.map((value) => {
            return {
              c: value.c.map((value) => {
                return {
                  d: value.d,
                }
              }),
            }
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(z.object({
        b: z.array(z.string()),
        '0b': z.array(z.string()),
        '00b': z.array(z.string()),
        '-00b': z.array(z.string()),
        '00b0': z.array(z.string()),
        '--00b0': z.array(z.string()),
        '-^00b0': z.array(z.string()),
        '': z.array(z.string()),
        '_': z.array(z.string()),
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        b: Array<string>
        "0b": Array<string>
        "00b": Array<string>
        "-00b": Array<string>
        "00b0": Array<string>
        "--00b0": Array<string>
        "-^00b0": Array<string>
        "": Array<string>
        _: Array<string>
      }
      function deepClone(prev: Type) {
        return {
          b: prev.b.slice(),
          "0b": prev["0b"].slice(),
          "00b": prev["00b"].slice(),
          "-00b": prev["-00b"].slice(),
          "00b0": prev["00b0"].slice(),
          "--00b0": prev["--00b0"].slice(),
          "-^00b0": prev["-^00b0"].slice(),
          "": prev[""].slice(),
          _: prev._.slice(),
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.object w/ catchall', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({}).catchall(z.string())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return {
          ...Object.entries(prev).reduce((acc, [key, value]) => {
            acc[key] = value
            return acc
          }, Object.create(null)),
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          street1: z.string(),
          street2: z.optional(z.string()),
          city: z.string(),
        }).catchall(
          z.array(z.string())
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: string; city: string } & {
        [x: string]: Array<string>
      }
      function deepClone(prev: Type) {
        return {
          street1: prev.street1,
          ...(prev.street2 !== undefined && { street2: prev.street2 }),
          city: prev.city,
          ...Object.entries(prev).reduce((acc, [key, value]) => {
            if (key === "street1" || key === "street2" || key === "city") return acc
            acc[key] = value.slice()
            return acc
          }, Object.create(null)),
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          a: z.object({
            b: z.string(),
            c: z.string(),
          }).catchall(
            z.record(
              z.string(),
              z.array(z.string())
            )
          ),
          d: z.optional(z.string()),
          e: z.object({
            f: z.string(),
            g: z.optional(
              z.object({
                h: z.string(),
                i: z.string(),
              }).catchall(
                z.object({
                  j: z.string(),
                  k: z.object({
                    l: z.string()
                  }).catchall(
                    z.string()
                  )
                })
              )
            )
          }).catchall(
            z.object({
              m: z.string(),
              n: z.string(),
            })
          )
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: { b: string; c: string } & { [x: string]: Record<string, Array<string>> }
        d?: string
        e: {
          f: string
          g?: { h: string; i: string } & {
            [x: string]: { j: string; k: { l: string } & { [x: string]: string } }
          }
        } & { [x: string]: { m: string; n: string } }
      }
      function deepClone(prev: Type) {
        return {
          a: {
            b: prev.a.b,
            c: prev.a.c,
            ...Object.entries(prev.a).reduce((acc, [key, value]) => {
              if (key === "b" || key === "c") return acc
              acc[key] = Object.entries(value).reduce((acc, [key, value]) => {
                acc[key] = value.slice()
                return acc
              }, Object.create(null))
              return acc
            }, Object.create(null)),
          },
          ...(prev.d !== undefined && { d: prev.d }),
          e: {
            f: prev.e.f,
            ...(prev.e.g && {
              g: {
                h: prev.e.g.h,
                i: prev.e.g.i,
                ...Object.entries(prev.e.g).reduce((acc, [key, value]) => {
                  if (key === "h" || key === "i") return acc
                  acc[key] = {
                    j: value.j,
                    k: {
                      l: value.k.l,
                      ...Object.entries(value.k).reduce((acc, [key, value]) => {
                        if (key === "l") return acc
                        acc[key] = value
                        return acc
                      }, Object.create(null)),
                    },
                  }
                  return acc
                }, Object.create(null)),
              },
            }),
            ...Object.entries(prev.e).reduce((acc, [key, value]) => {
              if (key === "f" || key === "g") return acc
              acc[key] = {
                m: value.m,
                n: value.n,
              }
              return acc
            }, Object.create(null)),
          },
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.object({
          b: z.array(z.string()),
          '0b': z.array(z.string()),
          '00b': z.array(z.string()),
          '-00b': z.array(z.string()),
          '00b0': z.array(z.string()),
          '--00b0': z.array(z.string()),
          '-^00b0': z.array(z.string()),
          '': z.array(z.string()),
          '_': z.array(z.string()),
        }).catchall(
          z.object({
            c: z.array(z.string()),
            '0c': z.array(z.string()),
            '00c': z.array(z.string()),
            '-00c': z.array(z.string()),
            '00c0': z.array(z.string()),
            '--00c0': z.array(z.string()),
            '-^00c0': z.array(z.string()),
          })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        b: Array<string>
        "0b": Array<string>
        "00b": Array<string>
        "-00b": Array<string>
        "00b0": Array<string>
        "--00b0": Array<string>
        "-^00b0": Array<string>
        "": Array<string>
        _: Array<string>
      } & {
        [x: string]: {
          c: Array<string>
          "0c": Array<string>
          "00c": Array<string>
          "-00c": Array<string>
          "00c0": Array<string>
          "--00c0": Array<string>
          "-^00c0": Array<string>
        }
      }
      function deepClone(prev: Type) {
        return {
          b: prev.b.slice(),
          "0b": prev["0b"].slice(),
          "00b": prev["00b"].slice(),
          "-00b": prev["-00b"].slice(),
          "00b0": prev["00b0"].slice(),
          "--00b0": prev["--00b0"].slice(),
          "-^00b0": prev["-^00b0"].slice(),
          "": prev[""].slice(),
          _: prev._.slice(),
          ...Object.entries(prev).reduce((acc, [key, value]) => {
            if (
              key === "b" ||
              key === "0b" ||
              key === "00b" ||
              key === "-00b" ||
              key === "00b0" ||
              key === "--00b0" ||
              key === "-^00b0" ||
              key === "" ||
              key === "_"
            )
              return acc
            acc[key] = {
              c: value.c.slice(),
              "0c": value["0c"].slice(),
              "00c": value["00c"].slice(),
              "-00c": value["-00c"].slice(),
              "00c0": value["00c0"].slice(),
              "--00c0": value["--00c0"].slice(),
              "-^00c0": value["-^00c0"].slice(),
            }
            return acc
          }, Object.create(null)),
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.intersection', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.intersection(
          z.object({
            abc: z.string()
          }),
          z.object({
            def: z.string()
          })
        ), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string } & { def: string }
      function deepClone(prev: Type) {
        return {
          ...{
            abc: prev.abc,
          },
          ...{
            def: prev.def,
          },
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.intersection(
          z.object({
            abc: z.string(),
            def: z.object({
              ghi: z.string(),
              jkl: z.string()
            })
          }),
          z.object({
            mno: z.string(),
            pqr: z.object({
              stu: z.string(),
              vwx: z.string(),
            })
          })
        ), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string; def: { ghi: string; jkl: string } } & {
        mno: string
        pqr: { stu: string; vwx: string }
      }
      function deepClone(prev: Type) {
        return {
          ...{
            abc: prev.abc,
            def: {
              ghi: prev.def.ghi,
              jkl: prev.def.jkl,
            },
          },
          ...{
            mno: prev.mno,
            pqr: {
              stu: prev.pqr.stu,
              vwx: prev.pqr.vwx,
            },
          },
        }
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.optional(
          z.intersection(
            z.object({
              a: z.string()
            }),
            z.object({
              b: z.string()
            })
          )
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = undefined | ({ a: string } & { b: string })
      function deepClone(prev: Type) {
        return prev === undefined
          ? prev
          : {
              ...{
                a: prev.a,
              },
              ...{
                b: prev.b,
              },
            }
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.set', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.set(z.number()),
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Set<number>) {
        return new Set(prev)
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.set(
          z.object({
            street1: z.string(),
            street2: z.optional(z.string()),
            city: z.string(),
          })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Set<{ street1: string; street2?: string; city: string }>
      function deepClone(prev: Type) {
        return new Set(
          Array.from(prev).map((value) => ({
            street1: value.street1,
            ...(value.street2 !== undefined && { street2: value.street2 }),
            city: value.city,
          })),
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone.writeable❳: z.map', () => {
    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.map(z.number(), z.unknown()),
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Map<number, unknown>) {
        return new Map([...prev].map(([key, value]) => [key, value]))
      }
      "
    `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.map(
          z.object({
            street1: z.string(),
            street2: z.optional(z.string()),
            city: z.string(),
          }),
          z.string()
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Map<{ street1: string; street2?: string; city: string }, string>
      function deepClone(prev: Type) {
        return new Map(
          [...prev].map(([key, value]) => [
            {
              street1: key.street1,
              ...(key.street2 !== undefined && { street2: key.street2 }),
              city: key.city,
            },
            value,
          ]),
        )
      }
      "
    `)
  })

  vi.test.only('〖⛳️〗› ❲zx.deepClone.writeable❳: z.union', () => {
    // vi.expect.soft(format(
    //   zx.deepClone.writeable(
    //     z.union([
    //       z.object({
    //         tag: z.literal('A'),
    //         onA: z.string(),
    //       }),
    //       z.object({
    //         tag: z.literal('B'),
    //         onB: z.string(),
    //       }),
    //     ])
    //   )
    // )).toMatchInlineSnapshot
    //   (`
    //   "function deepClone(
    //     prev: { tag: "A"; onA: string } | { tag: "B"; onB: string },
    //   ) {
    //     return prev.tag === "A"
    //       ? {
    //           tag: prev.tag,
    //           onA: prev.onA,
    //         }
    //       : {
    //           tag: prev.tag,
    //           onB: prev.onB,
    //         }
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.deepClone.writeable(
    //     z.union([
    //       z.number(),
    //       z.object({
    //         street1: z.string(),
    //         street2: z.optional(z.string()),
    //         city: z.string()
    //       })
    //     ]),
    //     { typeName: 'Type' }
    //   )
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type = number | { street1: string; street2?: string; city: string }
    //   function deepClone(prev: Type) {
    //     return typeof prev === "number"
    //       ? prev
    //       : {
    //           street1: prev.street1,
    //           ...(prev.street2 !== undefined && { street2: prev.street2 }),
    //           city: prev.city,
    //         }
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.deepClone.writeable(
    //     z.union([
    //       z.object({ tag: z.literal('ABC'), abc: z.number() }),
    //       z.object({ tag: z.literal('DEF'), def: z.bigint() })
    //     ]),
    //     { typeName: 'Type' }
    //   )
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: bigint }
    //   function deepClone(prev: Type) {
    //     return prev.tag === "ABC"
    //       ? {
    //           tag: prev.tag,
    //           abc: prev.abc,
    //         }
    //       : {
    //           tag: prev.tag,
    //           def: prev.def,
    //         }
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.deepClone.writeable(
    //     z.union([
    //       z.object({ tag: z.literal('NON_DISCRIMINANT'), abc: z.number() }),
    //       z.object({ tag: z.literal('NON_DISCRIMINANT'), def: z.bigint() })
    //     ]),
    //     { typeName: 'Type' }
    //   )
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type =
    //     | { tag: "NON_DISCRIMINANT"; abc: number }
    //     | { tag: "NON_DISCRIMINANT"; def: bigint }
    //   function deepClone(prev: Type) {
    //     function check_0(value) {
    //       return (
    //         !!value &&
    //         typeof value === "object" &&
    //         value.tag === "NON_DISCRIMINANT" &&
    //         Number.isFinite(value.abc)
    //       )
    //     }
    //     return check_0(prev)
    //       ? {
    //           tag: prev.tag,
    //           abc: prev.abc,
    //         }
    //       : {
    //           tag: prev.tag,
    //           def: prev.def,
    //         }
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.deepClone.writeable(
    //     z.union([
    //       z.object({
    //         tag1: z.literal('ABC'),
    //         abc: z.union([
    //           z.object({
    //             tag2: z.literal('ABC_JKL'),
    //             jkl: z.union([
    //               z.object({
    //                 tag3: z.literal('ABC_JKL_ONE'),
    //               }),
    //               z.object({
    //                 tag3: z.literal('ABC_JKL_TWO'),
    //               }),
    //             ])
    //           }),
    //           z.object({
    //             tag2: z.literal('ABC_MNO'),
    //             mno: z.union([
    //               z.object({
    //                 tag3: z.literal('ABC_MNO_ONE'),
    //               }),
    //               z.object({
    //                 tag3: z.literal('ABC_MNO_TWO'),
    //               }),
    //             ])
    //           }),
    //         ])
    //       }),
    //       z.object({
    //         tag1: z.literal('DEF'),
    //         def: z.union([
    //           z.object({
    //             tag2: z.literal('DEF_PQR'),
    //             pqr: z.union([
    //               z.object({
    //                 tag3: z.literal('DEF_PQR_ONE'),
    //               }),
    //               z.object({
    //                 tag3: z.literal('DEF_PQR_TWO'),
    //               }),
    //             ])
    //           }),
    //           z.object({
    //             tag2: z.literal('DEF_STU'),
    //             stu: z.union([
    //               z.object({
    //                 tag3: z.literal('DEF_STU_ONE'),
    //               }),
    //               z.object({
    //                 tag3: z.literal('DEF_STU_TWO'),
    //               }),
    //             ])
    //           }),
    //         ])
    //       }),
    //     ]),
    //     { typeName: 'Type' }
    //   ),
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type =
    //     | {
    //         tag1: "ABC"
    //         abc:
    //           | {
    //               tag2: "ABC_JKL"
    //               jkl: { tag3: "ABC_JKL_ONE" } | { tag3: "ABC_JKL_TWO" }
    //             }
    //           | {
    //               tag2: "ABC_MNO"
    //               mno: { tag3: "ABC_MNO_ONE" } | { tag3: "ABC_MNO_TWO" }
    //             }
    //       }
    //     | {
    //         tag1: "DEF"
    //         def:
    //           | {
    //               tag2: "DEF_PQR"
    //               pqr: { tag3: "DEF_PQR_ONE" } | { tag3: "DEF_PQR_TWO" }
    //             }
    //           | {
    //               tag2: "DEF_STU"
    //               stu: { tag3: "DEF_STU_ONE" } | { tag3: "DEF_STU_TWO" }
    //             }
    //       }
    //   function deepClone(prev: Type) {
    //     return prev.tag1 === "ABC"
    //       ? {
    //           tag1: prev.tag1,
    //           abc:
    //             prev.abc.tag2 === "ABC_JKL"
    //               ? {
    //                   tag2: prev.abc.tag2,
    //                   jkl:
    //                     prev.abc.jkl.tag3 === "ABC_JKL_ONE"
    //                       ? {
    //                           tag3: prev.abc.jkl.tag3,
    //                         }
    //                       : {
    //                           tag3: prev.abc.jkl.tag3,
    //                         },
    //                 }
    //               : {
    //                   tag2: prev.abc.tag2,
    //                   mno:
    //                     prev.abc.mno.tag3 === "ABC_MNO_ONE"
    //                       ? {
    //                           tag3: prev.abc.mno.tag3,
    //                         }
    //                       : {
    //                           tag3: prev.abc.mno.tag3,
    //                         },
    //                 },
    //         }
    //       : {
    //           tag1: prev.tag1,
    //           def:
    //             prev.def.tag2 === "DEF_PQR"
    //               ? {
    //                   tag2: prev.def.tag2,
    //                   pqr:
    //                     prev.def.pqr.tag3 === "DEF_PQR_ONE"
    //                       ? {
    //                           tag3: prev.def.pqr.tag3,
    //                         }
    //                       : {
    //                           tag3: prev.def.pqr.tag3,
    //                         },
    //                 }
    //               : {
    //                   tag2: prev.def.tag2,
    //                   stu:
    //                     prev.def.stu.tag3 === "DEF_STU_ONE"
    //                       ? {
    //                           tag3: prev.def.stu.tag3,
    //                         }
    //                       : {
    //                           tag3: prev.def.stu.tag3,
    //                         },
    //                 },
    //         }
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.deepClone.writeable(
    //     z.union([
    //       z.object({
    //         tag: z.literal('A')
    //       }),
    //       z.object({
    //         tag: z.literal('B')
    //       }),
    //       z.object({
    //         tag: z.array(z.string())
    //       })
    //     ]),
    //     { typeName: 'Type' }
    //   )
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type = { tag: "A" } | { tag: "B" } | { tag: Array<string> }
    //   function deepClone(prev: Type) {
    //     function check_0(value) {
    //       return !!value && typeof value === "object" && value.tag === "A"
    //     }
    //     function check_1(value) {
    //       return !!value && typeof value === "object" && value.tag === "B"
    //     }
    //     return check_0(prev)
    //       ? {
    //           tag: prev.tag,
    //         }
    //       : check_1(prev)
    //         ? {
    //             tag: prev.tag,
    //           }
    //         : {
    //             tag: prev.tag.slice(),
    //           }
    //   }
    //   "
    // `)

    vi.expect.soft(format(
      zx.deepClone.writeable(
        z.union([
          z.union([
            z.object({ abc: z.string() }),
            z.object({ def: z.string() })
          ]),
          z.union([
            z.object({ ghi: z.string() }),
            z.object({ jkl: z.string() })
          ])
        ]), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | ({ abc: string } | { def: string })
        | ({ ghi: string } | { jkl: string })
      function deepClone(prev: Type) {
        function check_0(value) {
          return !!value && typeof value === "object" && typeof value.abc === "string"
        }
        function check_2(value) {
          return !!value && typeof value === "object" && typeof value.ghi === "string"
        }
        function check_4(value) {
          return (
            (!!value && typeof value === "object" && typeof value.abc === "string") ||
            (!!value && typeof value === "object" && typeof value.def === "string")
          )
        }
        return check_4(prev)
          ? check_0(prev)
            ? {
                abc: prev.abc,
              }
            : {
                def: prev.def,
              }
          : check_2(prev)
            ? {
                ghi: prev.ghi,
              }
            : {
                jkl: prev.jkl,
              }
      }
      "
    `)

  })

})


vi.describe.skip('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.deepClone.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.deepClone❳: z.optional', () => {
    const clone_01 = zx.deepClone(z.optional(z.number()))
    vi.expect.soft(clone_01(0)).to.deep.equal(0)
    vi.expect.soft(clone_01(undefined)).to.deep.equal(undefined)

    const clone_02 = zx.deepClone(z.object({ abc: z.optional(z.number()) }))
    vi.expect.soft(clone_02({})).to.deep.equal({})
    vi.expect.soft(clone_02({ abc: 0 })).to.deep.equal({ abc: 0 })
  })

  vi.test('〖⛳️〗› ❲zx.deepClone❳: z.nullable', () => {
    const clone_01 = zx.deepClone(z.nullable(z.number()))
    vi.expect.soft(clone_01(0)).to.deep.equal(0)
    vi.expect.soft(clone_01(null)).to.deep.equal(null)

    const clone_02 = zx.deepClone(z.object({ abc: z.nullable(z.number()) }))
    vi.expect.soft(clone_02({ abc: null })).to.deep.equal({ abc: null })
    vi.expect.soft(clone_02({ abc: 0 })).to.deep.equal({ abc: 0 })
  })

  vi.test('〖⛳️〗› ❲zx.deepClone❳: z.array', () => {
    const clone_01 = zx.deepClone(
      z.array(
        z.object({
          firstName: z.string(),
          lastName: z.optional(z.string()),
          address: z.object({
            street1: z.string(),
            street2: z.optional(z.string()),
            city: z.string(),
          })
        })
      )
    )

    vi.expect.soft(clone_01([])).to.deep.equal([])
    vi.expect.soft(clone_01([
      { firstName: 'Peter', lastName: 'Venkman', address: { street1: '123 Main St', street2: 'Unit B', city: 'Brooklyn' } },
      { firstName: 'Ray', lastName: 'Stantz', address: { street1: '456 2nd St', city: 'Queens' } },
      { firstName: 'Egon', lastName: 'Spengler', address: { street1: '789 Cesar Chavez', city: 'Boston' } },
    ])).toMatchInlineSnapshot
      (`
      [
        {
          "address": {
            "city": "Brooklyn",
            "street1": "123 Main St",
            "street2": "Unit B",
          },
          "firstName": "Peter",
          "lastName": "Venkman",
        },
        {
          "address": {
            "city": "Queens",
            "street1": "456 2nd St",
          },
          "firstName": "Ray",
          "lastName": "Stantz",
        },
        {
          "address": {
            "city": "Boston",
            "street1": "789 Cesar Chavez",
          },
          "firstName": "Egon",
          "lastName": "Spengler",
        },
      ]
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone❳: z.tuple', () => {
    const clone_01 = zx.deepClone(
      z.tuple([
        z.number(),
        z.tuple([
          z.object({
            a: z.boolean()
          })
        ])
      ])
    )

    vi.expect.soft(clone_01(
      [1, [{ a: false }]]
    )).toMatchInlineSnapshot
      (`
      [
        1,
        [
          {
            "a": false,
          },
        ],
      ]
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone❳: z.tuple w/ rest', () => {
    const clone_01 = zx.deepClone(
      z.tuple(
        [z.boolean(), z.string(), z.date()],
        z.array(z.number())
      )
    )

    vi.expect.soft(clone_01(
      [false, '', new Date(0)]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        1970-01-01T00:00:00.000Z,
      ]
    `)

    vi.expect.soft(clone_01(
      [false, '', new Date(0), []]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        1970-01-01T00:00:00.000Z,
        [],
      ]
    `)

    vi.expect.soft(clone_01(
      [false, '', new Date(0), [1]]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        1970-01-01T00:00:00.000Z,
        [
          1,
        ],
      ]
    `)

    vi.expect.soft(clone_01(
      [false, '', new Date(0), [1, 2]]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        1970-01-01T00:00:00.000Z,
        [
          1,
          2,
        ],
      ]
    `)

    const clone_02 = zx.deepClone(
      z.tuple([
        z.tuple(
          [z.boolean()],
          z.boolean())
      ],
        z.boolean()
      )
    )

    vi.expect.soft(clone_02(
      [[false]]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
        ],
      ]
    `)

    vi.expect.soft(clone_02(
      [[false], false]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
        ],
        false,
      ]
    `)

    vi.expect.soft(clone_02(
      [[false, true]]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
          true,
        ],
      ]
    `)

    vi.expect.soft(clone_02(
      [[false, true], false]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
          true,
        ],
        false,
      ]
    `)

    vi.expect.soft(clone_02(
      [[false, true, true], false, false]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
          true,
          true,
        ],
        false,
        false,
      ]
    `)

    const clone_03 = zx.deepClone(
      z.tuple(
        [
          z.object({
            a: z.tuple(
              [
                z.object({
                  b: z.tuple(
                    [
                      z.object({
                        c: z.tuple(
                          [
                            z.object({
                              d: z.string(),
                            })
                          ],
                          z.object({
                            E: z.tuple(
                              [
                                z.string(),
                              ], z.object({
                                F: z.string(),
                              })
                            )
                          })
                        ),
                      })
                    ],
                    z.object({
                      G: z.string()
                    })
                  )
                })
              ], z.object({
                H: z.string()
              })
            )
          })
        ],
        z.object({
          I: z.tuple([z.string()], z.object({
            J: z.string(),
          }))
        })
      )
    )

    vi.expect.soft(clone_03(
      [{ a: [{ b: [{ c: [{ d: 'hey' }] }] }] }]
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    `)

    vi.expect.soft(clone_03(
      [{ a: [{ b: [{ c: [{ d: 'hey' }, { E: ['hey'] }] }] }] }]
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                    {
                      "E": [
                        "hey",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    `)

    vi.expect.soft(clone_03(
      [{ a: [{ b: [{ c: [{ d: 'hey' }, { E: ['EE', { F: 'FF' }] }] }] }] }]
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    `)

    vi.expect.soft(clone_03(
      [
        {
          a: [
            {
              b: [
                {
                  c: [
                    {
                      d: 'hey'
                    },
                    {
                      E: [
                        'EE',
                        { F: 'FF' },
                      ]
                    },
                    {
                      E: [
                        'EE',
                        { F: 'FF' },
                      ]
                    }
                  ]
                },
                { G: 'GG' },
              ]
            },
            { H: 'HH' },
          ]
        },
        {
          I: [
            'I0',
            { J: 'JJ' },
          ]
        }
      ]
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                      ],
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                      ],
                    },
                  ],
                },
                {
                  "G": "GG",
                },
              ],
            },
            {
              "H": "HH",
            },
          ],
        },
        {
          "I": [
            "I0",
            {
              "J": "JJ",
            },
          ],
        },
      ]
    `)

    vi.expect.soft(clone_03(
      [
        {
          a: [
            {
              b: [
                {
                  c: [
                    {
                      d: 'hey'
                    },
                    {
                      E: [
                        'EE',
                        { F: 'FF' },
                        { F: 'FF' },
                      ]
                    },
                    {
                      E: [
                        'EE',
                        { F: 'FF' },
                        { F: 'FFF' },
                        { F: 'FFFF' },
                      ]
                    }
                  ]
                },
                { G: 'GG' },
                { G: 'GGG' },
              ]
            },
            { H: 'HH' },
            { H: 'HHH' },
          ]
        },
        {
          I: [
            'I0',
            { J: 'JJ' },
            { J: 'JJJ' },
          ]
        }
      ]
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                        {
                          "F": "FF",
                        },
                      ],
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                        {
                          "F": "FFF",
                        },
                        {
                          "F": "FFFF",
                        },
                      ],
                    },
                  ],
                },
                {
                  "G": "GG",
                },
                {
                  "G": "GGG",
                },
              ],
            },
            {
              "H": "HH",
            },
            {
              "H": "HHH",
            },
          ],
        },
        {
          "I": [
            "I0",
            {
              "J": "JJ",
            },
            {
              "J": "JJJ",
            },
          ],
        },
      ]
    `)

  })

  vi.test('〖⛳️〗› ❲zx.deepClone❳: z.object', () => {
    const clone_01 = zx.deepClone(z.object({}))
    vi.expect.soft(clone_01({})).toMatchInlineSnapshot(`{}`)

    const clone_02 = zx.deepClone(
      z.object({
        a: z.object({
          b: z.string(),
          c: z.string(),
        }),
        d: z.optional(z.string()),
        e: z.object({
          f: z.string(),
          g: z.optional(
            z.object({
              h: z.string(),
              i: z.string(),
            })
          )
        })
      })
    )

    vi.expect.soft(clone_02(
      {
        a: {
          b: 'B',
          c: 'C',
        },
        d: 'D',
        e: {
          f: 'F',
          g: {
            h: 'H',
            i: 'I',
          }
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {
          "b": "B",
          "c": "C",
        },
        "d": "D",
        "e": {
          "f": "F",
          "g": {
            "h": "H",
            "i": "I",
          },
        },
      }
    `)

    vi.expect.soft(clone_02(
      {
        a: {
          b: 'B',
          c: 'C',
        },
        e: {
          f: 'F',
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {
          "b": "B",
          "c": "C",
        },
        "e": {
          "f": "F",
        },
      }
    `)

    const clone_03 = zx.deepClone(
      z.object({
        a: z.record(z.string(), z.string()),
        b: z.record(
          z.string(),
          z.object({
            c: z.object({
              d: z.string(),
              e: z.record(
                z.string(),
                z.array(z.string()),
              )
            })
          })
        )
      })
    )

    vi.expect.soft(clone_03(
      {
        a: {},
        b: {}
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {},
        "b": {},
      }
    `)

    vi.expect.soft(clone_03(
      {
        a: {
          aa: 'AA',
          ab: 'AB',
        },
        b: {
          bb: {
            c: {
              d: 'D',
              e: {}
            }
          }
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {
          "aa": "AA",
          "ab": "AB",
        },
        "b": {
          "bb": {
            "c": {
              "d": "D",
              "e": {},
            },
          },
        },
      }
    `)

    vi.expect.soft(clone_03(
      {
        a: {
          aa: 'AA',
          ab: 'AB',
        },
        b: {
          bb: {
            c: {
              d: 'D',
              e: {
                ee: ['E1', 'E2'],
                ff: [],
                gg: ['G']
              }
            }
          }
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {
          "aa": "AA",
          "ab": "AB",
        },
        "b": {
          "bb": {
            "c": {
              "d": "D",
              "e": {
                "ee": [
                  "E1",
                  "E2",
                ],
                "ff": [],
                "gg": [
                  "G",
                ],
              },
            },
          },
        },
      }
    `)

    const clone_04 = zx.deepClone(
      z.object({
        b: z.array(
          z.object({
            c: z.array(
              z.object({
                d: z.string()
              })
            ),
          })
        )
      })
    )

    vi.expect.soft(clone_04(
      {
        b: []
      }
    )).toMatchInlineSnapshot
      (`
      {
        "b": [],
      }
    `)

    vi.expect.soft(clone_04(
      {
        b: [
          {
            c: []
          }
        ]
      }
    )).toMatchInlineSnapshot
      (`
      {
        "b": [
          {
            "c": [],
          },
        ],
      }
    `)

    vi.expect.soft(clone_04(
      {
        b: [
          {
            c: [
              {
                d: ''
              }
            ]
          }
        ]
      }
    )).toMatchInlineSnapshot
      (`
      {
        "b": [
          {
            "c": [
              {
                "d": "",
              },
            ],
          },
        ],
      }
    `)

    vi.expect.soft(clone_04(
      {
        b: [
          {
            c: [
              {
                d: 'D1'
              },
              {
                d: 'D2'
              },
            ]
          },
          {
            c: [
              {
                d: 'D3'
              },
              {
                d: 'D4'
              }
            ]
          }
        ]
      }
    )).toMatchInlineSnapshot
      (`
      {
        "b": [
          {
            "c": [
              {
                "d": "D1",
              },
              {
                "d": "D2",
              },
            ],
          },
          {
            "c": [
              {
                "d": "D3",
              },
              {
                "d": "D4",
              },
            ],
          },
        ],
      }
    `)


    const clone_05 = zx.deepClone(
      z.object({
        b: z.array(z.string()),
        '0b': z.array(z.string()),
        '00b': z.array(z.string()),
        '-00b': z.array(z.string()),
        '00b0': z.array(z.string()),
        '--00b0': z.array(z.string()),
        '-^00b0': z.array(z.string()),
        '': z.array(z.string()),
        '_': z.array(z.string()),
      })
    )

    vi.expect.soft(clone_05(
      {
        b: [],
        '0b': [],
        '00b': [],
        '-00b': [],
        '00b0': [],
        '--00b0': [],
        '-^00b0': [],
        '': [],
        '_': [],
      }
    )).toMatchInlineSnapshot
      (`
      {
        "": [],
        "--00b0": [],
        "-00b": [],
        "-^00b0": [],
        "00b": [],
        "00b0": [],
        "0b": [],
        "_": [],
        "b": [],
      }
    `)

    vi.expect.soft(clone_05(
      {
        b: [
          'B_1',
          'B_2',
        ],
        '0b': [
          '0B_1',
          '0B_2',
        ],
        '00b': [
          '00B_1',
          '00B_2',
        ],
        '-00b': [
          '-00B_1',
          '-00B_2',
        ],
        '00b0': [
          '00B0_1',
          '00B0_2',
        ],
        '--00b0': [
          '--00B0_1',
          '--00B0_2',
        ],
        '-^00b0': [
          '-^00B0_1',
          '-^00B0_2',
        ],
        '': [
          '_1',
          '_2',
        ],
        '_': [
          '__1',
          '__2',
        ],
      }
    )).toMatchInlineSnapshot
      (`
      {
        "": [
          "_1",
          "_2",
        ],
        "--00b0": [
          "--00B0_1",
          "--00B0_2",
        ],
        "-00b": [
          "-00B_1",
          "-00B_2",
        ],
        "-^00b0": [
          "-^00B0_1",
          "-^00B0_2",
        ],
        "00b": [
          "00B_1",
          "00B_2",
        ],
        "00b0": [
          "00B0_1",
          "00B0_2",
        ],
        "0b": [
          "0B_1",
          "0B_2",
        ],
        "_": [
          "__1",
          "__2",
        ],
        "b": [
          "B_1",
          "B_2",
        ],
      }
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone❳: z.object w/ catchall', () => {
    const clone_01 = zx.deepClone(z.object({}).catchall(z.string()))
    vi.expect.soft(clone_01({})).toMatchInlineSnapshot(`{}`)
    vi.expect.soft(clone_01({ abc: '123', def: '456 ' })).toMatchInlineSnapshot(`
      {
        "abc": "123",
        "def": "456 ",
      }
    `)

    const clone_02 = zx.deepClone(
      z.object({
        abc: z.object({
          def: z.string(),
          ghi: z.string()
        }),
      }).catchall(z.record(z.string(), z.string())
      )
    )

    vi.expect.soft(
      clone_02({
        abc: {
          def: '#/abc.def',
          ghi: '#/abc.ghi',
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "abc": {
          "def": "#/abc.def",
          "ghi": "#/abc.ghi",
        },
      }
    `)

    vi.expect.soft(
      clone_02({
        abc: {
          def: '#/abc.def',
          ghi: '#/abc.ghi',
        },
        X: {
          Y: '#/X/Y',
          Z: '#/X/Z',
        },
      })
    ).toMatchInlineSnapshot
      (`
      {
        "X": {
          "Y": "#/X/Y",
          "Z": "#/X/Z",
        },
        "abc": {
          "def": "#/abc.def",
          "ghi": "#/abc.ghi",
        },
      }
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone❳: z.intersection', () => {
    const clone_01 = zx.deepClone(
      z.intersection(
        z.object({
          abc: z.string()
        }),
        z.object({
          def: z.string()
        })
      )
    )

    vi.expect.soft(clone_01(
      {
        abc: 'ABC',
        def: 'DEF',
      }
    )).toMatchInlineSnapshot
      (`
      {
        "abc": "ABC",
        "def": "DEF",
      }
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepClone❳: z.union', () => {
    const clone_01 = zx.deepClone(
      z.union([
        z.number(),
        z.object({
          street1: z.string(),
          street2: z.optional(z.string()),
          city: z.string()
        })
      ])
    )

    vi.expect.soft(clone_01(0)).toMatchInlineSnapshot(`0`)
    vi.expect.soft(clone_01(-0)).toMatchInlineSnapshot(`-0`)

    vi.expect.soft(clone_01(
      {
        street1: '221B Baker St',
        city: 'London'
      })
    ).toMatchInlineSnapshot
      (`
      {
        "city": "London",
        "street1": "221B Baker St",
      }
    `)

    vi.expect.soft(clone_01(
      {
        street1: '221 Baker St',
        street2: '#B',
        city: 'London'
      })
    ).toMatchInlineSnapshot
      (`
      {
        "city": "London",
        "street1": "221 Baker St",
        "street2": "#B",
      }
    `)

    const clone_02 = zx.deepClone(
      z.union([
        z.object({
          yea: z.literal('YAY'),
          onYea: z.union([
            z.number(),
            z.array(z.string())
          ]),
        }),
        z.object({
          boo: z.literal('NOO'),
          onBoo: z.union([
            z.object({
              tag: z.boolean(),
              opt: z.optional(z.string()),
            }),
            z.record(z.string(), z.string())
          ]),
        }),
      ])
    )

    vi.expect.soft(clone_02(
      {
        yea: 'YAY',
        onYea: 1
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onYea": 1,
        "yea": "YAY",
      }
    `)

    vi.expect.soft(clone_02(
      {
        yea: 'YAY',
        onYea: []
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onYea": [],
        "yea": "YAY",
      }
    `)

    vi.expect.soft(clone_02(
      {
        onYea: [
          'Y1',
          'Y2',
          'Y3',
        ],
        yea: 'YAY',
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onYea": [
          "Y1",
          "Y2",
          "Y3",
        ],
        "yea": "YAY",
      }
    `)

    vi.expect.soft(clone_02(
      {
        boo: 'NOO',
        onBoo: {},
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {},
      }
    `)

    vi.expect.soft(clone_02(
      {
        boo: 'NOO',
        onBoo: {
          tag: false
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {
          "tag": false,
        },
      }
    `)

    vi.expect.soft(clone_02(
      {
        boo: 'NOO',
        onBoo: {
          opt: 'sup',
          tag: false,
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {
          "opt": "sup",
          "tag": false,
        },
      }
    `)

    vi.expect.soft(clone_02(
      {
        boo: 'NOO',
        onBoo: {
          opt: 'sup',
          tag: false,
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {
          "opt": "sup",
          "tag": false,
        },
      }
    `)

    vi.expect.soft(clone_02(
      {
        boo: 'NOO',
        onBoo: {}
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {},
      }
    `)

    vi.expect.soft(clone_02(
      {
        boo: 'NOO',
        onBoo: {
          X: 'X',
          Y: 'Y',
          Z: 'Z',
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {
          "X": "X",
          "Y": "Y",
          "Z": "Z",
        },
      }
    `)

    const clone_03 = zx.deepClone(
      z.union([
        z.object({
          tag: z.literal('A'),
          onA: z.string(),
        }),
        z.object({
          tag: z.literal('B'),
          onB: z.string(),
        }),
      ])
    )

    vi.expect.soft(clone_03(
      {
        onA: 'HEYY',
        tag: 'A',
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onA": "HEYY",
        "tag": "A",
      }
    `)

    vi.expect.soft(clone_03(
      {
        onB: 'HEYY',
        tag: 'B',
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onB": "HEYY",
        "tag": "B",
      }
    `)

  })
})
