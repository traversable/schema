import * as vi from 'vitest'
import prettier from '@prettier/sync'
import type { Json } from '@traversable/json'
import { JsonSchema } from '@traversable/json-schema'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

function makeTuple<T extends readonly unknown[], R>(prefixItems: readonly [...T]): JsonSchema.Tuple<T>
function makeTuple<T extends readonly unknown[], R>(prefixItems: readonly [...T], items: R): JsonSchema.Tuple<T, R>
function makeTuple<T extends readonly unknown[], R>(prefixItems: readonly [...T], items?: R) {
  return {
    type: 'array' as const,
    prefixItems,
    items
  }
}


const Schema = {
  never: { not: {} } as JsonSchema.Never,
  unknown: {} as JsonSchema.Unknown,
  null: { type: 'null' as const } as JsonSchema.Null,
  boolean: { type: 'boolean' as const } as JsonSchema.Boolean,
  integer: { type: 'integer' } as JsonSchema.Integer,
  number: { type: 'number' } as JsonSchema.Number,
  string: { type: 'string' as const } as JsonSchema.String,
  enum: (...members: readonly (null | boolean | number | string)[]) => ({ enum: members }) as JsonSchema.Enum,
  const: (value: Json) => ({ const: value }) as JsonSchema.Const,
  union: <T extends readonly unknown[]>(anyOf: T) => ({ anyOf }) as JsonSchema.Union<T[number]>,
  intersection: <T extends readonly unknown[]>(allOf: T) => ({ allOf }) as JsonSchema.Intersection<T[number]>,
  array: <T>(items: T) => ({ type: 'array', items }) as JsonSchema.Array<T>,
  tuple: makeTuple,
  record: <A, P>({ additionalProperties, patternProperties }: { additionalProperties?: A, patternProperties?: { [x: string]: P } }) => ({
    type: 'object',
    ...additionalProperties && { additionalProperties },
    ...patternProperties && { patternProperties },
  }) as JsonSchema.Record<A | P>,
  object: <T>(properties: { [x: string]: T }, required: string[] = []) => ({
    type: 'object',
    required,
    properties,
  }) as JsonSchema.Object<T>
}


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json-schema❳: JsonSchema.deepClone.writeable', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.never', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.never
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.unknown', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.unknown
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: unknown) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.null', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.null
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.boolean', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.boolean
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: boolean) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.integer', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.integer
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.number', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.number
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.string', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.string
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: string) {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.enum', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum('a', 'b')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a" | "b") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum('a', 'b')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a" | "b") {
        return prev
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.const', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(null)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(0)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: 0) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(-0)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: 0) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(false)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: false) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(true)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: true) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const('')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "") {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: []) {
        return []
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(['hey'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: ["hey"]) {
        return [prev[0]]
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const({})
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return {}
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const({
          a: 'hey'
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { a: "hey" }) {
        return {
          a: prev.a,
        }
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.array', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.array(Schema.number)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<number>) {
        return prev.map((value) => value)
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.array(Schema.array(Schema.number))
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
      JsonSchema.deepClone.writeable(
        Schema.array(Schema.array(Schema.array(Schema.number)))
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
      JsonSchema.deepClone.writeable(
        Schema.object({
          a: Schema.array(Schema.number),
          b: Schema.string,
        })
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

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.array(Schema.array(Schema.number))
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
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.record', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.record({
          additionalProperties: Schema.record({
            additionalProperties: Schema.string
          })
        }),
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
      JsonSchema.deepClone.writeable(
        {
          "type": "object",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "g_2CpAr_Ot": {
                "type": "boolean"
              },
              "_N$f": {
                "type": "boolean"
              }
            },
            "required": [
              "g_2CpAr_Ot"
            ]
          },
          "patternProperties": {
            "__W": {
              "type": "number"
            }
          }
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, { g_2CpAr_Ot: boolean; _N$f?: boolean }> & {
        __W: number
      }
      function deepClone(prev: Type) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = /__W/.test(key)
            ? value
            : {
                g_2CpAr_Ot: value.g_2CpAr_Ot,
                ...(value._N$f !== undefined && { _N$f: value._N$f }),
              }
          return acc
        }, Object.create(null))
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.record({
          additionalProperties: Schema.record({
            additionalProperties: Schema.array(Schema.string)
          })
        }),
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

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.record({
          patternProperties: {
            abc: Schema.string
          }
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string }
      function deepClone(prev: Type) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, Object.create(null))
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.object({
          a: Schema.record({ additionalProperties: Schema.string }),
          b: Schema.record({
            additionalProperties: Schema.object({
              c: Schema.object({
                d: Schema.string,
                e: Schema.record({
                  additionalProperties: Schema.array(Schema.string)
                })
              }, ['d', 'e'])
            }, ['c'])
          })
        }, ['a', 'b']), {
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
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.record w/ patternProperties', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.record({
          patternProperties: {}
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {}
      function deepClone(prev: Type) {
        return {}
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.record({
          patternProperties: {
            abc: Schema.array(Schema.number),
          }
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: Array<number> }
      function deepClone(prev: Type) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = value.map((value) => value)
          return acc
        }, Object.create(null))
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.record({
          additionalProperties: Schema.object({
            street1: Schema.string,
            street2: Schema.string,
            city: Schema.string,
          }, ['street1', 'city']),
          patternProperties: {
            abc: Schema.array(Schema.number),
            def: Schema.object({
              ghi: Schema.array(Schema.boolean),
            })
          }
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<
        string,
        { street1: string; street2?: string; city: string }
      > & { abc: Array<number>; def: { ghi?: Array<boolean> } }
      function deepClone(prev: Type) {
        return Object.entries(prev).reduce((acc, [key, value]) => {
          acc[key] = /abc/.test(key)
            ? value.map((value) => value)
            : /def/.test(key)
              ? {
                  ...(value.ghi && { ghi: value.ghi.map((value) => value) }),
                }
              : {
                  street1: value.street1,
                  ...(value.street2 !== undefined && { street2: value.street2 }),
                  city: value.city,
                }
          return acc
        }, Object.create(null))
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.tuple', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple([]),
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
      JsonSchema.deepClone.writeable(
        Schema.tuple([
          Schema.string,
          Schema.string,
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
      JsonSchema.deepClone.writeable(
        Schema.tuple([
          Schema.object({
            street1: Schema.string,
            street2: Schema.string,
            city: Schema.string
          }, ['street1', 'city']),
          Schema.object({
            street1: Schema.string,
            street2: Schema.string,
            city: Schema.string
          }, ['street1', 'city']),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [
        { street1: string; street2?: string; city: string },
        { street1: string; street2?: string; city: string },
      ]
      function deepClone(prev: Type) {
        return [
          {
            street1: prev[0].street1,
            ...(prev[0].street2 !== undefined && { street2: prev[0].street2 }),
            city: prev[0].city,
          },
          {
            street1: prev[1].street1,
            ...(prev[1].street2 !== undefined && { street2: prev[1].street2 }),
            city: prev[1].city,
          },
        ]
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple([
          Schema.number,
          Schema.tuple([
            Schema.object({ a: Schema.boolean }, [])
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
      JsonSchema.deepClone.writeable(Schema.object({
        a: Schema.tuple([Schema.string, Schema.string]),
        b: Schema.tuple([Schema.string, Schema.tuple([Schema.string])]),
      }, ['a']), { typeName: 'Type' })
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
      JsonSchema.deepClone.writeable(
        Schema.tuple([
          Schema.object({
            A: Schema.boolean
          }, []),
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
      JsonSchema.deepClone.writeable(
        Schema.tuple([
          Schema.object({
            A: Schema.tuple([
              Schema.object({
                B: Schema.boolean
              }, [])
            ])
          }, [])
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

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.tuple w/ rest', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple(
          [
            Schema.string,
            Schema.string,
          ],
          Schema.number
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
      JsonSchema.deepClone.writeable(
        Schema.tuple(
          [Schema.boolean, Schema.string, Schema.integer],
          Schema.array(Schema.number)
        )
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
      JsonSchema.deepClone.writeable(
        Schema.tuple([Schema.tuple([Schema.boolean], Schema.boolean)], Schema.boolean)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [[boolean, ...boolean[]], ...boolean[]]) {
        return [
          [prev[0][0], ...(prev[0].slice(1) as Array<boolean>).map((value) => value)],
          ...(prev.slice(1) as Array<boolean>).map((value) => value),
        ]
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple(
          [
            Schema.object({
              a: Schema.tuple(
                [
                  Schema.object({
                    b: Schema.tuple(
                      [
                        Schema.object({
                          c: Schema.tuple(
                            [
                              Schema.object({
                                d: Schema.string,
                              })
                            ],
                            Schema.object({
                              E: Schema.tuple(
                                [
                                  Schema.string,
                                ], Schema.object({
                                  F: Schema.string,
                                })
                              )
                            })
                          ),
                        })
                      ],
                      Schema.object({
                        G: Schema.string
                      })
                    )
                  })
                ], Schema.object({
                  G: Schema.string
                })
              )
            })
          ],
          Schema.object({
            H: Schema.tuple([Schema.string], Schema.object({
              I: Schema.string,
            }))
          })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [
        {
          a?: [
            {
              b?: [
                { c?: [{ d?: string }, ...{ E?: [string, ...{ F?: string }[]] }[]] },
                ...{ G?: string }[],
              ]
            },
            ...{ G?: string }[],
          ]
        },
        ...{ H?: [string, ...{ I?: string }[]] }[],
      ]
      function deepClone(prev: Type) {
        return [
          {
            ...(prev[0].a && {
              a: [
                {
                  ...(prev[0].a[0].b && {
                    b: [
                      {
                        ...(prev[0].a[0].b[0].c && {
                          c: [
                            {
                              ...(prev[0].a[0].b[0].c[0].d !== undefined && {
                                d: prev[0].a[0].b[0].c[0].d,
                              }),
                            },
                            ...(
                              prev[0].a[0].b[0].c.slice(1) as Array<{
                                E?: [string, ...{ F?: string }[]]
                              }>
                            ).map((value) => ({
                              ...(value.E && {
                                E: [
                                  value.E[0],
                                  ...(value.E.slice(1) as Array<{ F?: string }>).map(
                                    (value) => ({
                                      ...(value.F !== undefined && { F: value.F }),
                                    }),
                                  ),
                                ],
                              }),
                            })),
                          ],
                        }),
                      },
                      ...(prev[0].a[0].b.slice(1) as Array<{ G?: string }>).map(
                        (value) => ({
                          ...(value.G !== undefined && { G: value.G }),
                        }),
                      ),
                    ],
                  }),
                },
                ...(prev[0].a.slice(1) as Array<{ G?: string }>).map((value) => ({
                  ...(value.G !== undefined && { G: value.G }),
                })),
              ],
            }),
          },
          ...(prev.slice(1) as Array<{ H?: [string, ...{ I?: string }[]] }>).map(
            (value) => ({
              ...(value.H && {
                H: [
                  value.H[0],
                  ...(value.H.slice(1) as Array<{ I?: string }>).map((value) => ({
                    ...(value.I !== undefined && { I: value.I }),
                  })),
                ],
              }),
            }),
          ),
        ]
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.object', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(Schema.object({
        street1: Schema.string,
        street2: Schema.string,
        city: Schema.string,
      }, ['street1', 'city']), { typeName: 'Type' })
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
      JsonSchema.deepClone.writeable(
        Schema.object({
          a: Schema.array(Schema.number),
          b: Schema.string,
          c: Schema.object({
            d: Schema.object({
              e: Schema.array(Schema.boolean),
            })
          })
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
                  ...(prev.c.d.e && { e: prev.c.d.e.map((value) => value) }),
                },
              }),
            },
          }),
        }
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(Schema.object({}))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        return {}
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.object({
          a: Schema.object({
            b: Schema.string,
            c: Schema.string,
          }, ['b', 'c']),
          d: Schema.string,
          e: Schema.object({
            f: Schema.string,
            g: Schema.object({
              h: Schema.string,
              i: Schema.string,
            }, ['h', 'i'])
          }, ['f'])
        }, ['a', 'e']),
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
      JsonSchema.deepClone.writeable(
        Schema.object({
          b: Schema.array(
            Schema.object({
              c: Schema.array(
                Schema.object({
                  d: Schema.string
                }, ['d'])
              ),
            }, ['c'])
          )
        }, ['b']), {
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
      JsonSchema.deepClone.writeable(Schema.object({
        b: Schema.array(Schema.string),
        '0b': Schema.array(Schema.string),
        '00b': Schema.array(Schema.string),
        '-00b': Schema.array(Schema.string),
        '00b0': Schema.array(Schema.string),
        '--00b0': Schema.array(Schema.string),
        '-^00b0': Schema.array(Schema.string),
        '': Schema.array(Schema.string),
        '_': Schema.array(Schema.string),
      }, ['b', '0b', '00b', '-00b', '00b0', '--00b0', '-^00b0', '', '_']),
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

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.intersection', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.intersection([
          Schema.number,
          Schema.const(1),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = number & 1
      function deepClone(prev: Type) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.intersection([
          Schema.object({
            abc: Schema.string
          }, ['abc']),
          Schema.object({
            def: Schema.string
          }, ['def'])
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
      JsonSchema.deepClone.writeable(
        Schema.intersection([
          Schema.object({
            abc: Schema.string,
            def: Schema.object({
              ghi: Schema.string,
              jkl: Schema.string
            }, ['ghi', 'jkl'])
          }, ['abc', 'def']),
          Schema.object({
            mno: Schema.string,
            pqr: Schema.object({
              stu: Schema.string,
              vwx: Schema.string,
            }, ['stu', 'vwx'])
          }, ['mno', 'pqr'])
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
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.null,
          Schema.intersection([
            Schema.object({
              a: Schema.string
            }, ['a']),
            Schema.object({
              b: Schema.string
            }, ['b'])
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

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.union', () => {

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.number,
          Schema.string,
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number | string) {
        return prev
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.array(Schema.number),
          Schema.boolean,
          Schema.string
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = string | boolean | Array<number>
      function deepClone(prev: Type) {
        return typeof prev === "string"
          ? prev
          : typeof prev === "boolean"
            ? prev
            : prev.map((value) => value)
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.array(Schema.number),
          Schema.boolean,
          Schema.string,
          Schema.object({
            A: Schema.string
          }),
          Schema.union([
            Schema.object({
              B: Schema.const(100),
              C: Schema.const(200)
            })
          ])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | string
        | boolean
        | Array<number>
        | { A?: string }
        | { B?: 100; C?: 200 }
      function deepClone(prev: Type) {
        function check_0(value: any): value is { B?: 100; C?: 200 } {
          return (
            !!value &&
            typeof value === "object" &&
            (!Object.hasOwn(value, "B") || value.B === 100) &&
            (!Object.hasOwn(value, "C") || value.C === 200)
          )
        }
        function check_1(value: any): value is Array<number> {
          return (
            Array.isArray(value) && value.every((value) => Number.isFinite(value))
          )
        }
        function check_2(value: any): value is { A?: string } {
          return (
            !!value &&
            typeof value === "object" &&
            (!Object.hasOwn(value, "A") || typeof value.A === "string")
          )
        }
        return typeof prev === "string"
          ? prev
          : typeof prev === "boolean"
            ? prev
            : check_1(prev)
              ? prev.map((value) => value)
              : check_2(prev)
                ? {
                    ...(prev.A !== undefined && { A: prev.A }),
                  }
                : {
                    ...(prev.B !== undefined && { B: prev.B }),
                    ...(prev.C !== undefined && { C: prev.C }),
                  }
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.const('A'),
            onA: Schema.string,
          }, ['tag', 'onA']),
          Schema.object({
            tag: Schema.const('B'),
            onB: Schema.string,
          }, ['tag', 'onB']),
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
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.const([1, 2, 3]),
          Schema.const({ a: 'A', b: 'B' })
        ]),
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
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            a: Schema.const([1, 2, 3]),
            b: Schema.array(Schema.string)
          }),
          Schema.const({ c: 'C', d: 'D' })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { c: "C"; d: "D" } | { a?: [1, 2, 3]; b?: Array<string> }
      function deepClone(prev: Type) {
        function check_0(value: any): value is { c: "C"; d: "D" } {
          return (
            !!value && typeof value === "object" && value.c === "C" && value.d === "D"
          )
        }
        return check_0(prev)
          ? {
              c: prev.c,
              d: prev.d,
            }
          : {
              ...(prev.a && { a: [prev.a[0], prev.a[1], prev.a[2]] }),
              ...(prev.b && { b: prev.b.map((value) => value) }),
            }
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.number,
          Schema.object({
            street1: Schema.string,
            street2: Schema.string,
            city: Schema.string
          }, ['street1', 'city'])
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
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.const('ABC'),
            abc: Schema.number,
          }, ['tag', 'abc']),
          Schema.object({
            tag: Schema.const('DEF'),
            def: Schema.integer,
          }, ['tag', 'def'])
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
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.const('NON_DISCRIMINANT'),
            abc: Schema.number,
          }, ['tag', 'abc']),
          Schema.object({
            tag: Schema.const('NON_DISCRIMINANT'),
            def: Schema.integer,
          }, ['tag', 'def'])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: "NON_DISCRIMINANT"; abc: number }
        | { tag: "NON_DISCRIMINANT"; def: number }
      function deepClone(prev: Type) {
        function check_0(
          value: any,
        ): value is { tag: "NON_DISCRIMINANT"; abc: number } {
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
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag1: Schema.const('ABC'),
            abc: Schema.union([
              Schema.object({
                tag2: Schema.const('ABC_JKL'),
                jkl: Schema.union([
                  Schema.object({
                    tag3: Schema.const('ABC_JKL_ONE'),
                  }, ['tag3']),
                  Schema.object({
                    tag3: Schema.const('ABC_JKL_TWO'),
                  }, ['tag3']),
                ])
              }, ['tag2', 'jkl']),
              Schema.object({
                tag2: Schema.const('ABC_MNO'),
                mno: Schema.union([
                  Schema.object({
                    tag3: Schema.const('ABC_MNO_ONE'),
                  }, ['tag3']),
                  Schema.object({
                    tag3: Schema.const('ABC_MNO_TWO'),
                  }, ['tag3']),
                ])
              }, ['tag2', 'mno']),
            ])
          }, ['tag1', 'abc']),
          Schema.object({
            tag1: Schema.const('DEF'),
            def: Schema.union([
              Schema.object({
                tag2: Schema.const('DEF_PQR'),
                pqr: Schema.union([
                  Schema.object({
                    tag3: Schema.const('DEF_PQR_ONE'),
                  }, ['tag3']),
                  Schema.object({
                    tag3: Schema.const('DEF_PQR_TWO'),
                  }, ['tag3']),
                ])
              }, ['tag2', 'pqr']),
              Schema.object({
                tag2: Schema.const('DEF_STU'),
                stu: Schema.union([
                  Schema.object({
                    tag3: Schema.const('DEF_STU_ONE'),
                  }, ['tag3']),
                  Schema.object({
                    tag3: Schema.const('DEF_STU_TWO'),
                  }, ['tag3']),
                ])
              }, ['tag2', 'stu']),
            ])
          }, ['tag1', 'def']),
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
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.array(Schema.string),
          }, ['tag']),
          Schema.object({
            tag: Schema.const('B'),
            onB: Schema.array(Schema.string),
          }, ['tag']),
          Schema.object({
            tag: Schema.const('A'),
            onA: Schema.record({
              additionalProperties: Schema.array(
                Schema.object({
                  abc: Schema.number,
                })
              )
            })
          }, ['tag']),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: Array<string> }
        | { tag: "B"; onB?: Array<string> }
        | { tag: "A"; onA?: Record<string, Array<{ abc?: number }>> }
      function deepClone(prev: Type) {
        function check_0(value: any): value is { tag: Array<string> } {
          return (
            !!value &&
            typeof value === "object" &&
            Array.isArray(value.tag) &&
            value.tag.every((value) => typeof value === "string")
          )
        }
        function check_1(value: any): value is { tag: "B"; onB?: Array<string> } {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "B" &&
            (!Object.hasOwn(value, "onB") ||
              (Array.isArray(value.onB) &&
                value.onB.every((value) => typeof value === "string")))
          )
        }
        return check_0(prev)
          ? {
              tag: prev.tag.map((value) => value),
            }
          : check_1(prev)
            ? {
                tag: prev.tag,
                ...(prev.onB && { onB: prev.onB.map((value) => value) }),
              }
            : {
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
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.const('A'),
            onA: Schema.record({
              additionalProperties: Schema.array(
                Schema.object({
                  abc: Schema.number
                })
              )
            })
          }, ['tag']),
          Schema.object({
            tag: Schema.const('B'),
            onB: Schema.array(Schema.string)
          }, ['tag']),
          Schema.object({
            tag: Schema.const('C'),
            onC: Schema.string
          }, ['tag'])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: "A"; onA?: Record<string, Array<{ abc?: number }>> }
        | { tag: "B"; onB?: Array<string> }
        | { tag: "C"; onC?: string }
      function deepClone(prev: Type) {
        return prev.tag === "A"
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
          : prev.tag === "B"
            ? {
                tag: prev.tag,
                ...(prev.onB && { onB: prev.onB.map((value) => value) }),
              }
            : {
                tag: prev.tag,
                ...(prev.onC !== undefined && { onC: prev.onC }),
              }
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.union([
            Schema.object({ abc: Schema.string }, ['abc']),
            Schema.object({ def: Schema.string }, ['def'])
          ]),
          Schema.union([
            Schema.object({ ghi: Schema.string }, ['ghi']),
            Schema.object({ jkl: Schema.string }, ['jkl'])
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
        function check_0(value: any): value is { abc: string } {
          return !!value && typeof value === "object" && typeof value.abc === "string"
        }
        function check_2(value: any): value is { ghi: string } {
          return !!value && typeof value === "object" && typeof value.ghi === "string"
        }
        function check_4(value: any): value is { abc: string } | { def: string } {
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

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.const('A'),
            onA: Schema.union([
              Schema.string,
              Schema.array(Schema.string),
              Schema.boolean,
            ]),
          }),
          Schema.object({
            tag: Schema.const('B'),
            onB: Schema.object({
              C: Schema.union([
                Schema.string,
                Schema.array(Schema.string),
                Schema.boolean,
              ]),
            }),
          }),
        ]), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag?: "A"; onA?: boolean | string | Array<string> }
        | { tag?: "B"; onB?: { C?: boolean | string | Array<string> } }
      function deepClone(prev: Type) {
        return prev.tag === "A"
          ? {
              ...(prev.tag !== undefined && { tag: prev.tag }),
              ...(prev.onA && {
                onA:
                  typeof prev.onA === "boolean"
                    ? prev.onA
                    : typeof prev.onA === "string"
                      ? prev.onA
                      : prev.onA.map((value) => value),
              }),
            }
          : {
              ...(prev.tag !== undefined && { tag: prev.tag }),
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
            }
      }
      "
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/json-schema❳: JsonSchema.deepClone', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.array', () => {
    const clone_01 = JsonSchema.deepClone(
      Schema.array(
        Schema.object({
          firstName: Schema.string,
          lastName: Schema.string,
          address: Schema.object({
            street1: Schema.string,
            street2: Schema.string,
            city: Schema.string,
          }, ['street1', 'city'])
        }, ['firstName', 'address'])
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

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.tuple', () => {
    const clone_01 = JsonSchema.deepClone({
      type: 'array',
      prefixItems: [
        { type: 'number' },
        {
          type: 'array',
          prefixItems: [
            {
              type: 'object',
              required: ['a'],
              properties: {
                a: { type: 'boolean' }
              }
            }
          ]
        }
      ],
    })

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

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.tuple w/ rest', () => {
    const clone_01 = JsonSchema.deepClone({
      type: 'array',
      items: { type: 'array', items: { type: 'number' } },
      prefixItems: [
        { type: 'boolean' },
        { type: 'string' },
        { type: 'integer' }
      ],
    })

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

    const clone_02 = JsonSchema.deepClone({
      type: 'array',
      items: { type: 'boolean' },
      prefixItems: [
        {
          type: 'array',
          items: { type: 'boolean' }
        },
      ]
    })


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

    const clone_03 = JsonSchema.deepClone(
      Schema.tuple(
        [
          Schema.object({
            a: Schema.tuple(
              [
                Schema.object({
                  b: Schema.tuple(
                    [
                      Schema.object({
                        c: Schema.tuple(
                          [
                            Schema.object({
                              d: Schema.string,
                            })
                          ],
                          Schema.object({
                            E: Schema.tuple(
                              [
                                Schema.string,
                              ], Schema.object({
                                F: Schema.string,
                              })
                            )
                          })
                        ),
                      })
                    ],
                    Schema.object({
                      G: Schema.string
                    })
                  )
                })
              ], Schema.object({
                H: Schema.string
              })
            )
          })
        ],
        Schema.object({
          I: Schema.tuple([Schema.string], Schema.object({
            J: Schema.string,
          }))
        })
      )
    )

    vi.expect.soft(clone_03(
      [{ a: [{ b: [{ c: [{ d: 'hey' }] }] }] }] as never
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
      [{ a: [{ b: [{ c: [{ d: 'hey' }, { E: ['hey'] }] }] }] }] as never
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
      [{ a: [{ b: [{ c: [{ d: 'hey' }, { E: ['EE', { F: 'FF' }] }] }] }] }] as never
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
      ] as never
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
      ] as never
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

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.object', () => {
    const clone_01 = JsonSchema.deepClone(Schema.object({}))
    vi.expect.soft(clone_01({})).toMatchInlineSnapshot(`{}`)

    const clone_02 = JsonSchema.deepClone(
      Schema.object({
        a: Schema.object({
          b: Schema.string,
          c: Schema.string,
        }),
        d: Schema.string,
        e: Schema.object({
          f: Schema.string,
          g: Schema.object({
            h: Schema.string,
            i: Schema.string,
          }, ['h', 'i'])
        }, ['f'])
      }, ['a', 'e'])
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

    const clone_03 = JsonSchema.deepClone({
      type: 'object',
      required: ['a', 'b'],
      properties: {
        a: {
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        b: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            required: ['c'],
            properties: {
              c: {
                type: 'object',
                required: ['d', 'e'],
                properties: {
                  d: { type: 'string' },
                  e: {
                    type: 'object',
                    additionalProperties: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

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

    const clone_04 = JsonSchema.deepClone(
      Schema.object({
        b: Schema.array(
          Schema.object({
            c: Schema.array(
              Schema.object({
                d: Schema.string
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


    const clone_05 = JsonSchema.deepClone(
      Schema.object({
        b: Schema.array(Schema.string),
        '0b': Schema.array(Schema.string),
        '00b': Schema.array(Schema.string),
        '-00b': Schema.array(Schema.string),
        '00b0': Schema.array(Schema.string),
        '--00b0': Schema.array(Schema.string),
        '-^00b0': Schema.array(Schema.string),
        '': Schema.array(Schema.string),
        '_': Schema.array(Schema.string),
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

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.intersection', () => {
    const clone_01 = JsonSchema.deepClone(
      Schema.intersection([
        Schema.object({
          abc: Schema.string
        }),
        Schema.object({
          def: Schema.string
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

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.union', () => {
    const clone_01 = JsonSchema.deepClone(Schema.union([]))

    vi.expect.soft(clone_01(undefined as never)).toMatchInlineSnapshot(`undefined`)
    vi.expect.soft(clone_01(null as never)).toMatchInlineSnapshot(`null`)

    const clone_02 = JsonSchema.deepClone(
      Schema.union([
        Schema.number,
        Schema.object({
          street1: Schema.string,
          street2: Schema.string,
          city: Schema.string
        }, ['street1', 'city'])
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

    const clone_03 = JsonSchema.deepClone(
      Schema.union([
        Schema.object({
          yea: Schema.enum('YAY'),
          onYea: Schema.union([
            Schema.number,
            Schema.array(Schema.string)
          ]),
        }, ['yea', 'onYea']),
        Schema.object({
          boo: Schema.enum('NOO'),
          onBoo: Schema.union([
            Schema.object({
              tag: Schema.boolean,
              opt: Schema.string,
            }, ['tag']),
            Schema.record({ additionalProperties: Schema.string })
          ]),
        }, ['boo', 'onBoo']),
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

    const clone_04 = JsonSchema.deepClone(
      Schema.union([
        Schema.object({
          tag: Schema.enum('A'),
          onA: Schema.string,
        }, ['tag', 'onA']),
        Schema.object({
          tag: Schema.enum('B'),
          onB: Schema.string,
        }, ['tag', 'onB']),
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
