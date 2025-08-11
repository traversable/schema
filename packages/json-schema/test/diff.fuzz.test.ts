import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'

import { JsonSchema } from '@traversable/json-schema'
import { deriveUnequalValue } from '@traversable/registry'
import { JsonSchemaTest } from '@traversable/json-schema-test'
import type { Insert, Update, Delete } from '@sinclair/typebox/value'
import { Diff as oracle } from '@sinclair/typebox/value'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

type LoggerDeps = {
  schema: JsonSchema
  left: unknown
  right: unknown
  error: unknown
}

function logger({ schema, left, right, error }: LoggerDeps) {
  console.group('FAILURE: property test for JsonSchema.diff')
  console.error('ERROR:', error)
  console.debug('schema:', JSON.stringify(schema, null, 2))
  console.debug('diffFn:', format(JsonSchema.diff.writeable(schema)))
  console.debug('diff:', JSON.stringify(adapt(JsonSchema.diff(schema)(left, right)).sort(sort), null, 2))
  console.debug('oracle:', JSON.stringify(oracle(left, right).sort(sort), null, 2))
  console.debug('left:', left)
  console.debug('right:', right)
  console.groupEnd()
}

const Builder = {
  additionalProperties: JsonSchemaTest.SeedGenerator({
    exclude: JsonSchema.diff.unfuzzable,
    record: { additionalPropertiesOnly: true },
    number: { noNaN: true },
  }),
  patternProperties: JsonSchemaTest.SeedGenerator({
    exclude: JsonSchema.diff.unfuzzable,
    record: { patternPropertiesOnly: true },
    number: { noNaN: true },
  })
}

const adapter = {
  add({ path, value }: JsonSchema.diff.Add) {
    return { type: 'insert', path, value } satisfies Insert
  },
  replace({ path, value }: JsonSchema.diff.Replace) {
    return { type: 'update', path, value } satisfies Update
  },
  remove({ path }: JsonSchema.diff.Remove) {
    return { type: 'delete', path } satisfies Delete
  },
}

function adapt(xs: JsonSchema.diff.Edit[]) {
  return xs.map((x) => adapter[x.type](x as never))
}

function sort<T extends { path: string }>(x: T, y: T) {
  return x.path < y.path ? -1 : y.path < x.path ? 1 : 0
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.diff❳: equal data (additionalProperties only)', () => {
    fc.assert(
      fc.property(
        Builder.additionalProperties['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const diff = JsonSchema.diff(schema)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const duplicate = fc.clone(arbitrary, 2)
          const [left, right] = fc.sample(duplicate, 1)[0]
          try {
            vi.assert.deepEqual(
              adapt(diff(left, right)).sort(sort),
              oracle(left, right).sort(sort)
            )
          } catch (error) {
            logger({ schema, left, right, error })
            vi.expect.fail('diff(left, right) !== oracle(left, right) (additionalPropertiesOnly)')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  vi.test('〖⛳️〗› ❲JsonSchema.diff❳: equal data (patternProperties only)', () => {
    fc.assert(
      fc.property(
        Builder.patternProperties['*'],
        (seed) => {
          const schema = JsonSchemaTest.seedToSchema(seed)
          const diff = JsonSchema.diff(schema)
          const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
          const duplicate = fc.clone(arbitrary, 2)
          const [left, right] = fc.sample(duplicate, 1)[0]
          try {
            vi.assert.deepEqual(
              adapt(diff(left, right)).sort(sort),
              oracle(left, right).sort(sort)
            )
          } catch (error) {
            logger({ schema, left, right, error })
            vi.expect.fail('diff(left, right) !== oracle(left, right) (additionalPropertiesOnly)')
          }
        }
      ), {
      endOnFailure: true,
      examples: [],
      // numRuns: 10_000,
    })
  })

  // vi.test.skip('〖⛳️〗› ❲JsonSchema.diff❳: unequal data (additionalProperties only)', () => {
  //   fc.assert(
  //     fc.property(
  //       Builder.additionalProperties['*'],
  //       (seed) => {
  //         const schema = JsonSchemaTest.seedToSchema(seed)
  //         const diff = JsonSchema.diff(schema)
  //         const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
  //         const [left, right] = fc.sample(arbitrary, 2)
  //         try {
  //           vi.assert.deepEqual(
  //             adapt(diff(left, right)).sort(sort),
  //             oracle(left, right).sort(sort)
  //           )
  //         } catch (error) {
  //           logger({ schema, left, right, error })
  //           vi.expect.fail('diff(left, right) !== oracle(left, right) (additionalPropertiesOnly)')
  //         }
  //       }
  //     ), {
  //     endOnFailure: true,
  //     examples: [],
  //     numRuns: 10_000,
  //   })
  // })

  // vi.test.skip('〖⛳️〗› ❲JsonSchema.diff❳: unequal data (patternProperties only)', () => {
  //   fc.assert(
  //     fc.property(
  //       Builder.patternProperties['*'],
  //       (seed) => {
  //         const schema = JsonSchemaTest.seedToSchema(seed)
  //         const diff = JsonSchema.diff(schema)
  //         const arbitrary = JsonSchemaTest.seedToValidDataGenerator(seed)
  //         const [left, right] = fc.sample(arbitrary, 2)
  //         try {
  //           vi.assert.deepEqual(
  //             adapt(diff(left, right)).sort(sort),
  //             oracle(left, right).sort(sort)
  //           )
  //         } catch (error) {
  //           logger({ schema, left, right, error })
  //           vi.expect.fail('diff(left, right) !== oracle(left, right) (additionalPropertiesOnly)')
  //         }
  //       }
  //     ), {
  //     endOnFailure: true,
  //     examples: [],
  //     numRuns: 10_000,
  //   })
  // })

})
