import * as vi from 'vitest'
import { t, configure } from '@traversable/schema'
import '@traversable/schema-to-validator/install'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/validation❳', () => {
  vi.it('〖⛳️〗› ❲t.array❳', () => {
    vi.expect.soft(t.array(t.number).validate([])).toMatchInlineSnapshot(`true`)
    vi.expect.soft(t.array(t.number).validate([0])).toMatchInlineSnapshot(`true`)
    vi.expect.soft(t.array(t.number).validate([0, -1.1, 2e+53])).toMatchInlineSnapshot(`true`)
    vi.expect.soft(t.array(t.number).validate([''])).toMatchInlineSnapshot(`
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

    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.expect.soft(t.object({ a: t.string }).validate({ a: '' })).toMatchInlineSnapshot(`true`)
    vi.expect.soft(t.object({ a: t.string }).validate({})).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'a'",
          "kind": "REQUIRED",
          "path": [],
        },
      ]
    `)
    vi.expect.soft(t.object({ a: t.string }).validate({ a: 0 })).toMatchInlineSnapshot(`
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
    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect.soft(t.object({ a: t.string }).validate({ a: '' })).toMatchInlineSnapshot(`true`)
    vi.expect.soft(t.object({ a: t.string }).validate({})).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'a'",
          "kind": "REQUIRED",
          "path": [],
        },
      ]
    `)
    vi.expect.soft(t.object({ a: t.string }).validate({ a: 0 })).toMatchInlineSnapshot(`
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
    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.expect.soft(t.object({ a: t.string }).validate({ a: '' })).toMatchInlineSnapshot(`true`)
    vi.expect.soft(t.object({ a: t.string }).validate({})).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'a'",
          "kind": "REQUIRED",
          "path": [],
        },
      ]
    `)
    vi.expect.soft(t.object({ a: t.string }).validate({ a: 0 })).toMatchInlineSnapshot(`
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

    const schema_01 = t.object({ d: t.object({ e: t.string }) })

    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.expect.soft(schema_01.validate({ d: {} })).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'e'",
          "kind": "REQUIRED",
          "path": [
            "d",
          ],
        },
      ]
    `)


    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.expect.soft(schema_01.validate({ d: {} })).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'e'",
          "kind": "REQUIRED",
          "path": [
            "d",
          ],
        },
      ]
    `)

    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect.soft(schema_01.validate({ d: {} })).toMatchInlineSnapshot(`
      [
        {
          "got": "Missing key 'e'",
          "kind": "REQUIRED",
          "path": [
            "d",
          ],
        },
      ]
    `)

    const schema_02 = t.object({
      a: t.optional(
        t.object({
          b: t.optional(
            t.object({
              c: t.optional(t.string),
            })
          )
        })
      )
    })

    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.expect.soft(schema_02.validate({ a: void 0 })).toMatchInlineSnapshot(`true`)
    vi.expect.soft(schema_02.validate({ a: [] })).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [
            "a",
          ],
        },
      ]
    `)

    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.expect.soft(schema_02.validate({ a: void 0 })).toMatchInlineSnapshot(`true`)
    vi.expect.soft(schema_02.validate({ a: [] })).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [
            "a",
          ],
        },
      ]
    `)

    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect.soft(schema_02.validate({ a: void 0 })).toMatchInlineSnapshot(`
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

    vi.expect.soft(schema_02.validate({ a: [] })).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [
            "a",
          ],
        },
      ]
    `)

    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.expect.soft(schema_02.validate({ a: { b: void 0 } })).toMatchInlineSnapshot(`true`)
    vi.expect.soft(schema_02.validate({ a: { b: [] } })).toMatchInlineSnapshot(`
      [
        {
          "got": [],
          "kind": "TYPE_MISMATCH",
          "msg": "Expected object",
          "path": [
            "a",
            "b",
          ],
        },
      ]
    `)

    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.expect.soft(schema_02.validate({ a: { b: void 0 } })).toMatchInlineSnapshot(`true`)

    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect.soft(schema_02.validate({ a: { b: void 0 } })).toMatchInlineSnapshot(`
      [
        {
          "got": undefined,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected optional",
          "path": [
            "a",
            "b",
          ],
        },
      ]
    `)

    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.expect.soft(schema_02.validate({ a: { b: { c: void 0 } } })).toMatchInlineSnapshot(`true`)
    vi.expect.soft(schema_02.validate({ a: { b: { c: 123 } } })).toMatchInlineSnapshot(`
      [
        {
          "expected": "string",
          "got": 123,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected a string",
          "path": [
            "a",
            "b",
            "c",
          ],
        },
      ]
    `)

    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.expect.soft(schema_02.validate({ a: { b: { c: void 0 } } })).toMatchInlineSnapshot(`true`)

    configure({ schema: { optionalTreatment: 'exactOptional' } })
    vi.expect.soft(schema_02.validate({ a: { b: { c: void 0 } } })).toMatchInlineSnapshot(`
      [
        {
          "got": undefined,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected optional",
          "path": [
            "a",
            "b",
            "c",
          ],
        },
      ]
    `)

    vi.expect.soft(schema_02.validate({ a: { b: void 0 } })).toMatchInlineSnapshot(`
      [
        {
          "got": undefined,
          "kind": "TYPE_MISMATCH",
          "msg": "Expected optional",
          "path": [
            "a",
            "b",
          ],
        },
      ]
    `)


    configure({ schema: { optionalTreatment: 'presentButUndefinedIsOK' } })
    vi.expect.soft(schema_02.validate({ a: void 0 })).toMatchInlineSnapshot(`true`)

    configure({ schema: { optionalTreatment: 'treatUndefinedAndOptionalAsTheSame' } })
    vi.expect.soft(schema_02.validate({ a: void 0 })).toMatchInlineSnapshot(`true`)

    vi.expect.soft(t.object({
      a: t.object({
        b: t.string
      }),
      c: t.object({
        d: t.object({
          e: t.optional(t.number),
          f: t.string,
        }),
        g: t.tuple(t.tuple(t.string)),
        h: t.array(t.record(t.array(t.string))),
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
          "got": "Missing required index 0",
          "kind": "REQUIRED",
          "path": [
            "c",
            "g",
            0,
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

    vi.expect.soft(t.union(t.string, t.number).validate(1)).toMatchInlineSnapshot(`true`)
    vi.expect.soft(t.union(t.string, t.number).validate(false)).toMatchInlineSnapshot(`
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

    vi.expect.soft(t.object({ a: t.union(t.string, t.number) }).validate({ a: false })).toMatchInlineSnapshot(`
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

    const union = t.object({
      A: t.union(
        t.object({
          B: t.union(
            t.object({ C: t.union(t.number, t.null) }),
            t.object({ D: t.union(t.string, t.boolean) }),
          )
        }),
        t.object({
          E: t.union(
            t.object({ F: t.union(t.number, t.null) }),
            t.object({ G: t.union(t.string, t.boolean) }),
          )
        }),
      ),
      H: t.union(
        t.object({
          I: t.union(
            t.object({ J: t.union(t.number, t.null) }),
            t.object({ K: t.union(t.string, t.boolean) }),
          )
        }),
        t.object({
          L: t.union(
            t.object({ M: t.union(t.number, t.null) }),
            t.object({ N: t.union(t.string, t.boolean) }),
          )
        }),
      )
    })

    vi.expect.soft(
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

    vi.expect.soft(
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


    const intersect = t.intersect(
      t.object({
        A: t.intersect(
          t.object({
            B: t.intersect(
              t.object({ C: t.union(t.number, t.null) }),
              t.object({ D: t.union(t.string, t.boolean) }),
            )
          }),
          t.object({
            E: t.intersect(
              t.object({ F: t.union(t.number, t.null) }),
              t.object({ G: t.union(t.string, t.boolean) }),
            )
          }),
        ),
      }),
      t.object({
        H: t.intersect(
          t.object({
            I: t.intersect(
              t.object({ J: t.union(t.number, t.null) }),
              t.object({ K: t.union(t.string, t.boolean) }),
            )
          }),
          t.object({
            L: t.intersect(
              t.object({ M: t.union(t.number, t.null) }),
              t.object({ N: t.union(t.string, t.boolean) }),
            )
          }),
        )
      })
    )

    vi.expect.soft(
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

    const intersectWithOptionals = t.intersect(
      t.object({
        A: t.optional(t.intersect(
          t.object({
            B: t.optional(t.intersect(
              t.object({ C: t.optional(t.union(t.number, t.null)) }),
              t.object({ D: t.optional(t.union(t.string, t.boolean)) }),
            ))
          }),
          t.object({
            E: t.optional(t.intersect(
              t.object({ F: t.optional(t.union(t.number, t.null)) }),
              t.object({ G: t.optional(t.union(t.string, t.boolean)) }),
            ))
          }),
        )),
      }),
      t.object({
        H: t.optional(t.intersect(
          t.object({
            I: t.optional(t.intersect(
              t.object({ J: t.optional(t.union(t.number, t.null)) }),
              t.object({ K: t.optional(t.union(t.string, t.boolean)) }),
            ))
          }),
          t.object({
            L: t.optional(t.intersect(
              t.object({ M: t.optional(t.union(t.number, t.null)) }),
              t.object({ N: t.optional(t.union(t.string, t.boolean)) }),
            ))
          }),
        ))
      })
    )

    vi.expect.soft(
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
