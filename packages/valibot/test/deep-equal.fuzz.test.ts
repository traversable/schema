import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as v from 'valibot'
import { vx } from '@traversable/valibot'
import { vxTest } from '@traversable/valibot-test'
import * as NodeJS from 'node:util'
import prettier from "@prettier/sync"
import { deriveUnequalValue } from '@traversable/registry'

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

type LogFailureDeps = {
  schema: v.BaseSchema<any, any, any>
  left: unknown
  right: unknown
}

const logFailureEqualData = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for vx.deepEqual (with EQUAL data)\n\n\r')
  console.debug('vx.toString(schema):\n\r', vx.toString(schema), '\n\r')
  console.debug('vx.deepEqual.writeable(schema):\n\r', format(vx.deepEqual.writeable(schema, { typeName: 'Type' })), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}

const logFailureUnequalData = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for vx.deepEqual (with UNEQUAL data)\n\n\r')
  console.debug('vx.toString(schema):\n\r', format(vx.toString(schema)), '\n\r')
  console.debug('vx.deepEqual.writeable(schema):\n\r', format(vx.deepEqual.writeable(schema, { typeName: 'Type' })), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}


const exclude = [
  ...vx.deepEqual.unfuzzable,
  'never',
  'unknown',
  'any',
  'non_optional',
  'file',
  'blob',
] as const

const Builder = vxTest.SeedGenerator({ exclude })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/valibot❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲vx.deepEqual❳: equal data', () => {
    fc.assert(
      fc.property(
        Builder['*'],
        (seed) => {
          const schema = vxTest.seedToSchema(seed)
          const arbitrary = vxTest.seedToValidDataGenerator(seed)
          const cloneArbitrary = fc.clone(arbitrary, 2)
          const [[cloned1, cloned2]] = fc.sample(cloneArbitrary, 1)
          const equals = vx.deepEqual(schema)
          try { vi.assert.isTrue(equals(cloned1, cloned2)) }
          catch (e) {
            console.error('ERROR:', e)
            logFailureEqualData({ schema, left: cloned1, right: cloned2 })
            vi.expect.fail(`Equal data failed for vx.equal with schema:\n\n${vx.toString(schema)}`)
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
          const arbitrary = vxTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          const equals = vx.deepEqual(schema)
          try { vi.assert.isFalse(equals(data, unequal)) }
          catch (e) {
            console.error('ERROR:', e)
            logFailureUnequalData({ schema, left: data, right: unequal })
            vi.expect.fail(`Unequal data failed for vx.equal with schema:\n\n${vx.toString(schema)}`)
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
          const arbitrary = vxTest.seedToValidDataGenerator(seed)
          const [data1, data2] = fc.sample(arbitrary, 2)
          if (NodeJS.isDeepStrictEqual(data1, data2)) {
            const equals = vx.deepEqual(schema)
            try { vi.assert.isTrue(equals(data1, data2)) }
            catch (e) {
              console.error('ERROR:', e)
              logFailureEqualData({ schema, left: data1, right: data2 })
              vi.expect.fail(`Equal data failed for vx.equal with schema:\n\n${vx.toString(schema)}`)
            }
          } else {
            const equals = vx.deepEqual(schema)
            const unequal = deriveUnequalValue(data1)
            try { vi.assert.isFalse(equals(data1, unequal)) }
            catch (e) {
              console.error('ERROR:', e)
              logFailureUnequalData({ schema, left: data1, right: data2 })
              vi.expect.fail(`Unequal data failed for vx.equal with schema:\n\n${vx.toString(schema)}`)
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
