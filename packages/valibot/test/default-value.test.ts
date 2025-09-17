import * as vi from 'vitest'
import * as v from 'valibot'

import { vx } from '@traversable/valibot'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳', () => {
  vi.test('〖⛳️〗› ❲vx.defaultValue❳', () => {

    const schema_01 = v.object({
      A: v.optional(
        v.union([
          v.literal(1),
          v.array(
            v.object({
              H: v.literal('two'),
              I: v.union([
                v.number(),
                v.object({
                  J: v.optional(v.literal(false)),
                })
              ]),
            })
          ),
          v.record(
            v.enum({ x: 'x', y: 'y', z: 'z' }),
            v.optional(
              v.union([
                v.boolean(),
                v.pipe(v.number(), v.integer())
              ])
            )
          ),
        ])
      ),
      B: v.optional(
        v.array(
          v.tuple([
            v.literal(7),
            v.record(
              v.string(),
              v.union([
                v.object({
                  discriminant: v.literal('circle'),
                  radius: v.number(),
                }),
                v.object({
                  discriminant: v.literal('rectangle'),
                  width: v.number(),
                  length: v.number(),
                }),
                v.object({
                  discrimnant: v.literal('square'),
                  length: v.number(),
                }),
              ])
            )
          ]),
        )
      ),
      C: v.optional(v.tuple([
        v.object({
          J: v.unknown(),
          K: v.optional(v.string()),
        })
      ])),
      D: v.object({
        E: v.optional(
          v.array(
            v.object({
              F: v.number(),
              G: v.union([
                v.object({
                  tag: v.literal(7000),
                  L: v.optional(v.array(v.number())),
                  M: v.set(v.array(v.string())),
                }),
                v.object({
                  tag: v.literal(8000),
                }),
                v.object({
                  tag: v.literal(9000),
                }),
              ])
            })
          )
        )
      })
    })

    vi.expect.soft(
      vx.defaultValue(
        schema_01,
        { unionTreatment: 'preserveAll' }
      )
    ).toMatchInlineSnapshot
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

    const schema_02 = v.object({
      abc: v.tuple([
        v.literal(123),
        v.set(v.array(v.number()))
      ]),
      def: v.string(),
      ghi: v.number(),
      jkl: v.boolean(),
      mno: v.optional(v.object({
        pqr: v.record(v.enum({ P: 'P', Q: 'Q', R: 'R' }), v.number()),
      }))
    })

    vi.expect.soft(
      vx.defaultValue(schema_02)
    ).toMatchInlineSnapshot
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

    vi.expect.soft(
      vx.defaultValue(
        schema_02, {
        fallbacks: {
          boolean: false,
          string: '',
          number: 0
        }
      }
      )).toMatchInlineSnapshot
      (`
        {
          "abc": [
            123,
            Set {
              [],
            },
          ],
          "def": "",
          "ghi": 0,
          "jkl": false,
          "mno": {
            "pqr": {
              "P": 0,
              "Q": 0,
              "R": 0,
            },
          },
        }
      `)
  })
})
