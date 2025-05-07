import * as vi from 'vitest'

import { Json } from '@traversable/schema-compiler'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-compiler❳', () => {
  vi.it('〖⛳️〗› ❲Json.generate❳: throws given non-JSON input', () => {
    /* @ts-expect-error */
    vi.assert.throws(() => Json.generate(Symbol()))

    /* @ts-expect-error */
    vi.assert.throws(() => Json.generate(1n))
  })

  vi.it('〖⛳️〗› ❲Json.generate❳: null', () => {
    vi.expect(Json.generate(
      null
    )).toMatchInlineSnapshot

      (`"value === null"`)
  })

  vi.it('〖⛳️〗› ❲Json.generate❳: undefined', () => {
    vi.expect(Json.generate(
      undefined
    )).toMatchInlineSnapshot
      (`"value === undefined"`)
  })

  vi.it('〖⛳️〗› ❲Json.generate❳: booleans', () => {
    vi.expect(Json.generate(
      false
    )).toMatchInlineSnapshot
      (`"value === false"`)

    vi.expect(Json.generate(
      true
    )).toMatchInlineSnapshot
      (`"value === true"`)
  })

  vi.it('〖⛳️〗› ❲Json.generate❳: numbers', () => {
    vi.expect(Json.generate(
      Number.MIN_SAFE_INTEGER
    )).toMatchInlineSnapshot
      (`"value === -9007199254740991"`)

    vi.expect(Json.generate(
      Number.MAX_SAFE_INTEGER
    )).toMatchInlineSnapshot
      (`"value === 9007199254740991"`)

    vi.expect(Json.generate(
      +0
    )).toMatchInlineSnapshot
      (`"value === +0"`)

    vi.expect(Json.generate(
      -0
    )).toMatchInlineSnapshot
      (`"value === -0"`)

    vi.expect(Json.generate(
      1 / 3
    )).toMatchInlineSnapshot
      (`"value === 0.3333333333333333"`)

    vi.expect(Json.generate(
      -1 / 3
    )).toMatchInlineSnapshot
      (`"value === -0.3333333333333333"`)

    vi.expect(Json.generate(
      1e+21
    )).toMatchInlineSnapshot
      (`"value === 1e+21"`)

    vi.expect(Json.generate(
      -1e+21
    )).toMatchInlineSnapshot
      (`"value === -1e+21"`)

    vi.expect(Json.generate(
      1e-21
    )).toMatchInlineSnapshot
      (`"value === 1e-21"`)

    vi.expect(Json.generate(
      -1e-21
    )).toMatchInlineSnapshot
      (`"value === -1e-21"`)
  })

  vi.it('〖⛳️〗› ❲Json.generate❳: strings', () => {
    vi.expect(Json.generate(
      ''
    )).toMatchInlineSnapshot
      (`"value === """`)

    vi.expect(Json.generate(
      '\\'
    )).toMatchInlineSnapshot
      (`"value === "\\\\""`)
  })

  vi.it('〖⛳️〗› ❲Json.generate❳: objects', () => {
    vi.expect(Json.generate(
      {}
    )).toMatchInlineSnapshot
      (`"!!value && typeof value === "object" && !Array.isArray(value)"`)

    vi.expect(Json.generate(
      {
        m: { o: 'O' },
        l: ['L']
      }
    )).toMatchInlineSnapshot
      (`
      "!!value && typeof value === "object" && !Array.isArray(value)
        && Array.isArray(value.l) && value.l.length === 1
          && value.l[0] === "L"
        && !!value.m && typeof value.m === "object" && !Array.isArray(value.m)
          && value.m.o === "O""
    `)

  })

  vi.it('〖⛳️〗› ❲Json.generate❳: arrays', () => {
    vi.expect(Json.generate(
      []
    )).toMatchInlineSnapshot
      (`"Array.isArray(value) && value.length === 0"`)

    vi.expect(Json.generate(
      [1, 2, 3]
    )).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 3
        && value[0] === 1
        && value[1] === 2
        && value[2] === 3"
    `)

    vi.expect(Json.generate(
      [[11], [22], [33]]
    )).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 3
        && Array.isArray(value[0]) && value[0].length === 1
          && value[0][0] === 11
        && Array.isArray(value[1]) && value[1].length === 1
          && value[1][0] === 22
        && Array.isArray(value[2]) && value[2].length === 1
          && value[2][0] === 33"
    `)

    vi.expect(Json.generate(
      [
        {
          a: 3,
          b: 3,
          c: [5, 6]
        },
        { z: 2 },
        1,
      ]
    )).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 3
        && value[2] === 1
        && !!value[1] && typeof value[1] === "object" && !Array.isArray(value[1])
          && value[1].z === 2
        && !!value[0] && typeof value[0] === "object" && !Array.isArray(value[0])
          && value[0].a === 3
          && value[0].b === 3
          && Array.isArray(value[0].c) && value[0].c.length === 2
            && value[0].c[0] === 5
            && value[0].c[1] === 6"
    `)

    vi.expect(Json.generate(
      [
        { THREE: [{ A: null, B: false }] },
        { FOUR: [{ A: 1, B: false }], C: '' },
        { TWO: [{ A: null, B: undefined }] },
        { ONE: [true] }
      ]
    )).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 4
        && !!value[3] && typeof value[3] === "object" && !Array.isArray(value[3])
          && Array.isArray(value[3].ONE) && value[3].ONE.length === 1
            && value[3].ONE[0] === true
        && !!value[2] && typeof value[2] === "object" && !Array.isArray(value[2])
          && Array.isArray(value[2].TWO) && value[2].TWO.length === 1
            && !!value[2].TWO[0] && typeof value[2].TWO[0] === "object" && !Array.isArray(value[2].TWO[0])
              && value[2].TWO[0].B === undefined
              && value[2].TWO[0].A === null
        && !!value[0] && typeof value[0] === "object" && !Array.isArray(value[0])
          && Array.isArray(value[0].THREE) && value[0].THREE.length === 1
            && !!value[0].THREE[0] && typeof value[0].THREE[0] === "object" && !Array.isArray(value[0].THREE[0])
              && value[0].THREE[0].A === null
              && value[0].THREE[0].B === false
        && !!value[1] && typeof value[1] === "object" && !Array.isArray(value[1])
          && value[1].C === ""
          && Array.isArray(value[1].FOUR) && value[1].FOUR.length === 1
            && !!value[1].FOUR[0] && typeof value[1].FOUR[0] === "object" && !Array.isArray(value[1].FOUR[0])
              && value[1].FOUR[0].B === false
              && value[1].FOUR[0].A === 1"
    `)

    let modularArithmetic = (mod: number, operator: '+' | '*') => {
      let index = mod,
        row = Array.of<number>(),
        col = Array.of<number>(),
        matrix = Array.of<number[]>()
      while (index-- !== 0) void (
        row.push(index),
        col.push(index),
        matrix.push(Array.from({ length: mod }))
      )
      for (let i = 0; i < row.length; i++)
        for (let j = 0; j < col.length; j++)
          matrix[i][j] = (operator === '+' ? i + j : i * j) % mod
      //
      return matrix
    }

    let table = modularArithmetic(5, '*')

    vi.expect(table).toMatchInlineSnapshot
      (`
      [
        [
          0,
          0,
          0,
          0,
          0,
        ],
        [
          0,
          1,
          2,
          3,
          4,
        ],
        [
          0,
          2,
          4,
          1,
          3,
        ],
        [
          0,
          3,
          1,
          4,
          2,
        ],
        [
          0,
          4,
          3,
          2,
          1,
        ],
      ]
    `)

    vi.expect(Json.generate(table)).toMatchInlineSnapshot
      (`
      "Array.isArray(value) && value.length === 5
        && Array.isArray(value[0]) && value[0].length === 5
          && value[0][0] === +0
          && value[0][1] === +0
          && value[0][2] === +0
          && value[0][3] === +0
          && value[0][4] === +0
        && Array.isArray(value[1]) && value[1].length === 5
          && value[1][0] === +0
          && value[1][1] === 1
          && value[1][2] === 2
          && value[1][3] === 3
          && value[1][4] === 4
        && Array.isArray(value[2]) && value[2].length === 5
          && value[2][0] === +0
          && value[2][1] === 2
          && value[2][2] === 4
          && value[2][3] === 1
          && value[2][4] === 3
        && Array.isArray(value[3]) && value[3].length === 5
          && value[3][0] === +0
          && value[3][1] === 3
          && value[3][2] === 1
          && value[3][3] === 4
          && value[3][4] === 2
        && Array.isArray(value[4]) && value[4].length === 5
          && value[4][0] === +0
          && value[4][1] === 4
          && value[4][2] === 3
          && value[4][3] === 2
          && value[4][4] === 1"
    `)

  })

  vi.it('〖⛳️〗› ❲Json.getWeight❳', () => {
    vi.expect(Json.getWeight(null)).toMatchInlineSnapshot(`2`)
    vi.expect(Json.getWeight(undefined)).toMatchInlineSnapshot(`1`)
    vi.expect(Json.getWeight(false)).toMatchInlineSnapshot(`4`)
    vi.expect(Json.getWeight(true)).toMatchInlineSnapshot(`4`)
    vi.expect(Json.getWeight([true, false, ['heyy']])).toMatchInlineSnapshot(`280`)
  })

  vi.it('〖⛳️〗› ❲Json.sort❳', () => {
    vi.expect(Json.sort([1, { a: 3, b: 3, c: [5, 6] }, { z: 2 }])).toMatchInlineSnapshot(`
      {
        "def": [
          {
            "def": 1,
            "preSortIndex": 0,
            "tag": "@traversable/schema/URI::bottom",
          },
          {
            "def": [
              [
                "z",
                {
                  "def": 2,
                  "tag": "@traversable/schema/URI::bottom",
                },
              ],
            ],
            "preSortIndex": 2,
            "tag": "@traversable/schema/URI::object",
          },
          {
            "def": [
              [
                "a",
                {
                  "def": 3,
                  "tag": "@traversable/schema/URI::bottom",
                },
              ],
              [
                "b",
                {
                  "def": 3,
                  "tag": "@traversable/schema/URI::bottom",
                },
              ],
              [
                "c",
                {
                  "def": [
                    {
                      "def": 5,
                      "preSortIndex": 0,
                      "tag": "@traversable/schema/URI::bottom",
                    },
                    {
                      "def": 6,
                      "preSortIndex": 1,
                      "tag": "@traversable/schema/URI::bottom",
                    },
                  ],
                  "tag": "@traversable/schema/URI::array",
                },
              ],
            ],
            "preSortIndex": 1,
            "tag": "@traversable/schema/URI::object",
          },
        ],
        "tag": "@traversable/schema/URI::array",
      }
    `)

    vi.expect(Json.sort([{ a: 2 }, { a: true }])).toMatchInlineSnapshot(`
      {
        "def": [
          {
            "def": [
              [
                "a",
                {
                  "def": true,
                  "tag": "@traversable/schema/URI::bottom",
                },
              ],
            ],
            "preSortIndex": 1,
            "tag": "@traversable/schema/URI::object",
          },
          {
            "def": [
              [
                "a",
                {
                  "def": 2,
                  "tag": "@traversable/schema/URI::bottom",
                },
              ],
            ],
            "preSortIndex": 0,
            "tag": "@traversable/schema/URI::object",
          },
        ],
        "tag": "@traversable/schema/URI::array",
      }
    `)

    vi.expect(Json.sort([{ a: [[10]] }, { a: [[false]] }])).toMatchInlineSnapshot(`
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
                          "preSortIndex": 0,
                          "tag": "@traversable/schema/URI::bottom",
                        },
                      ],
                      "preSortIndex": 0,
                      "tag": "@traversable/schema/URI::array",
                    },
                  ],
                  "tag": "@traversable/schema/URI::array",
                },
              ],
            ],
            "preSortIndex": 1,
            "tag": "@traversable/schema/URI::object",
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
                          "preSortIndex": 0,
                          "tag": "@traversable/schema/URI::bottom",
                        },
                      ],
                      "preSortIndex": 0,
                      "tag": "@traversable/schema/URI::array",
                    },
                  ],
                  "tag": "@traversable/schema/URI::array",
                },
              ],
            ],
            "preSortIndex": 0,
            "tag": "@traversable/schema/URI::object",
          },
        ],
        "tag": "@traversable/schema/URI::array",
      }
    `)
  })
})
