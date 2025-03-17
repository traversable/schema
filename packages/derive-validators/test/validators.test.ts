import * as vi from 'vitest'

import { Seed } from '@traversable/schema-seed'
import { symbol } from '@traversable/registry'
import { t } from '@traversable/schema-core'
import { fc, test } from '@fast-check/vitest'

import { v, validatorFromSchema as fromSchema, dataPathFromSchemaPath as dataPath, Validator } from '@traversable/derive-validators'

const seed = fc.letrec(Seed.seed({
  exclude: ['never'],
}))

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/validation❳', () => {
  vi.it('〖⛳️〗› ❲Validator.optional.is❳', () => {
    const ex_01 = v.union([v.optional(v.string), v.optional(v.boolean)])
    vi.assert.isTrue((ex_01.validate as any)[symbol.optional])
  })

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
          "path": [
            1,
          ],
        },
        {
          "expected": "boolean",
          "got": 2,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
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
          "path": [
            0,
            1,
          ],
        },
        {
          "expected": "string",
          "got": [
            3,
          ],
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            2,
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
          "got": "Missing key 'XYZ'",
          "kind": "REQUIRED",
          "path": [],
        },
      ]
    `)

    vi.expect(fromSchema(t.object({ ABC: t.object({ DEF: t.number }) }))({ ABC: {} })).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'DEF'",
          "kind": "REQUIRED",
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
          "msg": "Expected array",
          "path": [
            "G",
          ],
        },
        {
          "got": "Missing key 'H'",
          "kind": "REQUIRED",
          "path": [],
        },
        {
          "got": "Missing key 'I'",
          "kind": "REQUIRED",
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
    type Sink = t.typeof<typeof Sink>
    const Sink = t.object({
      A: t.array(
        t.union(
          t.object({
            B: t.string,
            C: t.bigint,
          }),
          t.tuple(
            t.boolean,
            t.intersect(
              t.object({
                D: t.optional(t.boolean),
                E: t.object({
                  F: t.null,
                  G: t.void,
                  H: t.tuple(
                    t.string,
                    t.optional(t.object({ I: t.optional(t.any) })),
                    t.optional(t.number),
                  )
                })
              }),
              t.object({
                J: t.optional(t.eq(100)),
                K: t.undefined,
                L: t.object({
                  M: t.unknown,
                  N: t.optional(t.array(t.array(t.tuple(t.number, t.optional(t.integer))))),
                })
              })
            )
          ),
          t.object({}),
          t.void,
          t.optional(t.tuple()),
        )
      ),
      O: t.optional(t.record(t.optional(t.tuple(t.symbol)))),
    })

    const input_01 = { A: [] } satisfies Sink
    const input_02 = { A: [], O: void 0 } satisfies Sink
    const input_03 = { A: [], O: {} } satisfies Sink
    const input_04 = { A: [], O: { '': void 0 } } satisfies Sink
    const input_05 = { A: [], O: { '': [Symbol()] } } satisfies Sink
    const input_06 = { A: [], O: { '': [Symbol()], '\\': [Symbol.for('')] } } satisfies Sink
    const input_07 = { A: [], O: { '': [Symbol()], '\\': void 0 } } satisfies Sink

    const input_10 = {
      A: []
    } satisfies Sink

    const input_11 = {
      A: [
        { B: '', C: 0n },
        [false, { E: { F: null, G: void 0, H: [''] }, J: void 0, K: void 0, L: { M: {} } }]
      ]
    } satisfies Sink

    const input_12 = {
      A: [
        { B: '', C: 0n },
      ]
    } satisfies Sink

    const input_13 = {
      A: [
        [false, { E: { F: null, G: void 0, H: [''] }, J: void 0, K: void 0, L: { M: {} } }]
      ]
    } satisfies Sink

    vi.assert.isTrue(Sink(input_01))
    vi.assert.isTrue(Sink(input_02))
    vi.assert.isTrue(Sink(input_03))
    vi.assert.isTrue(Sink(input_04))
    vi.assert.isTrue(Sink(input_05))
    vi.assert.isTrue(Sink(input_06))
    vi.assert.isTrue(Sink(input_07))

    vi.assert.isTrue(Sink(input_10))
    vi.assert.isTrue(Sink(input_11))
    vi.assert.isTrue(Sink(input_12))
    vi.assert.isTrue(Sink(input_13))

  })

  const excess = fromSchema(t.tuple(t.string))([
    "0@UDx-",
    null,
    false,
    true,
    {
      ">6r-": -1.7905361005087222e+64,
      "": "#O",
      "6\\go": null,
      "=MAqdH": true
    },
    7.861347610443907e-41,
    null,
    {
      "T4qN": "ZWK(x]X",
      "": null,
      " rhw": 1.2253054883729321e+182,
      "?[HdJ_34^[": null,
      "T9nr4X)V": "r'U>jpW/",
      "G": null,
      "\\A%D": "i$",
      "Q^iIq": "wSXd",
      "\"7j\\-ndxn{": true,
      "u4A)rujDs}": "B>!<\"fWXIP"
    },
    "R\""
  ])

  vi.assert.isArray(excess)
  if (Array.isArray(excess)) {
    vi.assert.lengthOf(excess, 8)
  }

})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/validation❳: property tests', () => {
  const schema = Seed.schema()

  const seedArbitrary = fc.letrec(Seed.seed({ exclude: ['never', 'intersect'] })).tree

  // const data = Seed.toArbitrary
  // Arbitrary.fromSchema(schema)

  test.skip.prop([seedArbitrary, fc.jsonValue()], {})('〖⛳️〗› ❲Validator.fromSchema❳', (seed, json) => {
    const schema = Seed.toSchema(seed)
    const validator = fromSchema(schema)
    const arbitrary = Seed.toArbitrary(seed)
    const valid = fc.sample(arbitrary, 1)[0]
    console.log('valid', valid)

    vi.assert.isTrue(schema(valid))
    vi.assert.isTrue(validator(valid))

    if (schema(json) === true)
      vi.assert.isTrue(validator(json))

    if (schema(json) !== true) {
      const invalid = validator(json)
      vi.assert.isNotTrue(invalid)
      if ((invalid as never) === true) throw globalThis.Error('Illegal state')
      if (!Array.isArray(invalid)) throw globalThis.Error('Expected an array')

      invalid.forEach((error) => {
        console.log('error', error)
      })
    }
  })

  vi.it('〖⛳️〗› ❲Validator.fromSchema❳', () => {

  })
})
