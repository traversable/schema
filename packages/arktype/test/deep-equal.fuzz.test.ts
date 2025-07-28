import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { type } from 'arktype'
import { deriveUnequalValue } from '@traversable/registry'
import { arkTest } from '@traversable/arktype-test'
import { ark } from '@traversable/arktype'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })
const print = (x: unknown) => JSON.stringify(x, null, 2)

type LogFailureDeps = {
  schema: type.Any
  left: unknown
  right: unknown
  error: unknown
}

const logFailureEqualData = ({ schema, left, right, error }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for ark.deepEqual (with EQUAL data)\n\n\r')
  console.error('ERROR:', error)
  console.debug('schema:\n\r', print(schema), '\n\r')
  console.debug('deepEqual:\n\r', format(ark.deepEqual.writeable(schema)), '\n\r')
  console.debug('left:\n\r', print(left), '\n\r')
  console.debug('right:\n\r', print(right), '\n\r')
  console.groupEnd()
}

const logFailureUnequalData = ({ schema, left, right, error }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for ark.deepEqual (with UNEQUAL data)\n\n\r')
  console.error('ERROR:', error)
  console.debug('schema:\n\r', print(schema), '\n\r')
  console.debug('deepEqual:\n\r', format(ark.deepEqual.writeable(schema)), '\n\r')
  console.debug('left:\n\r', print(left), '\n\r')
  console.debug('right:\n\r', print(right), '\n\r')
  console.groupEnd()
}

const include = [
  'array',
  'boolean',
  'enum',
  'intersection',
  'null',
  'number',
  'object',
  'record',
  'string',
  'tuple',
  // 'union',
] as const

const Builder = arkTest.SeedGenerator({ include })

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
          try { vi.assert.isTrue(deepEqual(left, right)) }
          catch (error) {
            logFailureEqualData({ schema, left, right, error })
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
          const arbitrary = arkTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try {
            const deepEqual = ark.deepEqual(schema)
            vi.assert.isFalse(deepEqual(data, unequal))
          }
          catch (error) {
            logFailureUnequalData({ schema, left: data, right: unequal, error })
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
