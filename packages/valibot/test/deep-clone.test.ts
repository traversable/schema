import * as vi from 'vitest'
import prettier from '@prettier/sync'
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: vx.deepClone.writeable', () => {
  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.never', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.never()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.any', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.any()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: any) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.unknown', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.unknown()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: unknown) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.void', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.void()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: void) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.undefined', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.undefined()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.null', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.null()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.boolean', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.boolean()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: boolean) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.symbol', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.symbol()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: symbol) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.nan', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.pipe(
          v.number(),
          v.integer(),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.pipe(v.number(), v.integer())', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.pipe(
          v.number(),
          v.integer(),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.bigint', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.bigint()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: bigint) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.number', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.number()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.string', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.string()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: string) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.picklist', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.picklist([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.picklist(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.picklist(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a" | "b") {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.enum', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.enum({})
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.enum({ A: 'a' })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.enum({ A: 'a', B: 'b' })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a" | "b") {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.literal', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.literal('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        return prev
      }
      "
    `)
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.literal(0)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: 0) {
        return prev
      }
      "
    `)
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.literal(false)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: false) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.date', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.date()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Date) {
        return new Date(prev?.getTime())
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.optional(v.date())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | Date) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.file', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.file()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: File) {
        return new File([prev], prev.name, {
          type: prev.type,
          lastModified: prev.lastModified,
        })
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.blob', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.blob()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Blob) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.lazy', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.lazy(() => v.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.optional', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          a: v.optional(v.undefined())
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { a?: undefined | undefined }) {
        return {
          a: prev.a,
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.array(v.optional(v.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<undefined | number>) {
        return prev.slice()
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.optional(v.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | number) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.optional(v.optional(v.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | number) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          abc: v.optional(v.number())
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { abc?: undefined | number }) {
        return {
          ...(Object.hasOwn(prev, "abc") && { abc: prev.abc }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.set(v.optional(v.boolean()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Set<undefined | boolean>) {
        return new Set(prev)
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.map(
          v.optional(v.boolean()),
          v.optional(v.boolean())
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Map<undefined | boolean, undefined | boolean>) {
        return new Map(prev)
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.set(
          v.optional(
            v.optional(v.boolean())
          )
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Set<undefined | boolean>) {
        return new Set(prev)
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          a: v.optional(v.number()),
          b: v.optional(v.optional(v.number())),
          c: v.optional(
            v.object({
              d: v.optional(v.number()),
              e: v.optional(v.optional(v.number())),
            })
          )
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {
        a?: undefined | number
        b?: undefined | number
        c?: undefined | { d?: undefined | number; e?: undefined | number }
      }) {
        return {
          ...(Object.hasOwn(prev, "a") && { a: prev.a }),
          ...(Object.hasOwn(prev, "b") && { b: prev.b }),
          ...(Object.hasOwn(prev, "c") && {
            c:
              prev.c === undefined
                ? prev.c
                : {
                    ...(Object.hasOwn(prev.c, "d") && { d: prev.c.d }),
                    ...(Object.hasOwn(prev.c, "e") && { e: prev.c.e }),
                  },
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.optional(
          v.object({
            a: v.optional(v.number()),
            b: v.optional(v.optional(v.number())),
            c: v.optional(
              v.object({
                d: v.optional(v.number()),
                e: v.optional(v.optional(v.number())),
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
              a?: undefined | number
              b?: undefined | number
              c?: undefined | { d?: undefined | number; e?: undefined | number }
            },
      ) {
        return prev === undefined
          ? prev
          : {
              ...(Object.hasOwn(prev, "a") && { a: prev.a }),
              ...(Object.hasOwn(prev, "b") && { b: prev.b }),
              ...(Object.hasOwn(prev, "c") && {
                c:
                  prev.c === undefined
                    ? prev.c
                    : {
                        ...(Object.hasOwn(prev.c, "d") && { d: prev.c.d }),
                        ...(Object.hasOwn(prev.c, "e") && { e: prev.c.e }),
                      },
              }),
            }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([v.string(), v.optional(v.string())])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [string, undefined | string]) {
        return [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.optional(v.tuple([v.string(), v.optional(v.string())]))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | [string, undefined | string]) {
        return prev === undefined ? prev : [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([
          v.string(),
          v.optional(v.string()),
          v.optional(
            v.tuple([
              v.string(),
              v.optional(v.string())
            ])
          )]
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(
        prev: [string, undefined | string, undefined | [string, undefined | string]],
      ) {
        return [
          prev[0],
          prev[1],
          prev[2] === undefined ? prev[2] : [prev[2][0], prev[2][1]],
        ]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.optional(v.tuple([v.string(), v.optional(v.string()), v.optional(v.tuple([v.string(), v.optional(v.string())]))])),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | undefined
        | [string, undefined | string, undefined | [string, undefined | string]]
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
      vx.deepClone.writeable(v.record(v.string(), v.optional(v.string())))
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
      vx.deepClone.writeable(v.optional(v.record(v.string(), v.optional(v.string()))))
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
      vx.deepClone.writeable(
        v.object({
          a: v.optional(v.record(v.string(), v.optional(v.string())))
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a?: undefined | Record<string, undefined | string> }
      function deepClone(prev: Type) {
        return {
          ...(Object.hasOwn(prev, "a") && {
            a:
              prev.a === undefined
                ? prev.a
                : Object.entries(prev.a).reduce((acc, [key, value]) => {
                    acc[key] = value
                    return acc
                  }, Object.create(null)),
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          a: v.optional(
            v.record(
              v.string(),
              v.object({
                b: v.optional(v.string())
              })
            )
          )
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a?: undefined | Record<string, { b?: undefined | string }> }
      function deepClone(prev: Type) {
        return {
          ...(Object.hasOwn(prev, "a") && {
            a:
              prev.a === undefined
                ? prev.a
                : Object.entries(prev.a).reduce((acc, [key, value]) => {
                    acc[key] = {
                      ...(Object.hasOwn(value, "b") && { b: value.b }),
                    }
                    return acc
                  }, Object.create(null)),
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          a: v.optional(
            v.record(
              v.string(),
              v.optional(
                v.object({
                  b: v.optional(
                    v.record(
                      v.string(),
                      v.optional(v.object({
                        c: v.optional(v.string())
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
        a?:
          | undefined
          | Record<
              string,
              | undefined
              | {
                  b?:
                    | undefined
                    | Record<string, undefined | { c?: undefined | string }>
                }
            >
      }
      function deepClone(prev: Type) {
        return {
          ...(Object.hasOwn(prev, "a") && {
            a:
              prev.a === undefined
                ? prev.a
                : Object.entries(prev.a).reduce((acc, [key, value]) => {
                    acc[key] =
                      value === undefined
                        ? value
                        : {
                            ...(Object.hasOwn(value, "b") && {
                              b:
                                value.b === undefined
                                  ? value.b
                                  : Object.entries(value.b).reduce(
                                      (acc, [key, value]) => {
                                        acc[key] =
                                          value === undefined
                                            ? value
                                            : {
                                                ...(Object.hasOwn(value, "c") && {
                                                  c: value.c,
                                                }),
                                              }
                                        return acc
                                      },
                                      Object.create(null),
                                    ),
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.exactOptional', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          a: v.exactOptional(v.undefined())
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { a?: undefined | undefined }) {
        return {
          a: prev.a,
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.array(v.exactOptional(v.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<undefined | number>) {
        return prev.slice()
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.exactOptional(v.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | number) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.optional(v.exactOptional(v.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | number) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          abc: v.exactOptional(v.number())
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { abc?: undefined | number }) {
        return {
          ...(Object.hasOwn(prev, "abc") && { abc: prev.abc }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.set(v.exactOptional(v.boolean()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Set<undefined | boolean>) {
        return new Set(prev)
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.map(
          v.exactOptional(v.boolean()),
          v.exactOptional(v.boolean())
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Map<undefined | boolean, undefined | boolean>) {
        return new Map(prev)
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.set(
          v.exactOptional(
            v.exactOptional(v.boolean())
          )
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Set<undefined | boolean>) {
        return new Set(prev)
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          a: v.exactOptional(v.number()),
          b: v.exactOptional(v.optional(v.number())),
          c: v.exactOptional(
            v.object({
              d: v.exactOptional(v.number()),
              e: v.exactOptional(v.optional(v.number())),
            })
          )
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {
        a?: undefined | number
        b?: undefined | number
        c?: undefined | { d?: undefined | number; e?: undefined | number }
      }) {
        return {
          ...(Object.hasOwn(prev, "a") && { a: prev.a }),
          ...(Object.hasOwn(prev, "b") && { b: prev.b }),
          ...(Object.hasOwn(prev, "c") && {
            c: {
              ...(Object.hasOwn(prev.c, "d") && { d: prev.c.d }),
              ...(Object.hasOwn(prev.c, "e") && { e: prev.c.e }),
            },
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.optional(
          v.object({
            a: v.exactOptional(v.number()),
            b: v.exactOptional(v.optional(v.number())),
            c: v.exactOptional(
              v.object({
                d: v.exactOptional(v.number()),
                e: v.exactOptional(v.optional(v.number())),
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
              a?: undefined | number
              b?: undefined | number
              c?: undefined | { d?: undefined | number; e?: undefined | number }
            },
      ) {
        return prev === undefined
          ? prev
          : {
              ...(Object.hasOwn(prev, "a") && { a: prev.a }),
              ...(Object.hasOwn(prev, "b") && { b: prev.b }),
              ...(Object.hasOwn(prev, "c") && {
                c: {
                  ...(Object.hasOwn(prev.c, "d") && { d: prev.c.d }),
                  ...(Object.hasOwn(prev.c, "e") && { e: prev.c.e }),
                },
              }),
            }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([
          v.string(),
          v.exactOptional(v.string()),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [string, undefined | string]) {
        return [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.exactOptional(
          v.tuple([
            v.string(),
            v.exactOptional(v.string()),
          ]))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined | [string, undefined | string]) {
        return prev === undefined ? prev : [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([
          v.string(),
          v.exactOptional(v.string()),
          v.exactOptional(
            v.tuple([
              v.string(),
              v.exactOptional(v.string())
            ])
          )]
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(
        prev: [string, undefined | string, undefined | [string, undefined | string]],
      ) {
        return [
          prev[0],
          prev[1],
          prev[2] === undefined ? prev[2] : [prev[2][0], prev[2][1]],
        ]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.exactOptional(
          v.tuple([
            v.string(),
            v.exactOptional(v.string()),
            v.exactOptional(
              v.tuple([
                v.string(),
                v.exactOptional(v.string()),
              ])
            )
          ])
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | undefined
        | [string, undefined | string, undefined | [string, undefined | string]]
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
      vx.deepClone.writeable(
        v.record(
          v.string(),
          v.exactOptional(v.string())
        )
      )
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
      vx.deepClone.writeable(
        v.exactOptional(
          v.record(
            v.string(),
            v.exactOptional(v.string())
          )
        )
      )
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
      vx.deepClone.writeable(
        v.object({
          a: v.optional(
            v.record(
              v.string(),
              v.exactOptional(v.string())
            )
          )
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a?: undefined | Record<string, undefined | string> }
      function deepClone(prev: Type) {
        return {
          ...(Object.hasOwn(prev, "a") && {
            a:
              prev.a === undefined
                ? prev.a
                : Object.entries(prev.a).reduce((acc, [key, value]) => {
                    acc[key] = value
                    return acc
                  }, Object.create(null)),
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          a: v.exactOptional(
            v.record(
              v.string(),
              v.object({
                b: v.exactOptional(v.string())
              })
            )
          )
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a?: undefined | Record<string, { b?: undefined | string }> }
      function deepClone(prev: Type) {
        return {
          ...(Object.hasOwn(prev, "a") && {
            a: Object.entries(prev.a).reduce((acc, [key, value]) => {
              acc[key] = {
                ...(Object.hasOwn(value, "b") && { b: value.b }),
              }
              return acc
            }, Object.create(null)),
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          a: v.exactOptional(
            v.record(
              v.string(),
              v.exactOptional(
                v.object({
                  b: v.exactOptional(
                    v.record(
                      v.string(),
                      v.exactOptional(
                        v.object({
                          c: v.exactOptional(v.string())
                        })
                      )
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
        a?:
          | undefined
          | Record<
              string,
              | undefined
              | {
                  b?:
                    | undefined
                    | Record<string, undefined | { c?: undefined | string }>
                }
            >
      }
      function deepClone(prev: Type) {
        return {
          ...(Object.hasOwn(prev, "a") && {
            a: Object.entries(prev.a).reduce((acc, [key, value]) => {
              acc[key] =
                value === undefined
                  ? value
                  : {
                      ...(Object.hasOwn(value, "b") && {
                        b: Object.entries(value.b).reduce((acc, [key, value]) => {
                          acc[key] =
                            value === undefined
                              ? value
                              : {
                                  ...(Object.hasOwn(value, "c") && { c: value.c }),
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.nullable', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.nullable(v.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null | number) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          abc: v.nullable(v.number())
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.array', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.array(v.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<number>) {
        return prev.slice()
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.array(v.array(v.number()))
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
      vx.deepClone.writeable(
        v.array(
          v.object({
            c: v.object({
              d: v.string(),
              e: v.array(v.string()),
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
      vx.deepClone.writeable(
        v.array(
          v.object({
            firstName: v.string(),
            lastName: v.exactOptional(v.string()),
            address: v.object({
              street1: v.string(),
              street2: v.exactOptional(v.string()),
              city: v.string(),
            })
          })
        ), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{
        firstName: string
        lastName?: undefined | string
        address: { street1: string; street2?: undefined | string; city: string }
      }>
      function deepClone(prev: Type) {
        return prev.map((value) => {
          return {
            firstName: value.firstName,
            ...(Object.hasOwn(value, "lastName") && { lastName: value.lastName }),
            address: {
              street1: value.address.street1,
              ...(Object.hasOwn(value.address, "street2") && {
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.record', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.record(v.string(), v.record(v.string(), v.string())), {
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
      vx.deepClone.writeable(
        v.object({
          a: v.record(v.string(), v.string()),
          b: v.record(
            v.string(),
            v.object({
              c: v.object({
                d: v.string(),
                e: v.record(
                  v.string(),
                  v.array(v.string()),
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.tuple', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function deepClone(prev: Type) {
        return []
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([
          v.string(),
          v.string(),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function deepClone(prev: Type) {
        return [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([
          v.number(),
          v.tuple([
            v.object({
              a: v.boolean()
            })
          ])
        ])
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
      vx.deepClone.writeable(v.object({
        a: v.tuple([
          v.string(),
          v.string(),
        ]),
        b: v.exactOptional(
          v.tuple([
            v.string(),
            v.exactOptional(
              v.tuple([
                v.string(),
              ])
            )]
          )
        )
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: [string, string]
        b?: undefined | [string, undefined | [string]]
      }
      function deepClone(prev: Type) {
        return {
          a: [prev.a[0], prev.a[1]],
          ...(Object.hasOwn(prev, "b") && {
            b: [prev.b[0], prev.b[1] === undefined ? prev.b[1] : [prev.b[1][0]]],
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([
          v.object({
            A: v.exactOptional(v.boolean())
          }),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: undefined | boolean }]
      function deepClone(prev: Type) {
        return [
          {
            ...(Object.hasOwn(prev[0], "A") && { A: prev[0].A }),
          },
        ]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([
          v.object({
            A: v.exactOptional(
              v.tuple([
                v.object({
                  B: v.exactOptional(v.boolean())
                })
              ])
            )
          })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: undefined | [{ B?: undefined | boolean }] }]
      function deepClone(prev: Type) {
        return [
          {
            ...(Object.hasOwn(prev[0], "A") && {
              A: [
                {
                  ...(Object.hasOwn(prev[0].A[0], "B") && { B: prev[0].A[0].B }),
                },
              ],
            }),
          },
        ]
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.looseTuple', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.looseTuple([]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function deepClone(prev: Type) {
        return []
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.looseTuple([
          v.string(),
          v.string(),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function deepClone(prev: Type) {
        return [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.looseTuple([
          v.number(),
          v.looseTuple([
            v.object({
              a: v.boolean()
            })
          ])
        ])
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
      vx.deepClone.writeable(v.object({
        a: v.looseTuple([
          v.string(),
          v.string(),
        ]),
        b: v.exactOptional(
          v.looseTuple([
            v.string(),
            v.exactOptional(
              v.looseTuple([
                v.string(),
              ])
            )]
          )
        )
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: [string, string]
        b?: undefined | [string, undefined | [string]]
      }
      function deepClone(prev: Type) {
        return {
          a: [prev.a[0], prev.a[1]],
          ...(Object.hasOwn(prev, "b") && {
            b: [prev.b[0], prev.b[1] === undefined ? prev.b[1] : [prev.b[1][0]]],
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.looseTuple([
          v.object({
            A: v.exactOptional(v.boolean())
          }),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: undefined | boolean }]
      function deepClone(prev: Type) {
        return [
          {
            ...(Object.hasOwn(prev[0], "A") && { A: prev[0].A }),
          },
        ]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.looseTuple([
          v.object({
            A: v.exactOptional(
              v.looseTuple([
                v.object({
                  B: v.exactOptional(v.boolean())
                })
              ])
            )
          })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: undefined | [{ B?: undefined | boolean }] }]
      function deepClone(prev: Type) {
        return [
          {
            ...(Object.hasOwn(prev[0], "A") && {
              A: [
                {
                  ...(Object.hasOwn(prev[0].A[0], "B") && { B: prev[0].A[0].B }),
                },
              ],
            }),
          },
        ]
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.strictTuple', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.strictTuple([]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function deepClone(prev: Type) {
        return []
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.strictTuple([
          v.string(),
          v.string(),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function deepClone(prev: Type) {
        return [prev[0], prev[1]]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.strictTuple([
          v.number(),
          v.strictTuple([
            v.object({
              a: v.boolean()
            })
          ])
        ])
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
      vx.deepClone.writeable(v.object({
        a: v.strictTuple([
          v.string(),
          v.string(),
        ]),
        b: v.exactOptional(
          v.strictTuple([
            v.string(),
            v.exactOptional(
              v.strictTuple([
                v.string(),
              ])
            )]
          )
        )
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: [string, string]
        b?: undefined | [string, undefined | [string]]
      }
      function deepClone(prev: Type) {
        return {
          a: [prev.a[0], prev.a[1]],
          ...(Object.hasOwn(prev, "b") && {
            b: [prev.b[0], prev.b[1] === undefined ? prev.b[1] : [prev.b[1][0]]],
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.strictTuple([
          v.object({
            A: v.exactOptional(v.boolean())
          }),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: undefined | boolean }]
      function deepClone(prev: Type) {
        return [
          {
            ...(Object.hasOwn(prev[0], "A") && { A: prev[0].A }),
          },
        ]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.strictTuple([
          v.object({
            A: v.exactOptional(
              v.strictTuple([
                v.object({
                  B: v.exactOptional(v.boolean())
                })
              ])
            )
          })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: undefined | [{ B?: undefined | boolean }] }]
      function deepClone(prev: Type) {
        return [
          {
            ...(Object.hasOwn(prev[0], "A") && {
              A: [
                {
                  ...(Object.hasOwn(prev[0].A[0], "B") && { B: prev[0].A[0].B }),
                },
              ],
            }),
          },
        ]
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.tupleWithRest', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tupleWithRest(
          [
            v.string(),
            v.string(),
          ],
          v.number()
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string, ...number[]]
      function deepClone(prev: Type) {
        return [prev[0], prev[1], ...(prev.slice(2) as Array<number>)]
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tupleWithRest(
          [
            v.boolean(),
            v.string(),
            v.date(),
          ],
          v.array(v.number())
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
      vx.deepClone.writeable(
        v.tupleWithRest(
          [
            v.tupleWithRest(
              [
                v.boolean()
              ],
              v.boolean()
            )
          ],
          v.boolean()
        )
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
      vx.deepClone.writeable(
        v.tupleWithRest(
          [
            v.object({
              a: v.tupleWithRest(
                [
                  v.object({
                    b: v.tupleWithRest(
                      [
                        v.object({
                          c: v.tupleWithRest(
                            [
                              v.object({
                                d: v.string(),
                              })
                            ],
                            v.object({
                              E: v.tupleWithRest(
                                [
                                  v.string(),
                                ],
                                v.object({
                                  F: v.string(),
                                })
                              )
                            })
                          ),
                        })
                      ],
                      v.object({
                        G: v.string()
                      })
                    )
                  })
                ], v.object({
                  G: v.string()
                })
              )
            })
          ],
          v.object({
            H: v.tupleWithRest(
              [
                v.string()
              ],
              v.object({
                I: v.string(),
              })
            )
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.object', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({})
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return {}
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          street1: v.string(),
          street2: v.exactOptional(v.string()),
          city: v.string(),
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: undefined | string; city: string }
      function deepClone(prev: Type) {
        return {
          street1: prev.street1,
          ...(Object.hasOwn(prev, "street2") && { street2: prev.street2 }),
          city: prev.city,
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.object({
          a: v.object({
            b: v.string(),
            c: v.string(),
          }),
          d: v.exactOptional(v.string()),
          e: v.object({
            f: v.string(),
            g: v.exactOptional(
              v.object({
                h: v.string(),
                i: v.string(),
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
        d?: undefined | string
        e: { f: string; g?: undefined | { h: string; i: string } }
      }
      function deepClone(prev: Type) {
        return {
          a: {
            b: prev.a.b,
            c: prev.a.c,
          },
          ...(Object.hasOwn(prev, "d") && { d: prev.d }),
          e: {
            f: prev.e.f,
            ...(Object.hasOwn(prev.e, "g") && {
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
      vx.deepClone.writeable(
        v.object({
          b: v.array(
            v.object({
              c: v.array(
                v.object({
                  d: v.string()
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
      vx.deepClone.writeable(v.object({
        b: v.array(v.string()),
        '0b': v.array(v.string()),
        '00b': v.array(v.string()),
        '-00b': v.array(v.string()),
        '00b0': v.array(v.string()),
        '--00b0': v.array(v.string()),
        '-^00b0': v.array(v.string()),
        '': v.array(v.string()),
        '_': v.array(v.string()),
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.looseObject', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.looseObject({})
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return {}
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.looseObject({
          street1: v.string(),
          street2: v.exactOptional(v.string()),
          city: v.string(),
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: undefined | string; city: string }
      function deepClone(prev: Type) {
        return {
          street1: prev.street1,
          ...(Object.hasOwn(prev, "street2") && { street2: prev.street2 }),
          city: prev.city,
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.looseObject({
          a: v.looseObject({
            b: v.string(),
            c: v.string(),
          }),
          d: v.exactOptional(v.string()),
          e: v.looseObject({
            f: v.string(),
            g: v.exactOptional(
              v.looseObject({
                h: v.string(),
                i: v.string(),
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
        d?: undefined | string
        e: { f: string; g?: undefined | { h: string; i: string } }
      }
      function deepClone(prev: Type) {
        return {
          a: {
            b: prev.a.b,
            c: prev.a.c,
          },
          ...(Object.hasOwn(prev, "d") && { d: prev.d }),
          e: {
            f: prev.e.f,
            ...(Object.hasOwn(prev.e, "g") && {
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
      vx.deepClone.writeable(
        v.looseObject({
          b: v.array(
            v.looseObject({
              c: v.array(
                v.looseObject({
                  d: v.string()
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
      vx.deepClone.writeable(
        v.looseObject({
          b: v.array(v.string()),
          '0b': v.array(v.string()),
          '00b': v.array(v.string()),
          '-00b': v.array(v.string()),
          '00b0': v.array(v.string()),
          '--00b0': v.array(v.string()),
          '-^00b0': v.array(v.string()),
          '': v.array(v.string()),
          '_': v.array(v.string()),
        }),
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.strictObject', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.strictObject({})
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return {}
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.strictObject({
          street1: v.string(),
          street2: v.exactOptional(v.string()),
          city: v.string(),
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: undefined | string; city: string }
      function deepClone(prev: Type) {
        return {
          street1: prev.street1,
          ...(Object.hasOwn(prev, "street2") && { street2: prev.street2 }),
          city: prev.city,
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.strictObject({
          a: v.strictObject({
            b: v.string(),
            c: v.string(),
          }),
          d: v.exactOptional(v.string()),
          e: v.strictObject({
            f: v.string(),
            g: v.exactOptional(
              v.strictObject({
                h: v.string(),
                i: v.string(),
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
        d?: undefined | string
        e: { f: string; g?: undefined | { h: string; i: string } }
      }
      function deepClone(prev: Type) {
        return {
          a: {
            b: prev.a.b,
            c: prev.a.c,
          },
          ...(Object.hasOwn(prev, "d") && { d: prev.d }),
          e: {
            f: prev.e.f,
            ...(Object.hasOwn(prev.e, "g") && {
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
      vx.deepClone.writeable(
        v.strictObject({
          b: v.array(
            v.strictObject({
              c: v.array(
                v.strictObject({
                  d: v.string()
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
      vx.deepClone.writeable(
        v.strictObject({
          b: v.array(v.string()),
          '0b': v.array(v.string()),
          '00b': v.array(v.string()),
          '-00b': v.array(v.string()),
          '00b0': v.array(v.string()),
          '--00b0': v.array(v.string()),
          '-^00b0': v.array(v.string()),
          '': v.array(v.string()),
          '_': v.array(v.string()),
        }),
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.objectWithRest', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.objectWithRest({}, v.string())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, Object.create(null))
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.objectWithRest({
          abc: v.string(),
        }, v.array(v.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { abc: string } & { [x: string]: Array<number> }) {
        return {
          abc: prev.abc,
          ...Object.entries(prev).reduce((acc, [key, value]) => {
            if (key === "abc") return acc
            acc[key] = value.slice()
            return acc
          }, Object.create(null)),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.objectWithRest({
          abc: v.array(v.number()),
          def: v.array(v.string()),
        }, v.string()),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: Array<number>; def: Array<string> } & { [x: string]: string }
      function deepClone(prev: Type) {
        return {
          abc: prev.abc.slice(),
          def: prev.def.slice(),
          ...Object.entries(prev).reduce((acc, [key, value]) => {
            if (key === "abc" || key === "def") return acc
            acc[key] = value
            return acc
          }, Object.create(null)),
        }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.tuple([v.objectWithRest({ InX_5z_F: v.boolean() }, v.boolean())]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ InX_5z_F: boolean } & { [x: string]: boolean }]
      function deepClone(prev: Type) {
        return [
          {
            InX_5z_F: prev[0].InX_5z_F,
            ...Object.entries(prev[0]).reduce((acc, [key, value]) => {
              if (key === "InX_5z_F") return acc
              acc[key] = value
              return acc
            }, Object.create(null)),
          },
        ]
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.intersect', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.intersect([
          v.object({
            abc: v.string()
          }),
          v.object({
            def: v.string()
          })
        ]), {
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
      vx.deepClone.writeable(
        v.intersect([
          v.object({
            abc: v.string(),
            def: v.object({
              ghi: v.string(),
              jkl: v.string()
            })
          }),
          v.object({
            mno: v.string(),
            pqr: v.object({
              stu: v.string(),
              vwx: v.string(),
            })
          })
        ]), {
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
      vx.deepClone.writeable(
        v.optional(
          v.intersect([
            v.object({
              a: v.string()
            }),
            v.object({
              b: v.string()
            })
          ])
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.set', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.set(v.number()),
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Set<number>) {
        return new Set(prev)
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.set(
          v.object({
            street1: v.string(),
            street2: v.exactOptional(v.string()),
            city: v.string(),
          })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Set<{ street1: string; street2?: undefined | string; city: string }>
      function deepClone(prev: Type) {
        return new Set(
          Array.from(prev).map((value) => ({
            street1: value.street1,
            ...(Object.hasOwn(value, "street2") && { street2: value.street2 }),
            city: value.city,
          })),
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.map', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.map(v.number(), v.unknown()),
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Map<number, unknown>) {
        return new Map([...prev].map(([key, value]) => [key, value]))
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.map(
          v.object({
            street1: v.string(),
            street2: v.exactOptional(v.string()),
            city: v.string(),
          }),
          v.string()
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Map<
        { street1: string; street2?: undefined | string; city: string },
        string
      >
      function deepClone(prev: Type) {
        return new Map(
          [...prev].map(([key, value]) => [
            {
              street1: key.street1,
              ...(Object.hasOwn(key, "street2") && { street2: key.street2 }),
              city: key.city,
            },
            value,
          ]),
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.union', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.union([
          v.object({
            tag: v.literal('A'),
            onA: v.string(),
          }),
          v.object({
            tag: v.literal('B'),
            onB: v.string(),
          }),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "A"; onA: string } | { tag: "B"; onB: string }
      function deepClone(prev: Type) {
        return prev.tag === "A"
          ? {
              tag: prev.tag,
              onA: prev.onA,
            }
          : {
              tag: prev.tag,
              onB: prev.onB,
            }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.union([
          v.number(),
          v.object({
            street1: v.string(),
            street2: v.exactOptional(v.string()),
            city: v.string()
          })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | number
        | { street1: string; street2?: undefined | string; city: string }
      function deepClone(prev: Type) {
        return typeof prev === "number"
          ? prev
          : {
              street1: prev.street1,
              ...(Object.hasOwn(prev, "street2") && { street2: prev.street2 }),
              city: prev.city,
            }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.union([
          v.object({ tag: v.literal('ABC'), abc: v.number() }),
          v.object({ tag: v.literal('DEF'), def: v.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: bigint }
      function deepClone(prev: Type) {
        return prev.tag === "ABC"
          ? {
              tag: prev.tag,
              abc: prev.abc,
            }
          : {
              tag: prev.tag,
              def: prev.def,
            }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.union([
          v.object({ tag: v.literal('NON_DISCRIMINANT'), abc: v.number() }),
          v.object({ tag: v.literal('NON_DISCRIMINANT'), def: v.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: "NON_DISCRIMINANT"; abc: number }
        | { tag: "NON_DISCRIMINANT"; def: bigint }
      function deepClone(prev: Type) {
        function check_0(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "NON_DISCRIMINANT" &&
            Number.isFinite(value.abc)
          )
        }
        return check_0(prev)
          ? {
              tag: prev.tag,
              abc: prev.abc,
            }
          : {
              tag: prev.tag,
              def: prev.def,
            }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.union([
          v.object({
            tag1: v.literal('ABC'),
            abc: v.union([
              v.object({
                tag2: v.literal('ABC_JKL'),
                jkl: v.union([
                  v.object({
                    tag3: v.literal('ABC_JKL_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              v.object({
                tag2: v.literal('ABC_MNO'),
                mno: v.union([
                  v.object({
                    tag3: v.literal('ABC_MNO_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          v.object({
            tag1: v.literal('DEF'),
            def: v.union([
              v.object({
                tag2: v.literal('DEF_PQR'),
                pqr: v.union([
                  v.object({
                    tag3: v.literal('DEF_PQR_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              v.object({
                tag2: v.literal('DEF_STU'),
                stu: v.union([
                  v.object({
                    tag3: v.literal('DEF_STU_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('DEF_STU_TWO'),
                  }),
                ])
              }),
            ])
          }),
        ]),
        { typeName: 'Type' }
      ),
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | {
            tag1: "ABC"
            abc:
              | {
                  tag2: "ABC_JKL"
                  jkl: { tag3: "ABC_JKL_ONE" } | { tag3: "ABC_JKL_TWO" }
                }
              | {
                  tag2: "ABC_MNO"
                  mno: { tag3: "ABC_MNO_ONE" } | { tag3: "ABC_MNO_TWO" }
                }
          }
        | {
            tag1: "DEF"
            def:
              | {
                  tag2: "DEF_PQR"
                  pqr: { tag3: "DEF_PQR_ONE" } | { tag3: "DEF_PQR_TWO" }
                }
              | {
                  tag2: "DEF_STU"
                  stu: { tag3: "DEF_STU_ONE" } | { tag3: "DEF_STU_TWO" }
                }
          }
      function deepClone(prev: Type) {
        return prev.tag1 === "ABC"
          ? {
              tag1: prev.tag1,
              abc:
                prev.abc.tag2 === "ABC_JKL"
                  ? {
                      tag2: prev.abc.tag2,
                      jkl:
                        prev.abc.jkl.tag3 === "ABC_JKL_ONE"
                          ? {
                              tag3: prev.abc.jkl.tag3,
                            }
                          : {
                              tag3: prev.abc.jkl.tag3,
                            },
                    }
                  : {
                      tag2: prev.abc.tag2,
                      mno:
                        prev.abc.mno.tag3 === "ABC_MNO_ONE"
                          ? {
                              tag3: prev.abc.mno.tag3,
                            }
                          : {
                              tag3: prev.abc.mno.tag3,
                            },
                    },
            }
          : {
              tag1: prev.tag1,
              def:
                prev.def.tag2 === "DEF_PQR"
                  ? {
                      tag2: prev.def.tag2,
                      pqr:
                        prev.def.pqr.tag3 === "DEF_PQR_ONE"
                          ? {
                              tag3: prev.def.pqr.tag3,
                            }
                          : {
                              tag3: prev.def.pqr.tag3,
                            },
                    }
                  : {
                      tag2: prev.def.tag2,
                      stu:
                        prev.def.stu.tag3 === "DEF_STU_ONE"
                          ? {
                              tag3: prev.def.stu.tag3,
                            }
                          : {
                              tag3: prev.def.stu.tag3,
                            },
                    },
            }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.union([
          v.object({
            tag: v.literal('A')
          }),
          v.object({
            tag: v.literal('B')
          }),
          v.object({
            tag: v.array(v.string())
          })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "A" } | { tag: "B" } | { tag: Array<string> }
      function deepClone(prev: Type) {
        function check_0(value) {
          return !!value && typeof value === "object" && value.tag === "A"
        }
        function check_1(value) {
          return !!value && typeof value === "object" && value.tag === "B"
        }
        return check_0(prev)
          ? {
              tag: prev.tag,
            }
          : check_1(prev)
            ? {
                tag: prev.tag,
              }
            : {
                tag: prev.tag.slice(),
              }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.union([
          v.union([
            v.object({ abc: v.string() }),
            v.object({ def: v.string() })
          ]),
          v.union([
            v.object({ ghi: v.string() }),
            v.object({ jkl: v.string() })
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

  vi.test('〖⛳️〗› ❲vx.deepClone.writeable❳: v.variant', () => {
    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.variant('blah', [])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.variant('tag', [
          v.object({
            tag: v.literal('A'),
            onA: v.string(),
          }),
          v.object({
            tag: v.literal('B'),
            onB: v.string(),
          }),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(
        prev: { tag: "A"; onA: string } | { tag: "B"; onB: string },
      ) {
        return prev.tag === "A"
          ? {
              tag: prev.tag,
              onA: prev.onA,
            }
          : {
              tag: prev.tag,
              onB: prev.onB,
            }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.variant('tag', [
          v.object({ tag: v.literal('ABC'), abc: v.number() }),
          v.object({ tag: v.literal('DEF'), def: v.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: bigint }
      function deepClone(prev: Type) {
        return prev.tag === "ABC"
          ? {
              tag: prev.tag,
              abc: prev.abc,
            }
          : {
              tag: prev.tag,
              def: prev.def,
            }
      }
      "
    `)

    vi.expect.soft(format(
      vx.deepClone.writeable(
        v.variant('tag1', [
          v.object({
            tag1: v.literal('ABC'),
            abc: v.variant('tag2', [
              v.object({
                tag2: v.literal('ABC_JKL'),
                jkl: v.variant('tag3', [
                  v.object({
                    tag3: v.literal('ABC_JKL_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              v.object({
                tag2: v.literal('ABC_MNO'),
                mno: v.variant('tag3', [
                  v.object({
                    tag3: v.literal('ABC_MNO_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          v.object({
            tag1: v.literal('DEF'),
            def: v.variant('tag2', [
              v.object({
                tag2: v.literal('DEF_PQR'),
                pqr: v.variant('tag3', [
                  v.object({
                    tag3: v.literal('DEF_PQR_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              v.object({
                tag2: v.literal('DEF_STU'),
                stu: v.variant('tag3', [
                  v.object({
                    tag3: v.literal('DEF_STU_ONE'),
                  }),
                  v.object({
                    tag3: v.literal('DEF_STU_TWO'),
                  }),
                ])
              }),
            ])
          }),
        ]),
        { typeName: 'Type' }
      ),
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | {
            tag1: "ABC"
            abc:
              | {
                  tag2: "ABC_JKL"
                  jkl: { tag3: "ABC_JKL_ONE" } | { tag3: "ABC_JKL_TWO" }
                }
              | {
                  tag2: "ABC_MNO"
                  mno: { tag3: "ABC_MNO_ONE" } | { tag3: "ABC_MNO_TWO" }
                }
          }
        | {
            tag1: "DEF"
            def:
              | {
                  tag2: "DEF_PQR"
                  pqr: { tag3: "DEF_PQR_ONE" } | { tag3: "DEF_PQR_TWO" }
                }
              | {
                  tag2: "DEF_STU"
                  stu: { tag3: "DEF_STU_ONE" } | { tag3: "DEF_STU_TWO" }
                }
          }
      function deepClone(prev: Type) {
        return prev.tag1 === "ABC"
          ? {
              tag1: prev.tag1,
              abc:
                prev.abc.tag2 === "ABC_JKL"
                  ? {
                      tag2: prev.abc.tag2,
                      jkl:
                        prev.abc.jkl.tag3 === "ABC_JKL_ONE"
                          ? {
                              tag3: prev.abc.jkl.tag3,
                            }
                          : {
                              tag3: prev.abc.jkl.tag3,
                            },
                    }
                  : {
                      tag2: prev.abc.tag2,
                      mno:
                        prev.abc.mno.tag3 === "ABC_MNO_ONE"
                          ? {
                              tag3: prev.abc.mno.tag3,
                            }
                          : {
                              tag3: prev.abc.mno.tag3,
                            },
                    },
            }
          : {
              tag1: prev.tag1,
              def:
                prev.def.tag2 === "DEF_PQR"
                  ? {
                      tag2: prev.def.tag2,
                      pqr:
                        prev.def.pqr.tag3 === "DEF_PQR_ONE"
                          ? {
                              tag3: prev.def.pqr.tag3,
                            }
                          : {
                              tag3: prev.def.pqr.tag3,
                            },
                    }
                  : {
                      tag2: prev.def.tag2,
                      stu:
                        prev.def.stu.tag3 === "DEF_STU_ONE"
                          ? {
                              tag3: prev.def.stu.tag3,
                            }
                          : {
                              tag3: prev.def.stu.tag3,
                            },
                    },
            }
      }
      "
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: vx.deepClone.writeable', () => {
  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.optional', () => {
    const clone_01 = vx.deepClone(v.optional(v.number()))
    vi.expect.soft(clone_01(0)).to.deep.equal(0)
    vi.expect.soft(clone_01(undefined)).to.deep.equal(undefined)

    const clone_02 = vx.deepClone(v.object({ abc: v.optional(v.number()) }))
    vi.expect.soft(clone_02({})).to.deep.equal({})
    vi.expect.soft(clone_02({ abc: 0 })).to.deep.equal({ abc: 0 })
  })

  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.exactOptional', () => {
    const clone_01 = vx.deepClone(v.object({ abc: v.exactOptional(v.number()) }))
    vi.expect.soft(clone_01({})).to.deep.equal({})
    vi.expect.soft(clone_01({ abc: 0 })).to.deep.equal({ abc: 0 })
  })

  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.nullable', () => {
    const clone_01 = vx.deepClone(v.nullable(v.number()))
    vi.expect.soft(clone_01(0)).to.deep.equal(0)
    vi.expect.soft(clone_01(null)).to.deep.equal(null)

    const clone_02 = vx.deepClone(v.object({ abc: v.nullable(v.number()) }))
    vi.expect.soft(clone_02({ abc: null })).to.deep.equal({ abc: null })
    vi.expect.soft(clone_02({ abc: 0 })).to.deep.equal({ abc: 0 })
  })

  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.array', () => {
    const clone_01 = vx.deepClone(
      v.array(
        v.object({
          firstName: v.string(),
          lastName: v.optional(v.string()),
          address: v.object({
            street1: v.string(),
            street2: v.optional(v.string()),
            city: v.string(),
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

  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.tuple', () => {
    const clone_01 = vx.deepClone(
      v.tuple([
        v.number(),
        v.tuple([
          v.object({
            a: v.boolean()
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

  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.tupleWithRest', () => {
    const clone_01 = vx.deepClone(
      v.tupleWithRest(
        [
          v.boolean(),
          v.string(),
          v.date(),
        ],
        v.array(v.number())
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

    const clone_02 = vx.deepClone(
      v.tupleWithRest(
        [
          v.tupleWithRest(
            [
              v.boolean()
            ],
            v.boolean())
        ],
        v.boolean()
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

    const clone_03 = vx.deepClone(
      v.tupleWithRest(
        [
          v.object({
            a: v.tupleWithRest(
              [
                v.object({
                  b: v.tupleWithRest(
                    [
                      v.object({
                        c: v.tupleWithRest(
                          [
                            v.object({
                              d: v.string(),
                            })
                          ],
                          v.object({
                            E: v.tupleWithRest(
                              [
                                v.string(),
                              ],
                              v.object({
                                F: v.string(),
                              })
                            )
                          })
                        ),
                      })
                    ],
                    v.object({
                      G: v.string()
                    })
                  )
                })
              ], v.object({
                H: v.string()
              })
            )
          })
        ],
        v.object({
          I: v.tupleWithRest(
            [
              v.string()
            ],
            v.object({
              J: v.string(),
            })
          )
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

  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.object', () => {
    const clone_01 = vx.deepClone(v.object({}))
    vi.expect.soft(clone_01({})).toMatchInlineSnapshot(`{}`)

    const clone_02 = vx.deepClone(
      v.object({
        a: v.object({
          b: v.string(),
          c: v.string(),
        }),
        d: v.optional(v.string()),
        e: v.object({
          f: v.string(),
          g: v.optional(
            v.object({
              h: v.string(),
              i: v.string(),
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

    const clone_03 = vx.deepClone(
      v.object({
        a: v.record(v.string(), v.string()),
        b: v.record(
          v.string(),
          v.object({
            c: v.object({
              d: v.string(),
              e: v.record(
                v.string(),
                v.array(v.string()),
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

    const clone_04 = vx.deepClone(
      v.object({
        b: v.array(
          v.object({
            c: v.array(
              v.object({
                d: v.string()
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


    const clone_05 = vx.deepClone(
      v.object({
        b: v.array(v.string()),
        '0b': v.array(v.string()),
        '00b': v.array(v.string()),
        '-00b': v.array(v.string()),
        '00b0': v.array(v.string()),
        '--00b0': v.array(v.string()),
        '-^00b0': v.array(v.string()),
        '': v.array(v.string()),
        '_': v.array(v.string()),
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

  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.objectWithRest', () => {
    const clone_01 = vx.deepClone(
      v.objectWithRest(
        {},
        v.string()
      )
    )
    vi.expect.soft(clone_01({})).toMatchInlineSnapshot(`{}`)
    vi.expect.soft(clone_01({ abc: '123', def: '456 ' })).toMatchInlineSnapshot(`
      {
        "abc": "123",
        "def": "456 ",
      }
    `)

    const clone_02 = vx.deepClone(
      v.objectWithRest(
        {
          abc: v.object({
            def: v.string(),
            ghi: v.string()
          }),
        },
        v.record(v.string(), v.string())
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

  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.intersect', () => {
    const clone_01 = vx.deepClone(
      v.intersect([
        v.object({
          abc: v.string()
        }),
        v.object({
          def: v.string()
        })
      ])
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

  vi.test('〖⛳️〗› ❲vx.deepClone❳: v.union', () => {

    const clone_01 = vx.deepClone(v.union([]))

    vi.expect.soft(clone_01(undefined as never)).toMatchInlineSnapshot(`undefined`)
    vi.expect.soft(clone_01(null as never)).toMatchInlineSnapshot(`null`)

    const clone_02 = vx.deepClone(
      v.union([
        v.number(),
        v.object({
          street1: v.string(),
          street2: v.optional(v.string()),
          city: v.string()
        })
      ])
    )

    vi.expect.soft(clone_02(0)).toMatchInlineSnapshot(`0`)
    vi.expect.soft(clone_02(-0)).toMatchInlineSnapshot(`-0`)

    vi.expect.soft(clone_02(
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

    vi.expect.soft(clone_02(
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

    const clone_03 = vx.deepClone(
      v.union([
        v.object({
          yea: v.literal('YAY'),
          onYea: v.union([
            v.number(),
            v.array(v.string())
          ]),
        }),
        v.object({
          boo: v.literal('NOO'),
          onBoo: v.union([
            v.object({
              tag: v.boolean(),
              opt: v.optional(v.string()),
            }),
            v.record(v.string(), v.string())
          ]),
        }),
      ])
    )

    vi.expect.soft(clone_03(
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

    vi.expect.soft(clone_03(
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

    vi.expect.soft(clone_03(
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

    vi.expect.soft(clone_03(
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

    vi.expect.soft(clone_03(
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

    vi.expect.soft(clone_03(
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

    vi.expect.soft(clone_03(
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

    vi.expect.soft(clone_03(
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

    vi.expect.soft(clone_03(
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

    const clone_04 = vx.deepClone(
      v.union([
        v.object({
          tag: v.literal('A'),
          onA: v.string(),
        }),
        v.object({
          tag: v.literal('B'),
          onB: v.string(),
        }),
      ])
    )

    vi.expect.soft(clone_04(
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

    vi.expect.soft(clone_04(
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
