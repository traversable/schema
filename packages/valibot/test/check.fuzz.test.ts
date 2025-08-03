import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as v from 'valibot'
import prettier from '@prettier/sync'
import { vx } from '@traversable/valibot'
import { vxTest } from '@traversable/valibot-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: v.BaseSchema<any, any, any>
  data: unknown
  error: unknown
}

function logger({ schema, data, error }: LoggerDeps) {
  console.group('FAILURE: property test for vx.check.writeable')
  console.error('Error:', error)
  console.debug('schema:', format(vx.toString(schema)))
  console.debug('check:', format(vx.check.writeable(schema)))
  console.debug('data:', data)
  console.groupEnd()
}

const exclude = [
  'never',
  'non_nullable',
  'non_nullish',
  'non_optional',
  'custom',
  'promise',
] as const

const Builder = vxTest.SeedGenerator({ exclude })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲vx.check❳: fuzz test (valid data)', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const validData = vxTest.seedToValidData(seed)
          try {
            const check = vx.check(schema)
            vi.assert.isTrue(check(validData))
          } catch (error) {
            logger({ schema, data: validData, error })
            vi.expect.fail('vx.check(validData) !== true')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲vx.check❳: fuzz test (invalid data)', () => {
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
            logger({ schema, data: invalidData, error })
            vi.expect.fail('vx.check(invalidData) !== false')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
