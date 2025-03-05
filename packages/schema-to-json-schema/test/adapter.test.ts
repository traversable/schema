import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'

import type { Algebra, Functor } from '@traversable/registry'
import { fn, parseKey, symbol, typeName, URI } from '@traversable/registry'
import { Json } from '@traversable/json'
import { t as Core } from '@traversable/schema-core'
import { Seed } from '@traversable/schema-seed'

import { t, fromJsonSchema, toJsonSchema } from '@traversable/schema-to-json-schema'

const arbitrary = fc.letrec(Seed.seed({ exclude: ['void', 'never', 'symbol', 'bigint', 'undefined', 'any'] })).tree

/** @internal */
const Object_entries = globalThis.Object.entries

const jsonToString = Json.fold((x: Json<string>) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case Json.isScalar(x): return typeof x === 'string' ? `"${x}"` : `${x}`
    case Json.isArray(x): return `[${x.join(',')}]`
    case Json.isObject(x): return `{ ${Object_entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ')} }`
  }
})

const schemaToString_: Algebra<t.Free, string> = (x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case t.isLeaf(x): return 't.' + typeName(x)
    case x.tag === URI.eq: return `t.eq(${jsonToString(x.def)})`
    case x.tag === URI.array: return `t.${typeName(x)}(${x.def})`
    case x.tag === URI.record: return `t.${typeName(x)}(${x.def})`
    case x.tag === URI.optional: return `t.${typeName(x)}(${x.def})`
    case x.tag === URI.tuple: return `t.${typeName(x)}(${x.def.join(', ')})`
    case x.tag === URI.union: return `t.${typeName(x)}(${x.def.join(', ')})`
    case x.tag === URI.intersect: return `t.${typeName(x)}(${x.def.join(', ')})`
    case x.tag === URI.object: {
      const xs = Object_entries(x.def)
      return xs.length === 0
        ? `t.${typeName(x)}({})`
        : `t.${typeName(x)}({ ${xs.map(([k, v]) => parseKey(k) + `: ${v}`).join(', ')} })`
    }
  }
}

