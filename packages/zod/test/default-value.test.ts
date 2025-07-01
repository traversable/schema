import * as vi from 'vitest'
import { withDefault } from '@traversable/zod'
import { z } from 'zod/v4'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.it('〖⛳️〗› ❲withDefault❳', () => {

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

    vi.expect(withDefault(schema_01, { unionTreatment: 'preserveAll' })).toMatchInlineSnapshot
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

  })
})
