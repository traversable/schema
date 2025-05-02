import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'
import * as typebox from '@sinclair/typebox'
import { Decode } from '@sinclair/typebox/value'
import { Errors } from '@sinclair/typebox/errors'

import { t, recurse } from '@traversable/schema'

import * as Seed from './seed.js'
import * as Typebox from './to-typebox.js'
import { SchemaGenerator } from './test-utils.js'

const hasMessage = t.has('message', t.string)
const getErrorMessage = (e: unknown) => hasMessage(e) ? e.message : JSON.stringify(e, null, 2)

type LogFailureDeps = {
  Type?: typebox.TAnySchema
  t: t.Schema
  validData: unknown
  invalidData: unknown
}

const buildTable = ({ validData, invalidData, Type, t }: LogFailureDeps) => {
  return {
    'Input': JSON.stringify(validData, (_, v) => v === undefined ? 'undefined' : typeof v === 'symbol' ? String(v) : v),
    'Schema (typebox)': Type ? Typebox.stringFromTypebox(Type) : 'typebox schema is not defined',
    'Schema (typebox), stringified': JSON.stringify(Type, null, 2),
    'Schema (traversable)': recurse.toString(t),
    'Result (traversable, validData)': t(validData),
    'Result (traversable, invalidData)': t(invalidData),
    'Result (typebox, validData)': Type ? JSON.stringify([...Errors(Type, validData)]) : 'typebox schema is not defined',
    'Result (typebox, invalidData)': Type ? JSON.stringify([...Errors(Type, invalidData)]) : 'typebox schema is not defined',
  }
}

const logFailure = (logHeader: string, deps: LogFailureDeps) => {
  const table = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-typebox.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}

const logValidFailure = (logHeader: string, deps: LogFailureDeps) => {
  const { ["Result (traversable, invalidData)"]: _, ["Result (typebox, invalidData)"]: __, ...table } = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-typebox.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}

const logInvalidFailure = (logHeader: string, deps: LogFailureDeps) => {
  const { ["Result (traversable, validData)"]: _, ["Result (typebox, validData)"]: __, ...table } = buildTable(deps)
  console.group('\r\n\n\n[schema/test/to-typebox.test.ts]\nFAILURE: ' + logHeader)
  console.table(table)
  console.groupEnd()
}

