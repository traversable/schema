import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import * as T from 'typebox'
import { box } from '@traversable/typebox'
import { boxTest } from '@traversable/typebox-test'

const exclude = [
  'never',
  'unknown',
  'any',
  // TODO:
  'void',
] as const

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })
const print = (x: unknown) => JSON.stringify(x, (_k, v) =>
  typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2
)

type LogFailureDeps = { schema: T.TSchema, data: unknown, error: unknown }

const logFailure = ({ schema, data, error }: LogFailureDeps) => {
  console.group('FAILURE: property test for box.check.writeable')
  console.error('ERROR:', error)
  console.debug('schema:', format(box.toString(schema)))
  console.debug('check:', format(box.check.writeable(schema)))
  console.debug('data:', print(data))
  console.groupEnd()
}


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/typebox❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲box.check❳: fuzz test -- valid data', () => {
    fc.assert(
      fc.property(
        boxTest.SeedGenerator({ exclude })['*'],
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const valid = boxTest.seedToValidData(seed)
          try {
            const check = box.check(schema)
            vi.assert.isTrue(check(valid))
          } catch (error) {
            logFailure({ schema, data: valid, error })
            vi.expect.fail('box.check(data) !== true')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲box.check❳: fuzz test -- invalid data', () => {
    fc.assert(
      fc.property(
        boxTest.SeedInvalidDataGenerator,
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const invalid = boxTest.seedToInvalidData(seed)
          try {
            const check = box.check(schema)
            vi.assert.isFalse(check(invalid))
          } catch (error) {
            logFailure({ schema, data: invalid, error })
            vi.expect.fail('box.check(data) !== false')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
