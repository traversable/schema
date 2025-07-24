import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { JsonSchema } from '@traversable/json-schema'
import { deriveUnequalValue } from '@traversable/registry'
import { jsonSchemaTest } from '@traversable/json-schema-test'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

const exclude = [
  'never',
  'unknown',
] as const

const additionalPropsGenerator = jsonSchemaTest.SeedGenerator({ exclude, record: { additionalPropertiesOnly: true } })['*']
const patternPropsGenerator = jsonSchemaTest.SeedGenerator({ exclude, record: { patternPropertiesOnly: true } })['*']

const stringify = (x: unknown) =>
  JSON.stringify(x, (_k, v) => typeof v === 'symbol' ? `Symbol(${v.description})` : typeof v === 'bigint' ? `${v}n` : v, 2)

type LogFailureDeps = {
  schema: JsonSchema
  left: unknown
  right: unknown
}

const logFailureEqualData = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for JsonSchema.equals (with EQUAL data)\n\n\r')
  console.debug('schema:\n\r', JSON.stringify(schema, null, 2), '\n\r')
  console.debug(
    'JsonSchema.equals.writeable(schema):\n\r',
    format(JsonSchema.equals.writeable(schema, { typeName: 'Type' })),
    '\n\r'
  )
  console.debug('stringify(left):\n\r', stringify(left), '\n\r')
  console.debug('stringify(right):\n\r', stringify(right), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}

const logFailureUnequalData = ({ schema, left, right }: LogFailureDeps) => {
  console.group('\n\n\rFAILURE: property test for JsonSchema.equals (with UNEQUAL data)\n\n\r')
  console.debug('schema:\n\r', JSON.stringify(schema, null, 2), '\n\r')
  console.debug('JsonSchema.equals.writeable(schema):\n\r', JsonSchema.equals.writeable(schema, { typeName: 'Type' }), '\n\r')
  console.debug('stringify(left):\n\r', stringify(left), '\n\r')
  console.debug('stringify(right):\n\r', stringify(right), '\n\r')
  console.debug('left:\n\r', left, '\n\r')
  console.debug('right:\n\r', right, '\n\r')
  console.groupEnd()
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.equals❳: equal data (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        additionalPropsGenerator,
        (seed) => {
          const schema = jsonSchemaTest.seedToSchema(seed)
          const arbitrary = jsonSchemaTest.seedToValidDataGenerator(seed)
          const cloneArbitrary = fc.clone(arbitrary, 2)
          const [[cloned1, cloned2]] = fc.sample(cloneArbitrary, 1)
          try {
            const equals = JsonSchema.equals(schema)
            vi.assert.isTrue(equals(cloned1, cloned2))
          }
          catch (e) {
            console.error('ERROR:', e)
            console.log('JsonSchema.equals.writeable(schema)', JsonSchema.equals.writeable(schema))
            logFailureEqualData({ schema, left: cloned1, right: cloned2 })
            vi.expect.fail(`Equal data failed for JsonSchema.equal with schema:\n\n${stringify(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [
        [[550, "<$\"hyu"]],
        [[8500, [[7500, [["V9$_", [550, "<$\"hyu"]]], []]]]],
        [[7500, [["x", [15]], ["i5$fuCjQ$", [550, [false]]]], ["x"]]],
        [[7500, [["k1$_", [550, [-1.1953822100946693e-73, "*b)", "", 4.540248974559217e-80, false, "WM&RFqu", 4.308650669841548e-87]]]], []]],
      ],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲JsonSchema.equals❳: equal data (patternProperties only)', () => {
    fc.assert(
      fc.property(
        patternPropsGenerator,
        (seed) => {
          const schema = jsonSchemaTest.seedToSchema(seed)
          const arbitrary = jsonSchemaTest.seedToValidDataGenerator(seed)
          const cloneArbitrary = fc.clone(arbitrary, 2)
          const [[cloned1, cloned2]] = fc.sample(cloneArbitrary, 1)
          try {
            const equals = JsonSchema.equals(schema)
            vi.assert.isTrue(equals(cloned1, cloned2))
          }
          catch (e) {
            console.error('ERROR:', e)
            console.log('JsonSchema.equals.writeable(schema)', JsonSchema.equals.writeable(schema))
            logFailureEqualData({ schema, left: cloned1, right: cloned2 })
            vi.expect.fail(`Equal data failed for JsonSchema.equal with schema:\n\n${stringify(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })


  vi.test.skip('〖⛳️〗› ❲JsonSchema.equals❳: unequal data (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        additionalPropsGenerator,
        (seed) => {
          const schema = jsonSchemaTest.seedToSchema(seed)
          const arbitrary = jsonSchemaTest.seedToValidDataGenerator(seed)
          const [data] = fc.sample(arbitrary, 1)
          const unequal = deriveUnequalValue(data)
          try {
            const equals = JsonSchema.equals(schema)
            vi.assert.isFalse(equals(data, unequal))
          }
          catch (e) {
            console.error('ERROR:', e)
            logFailureUnequalData({ schema, left: data, right: unequal })
            vi.expect.fail(`Unequal data failed for JsonSchema.equal with schema:\n\n${stringify(schema)}`)
          }
        }
      ), {
      endOnFailure: true,
      examples: [
        [[7500, [["H$py51N$", [15]]], []]],
        [[7500, [["$9$$_v__", [15]]], []]],
        [[7500, [["o2", [100, [-4096, null, -1829861584]]]], []]],
        [[7500, [["J_$", [250, [null, null]]]], []]],
      ],
      // numRuns: 10_000,
    })
  })

})
