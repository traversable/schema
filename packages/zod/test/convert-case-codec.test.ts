import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', printWidth: 60 })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲camelCase❳', () => {
    vi.expect.soft(
      zx.camelCase('abc_def')
    ).toMatchInlineSnapshot
      (`"abcDef"`)
  })

  vi.test('〖⛳️〗› ❲snakeCase❳', () => {
    vi.expect.soft(
      zx.snakeCase('abcDef')
    ).toMatchInlineSnapshot
      (`"abc_def"`)
  })

  vi.test('〖⛳️〗› ❲zx.convertCaseCodec❳', () => {
    const schema_01 = z.object({
      abc: z.string(),
      def: z.object({
        ghi: z.array(
          z.object({
            jkl: z.boolean()
          })
        )
      })
    })

    const ALL_CAPS = zx.convertCaseCodec({
      decodeKeys: (k) => k.toUpperCase(),
      encodeKeys: (k) => k.toLowerCase(),
    })

    vi.expect.soft(
      ALL_CAPS(schema_01).parse({
        abc: 'hi how are you',
        def: {
          ghi: [
            {
              jkl: false
            },
            {
              jkl: true
            },
          ]
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "ABC": "hi how are you",
        "DEF": {
          "GHI": [
            {
              "JKL": false,
            },
            {
              "JKL": true,
            },
          ],
        },
      }
    `)


    vi.expect.soft(
      ALL_CAPS(schema_01).decode({
        abc: 'hi how are you',
        def: {
          ghi: [
            {
              jkl: false
            },
            {
              jkl: true
            },
          ]
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "ABC": "hi how are you",
        "DEF": {
          "GHI": [
            {
              "JKL": false,
            },
            {
              "JKL": true,
            },
          ],
        },
      }
    `)

    vi.expect.soft(
      ALL_CAPS(schema_01).encode({
        "ABC": "hi how are you",
        "DEF": {
          "GHI": [
            {
              "JKL": false,
            },
            {
              "JKL": true,
            },
          ],
        },
      })
    ).toMatchInlineSnapshot
      (`
      {
        "abc": "hi how are you",
        "def": {
          "ghi": [
            {
              "jkl": false,
            },
            {
              "jkl": true,
            },
          ],
        },
      }
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepCamelCaseCodec❳', () => {
    const CAMEL = zx.deepCamelCaseCodec(
      z.object({
        abc_def: z.string(),
        ghi_jkl: z.object({
          mno_pqr: z.number(),
          stu_vwx: z.array(
            z.object({
              y_z: z.boolean()
            })
          )
        })
      })
    )

    vi.expect.soft(
      CAMEL.parse({
        abc_def: 'hi how are you',
        ghi_jkl: {
          mno_pqr: 123,
          stu_vwx: [
            {
              y_z: true
            },
            {
              y_z: false
            }
          ]
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "abcDef": "hi how are you",
        "ghiJkl": {
          "mnoPqr": 123,
          "stuVwx": [
            {
              "yZ": true,
            },
            {
              "yZ": false,
            },
          ],
        },
      }
    `)

    vi.expect.soft(
      CAMEL.decode({
        abc_def: 'hi how are you',
        ghi_jkl: {
          mno_pqr: 123,
          stu_vwx: [
            {
              y_z: true
            },
            {
              y_z: false
            }
          ]
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "abcDef": "hi how are you",
        "ghiJkl": {
          "mnoPqr": 123,
          "stuVwx": [
            {
              "yZ": true,
            },
            {
              "yZ": false,
            },
          ],
        },
      }
    `)

    vi.expect.soft(
      CAMEL.encode({
        "abcDef": "hi how are you",
        "ghiJkl": {
          "mnoPqr": 123,
          "stuVwx": [
            {
              "yZ": true,
            },
            {
              "yZ": false,
            },
          ],
        },
      })
    ).toMatchInlineSnapshot
      (`
      {
        "abc_def": "hi how are you",
        "ghi_jkl": {
          "mno_pqr": 123,
          "stu_vwx": [
            {
              "y_z": true,
            },
            {
              "y_z": false,
            },
          ],
        },
      }
    `)
  })

  vi.test('〖⛳️〗› ❲zx.deepSnakeCaseCodec❳', () => {
    const SNAKE = zx.deepSnakeCaseCodec(
      z.object({
        abcDef: z.string(),
        ghiJkl: z.object({
          mnoPqr: z.number(),
          stuVwx: z.array(
            z.object({
              yZ: z.boolean()
            })
          )
        })
      })
    )

    vi.expect.soft(
      SNAKE.parse({
        "abcDef": "hi how are you",
        "ghiJkl": {
          "mnoPqr": 123,
          "stuVwx": [
            {
              "yZ": true,
            },
            {
              "yZ": false,
            },
          ],
        },
      })
    ).toMatchInlineSnapshot
      (`
      {
        "abc_def": "hi how are you",
        "ghi_jkl": {
          "mno_pqr": 123,
          "stu_vwx": [
            {
              "y_z": true,
            },
            {
              "y_z": false,
            },
          ],
        },
      }
    `)

    vi.expect.soft(
      SNAKE.decode({
        "abcDef": "hi how are you",
        "ghiJkl": {
          "mnoPqr": 123,
          "stuVwx": [
            {
              "yZ": true,
            },
            {
              "yZ": false,
            },
          ],
        },
      })
    ).toMatchInlineSnapshot
      (`
      {
        "abc_def": "hi how are you",
        "ghi_jkl": {
          "mno_pqr": 123,
          "stu_vwx": [
            {
              "y_z": true,
            },
            {
              "y_z": false,
            },
          ],
        },
      }
    `)

    vi.expect.soft(
      SNAKE.encode({
        "abc_def": "hi how are you",
        "ghi_jkl": {
          "mno_pqr": 123,
          "stu_vwx": [
            {
              "y_z": true,
            },
            {
              "y_z": false,
            },
          ],
        },
      })
    ).toMatchInlineSnapshot
      (`
      {
        "abcDef": "hi how are you",
        "ghiJkl": {
          "mnoPqr": 123,
          "stuVwx": [
            {
              "yZ": true,
            },
            {
              "yZ": false,
            },
          ],
        },
      }
    `)
  })
})
