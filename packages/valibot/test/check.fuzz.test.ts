import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as v from 'valibot'
import prettier from '@prettier/sync'

import { vx } from '@traversable/valibot'
import { vxTest } from '@traversable/valibot-test'
const exclude = [
  'custom',
  'promise',
  'never',
  'unknown',
  'any',
  'non_optional',
  'non_nullable',
  'non_nullish',
  // 'void',
  // TODO: turn back on
  // 'union',
  // 'intersect',
  // 'variant',
] as const

const print = (x: unknown) => {
  return JSON.stringify(x, (k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)
}

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: v.BaseSchema<any, any, any>
  data: unknown
  error: unknown
}

const logFailureValidData = ({ schema, data, error }: LoggerDeps) => {
  console.group('\n\n\rFAILURE: property test for vx.check.writeable (with VALID data)\n\n\r')
  console.error('ERROR:', error)
  console.debug('schema:\n\r', format(vx.toString(schema)), '\n\r')
  // console.debug('schema:\n\r', schema, '\n\r')
  console.debug('check:\n\r', format(vx.check.writeable(schema)), '\n\r')
  console.debug('stringify(validData):\n\r', print(data), '\n\r')
  console.debug('validData:\n\r', data, '\n\r')
  console.groupEnd()
}

const logFailureInvalidData = ({ schema, data, error }: LoggerDeps) => {
  console.group('\n\n\rFAILURE: property test for vx.check.writeable (with INVALID data)\n\n\r')
  console.error('ERROR:', error)
  console.debug('schema:\n\r', format(vx.toString(schema)), '\n\r')
  // console.debug('schema:\n\r', schema, '\n\r')
  console.debug('check:\n\r', format(vx.check.writeable(schema)), '\n\r')
  console.debug('stringify(invalidData):\n\r', print(data), '\n\r')
  console.debug('invalidData:\n\r', data, '\n\r')
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲vx.check❳: fuzz test -- valid data', () => {
    fc.assert(
      fc.property(
        vxTest.SeedGenerator({ exclude })['*'],
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const validData = vxTest.seedToValidData(seed)
          try {
            const check = vx.check(schema)
            vi.assert.isTrue(check(validData))
          } catch (error) {
            logFailureValidData({ schema, data: validData, error })
            vi.expect.fail(`Valid data failed for vx.check with schema:\n\n${vx.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [
        [[7500, [["$7T_9$$_6w", [2000, [2500, [15]]]], ["$", [25]]]]],
        [[7500, [["F3_$_$_g87", [15]], ["C$906R$$", [8500, [[2500, [15]]]]]]]],
        [[8500, [[8000, [[15], [2500, [15]]]], [50]]]],
      ],
      numRuns: 10_000,
    })
  })

  vi.test.skip('〖⛳️〗› ❲vx.check❳: fuzz test -- invalid data', () => {
    fc.assert(
      fc.property(
        vxTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const invalidData = vxTest.seedToInvalidData(seed)
          try {
            const check = vx.check(schema)
            vi.assert.isFalse(check(invalidData))
          } catch (error) {
            logFailureInvalidData({ schema, data: invalidData, error })
            vi.expect.fail(`Valid data failed for vx.check with schema:\n\n${vx.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

})
