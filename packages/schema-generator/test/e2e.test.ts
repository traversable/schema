import * as vi from 'vitest'

import * as t from './namespace.js'
import { configure } from '@traversable/schema'
import { mut } from '@traversable/registry'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-generator❳', () => {

  vi.it('〖️⛳️〗› ❲generated❳: integer schema', () => {
    vi.assert.isTrue(t.integer(0))
    vi.assert.isFalse(t.integer(0.1))
    vi.assert.isFalse(t.integer(''))
  })

  vi.it('〖️⛳️〗› ❲generated❳: number schema', () => {
    vi.assert.isTrue(t.number(0))
    vi.assert.isTrue(t.number(0.1))
    vi.assert.isFalse(t.number(''))
  })

  vi.it('〖️⛳️〗› ❲generated❳: string schema', () => {
    vi.assert.isTrue(t.string(''))
    vi.assert.isFalse(t.string(0.1))
  })

  vi.it('〖️⛳️〗› ❲generated❳: optional schema', () => {
    vi.assert.isTrue(t.optional(t.integer)(void 0))
    vi.assert.isTrue(t.optional(t.integer)(0))
    vi.assert.isTrue(t.object({ a: t.optional(t.integer) })({}))
    vi.assert.isTrue(t.object({ a: t.optional(t.integer), b: t.optional(t.object({ c: t.number })) })({ b: { c: 0 } }))
    vi.assert.isTrue(t.object({ a: t.optional(t.integer), b: t.optional(t.object({ c: t.number })) })({ a: 0, b: { c: 1 } }))
    vi.assert.isTrue(t.object({ a: t.optional(t.integer), b: t.optional(t.object({ c: t.number })) })({}))
    vi.assert.isFalse(t.optional(t.integer)(''))

    void configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.assert.isTrue(t.object({ a: t.optional(t.integer), b: t.optional(t.object({ c: t.number })) })({ b: void 0 }))

    void configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.assert.isFalse(t.object({ a: t.optional(t.integer), b: t.optional(t.object({ c: t.number })) })({ b: void 0 }))
  })

  vi.it('〖️⛳️〗› ❲generated❳: array schema', () => {
    vi.assert.isTrue(t.array(t.string)([]))
    vi.assert.isTrue(t.array(t.string)(['']))
    vi.assert.isFalse(t.array(t.string)({}))
    vi.assert.isFalse(t.array(t.string)([0]))
  })

  vi.it('〖️⛳️〗› ❲generated❳: record schema', () => {
    vi.assert.isTrue(t.record(t.integer)({}))
    vi.assert.isTrue(t.record(t.integer)({ '': 0 }))
    vi.assert.isFalse(t.record(t.integer)({ '': false }))
    vi.assert.isFalse(t.record(t.integer)([]))
  })

  vi.it('〖️⛳️〗› ❲generated❳: union schema', () => {
    vi.assert.isTrue(t.union(t.integer, t.string)(0))
    vi.assert.isTrue(t.union(t.integer, t.string)(''))
    vi.assert.isFalse(t.union(t.integer, t.string)(false))
  })

  vi.it('〖️⛳️〗› ❲generated❳: intersect schema', () => {
    vi.assert.isTrue(t.intersect(t.integer)(0))
    vi.assert.isTrue(t.intersect(t.tuple())([]))
    vi.assert.isTrue(t.intersect(t.object({}))({}))
    vi.assert.isTrue(t.intersect(t.object({ a: t.integer }), t.object({ b: t.string }))({ a: 0, b: '' }))
    vi.assert.isFalse(t.intersect(t.object({ a: t.integer }), t.object({ b: t.string }))({}))
    vi.assert.isFalse(t.intersect(t.object({ a: t.integer }), t.object({ b: t.string }))({ a: 0 }))
    vi.assert.isFalse(t.intersect(t.object({ a: t.integer }), t.object({ b: t.string }))({ b: '' }))
  })

  vi.it('〖️⛳️〗› ❲generated❳: tuple schema', () => {
    vi.assert.isTrue(t.tuple()([]))
    vi.assert.isTrue(t.tuple(t.integer, t.string)([0, '']))
    vi.assert.isFalse(t.tuple(t.integer, t.string)(['', 0]))
    vi.assert.isFalse(t.tuple(t.integer, t.string)([0]))
    vi.assert.isFalse(t.tuple(t.integer, t.string)({}))
  })

  vi.it('〖️⛳️〗› ❲generated❳: object schema', () => {
    vi.assert.isTrue(t.object({})({}))
    vi.assert.isTrue(t.object({ '': t.integer })({ '': 0 }))
    vi.assert.isFalse(t.object({ '': t.integer })({}))
    vi.assert.isFalse(t.object({})([]))
  })
})

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-generator❳: .toString', () => {

  vi.it('〖️⛳️〗› ❲generated❳: integer.toString()', () => {
    vi.expect(t.integer.toString()).toMatchInlineSnapshot(`"number"`)
    vi.expectTypeOf(t.integer.toString()).toEqualTypeOf('number' as const)
  })

  vi.it('〖️⛳️〗› ❲generated❳: number.toString()', () => {
    vi.expect(t.number.toString()).toMatchInlineSnapshot(`"number"`)
    vi.expectTypeOf(t.number.toString()).toEqualTypeOf('number' as const)
  })

  vi.it('〖️⛳️〗› ❲generated❳: string.toString()', () => {
    vi.expect(t.string.toString()).toMatchInlineSnapshot(`"string"`)
    vi.expectTypeOf(t.string.toString()).toEqualTypeOf('string' as const)
  })

  vi.it('〖️⛳️〗› ❲generated❳: array(...).toString()', () => {
    vi.expect(t.array(t.string).toString()).toMatchInlineSnapshot(`"(\${string})[]"`)
    vi.expect(t.array(t.array(t.string)).toString()).toMatchInlineSnapshot(`"(\${string})[]"`)
    vi.expectTypeOf(t.array(t.string).toString()).toEqualTypeOf('(string)[]' as const)
    vi.expectTypeOf(t.array(t.array(t.string)).toString()).toEqualTypeOf('((string)[])[]' as const)
  })

  vi.it('〖️⛳️〗› ❲generated❳: record(...).toString()', () => {
    vi.expect(t.record(t.string).toString()).toMatchInlineSnapshot(`"Record<string, string>"`)
    vi.expect(t.record(t.record(t.string)).toString()).toMatchInlineSnapshot(`"Record<string, Record<string, string>>"`)
    vi.expectTypeOf(t.record(t.string).toString()).toEqualTypeOf('Record<string, string>' as const)
    vi.expectTypeOf(t.record(t.array(t.string)).toString()).toEqualTypeOf('Record<string, (string)[]>' as const)
  })

  vi.it('〖️⛳️〗› ❲generated❳: union(...).toString()', () => {
    vi.expect(t.union(t.string).toString()).toMatchInlineSnapshot(`"(string)"`)
    vi.expect(t.union(t.array(t.string), t.array(t.number)).toString()).toMatchInlineSnapshot(`"((\${string})[] | (\${string})[])"`)
    vi.expectTypeOf(t.union().toString()).toEqualTypeOf('never' as const)
    vi.expectTypeOf(t.union(t.integer).toString()).toEqualTypeOf('(number)' as const)
    vi.expectTypeOf(t.union(t.integer, t.string).toString()).toEqualTypeOf('(number | string)' as const)
    vi.expectTypeOf(t.union(t.array(t.string), t.array(t.number)).toString()).toEqualTypeOf('((string)[] | (number)[])' as const)
  })

  vi.it('〖️⛳️〗› ❲generated❳: intersect(...).toString()', () => {
    vi.expect(t.intersect(t.string).toString()).toMatchInlineSnapshot(`"(string)"`)
    vi.expect(t.intersect(t.intersect(t.string)).toString()).toMatchInlineSnapshot(`"((string))"`)
    vi.expectTypeOf(t.intersect().toString()).toEqualTypeOf('unknown' as const)
    vi.expectTypeOf(t.intersect(t.integer).toString()).toEqualTypeOf('(number)' as const)
    vi.expectTypeOf(t.intersect(t.object({}), t.tuple()).toString()).toEqualTypeOf('({} & [])' as const)
  })

  vi.it('〖️⛳️〗› ❲generated❳: tuple(...).toString()', () => {
    vi.expect(t.tuple().toString()).toMatchInlineSnapshot(`"[]"`)
    vi.expect(t.tuple(t.tuple(t.number), t.string).toString()).toMatchInlineSnapshot(`"[[number], string]"`)
    vi.expectTypeOf(t.tuple().toString()).toEqualTypeOf('[]' as const)
    vi.expectTypeOf(t.tuple(t.tuple(t.number), t.tuple(t.string)).toString()).toEqualTypeOf('[[number], [string]]' as const)
  })

  vi.it('〖️⛳️〗› ❲generated❳: object(...).toString()', () => {
    vi.expect(t.object({}).toString()).toMatchInlineSnapshot(`"{}"`)
    vi.expect(t.object({ a: t.integer }).toString()).toMatchInlineSnapshot(`"{ 'a': number }"`)
    vi.expectTypeOf(t.object({}).toString()).toEqualTypeOf('{}' as const)
    vi.expectTypeOf(t.object({ a: t.number }).toString()).toEqualTypeOf(`{ 'a': number }` as const)
    vi.expectTypeOf(t.object({ a: t.object({ b: t.number }) }).toString()).toEqualTypeOf(`{ 'a': { 'b': number } }` as const)
  })

  vi.it('〖️⛳️〗› ❲generated❳: optional(...).toString()', () => {
    vi.expect(t.optional(t.integer).toString()).toMatchInlineSnapshot(`"(number | undefined)"`)
    vi.expect(t.optional(t.string).toString()).toMatchInlineSnapshot(`"(string | undefined)"`)
    vi.expectTypeOf(t.optional(t.integer).toString()).toEqualTypeOf('(number | undefined)' as const)
    vi.expectTypeOf(t.object({ a: t.optional(t.integer) }).toString()).toEqualTypeOf(`{ 'a'?: (number | undefined) }` as const)
    vi.expectTypeOf(t.object({ a: t.optional(t.object({ b: t.optional(t.integer) })) }).toString())
      .toEqualTypeOf(`{ 'a'?: ({ 'b'?: (number | undefined) } | undefined) }` as const)
  })
})

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-generator❳: .toJsonSchema', () => {

  vi.it('〖️⛳️〗› ❲generated❳: integer.toJsonSchema()', () => {
    vi.expectTypeOf(t.integer.toJsonSchema()).toEqualTypeOf(mut({ type: 'integer' }))
    vi.expectTypeOf(t.integer.min(0).toJsonSchema()).toEqualTypeOf(mut({ type: 'integer', minimum: 0 }))
    vi.expectTypeOf(t.integer.max(0).toJsonSchema()).toEqualTypeOf(mut({ type: 'integer', maximum: 0 }))
    vi.expectTypeOf(t.integer.between(0, 1).toJsonSchema()).toEqualTypeOf(mut({ type: 'integer', minimum: 0, maximum: 1 }))
  })

  vi.it('〖️⛳️〗› ❲generated❳: number.toJsonSchema()', () => {
    vi.expectTypeOf(t.number.toJsonSchema()).toEqualTypeOf(mut({ type: 'number' }))
    vi.expectTypeOf(t.number.min(0).toJsonSchema()).toEqualTypeOf(mut({ type: 'number', minimum: 0, }))
    vi.expectTypeOf(t.number.max(0).toJsonSchema()).toEqualTypeOf(mut({ type: 'number', maximum: 0, }))
    vi.expectTypeOf(t.number.between(0, 1).toJsonSchema()).toEqualTypeOf(mut({ type: 'number', minimum: 0, maximum: 1, }))
    vi.expectTypeOf(t.number.moreThan(0).toJsonSchema()).toEqualTypeOf(mut({ type: 'number', exclusiveMinimum: 0, }))
    vi.expectTypeOf(t.number.lessThan(0).toJsonSchema()).toEqualTypeOf(mut({ type: 'number', exclusiveMaximum: 0, }))
  })

  vi.it('〖️⛳️〗› ❲generated❳: string.toJsonSchema()', () => {
    vi.expectTypeOf(t.string.toJsonSchema()).toEqualTypeOf(mut({ type: 'string' }))
    vi.expectTypeOf(t.string.min(0).toJsonSchema()).toEqualTypeOf(mut({ type: 'string', minLength: 0, }))
    vi.expectTypeOf(t.string.max(0).toJsonSchema()).toEqualTypeOf(mut({ type: 'string', maxLength: 0, }))
    vi.expectTypeOf(t.string.between(0, 1).toJsonSchema()).toEqualTypeOf(mut({ type: 'string', minLength: 0, maxLength: 1, }))
  })

  vi.it('〖️⛳️〗› ❲generated❳: array(...).toJsonSchema()', () => {
    vi.expectTypeOf(t.array(t.integer).toJsonSchema()).toEqualTypeOf<{ type: 'array', items: { type: 'integer' } }>()
    vi.expectTypeOf(t.array(t.number).toJsonSchema()).toEqualTypeOf<{ type: 'array', items: { type: 'number' } }>()
    vi.expectTypeOf(t.array(t.array(t.integer)).toJsonSchema()).toEqualTypeOf<{ type: 'array', items: { type: 'array', items: { type: 'integer' } } }>()
    vi.expectTypeOf(t.array(t.integer).min(0).toJsonSchema()).toEqualTypeOf<{ type: 'array', items: { type: 'integer' }, minLength: 0 }>()
    vi.expectTypeOf(t.array(t.integer).max(0).toJsonSchema()).toEqualTypeOf<{ type: 'array', items: { type: 'integer' }, maxLength: 0 }>()
    vi.expectTypeOf(t.array(t.integer).between(0, 1).toJsonSchema()).toEqualTypeOf<{ type: 'array', items: { type: 'integer' }, minLength: 0, maxLength: 1 }>()
  })

  vi.it('〖️⛳️〗› ❲generated❳: record(...).toJsonSchema()', () => {
    vi.expectTypeOf(t.record(t.integer).toJsonSchema()).toEqualTypeOf<{ type: 'object', additionalProperties: { type: 'integer' } }>()
    vi.expectTypeOf(
      t.record(t.record(t.integer)).toJsonSchema()
    ).toEqualTypeOf<{
      type: 'object'
      additionalProperties: {
        type: 'object'
        additionalProperties: { type: 'integer' }
      }
    }>()
  })

  vi.it('〖️⛳️〗› ❲generated❳: tuple(...).toJsonSchema()', () => {
    vi.expectTypeOf(t.tuple().toJsonSchema())
      .toEqualTypeOf<{ type: 'array', items: [], additionalItems: false, minItems: 0, maxItems: 0 }>()
    vi.expectTypeOf(t.tuple(t.integer).toJsonSchema())
      .toEqualTypeOf<{
        type: 'array'
        items: [{ type: 'integer' }]
        additionalItems: false
        minItems: 1
        maxItems: 1
      }>()
  })

  vi.it('〖️⛳️〗› ❲generated❳: object(...).toJsonSchema()', () => {
    vi.expectTypeOf(t.object({}).toJsonSchema()).toEqualTypeOf<{ type: 'object', required: [], properties: {} }>()
    vi.expectTypeOf(t.object({ a: t.string }).toJsonSchema())
      .toEqualTypeOf<{ type: 'object', required: 'a'[], properties: { a: { type: 'string' } } }>()
    vi.expectTypeOf(t.object({ a: t.optional(t.string) }).toJsonSchema())
      .toEqualTypeOf<{ type: 'object', required: [], properties: { a: { type: 'string', nullable: true } } }>()
    vi.expectTypeOf(t.object({ a: t.optional(t.string), b: t.integer }).toJsonSchema())
      .toEqualTypeOf<{ type: 'object', required: 'b'[], properties: { a: { type: 'string', nullable: true }, b: { type: 'integer' } } }>()
  })

  vi.it('〖️⛳️〗› ❲generated❳: intersect(...).toJsonSchema()', () => {
    vi.expectTypeOf(t.intersect(t.object({})).toJsonSchema())
      .toEqualTypeOf<{ allOf: [{ type: 'object', required: [], properties: {} }] }>()

    vi.expectTypeOf(
      t.intersect(
        t.object({ a: t.number }),
        t.object({ b: t.string })
      ).toJsonSchema()
    )
      .toEqualTypeOf<{
        allOf: [
          { type: 'object', required: 'a'[], properties: { a: { type: 'number' } } },
          { type: 'object', required: 'b'[], properties: { b: { type: 'string' } } }
        ]
      }>()
  })

  vi.it('〖️⛳️〗› ❲generated❳: union(...).toJsonSchema()', () => {
    vi.expectTypeOf(t.union(t.object({})).toJsonSchema())
      .toEqualTypeOf<{ anyOf: [{ type: 'object', required: [], properties: {} }] }>()

    vi.expectTypeOf(
      t.union(
        t.object({ a: t.number }),
        t.object({ b: t.string })
      ).toJsonSchema()
    )
      .toEqualTypeOf<{
        anyOf: [
          { type: 'object', required: 'a'[], properties: { a: { type: 'number' } } },
          { type: 'object', required: 'b'[], properties: { b: { type: 'string' } } }
        ]
      }>()
  })

})

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-generator❳: .equals', () => {

  vi.it('〖️⛳️〗› ❲generated❳: tuple(...).equals()', () => {
    vi.assert.isTrue(t.tuple(t.integer, t.tuple(t.string)).equals([0, ['']], [0, ['']]))
    vi.assert.isFalse(t.tuple(t.integer, t.tuple(t.string)).equals([0, ['']], [1, ['']]))
    vi.assert.isFalse(t.tuple(t.integer, t.tuple(t.string)).equals([0, ['']], [0, ['-']]))
  })

  vi.it('〖️⛳️〗› ❲generated❳: object(...).equals()', () => {
    vi.assert.isTrue(t.object({ a: t.integer, b: t.object({ c: t.optional(t.string) }) }).equals({ a: 0, b: { c: 'hey' } }, { a: 0, b: { c: 'hey' } }))
    vi.assert.isFalse(t.object({ a: t.integer, b: t.object({ c: t.optional(t.string) }) }).equals({ a: 0, b: { c: 'hey' } }, { a: 0, b: { c: 'ho' } }))
  })
})

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-generator❳: .validate', () => {
  vi.it('〖️⛳️〗› ❲generated❳: object(...).validate()', () => {
    vi.expect(t.object({}).validate([])).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖️⛳️〗› ❲generated❳: object(...).validate()', () => {

    vi.assert.isTrue(t.object({ a: t.integer }).validate({ a: 0 }))
    vi.assert.isTrue(t.object({ a: t.optional(t.integer) }).validate({ a: 0 }))
    vi.expect(t.object({ a: t.optional(t.integer) }).validate({ a: '' })).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": "",
          "kind": "TYPE_MISMATCH",
          "msg": "Expected an integer",
          "path": [
            "a",
          ],
        },
      ]
    `)

    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.assert.isTrue(t.object({ a: t.optional(t.integer) }).validate({ a: void 0 }))

    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect(t.object({ a: t.optional(t.integer) }).validate({ a: void 0 })).toMatchInlineSnapshot(`
      [
        {
          "got": undefined,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected optional",
          "path": [
            "a",
          ],
        },
      ]
    `)
  })
})