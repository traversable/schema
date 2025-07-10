import * as vi from 'vitest'
import * as fc from 'fast-check'
import { z } from 'zod/v4'
import { zx } from '@traversable/zod'
import * as NodeJS from 'node:util'
import LodashIsEqual from 'lodash.isequal'
import prettier from "@prettier/sync"

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

const exclude = [
  ...zx.equals.unsupported,
  'never',
  'unknown',
  'any',
  'nonoptional',
  'catch',
  'file',
] as const

const generator = zx.SeedGenerator({ exclude })['*']

const stringify = (x: unknown) => {
  return JSON.stringify(x, (k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)
}

type LogFailureDeps = {
  schema: z.ZodType
  left: unknown
  right: unknown
}

const logFailure = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for zx.equals (with VALID data)\n\n\r')
  console.debug('zx.toString(schema):\n\r', zx.toString(schema), '\n\r')
  console.debug('zx.equals.writeable(schema):\n\r', format(zx.equals.writeable(schema)), '\n\r')
  console.debug('stringify(left):\n\r', stringify(left), '\n\r')
  console.debug('stringify(right):\n\r', stringify(right), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}

const logFailureUnequalData = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for zx.equals (with UNEQUAL data)\n\n\r')
  console.debug('zx.toString(schema):\n\r', zx.toString(schema), '\n\r')
  console.debug('zx.equals.writeable(schema):\n\r', format(zx.equals.writeable(schema)), '\n\r')
  console.debug('stringify(left):\n\r', format(stringify(left)), '\n\r')
  console.debug('stringify(right):\n\r', format(stringify(right)), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲zx.equals❳: valid data', () => {
    fc.assert(
      fc.property(
        generator,
        (seed) => {
          const schema = zx.seedToSchema(seed)
          const arbitrary = zx.seedToValidDataGenerator(seed)
          const cloneArbitrary = fc.clone(arbitrary, 2)
          const [[cloned1, cloned2]] = fc.sample(cloneArbitrary, 1)
          try {
            const equals = zx.equals(schema)
            vi.assert.isTrue(equals(cloned1, cloned2))

          } catch (e) {
            console.error('ERROR:', e)
            logFailure({ schema, left: cloned1, right: cloned2 })
            vi.expect.fail(`Valid data failed for zx.equal with schema:\n\n${zx.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [
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

  vi.test('〖⛳️〗› ❲zx.equals.compile❳: parity w/ oracle', () => {
    fc.assert(
      fc.property(
        generator,
        (seed) => {
          const schema = zx.seedToSchema(seed)
          const arbitrary = zx.seedToValidDataGenerator(seed)
          const [data1, data2] = fc.sample(arbitrary, 2)
          if (NodeJS.isDeepStrictEqual(data1, data2)) {
            const equals = zx.equals(schema)
            vi.assert.isTrue(equals(data1, data2))
          } else {
            // const equals = zx.equals.compile(schema)
            // try {
            //   vi.assert.isFalse(equals(data1, data2))
            // } catch (e) {
            //   console.error('ERROR:', e)
            //   logFailureUnequalData({ schema, left: data1, right: data2 })
            //   vi.expect.fail(`Unequal data failed for zx.equal with schema:\n\n${zx.toString(schema)}`)
            // }
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      numRuns: 10_000,
    })
  })

  // generate 2 pieces of valid data
  //
  // - [x] clone each of them, then make sure zx.equals.compile agrees that they're the same
  // - [ ] if NodeJS.isDeepStrictEqual says they're the same, test that zx.equals.compile agrees
  // - [ ] if NodeJS.isDeepStrictEqual says they're different

  // generate 2 pieces of invalid data
  // 1. if NodeJS.isDeepStrict equal says they're the same, test that zx.equals.compile agrees
  // 

})

function equals(l: { m_$2$$2_9$O: boolean }, r: { m_$2$$2_9$O: boolean }) {
  if (l === r) return true
  if (l.m_$2$$2_9$O !== r.m_$2$$2_9$O) return false
  return true
}

