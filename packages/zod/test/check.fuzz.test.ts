import * as vi from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'

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

type LogFailureValidDataDeps = { schema: z.core.$ZodType, validData: unknown }
type LogFailureInvalidDataDeps = { schema: z.core.$ZodType, invalidData: unknown }
const logFailureValidData = ({ schema, validData }: LogFailureValidDataDeps) => {
  console.group('\n\n\rFAILURE: property test for zx.check.writeable (with VALID data)\n\n\r')
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
        zxTest.SeedGenerator({ exclude })['*'],
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const validData = zxTest.seedToValidData(seed)
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
  vi.test('〖⛳️〗› ❲zx.check❳: fuzz test -- invalid data', () => {
    fc.assert(
      fc.property(
        zxTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const invalidData = zxTest.seedToInvalidData(seed)
          try {
            const check = zx.check(schema)
            vi.assert.isFalse(check(invalidData))
          } catch (e) {
            console.error('ERROR:', e)
            logFailureInvalidData({ schema, invalidData })
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

})