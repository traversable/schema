import * as vi from 'vitest'
import * as v from 'valibot'
import { vx } from '@traversable/valibot'

import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳', () => {
  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.never()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.never()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.unknown()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.unknown()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.any()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.any()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.undefined()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.undefined()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.null()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.null()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === null
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.symbol()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.symbol()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "symbol"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.boolean()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.boolean()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "boolean"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.nan()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.nan()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isNaN(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.integer())', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.integer(), v.minValue(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.minValue(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && 1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.minValue(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && -1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.minValue(-1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.integer(), v.maxValue(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.maxValue(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.maxValue(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= -1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.integer(), v.multipleOf(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.multipleOf(2),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value % 2 === 0
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.integer(), v.minValue(x), v.maxValue(y))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.minValue(-1),
          v.maxValue(+1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && -1 <= value && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.maxValue(-1),
          v.maxValue(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.minValue(-1.1),
          v.maxValue(+1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.integer(), v.minValue(x), v.maxValue(y), v.multipleOf(z))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.integer(),
          v.minValue(-1),
          v.maxValue(+1),
          v.multipleOf(2),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Number.isSafeInteger(value) && -1 <= value && value <= 1 && value % 2 === 0
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.bigint()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.bigint()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.bigint(), v.minValue(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.bigint(),
          v.minValue(1n),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && 1n <= value
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.bigint(),
          v.minValue(-1n)),
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && -1n <= value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.bigint(), v.maxValue(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.bigint(),
          v.maxValue(1n),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value <= 1n
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.bigint(),
          v.maxValue(-1n),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value <= -1n
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.bigint(), v.multipleOf(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.bigint(),
          v.multipleOf(2n),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value % 2n === 0n
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.bigint(), v.minValue(x), v.maxValue(y))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.bigint(),
          v.minValue(-1n),
          v.maxValue(1n),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && -1n <= value && value <= 1n
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.bigint(),
          v.minValue(-1n),
          v.maxValue(-1n),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && -1n <= value && value <= -1n
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.bigint(), v.minValue(x), v.maxValue(y), v.multipleOf(z))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.bigint(),
          v.minValue(-1n),
          v.maxValue(1n),
          v.multipleOf(2n),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          typeof value === "bigint" &&
          -1n <= value &&
          value <= 1n &&
          value % 2n === 0n
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.number()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.number()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.minValue(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.minValue(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.minValue(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.minValue(1.1)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1.1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.minValue(-1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1.1 <= value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.gtValue(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.gtValue(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1 < value
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.gtValue(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 < value
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.gtValue(1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1.1 < value
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.gtValue(-1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1.1 < value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.maxValue(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.maxValue(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.maxValue(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.maxValue(1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= 1.1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.maxValue(-1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= -1.1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.ltValue(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.ltValue(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.ltValue(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < -1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.ltValue(1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < 1.1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.ltValue(-1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < -1.1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.multipleOf(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.multipleOf(2),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value % 2 === 0
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.minValue(x), v.maxValue(y))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.minValue(-1),
          v.maxValue(+1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 <= value && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.minValue(-1),
          v.maxValue(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 <= value && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.minValue(-1.1),
          v.maxValue(+1.1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1.1 <= value && value <= 1.1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.number(), v.minValue(x), v.maxValue(y), v.multipleOf(z))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.number(),
          v.minValue(-1),
          v.maxValue(+1),
          v.multipleOf(2)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 <= value && value <= 1 && value % 2 === 0
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.string()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.string()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.string(), v.minLength(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.string(),
          v.minLength(0),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 0 <= value.length
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.string(),
          v.minLength(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 1 <= value.length
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.string(),
          v.minLength(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.string(), v.maxLength(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.string(),
          v.maxLength(0),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && value.length <= 0
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.string(),
          v.maxLength(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && value.length <= 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.string(),
          v.maxLength(-1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.string(), v.minLength(x), v.maxLength(y))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.string(),
          v.minLength(1),
          v.maxLength(2),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 1 <= value.length && value.length <= 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.date()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.date()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value instanceof Date
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.file()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.file()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value instanceof File
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.blob()', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.blob()
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value instanceof Blob
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.promise', () => {
    vi.expect(vx.check.writeable(
      v.promise()
    )).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value instanceof Promise
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.literal(x)', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.literal(1)
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.enum', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.enum({})
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.enum({ A: 'a' })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a"
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.enum({ A: 'a', B: 'b' })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a" || value === "b"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.picklist', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.picklist([])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.picklist(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a"
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.picklist(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a" || value === "b"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.optional', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.optional(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined || value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.exactOptional', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.exactOptional(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined || value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.nonOptional', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.nonOptional(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.undefinedable', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.undefinedable(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined || value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.nullable', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.nullable(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === null || value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.nonNullable', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.nonNullable(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value !== null && value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.nullish', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.nullish(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value == null || value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.nonNullish', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.nonNullish(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value != null && value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.readonly', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.literal(1),
          v.readonly(),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.lazy', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.lazy(() => v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.set', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.set(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value instanceof Set && Array.from(value).every((value) => value === 1)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.map', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.map(
          v.literal(1),
          v.literal(2)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          value instanceof Map &&
          Array.from(value).every(([key, value]) => key === 1 && value === 2)
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.intersection', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.intersect([
          v.object({ a: v.literal(1) }),
          v.object({ b: v.literal(2) }),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          value.a === 1 &&
          !!value &&
          typeof value === "object" &&
          value.b === 2
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.array, standard usage', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.array(v.literal(1))
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.every((value) => value === 1)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.array(...), v.minLength(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.array(v.literal(1)),
          v.minLength(0),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          0 <= value.length &&
          value.every((value) => value === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.array(v.literal(1)),
          v.minLength(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          1 <= value.length &&
          value.every((value) => value === 1)
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.array(...), v.maxLength(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.array(v.literal(1)),
          v.maxLength(0),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value.length <= 0 &&
          value.every((value) => value === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.array(v.literal(1)),
          v.maxLength(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value.length <= 1 &&
          value.every((value) => value === 1)
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.array(...), v.minLength(x), v.maxLength(y))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.array(v.literal(1)),
          v.minLength(1),
          v.maxLength(2),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          1 <= value.length &&
          value.length <= 2 &&
          value.every((value) => value === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.array(v.literal(1)),
          v.minLength(1),
          v.maxLength(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value.length === 1 &&
          value.every((value) => value === 1)
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.pipe(v.array(...), v.length(x))', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.pipe(
          v.array(v.literal(1)),
          v.length(1),
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.every((value) => value === 1)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.tuple, standard usage', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.tuple([])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value)
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.tuple([v.literal(1)])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value[0] === 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.tuple([
          v.literal(1),
          v.literal(2),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value[0] === 1 && value[1] === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.tuple w/ optional items', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.tuple([v.optional(v.literal(1))])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && (value[0] === undefined || value[0] === 1)
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.tuple([
          v.optional(v.literal(1)),
          v.optional(v.literal(2)),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          (value[0] === undefined || value[0] === 1) &&
          (value[1] === undefined || value[1] === 2)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.tuple([
          v.literal(1),
          v.optional(v.literal(2)),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          (value[1] === undefined || value[1] === 2)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.tuple([
          v.literal(1),
          v.literal(2),
          v.optional(v.literal(3)),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value[1] === 2 &&
          (value[2] === undefined || value[2] === 3)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.tuple([
          v.literal(1),
          v.literal(2),
          v.optional(v.literal(3)),
          v.optional(v.literal(4)),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value[1] === 2 &&
          (value[2] === undefined || value[2] === 3) &&
          (value[3] === undefined || value[3] === 4)
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.tupleWithRest', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.tupleWithRest(
          [v.literal(1)],
          v.boolean()
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value.slice(1).every((value) => typeof value === "boolean")
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.tupleWithRest([
          v.literal(1),
          v.literal(2),
        ],
          v.boolean()
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value[1] === 2 &&
          value.slice(2).every((value) => typeof value === "boolean")
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.tuple w/ optional items + rest', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.tupleWithRest([
          v.literal(1),
          v.optional(v.literal(2)),
        ],
          v.boolean()
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          (value[1] === undefined || value[1] === 2) &&
          value.slice(2).every((value) => typeof value === "boolean")
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.tupleWithRest([
          v.literal(1),
          v.literal(2),
          v.optional(v.literal(2)),
        ],
          v.boolean()
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value[1] === 2 &&
          (value[2] === undefined || value[2] === 2) &&
          value.slice(3).every((value) => typeof value === "boolean")
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.tupleWithRest([
          v.literal(1),
          v.literal(2),
          v.optional(v.literal(2)),
          v.optional(v.literal(3)),
        ],
          v.boolean()
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value[1] === 2 &&
          (value[2] === undefined || value[2] === 2) &&
          (value[3] === undefined || value[3] === 3) &&
          value.slice(4).every((value) => typeof value === "boolean")
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.object', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.object({})
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object"
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.object({ a: v.literal(1) })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.object({
          a: v.literal(1),
          b: v.literal(2),
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1 && value.b === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.looseObject', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.looseObject({})
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object"
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.looseObject({ a: v.literal(1) })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.looseObject({
          a: v.literal(1),
          b: v.literal(2),
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1 && value.b === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.strictObject', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.strictObject({})
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object"
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.strictObject({ a: v.literal(1) })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.strictObject({
          a: v.literal(1),
          b: v.literal(2),
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1 && value.b === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.object w/ optional properties', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.object({
          a: v.optional(v.literal(1)),
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (value.a === undefined || value.a === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.object({
          a: v.optional(v.literal(1)),
          b: v.literal(2),
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (value.a === undefined || value.a === 1) &&
          value.b === 2
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.object({
          a: v.optional(v.literal(1)),
          b: v.literal(2),
          c: v.optional(v.literal(3)),
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (value.a === undefined || value.a === 1) &&
          value.b === 2 &&
          (value.c === undefined || value.c === 3)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.object({
          a: v.optional(v.literal(1)),
          b: v.literal(2),
          c: v.optional(v.literal(3)),
          d: v.literal(4),
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (value.a === undefined || value.a === 1) &&
          value.b === 2 &&
          (value.c === undefined || value.c === 3) &&
          value.d === 4
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.objectWithRest', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.objectWithRest({}, v.boolean())
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.values(value).every((value) => typeof value === "boolean")
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.objectWithRest(
          { a: v.literal(1) },
          v.boolean()
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          value.a === 1 &&
          Object.entries(value)
            .filter(([key]) => !["a"].includes(key))
            .every(([, value]) => typeof value === "boolean")
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.record', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.record(
          v.string(),
          v.literal(1)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(
            ([key, value]) => typeof key === "string" && value === 1,
          )
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.record w/ v.picklist key type', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.record(
          v.picklist([]),
          v.literal(1)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(([key, value]) => true && value === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.record(
          v.picklist(['a']),
          v.literal(1)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(([key, value]) => key === "a" && value === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.record(
          v.picklist(['a', 'b']),
          v.literal(1)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(
            ([key, value]) => (key === "a" || key === "b") && value === 1,
          )
        )
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.record w/ v.enum key type', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.record(
          v.enum({}),
          v.literal(1)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(([key, value]) => true && value === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.record(
          v.enum({ a: 'a' }),
          v.literal(1)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(([key, value]) => key === "a" && value === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.record(
          v.enum({ A: 'a', B: 'b' }),
          v.literal(1)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(
            ([key, value]) => (key === "a" || key === "b") && value === 1,
          )
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.union', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.union([
          v.literal(1)
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.union([
          v.literal(1),
          v.literal(2),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1 || value === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.variant', () => {
    vi.expect.soft(format(
      vx.check.writeable(
        v.variant('tag', [])
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.variant(
          'tag',
          [
            v.object({
              tag: v.literal('A'),
              onA: v.number(),
            }),
          ]
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.tag === "A"
          ? value.tag === "A" && Number.isFinite(value.onA)
          : false
      }
      "
    `)

    vi.expect.soft(format(
      vx.check.writeable(
        v.variant(
          'tag',
          [
            v.object({
              tag: v.literal('A'),
              onA: v.number(),
            }),
            v.object({
              tag: v.literal('B'),
              onB: v.string(),
            }),
          ]
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.tag === "A"
          ? value.tag === "A" && Number.isFinite(value.onA)
          : value.tag === "B"
            ? value.tag === "B" && typeof value.onB === "string"
            : false
      }
      "
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: unimplemented', () => {
  vi.test('〖⛳️〗› ❲vx.check.writeable❳: v.custom', () => {
    vi.expect(() => vx.check.writeable(v.custom(() => false))).to.throw()
  })
})
