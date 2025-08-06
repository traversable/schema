import * as vi from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'
import * as NodeJS from 'node:util'
import prettier from "@prettier/sync"
import { deriveUnequalValue } from '@traversable/registry'

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: z.core.$ZodType
  left: unknown
  right: unknown
  error: unknown
}

function logger({ schema, left, right, error }: LoggerDeps) {
  console.group('FAILURE: property test for zx.deepEqual')
  console.error('ERROR:', error)
  console.debug('schema:', zx.toString(schema))
  console.debug('deepEqual:', format(zx.deepEqual.writeable(schema)))
  console.debug('left:', left)
  console.debug('right:', right)
  console.groupEnd()
}

const Builder = zxTest.SeedGenerator({
  exclude: zx.deepEqual.unfuzzable
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲zx.deepEqual❳: equal data', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const deepEqual = zx.deepEqual(schema)
          const arbitrary = zxTest.seedToValidDataGenerator(seed)
          const cloneArbitrary = fc.clone(arbitrary, 2)
          const [left, right] = fc.sample(cloneArbitrary, 1)[0]
          try {
            vi.assert.isTrue(deepEqual(left, right))
          } catch (error) {
            logger({ schema, left, right, error })
            vi.expect.fail(`deepEqual(left, right) !== true`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: unequal data', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const deepEqual = zx.deepEqual(schema)
          const arbitrary = zxTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try {
            vi.assert.isFalse(deepEqual(data, unequal))
          } catch (error) {
            logger({ schema, left: data, right: unequal, error })
            vi.expect.fail(`deepEqual(data, unequal) === true`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: parity w/ oracle', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const deepEqual = zx.deepEqual(schema)
          const arbitrary = zxTest.seedToValidDataGenerator(seed)
          const [left, right] = fc.sample(arbitrary, 2)
          if (NodeJS.isDeepStrictEqual(left, right)) {
            try {
              vi.assert.isTrue(deepEqual(left, right))
            } catch (error) {
              logger({ schema, left, right, error })
              vi.expect.fail(`deepEqual(left, right) !== true`)
            }
          } else {
            const unequal = deriveUnequalValue(left)
            try {
              vi.assert.isFalse(deepEqual(left, unequal))
            } catch (error) {
              logger({ schema, left, right, error })
              vi.expect.fail(`deepEqual(data, unequal) !== false`)
            }
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
