import * as vi from 'vitest'
import { configure } from '@traversable/schema-core'

import { v } from '@traversable/derive-validators'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/validation❳', () => {
  vi.it('〖⛳️〗› ❲V.array❳', () => {
    vi.expect(v.array(v.number).validate([])).toMatchInlineSnapshot(`true`)
    vi.expect(v.array(v.number).validate([0])).toMatchInlineSnapshot(`true`)
    vi.expect(v.array(v.number).validate([0, -1.1, 2e+53])).toMatchInlineSnapshot(`true`)
    vi.expect(v.array(v.number).validate([''])).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": "",
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            0,
          ],
        },
      ]
    `)

    vi.expect(v.object({ a: v.string }).validate({ a: '' })).toMatchInlineSnapshot(`true`)
    vi.expect(v.object({ a: v.string }).validate({ a: 0 })).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": 0,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "a",
          ],
        },
      ]
    `)

    const schema_01 = v.object({ a: v.object({ b: v.string }) })

    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect(schema_01.validate({ a: {} })).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'b'",
          "kind": "REQUIRED",
          "path": [
            "a",
          ],
        },
      ]
    `)

    vi.expect(schema_01.validate({ a: {} })).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'b'",
          "kind": "REQUIRED",
          "path": [
            "a",
          ],
        },
      ]
    `)

    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.expect(schema_01.validate({ a: {} })).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'b'",
          "kind": "REQUIRED",
          "path": [
            "a",
          ],
        },
      ]
    `)

    const schema_02 = v.object({
      a: v.optional(v.object({
        b: v.optional(v.object({
          c: v.optional(v.string),
        }))
      }))
    })

    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect(schema_02.validate({ a: void 0 })).toMatchInlineSnapshot(`
      [
        {
          "got": undefined,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [
            "a",
          ],
        },
      ]
    `)

    vi.expect(schema_02.validate({ a: { b: { c: void 0 } } })).toMatchInlineSnapshot(`
      [
        {
          "got": undefined,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [
            "a",
            "b",
            "c",
          ],
        },
      ]
    `)

    vi.expect(schema_02.validate({ a: { b: void 0 } })).toMatchInlineSnapshot(`
      [
        {
          "got": undefined,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [
            "a",
            "b",
          ],
        },
      ]
    `)


    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.expect(schema_02.validate({ a: void 0 })).toMatchInlineSnapshot(`true`)

    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.expect(schema_02.validate({ a: void 0 })).toMatchInlineSnapshot(`true`)

    vi.expect(v.object({
      a: v.object({
        b: v.string
      }),
      c: v.object({
        d: v.object({
          e: v.optional(v.number),
          f: v.string,
        }),
        g: v.tuple([v.tuple([v.string])]),
        h: v.array(v.record(v.array(v.string))),
      })
    }).validate({ a: {}, c: { d: {}, g: [[]], h: [{ '': [1] }] } })).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'b'",
          "kind": "REQUIRED",
          "path": [
            "a",
          ],
        },
        {
          "got": "Missing key 'f'",
          "kind": "REQUIRED",
          "path": [
            "c",
            "d",
          ],
        },
        {
          "got": [],
          "kind": "REQUIRED",
          "msg": "Missing index '0' at path 'c.g.0'",
          "path": [
            "c",
            "g",
            0,
          ],
        },
        {
          "expected": "string",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "c",
            "h",
            0,
            "",
            0,
          ],
        },
      ]
    `)

    vi.expect(v.union([v.string, v.number]).validate(1)).toMatchInlineSnapshot(`true`)
    vi.expect(v.union([v.string, v.number]).validate(false)).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": false,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [],
        },
        {
          "expected": "number",
          "got": false,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [],
        },
      ]
    `)

    vi.expect(v.object({ a: v.union([v.string, v.number]) }).validate({ a: false })).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": false,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "a",
          ],
        },
        {
          "expected": "number",
          "got": false,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "a",
          ],
        },
      ]
    `)

    const union = v.object({
      A: v.union([
        v.object({
          B: v.union([
            v.object({ C: v.union([v.number, v.null]) }),
            v.object({ D: v.union([v.string, v.boolean]) }),
          ])
        }),
        v.object({
          E: v.union([
            v.object({ F: v.union([v.number, v.null]) }),
            v.object({ G: v.union([v.string, v.boolean]) }),
          ])
        }),
      ]),
      H: v.union([
        v.object({
          I: v.union([
            v.object({ J: v.union([v.number, v.null]) }),
            v.object({ K: v.union([v.string, v.boolean]) }),
          ])
        }),
        v.object({
          L: v.union([
            v.object({ M: v.union([v.number, v.null]) }),
            v.object({ N: v.union([v.string, v.boolean]) }),
          ])
        }),
      ])
    })

    vi.expect(
      union.validate({
        A: {
          B: {},
          E: {},
        },
        H: {
          I: {},
          L: {},
        }
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'C'",
          "kind": "REQUIRED",
          "path": [
            "A",
            "B",
          ],
        },
        {
          "got": "Missing key 'D'",
          "kind": "REQUIRED",
          "path": [
            "A",
            "B",
          ],
        },
        {
          "got": "Missing key 'F'",
          "kind": "REQUIRED",
          "path": [
            "A",
            "E",
          ],
        },
        {
          "got": "Missing key 'G'",
          "kind": "REQUIRED",
          "path": [
            "A",
            "E",
          ],
        },
        {
          "got": "Missing key 'J'",
          "kind": "REQUIRED",
          "path": [
            "H",
            "I",
          ],
        },
        {
          "got": "Missing key 'K'",
          "kind": "REQUIRED",
          "path": [
            "H",
            "I",
          ],
        },
        {
          "got": "Missing key 'M'",
          "kind": "REQUIRED",
          "path": [
            "H",
            "L",
          ],
        },
        {
          "got": "Missing key 'N'",
          "kind": "REQUIRED",
          "path": [
            "H",
            "L",
          ],
        },
      ]
    `)

    vi.expect(
      union.validate({
        A: {
          B: {
            C: 0n, D: null,
          },
          E: {
            F: 0n, G: false
          },
        },
        H: {
          I: {
            J: 0n, K: 1
          },
          L: {
            M: 0n, N: 1
          },
        }
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "H",
            "I",
            "J",
          ],
        },
        {
          "expected": "null",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected null",
          "path": [
            "H",
            "I",
            "J",
          ],
        },
        {
          "expected": "string",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "H",
            "I",
            "K",
          ],
        },
        {
          "expected": "boolean",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [
            "H",
            "I",
            "K",
          ],
        },
        {
          "expected": "number",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "H",
            "L",
            "M",
          ],
        },
        {
          "expected": "null",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected null",
          "path": [
            "H",
            "L",
            "M",
          ],
        },
        {
          "expected": "string",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "H",
            "L",
            "N",
          ],
        },
        {
          "expected": "boolean",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [
            "H",
            "L",
            "N",
          ],
        },
      ]
    `)


    const intersect = v.intersect([
      v.object({
        A: v.intersect([
          v.object({
            B: v.intersect([
              v.object({ C: v.union([v.number, v.null]) }),
              v.object({ D: v.union([v.string, v.boolean]) }),
            ])
          }),
          v.object({
            E: v.intersect([
              v.object({ F: v.union([v.number, v.null]) }),
              v.object({ G: v.union([v.string, v.boolean]) }),
            ])
          }),
        ]),
      }),
      v.object({
        H: v.intersect([
          v.object({
            I: v.intersect([
              v.object({ J: v.union([v.number, v.null]) }),
              v.object({ K: v.union([v.string, v.boolean]) }),
            ])
          }),
          v.object({
            L: v.intersect([
              v.object({ M: v.union([v.number, v.null]) }),
              v.object({ N: v.union([v.string, v.boolean]) }),
            ])
          }),
        ])
      })
    ])


    type _9 = {
      A:
      & { B: { C: number | undefined } & { D: string | boolean } }
      & { E: { F: number | undefined } & { G: string | boolean } }
    } & {
      H:
      & { I: { J: number | undefined } & { K: string | boolean } }
      & { L: { M: number | undefined } & { N: string | boolean } }
    }

    vi.expect(
      intersect.validate({
        A: {
          B: { C: 0n, D: null },
          E: { F: 0n, G: false }, // G is okay
        },
        H: {
          I: { J: 0n, K: 1 },
          L: { M: 0n, N: 1 },
        }
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "expected": "number",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "A",
            "B",
            "C",
          ],
        },
        {
          "expected": "null",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected null",
          "path": [
            "A",
            "B",
            "C",
          ],
        },
        {
          "expected": "string",
          "got": null,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "A",
            "B",
            "D",
          ],
        },
        {
          "expected": "boolean",
          "got": null,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [
            "A",
            "B",
            "D",
          ],
        },
        {
          "expected": "number",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "A",
            "E",
            "F",
          ],
        },
        {
          "expected": "null",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected null",
          "path": [
            "A",
            "E",
            "F",
          ],
        },
        {
          "expected": "number",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "H",
            "I",
            "J",
          ],
        },
        {
          "expected": "null",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected null",
          "path": [
            "H",
            "I",
            "J",
          ],
        },
        {
          "expected": "string",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "H",
            "I",
            "K",
          ],
        },
        {
          "expected": "boolean",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [
            "H",
            "I",
            "K",
          ],
        },
        {
          "expected": "number",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "H",
            "L",
            "M",
          ],
        },
        {
          "expected": "null",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected null",
          "path": [
            "H",
            "L",
            "M",
          ],
        },
        {
          "expected": "string",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "H",
            "L",
            "N",
          ],
        },
        {
          "expected": "boolean",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [
            "H",
            "L",
            "N",
          ],
        },
      ]
    `)

    const intersectWithOptionals = v.intersect([
      v.object({
        A: v.optional(v.intersect([
          v.object({
            B: v.optional(v.intersect([
              v.object({ C: v.optional(v.union([v.number, v.null])) }),
              v.object({ D: v.optional(v.union([v.string, v.boolean])) }),
            ]))
          }),
          v.object({
            E: v.optional(v.intersect([
              v.object({ F: v.optional(v.union([v.number, v.null])) }),
              v.object({ G: v.optional(v.union([v.string, v.boolean])) }),
            ]))
          }),
        ])),
      }),
      v.object({
        H: v.optional(v.intersect([
          v.object({
            I: v.optional(v.intersect([
              v.object({ J: v.optional(v.union([v.number, v.null])) }),
              v.object({ K: v.optional(v.union([v.string, v.boolean])) }),
            ]))
          }),
          v.object({
            L: v.optional(v.intersect([
              v.object({ M: v.optional(v.union([v.number, v.null])) }),
              v.object({ N: v.optional(v.union([v.string, v.boolean])) }),
            ]))
          }),
        ]))
      })
    ])

    vi.expect(
      intersectWithOptionals.validate({
        A: {
          B: { D: null },
          E: { F: 0n },
        },
        H: {
          I: { J: 0n },
          L: { N: 1 },
        }
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": null,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "A",
            "B",
            "D",
          ],
        },
        {
          "expected": "boolean",
          "got": null,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [
            "A",
            "B",
            "D",
          ],
        },
        {
          "expected": "number",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "A",
            "E",
            "F",
          ],
        },
        {
          "expected": "null",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected null",
          "path": [
            "A",
            "E",
            "F",
          ],
        },
        {
          "expected": "number",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a number",
          "path": [
            "H",
            "I",
            "J",
          ],
        },
        {
          "expected": "null",
          "got": 0n,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected null",
          "path": [
            "H",
            "I",
            "J",
          ],
        },
        {
          "expected": "string",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "H",
            "L",
            "N",
          ],
        },
        {
          "expected": "boolean",
          "got": 1,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a boolean",
          "path": [
            "H",
            "L",
            "N",
          ],
        },
      ]
    `)

  })
})
