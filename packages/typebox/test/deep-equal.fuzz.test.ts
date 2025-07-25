import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as T from '@sinclair/typebox'
import { box } from '@traversable/typebox'
import { boxTest } from '@traversable/typebox-test'
import prettier from "@prettier/sync"
import { deriveUnequalValue } from '@traversable/registry'

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })
const print = (x: unknown) =>
  JSON.stringify(x, (_k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)

type LogFailureDeps = {
  schema: T.TSchema
  left: unknown
  right: unknown
  error: unknown
}

function logFailure({ schema, left, right, error }: LogFailureDeps) {
  console.debug()
  console.debug()
  console.group('FAILURE: property test for box.deepEqual\n\n')
  console.error('ERROR:', error)
  console.debug('schema:', box.toString(schema))
  console.debug('deepEqual:', format(box.deepEqual.writeable(schema, { typeName: 'Type' })))
  console.debug('left:', print(left))
  console.debug('right:', print(right))
  console.groupEnd()
}

const exclude = [
  'never',
  'unknown',
  'any',
] as const

const generator = boxTest.SeedGenerator({ exclude })['*']

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲box.deepEqual❳: equal data', () => {
    fc.assert(
      fc.property(
        generator,
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const deepEqual = box.deepEqual(schema)
          const arbitrary = boxTest.seedToValidDataGenerator(seed)
          const cloneArbitrary = fc.clone(arbitrary, 2)
          const [[left, right]] = fc.sample(cloneArbitrary, 1)
          try { vi.assert.isTrue(deepEqual(left, right)) }
          catch (error) {
            logFailure({ schema, left, right, error })
            vi.expect.fail('deepEqual(left, right) !== true')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲box.deepEqual❳: unequal data', () => {
    fc.assert(
      fc.property(
        generator,
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const deepEqual = box.deepEqual(schema)
          const arbitrary = boxTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try { vi.assert.isFalse(deepEqual(data, unequal)) }
          catch (error) {
            logFailure({ schema, left: data, right: unequal, error })
            vi.expect.fail('deepEqual(data, unequal) !== false')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
