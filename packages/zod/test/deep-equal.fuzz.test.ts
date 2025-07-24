import * as vi from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'
import * as NodeJS from 'node:util'
import prettier from "@prettier/sync"
import { deriveUnequalValue } from '@traversable/registry'

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

const exclude = [
  ...zx.deepEqual.unsupported,
  'never',
  'unknown',
  'any',
  'nonoptional',
  'catch',
  'file',
] as const

const generator = zxTest.SeedGenerator({ exclude })['*']

const stringify = (x: unknown) =>
  JSON.stringify(x, (_k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)

type LogFailureDeps = {
  schema: z.core.$ZodType
  left: unknown
  right: unknown
}

const logFailureEqualData = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for zx.deepEqual (with EQUAL data)\n\n\r')
  console.debug('zx.toString(schema):\n\r', zx.toString(schema), '\n\r')
  console.debug('zx.deepEqual.writeable(schema):\n\r', format(zx.deepEqual.writeable(schema, { typeName: 'Type' })), '\n\r')
  console.debug('stringify(left):\n\r', stringify(left), '\n\r')
  console.debug('stringify(right):\n\r', stringify(right), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}

const logFailureUnequalData = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for zx.deepEqual (with UNEQUAL data)\n\n\r')
  console.debug('zx.toString(schema):\n\r', zx.toString(schema), '\n\r')
  console.debug('zx.deepEqual.writeable(schema):\n\r', format(zx.deepEqual.writeable(schema, { typeName: 'Type' })), '\n\r')
  console.debug('stringify(left):\n\r', format(stringify(left)), '\n\r')
  console.debug('stringify(right):\n\r', format(stringify(right)), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲zx.deepEqual❳: equal data', () => {
    fc.assert(
      fc.property(
        generator,
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const arbitrary = zxTest.seedToValidDataGenerator(seed)
          const cloneArbitrary = fc.clone(arbitrary, 2)
          const [[cloned1, cloned2]] = fc.sample(cloneArbitrary, 1)
          const equals = zx.deepEqual(schema)
          try { vi.assert.isTrue(equals(cloned1, cloned2)) }
          catch (e) {
            console.error('ERROR:', e)
            logFailureEqualData({ schema, left: cloned1, right: cloned2 })
            vi.expect.fail(`Equal data failed for zx.equal with schema:\n\n${zx.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [
        [[8500, [[20], [50]]]],
        [[6500, [[7000, [15]], [3500, [15]]]]],
        [[7000, [8000, [[15]]]]],
        [[20]],
        [[8000, [[20], [15]]]],
        [[3500, [1000, [15], [null, 16]]]],
        [[3500, [7000, [15]]]],
        [[3500, [6500, [[15], [30]]]]],
        [[2000, [3500, [15]]]],
      ],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual❳: unequal data', () => {
    fc.assert(
      fc.property(
        generator,
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const arbitrary = zxTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          const equals = zx.deepEqual(schema)
          try { vi.assert.isFalse(equals(data, unequal)) }
          catch (e) {
            console.error('ERROR:', e)
            logFailureUnequalData({ schema, left: data, right: unequal })
            vi.expect.fail(`Unequal data failed for zx.equal with schema:\n\n${zx.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [
        // Turn on this case when this issue is resolved? https://github.com/colinhacks/zod/issues/4894
        // [[8500, [[6500, [[600, [[550, -1.522362844850059e-174]]], [15]]], [2500, [7000, [15]]]]]],
        [[8500, [[15], [20]]]],
      ],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲zx.deepEqual.compile❳: parity w/ oracle', () => {
    fc.assert(
      fc.property(
        generator,
        (seed) => {
          const schema = zxTest.seedToSchema(seed)
          const arbitrary = zxTest.seedToValidDataGenerator(seed)
          const [data1, data2] = fc.sample(arbitrary, 2)
          if (NodeJS.isDeepStrictEqual(data1, data2)) {
            const equals = zx.deepEqual(schema)
            try { vi.assert.isTrue(equals(data1, data2)) }
            catch (e) {
              console.error('ERROR:', e)
              logFailureEqualData({ schema, left: data1, right: data2 })
              vi.expect.fail(`Equal data failed for zx.equal with schema:\n\n${zx.toString(schema)}`)
            }
          } else {
            const equals = zx.deepEqual(schema)
            const unequal = deriveUnequalValue(data1)
            try { vi.assert.isFalse(equals(data1, unequal)) }
            catch (e) {
              console.error('ERROR:', e)
              logFailureUnequalData({ schema, left: data1, right: data2 })
              vi.expect.fail(`Unequal data failed for zx.equal with schema:\n\n${zx.toString(schema)}`)
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
