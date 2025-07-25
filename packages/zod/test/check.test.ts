import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.never()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.never())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.unknown()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.unknown())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.any()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.any())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.undefined()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.undefined())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.null()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.null())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === null
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.symbol()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.symbol())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "symbol"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.boolean()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.boolean())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "boolean"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.nan()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.nan())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isNaN(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.int())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().min(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.int().min(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && 1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.int().min(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && -1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.int().min(-1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().max(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.int().max(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.int().max(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.int().max(-1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().multipleOf(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.int().multipleOf(2))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value % 2 === 0
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().min(x).max(y)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.int().min(-1).max(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && -1 <= value && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.int().max(-1).max(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.int().min(-1.1).max(1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().min(x).max(y).multipleOf(z)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.int().min(-1).max(1).multipleOf(2))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.bigint())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint().min(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.bigint().min(1n))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && 1n <= value
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.bigint().min(-1n))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && -1n <= value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint().max(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.bigint().max(1n))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value <= 1n
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.bigint().max(-1n))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value <= -1n
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint.multipleOf(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.bigint().multipleOf(2n))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value % 2n === 0n
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint.min(x).max(y)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.bigint().min(-1n).max(1n))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && -1n <= value && value <= 1n
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.bigint().max(-1n).max(-1n))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value <= -1n
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint().min(x).max(y).multipleOf(z)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.bigint().min(-1n).max(1n).multipleOf(2n))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.number())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().min(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.number().min(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().min(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().min(1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1.1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().min(-1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1.1 <= value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().gt(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.number().gt(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1 < value
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().gt(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 < value
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().gt(1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1.1 < value
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().gt(-1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1.1 < value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().max(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.number().max(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().max(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().max(1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= 1.1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().max(-1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= -1.1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().lt(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.number().lt(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().lt(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < -1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().lt(1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < 1.1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().lt(-1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < -1.1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().multipleOf(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.number().multipleOf(2))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value % 2 === 0
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().min(x).max(y)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.number().min(-1).max(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 <= value && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().max(-1).max(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.number().min(-1.1).max(1.1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1.1 <= value && value <= 1.1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().min(x).max(y).multipleOf(z)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.number().min(-1).max(1).multipleOf(2))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.string())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string().min(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.string().min(0))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 0 <= value.length
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.string().min(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 1 <= value.length
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.string().min(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string().max(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.string().max(0))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && value.length <= 0
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.string().max(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && value.length <= 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.string().max(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string().length(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.string().length(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 1 <= value.length && value.length <= 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.string().length(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 1 <= value.length && value.length <= 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.string().length(-1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string().min(x).max(y)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.string().min(1).max(2))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 1 <= value.length && value.length <= 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.date()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.date())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value instanceof globalThis.Date
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.file()', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.file())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value instanceof globalThis.File
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.literal(x)', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.literal(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.literal([...xs])', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.literal([1]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.literal([1, 2]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1 || value === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.templateLiteral', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.templateLiteral([]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && new globalThis.RegExp("^$").test(value)
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.templateLiteral(['a']))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && new globalThis.RegExp("^a$").test(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.enum', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.enum([]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.enum(['a']))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a"
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.enum(['a', 'b']))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a" || value === "b"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.optional', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.enum([]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.enum(['a']))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a"
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.enum(['a', 'b']))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a" || value === "b"
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.enum({}))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return
      }
      "
    `)


    vi.expect.soft(format(
      zx.check.writeable(z.enum({ a: '1' }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "1"
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.enum({ a: '1', b: '2' }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "1" || value === "2"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.optional', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.optional(z.literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined || value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.nonoptional', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.nonoptional(z.literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value !== undefined && value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.nullable', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.nullable(z.literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === null || value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.readonly', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.readonly(z.literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.lazy', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.lazy(() => z.literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.catch', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.catch(z.boolean(), false))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.default', () => {
    vi.expect.soft(format(
      zx.check.writeable(z._default(z.boolean(), false))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.set', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.set(z.literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          value instanceof globalThis.Set &&
          globalThis.Array.from(value).every((value) => value === 1)
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.map', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.map(z.literal(1), z.literal(2)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          value instanceof globalThis.Map &&
          globalThis.Array.from(value).every(
            ([key, value]) => key === 1 && value === 2,
          )
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.intersection', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.intersection(z.object({ a: z.literal(1) }), z.object({ b: z.literal(2) })))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.tuple, standard usage', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.tuple([]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value)
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.literal(1)]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value[0] === 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2)]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value[0] === 1 && value[1] === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.tuple w/ optional items', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.optional(z.literal(1))]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && (value?.[0] === undefined || value?.[0] === 1)
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.optional(z.literal(1)), z.optional(z.literal(2))]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          (value?.[0] === undefined || value?.[0] === 1) &&
          (value?.[1] === undefined || value?.[1] === 2)
        )
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.literal(1), z.optional(z.literal(2))]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          (value?.[1] === undefined || value?.[1] === 2)
        )
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2), z.optional(z.literal(3))]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value[1] === 2 &&
          (value?.[2] === undefined || value?.[2] === 3)
        )
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2), z.optional(z.literal(3)), z.optional(z.literal(4))]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value[1] === 2 &&
          (value?.[2] === undefined || value?.[2] === 3) &&
          (value?.[3] === undefined || value?.[3] === 4)
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.tuple w/ rest', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.literal(1)], z.boolean()))
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
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2)], z.boolean()))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.tuple w/ optional items + rest', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.literal(1), z.optional(z.literal(2))], z.boolean()))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          (value?.[1] === undefined || value?.[1] === 2) &&
          value.slice(2).every((value) => typeof value === "boolean")
        )
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2), z.optional(z.literal(2))], z.boolean()))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value[1] === 2 &&
          (value?.[2] === undefined || value?.[2] === 2) &&
          value.slice(3).every((value) => typeof value === "boolean")
        )
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2), z.optional(z.literal(2)), z.optional(z.literal(3))], z.boolean()))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          Array.isArray(value) &&
          value[0] === 1 &&
          value[1] === 2 &&
          (value?.[2] === undefined || value?.[2] === 2) &&
          (value?.[3] === undefined || value?.[3] === 3) &&
          value.slice(4).every((value) => typeof value === "boolean")
        )
      }
      "
    `)
  })


  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.object, standard usage', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.object({}))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object"
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.object({ a: z.literal(1) }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.object({ a: z.literal(1), b: z.literal(2) }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1 && value.b === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.object w/ optional properties', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.object({ a: z.optional(z.literal(1)) }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (!Object.hasOwn(value, "a") || value?.a === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.object({ a: z.optional(z.literal(1)), b: z.literal(2) }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (!Object.hasOwn(value, "a") || value?.a === 1) &&
          value.b === 2
        )
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.object({ a: z.optional(z.literal(1)), b: z.literal(2), c: z.optional(z.literal(3)) }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (!Object.hasOwn(value, "a") || value?.a === 1) &&
          value.b === 2 &&
          (!Object.hasOwn(value, "c") || value?.c === 3)
        )
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.object({ a: z.optional(z.literal(1)), b: z.literal(2), c: z.optional(z.literal(3)), d: z.literal(4) }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (!Object.hasOwn(value, "a") || value?.a === 1) &&
          value.b === 2 &&
          (!Object.hasOwn(value, "c") || value?.c === 3) &&
          value.d === 4
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.object w/ catchall', () => {

    vi.expect.soft(format(
      zx.check.writeable(z.object({}).catchall(z.boolean()))
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
      zx.check.writeable(z.object({}).catchall(z.boolean()))
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
      zx.check.writeable(z.object({ a: z.literal(1) }).catchall(z.boolean()))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.record, standard usage', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.record(z.string(), z.literal(1)))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.record w/ enum key type', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.record(z.enum([]), z.literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(([key, value]) => value === 1)
        )
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.record(z.enum(['a']), z.literal(1)))
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
      zx.check.writeable(z.record(z.enum(['a', 'b']), z.literal(1)))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.union', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.union([]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.union([z.literal(1)]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)

    vi.expect.soft(format(
      zx.check.writeable(z.union([z.literal(1), z.literal(2)]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1 || value === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array, standard usage', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.array(z.literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.every((value) => value === 1)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array w/ min', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.array(z.literal(1)).min(0))
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
      zx.check.writeable(z.array(z.literal(1)).min(1))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array w/ max', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.array(z.literal(1)).max(0))
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
      zx.check.writeable(z.array(z.literal(1)).max(1))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array w/ min & max', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.array(z.literal(1)).min(1).max(2))
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
      zx.check.writeable(z.array(z.literal(1)).min(1).max(1))
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

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array w/ length', () => {
    vi.expect.soft(format(
      zx.check.writeable(z.array(z.literal(1)).length(1))
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
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: unimplemented', () => {
  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.custom', () => {
    vi.expect(() => zx.check.writeable(z.custom(() => {}))).to.throw()
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.prefault', () => {
    vi.expect(() => zx.check.writeable(z.prefault(z.literal(1), 1))).to.throw()
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.promise', () => {
    vi.expect(() => zx.check.writeable(z.promise(z.literal(1)))).to.throw()
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.success', () => {
    vi.expect(() => zx.check.writeable(z.success(z.literal(1)))).to.throw()
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.transform', () => {
    vi.expect(() => zx.check.writeable(z.transform(String))).to.throw()
  })
})
