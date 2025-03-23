import * as vi from 'vitest'
import { test } from '@fast-check/vitest'
import { deepStrictEqual } from 'node:assert/strict'

import { symbol, URI } from '@traversable/registry'
import { t } from '@traversable/schema'
import { JsonSchema, toJsonSchema, fromJsonSchema } from '@traversable/schema-to-json-schema'

import * as Seed from './seed.js'

const exclude = ['symbol', 'null', 'bigint', 'undefined', 'void', 'never'] as const satisfies string[]
const seed = Seed.schema({ exclude })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-json-schema❳', () => {
  vi.it('〖⛳️〗› ❲JsonSchema.minItems❳', () => {
    const {
      OptionalSchema: optional,
      NumberSchema: number,
      BooleanSchema: boolean,
      StringSchema: string
    } = JsonSchema
    vi.assert.equal(JsonSchema.minItems([]), 0)
    vi.assert.equal(JsonSchema.minItems([optional(string)]), 0)
    vi.assert.equal(JsonSchema.minItems([number, optional(string)]), 1)
    vi.assert.equal(JsonSchema.minItems([number, optional(string), boolean]), 1)
    vi.assert.equal(JsonSchema.minItems([number, optional(string), optional(boolean)]), 1)
    vi.assert.equal(JsonSchema.minItems([number, boolean]), 2)

    vi.assert.equal(JsonSchema.minItems([]), 0)
    vi.assert.equal(JsonSchema.minItems([t.optional(t.string)]), 0)
    vi.assert.equal(JsonSchema.minItems([t.number, t.optional(t.string)]), 1)
    vi.assert.equal(JsonSchema.minItems([t.number, t.optional(t.string), t.boolean]), 1)
    vi.assert.equal(JsonSchema.minItems([t.number, t.optional(t.string), t.optional(t.boolean)]), 1)
    vi.assert.equal(JsonSchema.minItems([t.number, t.boolean]), 2)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳: jsonSchema', () => {
  test.prop([seed], {
    // numRuns: 50_000
  })('〖⛳️〗› ❲fromJsonSchema(...).jsonSchema❳: roundtrips', (schema) => {
    if (typeof schema.jsonSchema !== 'function') vi.assert.fail()
    const jsonSchema = schema.jsonSchema()
    if (jsonSchema === void 0) vi.assert.fail()
    const from = fromJsonSchema(jsonSchema)
    const roundTrip = from.jsonSchema()

    try {
      deepStrictEqual(roundTrip, jsonSchema)
    } catch (e) {
      console.log()
      console.log()
      console.log()
      console.group('THAT SHIT FAILED TO ROUNDTRIP')
      console.log('\n')
      console.log('Schema:')
      console.log(schema)
      console.log('JSON Schema:')
      console.log(JSON.stringify(jsonSchema, null, 2))
      console.log(jsonSchema)
      console.log('\n\r')
      console.log('Roundtrip:')
      console.log(JSON.stringify(roundTrip, null, 2))
      console.log(roundTrip)
      console.log('\n\r')
      console.groupEnd()
    }
    vi.assert.deepEqual(roundTrip, jsonSchema)
  })

  vi.it('〖⛳️〗› ❲JsonSchema.object❳: ', () => {
    vi.expect(t.object({ abc: t.object({ def: t.object({ ghi: t.boolean }) }), jkl: t.optional(t.string) }).jsonSchema()).toMatchInlineSnapshot(`
      {
        "properties": {
          "abc": {
            "properties": {
              "def": {
                "properties": {
                  "ghi": {
                    "type": "boolean",
                  },
                },
                "required": [
                  "ghi",
                ],
                "type": "object",
              },
            },
            "required": [
              "def",
            ],
            "type": "object",
          },
          "jkl": {
            "type": "string",
          },
        },
        "required": [
          "abc",
        ],
        "type": "object",
      }
    `)
  })

  vi.it('〖⛳️〗› ❲JsonSchema.tuple❳: ', () => {
    vi.assert.deepEqual(t.tuple().jsonSchema(), {
      "additionalItems": false,
      "items": [],
      "maxItems": 0,
      "minItems": 0,
      "type": "array",
    })
    vi.assert.deepEqual(t.tuple(t.number).jsonSchema(), {
      "additionalItems": false,
      "items": [{ type: 'number' }],
      minItems: 1,
      maxItems: 1,
      type: "array",
    })

    vi.assert.deepEqual(t.tuple(t.number, t.string).jsonSchema(), {
      "additionalItems": false,
      "items": [{ type: 'number' }, { type: 'string' }],
      minItems: 2,
      maxItems: 2,
      type: "array",
    })

    vi.assert.deepEqual(t.tuple(t.number, t.optional(t.string)).jsonSchema(), {
      "additionalItems": false,
      "items": [{ type: 'number' }, { type: 'string' }],
      minItems: 1,
      maxItems: 2,
      type: "array",
    })

    vi.assert.deepEqual(t.tuple(t.number, t.optional(t.optional(t.string))).jsonSchema(), {
      "additionalItems": false,
      "items": [{ type: 'number' }, { type: 'string' }],
      minItems: 1,
      maxItems: 2,
      type: "array",
    })

    vi.assert.deepEqual(t.tuple(t.number, t.optional(t.boolean), t.optional(t.optional(t.string))).jsonSchema(), {
      "additionalItems": false,
      "items": [{ type: 'number' }, { type: 'boolean' }, { type: 'string' }],
      minItems: 1,
      maxItems: 3,
      type: "array",
    })

    vi.assert.deepEqual(t.tuple(t.optional(t.number)).jsonSchema(), {
      "additionalItems": false,
      "items": [{ type: 'number' }],
      minItems: 0,
      maxItems: 1,
      type: "array",
    })

    vi.assert.deepEqual(t.tuple(t.optional(t.number), t.optional(t.string)).jsonSchema(), {
      "additionalItems": false,
      "items": [{ type: 'number' }, { type: 'string' }],
      minItems: 0,
      maxItems: 2,
      type: "array",
    })

    vi.assert.deepEqual(t.tuple(t.unknown, t.unknown, t.optional(t.number), t.optional(t.string)).jsonSchema(), {
      "additionalItems": false,
      "items": [
        { type: 'object', nullable: true, properties: {} },
        { type: 'object', nullable: true, properties: {} },
        { type: 'number' },
        { type: 'string' }
      ],
      minItems: 2,
      maxItems: 4,
      type: "array",
    })
    vi.expect(t.tuple(t.number, t.tuple(), t.optional(t.tuple(t.string, t.optional(t.boolean)))).jsonSchema()).toMatchInlineSnapshot(`
      {
        "additionalItems": false,
        "items": [
          {
            "type": "number",
          },
          {
            "additionalItems": false,
            "items": [],
            "maxItems": 0,
            "minItems": 0,
            "type": "array",
          },
          {
            "additionalItems": false,
            "items": [
              {
                "type": "string",
              },
              {
                "type": "boolean",
              },
            ],
            "maxItems": 2,
            "minItems": 1,
            "type": "array",
          },
        ],
        "maxItems": 3,
        "minItems": 2,
        "type": "array",
      }
    `)
  })

  vi.it('〖⛳️〗› ❲JsonSchema.array❳: ', () => {
    vi.expect(t.tuple(t.number, t.tuple(), t.optional(t.tuple(t.string, t.optional(t.boolean)))).jsonSchema()).toMatchInlineSnapshot(`
      {
        "additionalItems": false,
        "items": [
          {
            "type": "number",
          },
          {
            "additionalItems": false,
            "items": [],
            "maxItems": 0,
            "minItems": 0,
            "type": "array",
          },
          {
            "additionalItems": false,
            "items": [
              {
                "type": "string",
              },
              {
                "type": "boolean",
              },
            ],
            "maxItems": 2,
            "minItems": 1,
            "type": "array",
          },
        ],
        "maxItems": 3,
        "minItems": 2,
        "type": "array",
      }
    `)
  })

  // TODO: get `jsonSchema` working for inline schemas
  // vi.it('〖⛳️〗› ❲t.inline❳', () => vi.assert.deepEqual(t.inline((_) => _ instanceof Error).jsonSchema(), void 0))
  vi.it('〖⛳️〗› ❲t.never❳', () => vi.assert.deepEqual(t.never.jsonSchema(), void 0))
  vi.it('〖⛳️〗› ❲t.void❳', () => vi.assert.deepEqual(t.void.jsonSchema(), void 0))
  vi.it('〖⛳️〗› ❲t.symbol❳', () => vi.assert.deepEqual(t.symbol.jsonSchema(), void 0))
  vi.it('〖⛳️〗› ❲t.undefined❳', () => vi.assert.deepEqual(t.undefined.jsonSchema(), void 0))
  vi.it('〖⛳️〗› ❲t.bigint❳', () => vi.assert.deepEqual(t.bigint.jsonSchema(), void 0))
  vi.it('〖⛳️〗› ❲t.null❳', () => vi.assert.deepEqual(t.null.jsonSchema(), { type: 'null', enum: [null] }))
  vi.it('〖⛳️〗› ❲t.any❳', () => vi.assert.deepEqual(t.any.jsonSchema(), { nullable: true, properties: {}, type: 'object' }))
  vi.it('〖⛳️〗› ❲t.unknown❳', () => vi.assert.deepEqual(t.unknown.jsonSchema(), { nullable: true, properties: {}, type: 'object' }))
  vi.it('〖⛳️〗› ❲t.boolean❳', () => vi.assert.deepEqual(t.boolean.jsonSchema(), { type: 'boolean' }))
  vi.it('〖⛳️〗› ❲t.integer❳', () => vi.assert.deepEqual(t.integer.jsonSchema(), { type: 'integer' }))
  vi.it('〖⛳️〗› ❲t.number❳', () => vi.assert.deepEqual(t.number.jsonSchema(), { type: 'number' }))
  vi.it('〖⛳️〗› ❲t.string❳', () => vi.assert.deepEqual(t.string.jsonSchema(), { type: 'string' }))

  vi.it('〖⛳️〗› ❲t.enum❳', () => {
    const ex_01 = t.enum(null, undefined, false, Symbol(), 0n, 1, 'hey')
    vi.assert.deepEqual(ex_01.jsonSchema(), { enum: [null, void 0, false, void 0, void 0, 1, "hey"] })
    vi.assertType<{ enum: [null, void, false, void, void, 1, "hey"] }>(ex_01.jsonSchema())
    const stooges = { Larry: 'larry', Curly: 'curly', Moe: 'moe' } as const
    const ex_02 = t.enum(stooges)
    vi.assert.deepEqual(ex_02.jsonSchema(), { enum: Object.values(stooges) })
    vi.assertType<{ enum: typeof stooges[keyof typeof stooges][] }>(ex_02.jsonSchema())
  })

  vi.it('〖⛳️〗› ❲t.array❳', () => {
    const ex_01 = t.array(t.string)
    vi.assert.deepEqual(ex_01.jsonSchema(), { type: 'array', items: { type: 'string' } })
    vi.assertType<{ type: 'array', items: { type: 'string' } }>(ex_01.jsonSchema())
    const ex_02 = t.array(t.array(t.string))
    vi.assert.deepEqual(ex_02.jsonSchema(), { type: 'array', items: { type: 'array', items: { type: 'string' } } })
    vi.assertType<{ type: 'array', items: { type: 'array', items: { type: 'string' } } }>(ex_02.jsonSchema())
  })

  vi.it('〖⛳️〗› ❲t.optional❳', () => {
    const ex_01 = t.optional(t.string)
    vi.assert.deepEqual(ex_01.jsonSchema(), { type: 'string' })
    vi.assertType<{ type: 'string' }>(ex_01.jsonSchema())
    const ex_02 = t.optional(t.optional(t.string))
    vi.assert.deepEqual(ex_02.jsonSchema(), { type: 'string' })
    vi.assertType<{ type: 'string' }>(ex_02.jsonSchema())
  })

  vi.it('〖⛳️〗› ❲t.eq❳', () => {
    const ex_00 = t.eq(null)
    vi.assert.deepEqual(ex_00.jsonSchema(), { const: null })
    vi.assertType<{ const: null }>(ex_00.jsonSchema())
    const ex_01 = t.eq(100)
    vi.assert.deepEqual(ex_01.jsonSchema(), { const: 100 })
    vi.assertType<{ const: 100 }>(ex_01.jsonSchema())
    const ex_02 = t.eq([1, 20, 300, 4000])
    vi.assert.deepEqual(ex_02.jsonSchema(), { const: [1, 20, 300, 4000] })
    vi.assertType<{ const: [1, 20, 300, 4000] }>(ex_02.jsonSchema())
    const ex_03 = t.eq({ x: [1, 20, 300, 4000], y: { z: 9000 } })
    vi.assert.deepEqual(ex_03.jsonSchema(), { const: { x: [1, 20, 300, 4000], y: { z: 9000 } } })
    vi.assertType<{ const: { x: [1, 20, 300, 4000], y: { z: 9000 } } }>(ex_03.jsonSchema())
  })

  vi.it('〖⛳️〗› ❲t.record❳', () => {
    const ex_01 = t.record(t.string)
    vi.assert.deepEqual(ex_01.jsonSchema(), { type: 'object', additionalProperties: { type: 'string' } })
    vi.assertType<{ type: 'object', additionalProperties: { type: 'string' } }>(ex_01.jsonSchema())
    const ex_02 = t.record(t.record(t.string))
    vi.assert.deepEqual(ex_02.jsonSchema(), { type: 'object', additionalProperties: { type: 'object', additionalProperties: { type: 'string' } } })
    vi.assertType<{ type: 'object', additionalProperties: { type: 'object', additionalProperties: { type: 'string' } } }>(ex_02.jsonSchema())
  })

  vi.it('〖⛳️〗› ❲t.intersect❳', () => {
    const ex_00 = t.intersect()
    vi.assert.deepEqual(ex_00.jsonSchema(), { allOf: [] })
    vi.assertType<{ allOf: [] }>(ex_00.jsonSchema())

    const ex_01 = t.intersect(t.object({ x: t.number }), t.object({ y: t.optional(t.number) }))
    vi.assert.deepEqual(
      ex_01.jsonSchema(), {
      allOf: [
        { type: 'object', required: ['x'], properties: { x: { type: 'number' } } },
        { type: 'object', required: [], properties: { y: { type: 'number' } } as never }
      ]
    })

    vi.assertType<{
      allOf: [
        { type: 'object', required: 'x'[], properties: { x: { type: 'number' } } },
        { type: 'object', required: [], properties: { y: { type: 'number' } } }
      ]
    }>(ex_01.jsonSchema())
  })

  vi.it('〖⛳️〗› ❲t.union❳', () => {
    const ex_00 = t.union()
    vi.assert.deepEqual(ex_00.jsonSchema(), { anyOf: [] })
    vi.assertType<{ anyOf: [] }>(ex_00.jsonSchema())
    const ex_01 = t.union(t.object({ x: t.number }), t.object({ y: t.optional(t.number) }))
    vi.assert.deepEqual(
      ex_01.jsonSchema(), {
      anyOf: [
        { type: 'object', required: ['x'], properties: { x: { type: 'number' } } },
        { type: 'object', required: [], properties: { y: { type: 'number' } } as never }
      ]
    })
    vi.assertType<{
      anyOf: [
        { type: 'object', required: 'x'[], properties: { x: { type: 'number' } } },
        { type: 'object', required: [], properties: { y: { type: 'number' } } }
      ]
    }>(ex_01.jsonSchema())
  })

  vi.it('〖⛳️〗› ❲t.tuple❳', () => {
    const ex_01 = t.tuple()
    vi.assert.deepEqual(
      ex_01.jsonSchema(),
      { additionalItems: false, type: 'array', maxItems: 0, minItems: 0, items: [] }
    )
    vi.assertType<
      { additionalItems: false, type: 'array', maxItems: 0, minItems: 0, items: [] }
    >(ex_01.jsonSchema())
    const ex_02 = t.tuple(t.object({ x: t.number }), t.object({ y: t.optional(t.number) }))
    vi.assert.deepEqual(
      ex_02.jsonSchema(), {
      additionalItems: false,
      type: 'array',
      maxItems: 2,
      minItems: 2,
      items: [
        { type: 'object', required: ['x'], properties: { x: { type: 'number' } } },
        { type: 'object', required: [], properties: { y: { type: 'number' } } as never },
      ],
    })
    vi.assertType<{
      additionalItems: false,
      type: 'array',
      maxItems: 2,
      minItems: 2,
      items: [
        { type: 'object', required: 'x'[], properties: { x: { type: 'number' } } },
        { type: 'object', required: [], properties: { y: { type: 'number' } } },
      ],
    }>(ex_02.jsonSchema())
  })

  vi.it('〖⛳️〗› ❲t.toJsonSchema❳: works with schemas defined using `@traversable/schema-to-json-schema', () => {

    vi.assert.deepEqual(toJsonSchema(t.unknown)(), JsonSchema.RAW.any)
    vi.assert.deepEqual(toJsonSchema(t.null)(), { type: 'null', enum: [null] })
    vi.assert.deepEqual(toJsonSchema(t.boolean)(), { type: 'boolean' })
    vi.assert.deepEqual(toJsonSchema(t.integer)(), { type: 'integer' })
    vi.assert.deepEqual(toJsonSchema(t.number)(), { type: 'number' })
    vi.assert.deepEqual(toJsonSchema(t.string)(), { type: 'string' })
    vi.assert.deepEqual(toJsonSchema(t.array(t.string))(), { type: 'array', items: { type: 'string' } })
    vi.assert.deepEqual(toJsonSchema(t.record(t.string))(), { type: 'object', additionalProperties: { type: 'string' } })
    vi.assert.deepEqual(toJsonSchema(t.optional(t.number))(), { type: 'number' })
    vi.assert.deepEqual(toJsonSchema(t.optional(t.optional(t.number)))(), { type: 'number' })
    vi.assert.deepEqual(toJsonSchema(t.object({ a: t.number }))(), { type: 'object', required: ['a'], properties: { a: { type: 'number' } } })
    vi.assert.deepEqual(
      toJsonSchema(t.object({ a: t.number, b: t.optional(t.string) }))(),
      { type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } }
    )
  })

  vi.it('〖⛳️〗› ❲t.toJsonSchema❳: works with schemas defined using `@traversable/schema-core', () => {
    vi.assert.deepEqual(toJsonSchema(t.never)(), void 0)
    vi.assert.deepEqual(toJsonSchema(t.bigint)(), void 0)
    vi.assert.deepEqual(toJsonSchema(t.symbol)(), void 0)
    vi.assert.deepEqual(toJsonSchema(t.undefined)(), void 0)
    vi.assert.deepEqual(toJsonSchema(t.void)(), void 0)
    vi.assert.deepEqual(toJsonSchema(t.any)(), { type: 'object', properties: {}, nullable: true })
    vi.assert.deepEqual(toJsonSchema(t.unknown)(), { type: 'object', properties: {}, nullable: true })
    vi.assert.deepEqual(toJsonSchema(t.null)(), { type: 'null', enum: [null] })
    vi.assert.deepEqual(toJsonSchema(t.boolean)(), { type: 'boolean' })
    vi.assert.deepEqual(toJsonSchema(t.integer)(), { type: 'integer' })
    vi.assert.deepEqual(toJsonSchema(t.number)(), { type: 'number' })
    vi.assert.deepEqual(toJsonSchema(t.string)(), { type: 'string' })
    vi.assert.deepEqual(toJsonSchema(t.eq(100))(), { const: 100 })
    vi.assert.deepEqual(toJsonSchema(t.array(t.string))(), { type: 'array', items: { type: 'string' } })
    vi.assert.deepEqual(toJsonSchema(t.record(t.string))(), { type: 'object', additionalProperties: { type: 'string' } })
    vi.assert.deepEqual(toJsonSchema(t.optional(t.number))(), { type: 'number' })
    vi.assert.deepEqual(toJsonSchema(t.optional(t.optional(t.number)))(), { type: 'number' })
    vi.assert.deepEqual(toJsonSchema(t.optional(t.optional(t.optional(t.number))))(), { type: 'number' })
    // vi.assert.deepEqual(toJsonSchema(t.optional(t.number)), { type: 'number' })
    // vi.assert.deepEqual(toJsonSchema(t.optional(t.optional(t.number))), { type: 'number' })
    // vi.assert.deepEqual(toJsonSchema(t.optional(t.optional(t.optional(t.number)))), { type: 'number' })
    vi.assert.deepEqual(toJsonSchema(t.object({ a: t.number }))(), { type: 'object', required: ['a'], properties: { a: { type: 'number' } } })

    vi.assert.deepEqual(
      toJsonSchema(
        t.tuple(
          t.object({
            p: t.array(t.array(t.record(t.optional(t.boolean)))),
            q: t.optional(t.number),
            r: t.eq(100),
          }),
          t.object({
            s: t.optional(t.number),
            t: t.optional(
              t.object({
                u: t.intersect(),
                v: t.union(t.object({ w: t.any, x: t.tuple() }))
              })
            )
          })
        )
      )(),
      {
        type: 'array',
        additionalItems: false,
        maxItems: 2,
        minItems: 2,
        items: [
          {
            type: 'object',
            required: ['p', 'r'],
            properties: {
              p: {
                type: 'array',
                items: {
                  type: 'array',
                  items: { type: 'object', additionalProperties: { type: 'boolean' } }
                }
              },
              q: { type: 'number' },
              r: { const: 100 },
            },
          },
          {
            type: 'object',
            required: [],
            properties: {
              s: { type: 'number' },
              t: {
                type: 'object',
                required: ['u', 'v'],
                properties: {
                  u: { allOf: [] },
                  v: {
                    anyOf: [{
                      type: 'object',
                      required: ['w', 'x'],
                      properties: {
                        w: { type: 'object', properties: {}, nullable: true },
                        x: { type: 'array', items: [], minItems: 0, maxItems: 0, additionalItems: false },
                      }
                    }],
                  },
                }
              },
            },
          },
        ],
      }
    )

    vi.assert.deepEqual(
      toJsonSchema(
        t.union(
          t.object({ x: t.number }),
          t.object({ y: t.optional(t.number) })
        )
      )(),
      {
        anyOf: [
          { type: 'object', required: ['x'], properties: { x: { type: 'number' } } },
          { type: 'object', required: [], properties: { y: { type: 'number' } } },
        ],
      }
    )

    vi.assert.deepEqual(
      toJsonSchema(t.tuple(t.object({ a: t.number })))(),
      {
        type: 'array',
        additionalItems: false,
        maxItems: 1,
        minItems: 1,
        items: [{ properties: { a: { type: 'number', }, }, required: ['a'], type: 'object' }],
      }
    )

    vi.assert.deepEqual(
      toJsonSchema(
        t.union(
          t.object({ x: t.number }),
          t.object({ y: t.optional(t.number) })
        )
      )(),
      {
        anyOf: [
          { type: 'object', required: ['x'], properties: { x: { type: 'number' } } },
          { type: 'object', required: [], properties: { y: { type: 'number' } } },
        ],
      }
    )

    vi.assert.deepEqual(
      toJsonSchema(t.tuple(t.object({ a: t.number })))(),
      {
        type: 'array',
        additionalItems: false,
        maxItems: 1,
        minItems: 1,
        items: [{ properties: { a: { type: 'number', }, }, required: ['a'], type: 'object' }],
      }
    )
  })

  vi.it('〖⛳️〗› ❲t.fromJsonSchema❳', () => {
    vi.assert.deepEqual(
      t.tuple(t.string, t.optional(t.boolean), t.optional(t.number)).jsonSchema(),
      {
        type: 'array',
        items: [
          { type: 'string' },
          { type: 'boolean' },
          { type: 'number' }
        ],
        minItems: 1,
        maxItems: 3,
        additionalItems: false,
      }
    )

    vi.assert.deepEqual(
      fromJsonSchema(
        {
          type: 'array',
          items: [
            { type: 'string' },
            { type: 'boolean' },
            { type: 'number' }
          ],
          minItems: 1,
          maxItems: 3,
          additionalItems: false,
        }
      ).jsonSchema(),
      { type: 'array', items: [{ type: 'string' }, { type: 'boolean' }, { type: 'number' }], minItems: 1, maxItems: 3, additionalItems: false },
    )

    vi.assert.isTrue(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'string' }, b: { type: 'number' } } })({ a: 'hey' }))
    vi.assert.isTrue(t.object({ a: t.optional(t.string) })({ a: '' }))
    vi.assert.deepEqual(fromJsonSchema(JsonSchema.RAW.any), t.unknown)
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', properties: {}, nullable: true }), t.unknown)
    vi.assert.deepEqual(fromJsonSchema({ type: 'null', enum: [null] }), t.null)
    vi.assert.deepEqual(fromJsonSchema({ type: 'boolean' }), t.boolean)
    vi.assert.deepEqual(fromJsonSchema({ type: 'integer' }), t.integer)
    vi.assert.deepEqual(fromJsonSchema({ type: 'number' }), t.number)
    vi.assert.deepEqual(fromJsonSchema({ type: 'string' }), t.string)
    vi.assert.deepEqual(fromJsonSchema({ const: 100 }).def, 100)
    vi.assert.deepEqual(fromJsonSchema({ type: 'array', items: { type: 'string' } }).tag, URI.array)
    vi.assert.deepEqual((fromJsonSchema({ type: 'array', items: { type: 'string' } }).def as { tag: string }).tag, URI.string)
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', additionalProperties: { type: 'string' } }).tag, URI.record)
    vi.assert.deepEqual((fromJsonSchema({ type: 'object', additionalProperties: { type: 'string' } }).def as { tag: string }).tag, URI.string)
    vi.assert.deepEqual(fromJsonSchema({ type: 'number' }).tag, URI.number)
    fromJsonSchema({ type: 'number' })
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' } } }).tag, URI.object)
    vi.assert.deepEqual(
      (fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } }).def as { a?: { tag?: string } })?.a?.tag,
      URI.number
    )
    vi.assert.deepEqual(
      (fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } }).def as { b?: { tag?: string } })?.b?.tag,
      URI.optional,
    )
    vi.assert.deepEqual(
      (fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } }).def as { b?: { def?: { tag?: string } } })?.b?.def?.tag,
      URI.string
    )
  })

  vi.it('〖⛳️〗› ❲t.fromJsonSchema❳: schemaToString', () => {
    vi.assert.isTrue(fromJsonSchema({ const: 100 })(100))
    vi.assert.isFalse(fromJsonSchema({ const: 100 })(99))
    vi.assert.isTrue(fromJsonSchema({ type: 'array', items: { type: 'string' } })([]))
    vi.assert.isTrue(fromJsonSchema({ type: 'array', items: { type: 'string' } })(['hey']))
    vi.assert.isFalse(fromJsonSchema({ type: 'array', items: { type: 'string' } })([0]))
    vi.assert.isTrue(fromJsonSchema({ type: 'object', additionalProperties: { type: 'string' } })({}))
    vi.assert.isTrue(fromJsonSchema({ type: 'object', additionalProperties: { type: 'string' } })({ x: 'y' }))
    vi.assert.isFalse(fromJsonSchema({ type: 'object', additionalProperties: { type: 'string' } })({ x: 1 }))
    vi.assert.isTrue(fromJsonSchema({ type: 'number', [symbol.optional]: 1 })(void 0))
    vi.assert.isTrue(fromJsonSchema({ type: 'number', [symbol.optional]: 1 })(1))
    vi.assert.isFalse(fromJsonSchema({ type: 'number', [symbol.optional]: 1 })(''))
    vi.assert.isTrue(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } })({ a: 0 }))
    vi.assert.isTrue(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } })({ a: 0, b: void 0 }))
    vi.assert.isTrue(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } })({ a: 0, b: '' }))
    vi.assert.isFalse(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } })({}))
    vi.assert.isFalse(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } })({ a: '' }))
    vi.assert.isFalse(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } })({ a: 0, b: null }))
  })
})

// const rmSymbols = (u: unknown) => {
//   if (typeof u === 'object' || typeof u === 'function') {
//     if (u) {
//       const syms = globalThis.Object.getOwnPropertySymbols(u)
//       for (const sym of syms) delete (u as any)[sym]
//       switch (u.constructor) {
//         case globalThis.Function: {
//           const func = u as globalThis.Function & { [x: symbol | string]: unknown }
//           for (const key in u) rmSymbols(func[key])
//           break
//         }
//         case globalThis.Object: {
//           const obj = u as globalThis.Function & { [x: symbol | string]: unknown }
//           for (const key in u) rmSymbols(obj[key])
//           break
//         }
//         case globalThis.Array: {
//           const arr = u as unknown[]
//           for (let ix = 0, len = arr.length; ix < len; ix++) rmSymbols(arr[ix])
//           break
//         }
//       }
//     }
//   }
// }
