import * as vi from 'vitest'
import * as fc from 'fast-check'
import { templateLiteral, z } from 'zod/v4'
import { zx } from '@traversable/zod'

const exclude = [
  'custom',
  'pipe',
  'prefault',
  'promise',
  'success',
  'transform',
  'never',
  'unknown',
  'any',
  'nonoptional',
  'catch',
  'default',
  // TODO:
  'template_literal',
  'void',
] as const

const stringify = (x: unknown) => {
  return JSON.stringify(x, (k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)
}

type LogFailureValidDataDeps = { schema: z.ZodType, validData: unknown }
type LogFailureInvalidDataDeps = { schema: z.ZodType, invalidData: unknown }
const logFailureValidData = ({ schema, validData }: LogFailureValidDataDeps) => {
  console.group('\n\n\rFAILURE: property test for zx.check.writeable (witht VALID data)\n\n\r')
  console.debug('zx.toString(schema):\n\r', zx.toString(schema), '\n\r')
  console.debug('zx.check.writeable(schema):\n\r', zx.check.writeable(schema), '\n\r')
  console.debug('stringify(validData):\n\r', stringify(validData), '\n\r')
  console.debug('validData:\n\r', validData, '\n\r')
  console.groupEnd()
}

const logFailureInvalidData = ({ schema, invalidData }: LogFailureInvalidDataDeps) => {
  console.group('\n\n\rFAILURE: property test for zx.check.writeable (with INVALID data)\n\n\r')
  console.debug('zx.toString(schema):\n\r', zx.toString(schema), '\n\r')
  console.debug('zx.check.writeable(schema):\n\r', zx.check.writeable(schema), '\n\r')
  console.debug('stringify(invalidData):\n\r', stringify(invalidData), '\n\r')
  console.debug('invalidData:\n\r', invalidData, '\n\r')
  console.groupEnd()
}


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲zx.check❳: fuzz test -- valid data', () => {
    fc.assert(
      fc.property(
        zx.SeedGenerator({ exclude })['*'],
        (seed) => {
          const schema = zx.seedToSchema(seed)
          const validData = zx.seedToValidData(seed)
          try {
            const check = zx.check(schema)
            vi.assert.isTrue(check(validData))
          } catch (e) {
            console.error('ERROR:', e)
            logFailureValidData({ schema, validData })
            vi.expect.fail(`Valid data failed for zx.check with schema:\n\n${zx.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [
        [[8000, [[3500, [15]], [15]]]],
        [[7500, [["`gv5`", [15]]]]],
        [[7500, [["8X.F#ho4i", [550, null]], ["hrMo", [2500, [15]]]]]],
      ],
      // numRuns: 10_000,
    })
  })

  /**
   * TODO: turn this back on when you have time to get invalid data working --
   * when I left off, I was running into issues with only generating data for
   * primitives, so next step would be either only generating composite types
   * at the top-level, or performing some kind of manual check if the seed is
   * a primitive
   */
  // vi.test.skip('〖⛳️〗› ❲zx.check❳: fuzz test -- invalid data', () => {
  //   fc.assert(
  //     fc.property(
  //       zx.SeedReproduciblyInvalidGenerator,
  //       (seed) => {
  //         const schema = zx.seedToSchema(seed)
  //         const invalidData = zx.seedToInvalidData(seed)
  //         try {
  //           const check = zx.check(schema)
  //           vi.assert.isFalse(check(invalidData))
  //         } catch (e) {
  //           console.error('ERROR:', e)
  //           logFailureInvalidData({ schema, invalidData })
  //           vi.expect.fail(`Valid data failed for zx.check with schema:\n\n${zx.toString(schema)}`)
  //         }
  //       }
  //     ), {
  //     endOnFailure: true,
  //     examples: [
  //       [[8000, [[3500, [15]], [15]]]],
  //       // [[8500, [[600, [[40]]], [45]]]],
  //       [[7500, [["`gv5`", [15]]]]],
  //       [[7500, [["8X.F#ho4i", [550, null]], ["hrMo", [2500, [15]]]]]],
  //     ],
  //     numRuns: 10_000,
  //   })
  // })

})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.never()', () => {
    vi.expect.soft(
      zx.check.writeable(z.never())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return false
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.unknown()', () => {
    vi.expect.soft(
      zx.check.writeable(z.unknown())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return true
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.any()', () => {
    vi.expect.soft(
      zx.check.writeable(z.any())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return true
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.undefined()', () => {
    vi.expect.soft(
      zx.check.writeable(z.undefined())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === undefined
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.null()', () => {
    vi.expect.soft(
      zx.check.writeable(z.null())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === null
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.symbol()', () => {
    vi.expect.soft(
      zx.check.writeable(z.symbol())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "symbol"
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.boolean()', () => {
    vi.expect.soft(
      zx.check.writeable(z.boolean())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "boolean"
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.nan()', () => {
    vi.expect.soft(
      zx.check.writeable(z.nan())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isNaN(value)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int()', () => {
    vi.expect.soft(
      zx.check.writeable(z.int())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().min(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.int().min(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && 1 <= value
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.int().min(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && -1 <= value
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.int().min(-1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().max(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.int().max(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && value <= 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.int().max(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && value <= -1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.int().max(-1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().multipleOf(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.int().multipleOf(2))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && value % 2 === 0
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().min(x).max(y)', () => {
    vi.expect.soft(
      zx.check.writeable(z.int().min(-1).max(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && -1 <= value && value <= 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.int().max(-1).max(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && value <= -1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.int().min(-1.1).max(1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.int().min(x).max(y).multipleOf(z)', () => {
    vi.expect.soft(
      zx.check.writeable(z.int().min(-1).max(1).multipleOf(2))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && -1 <= value && value <= 1 && value % 2 === 0
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint()', () => {
    vi.expect.soft(
      zx.check.writeable(z.bigint())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "bigint"
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint().min(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.bigint().min(1n))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "bigint" && 1n <= value
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.bigint().min(-1n))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "bigint" && -1n <= value
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint().max(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.bigint().max(1n))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "bigint" && value <= 1n
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.bigint().max(-1n))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "bigint" && value <= -1n
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint.multipleOf(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.bigint().multipleOf(2n))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "bigint" && value % 2n === 0n
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint.min(x).max(y)', () => {
    vi.expect.soft(
      zx.check.writeable(z.bigint().min(-1n).max(1n))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "bigint" && -1n <= value && value <= 1n
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.bigint().max(-1n).max(-1n))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "bigint" && value <= -1n
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.bigint().min(x).max(y).multipleOf(z)', () => {
    vi.expect.soft(
      zx.check.writeable(z.bigint().min(-1n).max(1n).multipleOf(2n))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "bigint" && -1n <= value && value <= 1n && value % 2n === 0n
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number()', () => {
    vi.expect.soft(
      zx.check.writeable(z.number())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().min(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.number().min(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && 1 <= value
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().min(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && -1 <= value
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().min(1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && 1.1 <= value
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().min(-1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && -1.1 <= value
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().gt(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.number().gt(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && 1 < value
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().gt(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && -1 < value
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().gt(1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && 1.1 < value
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().gt(-1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && -1.1 < value
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().max(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.number().max(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && value <= 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().max(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && value <= -1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().max(1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && value <= 1.1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().max(-1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && value <= -1.1
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().lt(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.number().lt(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && value < 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().lt(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && value < -1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().lt(1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && value < 1.1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().lt(-1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && value < -1.1
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().multipleOf(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.number().multipleOf(2))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && value % 2 === 0
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().min(x).max(y)', () => {
    vi.expect.soft(
      zx.check.writeable(z.number().min(-1).max(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && -1 <= value && value <= 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().max(-1).max(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && value <= -1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.number().min(-1.1).max(1.1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isFinite(value) && -1.1 <= value && value <= 1.1
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.number().min(x).max(y).multipleOf(z)', () => {
    vi.expect.soft(
      zx.check.writeable(z.number().min(-1).max(1).multipleOf(2))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Number.isSafeInteger(value) && -1 <= value && value <= 1 && value % 2 === 0
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string()', () => {
    vi.expect.soft(
      zx.check.writeable(z.string())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string"
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string().min(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.string().min(0))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string" && 0 <= value.length
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.string().min(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string" && 1 <= value.length
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.string().min(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string"
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string().max(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.string().max(0))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string" && value.length <= 0
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.string().max(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string" && value.length <= 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.string().max(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string"
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string().length(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.string().length(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string" && 1 <= value.length && value.length <= 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.string().length(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string" && 1 <= value.length && value.length <= 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.string().length(-1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string"
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.string().min(x).max(y)', () => {
    vi.expect.soft(
      zx.check.writeable(z.string().min(1).max(2))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === "string" && 1 <= value.length && value.length <= 2
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.date()', () => {
    vi.expect.soft(
      zx.check.writeable(z.date())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value instanceof globalThis.Date
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.file()', () => {
    vi.expect.soft(
      zx.check.writeable(z.file())
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value instanceof globalThis.File
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.literal(x)', () => {
    vi.expect.soft(
      zx.check.writeable(z.literal(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === 1
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.literal([...xs])', () => {
    vi.expect.soft(
      zx.check.writeable(z.literal([]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return 
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.literal([1]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.literal([1, 2]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === 1 || value === 2
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.templateLiteral', () => {
    vi.expect.soft(
      zx.check.writeable(z.templateLiteral([]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === 'string' && new globalThis.RegExp("^$").test(value)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.templateLiteral(['a']))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return typeof value === 'string' && new globalThis.RegExp("^a$").test(value)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.enum', () => {
    vi.expect.soft(
      zx.check.writeable(z.enum([]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return 
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.enum(['a']))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === "a"
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.enum(['a', 'b']))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === "a" || value === "b"
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.optional', () => {
    vi.expect.soft(
      zx.check.writeable(z.enum([]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return 
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.enum(['a']))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === "a"
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.enum(['a', 'b']))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === "a" || value === "b"
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.enum({}))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return 
      }"
    `)


    vi.expect.soft(
      zx.check.writeable(z.enum({ a: '1' }))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === "1"
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.enum({ a: '1', b: '2' }))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === "1" || value === "2"
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.optional', () => {
    vi.expect.soft(
      zx.check.writeable(z.optional(z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === undefined || value === 1
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.nonoptional', () => {
    vi.expect.soft(
      zx.check.writeable(z.nonoptional(z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value !== undefined && value === 1
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.nullable', () => {
    vi.expect.soft(
      zx.check.writeable(z.nullable(z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === null || value === 1
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.readonly', () => {
    vi.expect.soft(
      zx.check.writeable(z.readonly(z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === 1
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.lazy', () => {
    vi.expect.soft(
      zx.check.writeable(z.lazy(() => z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value === 1
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.catch', () => {
    vi.expect.soft(
      zx.check.writeable(z.catch(z.boolean(), false))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return true
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.default', () => {
    vi.expect.soft(
      zx.check.writeable(z._default(z.boolean(), false))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return true
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.set', () => {
    vi.expect.soft(
      zx.check.writeable(z.set(z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value instanceof globalThis.Set && globalThis.Array.from(value).every((value) => value === 1)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.map', () => {
    vi.expect.soft(
      zx.check.writeable(z.map(z.literal(1), z.literal(2)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return value instanceof globalThis.Map && globalThis.Array.from(value).every(([key, value]) => key === 1 && value === 2)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.intersection', () => {
    vi.expect.soft(
      zx.check.writeable(z.intersection(z.object({ a: z.literal(1) }), z.object({ b: z.literal(2) })))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && value.a === 1 && !!value && typeof value === "object" && value.b === 2
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.tuple, standard usage', () => {
    vi.expect.soft(
      zx.check.writeable(z.tuple([]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1)]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2)]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1 && value[1] === 2
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.tuple w/ optional items', () => {
    vi.expect.soft(
      zx.check.writeable(z.tuple([z.optional(z.literal(1))]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && (value?.[0] === undefined || value?.[0] === 1)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.tuple([z.optional(z.literal(1)), z.optional(z.literal(2))]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && (value?.[0] === undefined || value?.[0] === 1) && (value?.[1] === undefined || value?.[1] === 2)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1), z.optional(z.literal(2))]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1 && (value?.[1] === undefined || value?.[1] === 2)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2), z.optional(z.literal(3))]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1 && value[1] === 2 && (value?.[2] === undefined || value?.[2] === 3)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2), z.optional(z.literal(3)), z.optional(z.literal(4))]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1 && value[1] === 2 && (value?.[2] === undefined || value?.[2] === 3) && (value?.[3] === undefined || value?.[3] === 4)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.tuple w/ rest', () => {
    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1)], z.boolean()))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1 && value.slice(1).every((value) => typeof value === "boolean")
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2)], z.boolean()))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1 && value[1] === 2 && value.slice(2).every((value) => typeof value === "boolean")
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.tuple w/ optional items + rest', () => {
    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1), z.optional(z.literal(2))], z.boolean()))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1 && (value?.[1] === undefined || value?.[1] === 2) && value.slice(2).every((value) => typeof value === "boolean")
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2), z.optional(z.literal(2))], z.boolean()))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1 && value[1] === 2 && (value?.[2] === undefined || value?.[2] === 2) && value.slice(3).every((value) => typeof value === "boolean")
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.tuple([z.literal(1), z.literal(2), z.optional(z.literal(2)), z.optional(z.literal(3))], z.boolean()))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value[0] === 1 && value[1] === 2 && (value?.[2] === undefined || value?.[2] === 2) && (value?.[3] === undefined || value?.[3] === 3) && value.slice(4).every((value) => typeof value === "boolean")
      }"
    `)
  })


  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.object, standard usage', () => {
    vi.expect.soft(
      zx.check.writeable(z.object({}))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object"
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.object({ a: z.literal(1) }))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && value.a === 1
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.object({ a: z.literal(1), b: z.literal(2) }))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && value.a === 1 && value.b === 2
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.object w/ optional properties', () => {
    vi.expect.soft(
      zx.check.writeable(z.object({ a: z.optional(z.literal(1)) }))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && (!Object.hasOwn(value, "a") || value?.a === 1)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.object({ a: z.optional(z.literal(1)), b: z.literal(2) }))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && (!Object.hasOwn(value, "a") || value?.a === 1) && value.b === 2
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.object({ a: z.optional(z.literal(1)), b: z.literal(2), c: z.optional(z.literal(3)) }))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && (!Object.hasOwn(value, "a") || value?.a === 1) && value.b === 2 && (!Object.hasOwn(value, "c") || value?.c === 3)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.object({ a: z.optional(z.literal(1)), b: z.literal(2), c: z.optional(z.literal(3)), d: z.literal(4) }))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && (!Object.hasOwn(value, "a") || value?.a === 1) && value.b === 2 && (!Object.hasOwn(value, "c") || value?.c === 3) && value.d === 4
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.object w/ catchall', () => {

    vi.expect.soft(
      zx.check.writeable(z.object({}).catchall(z.boolean()))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && Object.values(value).every((value) => typeof value === "boolean")
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.object({}).catchall(z.boolean()))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && Object.values(value).every((value) => typeof value === "boolean")
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.object({ a: z.literal(1) }).catchall(z.boolean()))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && value.a === 1 && Object.entries(value).filter(([key]) => !(["a"]).includes(key)).every(([, value]) => typeof value === "boolean")
      }"
    `)

  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.record, standard usage', () => {
    vi.expect.soft(
      zx.check.writeable(z.record(z.string(), z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && Object.entries(value).every(([key, value]) => typeof key === "string" && value === 1)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.record w/ enum key type', () => {
    vi.expect.soft(
      zx.check.writeable(z.record(z.enum([]), z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && Object.entries(value).every(([key, value]) => value === 1)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.record(z.enum(['a']), z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && Object.entries(value).every(([key, value]) => key === "a" && value === 1)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.record(z.enum(['a', 'b']), z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return !!value && typeof value === "object" && Object.entries(value).every(([key, value]) => (key === "a" || key === "b") && value === 1)
      }"
    `)

  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.union', () => {
    vi.expect.soft(
      zx.check.writeable(z.union([]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return false
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.union([z.literal(1)]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return (value === 1)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.union([z.literal(1), z.literal(2)]))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return (value === 1) || (value === 2)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array, standard usage', () => {
    vi.expect.soft(
      zx.check.writeable(z.array(z.literal(1)))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value.every((value) => value === 1)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array w/ min', () => {
    vi.expect.soft(
      zx.check.writeable(z.array(z.literal(1)).min(0))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && 0 <= value.length && value.every((value) => value === 1)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.array(z.literal(1)).min(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && 1 <= value.length && value.every((value) => value === 1)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array w/ max', () => {
    vi.expect.soft(
      zx.check.writeable(z.array(z.literal(1)).max(0))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value.length <= 0 && value.every((value) => value === 1)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.array(z.literal(1)).max(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value.length <= 1 && value.every((value) => value === 1)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array w/ min & max', () => {
    vi.expect.soft(
      zx.check.writeable(z.array(z.literal(1)).min(1).max(2))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && 1 <= value.length && value.length <= 2 && value.every((value) => value === 1)
      }"
    `)

    vi.expect.soft(
      zx.check.writeable(z.array(z.literal(1)).min(1).max(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value.length === 1 && value.every((value) => value === 1)
      }"
    `)
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.array w/ length', () => {
    vi.expect.soft(
      zx.check.writeable(z.array(z.literal(1)).length(1))
    ).toMatchInlineSnapshot
      (`
      "function check (value) {
        return Array.isArray(value) && value.length === 1 && value.every((value) => value === 1)
      }"
    `)
  })

})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: unimplemented', () => {
  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.prefault', () => {
    vi.expect(() => zx.check.writeable(z.prefault(z.literal(1), 1))).to.throw()
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.transform', () => {
    vi.expect(() => zx.check.writeable(z.transform(String))).to.throw()
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.success', () => {
    vi.expect(() => zx.check.writeable(z.success(z.literal(1)))).to.throw()
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.promise', () => {
    vi.expect(() => zx.check.writeable(z.promise(z.literal(1)))).to.throw()
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.custom', () => {
    vi.expect(() => zx.check.writeable(z.custom(() => {}))).to.throw()
  })

  vi.test('〖⛳️〗› ❲zx.check.writeable❳: z.pipe', () => {
    vi.expect(() => zx.check.writeable(z.pipe(z.number(), z.int()))).to.throw()
  })
})
