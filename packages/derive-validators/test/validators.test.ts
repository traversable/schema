import * as vi from 'vitest'
import { fromSchema, dataPathFromSchemaPath as dataPath } from '@traversable/derive-validators'

import { Seed } from '@traversable/schema-seed'
import { symbol } from '@traversable/registry'
import { t } from '@traversable/schema-core'
import { fc } from '@fast-check/vitest'

const seed = fc.letrec(Seed.seed({
  exclude: ['never'],
}))

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/validation❳', () => {
  vi.it('〖⛳️〗› ❲Validator.dataPath❳', () => {
    vi.expect(dataPath([])).toMatchInlineSnapshot(`[]`)
    vi.expect(dataPath(['a'])).toMatchInlineSnapshot(`
      [
        "a",
      ]
    `)
    vi.expect(dataPath([0])).toMatchInlineSnapshot(`
      [
        0,
      ]
    `)
    vi.expect(dataPath([symbol.union, 0, 1])).toMatchInlineSnapshot(`
      [
        1,
      ]
    `)
    vi.expect(dataPath([symbol.union, 1])).toMatchInlineSnapshot(`[]`)
    vi.expect(dataPath([0, symbol.union, 1])).toMatchInlineSnapshot(`
      [
        0,
      ]
    `)
    vi.expect(dataPath([0, 1, symbol.union])).toMatchInlineSnapshot(`
      [
        0,
        1,
      ]
    `)
    vi.expect(dataPath([symbol.union, 0, 1, 2])).toMatchInlineSnapshot(`
      [
        1,
        2,
      ]
    `)
    vi.expect(dataPath(['a', symbol.union, 'b', 'c'])).toMatchInlineSnapshot(`
      [
        "a",
        "c",
      ]
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/validation❳: 😇 path', () => {
  vi.it('〖⛳️〗› ❲Validator.null❳', () => vi.assert.isTrue(fromSchema(t.null)(null)))
  vi.it('〖⛳️〗› ❲Validator.unknown❳', () => (
    vi.assert.isTrue(fromSchema(t.unknown)(void 0)),
    vi.assert.isTrue(fromSchema(t.unknown)({}))
  ))
  vi.it('〖⛳️〗› ❲Validator.any❳', () => (
    vi.assert.isTrue(fromSchema(t.any)(void 0)),
    vi.assert.isTrue(fromSchema(t.any)({}))
  ))
  vi.it('〖⛳️〗› ❲Validator.void❳', () => (
    vi.assert.isTrue(fromSchema(t.undefined)(void 0)),
    vi.assert.isTrue(fromSchema(t.undefined)(undefined))
  ))
  vi.it('〖⛳️〗› ❲Validator.undefined❳', () => (
    vi.assert.isTrue(fromSchema(t.undefined)(void 0)),
    vi.assert.isTrue(fromSchema(t.undefined)(undefined))
  ))
  vi.it('〖⛳️〗› ❲Validator.boolean❳', () => (
    vi.assert.isTrue(fromSchema(t.boolean)(true)),
    vi.assert.isTrue(fromSchema(t.boolean)(false))
  ))
  vi.it('〖⛳️〗› ❲Validator.symbol❳', () => (
    vi.assert.isTrue(fromSchema(t.symbol)(Symbol())),
    vi.assert.isTrue(fromSchema(t.symbol)(Symbol.for('example')))
  ))
  vi.it('〖⛳️〗› ❲Validator.integer❳', () => (
    vi.assert.isTrue(fromSchema(t.integer)(0)),
    vi.assert.isTrue(fromSchema(t.integer)(-0)),
    vi.assert.isTrue(fromSchema(t.integer)(1)),
    vi.assert.isTrue(fromSchema(t.integer)(-1)),
    vi.assert.isTrue(fromSchema(t.integer)(+(2 ** 53) - 1)),
    vi.assert.isTrue(fromSchema(t.integer)(-(2 ** 53) + 1))
  ))
  vi.it('〖⛳️〗› ❲Validator.bigint❳', () => (
    vi.assert.isTrue(fromSchema(t.bigint)(0n)),
    vi.assert.isTrue(fromSchema(t.bigint)(1n))
  ))
  vi.it('〖⛳️〗› ❲Validator.number❳', () => (
    vi.assert.isTrue(fromSchema(t.number)(0)),
    vi.assert.isTrue(fromSchema(t.number)(-0)),
    vi.assert.isTrue(fromSchema(t.number)(1)),
    vi.assert.isTrue(fromSchema(t.number)(-1)),
    vi.assert.isTrue(fromSchema(t.number)(+0.3)),
    vi.assert.isTrue(fromSchema(t.number)(-0.3)),
    vi.assert.isTrue(fromSchema(t.number)(-1.001e-53)),
    vi.assert.isTrue(fromSchema(t.number)(+1.001e-53)),
    vi.assert.isTrue(fromSchema(t.number)(-1.001e+53)),
    vi.assert.isTrue(fromSchema(t.number)(+1.001e+53))
  ))
  vi.it('〖⛳️〗› ❲Validator.string❳', () => (
    vi.assert.isTrue(fromSchema(t.string)('')),
    vi.assert.isTrue(fromSchema(t.string)(new globalThis.String('').toString()))
  ))
  vi.it('〖⛳️〗› ❲Validator.array❳', () => (
    vi.assert.isTrue(fromSchema(t.array(t.optional(t.string)))([])),
    vi.assert.isTrue(fromSchema(t.array(t.optional(t.string)))([void 0])),
    vi.assert.isTrue(fromSchema(t.array(t.optional(t.string)))([void 0, ''])),
    vi.assert.isTrue(fromSchema(t.array(t.optional(t.string)))(['', void 0, '']))
  ))
  vi.it('〖⛳️〗› ❲Validator.object❳', () => (
    vi.assert.isTrue(fromSchema(t.object({}))({})),
    vi.assert.isTrue(fromSchema(t.object({ '': t.null }))({ '': null })),
    vi.assert.isTrue(fromSchema(t.object({ '': t.null, '\\': t.void }))({ '': null, '\\': void 0 })),
    vi.assert.isTrue(fromSchema(t.object({ '': t.null, '\\': t.optional(t.null), [0]: t.any }))({ '': null, '\\': void 0, [0]: [0] })),
    vi.assert.isTrue(fromSchema(t.object({ '': t.null, '\\': t.optional(t.null), [0]: t.any }))({ '': null, [0]: [0] })),
    vi.assert.isTrue(fromSchema(t.object({ '': t.null, '\\': t.optional(t.object({ XYZ: t.null })), [0]: t.any }))({ '': null, [0]: [0] }))
  ))
  vi.it('〖⛳️〗› ❲Validator.tuple❳', () => (
    vi.assert.isTrue(fromSchema(t.tuple())([])),
    vi.assert.isTrue(fromSchema(t.tuple(t.boolean))([false])),
    vi.assert.isTrue(fromSchema(t.tuple(t.boolean, t.number))([true, 0])),
    vi.assert.isTrue(fromSchema(t.tuple(t.boolean, t.number, t.string))([false, 1, ''])),
    vi.assert.isTrue(fromSchema(t.tuple(t.boolean, t.number, t.optional(t.string)))([false, 1, ''])),
    vi.assert.isTrue(fromSchema(t.tuple(t.boolean, t.number, t.optional(t.string)))([false, 1]))
  ))
  vi.it('〖⛳️〗› ❲Validator.eq❳', () => (
    vi.assert.isTrue(fromSchema(t.eq([]))([])),
    vi.assert.isTrue(fromSchema(t.eq([[]]))([[]])),
    vi.assert.isTrue(fromSchema(t.eq([{ a: [{}] }]))([{ a: [{}] }]))
  ))
  vi.it('〖⛳️〗› ❲Validator.optional❳', () => (
    vi.assert.isTrue(fromSchema(t.optional(t.number))(void 0)),
    vi.assert.isTrue(fromSchema(t.optional(t.number))(1)),
    vi.assert.isTrue(fromSchema(t.optional(t.optional(t.null)))(void 0)),
    vi.assert.isTrue(fromSchema(t.optional(t.optional(t.null)))(null))
  ))
  vi.it('〖⛳️〗› ❲Validator.union❳', () => (
    vi.assert.isTrue(fromSchema(t.union())(null)),
    vi.assert.isTrue(fromSchema(t.union(t.number, t.string))(0)),
    vi.assert.isTrue(fromSchema(t.union(t.number, t.string))(''))
  ))
  vi.it('〖⛳️〗› ❲Validator.intersect❳', () => (
    vi.assert.isTrue(fromSchema(t.intersect())(0)),
    vi.assert.isTrue(fromSchema(t.intersect(t.string))('')),
    vi.assert.isTrue(fromSchema(t.intersect(t.object({ LMN: t.number })))({ LMN: 0 })),
    vi.assert.isTrue(fromSchema(t.intersect(t.object({ LMN: t.number }), t.object({ OPQ: t.string })))({ LMN: 0, OPQ: '' }))
  ))
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/validation❳: 😈 path', () => {

  vi.it('〖⛳️〗› ❲Validator.never❳', () => {
    vi.expect(fromSchema(t.never)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "never",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected not receive a value",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.void❳', () => {
    vi.expect(fromSchema(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected void",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.null❳', () => {
    vi.expect(fromSchema(t.null)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "null",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected null",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.boolean❳', () => {
    vi.expect(fromSchema(t.boolean)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "boolean",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.symbol❳', () => {
    vi.expect(fromSchema(t.symbol)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "symbol",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a symbol",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.integer❳', () => {
    vi.expect(fromSchema(t.integer)(void 0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": undefined,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected an integer",
          "path": [],
        },
      ]
    `)
    vi.expect(fromSchema(t.integer)(1.11)).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": 1.11,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected an integer",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.number❳', () => {
    vi.expect(fromSchema(t.number)(void 0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": undefined,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [],
        },
      ]
    `)
    vi.expect(fromSchema(t.number)(false)).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": false,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.string❳', () => {
    vi.expect(fromSchema(t.string)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.eq❳', () => {
    vi.expect(fromSchema(t.eq(99))(98)).toMatchInlineSnapshot(`
      [
        {
          "expected": 99,
          "got": 98,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected equal value",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.optional❳', () => {
    vi.expect(fromSchema(t.optional(t.string))(99)).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": 99,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [],
        },
        {
          "got": 99,
          "kind": "TYPE_MISMATCH",
          "path": [],
        },
      ]
    `)
  })


  vi.it('〖⛳️〗› ❲Validator.array❳', () => {
    vi.expect(fromSchema(t.array(t.any))({})).toMatchInlineSnapshot(`
      [
        {
          "got": {},
          "kind": "TYPE_MISMATCH",
          "msg": "Expected array",
          "path": [],
        },
      ]
    `)
    vi.expect(fromSchema(t.array(t.boolean))([1])).toMatchInlineSnapshot(`
      [
        {
          "expected": "boolean",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [],
        },
        {
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Invalid item at index '0'",
          "path": [
            0,
          ],
        },
      ]
    `)
    vi.expect(fromSchema(t.array(t.boolean))([false, 1, true, 2])).toMatchInlineSnapshot(`
      [
        {
          "expected": "boolean",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [],
        },
        {
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Invalid item at index '1'",
          "path": [
            1,
          ],
        },
        {
          "expected": "boolean",
          "got": 2,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [],
        },
        {
          "got": 2,
          "kind": "TYPE_MISMATCH",
          "msg": "Invalid item at index '3'",
          "path": [
            3,
          ],
        },
      ]
    `)

    vi.expect(fromSchema(t.array(t.array(t.string)))([[''], [1, '2', [3]]])).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [],
        },
        {
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Invalid item at index '0'",
          "path": [
            0,
          ],
        },
        {
          "expected": "string",
          "got": [
            3,
          ],
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [],
        },
        {
          "got": [
            3,
          ],
          "kind": "TYPE_MISMATCH",
          "msg": "Invalid item at index '2'",
          "path": [
            2,
          ],
        },
        {
          "got": [
            1,
            "2",
            [
              3,
            ],
          ],
          "kind": "TYPE_MISMATCH",
          "msg": "Invalid item at index '1'",
          "path": [
            1,
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.record❳', () => {
    vi.expect(fromSchema(t.record(t.any))([])).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [],
        },
      ]
    `)
    vi.expect(fromSchema(t.record(t.symbol))({ a: 1 })).toMatchInlineSnapshot(`
      [
        {
          "expected": "symbol",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a symbol",
          "path": [
            "a",
          ],
        },
      ]
    `)
    vi.expect(fromSchema(t.record(t.symbol))({ a: 1, b: 'hey', c: Symbol() })).toMatchInlineSnapshot(`
      [
        {
          "expected": "symbol",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a symbol",
          "path": [
            "a",
          ],
        },
        {
          "expected": "symbol",
          "got": "hey",
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a symbol",
          "path": [
            "b",
          ],
        },
      ]
    `)
    vi.expect(fromSchema(t.record(t.record(t.symbol)))({ a: { b: Symbol(), c: 0, d: Symbol.for('d') }, e: 1 })).toMatchInlineSnapshot(`
      [
        {
          "expected": "symbol",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a symbol",
          "path": [
            "c",
            "a",
          ],
        },
        {
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [
            "e",
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.tuple❳', () => {
    vi.expect(fromSchema(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected void",
          "path": [],
        },
      ]
    `)
    vi.expect(fromSchema(t.tuple(t.number))([])).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "kind": "REQUIRED",
          "msg": "Missing index '0' at root",
          "path": [],
        },
      ]
    `)

    vi.expect(fromSchema(t.tuple(t.number, t.string))([])).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "kind": "REQUIRED",
          "msg": "Missing index '0' at root",
          "path": [],
        },
        {
          "got": [],
          "kind": "REQUIRED",
          "msg": "Missing index '1' at root",
          "path": [],
        },
      ]
    `)


    vi.expect(
      fromSchema(t.tuple(t.tuple(t.tuple(t.number), t.tuple(t.string), t.tuple(t.tuple(t.number)))))([[[''], [0], [[false]]]])
    ).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": "",
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            0,
            0,
            0,
          ],
        },
        {
          "expected": "string",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            0,
            1,
            0,
          ],
        },
        {
          "expected": "number",
          "got": false,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            0,
            2,
            0,
            0,
          ],
        },
      ]
    `)

    vi.expect(fromSchema(t.tuple(t.string))([[Symbol()]])).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": [
            Symbol(),
          ],
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            0,
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.object❳', () => {
    // vi.expect(fromSchema(t.object({ x: t.tuple(t.object({ y: t.number }), t.object({ y: t.string })) }))({ x: [{}] })).toMatchInlineSnapshot()

    vi.expect(fromSchema(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected void",
          "path": [],
        },
      ]
    `)

    vi.expect(fromSchema(t.object({ '': t.null, '\\': t.optional(t.object({ XYZ: t.null })), [0]: t.any }))({ '': null, [0]: [0] })).toMatchInlineSnapshot(`true`)

    vi.expect(fromSchema(t.object({ XYZ: t.number }))({})).toMatchInlineSnapshot(`
      [
        {
          "expected": "Record<XYZ, any>",
          "got": {},
          "kind": "REQUIRED",
          "msg": "Missing key 'XYZ' at root",
          "path": [],
        },
      ]
    `)

    vi.expect(fromSchema(t.object({ ABC: t.object({ DEF: t.number }) }))({ ABC: {} })).toMatchInlineSnapshot(`
      [
        {
          "expected": "Record<DEF, any>",
          "got": {},
          "kind": "REQUIRED",
          "msg": "Missing key 'DEF' at path 'ABC'",
          "path": [
            "ABC",
          ],
        },
      ]
    `)

    vi.expect(fromSchema(t.object({ ABC: t.tuple(t.object({ DEF: t.number })) }))({ ABC: {} })).toMatchInlineSnapshot(`
      [
        {
          "got": {},
          "kind": "TYPE_MISMATCH",
          "msg": "Expected array",
          "path": [
            "ABC",
          ],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.union❳', () => {
    const complex = t.union(
      t.object({
        A: t.object({
          B: t.optional(t.tuple(
            t.object({
              C: t.number,
              D: t.optional(t.string),
            }),
            t.optional(t.object({
              E: t.bigint,
              F: t.undefined,
            }))
          ))
        }),
        G: t.optional(t.array(t.optional(t.record(t.eq(3))))),
      }),
      t.optional(t.object({
        H: t.intersect(
          t.tuple(t.unknown, t.integer),
          t.tuple(t.string, t.number),
          t.tuple(t.optional(t.string), t.optional(t.eq(1))),
        ),
        I: t.object({
          J: t.tuple(
            t.object({
              K: t.boolean,
              L: t.integer,
            }),
            t.object({
              M: t.eq(1),
              N: t.null,
            })
          )
        }),
      }))
    )

    vi.expect(fromSchema(complex)({
      A: {
        B: [
          {
            C: 'BAD',
            D: -1,
          },
          void 0
        ],
      },
      G: {}
    })).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": "BAD",
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "A",
            "B",
            0,
            "C",
          ],
        },
        {
          "expected": "string",
          "got": -1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "A",
            "B",
            0,
            "D",
          ],
        },
        {
          "got": -1,
          "kind": "TYPE_MISMATCH",
          "path": [
            "A",
            "B",
            0,
            "D",
          ],
        },
        {
          "got": [
            {
              "C": "BAD",
              "D": -1,
            },
            undefined,
          ],
          "kind": "TYPE_MISMATCH",
          "path": [
            "A",
            "B",
          ],
        },
        {
          "got": {},
          "kind": "TYPE_MISMATCH",
          "msg": "Expected array",
          "path": [
            "G",
          ],
        },
        {
          "got": {},
          "kind": "TYPE_MISMATCH",
          "path": [
            "G",
          ],
        },
        {
          "expected": "Record<H, any>",
          "got": {
            "A": {
              "B": [
                {
                  "C": "BAD",
                  "D": -1,
                },
                undefined,
              ],
            },
            "G": {},
          },
          "kind": "REQUIRED",
          "msg": "Missing key 'H' at root",
          "path": [],
        },
        {
          "expected": "Record<I, any>",
          "got": {
            "A": {
              "B": [
                {
                  "C": "BAD",
                  "D": -1,
                },
                undefined,
              ],
            },
            "G": {},
          },
          "kind": "REQUIRED",
          "msg": "Missing key 'I' at root",
          "path": [],
        },
        {
          "got": {
            "A": {
              "B": [
                {
                  "C": "BAD",
                  "D": -1,
                },
                undefined,
              ],
            },
            "G": {},
          },
          "kind": "TYPE_MISMATCH",
          "path": [],
        },
      ]
    `)

    vi.expect(fromSchema(complex)({
      H: ['0', 1],
      I: {
        J: [
          {
            K: false,
            L: 2,
          },
          {
            M: 1,
            N: null,
          }
        ],
      },
    })).toMatchInlineSnapshot(`true`)

    vi.expect(fromSchema(complex)({
      A: {
        B: [
          {
            C: 0,
            D: '1',
          },
          {
            E: 2n,
            F: void 0,
          }
        ],
      },
      G: [
        {
          '': 3,
        }
      ]
    })).toMatchInlineSnapshot(`true`)


  })

  vi.it('〖⛳️〗› ❲Validator.union❳', () => {
    vi.expect(fromSchema(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected void",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.intersect❳', () => {
    vi.expect(fromSchema(t.void)(0)).toMatchInlineSnapshot(`
      [
        {
          "expected": "void",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected void",
          "path": [],
        },
      ]
    `)
  })

  vi.it('〖⛳️〗› ❲Validator.*❳: kitchen sink', () => {

    type ex_01 = t.typeof<typeof ex_01>
    const ex_01 = t.object({
      A: t.array(
        t.union(
          t.object({
            B: t.string,
            C: t.bigint,
          }),
          t.tuple(
            t.intersect(
              t.object({
                C: t.optional(t.boolean),
                D: t.object({
                  E: t.null,
                  F: t.void,
                  G: t.tuple(
                    t.string,
                    t.optional(t.object({ H: t.optional(t.any) })),
                    t.optional(t.number),
                  )
                })
              }),
              t.object({
                I: t.optional(t.eq(100)),
                J: t.undefined,
                K: t.object({
                  L: t.unknown,
                  M: t.optional(t.array(t.array(t.tuple(t.number, t.optional(t.integer))))),
                })
              })
            )
          ),
          t.object({}),
          t.void,
          t.optional(t.tuple()),
        )
      ),
      B: t.optional(t.record(t.optional(t.tuple(t.symbol)))),
    })
  })

})
