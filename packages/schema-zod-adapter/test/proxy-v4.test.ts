import * as vi from 'vitest'
import { z } from 'zod/v4'

import { v4 } from '@traversable/schema-zod-adapter'
import { fn } from '@traversable/registry'

const toString = (schemaPaths: v4.Optic.SchemaPath[]) => schemaPaths.map(([path, descriptors, schema]) => [
  path,
  descriptors,
  v4.toString(schema),
] satisfies [any, any, any])

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {

  vi.it('〖️⛳️〗› ❲v4.buildLenses❳ ', () => {

    type Type_00 = z.infer<typeof Type_00>
    const Type_00 = z.object({
      A: z.optional(
        z.array(
          z.object({
            B: z.optional(
              z.array(
                z.object({
                  C: z.optional(z.number()),
                  D: z.string(),
                })
              )
            ),
            E: z.boolean(),
          })
        )
      ),
      F: z.unknown(),
    })

    const lenses_00 = v4.buildLenses(Type_00)

    const lens_000 = lenses_00['A']

    vi.expect(lenses_00).toMatchInlineSnapshot
      (`
      {
        "": {
          "fallback": {
            "A": [
              {
                "B": [
                  {
                    "C": undefined,
                    "D": undefined,
                  },
                ],
                "E": undefined,
              },
            ],
            "F": undefined,
          },
          "get": [Function],
          "modify": [Function],
          "path": [],
          "set": [Function],
          "type": "Identity",
        },
        "A": {
          "fallback": [
            {
              "B": [
                {
                  "C": undefined,
                  "D": undefined,
                },
              ],
              "E": undefined,
            },
          ],
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
          ],
          "set": [Function],
          "type": "Lens",
        },
        "A.ʔ": {
          "fallback": [
            {
              "B": [
                {
                  "C": undefined,
                  "D": undefined,
                },
              ],
              "E": undefined,
            },
          ],
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
            "ʔ",
          ],
          "set": [Function],
          "type": "Prism",
        },
        "A.ʔ.ↆ": {
          "fallback": {
            "B": [
              {
                "C": undefined,
                "D": undefined,
              },
            ],
            "E": undefined,
          },
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
            "ʔ",
            "ↆ",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "A.ʔ.ↆ.B": {
          "fallback": [
            {
              "C": undefined,
              "D": undefined,
            },
          ],
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
            "ʔ",
            "ↆ",
            "B",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "A.ʔ.ↆ.B.ʔ": {
          "fallback": [
            {
              "C": undefined,
              "D": undefined,
            },
          ],
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
            "ʔ",
            "ↆ",
            "B",
            "ʔ",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "A.ʔ.ↆ.B.ʔ.ↆ": {
          "fallback": {
            "C": undefined,
            "D": undefined,
          },
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
            "ʔ",
            "ↆ",
            "B",
            "ʔ",
            "ↆ",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "A.ʔ.ↆ.B.ʔ.ↆ.C": {
          "fallback": undefined,
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
            "ʔ",
            "ↆ",
            "B",
            "ʔ",
            "ↆ",
            "C",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "A.ʔ.ↆ.B.ʔ.ↆ.C.ʔ": {
          "fallback": undefined,
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
            "ʔ",
            "ↆ",
            "B",
            "ʔ",
            "ↆ",
            "C",
            "ʔ",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "A.ʔ.ↆ.B.ʔ.ↆ.D": {
          "fallback": undefined,
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
            "ʔ",
            "ↆ",
            "B",
            "ʔ",
            "ↆ",
            "D",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "A.ʔ.ↆ.E": {
          "fallback": undefined,
          "get": [Function],
          "modify": [Function],
          "path": [
            "A",
            "ʔ",
            "ↆ",
            "E",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "F": {
          "fallback": undefined,
          "get": [Function],
          "modify": [Function],
          "path": [
            "F",
          ],
          "set": [Function],
          "type": "Lens",
        },
      }
    `)



    vi.expect(lens_000.get({ F: 1, A: [{ B: [{ D: 'HEY' }], E: false }] })).toMatchInlineSnapshot
      (`
      [
        {
          "B": [
            {
              "D": "HEY",
            },
          ],
          "E": false,
        },
      ]
    `)

    // TODO: look into the behavior for `A` here
    vi.expect(lenses_00['A.ʔ.ↆ.B'].set(1, { F: 1 })).toMatchInlineSnapshot
      (`
      {
        "A": {},
        "F": 1,
      }
    `)

    vi.expect(lens_000.set(undefined, { F: 1, A: [{ B: [{ D: 'HEY' }], E: false }] })).toMatchInlineSnapshot
      (`
      {
        "A": undefined,
        "F": 1,
      }
    `)

    vi.expect(lens_000.modify((x: unknown) => ({ MODIFIED: x }), { F: 1, A: [{ B: [{ D: 'HEY' }], E: false }] })).toMatchInlineSnapshot
      (`
      {
        "A": {
          "MODIFIED": [
            {
              "B": [
                {
                  "D": "HEY",
                },
              ],
              "E": false,
            },
          ],
        },
        "F": 1,
      }
    `)



    const lens_001 = lenses_00['A.ʔ']

    vi.expect(lens_001.get({ F: 1, A: [{ B: [{ D: 'HEY' }], E: false }] })).toMatchInlineSnapshot
      (`
      [
        {
          "B": [
            {
              "D": "HEY",
            },
          ],
          "E": false,
        },
      ]
    `)

    vi.expect(lens_001.get({ F: 1, A: [{ B: [{ D: 'HEY' }], E: false }] })).toMatchInlineSnapshot
      (`
      [
        {
          "B": [
            {
              "D": "HEY",
            },
          ],
          "E": false,
        },
      ]
    `)

    vi.expect(lens_001.get({ F: 1 })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)




    type Type_01 = z.infer<typeof Type_01>
    const Type_01 = z.object({
      a: z.number(),
      b: z.optional(z.object({ c: z.boolean() })),
    })

    const lenses_01 = v4.buildLenses(Type_01)

    vi.expect(lenses_01).toMatchInlineSnapshot
      (`
      {
        "": {
          "fallback": {
            "a": undefined,
            "b": {
              "c": undefined,
            },
          },
          "get": [Function],
          "modify": [Function],
          "path": [],
          "set": [Function],
          "type": "Identity",
        },
        "a": {
          "fallback": undefined,
          "get": [Function],
          "modify": [Function],
          "path": [
            "a",
          ],
          "set": [Function],
          "type": "Lens",
        },
        "b": {
          "fallback": {
            "c": undefined,
          },
          "get": [Function],
          "modify": [Function],
          "path": [
            "b",
          ],
          "set": [Function],
          "type": "Lens",
        },
        "b.ʔ": {
          "fallback": {
            "c": undefined,
          },
          "get": [Function],
          "modify": [Function],
          "path": [
            "b",
            "ʔ",
          ],
          "set": [Function],
          "type": "Prism",
        },
        "b.ʔ.c": {
          "fallback": undefined,
          "get": [Function],
          "modify": [Function],
          "path": [
            "b",
            "ʔ",
            "c",
          ],
          "set": [Function],
          "type": "Prism",
        },
      }
    `)

    vi.expect(lenses_01.a.get({ a: 0, b: { c: false } })).toMatchInlineSnapshot
      (`0`)
    vi.expect(lenses_01.a.get({ a: 0 })).toMatchInlineSnapshot
      (`0`)
    vi.expect(lenses_01.a.get({ a: 0, ...Math.random() > 1 && { b: { c: false } } })).toMatchInlineSnapshot
      (`0`)
    vi.expect(lenses_01.a.get({ a: 0, b: undefined })).toMatchInlineSnapshot
      (`0`)

    vi.expect(lenses_01.b.get({ a: 0, b: { c: false } })).toMatchInlineSnapshot
      (`
      {
        "c": false,
      }
    `)
    vi.expect(lenses_01.b.get({ a: 0 })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)
    vi.expect(lenses_01.b.get({ a: 0, ...Math.random() > 1 && { b: { c: false } } })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)
    vi.expect(lenses_01.b.get({ a: 0, b: undefined })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)

    vi.expect(lenses_01['b.ʔ'].get({ a: 0, b: { c: false } })).toMatchInlineSnapshot
      (`
      {
        "c": false,
      }
    `)
    vi.expect(lenses_01['b.ʔ'].get({ a: 0 })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)
    vi.expect(lenses_01['b.ʔ'].get({ a: 0, ...Math.random() > 1 && { b: { c: false } } })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)
    vi.expect(lenses_01['b.ʔ'].get({ a: 0, b: undefined })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)

    vi.expect(lenses_01['b.ʔ.c'].get({ a: 0, b: { c: false } })).toMatchInlineSnapshot
      (`false`)
    vi.expect(lenses_01['b.ʔ.c'].get({ a: 0 })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)
    vi.expect(lenses_01['b.ʔ.c'].get({ a: 0, ...Math.random() > 1 && { b: { c: false } } })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)
    vi.expect(lenses_01['b.ʔ.c'].get({ a: 0, b: undefined })).toMatchInlineSnapshot
      (`Symbol(@traversable/schema/URI::notfound)`)

    type Type_02 = z.infer<typeof Type_02>
    const Type_02 = z.array(z.object({ a: z.optional(z.number()) }))

    const lenses_02 = v4.buildLenses(Type_02)
    const root_20 = lenses_02['']
    const trav_20 = lenses_02['ↆ']
    const trav_21 = lenses_02['ↆ.a']
    const trav_22 = lenses_02['ↆ.a.ʔ']

    vi.expect(lenses_02).toMatchInlineSnapshot
      (`
      {
        "": {
          "fallback": [
            {
              "a": undefined,
            },
          ],
          "get": [Function],
          "modify": [Function],
          "path": [],
          "set": [Function],
          "type": "Identity",
        },
        "ↆ": {
          "fallback": {
            "a": undefined,
          },
          "get": [Function],
          "modify": [Function],
          "path": [
            "ↆ",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "ↆ.a": {
          "fallback": undefined,
          "get": [Function],
          "modify": [Function],
          "path": [
            "ↆ",
            "a",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "ↆ.a.ʔ": {
          "fallback": undefined,
          "get": [Function],
          "modify": [Function],
          "path": [
            "ↆ",
            "a",
            "ʔ",
          ],
          "set": [Function],
          "type": "Traversal",
        },
      }
    `)

    type Type_03 = z.infer<typeof Type_03>
    const Type_03 = z.object({
      F: z.record(
        z.enum(["X"]),
        z.object({ G: z.array(z.string()) })
      )
    })

    const lenses_03 = v4.buildLenses(Type_03)

    vi.expect(lenses_03['F.ↆ'].get({ F: { X: { G: [] } } })).toMatchInlineSnapshot
      (`
      {
        "X": [
          {
            "G": [],
          },
        ],
      }
    `)

    vi.expect(lenses_03).toMatchInlineSnapshot
      (`
      {
        "": {
          "fallback": {
            "F": {
              "X": {
                "G": [],
              },
            },
          },
          "get": [Function],
          "modify": [Function],
          "path": [],
          "set": [Function],
          "type": "Identity",
        },
        "F": {
          "fallback": {
            "X": {
              "G": [],
            },
          },
          "get": [Function],
          "modify": [Function],
          "path": [
            "F",
          ],
          "set": [Function],
          "type": "Lens",
        },
        "F.ↆ": {
          "fallback": {
            "G": [],
          },
          "get": [Function],
          "modify": [Function],
          "path": [
            "F",
            "ↆ",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "F.ↆ.G": {
          "fallback": [],
          "get": [Function],
          "modify": [Function],
          "path": [
            "F",
            "ↆ",
            "G",
          ],
          "set": [Function],
          "type": "Traversal",
        },
        "F.ↆ.G.ↆ": {
          "fallback": [],
          "get": [Function],
          "modify": [Function],
          "path": [
            "F",
            "ↆ",
            "G",
            "ↆ",
          ],
          "set": [Function],
          "type": "Traversal",
        },
      }
    `)

  })

  vi.it('〖️⛳️〗› ❲v4.buildIntermediateRepresentation❳ ', () => {
    vi.expect(v4.buildIntermediateRepresentation(
      z.object({
        a: z.number(),
        b: z.optional(z.object({ c: z.boolean() })),
      })
    )).toMatchInlineSnapshot
      (`
      [
        [
          {
            "optics": [
              {
                "tag": "declaration",
                "type": "Iso",
              },
            ],
            "path": [],
          },
          {
            "optics": [
              {
                "tag": "declaration",
                "type": "Iso",
              },
              {
                "prop": "a",
                "tag": "prop",
                "type": "Lens",
              },
            ],
            "path": [
              Symbol(@traversable/schema/URI::object),
              "a",
            ],
          },
        ],
        [
          {
            "optics": [
              {
                "tag": "declaration",
                "type": "Iso",
              },
            ],
            "path": [],
          },
          {
            "optics": [
              {
                "tag": "declaration",
                "type": "Iso",
              },
              {
                "prop": "b",
                "tag": "prop",
                "type": "Lens",
              },
            ],
            "path": [
              Symbol(@traversable/schema/URI::object),
              "b",
            ],
          },
          {
            "optics": [
              {
                "tag": "declaration",
                "type": "Iso",
              },
              {
                "prop": "b",
                "tag": "prop",
                "type": "Lens",
              },
              {
                "nullable": undefined,
                "tag": "fromNullable",
                "type": "Optional",
              },
            ],
            "path": [
              Symbol(@traversable/schema/URI::object),
              "b",
              Symbol(@traversable/schema/URI::optional),
            ],
          },
          {
            "optics": [
              {
                "tag": "declaration",
                "type": "Iso",
              },
              {
                "prop": "b",
                "tag": "prop",
                "type": "Lens",
              },
              {
                "nullable": undefined,
                "tag": "fromNullable",
                "type": "Optional",
              },
              {
                "prop": "c",
                "tag": "prop",
                "type": "Optional",
              },
            ],
            "path": [
              Symbol(@traversable/schema/URI::object),
              "b",
              Symbol(@traversable/schema/URI::optional),
              Symbol(@traversable/schema/URI::object),
              "c",
            ],
          },
        ],
      ]
    `)
  })
})

