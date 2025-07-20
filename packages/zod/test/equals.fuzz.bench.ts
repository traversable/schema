import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'
import { zx } from '@traversable/zod'
import { zxTest } from '@traversable/zod-test'
import { z } from 'zod'
import Lodash from 'lodash.isequal'
import { isDeepStrictEqual as NodeJS } from 'node:util'

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
const generator = fc.clone(zxTest.seedToValidDataGenerator(seed), 2)
const [data] = fc.sample(generator, 1)

console.debug()
console.debug()
console.group('〖🏁️〗››› zx.equals: Fuzz')
console.debug('x:', data[0])
console.debug('y:', data[1])
console.debug('schema:', zx.toString(clonedSchema))
console.groupEnd()
console.debug()
console.debug()

const zx_equals = zx.equals(schema)

summary(() => {
  group('〖🏁️〗››› zx.equals: fuzz', () => {
    barplot(() => {
      bench('NodeJS', function* () {
        yield {
          [0]() { return data },
          bench([x, y]: [unknown, unknown]) {
            do_not_optimize(
              NodeJS(x, y)
            )
          }
        }
      }).gc('inner')

      bench('Lodash', function* () {
        yield {
          [0]() { return data },
          bench([x, y]: [unknown, unknown]) {
            do_not_optimize(
              Lodash(x, y)
            )
          }
        }
      }).gc('inner')

      bench('zx.equals', function* () {
        yield {
          [0]() { return data },
          bench([x, y]: [unknown, unknown]) {
            do_not_optimize(
              zx_equals(x, y)
            )
          }
        }
      }).gc('inner')
    })
  })
})

await run({ throw: true })