vi.describe(
  '〖⛳️〗‹‹‹ ❲to-typebox❳: property-based tests',
  { timeout: 10_000 },
  () => {
    test.prop([fc.jsonValue()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Typebox.fromJson❳: constructs a typebox schema from arbitrary JSON input',
      (json) => vi.assert.doesNotThrow(() => Typebox.fromJson(json))
    )

    test.prop([fc.jsonValue()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Typebox.stringFromJson❳: generates a typebox schema from arbitrary JSON input',
      (json) => vi.assert.doesNotThrow(() => Typebox.stringFromJson(json))
    )

    test.prop([SchemaGenerator()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Typebox.fromTraversable❳: constructs a typebox schema from arbitrary traversable input',
      (seed) => {
        const validData = fc.sample(Seed.arbitraryFromSchema(seed), 1)[0]
        const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(seed), 1)[0]
        let Type: typebox.TAnySchema | undefined

        try { Type = Typebox.fromTraversable(seed) }
        catch (e) {
          void logFailure('Typebox.fromTraversable: construction', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.isDefined(Type); vi.assert.doesNotThrow(() => Decode(Type, validData)) }
        catch (e) {
          void logValidFailure('Typebox.fromTraversable: accepts valid data', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.isDefined(Type); vi.assert.throws(() => Decode(Type, invalidData)) }
        catch (e) {
          void logInvalidFailure('Typebox.fromTraversable: rejects invalid data', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }
      }
    )

    test.prop([SchemaGenerator()], {
      endOnFailure: true,
      // numRuns: 5_000,
    })(
      '〖⛳️〗› ❲Typebox.stringFromTraversable❳: generates a typebox schema from arbitrary traversable input',
      (seed) => {
        const validData = fc.sample(Seed.arbitraryFromSchema(seed), 1)[0]
        const invalidData = fc.sample(Seed.invalidArbitraryFromSchema(seed), 1)[0]
        let Type: typebox.TAnySchema | undefined

        try { Type = globalThis.Function('typebox', 'return ' + Typebox.stringFromTraversable(seed))(typebox) }
        catch (e) {
          void logFailure('Typebox.stringFromTraversable: construction', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try {
          vi.assert.isDefined(Type); vi.assert.doesNotThrow(() => Decode(Type, validData))
        }
        catch (e) {
          void logValidFailure('Typebox.stringFromTraversable: accepts valid data', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }

        try { vi.assert.isDefined(Type); vi.assert.throws(() => Decode(Type, invalidData)) }
        catch (e) {
          void logInvalidFailure('Typebox.stringFromTraversable: rejects invalid data', { Type, validData, invalidData, t: seed })
          vi.assert.fail(getErrorMessage(e))
        }
      }
    )
  }
)

vi.describe('〖⛳️〗‹‹‹ ❲to-typebox❳: example-based tests', () => {

  vi.it('〖⛳️〗› ❲Typebox.stringFromJson❳: examples', () => {
    vi.expect(Typebox.stringFromJson(
      { a: 1, b: [2, { c: '3' }], d: { e: false, f: true, g: [9000, null] } }
    )).toMatchInlineSnapshot
      (`"typebox.Object({ a: typebox.Literal(1), b: typebox.Tuple([typebox.Literal(2), typebox.Object({ c: typebox.Literal("3") })]), d: typebox.Object({ e: typebox.Literal(false), f: typebox.Literal(true), g: typebox.Tuple([typebox.Literal(9000), typebox.Null()]) }) })"`)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTraversable❳: examples', () => {
    vi.expect(Typebox.stringFromTraversable(
      t.never
    )).toMatchInlineSnapshot
      (`"typebox.Never()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.any
    )).toMatchInlineSnapshot
      (`"typebox.Any()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.unknown
    )).toMatchInlineSnapshot
      (`"typebox.Unknown()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.void
    )).toMatchInlineSnapshot
      (`"typebox.Void()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.null
    )).toMatchInlineSnapshot
      (`"typebox.Null()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.undefined
    )).toMatchInlineSnapshot
      (`"typebox.Undefined()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.boolean
    )).toMatchInlineSnapshot
      (`"typebox.Boolean()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.integer
    )).toMatchInlineSnapshot
      (`"typebox.Integer()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.integer.max(3)
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ maximum: 3 })"`)

    vi.expect(Typebox.stringFromTraversable(
      t.integer.min(3)
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ minimum: 3 })"`)

    vi.expect(Typebox.stringFromTraversable(
      t.integer.between(0, 2)
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ minimum: 0, maximum: 2 })"`)

    vi.expect(Typebox.stringFromTraversable(
      t.number.between(0, 2)
    )).toMatchInlineSnapshot
      (`"typebox.Number({ minimum: 0, maximum: 2 })"`)

    vi.expect(Typebox.stringFromTraversable(
      t.number.lessThan(0)
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMaximum: 0 })"`)

    vi.expect(Typebox.stringFromTraversable(
      t.number.moreThan(0)
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMinimum: 0 })"`)

    vi.expect(Typebox.stringFromTraversable(
      t.number.max(10).moreThan(0)
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMinimum: 0, maximum: 10 })"`)

    vi.expect(Typebox.stringFromTraversable(
      t.number
    )).toMatchInlineSnapshot
      (`"typebox.Number()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.string
    )).toMatchInlineSnapshot
      (`"typebox.String()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.bigint
    )).toMatchInlineSnapshot
      (`"typebox.BigInt()"`)

    vi.expect(Typebox.stringFromTraversable(
      t.array(t.boolean)
    )).toMatchInlineSnapshot
      (`"typebox.Array(typebox.Boolean())"`)

    vi.expect(Typebox.stringFromTraversable(
      t.tuple(t.null)
    )).toMatchInlineSnapshot
      (`"typebox.Tuple([typebox.Null()])"`)

    vi.expect(Typebox.stringFromTraversable(
      t.tuple(t.null, t.boolean)
    )).toMatchInlineSnapshot
      (`"typebox.Tuple([typebox.Null(), typebox.Boolean()])"`)

    vi.expect(Typebox.stringFromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) })
    )).toMatchInlineSnapshot
      (`"typebox.Object({ a: typebox.Null(), b: typebox.Boolean(), c: typebox.Optional(typebox.Union([typebox.Void(), typebox.Undefined()])) })"`)

    vi.expect(Typebox.stringFromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) }),
    )).toMatchInlineSnapshot
      (`"typebox.Object({ a: typebox.Null(), b: typebox.Boolean(), c: typebox.Optional(typebox.Union([typebox.Void(), typebox.Undefined()])) })"`)

    vi.expect(Typebox.stringFromTraversable(
      t.object({ a: t.null, b: t.boolean, c: t.optional(t.void) }),
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "typebox.Object({
        a: typebox.Null(),
        b: typebox.Boolean(),
        c: typebox.Optional(typebox.Union([typebox.Void(), typebox.Undefined()]))
      })"
    `)

    vi.expect(Typebox.stringFromTraversable(
      t.object({
        a: t.null,
        b: t.boolean,
        c: t.optional(
          t.object({
            d: t.void,
            e: t.tuple(
              t.union(
                t.object({
                  f: t.unknown,
                  g: t.null,
                  h: t.never,
                }),
                t.object({
                  i: t.boolean,
                  j: t.symbol,
                  k: t.array(
                    t.record(
                      t.any,
                    )
                  )
                })
              ),
              t.array(
                t.intersect(
                  t.object({
                    l: t.eq({
                      r: [{
                        s: 123,
                        t: [{
                          u: 456,
                        }],
                        v: 789,
                      }]
                    }),
                    m: t.null,
                    n: t.never,
                  }),
                  t.object({
                    o: t.boolean,
                    p: t.symbol,
                    q: t.array(
                      t.record(
                        t.any,
                      )
                    )
                  })
                )
              )
            )
          })
        )
      }),
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "typebox.Object({
        a: typebox.Null(),
        b: typebox.Boolean(),
        c: typebox.Optional(
          typebox.Object({
            d: typebox.Void(),
            e: typebox.Tuple([
              typebox.Union([
                typebox.Object({ f: typebox.Unknown(), g: typebox.Null(), h: typebox.Never() }),
                typebox.Object({
                  i: typebox.Boolean(),
                  j: typebox.Symbol(),
                  k: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                })
              ]),
              typebox.Array(
                typebox.Intersect([
                  typebox.Object({
                    l: typebox.Object({
                      r: typebox.Tuple([
                        typebox.Object({
                          s: typebox.Literal(123),
                          t: typebox.Tuple([typebox.Object({ u: typebox.Literal(456) })]),
                          v: typebox.Literal(789)
                        })
                      ])
                    }),
                    m: typebox.Null(),
                    n: typebox.Never()
                  }),
                  typebox.Object({
                    o: typebox.Boolean(),
                    p: typebox.Symbol(),
                    q: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                  })
                ])
              )
            ])
          })
        )
      })"
    `)
  })

  vi.it('〖⛳️〗› ❲Typebox.stringFromTypebox❳: examples', () => {
    vi.expect(Typebox.stringFromTypebox(
      typebox.Never(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Never()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Any(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Any()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Unknown(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Unknown()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Void(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Void()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Null(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Null()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Undefined(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Undefined()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Boolean(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Boolean()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Integer(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Integer()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Integer({ maximum: 3 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ maximum: 3 })"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Integer({ minimum: 3 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ minimum: 3 })"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Integer({ minimum: 0, maximum: 2 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Integer({ minimum: 0, maximum: 2 })"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Number({ minimum: 0, maximum: 2 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number({ minimum: 0, maximum: 2 })"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Number({ exclusiveMaximum: 0 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMaximum: 0 })"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Number({ exclusiveMinimum: 0 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMinimum: 0 })"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Number({ exclusiveMinimum: 0, maximum: 10 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number({ exclusiveMinimum: 0, maximum: 10 })"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Number(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Number()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.String(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.String()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.BigInt(),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.BigInt()"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Array(typebox.Boolean()),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Array(typebox.Boolean())"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Array(typebox.String(), { minItems: 10 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Array(typebox.String(), { minItems: 10 })"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Array(typebox.String(), { minimum: 1, maximum: 10 }),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Array(typebox.String())"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Tuple([typebox.Null()]),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Tuple([typebox.Null()])"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Tuple([typebox.Null(), typebox.Boolean()]),
      { format: true }
    )).toMatchInlineSnapshot
      (`"typebox.Tuple([typebox.Null(), typebox.Boolean()])"`)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Object({
        a: typebox.Null(),
        b: typebox.Boolean(),
        c: typebox.Optional(typebox.Union([typebox.Literal(1), typebox.Literal(2), typebox.Literal(3)]))
      }),
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "typebox.Object({
        a: typebox.Null(),
        b: typebox.Boolean(),
        c: typebox.Optional(typebox.Union([typebox.Literal(1), typebox.Literal(2), typebox.Literal(3)]))
      })"
    `)

    vi.expect(Typebox.stringFromTypebox(
      typebox.Object({
        a: typebox.Null(),
        b: typebox.Boolean(),
        c: typebox.Optional(
          typebox.Object({
            d: typebox.Void(),
            e: typebox.Tuple([
              typebox.Union([
                typebox.Object({ f: typebox.Unknown(), g: typebox.Null(), h: typebox.Never() }),
                typebox.Object({
                  i: typebox.Boolean(),
                  j: typebox.Symbol(),
                  k: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                })
              ]),
              typebox.Array(
                typebox.Intersect([
                  typebox.Object({
                    l: typebox.Object({
                      r: typebox.Tuple([
                        typebox.Object({
                          s: typebox.Literal(123),
                          t: typebox.Tuple([typebox.Object({ u: typebox.Literal(456) })]),
                          v: typebox.Literal(789)
                        })
                      ])
                    }),
                    m: typebox.Null(),
                    n: typebox.Never()
                  }),
                  typebox.Object({
                    o: typebox.Boolean(),
                    p: typebox.Symbol(),
                    q: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                  })
                ])
              )
            ])
          })
        )
      }),
      { format: true }
    )).toMatchInlineSnapshot
      (`
      "typebox.Object({
        a: typebox.Null(),
        b: typebox.Boolean(),
        c: typebox.Optional(
          typebox.Object({
            d: typebox.Void(),
            e: typebox.Tuple([
              typebox.Union([
                typebox.Object({ f: typebox.Unknown(), g: typebox.Null(), h: typebox.Never() }),
                typebox.Object({
                  i: typebox.Boolean(),
                  j: typebox.Symbol(),
                  k: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                })
              ]),
              typebox.Array(
                typebox.Intersect([
                  typebox.Object({
                    l: typebox.Object({
                      r: typebox.Tuple([
                        typebox.Object({
                          s: typebox.Literal(123),
                          t: typebox.Tuple([typebox.Object({ u: typebox.Literal(456) })]),
                          v: typebox.Literal(789)
                        })
                      ])
                    }),
                    m: typebox.Null(),
                    n: typebox.Never()
                  }),
                  typebox.Object({
                    o: typebox.Boolean(),
                    p: typebox.Symbol(),
                    q: typebox.Array(typebox.Record(typebox.String(), typebox.Any()))
                  })
                ])
              )
            ])
          })
        )
      })"
    `)
  })

  vi.it('〖⛳️〗› ❲Typebox.fromJson❳: examples', () => {
    vi.expect(Typebox.fromJson(
      { a: 1, b: [-2, { c: '3' }], d: { e: false, f: true, g: [9000, null] } }
    )).toMatchInlineSnapshot
      (`
      {
        "properties": {
          "a": {
            "const": 1,
            "type": "number",
            Symbol(TypeBox.Kind): "Literal",
          },
          "b": {
            "additionalItems": false,
            "items": [
              {
                "const": -2,
                "type": "number",
                Symbol(TypeBox.Kind): "Literal",
              },
              {
                "properties": {
                  "c": {
                    "const": "3",
                    "type": "string",
                    Symbol(TypeBox.Kind): "Literal",
                  },
                },
                "required": [
                  "c",
                ],
                "type": "object",
                Symbol(TypeBox.Kind): "Object",
              },
            ],
            "maxItems": 2,
            "minItems": 2,
            "type": "array",
            Symbol(TypeBox.Kind): "Tuple",
          },
          "d": {
            "properties": {
              "e": {
                "const": false,
                "type": "boolean",
                Symbol(TypeBox.Kind): "Literal",
              },
              "f": {
                "const": true,
                "type": "boolean",
                Symbol(TypeBox.Kind): "Literal",
              },
              "g": {
                "additionalItems": false,
                "items": [
                  {
                    "const": 9000,
                    "type": "number",
                    Symbol(TypeBox.Kind): "Literal",
                  },
                  {
                    "type": "null",
                    Symbol(TypeBox.Kind): "Null",
                  },
                ],
                "maxItems": 2,
                "minItems": 2,
                "type": "array",
                Symbol(TypeBox.Kind): "Tuple",
              },
            },
            "required": [
              "e",
              "f",
              "g",
            ],
            "type": "object",
            Symbol(TypeBox.Kind): "Object",
          },
        },
        "required": [
          "a",
          "b",
          "d",
        ],
        "type": "object",
        Symbol(TypeBox.Kind): "Object",
      }
    `)
  })
})

