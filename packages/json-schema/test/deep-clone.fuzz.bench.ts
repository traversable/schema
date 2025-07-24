import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'
import { JsonSchema } from '@traversable/json-schema'
import { JsonSchemaTest } from '@traversable/json-schema-test'
import Lodash from 'lodash.clonedeep'

const Builder = JsonSchemaTest.SeedGenerator({
  include: [
    // 'union',
    'array',
    'boolean',
    'enum',
    'integer',
    'intersection',
    'null',
    'number',
    'object',
    'record',
    'string',
    'tuple',
  ],
})

const [seed] = fc.sample(Builder['*'], 1)
const schema = JsonSchemaTest.seedToSchema(seed)
const data = JsonSchemaTest.seedToValidData(seed)
console.debug()
console.debug()
console.group('〖🏁️〗››› JsonSchema.deepClone: Fuzz')
console.debug('data:', data)
console.debug('schema:', JSON.stringify(schema, null, 2))
console.groupEnd()
console.debug()
console.debug()
const JsonSchema_deepClone = JsonSchema.deepClone(schema)

summary(() => {
  group('〖🏁️〗››› JsonSchema.deepClone: fuzz', () => {
    barplot(() => {
      bench('structuredClone', function* () {
        yield {
          [0]() { return data },
          bench(x: unknown) {
            do_not_optimize(
              structuredClone(x)
            )
          }
        }
      }).gc('inner')

      bench('Lodash', function* () {
        yield {
          [0]() { return data },
          bench(x: unknown) {
            do_not_optimize(
              Lodash(x)
            )
          }
        }
      }).gc('inner')

      bench('JsonSchema.deepClone', function* () {
        yield {
          [0]() { return data },
          bench(x: unknown) {
            do_not_optimize(
              JsonSchema_deepClone(x)
            )
          }
        }
      }).gc('inner')
    })
  })
})

await run({ throw: true })
