import * as vi from 'vitest'
import prettier from '@prettier/sync'
import * as T from 'typebox'
import { box } from '@traversable/typebox'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: box.deepClone.writeable', () => {
  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Never', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Never()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Unknown', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Unknown()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: unknown) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Any', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Any()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: any) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Void', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Void()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: void) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Null', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Null()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Undefined', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Undefined()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: undefined) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Symbol', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Symbol()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: symbol) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Boolean', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Boolean()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: boolean) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Integer', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Integer()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.BigInt', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.BigInt()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: bigint) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Number', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Number()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.String', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.String()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: string) {
        return prev
      }
      "
    `)
  })

  // vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Date', () => {
  //   vi.expect.soft(format(
  //     box.deepClone.writeable(
  //       T.Date()
  //     )
  //   )).toMatchInlineSnapshot
  //     (`
  //     "function deepClone(prev: Date) {
  //       return new Date(prev?.getTime())
  //     }
  //     "
  //   `)

  //   vi.expect.soft(format(
  //     box.deepClone.writeable(
  //       T.Object({
  //         a: T.Date()
  //       })
  //     )
  //   )).toMatchInlineSnapshot
  //     (`
  //     "function deepClone(prev: { a: Date }) {
  //       return {
  //         a: new Date(prev.a?.getTime()),
  //       }
  //     }
  //     "
  //   `)
  // })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Literal', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Literal(0)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: 0) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Literal(-0)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: 0) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Literal(false)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: false) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Literal(true)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: true) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Literal('')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "") {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Array', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Array(T.Number())
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<number>) {
        return prev.map((value) => value)
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Array(T.Array(T.Number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<Array<number>>) {
        return prev.map((value) => {
          return value.map((value) => value)
        })
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Array(
          T.Object({
            c: T.Object({
              d: T.String(),
              e: T.Array(T.String()),
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
              e: value.c.e.map((value) => value),
            },
          }
        })
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Object({
          a: T.Optional(T.Number())
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { a?: number }) {
        return {
          ...(prev.a !== undefined && { a: prev.a }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Object({
          a: T.Optional(T.Undefined())
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
      box.deepClone.writeable(
        T.Array(
          T.Object({
            firstName: T.String(),
            lastName: T.Optional(T.String()),
            address: T.Object({
              street1: T.String(),
              street2: T.Optional(T.String()),
              city: T.String(),
            })
          })
        ), { typeName: 'Type' }
      )
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

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Record', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Record(
          T.String(),
          T.Optional(T.Boolean())
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, undefined | boolean>
      function deepClone(prev: Type) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, Object.create(null))
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Record(
          T.String(),
          T.Record(
            T.String(),
            T.String()
          )
        ),
        { typeName: 'Type' }
      )
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
      box.deepClone.writeable(
        T.Object({
          a: T.Record(T.String(), T.String()),
          b: T.Record(
            T.String(),
            T.Object({
              c: T.Object({
                d: T.String(),
                e: T.Record(
                  T.String(),
                  T.Array(T.String()),
                )
              })
            })
          )
        }), { typeName: 'Type' }
      )
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
                  acc[key] = value.map((value) => value)
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

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Record(
          T.String(),
          T.Object({
            abc: T.String(),
            def: T.Array(T.String()),
          })
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Record<string, { abc: string; def: Array<string> }>) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = {
            abc: value.abc,
            def: value.def.map((value) => value),
          }
          return acc
        }, Object.create(null))
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Tuple', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Tuple([]),
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
      box.deepClone.writeable(
        T.Tuple([
          T.String(),
          T.String(),
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
      box.deepClone.writeable(
        T.Tuple([
          T.Number(),
          T.Tuple([
            T.Object({
              a: T.Optional(T.Boolean())
            })
          ])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [number, [{ a?: boolean }]]
      function deepClone(prev: Type) {
        return [
          prev[0],
          [
            {
              ...(prev[1][0].a !== undefined && { a: prev[1][0].a }),
            },
          ],
        ]
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Object({
          a: T.Tuple([T.String(), T.String()]),
          b: T.Optional(T.Tuple([T.String(), T.Tuple([T.String()])])),
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: [string, string]; b?: [string, [string]] }
      function deepClone(prev: Type) {
        return {
          a: [prev.a[0], prev.a[1]],
          ...(prev.b && { b: [prev.b[0], [prev.b[1][0]]] }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Tuple([
          T.Object({
            A: T.Optional(T.Boolean())
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
      box.deepClone.writeable(
        T.Tuple([
          T.Object({
            A: T.Optional(
              T.Tuple([
                T.Object({
                  B: T.Optional(T.Boolean())
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

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Object', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(T.Object({}))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return {}
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Object({
          street1: T.String(),
          street2: T.Optional(T.String()),
          city: T.String(),
        }),
        { typeName: 'Type' }
      )
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
      box.deepClone.writeable(
        T.Object({
          a: T.Object({
            b: T.String(),
            c: T.String(),
          }),
          d: T.Optional(T.String()),
          e: T.Object({
            f: T.String(),
            g: T.Optional(
              T.Object({
                h: T.String(),
                i: T.String(),
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
      box.deepClone.writeable(
        T.Object({
          b: T.Array(
            T.Object({
              c: T.Array(
                T.Object({
                  d: T.String()
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
      box.deepClone.writeable(T.Object({
        b: T.Array(T.String()),
        '0b': T.Array(T.String()),
        '00b': T.Array(T.String()),
        '-00b': T.Array(T.String()),
        '00b0': T.Array(T.String()),
        '--00b0': T.Array(T.String()),
        '-^00b0': T.Array(T.String()),
        '': T.Array(T.String()),
        '_': T.Array(T.String()),
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
          b: prev.b.map((value) => value),
          "0b": prev["0b"].map((value) => value),
          "00b": prev["00b"].map((value) => value),
          "-00b": prev["-00b"].map((value) => value),
          "00b0": prev["00b0"].map((value) => value),
          "--00b0": prev["--00b0"].map((value) => value),
          "-^00b0": prev["-^00b0"].map((value) => value),
          "": prev[""].map((value) => value),
          _: prev._.map((value) => value),
        }
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Intersect', () => {
    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Intersect([
          T.Object({
            abc: T.String()
          }),
          T.Object({
            def: T.String()
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
      box.deepClone.writeable(
        T.Intersect([
          T.Object({
            abc: T.String(),
            def: T.Object({
              ghi: T.String(),
              jkl: T.String()
            })
          }),
          T.Object({
            mno: T.String(),
            pqr: T.Object({
              stu: T.String(),
              vwx: T.String(),
            })
          })
        ]), { typeName: 'Type' }
      )
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
      box.deepClone.writeable(
        T.Union([
          T.Null(),
          T.Intersect([
            T.Object({
              a: T.String()
            }),
            T.Object({
              b: T.String()
            })
          ])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = null | ({ a: string } & { b: string })
      function deepClone(prev: Type) {
        return prev === null
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

  vi.test('〖⛳️〗› ❲box.deepClone.writeable❳: T.Union', () => {

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Union([
          T.Object({
            tag: T.Literal('A'),
            onA: T.String(),
          }),
          T.Object({
            tag: T.Literal('B'),
            onB: T.String(),
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
      box.deepClone.writeable(
        T.Union([
          T.Number(),
          T.Object({
            street1: T.String(),
            street2: T.Optional(T.String()),
            city: T.String()
          }),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = number | { street1: string; street2?: string; city: string }
      function deepClone(prev: Type) {
        return typeof prev === "number"
          ? prev
          : {
              street1: prev.street1,
              ...(prev.street2 !== undefined && { street2: prev.street2 }),
              city: prev.city,
            }
      }
      "
    `)


    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Union([
          T.Object({
            street1: T.String(),
            street2: T.Optional(T.String()),
            city: T.String()
          }),
          T.Number(),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = number | { street1: string; street2?: string; city: string }
      function deepClone(prev: Type) {
        return typeof prev === "number"
          ? prev
          : {
              street1: prev.street1,
              ...(prev.street2 !== undefined && { street2: prev.street2 }),
              city: prev.city,
            }
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Union([
          T.Object({
            tag: T.Literal('ABC'),
            abc: T.Number(),
          }),
          T.Object({
            tag: T.Literal('DEF'),
            def: T.Integer(),
          })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: number }
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
      box.deepClone.writeable(
        T.Union([
          T.Object({
            tag: T.Literal('NON_DISCRIMINANT'),
            abc: T.Number(),
          }),
          T.Object({
            tag: T.Literal('NON_DISCRIMINANT'),
            def: T.Integer(),
          })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: "NON_DISCRIMINANT"; abc: number }
        | { tag: "NON_DISCRIMINANT"; def: number }
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
      box.deepClone.writeable(
        T.Union([
          T.Object({
            tag1: T.Literal('ABC'),
            abc: T.Union([
              T.Object({
                tag2: T.Literal('ABC_JKL'),
                jkl: T.Union([
                  T.Object({
                    tag3: T.Literal('ABC_JKL_ONE'),
                  }),
                  T.Object({
                    tag3: T.Literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              T.Object({
                tag2: T.Literal('ABC_MNO'),
                mno: T.Union([
                  T.Object({
                    tag3: T.Literal('ABC_MNO_ONE'),
                  }),
                  T.Object({
                    tag3: T.Literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          T.Object({
            tag1: T.Literal('DEF'),
            def: T.Union([
              T.Object({
                tag2: T.Literal('DEF_PQR'),
                pqr: T.Union([
                  T.Object({
                    tag3: T.Literal('DEF_PQR_ONE'),
                  }),
                  T.Object({
                    tag3: T.Literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              T.Object({
                tag2: T.Literal('DEF_STU'),
                stu: T.Union([
                  T.Object({
                    tag3: T.Literal('DEF_STU_ONE'),
                  }),
                  T.Object({
                    tag3: T.Literal('DEF_STU_TWO'),
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
      box.deepClone.writeable(
        T.Union([
          T.Object({
            tag: T.Literal('ABC'),
            abc: T.Union([
              T.Object({
                tag: T.Literal('ABC_JKL'),
                jkl: T.Union([
                  T.Object({
                    tag: T.Literal('ABC_JKL_ONE'),
                  }),
                  T.Object({
                    tag: T.Literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              T.Object({
                tag: T.Literal('ABC_MNO'),
                mno: T.Union([
                  T.Object({
                    tag: T.Literal('ABC_MNO_ONE'),
                  }),
                  T.Object({
                    tag: T.Literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          T.Object({
            tag: T.Literal('DEF'),
            def: T.Union([
              T.Object({
                tag: T.Literal('DEF_PQR'),
                pqr: T.Union([
                  T.Object({
                    tag: T.Literal('DEF_PQR_ONE'),
                  }),
                  T.Object({
                    tag: T.Literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              T.Object({
                tag: T.Literal('DEF_STU'),
                stu: T.Union([
                  T.Object({
                    tag: T.Literal('DEF_STU_ONE'),
                  }),
                  T.Object({
                    tag: T.Literal('DEF_STU_TWO'),
                  }),
                ])
              }),
            ])
          }),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | {
            tag: "ABC"
            abc:
              | {
                  tag: "ABC_JKL"
                  jkl: { tag: "ABC_JKL_ONE" } | { tag: "ABC_JKL_TWO" }
                }
              | {
                  tag: "ABC_MNO"
                  mno: { tag: "ABC_MNO_ONE" } | { tag: "ABC_MNO_TWO" }
                }
          }
        | {
            tag: "DEF"
            def:
              | {
                  tag: "DEF_PQR"
                  pqr: { tag: "DEF_PQR_ONE" } | { tag: "DEF_PQR_TWO" }
                }
              | {
                  tag: "DEF_STU"
                  stu: { tag: "DEF_STU_ONE" } | { tag: "DEF_STU_TWO" }
                }
          }
      function deepClone(prev: Type) {
        return prev.tag === "ABC"
          ? {
              tag: prev.tag,
              abc:
                prev.abc.tag === "ABC_JKL"
                  ? {
                      tag: prev.abc.tag,
                      jkl:
                        prev.abc.jkl.tag === "ABC_JKL_ONE"
                          ? {
                              tag: prev.abc.jkl.tag,
                            }
                          : {
                              tag: prev.abc.jkl.tag,
                            },
                    }
                  : {
                      tag: prev.abc.tag,
                      mno:
                        prev.abc.mno.tag === "ABC_MNO_ONE"
                          ? {
                              tag: prev.abc.mno.tag,
                            }
                          : {
                              tag: prev.abc.mno.tag,
                            },
                    },
            }
          : {
              tag: prev.tag,
              def:
                prev.def.tag === "DEF_PQR"
                  ? {
                      tag: prev.def.tag,
                      pqr:
                        prev.def.pqr.tag === "DEF_PQR_ONE"
                          ? {
                              tag: prev.def.pqr.tag,
                            }
                          : {
                              tag: prev.def.pqr.tag,
                            },
                    }
                  : {
                      tag: prev.def.tag,
                      stu:
                        prev.def.stu.tag === "DEF_STU_ONE"
                          ? {
                              tag: prev.def.stu.tag,
                            }
                          : {
                              tag: prev.def.stu.tag,
                            },
                    },
            }
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Union([
          T.Object({ tag: T.Literal('A') }),
          T.Object({ tag: T.Literal('B') }),
          T.Object({ tag: T.Array(T.String()) })
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
                tag: prev.tag.map((value) => value),
              }
      }
      "
    `)

    vi.expect.soft(format(
      box.deepClone.writeable(
        T.Union([
          T.Union([
            T.Object({ abc: T.String() }),
            T.Object({ def: T.String() })
          ]),
          T.Union([
            T.Object({ ghi: T.String() }),
            T.Object({ jkl: T.String() })
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

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: box.deepClone', () => {
  vi.test('〖⛳️〗› ❲box.deepClone❳: T.Array', () => {
    const clone_01 = box.deepClone(
      T.Array(
        T.Object({
          firstName: T.String(),
          lastName: T.Optional(T.String()),
          address: T.Object({
            street1: T.String(),
            street2: T.Optional(T.String()),
            city: T.String(),
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

  vi.test('〖⛳️〗› ❲box.deepClone❳: T.Tuple', () => {
    const clone_01 = box.deepClone(
      T.Tuple([
        T.Number(),
        T.Tuple([
          T.Object({
            a: T.Boolean()
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

  vi.test('〖⛳️〗› ❲box.deepClone❳: T.Object', () => {
    const clone_01 = box.deepClone(T.Object({}))
    vi.expect.soft(clone_01({})).toMatchInlineSnapshot(`{}`)

    const clone_02 = box.deepClone(
      T.Object({
        a: T.Object({
          b: T.String(),
          c: T.String(),
        }),
        d: T.Optional(T.String()),
        e: T.Object({
          f: T.String(),
          g: T.Optional(
            T.Object({
              h: T.String(),
              i: T.String(),
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

    const clone_03 = box.deepClone(
      T.Object({
        a: T.Record(T.String(), T.String()),
        b: T.Record(
          T.String(),
          T.Object({
            c: T.Object({
              d: T.String(),
              e: T.Record(
                T.String(),
                T.Array(T.String()),
              )
            })
          }),
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

    const clone_04 = box.deepClone(
      T.Object({
        b: T.Array(
          T.Object({
            c: T.Array(
              T.Object({
                d: T.String()
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


    const clone_05 = box.deepClone(
      T.Object({
        b: T.Array(T.String()),
        '0b': T.Array(T.String()),
        '00b': T.Array(T.String()),
        '-00b': T.Array(T.String()),
        '00b0': T.Array(T.String()),
        '--00b0': T.Array(T.String()),
        '-^00b0': T.Array(T.String()),
        '': T.Array(T.String()),
        '_': T.Array(T.String()),
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

  vi.test('〖⛳️〗› ❲box.deepClone❳: T.Intersect', () => {
    const clone_01 = box.deepClone(
      T.Intersect([
        T.Object({
          abc: T.String()
        }),
        T.Object({
          def: T.String()
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

  vi.test('〖⛳️〗› ❲box.deepClone❳: T.Union', () => {
    const clone_01 = box.deepClone(T.Union([]))
    vi.expect.soft(clone_01(undefined as never)).toMatchInlineSnapshot(`undefined`)
    vi.expect.soft(clone_01(null as never)).toMatchInlineSnapshot(`null`)

    const clone_02 = box.deepClone(
      T.Union([
        T.Number(),
        T.Object({
          street1: T.String(),
          street2: T.Optional(T.String()),
          city: T.String()
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

    const clone_03 = box.deepClone(
      T.Union([
        T.Object({
          yea: T.Literal('YAY'),
          onYea: T.Union([
            T.Number(),
            T.Array(T.String())
          ]),
        }),
        T.Object({
          boo: T.Literal('NOO'),
          onBoo: T.Union([
            T.Object({
              tag: T.Boolean(),
              opt: T.Optional(T.String()),
            }),
            T.Record(T.String(), T.String())
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

    const clone_04 = box.deepClone(
      T.Union([
        T.Object({
          tag: T.Literal('A'),
          onA: T.String(),
        }),
        T.Object({
          tag: T.Literal('B'),
          onB: T.String(),
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
