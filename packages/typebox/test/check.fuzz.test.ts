import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as T from '@sinclair/typebox'
import { box } from '@traversable/typebox'
import { boxTest } from '@traversable/typebox-test'

const exclude = [
  'never',
  'unknown',
  'any',
  // TODO:
  'void',
] as const

const stringify = (x: unknown) => {
  return JSON.stringify(x, (k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)
}

type LogFailureValidDataDeps = { schema: T.TSchema, validData: unknown }
type LogFailureInvalidDataDeps = { schema: T.TSchema, invalidData: unknown }
const logFailureValidData = ({ schema, validData }: LogFailureValidDataDeps) => {
  console.group('\n\n\rFAILURE: property test for box.check.writeable (with VALID data)\n\n\r')
  console.debug('schema.toString:\n\r', box.toString(schema), '\n\r')
  console.debug('check:\n\r', box.check.writeable(schema), '\n\r')
  // console.debug('validData:\n\r', stringify(validData), '\n\r')
  console.debug('validData:\n\r', validData, '\n\r')
  console.groupEnd()
}

const logFailureInvalidData = ({ schema, invalidData }: LogFailureInvalidDataDeps) => {
  console.group('\n\n\rFAILURE: property test for box.check.writeable (with INVALID data)\n\n\r')
  console.debug('schema.toString:\n\r', box.toString(schema), '\n\r')
  console.debug('check:\n\r', box.check.writeable(schema), '\n\r')
  // console.debug('stringify(invalidData):\n\r', stringify(invalidData), '\n\r')
  console.debug('invalidData:\n\r', invalidData, '\n\r')
  console.groupEnd()
}


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/typebox❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲box.check❳: fuzz test -- valid data', () => {
    fc.assert(
      fc.property(
        boxTest.SeedGenerator({ exclude })['*'],
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const validData = boxTest.seedToValidData(seed)
          try {
            const check = box.check(schema)
            vi.assert.isTrue(check(validData))
          } catch (e) {
            console.error('ERROR:', e)
            logFailureValidData({ schema, validData })
            vi.expect.fail(`Valid data failed for box.check with schema:\n\n${box.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      numRuns: 10_000,
    })
  })

  /**
   * TODO: turn this back on when you have time to get invalid data working --
   * when I left off, I was running into issues with only generating data for
   * primitives, so next step would be either only generating composite types
   * at the top-level, or performing some kind of manual check if the seed is
   * a primitive
   */
  vi.test('〖⛳️〗› ❲box.check❳: fuzz test -- invalid data', () => {
    fc.assert(
      fc.property(
        boxTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const invalidData = boxTest.seedToInvalidData(seed)
          try {
            const check = box.check(schema)
            vi.assert.isFalse(check(invalidData))
          } catch (e) {
            console.error('ERROR:', e)
            logFailureInvalidData({ schema, invalidData })
            vi.expect.fail(`Valid data failed for box.check with schema:\n\n${box.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      numRuns: 10_000,
    })
  })

})