vi.describe("〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳", () => {
  vi.it("〖️⛳️〗› ❲v4.buildDescriptors❳ ", () => {
    vi.expect(toString(v4.buildDescriptors(
      z.object({ a: z.number(), b: z.optional(z.string()) })
    ))).toMatchInlineSnapshot
      (`
      [
        [
          [
            Symbol(@traversable/schema/URI::object),
            "a",
          ],
          [
            {
              "prop": "a",
              "tag": "prop",
              "type": "Lens",
            },
          ],
          "z.number()",
        ],
        [
          [
            Symbol(@traversable/schema/URI::object),
            "b",
            Symbol(@traversable/schema/URI::optional),
          ],
          [
            {
              "prop": "b",
              "tag": "prop",
              "type": "Lens",
            },
            {
              "nullable": undefined,
              "tag": "fromNullable",
              "type": "Prism",
            },
          ],
          "z.string()",
        ],
      ]
    `)

    vi.expect(toString(v4.buildDescriptors(
      z.tuple([
        z.number(),
        z.optional(
          z.tuple([
            z.optional(
              z.string()
            )
          ])
        ),
        z.boolean()
      ])
    ))).toMatchInlineSnapshot
      (`
      [
        [
          [
            Symbol(@traversable/schema/URI::tuple),
            0,
          ],
          [
            {
              "index": 0,
              "tag": "index",
              "type": "Lens",
            },
          ],
          "z.number()",
        ],
        [
          [
            Symbol(@traversable/schema/URI::tuple),
            1,
            Symbol(@traversable/schema/URI::optional),
            Symbol(@traversable/schema/URI::tuple),
            0,
            Symbol(@traversable/schema/URI::optional),
          ],
          [
            {
              "index": 1,
              "tag": "index",
              "type": "Lens",
            },
            {
              "nullable": undefined,
              "tag": "fromNullable",
              "type": "Prism",
            },
            {
              "index": 0,
              "tag": "index",
              "type": "Lens",
            },
            {
              "nullable": undefined,
              "tag": "fromNullable",
              "type": "Prism",
            },
          ],
          "z.string()",
        ],
        [
          [
            Symbol(@traversable/schema/URI::tuple),
            2,
          ],
          [
            {
              "index": 2,
              "tag": "index",
              "type": "Lens",
            },
          ],
          "z.boolean()",
        ],
      ]
    `)

    vi.expect(toString(
      v4.buildDescriptors(
        z.object({
          a: z.number(),
          b: z.optional(z.string()),
          c: z.array(
            z.object({
              d: z.object({
                e: z.boolean()
              })
            })
          )
        })
      )
    )).toMatchInlineSnapshot
      (`
      [
        [
          [
            Symbol(@traversable/schema/URI::object),
            "a",
          ],
          [
            {
              "prop": "a",
              "tag": "prop",
              "type": "Lens",
            },
          ],
          "z.number()",
        ],
        [
          [
            Symbol(@traversable/schema/URI::object),
            "b",
            Symbol(@traversable/schema/URI::optional),
          ],
          [
            {
              "prop": "b",
              "tag": "prop",
              "type": "Lens",
            },
            {
              "nullable": undefined,
              "tag": "fromNullable",
              "type": "Prism",
            },
          ],
          "z.string()",
        ],
        [
          [
            Symbol(@traversable/schema/URI::object),
            "c",
            Symbol(@traversable/schema/URI::array),
            Symbol(@traversable/schema/URI::object),
            "d",
            Symbol(@traversable/schema/URI::object),
            "e",
          ],
          [
            {
              "prop": "c",
              "tag": "prop",
              "type": "Lens",
            },
            {
              "applicative": "array",
              "tag": "applicative",
              "type": "TraversalWithPredicate",
            },
            {
              "prop": "d",
              "tag": "prop",
              "type": "Lens",
            },
            {
              "prop": "e",
              "tag": "prop",
              "type": "Lens",
            },
          ],
          "z.boolean()",
        ],
      ]
    `)

    vi.expect(toString(
      v4.buildDescriptors(
        z.union([
          z.number(),
          z.string(),
          z.boolean(),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      [
        [
          [
            Symbol(@traversable/schema/URI::union),
            0,
          ],
          [
            {
              "predicate": [Function],
              "tag": "fromPredicate",
              "type": "Prism",
            },
          ],
          "z.number()",
        ],
        [
          [
            Symbol(@traversable/schema/URI::union),
            1,
          ],
          [
            {
              "predicate": [Function],
              "tag": "fromPredicate",
              "type": "Prism",
            },
          ],
          "z.string()",
        ],
        [
          [
            Symbol(@traversable/schema/URI::union),
            2,
          ],
          [
            {
              "predicate": [Function],
              "tag": "fromPredicate",
              "type": "Prism",
            },
          ],
          "z.boolean()",
        ],
      ]
    `)

    vi.expect(toString(
      v4.buildDescriptors(
        z.union([
          z.array(z.number()),
          z.object({ a: z.optional(z.string()) }),
          z.boolean(),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      [
        [
          [
            Symbol(@traversable/schema/URI::union),
            0,
            Symbol(@traversable/schema/URI::array),
          ],
          [
            {
              "predicate": [Function],
              "tag": "fromPredicate",
              "type": "Prism",
            },
            {
              "applicative": "array",
              "tag": "applicative",
              "type": "TraversalWithPredicate",
            },
          ],
          "z.number()",
        ],
        [
          [
            Symbol(@traversable/schema/URI::union),
            1,
            Symbol(@traversable/schema/URI::object),
            "a",
            Symbol(@traversable/schema/URI::optional),
          ],
          [
            {
              "predicate": [Function],
              "tag": "fromPredicate",
              "type": "Prism",
            },
            {
              "prop": "a",
              "tag": "prop",
              "type": "Lens",
            },
            {
              "nullable": undefined,
              "tag": "fromNullable",
              "type": "Prism",
            },
          ],
          "z.string()",
        ],
        [
          [
            Symbol(@traversable/schema/URI::union),
            2,
          ],
          [
            {
              "predicate": [Function],
              "tag": "fromPredicate",
              "type": "Prism",
            },
          ],
          "z.boolean()",
        ],
      ]
    `)

  })
})
