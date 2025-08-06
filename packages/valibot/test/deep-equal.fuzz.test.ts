import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as v from 'valibot'
import { vx } from '@traversable/valibot'
import { vxTest } from '@traversable/valibot-test'
import * as NodeJS from 'node:util'
import prettier from "@prettier/sync"
import { deriveUnequalValue } from '@traversable/registry'

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: v.BaseSchema<any, any, any>
  left: unknown
  right: unknown
  error: unknown
}

function logger({ schema, left, right, error }: LoggerDeps) {
  console.group('FAILURE: property test for vx.deepEqual')
  console.error('ERROR:', error)
  console.debug('schema:', vx.toString(schema))
  console.debug('deepEqual:', format(vx.deepEqual.writeable(schema)))
  console.debug('left:', left)
  console.debug('right:', right)
  console.groupEnd()
}

const Builder = vxTest.SeedGenerator({
  exclude: vx.deepEqual.unfuzzable
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲vx.deepEqual❳: equal data', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const deepEqual = vx.deepEqual(schema)
          const arbitrary = vxTest.seedToValidDataGenerator(seed)
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

  vi.test('〖⛳️〗› ❲vx.deepEqual❳: unequal data', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const deepEqual = vx.deepEqual(schema)
          const arbitrary = vxTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try {
            vi.assert.isFalse(deepEqual(data, unequal))
          } catch (error) {
            logger({ schema, left: data, right: unequal, error })
            vi.expect.fail(`deepEqual(data, unequal) !== false`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲vx.deepEqual.compile❳: parity w/ oracle', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const deepEqual = vx.deepEqual(schema)
          const arbitrary = vxTest.seedToValidDataGenerator(seed)
          const [left, right] = fc.sample(arbitrary, 2)
          if (NodeJS.isDeepStrictEqual(left, right)) {
            try {
              vi.assert.isTrue(deepEqual(left, right))
            } catch (error) {
              logger({ schema, left, right, error })
              vi.expect.fail(`deepEqual(left, right) !== NodeJS.isDeepStrictEqual(left, right)`)
            }
          } else {
            const unequal = deriveUnequalValue(left)
            try {
              vi.assert.isFalse(deepEqual(left, unequal))
            } catch (error) {
              logger({ schema, left, right: unequal, error })
              vi.expect.fail(`deepEqual(left, right) !== NodeJS.isDeepStrictEqual(left, right)`)
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
