import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { type } from 'arktype'
import { deriveUnequalValue } from '@traversable/registry'
import { arkTest } from '@traversable/arktype-test'
import { ark } from '@traversable/arktype'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })
const print = (x: unknown) => JSON.stringify(x, null, 2)

type LoggerDeps = {
  schema: type.Any
  left: unknown
  right: unknown
  error: unknown
}

function logger({ schema, left, right, error }: LoggerDeps) {
  console.group('FAILURE: property test for ark.deepEqual')
  console.error('ERROR:', error)
  console.debug('schema:', print(schema))
  console.debug('deepEqual:', format(ark.deepEqual.writeable(schema)))
  console.debug('left:', print(left))
  console.debug('right:', print(right))
  console.groupEnd()
}

const Builder = arkTest.SeedGenerator({
  exclude: ark.deepEqual.unfuzzable
})

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖⛳️〗› ❲ark.deepEqual❳: equal data', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = arkTest.seedToSchema(seed)
          const deepEqual = ark.deepEqual(schema)
          const arbitrary = arkTest.seedToValidDataGenerator(seed)
          const duplicate = fc.clone(arbitrary, 2)
          const [left, right] = fc.sample(duplicate, 1)[0]
          try {
            vi.assert.isTrue(deepEqual(left, right))
          } catch (error) {
            logger({ schema, left, right, error })
            vi.expect.fail('deepEqual(left, right) !== true')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  // TODO: turn this back on (re-write `deriveUnequalValue` to parse the **schema**, not just the data)
  vi.test.skip('〖⛳️〗› ❲ark.deepEqual❳: unequal data', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = arkTest.seedToSchema(seed)
          const deepEqual = ark.deepEqual(schema)
          const arbitrary = arkTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try {
            vi.assert.isFalse(deepEqual(data, unequal))
          } catch (error) {
            logger({ schema, left: data, right: unequal, error })
            vi.expect.fail('deepEqual(data, unequal) === true')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
