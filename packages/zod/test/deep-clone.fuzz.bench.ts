import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'
import { z } from 'zod'
import Lodash from 'lodash.clonedeep'

const Builder = zxTest.SeedGenerator({
  include: [
    // 'union',
    'array',
    'bigint',
    'boolean',
    'catch',
    'date',
    'default',
    'enum',
    'int',
    'intersection',
    'lazy',
    'literal',
    'map',
    'nan',
    'nonoptional',
    'null',
    'number',
    'object',
    'optional',
    'pipe',
    'prefault',
    'readonly',
    'record',
    'set',
    'string',
    /**
     * structuredClone throws if it encounters a Symbol
     */
    // 'symbol',
    'template_literal',
    'tuple',
    'undefined',
    'void',
  ],
})

const [seed] = fc.sample(Builder['*'], 1)
const schema = zxTest.seedToSchema(seed)
const clonedSchema = z.clone(schema)
const data = zxTest.seedToValidData(seed)
console.debug()
console.debug()
console.group('〖🏁️〗››› zx.deepClone: Fuzz')
console.debug('data:', data)
console.debug('schema:', zx.toString(clonedSchema))
console.groupEnd()
console.debug()
console.debug()
const zx_clone = zx.deepClone(schema)


summary(() => {
  group('〖🏁️〗››› zx.deepClone: fuzz', () => {
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

      bench('zx.deepClone', function* () {
        yield {
          [0]() { return data },
          bench(x: unknown) {
            do_not_optimize(
              zx_clone(x)
            )
          }
        }
      }).gc('inner')
    })
  })
})

await run({ throw: true })
