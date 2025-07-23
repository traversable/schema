import * as vi from 'vitest'
import * as fc from 'fast-check'
import * as T from '@sinclair/typebox'
import { box } from '@traversable/typebox'
import { boxTest } from '@traversable/typebox-test'
import prettier from "@prettier/sync"
import { deriveUnequalValue } from '@traversable/registry'

const format = (source: string) => prettier.format(source, { parser: 'typescript', semi: false })

const exclude = [
  'never',
  'unknown',
  'any',
] as const

const generator = boxTest.SeedGenerator({ exclude })['*']

const stringify = (x: unknown) =>
  JSON.stringify(x, (_k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)

type LogFailureDeps = {
  schema: T.TSchema
  left: unknown
  right: unknown
}

const logFailureEqualData = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for box.equals (with EQUAL data)\n\n\r')
  console.debug('box.toString(schema):\n\r', box.toString(schema), '\n\r')
  console.debug('box.equals.writeable(schema):\n\r', format(box.equals.writeable(schema, { typeName: 'Type' })), '\n\r')
  console.debug('stringify(left):\n\r', stringify(left), '\n\r')
  console.debug('stringify(right):\n\r', stringify(right), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}

const logFailureUnequalData = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for box.equals (with UNEQUAL data)\n\n\r')
  console.debug('box.toString(schema):\n\r', box.toString(schema), '\n\r')
  console.debug('box.equals.writeable(schema):\n\r', format(box.equals.writeable(schema, { typeName: 'Type' })), '\n\r')
  console.debug('stringify(left):\n\r', format(stringify(left)), '\n\r')
  console.debug('stringify(right):\n\r', format(stringify(right)), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: fuzz tests', () => {
  vi.test('〖⛳️〗› ❲box.equals❳: equal data', () => {
    fc.assert(
      fc.property(
        generator,
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const arbitrary = boxTest.seedToValidDataGenerator(seed)
          const cloneArbitrary = fc.clone(arbitrary, 2)
          const [[cloned1, cloned2]] = fc.sample(cloneArbitrary, 1)
          const equals = box.equals(schema)
          try { vi.assert.isTrue(equals(cloned1, cloned2)) }
          catch (e) {
            console.error('ERROR:', e)
            logFailureEqualData({ schema, left: cloned1, right: cloned2 })
            vi.expect.fail(`Equal data failed for box.equal with schema:\n\n${box.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲box.equals❳: unequal data', () => {
    fc.assert(
      fc.property(
        generator,
        (seed) => {
          const schema = boxTest.seedToSchema(seed)
          const arbitrary = boxTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          const equals = box.equals(schema)
          try { vi.assert.isFalse(equals(data, unequal)) }
          catch (e) {
            console.error('ERROR:', e)
            logFailureUnequalData({ schema, left: data, right: unequal })
            vi.expect.fail(`Unequal data failed for box.equal with schema:\n\n${box.toString(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })
})
