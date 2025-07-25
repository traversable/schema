import * as vi from 'vitest'
import * as T from '@sinclair/typebox'
import prettier from '@prettier/sync'
import { check } from '@traversable/typebox-types'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/typebox❳', () => {
  vi.test('〖⛳️〗› ❲check.writeable❳: T.Never', () => {
    vi.expect.soft(format(
      check.writeable(T.Never())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Unknown', () => {
    vi.expect.soft(format(
      check.writeable(T.Unknown())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Any', () => {
    vi.expect.soft(format(
      check.writeable(T.Any())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Undefined', () => {
    vi.expect.soft(format(
      check.writeable(T.Undefined())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Null', () => {
    vi.expect.soft(format(
      check.writeable(T.Null())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === null
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Symbol', () => {
    vi.expect.soft(format(
      check.writeable(T.Symbol())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "symbol"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Boolean', () => {
    vi.expect.soft(format(
      check.writeable(T.Boolean())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "boolean"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Integer', () => {
    vi.expect.soft(format(
      check.writeable(T.Integer())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Integer({ minimum: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.Integer({ minimum: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && 1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Integer({ minimum: - 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && -1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Integer({ minimum: -1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Integer({ maximum: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.Integer({ maximum: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Integer({ maximum: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Integer({ maximum: -1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Integer({ multipleOf: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.Integer({ multipleOf: 2 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Integer({ minimum: x, maximum: y })', () => {
    vi.expect.soft(format(
      check.writeable(T.Integer({ minimum: -1, maximum: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && -1 <= value && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Integer({ maximum: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Integer({ minimum: -1, maximum: 1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && -1 <= value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Integer({ minimum: x, maximum: y, multipleOf: z })', () => {
    vi.expect.soft(format(
      check.writeable(T.Integer({ minimum: -1, maximum: 1, multipleOf: 2 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isSafeInteger(value) && -1 <= value && value <= 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.BigInt', () => {
    vi.expect.soft(format(
      check.writeable(T.BigInt())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.BigInt({ minimum: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.BigInt({ minimum: 1n }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && 1n <= value
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.BigInt({ minimum: -1n }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && -1n <= value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.BigInt({ maximum: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.BigInt({ maximum: 1n }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value <= 1n
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.BigInt({ maximum: -1n }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && value <= -1n
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.BigInt({ multipleOf: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.BigInt({ multipleOf: 2n }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.BigInt({ minimum: x, maximum: y })', () => {
    vi.expect.soft(format(
      check.writeable(T.BigInt({ minimum: -1n, maximum: 1n }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && -1n <= value && value <= 1n
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.BigInt({ minimum: -1n, maximum: -1n }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && -1n <= value && value <= -1n
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.BigInt({ minimum: x, maximum: y, multipleOf: z })', () => {
    vi.expect.soft(format(
      check.writeable(T.BigInt({ minimum: -1n, maximum: 1n, multipleOf: 2n }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "bigint" && -1n <= value && value <= 1n
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Number', () => {
    vi.expect.soft(format(
      check.writeable(T.Number())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Number({ minimum: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.Number({ minimum: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ minimum: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ minimum: 1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1.1 <= value
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ minimum: -1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1.1 <= value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Number({ exclusiveMinimum: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.Number({ exclusiveMinimum: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1 < value
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ exclusiveMinimum: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 < value
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ exclusiveMinimum: 1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && 1.1 < value
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ exclusiveMinimum: -1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1.1 < value
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Number({ maximum: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.Number({ maximum: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ maximum: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ maximum: 1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= 1.1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ maximum: -1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= -1.1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Number({ exclusiveMaximum: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.Number({ exclusiveMaximum: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ exclusiveMaximum: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < -1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ exclusiveMaximum: 1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < 1.1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ exclusiveMaximum: -1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value < -1.1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Number({ multipleOf: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.Number({ multipleOf: 2 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Number({ minimum: x, maximum: y })', () => {
    vi.expect.soft(format(
      check.writeable(T.Number({ minimum: -1, maximum: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 <= value && value <= 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ maximum: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && value <= -1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Number({ minimum: -1.1, maximum: -1.1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1.1 <= value && value <= -1.1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Number({ minimum: x, maximum: y, multipleOf: z })', () => {
    vi.expect.soft(format(
      check.writeable(T.Number({ minimum: -1, maximum: 1, multipleOf: 2 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Number.isFinite(value) && -1 <= value && value <= 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.String()', () => {
    vi.expect.soft(format(
      check.writeable(T.String())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.String({ minLength: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.String({ minLength: 0 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 0 <= value.length
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.String({ minLength: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 1 <= value.length
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.String({ minLength: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.String({ maxLength: x })', () => {
    vi.expect.soft(format(
      check.writeable(T.String({ maxLength: 0 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && value.length <= 0
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.String({ maxLength: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && value.length <= 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.String({ maxLength: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.String({ minLength: x, maxLength: y })', () => {
    vi.expect.soft(format(
      check.writeable(T.String({ minLength: 1, maxLength: 1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 1 <= value.length && value.length <= 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.String({ minLength: -1, maxLength: -1 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string"
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.String({ minLength: 1, maxLength: 2 }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "string" && 1 <= value.length && value.length <= 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Date()', () => {
    vi.expect.soft(format(
      check.writeable(T.Date())
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value instanceof globalThis.Date
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Literal(x)', () => {
    vi.expect.soft(format(
      check.writeable(T.Literal(1))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Enum', () => {
    vi.expect.soft(format(
      check.writeable(T.Enum({}))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Enum({ A: 'a' }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a"
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Enum({ A: 'a', B: 'b' }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "a" || value === "b"
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Enum({ a: '1' }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "1"
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Enum({ a: '1', b: '2' }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === "1" || value === "2"
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Optional', () => {
    vi.expect.soft(format(
      check.writeable(T.Optional(T.Literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === undefined || value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Readonly', () => {
    vi.expect.soft(format(
      check.writeable(T.Readonly(T.Literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Intersect', () => {
    vi.expect.soft(format(
      check.writeable(T.Intersect([T.Object({ a: T.Literal(1) }), T.Object({ b: T.Literal(2) })]))
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

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Tuple', () => {
    vi.expect.soft(format(
      check.writeable(T.Tuple([]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value)
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Tuple([T.Literal(1)]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value[0] === 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Tuple([T.Literal(1), T.Literal(2)]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value[0] === 1 && value[1] === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Object, standard usage', () => {
    vi.expect.soft(format(
      check.writeable(T.Object({}))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object"
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Object({ a: T.Literal(1) }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Object({ a: T.Literal(1), b: T.Literal(2) }))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1 && value.b === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Object w/ optional properties', () => {
    vi.expect.soft(format(
      check.writeable(T.Object({ a: T.Optional(T.Literal(1)) }))
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
      check.writeable(T.Object({ a: T.Optional(T.Literal(1)), b: T.Literal(2) }))
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
      check.writeable(T.Object({ a: T.Optional(T.Literal(1)), b: T.Literal(2), c: T.Optional(T.Literal(3)) }))
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
      check.writeable(T.Object({ a: T.Optional(T.Literal(1)), b: T.Literal(2), c: T.Optional(T.Literal(3)), d: T.Literal(4) }))
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

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Record, standard usage', () => {
    vi.expect.soft(format(
      check.writeable(T.Record(T.String(), T.Literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(([key, value]) => {
            if (/^(.*)$/.test(key)) return value === 1
            return true
          })
        )
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Record w/ enum key type', () => {
    vi.expect.soft(format(
      check.writeable(T.Record(T.Enum({}), T.Literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(([key, value]) => {
            if (/^(?!.*)$/.test(key)) return value === 1
            return true
          })
        )
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Record(T.Enum({ A: 'a' }), T.Literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Record(T.Enum({ A: 'a', B: 'b' }), T.Literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return !!value && typeof value === "object" && value.a === 1 && value.b === 1
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Union', () => {
    vi.expect.soft(format(
      check.writeable(T.Union([]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return false
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Union([T.Literal(1)]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1
      }
      "
    `)

    vi.expect.soft(format(
      check.writeable(T.Union([T.Literal(1), T.Literal(2)]))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === 1 || value === 2
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Array', () => {
    vi.expect.soft(format(
      check.writeable(T.Array(T.Literal(1)))
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.every((value) => value === 1)
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Array(x, { minItems: y })', () => {
    vi.expect.soft(format(
      check.writeable(T.Array(T.Literal(1), { minItems: 0 }))
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
      check.writeable(T.Array(T.Literal(1), { minItems: 1 }))
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

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Array(x, { maxItems: y })', () => {
    vi.expect.soft(format(
      check.writeable(T.Array(T.Literal(1), { maxItems: 0 }))
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
      check.writeable(T.Array(T.Literal(1), { maxItems: 1 }))
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

  vi.test('〖⛳️〗› ❲check.writeable❳: T.Array(x, { minItems: y, maxItems: z })', () => {
    vi.expect.soft(format(
      check.writeable(T.Array(T.Literal(1), { minItems: 1, maxItems: 2 }))
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
      check.writeable(T.Array(T.Literal(1), { minItems: 1, maxItems: 1 }))
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
