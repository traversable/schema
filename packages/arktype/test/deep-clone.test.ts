import * as vi from 'vitest'
import prettier from '@prettier/sync'
import { type } from 'arktype'
import { ark } from '@traversable/arktype'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: ark.deepClone.writeable', () => {
  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.never', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.never
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.unknown', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.unknown
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: unknown) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.null', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.null
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.boolean', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.boolean
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: boolean) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.keywords.number.integer', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.keywords.number.integer
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.number', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.number
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.string', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.string
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: string) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.enumerated', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.enumerated()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.enumerated('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.enumerated('a', 'b')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a" | "b") {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.array', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.number.array()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<number>) {
        return prev.map((value) => value)
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.number.array().array()
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
      ark.deepClone.writeable(
        type.number.array().array().array()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<Array<Array<number>>>) {
        return prev.map((value) => {
          return value.map((value) => {
            return value.map((value) => value)
          })
        })
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          "a?": type.number.array(),
          "b?": type.string,
        }),
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { a?: Array<number>; b?: string }) {
        return {
          ...(prev.a && { a: prev.a.map((value) => value) }),
          ...(prev.b !== undefined && { b: prev.b }),
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.Record', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type('Record<string, Record<string, string>>'),
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
      ark.deepClone.writeable(
        type('Record<string, Record<string, string[]>>'),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, Array<string>>>
      function deepClone(prev: Type) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = Object.entries(value).reduce((acc, [key, value]) => {
            acc[key] = value.map((value) => value)
            return acc
          }, Object.create(null))
          return acc
        }, Object.create(null))
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.tuple', () => {

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type([]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<undefined>
      function deepClone(prev: Type) {
        return prev.map((value) => {})
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type([
          'string',
          'string',
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
      ark.deepClone.writeable(
        type([
          {
            street1: 'string',
            "street2?": 'string',
            city: 'string'
          },
          {
            street1: 'string',
            "street2?": 'string',
            city: 'string'
          },
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [
        { city: string; street1: string; street2?: string },
        { city: string; street1: string; street2?: string },
      ]
      function deepClone(prev: Type) {
        return [
          {
            city: prev[0].city,
            street1: prev[0].street1,
            ...(prev[0].street2 !== undefined && { street2: prev[0].street2 }),
          },
          {
            city: prev[1].city,
            street1: prev[1].street1,
            ...(prev[1].street2 !== undefined && { street2: prev[1].street2 }),
          },
        ]
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type([
          'number',
          [
            { a: 'boolean' }
          ]
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [number, [{ a: boolean }]]
      function deepClone(prev: Type) {
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
      ark.deepClone.writeable(
        type({
          a: ['string', 'string'],
          "b?": ['string', ['string']],
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
      ark.deepClone.writeable(
        type([
          {
            "A?": 'boolean'
          },
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: boolean }]
      function deepClone(prev: Type) {
        return [
          {
            ...(prev[0].A && { A: prev[0].A }),
          },
        ]
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type([
          {
            "A?": [
              {
                "B?": 'boolean'
              }
            ]
          }
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
                  ...(prev[0].A[0].B && { B: prev[0].A[0].B }),
                },
              ],
            }),
          },
        ]
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.tuple w/ rest', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type(
          [
            'string',
            'string',
            '...',
            'number[]'
          ],
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string, ...number[]]
      function deepClone(prev: Type) {
        return [
          prev[0],
          prev[1],
          ...(prev.slice(2) as Array<number>).map((value) => value),
        ]
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type([
          'boolean',
          'string',
          type.keywords.number.integer,
          '...',
          'number[][]'
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [boolean, string, number, ...Array<number>[]]) {
        return [
          prev[0],
          prev[1],
          prev[2],
          ...(prev.slice(3) as Array<Array<number>>).map((value) =>
            value.map((value) => value),
          ),
        ]
      }
      "
    `)


    vi.expect.soft(format(
      ark.deepClone.writeable(
        type(
          {
            "a?": [
              {
                "b?": [
                  {
                    "c?": [
                      { "d?": 'string' },
                      '...',
                      [{ "E?": ['string', '...', [{ "F?": 'string' }, '[]']] }],
                    ]
                  },
                  '...',
                  [{ "G?": 'string' }, '[]'],
                ]
              },
              '...',
              [{ "H?": 'string' }, '[]'],
            ]
          }
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a?: [
          {
            b?: [
              { c?: [{ d?: string }, { E?: [string, ...{ F?: string }[]] }] },
              ...{ G?: string }[],
            ]
          },
          ...{ H?: string }[],
        ]
      }
      function deepClone(prev: Type) {
        return {
          ...(prev.a && {
            a: [
              {
                ...(prev.a[0].b && {
                  b: [
                    {
                      ...(prev.a[0].b[0].c && {
                        c: [
                          {
                            ...(prev.a[0].b[0].c[0].d !== undefined && {
                              d: prev.a[0].b[0].c[0].d,
                            }),
                          },
                          {
                            ...(prev.a[0].b[0].c[1].E && {
                              E: [
                                prev.a[0].b[0].c[1].E[0],
                                ...(
                                  prev.a[0].b[0].c[1].E.slice(1) as Array<{
                                    F?: string
                                  }>
                                ).map((value) => ({
                                  ...(value.F !== undefined && { F: value.F }),
                                })),
                              ],
                            }),
                          },
                        ],
                      }),
                    },
                    ...(prev.a[0].b.slice(1) as Array<{ G?: string }>).map(
                      (value) => ({
                        ...(value.G !== undefined && { G: value.G }),
                      }),
                    ),
                  ],
                }),
              },
              ...(prev.a.slice(1) as Array<{ H?: string }>).map((value) => ({
                ...(value.H !== undefined && { H: value.H }),
              })),
            ],
          }),
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.object', () => {

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({})
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return {}
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          street1: 'string',
          "street2?": 'string',
          city: 'string'
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { city: string; street1: string; street2?: string }
      function deepClone(prev: Type) {
        return {
          city: prev.city,
          street1: prev.street1,
          ...(prev.street2 !== undefined && { street2: prev.street2 }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          "a?": type.number.array(),
          "b?": 'string',
          "c?": {
            "d?": {
              "e?": type.boolean.array()
            }
          }
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a?: Array<number>
        b?: string
        c?: { d?: { e?: Array<boolean> } }
      }
      function deepClone(prev: Type) {
        return {
          ...(prev.a && { a: prev.a.map((value) => value) }),
          ...(prev.b !== undefined && { b: prev.b }),
          ...(prev.c && {
            c: {
              ...(prev.c.d && {
                d: {
                  ...(prev.c.d.e && {
                    e: prev.c.d.e.map((value) => {
                      return value
                    }),
                  }),
                },
              }),
            },
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          "a": {
            b: 'string',
            c: 'string'
          },
          "d?": 'string',
          e: {
            f: 'string',
            "g?": {
              h: 'string',
              i: 'string'
            }
          },
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: { b: string; c: string }
        e: { f: string; g?: { h: string; i: string } }
        d?: string
      }
      function deepClone(prev: Type) {
        return {
          a: {
            b: prev.a.b,
            c: prev.a.c,
          },
          e: {
            f: prev.e.f,
            ...(prev.e.g && {
              g: {
                h: prev.e.g.h,
                i: prev.e.g.i,
              },
            }),
          },
          ...(prev.d !== undefined && { d: prev.d }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          b: [
            {
              c: [
                {
                  d: 'string'
                },
                '[]'
              ]
            },
            '[]'
          ]
        }),
        { typeName: 'Type' }
      )
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
      ark.deepClone.writeable(
        type(
          {
            b: type.string.array(),
            "0b": type.string.array(),
            "00b": type.string.array(),
            "-00b": type.string.array(),
            "00b0": type.string.array(),
            "--00b0": type.string.array(),
            "-^00b0": type.string.array(),
            "": type.string.array(),
            _: type.string.array(),
          }
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        "": Array<string>
        "--00b0": Array<string>
        "-00b": Array<string>
        "-^00b0": Array<string>
        "00b": Array<string>
        "00b0": Array<string>
        "0b": Array<string>
        _: Array<string>
        b: Array<string>
      }
      function deepClone(prev: Type) {
        return {
          "": prev[""].map((value) => value),
          "--00b0": prev["--00b0"].map((value) => value),
          "-00b": prev["-00b"].map((value) => value),
          "-^00b0": prev["-^00b0"].map((value) => value),
          "00b": prev["00b"].map((value) => value),
          "00b0": prev["00b0"].map((value) => value),
          "0b": prev["0b"].map((value) => value),
          _: prev._.map((value) => value),
          b: prev.b.map((value) => value),
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.intersection', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type(type.number.and('1')),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = 1
      function deepClone(prev: Type) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          abc: 'string'
        }).and({
          def: 'string'
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string; def: string }
      function deepClone(prev: Type) {
        return {
          abc: prev.abc,
          def: prev.def,
        }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          abc: 'string',
          def: {
            ghi: 'string',
            jkl: 'string'
          }
        }).and(
          {
            abc: 'string',
            def: {
              ghi: 'string',
              jkl: 'string'
            }
          }
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string; def: { ghi: string; jkl: string } }
      function deepClone(prev: Type) {
        return {
          abc: prev.abc,
          def: {
            ghi: prev.def.ghi,
            jkl: prev.def.jkl,
          },
        }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type.null.or(
          [
            { a: 'string' },
            '&',
            { b: 'string' }
          ]
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = null | { a: string; b: string }
      function deepClone(prev: Type) {
        return prev === null
          ? prev
          : {
              a: prev.a,
              b: prev.b,
            }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepClone.writeable❳: type.union', () => {
    vi.expect.soft(format(
      ark.deepClone.writeable(
        type
          .number
          .or(type.string)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number | string) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type
          .number.array()
          .or(type.boolean)
          .or(type.string),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = boolean | string | Array<number>
      function deepClone(prev: Type) {
        return typeof prev === "boolean"
          ? prev
          : typeof prev === "string"
            ? prev
            : prev.map((value) => value)
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type
          .number.array()
          .or(type.boolean)
          .or(type.string)
          .or(
            type({
              "A?": 'string'
            })
          )
          .or(
            type({
              "B?": '100',
              "C?": '200',
            })
          ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | boolean
        | string
        | { A?: string }
        | { B?: 100; C?: 200 }
        | Array<number>
      function deepClone(prev: Type) {
        function check_0(value: any): value is { A?: string } {
          return (
            !!value &&
            typeof value === "object" &&
            (!Object.hasOwn(value, "A") || typeof value.A === "string")
          )
        }
        function check_1(value: any): value is { B?: 100; C?: 200 } {
          return (
            !!value &&
            typeof value === "object" &&
            (!Object.hasOwn(value, "B") || value.B === 100) &&
            (!Object.hasOwn(value, "C") || value.C === 200)
          )
        }
        return typeof prev === "boolean"
          ? prev
          : typeof prev === "string"
            ? prev
            : check_0(prev)
              ? {
                  ...(prev.A !== undefined && { A: prev.A }),
                }
              : check_1(prev)
                ? {
                    ...(prev.B && { B: prev.B }),
                    ...(prev.C && { C: prev.C }),
                  }
                : prev.map((value) => value)
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          tag: '"A"',
          onA: 'string',
        })
          .or({
            tag: '"B"',
            onB: 'string'
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { onA: string; tag: "A" } | { onB: string; tag: "B" }
      function deepClone(prev: Type) {
        return prev.tag === "A"
          ? {
              onA: prev.onA,
              tag: prev.tag,
            }
          : {
              onB: prev.onB,
              tag: prev.tag,
            }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type(['1', '2', '3'])
          .or({
            a: '"A"',
            b: '"B"',
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: "A"; b: "B" } | [1, 2, 3]
      function deepClone(prev: Type) {
        function check_0(value: any): value is { a: "A"; b: "B" } {
          return (
            !!value && typeof value === "object" && value.a === "A" && value.b === "B"
          )
        }
        return check_0(prev)
          ? {
              a: prev.a,
              b: prev.b,
            }
          : [prev[0], prev[1], prev[2]]
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          c: '"C"',
          d: '"D"',
        })
          .or({
            "a?": ['1', '2', '3'],
            "b?": type.string.array(),
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a?: [1, 2, 3]; b?: Array<string> } | { c: "C"; d: "D" }
      function deepClone(prev: Type) {
        function check_0(value: any): value is { a?: [1, 2, 3]; b?: Array<string> } {
          return (
            !!value &&
            typeof value === "object" &&
            (!Object.hasOwn(value, "a") ||
              (Array.isArray(value.a) &&
                3 <= value.a.length &&
                value.a?.[0] === 1 &&
                value.a?.[1] === 2 &&
                value.a?.[2] === 3)) &&
            (!Object.hasOwn(value, "b") ||
              (Array.isArray(value.b) &&
                value.b.every((value) => typeof value === "string")))
          )
        }
        return check_0(prev)
          ? {
              ...(prev.a && { a: [prev.a[0], prev.a[1], prev.a[2]] }),
              ...(prev.b && { b: prev.b.map((value) => value) }),
            }
          : {
              c: prev.c,
              d: prev.d,
            }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type
          .number
          .or({
            street1: 'string',
            "street2?": 'string',
            city: 'string',
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = number | { city: string; street1: string; street2?: string }
      function deepClone(prev: Type) {
        return typeof prev === "number"
          ? prev
          : {
              city: prev.city,
              street1: prev.street1,
              ...(prev.street2 !== undefined && { street2: prev.street2 }),
            }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          tag: '"ABC"',
          abc: 'number',
        }).or({
          tag: '"DEF"',
          def: type.keywords.number.integer,
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: number; tag: "ABC" } | { def: number; tag: "DEF" }
      function deepClone(prev: Type) {
        return prev.tag === "ABC"
          ? {
              abc: prev.abc,
              tag: prev.tag,
            }
          : {
              def: prev.def,
              tag: prev.tag,
            }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          tag: '"NON_DISCRIMINANT"',
          abc: 'number',
        }).or({
          tag: '"NON_DISCRIMINANT"',
          def: type.keywords.number.integer,
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { abc: number; tag: "NON_DISCRIMINANT" }
        | { def: number; tag: "NON_DISCRIMINANT" }
      function deepClone(prev: Type) {
        function check_0(
          value: any,
        ): value is { abc: number; tag: "NON_DISCRIMINANT" } {
          return (
            !!value &&
            typeof value === "object" &&
            Number.isFinite(value.abc) &&
            value.tag === "NON_DISCRIMINANT"
          )
        }
        return check_0(prev)
          ? {
              abc: prev.abc,
              tag: prev.tag,
            }
          : {
              def: prev.def,
              tag: prev.tag,
            }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type(
          [
            {
              tag1: '"ABC"',
              abc: [
                {
                  tag2: '"ABC_JKL"',
                  jkl: [{ tag3: '"ABC_JKL_ONE"' }, '|', { tag3: '"ABC_JKL_TWO"' }]
                },
                '|',
                {
                  tag2: '"ABC_MNO"',
                  mno: [{ tag3: '"ABC_MNO_ONE"' }, '|', { tag3: '"ABC_MNO_TWO"' }]
                }
              ]
            },
            '|',
            {
              tag1: '"DEF"',
              def: [
                {
                  tag2: '"DEF_PQR"',
                  pqr: [{ tag3: '"DEF_PQR_ONE"' }, '|', { tag3: '"DEF_PQR_TWO"' }]
                },
                '|',
                {
                  tag2: '"DEF_STU"',
                  stu: [{ tag3: '"DEF_STU_ONE"' }, '|', { tag3: '"DEF_STU_TWO"' }]
                }
              ]
            }
          ]
        ),
        { typeName: 'Type' }
      ),
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | {
            abc:
              | {
                  jkl: { tag3: "ABC_JKL_ONE" } | { tag3: "ABC_JKL_TWO" }
                  tag2: "ABC_JKL"
                }
              | {
                  mno: { tag3: "ABC_MNO_ONE" } | { tag3: "ABC_MNO_TWO" }
                  tag2: "ABC_MNO"
                }
            tag1: "ABC"
          }
        | {
            def:
              | {
                  pqr: { tag3: "DEF_PQR_ONE" } | { tag3: "DEF_PQR_TWO" }
                  tag2: "DEF_PQR"
                }
              | {
                  stu: { tag3: "DEF_STU_ONE" } | { tag3: "DEF_STU_TWO" }
                  tag2: "DEF_STU"
                }
            tag1: "DEF"
          }
      function deepClone(prev: Type) {
        return prev.tag1 === "ABC"
          ? {
              abc:
                prev.abc.tag2 === "ABC_JKL"
                  ? {
                      jkl:
                        prev.abc.jkl.tag3 === "ABC_JKL_ONE"
                          ? {
                              tag3: prev.abc.jkl.tag3,
                            }
                          : {
                              tag3: prev.abc.jkl.tag3,
                            },
                      tag2: prev.abc.tag2,
                    }
                  : {
                      mno:
                        prev.abc.mno.tag3 === "ABC_MNO_ONE"
                          ? {
                              tag3: prev.abc.mno.tag3,
                            }
                          : {
                              tag3: prev.abc.mno.tag3,
                            },
                      tag2: prev.abc.tag2,
                    },
              tag1: prev.tag1,
            }
          : {
              def:
                prev.def.tag2 === "DEF_PQR"
                  ? {
                      pqr:
                        prev.def.pqr.tag3 === "DEF_PQR_ONE"
                          ? {
                              tag3: prev.def.pqr.tag3,
                            }
                          : {
                              tag3: prev.def.pqr.tag3,
                            },
                      tag2: prev.def.tag2,
                    }
                  : {
                      stu:
                        prev.def.stu.tag3 === "DEF_STU_ONE"
                          ? {
                              tag3: prev.def.stu.tag3,
                            }
                          : {
                              tag3: prev.def.stu.tag3,
                            },
                      tag2: prev.def.tag2,
                    },
              tag1: prev.tag1,
            }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({ tag: type.string.array() })
          .or({
            tag: '"B"',
            "onB?": type.string.array()
          })
          .or({
            tag: '"A"',
            "onA?": type.keywords.Record('string', type({ "abc?": 'number' }).array())
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: Array<string> }
        | { tag: "A"; onA?: Record<string, Array<{ abc?: number }>> }
        | { tag: "B"; onB?: Array<string> }
      function deepClone(prev: Type) {
        function check_0(value: any): value is { tag: Array<string> } {
          return (
            !!value &&
            typeof value === "object" &&
            Array.isArray(value.tag) &&
            value.tag.every((value) => typeof value === "string")
          )
        }
        function check_1(
          value: any,
        ): value is { tag: "A"; onA?: Record<string, Array<{ abc?: number }>> } {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "A" &&
            (!Object.hasOwn(value, "onA") ||
              (!!value.onA &&
                typeof value.onA === "object" &&
                Object.entries(value.onA).every(
                  ([key, value]) =>
                    Array.isArray(value) &&
                    value.every(
                      (value) =>
                        !!value &&
                        typeof value === "object" &&
                        (!Object.hasOwn(value, "abc") || Number.isFinite(value?.abc)),
                    ),
                )))
          )
        }
        return check_0(prev)
          ? {
              tag: prev.tag.map((value) => value),
            }
          : check_1(prev)
            ? {
                tag: prev.tag,
                ...(prev.onA && {
                  onA: Object.entries(prev.onA).reduce((acc, [key, value]) => {
                    acc[key] = value.map((value) => {
                      return {
                        ...(value.abc !== undefined && { abc: value.abc }),
                      }
                    })
                    return acc
                  }, Object.create(null)),
                }),
              }
            : {
                tag: prev.tag,
                ...(prev.onB && { onB: prev.onB.map((value) => value) }),
              }
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({ abc: 'string' })
          .or({ def: 'string' })
          .or({ ghi: 'string' })
          .or({ jkl: 'string' }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { abc: string }
        | { def: string }
        | { ghi: string }
        | { jkl: string }
      function deepClone(prev: Type) {
        function check_0(value: any): value is { abc: string } {
          return !!value && typeof value === "object" && typeof value.abc === "string"
        }
        function check_1(value: any): value is { def: string } {
          return !!value && typeof value === "object" && typeof value.def === "string"
        }
        function check_2(value: any): value is { ghi: string } {
          return !!value && typeof value === "object" && typeof value.ghi === "string"
        }
        return check_0(prev)
          ? {
              abc: prev.abc,
            }
          : check_1(prev)
            ? {
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

    vi.expect.soft(format(
      ark.deepClone.writeable(
        type({
          "tag?": '"A"',
          "onA?":
            type.boolean
              .or(type.string)
              .or(type.string.array())
        }).or({
          "tag?": '"B"',
          "onB?": {
            "C?":
              type.boolean
                .or(type.string)
                .or(type.string.array())
          }
        })
        ,
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { onA?: boolean | string | Array<string>; tag?: "A" }
        | { onB?: { C?: boolean | string | Array<string> }; tag?: "B" }
      function deepClone(prev: Type) {
        return prev.tag === "A"
          ? {
              ...(prev.onA && {
                onA:
                  typeof prev.onA === "boolean"
                    ? prev.onA
                    : typeof prev.onA === "string"
                      ? prev.onA
                      : prev.onA.map((value) => value),
              }),
              ...(prev.tag && { tag: prev.tag }),
            }
          : {
              ...(prev.onB && {
                onB: {
                  ...(prev.onB.C && {
                    C:
                      typeof prev.onB.C === "boolean"
                        ? prev.onB.C
                        : typeof prev.onB.C === "string"
                          ? prev.onB.C
                          : prev.onB.C.map((value) => value),
                  }),
                },
              }),
              ...(prev.tag && { tag: prev.tag }),
            }
      }
      "
    `)

  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: ark.deepClone', () => {
  vi.test('〖⛳️〗› ❲ark.deepClone❳: type.array', () => {
    const clone_01 = ark.deepClone(
      type([
        {
          firstName: 'string',
          "lastName?": 'string',
          address: {
            street1: 'string',
            "street2?": 'string',
            city: 'string'
          },
        },
        '[]'
      ])
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

  vi.test('〖⛳️〗› ❲ark.deepClone❳: type.tuple', () => {
    const clone_01 = ark.deepClone(
      type([
        'number',
        [
          {
            a: 'boolean'
          }
        ]
      ])
    )

    vi.expect.soft(clone_01(
      [
        1,
        [
          {
            a: false
          }
        ]
      ]
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

  vi.test('〖⛳️〗› ❲ark.deepClone❳: type.tuple w/ rest', () => {
    const clone_01 = ark.deepClone(
      type([
        'boolean',
        'string',
        'number.integer',
        '...',
        'number[][]'
      ])
    )

    vi.expect.soft(clone_01(
      [false, '', 0]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        0,
      ]
    `)

    vi.expect.soft(clone_01(
      [false, '', 0, []]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        0,
        [],
      ]
    `)

    vi.expect.soft(clone_01(
      [false, '', 0, [1]]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        0,
        [
          1,
        ],
      ]
    `)

    vi.expect.soft(clone_01(
      [false, '', 0, [1, 2]]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        0,
        [
          1,
          2,
        ],
      ]
    `)

    const clone_02 = ark.deepClone(
      type([
        type.boolean.array(),
        '...',
        'boolean[]'
      ])
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

    const clone_03 = ark.deepClone(
      type([
        {
          "a?": [
            {
              "b?": [
                {
                  "c?": [
                    {
                      "d?": 'string'
                    },
                    '...',
                    [
                      {
                        "E?": [
                          'string',
                          '...',
                          [{ "F?": 'string' }, '[]']
                        ]
                      },
                      '[]'
                    ]
                  ]
                },
                '...',
                [{ "G?": 'string' }, '[]']
              ]
            },
            '...',
            [{ "H?": 'string' }, '[]']
          ]
        },
        '...',
        [
          {
            "I": [
              'string',
              '...',
              [{ "J?": 'string' }, '[]'],
            ]
          },
          '[]',
        ]
      ])
    )

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
                    }
                  ]
                }
              ]
            }
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
                        'hey'
                      ]
                    }
                  ]
                }
              ]
            }
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
                        {
                          F: 'FF'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
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

  vi.test('〖⛳️〗› ❲ark.deepClone❳: type.object', () => {
    const clone_01 = ark.deepClone(type({}))
    vi.expect.soft(clone_01({})).toMatchInlineSnapshot(`{}`)

    const clone_02 = ark.deepClone(
      type({
        a: {
          b: '"B"',
          c: '"C"',
        },
        "d?": '"D"',
        e: {
          f: '"F"',
          "g?": {
            h: '"H"',
            i: '"I"',
          }
        }
      }),
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

    const clone_03 = ark.deepClone(
      type({
        "a?": type.keywords.Record('string', 'string'),
        "b?": type.keywords.Record('string', {
          c: {
            d: 'string',
            e: type.keywords.Record('string', 'string[]')
          }
        })
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

    const clone_04 = ark.deepClone(
      type({
        "b?": type({
          c: type({
            d: 'string'
          }).array()
        }).array()
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


    const clone_05 = ark.deepClone(
      type({
        b: type.string.array(),
        "0b": type.string.array(),
        "00b": type.string.array(),
        "-00b": type.string.array(),
        "00b0": type.string.array(),
        "--00b0": type.string.array(),
        "-^00b0": type.string.array(),
        "": type.string.array(),
        _: type.string.array(),
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

  vi.test('〖⛳️〗› ❲ark.deepClone❳: type.intersection', () => {
    const clone_01 = ark.deepClone(
      type({
        abc: '"ABC"'
      }).and({
        def: '"DEF"'
      })
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

  vi.test('〖⛳️〗› ❲ark.deepClone❳: type.union', () => {
    const clone_01 = ark.deepClone(
      type
        .number
        .or({
          street1: 'string',
          "street2?": 'string',
          city: 'string'
        })
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

    const clone_03 = ark.deepClone(
      type({
        yea: '"YAY"',
        onYea: [
          'number',
          '|',
          'string[]'
        ],
      },
        '|',
        {
          boo: '"NOO"',
          onBoo: [
            {
              tag: 'boolean',
              "opt?": 'string',
            },
            '|',
            'Record<string, string>'
          ]
        }
      )
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

    const clone_04 = ark.deepClone(
      type([
        {
          tag: '"A"',
          onA: 'string',
        },
        '|',
        {
          tag: '"B"',
          onB: 'string',
        }
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
