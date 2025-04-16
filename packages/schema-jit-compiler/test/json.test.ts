import * as vi from 'vitest'
import { fc, test } from '@fast-check/vitest'

import { t } from '@traversable/schema-core'
import type * as T from '@traversable/registry'
import { fn, URI, symbol } from '@traversable/registry'
import { Seed } from '@traversable/schema-seed'
import type { Algebra, Index } from '@traversable/schema-jit-compiler'
import { Json } from '@traversable/schema-jit-compiler'
import { getJsonWeight as getWeight, sortJson as sort } from '@traversable/schema-jit-compiler'



vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-jit-compiler❳', () => {
  vi.it('〖⛳️〗› ❲Json.unfoldComparator❳', () => {
    vi.expect(getWeight(null)).toMatchInlineSnapshot(`2`)
    vi.expect(getWeight(undefined)).toMatchInlineSnapshot(`1`)
    vi.expect(getWeight(false)).toMatchInlineSnapshot(`4`)
    vi.expect(getWeight(true)).toMatchInlineSnapshot(`4`)
    vi.expect(getWeight([true, false, ['heyy']])).toMatchInlineSnapshot(`280`)

    vi.expect(sort([1, { a: 3, b: 3, c: [5, 6] }, { z: 2 }])).toMatchInlineSnapshot(`
      {
        "def": [
          {
            "def": 1,
            "tag": "@traversable/schema-core/URI::bottom",
          },
          {
            "def": [
              [
                "z",
                {
                  "def": 2,
                  "tag": "@traversable/schema-core/URI::bottom",
                },
              ],
            ],
            "tag": "@traversable/schema-core/URI::object",
          },
          {
            "def": [
              [
                "a",
                {
                  "def": 3,
                  "tag": "@traversable/schema-core/URI::bottom",
                },
              ],
              [
                "b",
                {
                  "def": 3,
                  "tag": "@traversable/schema-core/URI::bottom",
                },
              ],
              [
                "c",
                {
                  "def": [
                    {
                      "def": 5,
                      "tag": "@traversable/schema-core/URI::bottom",
                    },
                    {
                      "def": 6,
                      "tag": "@traversable/schema-core/URI::bottom",
                    },
                  ],
                  "tag": "@traversable/schema-core/URI::array",
                },
              ],
            ],
            "tag": "@traversable/schema-core/URI::object",
          },
        ],
        "tag": "@traversable/schema-core/URI::array",
      }
    `)

    vi.expect(sort([{ a: 2 }, { a: true }])).toMatchInlineSnapshot(`
      {
        "def": [
          {
            "def": [
              [
                "a",
                {
                  "def": true,
                  "tag": "@traversable/schema-core/URI::bottom",
                },
              ],
            ],
            "tag": "@traversable/schema-core/URI::object",
          },
          {
            "def": [
              [
                "a",
                {
                  "def": 2,
                  "tag": "@traversable/schema-core/URI::bottom",
                },
              ],
            ],
            "tag": "@traversable/schema-core/URI::object",
          },
        ],
        "tag": "@traversable/schema-core/URI::array",
      }
    `)

    vi.expect(sort([{ a: [[10]] }, { a: [[false]] }])).toMatchInlineSnapshot(`
      {
        "def": [
          {
            "def": [
              [
                "a",
                {
                  "def": [
                    {
                      "def": [
                        {
                          "def": false,
                          "tag": "@traversable/schema-core/URI::bottom",
                        },
                      ],
                      "tag": "@traversable/schema-core/URI::array",
                    },
                  ],
                  "tag": "@traversable/schema-core/URI::array",
                },
              ],
            ],
            "tag": "@traversable/schema-core/URI::object",
          },
          {
            "def": [
              [
                "a",
                {
                  "def": [
                    {
                      "def": [
                        {
                          "def": 10,
                          "tag": "@traversable/schema-core/URI::bottom",
                        },
                      ],
                      "tag": "@traversable/schema-core/URI::array",
                    },
                  ],
                  "tag": "@traversable/schema-core/URI::array",
                },
              ],
            ],
            "tag": "@traversable/schema-core/URI::object",
          },
        ],
        "tag": "@traversable/schema-core/URI::array",
      }
    `)


  })
})