const schemaToString = fn.cata(t.Functor)(schemaToString_)

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-json-schema❳: t.*', () => {

  vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-json-schema❳: property tests', () => {
    test.prop([arbitrary], {
      // numRuns: 10_000,
    })('〖⛳️〗› ❲t.fromJsonSchema + t.toJsonSchema❳: roundtrips', (seed) => {
      const schema = Seed.toSchema(seed)
      vi.assert.equal(
        schemaToString(schema),
        schemaToString(fromJsonSchema(toJsonSchema(schema))),
      )
    })
  })

  vi.it('〖⛳️〗› ❲t.never❳', () => vi.assert.deepEqual(t.never.jsonSchema, void 0))
  vi.it('〖⛳️〗› ❲t.void❳', () => vi.assert.deepEqual(t.void.jsonSchema, void 0))
  vi.it('〖⛳️〗› ❲t.symbol❳', () => vi.assert.deepEqual(t.symbol.jsonSchema, void 0))
  vi.it('〖⛳️〗› ❲t.undefined❳', () => vi.assert.deepEqual(t.undefined.jsonSchema, void 0))
  vi.it('〖⛳️〗› ❲t.bigint❳', () => vi.assert.deepEqual(t.bigint.jsonSchema, void 0))
  vi.it('〖⛳️〗› ❲t.inline❳', () => vi.assert.deepEqual(t.inline((_) => _ instanceof Error).jsonSchema, void 0))
  vi.it('〖⛳️〗› ❲t.null❳', () => vi.assert.deepEqual(t.null.jsonSchema, { type: 'null', enum: [null] }))
  vi.it('〖⛳️〗› ❲t.any❳', () => vi.assert.deepEqual(t.any.jsonSchema, { nullable: true, properties: {}, type: 'object' }))
  vi.it('〖⛳️〗› ❲t.unknown❳', () => vi.assert.deepEqual(t.unknown.jsonSchema, { nullable: true, properties: {}, type: 'object' }))
  vi.it('〖⛳️〗› ❲t.boolean❳', () => vi.assert.deepEqual(t.boolean.jsonSchema, { type: 'boolean' }))
  vi.it('〖⛳️〗› ❲t.integer❳', () => vi.assert.deepEqual(t.integer.jsonSchema, { type: 'integer' }))
  vi.it('〖⛳️〗› ❲t.number❳', () => vi.assert.deepEqual(t.number.jsonSchema, { type: 'number' }))
  vi.it('〖⛳️〗› ❲t.string❳', () => vi.assert.deepEqual(t.string.jsonSchema, { type: 'string' }))

  vi.it('〖⛳️〗› ❲t.array❳', () => {
    const ex_01 = t.array(t.string)
    vi.assert.deepEqual(ex_01.jsonSchema, { type: 'array', items: { type: 'string' } })
    vi.assertType<{ type: 'array', items: { type: 'string' } }>(ex_01.jsonSchema)
    const ex_02 = t.array(t.array(t.string))
    vi.assert.deepEqual(ex_02.jsonSchema, { type: 'array', items: { type: 'array', items: { type: 'string' } } })
    vi.assertType<{ type: 'array', items: { type: 'array', items: { type: 'string' } } }>(ex_02.jsonSchema)
  })

  vi.it('〖⛳️〗› ❲t.optional❳', () => {
    const ex_01 = t.optional(t.string)
    vi.assert.deepEqual(ex_01.jsonSchema, { type: 'string', [symbol.optional]: 1 })
    vi.assertType<{ type: 'string' }>(ex_01.jsonSchema)
    const ex_02 = t.optional(t.optional(t.string))
    vi.assert.deepEqual(ex_02.jsonSchema, { type: 'string', [symbol.optional]: 2 })
    vi.assertType<{ type: 'string' }>(ex_02.jsonSchema)
  })

  vi.it('〖⛳️〗› ❲t.eq❳', () => {
    const ex_00 = t.eq(null)
    vi.assert.deepEqual(ex_00.jsonSchema, { const: null })
    vi.assertType<{ const: null }>(ex_00.jsonSchema)
    const ex_01 = t.eq(100)
    vi.assert.deepEqual(ex_01.jsonSchema, { const: 100 })
    vi.assertType<{ const: 100 }>(ex_01.jsonSchema)
    const ex_02 = t.eq([1, 20, 300, 4000])
    vi.assert.deepEqual(ex_02.jsonSchema, { const: [1, 20, 300, 4000] })
    vi.assertType<{ const: [1, 20, 300, 4000] }>(ex_02.jsonSchema)
    const ex_03 = t.eq({ x: [1, 20, 300, 4000], y: { z: 9000 } })
    vi.assert.deepEqual(ex_03.jsonSchema, { const: { x: [1, 20, 300, 4000], y: { z: 9000 } } })
    vi.assertType<{ const: { x: [1, 20, 300, 4000], y: { z: 9000 } } }>(ex_03.jsonSchema)
  })

  vi.it('〖⛳️〗› ❲t.record❳', () => {
    const ex_01 = t.record(t.string)
    vi.assert.deepEqual(ex_01.jsonSchema, { type: 'object', additionalProperties: { type: 'string' } })
    vi.assertType<{ type: 'object', additionalProperties: { type: 'string' } }>(ex_01.jsonSchema)
    const ex_02 = t.record(t.record(t.string))
    vi.assert.deepEqual(ex_02.jsonSchema, { type: 'object', additionalProperties: { type: 'object', additionalProperties: { type: 'string' } } })
    vi.assertType<{ type: 'object', additionalProperties: { type: 'object', additionalProperties: { type: 'string' } } }>(ex_02.jsonSchema)
  })

  vi.it('〖⛳️〗› ❲t.intersect❳', () => {
    const ex_00 = t.intersect()
    vi.assert.deepEqual(ex_00.jsonSchema, { allOf: [] })
    vi.assertType<{ allOf: [] }>(ex_00.jsonSchema)

    const ex_01 = t.intersect(t.object({ x: t.number }), t.object({ y: t.optional(t.number) }))
    vi.assert.deepEqual(
      ex_01.jsonSchema, {
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
    }>(ex_01.jsonSchema)
  })

  vi.it('〖⛳️〗› ❲t.union❳', () => {
    const ex_00 = t.union()
    vi.assert.deepEqual(ex_00.jsonSchema, { anyOf: [] })
    vi.assertType<{ anyOf: [] }>(ex_00.jsonSchema)
    const ex_01 = t.union(t.object({ x: t.number }), t.object({ y: t.optional(t.number) }))
    vi.assert.deepEqual(
      ex_01.jsonSchema, {
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
    }>(ex_01.jsonSchema)
  })

  vi.it('〖⛳️〗› ❲t.tuple❳', () => {
    const ex_01 = t.tuple()
    vi.assert.deepEqual(
      ex_01.jsonSchema,
      { additionalItems: false, type: 'array', maxItems: 0, minItems: 0, items: [] }
    )
    vi.assertType<
      { additionalItems: false, type: 'array', maxItems: 0, minItems: 0, items: [] }
    >(ex_01.jsonSchema)
    const ex_02 = t.tuple(t.object({ x: t.number }), t.object({ y: t.optional(t.number) }))
    vi.assert.deepEqual(
      ex_02.jsonSchema, {
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
    }>(ex_02.jsonSchema)
  })

  vi.it('〖⛳️〗› ❲t.toJsonSchema❳: works with schemas definedd using `@traversable/schema-to-json-schema', () => {
    vi.assert.deepEqual(toJsonSchema(t.null), { type: 'null', enum: [null] })
    vi.assert.deepEqual(toJsonSchema(t.boolean), { type: 'boolean' })
    vi.assert.deepEqual(toJsonSchema(t.integer), { type: 'integer' })
    vi.assert.deepEqual(toJsonSchema(t.number), { type: 'number' })
    vi.assert.deepEqual(toJsonSchema(t.string), { type: 'string' })
    vi.assert.deepEqual(toJsonSchema(t.array(t.string)), { type: 'array', items: { type: 'string' } })
    vi.assert.deepEqual(toJsonSchema(t.record(t.string)), { type: 'object', additionalProperties: { type: 'string' } })
    vi.assert.deepEqual(toJsonSchema(t.optional(t.number)), { type: 'number', [symbol.optional]: 1 })
    vi.assert.deepEqual(toJsonSchema(t.optional(t.optional(t.number))), { type: 'number', [symbol.optional]: 2 })
    vi.assert.deepEqual(toJsonSchema(t.object({ a: t.number })), { type: 'object', required: ['a'], properties: { a: { type: 'number' } } })
    vi.assert.deepEqual(
      toJsonSchema(t.object({ a: t.number, b: t.optional(t.string) })),
      { type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } }
    )
  })

  vi.it('〖⛳️〗› ❲t.toJsonSchema❳: works with schemas defined using `@traversable/schema-core', () => {
    vi.assert.deepEqual(toJsonSchema(Core.never), void 0)
    vi.assert.deepEqual(toJsonSchema(Core.bigint), void 0)
    vi.assert.deepEqual(toJsonSchema(Core.symbol), void 0)
    vi.assert.deepEqual(toJsonSchema(Core.undefined), void 0)
    vi.assert.deepEqual(toJsonSchema(Core.void), void 0)
    vi.assert.deepEqual(toJsonSchema(Core.any), { type: 'object', properties: {}, nullable: true })
    vi.assert.deepEqual(toJsonSchema(Core.unknown), { type: 'object', properties: {}, nullable: true })
    vi.assert.deepEqual(toJsonSchema(Core.null), { type: 'null', enum: [null] })
    vi.assert.deepEqual(toJsonSchema(Core.boolean), { type: 'boolean' })
    vi.assert.deepEqual(toJsonSchema(Core.integer), { type: 'integer' })
    vi.assert.deepEqual(toJsonSchema(Core.number), { type: 'number' })
    vi.assert.deepEqual(toJsonSchema(Core.string), { type: 'string' })
    vi.assert.deepEqual(toJsonSchema(Core.eq(100)), { const: 100 })
    vi.assert.deepEqual(toJsonSchema(Core.array(Core.string)), { type: 'array', items: { type: 'string' } })
    vi.assert.deepEqual(toJsonSchema(Core.record(Core.string)), { type: 'object', additionalProperties: { type: 'string' } })
    vi.assert.deepEqual(toJsonSchema(Core.optional(Core.number)), { type: 'number', [symbol.optional]: 1 })
    vi.assert.deepEqual(toJsonSchema(Core.optional(Core.optional(t.number))), { type: 'number', [symbol.optional]: 2 })
    vi.assert.deepEqual(toJsonSchema(Core.optional(Core.optional(Core.optional(t.number)))), { type: 'number', [symbol.optional]: 3 })
    vi.assert.deepEqual(toJsonSchema(Core.object({ a: Core.number })), { type: 'object', required: ['a'], properties: { a: { type: 'number' } } })

    vi.assert.deepEqual(
      toJsonSchema(
        Core.tuple(
          Core.object({
            p: Core.array(Core.array(Core.record(Core.optional(Core.boolean)))),
            q: Core.optional(Core.number),
            r: Core.eq(100),
          }),
          Core.object({
            s: Core.optional(Core.number),
            t: Core.optional(
              Core.object({
                u: Core.intersect(),
                v: Core.union(Core.object({ w: Core.any, x: Core.tuple() }))
              })
            )
          })
        )
      ),
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
                  items: { type: 'object', additionalProperties: { type: 'boolean', [symbol.optional]: 1 } }
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
        Core.union(
          Core.object({ x: Core.number }),
          Core.object({ y: Core.optional(Core.number) })
        )
      ),
      {
        anyOf: [
          { type: 'object', required: ['x'], properties: { x: { type: 'number' } } },
          { type: 'object', required: [], properties: { y: { type: 'number' } } },
        ],
      }
    )

    vi.assert.deepEqual(
      toJsonSchema(Core.tuple(Core.object({ a: Core.number }))),
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
        Core.union(
          Core.object({ x: Core.number }),
          Core.object({ y: Core.optional(Core.number) })
        )
      ),
      {
        anyOf: [
          { type: 'object', required: ['x'], properties: { x: { type: 'number' } } },
          { type: 'object', required: [], properties: { y: { type: 'number' } } },
        ],
      }
    )

    vi.assert.deepEqual(
      toJsonSchema(Core.tuple(Core.object({ a: Core.number }))),
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
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', properties: {}, nullable: true }), t.unknown)
    vi.assert.deepEqual(fromJsonSchema({ type: 'null', enum: [null] }), t.null)
    vi.assert.deepEqual(fromJsonSchema({ type: 'boolean' }), t.boolean)
    vi.assert.deepEqual(fromJsonSchema({ type: 'integer' }), t.integer)
    vi.assert.deepEqual(fromJsonSchema({ type: 'number' }), t.number)
    vi.assert.deepEqual(fromJsonSchema({ type: 'string' }), t.string)
    vi.assert.deepEqual(fromJsonSchema({ const: 100 }).def, 100)
    vi.assert.deepEqual(fromJsonSchema({ type: 'array', items: { type: 'string' } }).tag, URI.array)
    vi.assert.deepEqual(fromJsonSchema({ type: 'array', items: { type: 'string' } }).def.tag, URI.string)
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', additionalProperties: { type: 'string' } }).tag, URI.record)
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', additionalProperties: { type: 'string' } }).def.tag, URI.string)
    vi.assert.deepEqual(fromJsonSchema({ type: 'number', [symbol.optional]: 1 }).tag, URI.optional)
    vi.assert.deepEqual(fromJsonSchema({ type: 'number', [symbol.optional]: 1 }).def.tag, URI.number)
    vi.assert.equal(schemaToString(fromJsonSchema({ type: 'number', [symbol.optional]: 1 })), 't.optional(t.number)')
    vi.assert.equal(schemaToString(fromJsonSchema({ type: 'number', [symbol.optional]: 2 })), 't.optional(t.optional(t.number))')
    vi.assert.equal(schemaToString(fromJsonSchema({ type: 'number', [symbol.optional]: 3 })), 't.optional(t.optional(t.optional(t.number)))')
    vi.assert.deepEqual(fromJsonSchema({ type: 'number', [symbol.optional]: 2 }).tag, URI.optional)
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' } } }).tag, URI.object)
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } }).def.a.tag, URI.number)
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } }).def.b.tag, URI.optional)
    vi.assert.deepEqual(fromJsonSchema({ type: 'object', required: ['a'], properties: { a: { type: 'number' }, b: { type: 'string' } } }).def.b.def.tag, URI.string)
  })

  vi.it('〖⛳️〗› ❲t.fromJsonSchema❳: schemaToString', () => {
    vi.assert.equal(schemaToString(fromJsonSchema(toJsonSchema(t.tuple(t.optional(t.number))))), 't.tuple(t.optional(t.number))')
    vi.assert.equal(schemaToString(fromJsonSchema(toJsonSchema(t.object({ a: t.optional(t.number) })))), 't.object({ a: t.optional(t.number) })')
    vi.assert.deepEqual(
      schemaToString(
        fromJsonSchema(
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
          },
        )),
      't.tuple(t.object({ p: t.array(t.array(t.record(t.boolean))), q: t.optional(t.number), r: t.eq(100) }), t.object({ s: t.optional(t.number), t: t.optional(t.object({ u: t.intersect(), v: t.union(t.object({ w: t.unknown, x: t.tuple() })) })) }))'
    )

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
