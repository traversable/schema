import * as vi from 'vitest'
import { z } from 'zod/v4'

import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.defaultValue❳', () => {

    const schema_01 = z.object({
      A: z.optional(
        z.union([
          z.literal(1),
          z.array(
            z.object({
              H: z.literal('two'),
              I: z.union([
                z.number(),
                z.object({
                  J: z.optional(z.literal(false)),
                })
              ]),
            })
          ),
          z.record(
            z.enum(['x', 'y', 'z']),
            z.optional(
              z.union([
                z.boolean(),
                z.number().int()
              ])
            )
          ),
        ])
      ),
      B: z.optional(
        z.array(
          z.tuple([
            z.literal(7),
            z.record(
              z.number(),
              z.union([
                z.object({
                  discriminant: z.literal('circle'),
                  radius: z.number(),
                }),
                z.object({
                  discriminant: z.literal('rectangle'),
                  width: z.number(),
                  length: z.number(),
                }),
                z.object({
                  discrimnant: z.literal('square'),
                  length: z.number(),
                }),
              ])
            )
          ]),
        )
      ),
      C: z.optional(z.tuple([
        z.object({
          J: z.unknown(),
          K: z.optional(z.string()),
        })
      ])),
      D: z.object({
        E: z.optional(
          z.array(
            z.object({
              F: z.number(),
              G: z.union([
                z.object({
                  tag: z.literal(7000),
                  L: z.optional(z.number().array()),
                  M: z.set(z.array(z.string())),
                }),
                z.object({
                  tag: z.literal(8000),
                }),
                z.object({
                  tag: z.literal(9000),
                }),
              ])
            })
          )
        )
      })
    })

    vi.expect.soft(zx.defaultValue(schema_01, { unionTreatment: 'preserveAll' })).toMatchInlineSnapshot
      (`
      {
        "A": [
          1,
          [
            {
              "H": "two",
              "I": [
                undefined,
                {
                  "J": false,
                },
              ],
            },
          ],
          {
            "x": [
              undefined,
              undefined,
            ],
            "y": [
              undefined,
              undefined,
            ],
            "z": [
              undefined,
              undefined,
            ],
          },
        ],
        "B": [
          [
            7,
            {},
          ],
        ],
        "C": [
          {
            "J": undefined,
            "K": undefined,
          },
        ],
        "D": {
          "E": [
            {
              "F": undefined,
              "G": [
                {
                  "L": [],
                  "M": Set {
                    [],
                  },
                  "tag": 7000,
                },
                {
                  "tag": 8000,
                },
                {
                  "tag": 9000,
                },
              ],
            },
          ],
        },
      }
    `)

    const schema_02 = z.object({
      abc: z.tuple([
        z.literal(123),
        z.set(z.array(z.number()))
      ]),
      def: z.string(),
      ghi: z.number(),
      jkl: z.boolean(),
      mno: z.optional(z.object({
        pqr: z.record(z.enum(['P', 'Q', 'R']), z.number()),
      }))
    })

    vi.expect.soft(zx.defaultValue(schema_02)).toMatchInlineSnapshot
      (`
      {
        "abc": [
          123,
          Set {
            [],
          },
        ],
        "def": undefined,
        "ghi": undefined,
        "jkl": undefined,
        "mno": {
          "pqr": {
            "P": undefined,
            "Q": undefined,
            "R": undefined,
          },
        },
      }
    `)

    vi.expect.soft(zx.defaultValue(schema_02, { fallbacks: { boolean: false, string: '', number: 0 } })).toMatchInlineSnapshot
      (`
      {
        "abc": [
          123,
          Set {
            [],
          },
        ],
        "def": undefined,
        "ghi": undefined,
        "jkl": undefined,
        "mno": {
          "pqr": {
            "P": undefined,
            "Q": undefined,
            "R": undefined,
          },
        },
      }
    `)
  })
})
