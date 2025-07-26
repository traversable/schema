import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'
import { JsonSchema } from '@traversable/json-schema'
import Lodash from 'lodash.clonedeep'
import { clone as JsonJoy } from '@jsonjoy.com/util/lib/json-clone/clone.js'

type Type = [
  { street1: string; street2?: string; city: string },
  { street1: string; street2?: string; city: string }
]

/** 
 * @example
 * function handRolled(x: Type) {
 *   return [
 *     {
 *       street1: x[0].street1,
 *       ...x[0].street2 !== undefined && { street2: x[0].street2 },
 *       city: x[0].city
 *     },
 *     {
 *       street1: x[1].street1,
 *       ...x[1].street2 !== undefined && { street2: x[1].street2 },
 *       city: x[1].city
 *     },
 *   ]
 * }
 */

const deepClone = JsonSchema.deepClone({
  type: 'array',
  prefixItems: [
    {
      type: 'object',
      required: ['street1', 'city'],
      properties: {
        street1: { type: 'string' },
        street2: { type: 'string' },
        city: { type: 'string' },
      },
    },
    {
      type: 'object',
      required: ['street1', 'city'],
      properties: {
        street1: { type: 'string' },
        street2: { type: 'string' },
        city: { type: 'string' },
      },
    }
  ]
})

const arbitrary = fc.tuple(
  fc.record({
    street1: fc.string(),
    street2: fc.string(),
    city: fc.string(),
  }, { requiredKeys: ['city', 'street1'] }),
  fc.record({
    street1: fc.string(),
    street2: fc.string(),
    city: fc.string(),
  }, { requiredKeys: ['city', 'street1'] })
) satisfies fc.Arbitrary<Type>

const [data] = fc.sample(arbitrary, 1) satisfies Type[]

summary(() => {
  group('〖🏁️〗››› JsonSchema.deepClone: tuple', () => {
    barplot(() => {
      bench('Lodash', function* () {
        yield {
          [0]() { return data },
          bench(x: Type) {
            do_not_optimize(
              Lodash(x)
            )
          }
        }
      }).gc('inner')

      bench('JsonJoy', function* () {
        yield {
          [0]() { return data },
          bench(x: Type) {
            do_not_optimize(
              JsonJoy(x)
            )
          }
        }
      }).gc('inner')

      bench('structuredClone', function* () {
        yield {
          [0]() { return data },
          bench(x: Type) {
            do_not_optimize(
              structuredClone(x)
            )
          }
        }
      }).gc('inner')

      bench('JSON.stringify + JSON.parse', function* () {
        yield {
          [0]() { return data },
          bench(x: Type) {
            do_not_optimize(
              JSON.parse(JSON.stringify(x))
            )
          }
        }
      }).gc('inner')

      bench('JsonSchema.deepClone', function* () {
        yield {
          [0]() { return data },
          bench(x: Type) {
            do_not_optimize(
              deepClone(x)
            )
          }
        }
      }).gc('inner')

      /** 
       * @example
       * bench('handRolled', function* () {
       *   yield {
       *     [0]() { return data },
       *     bench(x: Type) {
       *       do_not_optimize(
       *         handRolled(x)
       *       )
       *     }
       *   }
       * }).gc('inner')
       */
    })
  })
})

await run({ throw: true })
