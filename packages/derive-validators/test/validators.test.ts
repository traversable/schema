import * as vi from 'vitest'
import { validator, ValidationError as ERROR } from '@traversable/derive-validators'
import { Seed } from '@traversable/schema-seed'
import { t } from '@traversable/schema-core'
import { fc } from '@fast-check/vitest'

const seed = fc.letrec(Seed.seed({
  exclude: ['never'],
}))

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/validation❳: 😇 path', () => {
  vi.it('〖⛳️〗› ❲validator.null❳', () => vi.assert.isTrue(validator(t.null)(null)))
  vi.it('〖⛳️〗› ❲validator.unknown❳', () => (
    vi.assert.isTrue(validator(t.unknown)(void 0)),
    vi.assert.isTrue(validator(t.unknown)({}))
  ))
  vi.it('〖⛳️〗› ❲validator.any❳', () => (
    vi.assert.isTrue(validator(t.any)(void 0)),
    vi.assert.isTrue(validator(t.any)({}))
  ))
  vi.it('〖⛳️〗› ❲validator.void❳', () => (
    vi.assert.isTrue(validator(t.undefined)(void 0)),
    vi.assert.isTrue(validator(t.undefined)(undefined))
  ))
  vi.it('〖⛳️〗› ❲validator.undefined❳', () => (
    vi.assert.isTrue(validator(t.undefined)(void 0)),
    vi.assert.isTrue(validator(t.undefined)(undefined))
  ))
  vi.it('〖⛳️〗› ❲validator.boolean❳', () => (
    vi.assert.isTrue(validator(t.boolean)(true)),
    vi.assert.isTrue(validator(t.boolean)(false))
  ))
  vi.it('〖⛳️〗› ❲validator.symbol❳', () => (
    vi.assert.isTrue(validator(t.symbol)(Symbol())),
    vi.assert.isTrue(validator(t.symbol)(Symbol.for('example')))
  ))
  vi.it('〖⛳️〗› ❲validator.integer❳', () => (
    vi.assert.isTrue(validator(t.integer)(0)),
    vi.assert.isTrue(validator(t.integer)(-0)),
    vi.assert.isTrue(validator(t.integer)(1)),
    vi.assert.isTrue(validator(t.integer)(-1)),
    vi.assert.isTrue(validator(t.integer)(+(2 ** 53) - 1)),
    vi.assert.isTrue(validator(t.integer)(-(2 ** 53) + 1))
  ))
  vi.it('〖⛳️〗› ❲validator.bigint❳', () => (
    vi.assert.isTrue(validator(t.bigint)(0n)),
    vi.assert.isTrue(validator(t.bigint)(1n))
  ))
  vi.it('〖⛳️〗› ❲validator.number❳', () => (
    vi.assert.isTrue(validator(t.number)(0)),
    vi.assert.isTrue(validator(t.number)(-0)),
    vi.assert.isTrue(validator(t.number)(1)),
    vi.assert.isTrue(validator(t.number)(-1)),
    vi.assert.isTrue(validator(t.number)(+0.1)),
    vi.assert.isTrue(validator(t.number)(-0.1)),
    vi.assert.isTrue(validator(t.number)(-1.001e-53)),
    vi.assert.isTrue(validator(t.number)(+1.001e-53)),
    vi.assert.isTrue(validator(t.number)(-1.001e+53)),
    vi.assert.isTrue(validator(t.number)(+1.001e+53))
  ))
  vi.it('〖⛳️〗› ❲validator.string❳', () => (
    vi.assert.isTrue(validator(t.string)('')),
    vi.assert.isTrue(validator(t.string)(new globalThis.String('').toString()))
  ))
  vi.it('〖⛳️〗› ❲validator.array❳', () => (
    vi.assert.isTrue(validator(t.array(t.optional(t.string)))([])),
    vi.assert.isTrue(validator(t.array(t.optional(t.string)))([void 0])),
    vi.assert.isTrue(validator(t.array(t.optional(t.string)))([void 0, ''])),
    vi.assert.isTrue(validator(t.array(t.optional(t.string)))(['', void 0, '']))
  ))
  vi.it('〖⛳️〗› ❲validator.object❳', () => (
    vi.assert.isTrue(validator(t.object({}))({})),
    vi.assert.isTrue(validator(t.object({ '': t.null }))({ '': null })),
    vi.assert.isTrue(validator(t.object({ '': t.null, '\\': t.void }))({ '': null, '\\': void 0 })),
    vi.assert.isTrue(validator(t.object({ '': t.null, '\\': t.optional(t.null), [0]: t.any }))({ '': null, '\\': void 0, [0]: [0] })),
    vi.assert.isTrue(validator(t.object({ '': t.null, '\\': t.optional(t.null), [0]: t.any }))({ '': null, [0]: [0] })),
    vi.assert.isTrue(validator(t.object({ '': t.null, '\\': t.optional(t.object({ XYZ: t.null })), [0]: t.any }))({ '': null, [0]: [0] }))
  ))
  vi.it('〖⛳️〗› ❲validator.tuple❳', () => (
    vi.assert.isTrue(validator(t.tuple())([])),
    vi.assert.isTrue(validator(t.tuple(t.boolean))([false])),
    vi.assert.isTrue(validator(t.tuple(t.boolean, t.number))([true, 0])),
    vi.assert.isTrue(validator(t.tuple(t.boolean, t.number, t.string))([false, 1, ''])),
    vi.assert.isTrue(validator(t.tuple(t.boolean, t.number, t.optional(t.string)))([false, 1, ''])),
    vi.assert.isTrue(validator(t.tuple(t.boolean, t.number, t.optional(t.string)))([false, 1]))
  ))
  vi.it('〖⛳️〗› ❲validator.eq❳', () => (
    vi.assert.isTrue(validator(t.eq([]))([])),
    vi.assert.isTrue(validator(t.eq([[]]))([[]])),
    vi.assert.isTrue(validator(t.eq([{ a: [{}] }]))([{ a: [{}] }]))
  ))
  vi.it('〖⛳️〗› ❲validator.optional❳', () => (
    vi.assert.isTrue(validator(t.optional(t.number))(void 0)),
    vi.assert.isTrue(validator(t.optional(t.number))(1)),
    vi.assert.isTrue(validator(t.optional(t.optional(t.null)))(void 0)),
    vi.assert.isTrue(validator(t.optional(t.optional(t.null)))(null))
  ))
  vi.it('〖⛳️〗› ❲validator.union❳', () => (
    vi.assert.isTrue(validator(t.union())(null)),
    vi.assert.isTrue(validator(t.union(t.number, t.string))(0)),
    vi.assert.isTrue(validator(t.union(t.number, t.string))(''))
  ))
  vi.it('〖⛳️〗› ❲validator.intersect❳', () => (
    vi.assert.isTrue(validator(t.intersect())(0)),
    vi.assert.isTrue(validator(t.intersect(t.string))('')),
    vi.assert.isTrue(validator(t.intersect(t.object({ LMN: t.number })))({ LMN: 0 })),
    vi.assert.isTrue(validator(t.intersect(t.object({ LMN: t.number }), t.object({ OPQ: t.string })))({ LMN: 0, OPQ: '' }))
  ))
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/validation❳: 😈 path', () => {

  vi.it('〖⛳️〗› ❲validator.never❳', () => {
    vi.expect(validator(t.never)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "never",
          "got": 0,
          "msg": "Expected to never get a value",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_TO_NEVER_EVALUTE",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.void❳', () => {
    vi.expect(validator(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "msg": "Expected void",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_VOID",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.null❳', () => {
    vi.expect(validator(t.null)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "null",
          "got": 0,
          "msg": "Expected null",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_NULL",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.boolean❳', () => {
    vi.expect(validator(t.boolean)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "boolean",
          "got": 0,
          "msg": "Expected a boolean",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_BOOLEAN",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.symbol❳', () => {
    vi.expect(validator(t.symbol)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "symbol",
          "got": 0,
          "msg": "Expected a symbol",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_SYMBOL",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.integer❳', () => {
    vi.expect(validator(t.integer)(void 0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": undefined,
          "msg": "Expected an integer",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_INTEGER",
        },
      ]
    `)
    vi.expect(validator(t.integer)(1.11)).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": 1.11,
          "msg": "Expected an integer",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_INTEGER",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.number❳', () => {
    vi.expect(validator(t.number)(void 0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": undefined,
          "msg": "Expected a number",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_NUMBER",
        },
      ]
    `)
    vi.expect(validator(t.number)(false)).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": false,
          "msg": "Expected a number",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_NUMBER",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.string❳', () => {
    vi.expect(validator(t.string)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": 0,
          "msg": "Expected a string",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_STRING",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.eq❳', () => {
    vi.expect(validator(t.eq(99))(98)).toMatchInlineSnapshot(`
      [
        {
          "expected": 99,
          "got": 98,
          "msg": "Expected equal value",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_VALUE_EQUAL",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.optional❳', () => {
    vi.expect(validator(t.optional(t.string))(99)).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": 99,
          "msg": "Expected a string",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_STRING",
        },
        {
          "got": 99,
          "path": [],
          "type": "EXPECTED_OPTIONAL",
        },
      ]
    `)
  })


  vi.it('〖⛳️〗› ❲validator.array❳', () => {
    vi.expect(validator(t.array(t.any))({})).toMatchInlineSnapshot(`
      [
        {
          "got": {},
          "msg": "Expected array",
          "path": [],
          "type": "INVALID_VALUE",
        },
      ]
    `)
    vi.expect(validator(t.array(t.boolean))([1])).toMatchInlineSnapshot(`
      [
        {
          "expected": "boolean",
          "got": 1,
          "msg": "Expected a boolean",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_BOOLEAN",
        },
        {
          "got": 1,
          "msg": "Invalid item at index '0'",
          "path": [
            0,
          ],
          "type": "INVALID_ARRAY_ITEM",
        },
      ]
    `)
    vi.expect(validator(t.array(t.boolean))([false, 1, true, 2])).toMatchInlineSnapshot(`
      [
        {
          "expected": "boolean",
          "got": 1,
          "msg": "Expected a boolean",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_BOOLEAN",
        },
        {
          "got": 1,
          "msg": "Invalid item at index '1'",
          "path": [
            1,
          ],
          "type": "INVALID_ARRAY_ITEM",
        },
        {
          "expected": "boolean",
          "got": 2,
          "msg": "Expected a boolean",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_BOOLEAN",
        },
        {
          "got": 2,
          "msg": "Invalid item at index '3'",
          "path": [
            3,
          ],
          "type": "INVALID_ARRAY_ITEM",
        },
      ]
    `)

    vi.expect(validator(t.array(t.array(t.string)))([[''], [1, '2', [3]]])).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": 1,
          "msg": "Expected a string",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_STRING",
        },
        {
          "got": 1,
          "msg": "Invalid item at index '0'",
          "path": [
            0,
          ],
          "type": "INVALID_ARRAY_ITEM",
        },
        {
          "expected": "string",
          "got": [
            3,
          ],
          "msg": "Expected a string",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_STRING",
        },
        {
          "got": [
            3,
          ],
          "msg": "Invalid item at index '2'",
          "path": [
            2,
          ],
          "type": "INVALID_ARRAY_ITEM",
        },
        {
          "got": [
            1,
            "2",
            [
              3,
            ],
          ],
          "msg": "Invalid item at index '1'",
          "path": [
            1,
          ],
          "type": "INVALID_ARRAY_ITEM",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.record❳', () => {
    vi.expect(validator(t.record(t.any))([])).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "msg": "Expected object",
          "path": [],
          "type": "INVALID_VALUE",
        },
      ]
    `)
    vi.expect(validator(t.record(t.symbol))({ a: 1 })).toMatchInlineSnapshot(`
      [
        {
          "expected": "symbol",
          "got": 1,
          "msg": "Expected a symbol",
          "path": [
            "a",
          ],
          "schemaPath": [],
          "type": "EXPECTED_SYMBOL",
        },
      ]
    `)
    vi.expect(validator(t.record(t.symbol))({ a: 1, b: 'hey', c: Symbol() })).toMatchInlineSnapshot(`
      [
        {
          "expected": "symbol",
          "got": 1,
          "msg": "Expected a symbol",
          "path": [
            "a",
          ],
          "schemaPath": [],
          "type": "EXPECTED_SYMBOL",
        },
        {
          "expected": "symbol",
          "got": "hey",
          "msg": "Expected a symbol",
          "path": [
            "b",
          ],
          "schemaPath": [],
          "type": "EXPECTED_SYMBOL",
        },
      ]
    `)
    vi.expect(validator(t.record(t.record(t.symbol)))({ a: { b: Symbol(), c: 0, d: Symbol.for('d') }, e: 1 })).toMatchInlineSnapshot(`
      [
        {
          "expected": "symbol",
          "got": 0,
          "msg": "Expected a symbol",
          "path": [
            "c",
            "a",
          ],
          "schemaPath": [],
          "type": "EXPECTED_SYMBOL",
        },
        {
          "got": 1,
          "msg": "Expected object",
          "path": [
            "e",
          ],
          "type": "INVALID_VALUE",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.tuple❳', () => {
    vi.expect(validator(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "msg": "Expected void",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_VOID",
        },
      ]
    `)
    vi.expect(validator(t.tuple(t.number))([])).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "msg": "Missing index '0' at root",
          "path": [],
          "type": "MISSING_INDEX",
        },
      ]
    `)

    vi.expect(validator(t.tuple(t.number, t.string))([])).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "msg": "Missing index '0' at root",
          "path": [],
          "type": "MISSING_INDEX",
        },
        {
          "got": [],
          "msg": "Missing index '1' at root",
          "path": [],
          "type": "MISSING_INDEX",
        },
      ]
    `)


    vi.expect(
      validator(t.tuple(t.tuple(t.tuple(t.number), t.tuple(t.string), t.tuple(t.tuple(t.number)))))([[[''], [0], [[false]]]])
    ).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": "",
          "msg": "Expected a number",
          "path": [
            0,
            0,
            0,
          ],
          "schemaPath": [
            0,
            0,
            0,
          ],
          "type": "EXPECTED_NUMBER",
        },
        {
          "expected": "string",
          "got": 0,
          "msg": "Expected a string",
          "path": [
            0,
            1,
            0,
          ],
          "schemaPath": [
            0,
            1,
            0,
          ],
          "type": "EXPECTED_STRING",
        },
        {
          "expected": "number",
          "got": false,
          "msg": "Expected a number",
          "path": [
            0,
            2,
            0,
            0,
          ],
          "schemaPath": [
            0,
            2,
            0,
            0,
          ],
          "type": "EXPECTED_NUMBER",
        },
      ]
    `)

    vi.expect(validator(t.tuple(t.string))([[Symbol()]])).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": [
            Symbol(),
          ],
          "msg": "Expected a string",
          "path": [
            0,
          ],
          "schemaPath": [
            0,
          ],
          "type": "EXPECTED_STRING",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.object❳', () => {
    // vi.expect(validator(t.object({ x: t.tuple(t.object({ y: t.number }), t.object({ y: t.string })) }))({ x: [{}] })).toMatchInlineSnapshot()

    vi.expect(validator(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "msg": "Expected void",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_VOID",
        },
      ]
    `)

    vi.expect(validator(t.object({ '': t.null, '\\': t.optional(t.object({ XYZ: t.null })), [0]: t.any }))({ '': null, [0]: [0] })).toMatchInlineSnapshot(`true`)

    vi.expect(validator(t.object({ XYZ: t.number }))({})).toMatchInlineSnapshot(`
      [
        {
          "expected": "Record<XYZ, any>",
          "got": {},
          "msg": "Missing key 'XYZ' at root",
          "path": [],
          "schemaPath": [
            "XYZ",
          ],
          "type": "MISSING_KEY",
        },
      ]
    `)

    vi.expect(validator(t.object({ ABC: t.object({ DEF: t.number }) }))({ ABC: {} })).toMatchInlineSnapshot(`
      [
        {
          "expected": "Record<DEF, any>",
          "got": {},
          "msg": "Missing key 'DEF' at path 'ABC'",
          "path": [
            "ABC",
          ],
          "schemaPath": [
            "ABC",
            "DEF",
          ],
          "type": "MISSING_KEY",
        },
      ]
    `)

    vi.expect(validator(t.object({ ABC: t.tuple(t.object({ DEF: t.number })) }))({ ABC: {} })).toMatchInlineSnapshot(`
      [
        {
          "got": {},
          "msg": "Expected array",
          "path": [
            "ABC",
          ],
          "type": "INVALID_VALUE",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.union❳', () => {
    vi.expect(validator(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "msg": "Expected void",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_VOID",
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲validator.intersect❳', () => {
    vi.expect(validator(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "msg": "Expected void",
          "path": [],
          "schemaPath": [],
          "type": "EXPECTED_VOID",
        },
      ]
    `)
  })

})
