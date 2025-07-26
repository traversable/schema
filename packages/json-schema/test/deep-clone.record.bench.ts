import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'
import { JsonSchema } from '@traversable/json-schema'
import Lodash from 'lodash.clonedeep'
import { clone as JsonJoy } from '@jsonjoy.com/util/lib/json-clone/clone.js'

type Type = Record<string, {
  street1: string
  street2?: string
  city: string
}>

/**
 * @example
 * function handRolled(x: Type1): Type1 {
 *   return Object.entries(x).reduce(
 *     (acc, [key, value]) =>
 *     (
 *       void (acc[key] = {
 *         street1: value.street1,
 *         ...value.street2 !== undefined && { street2: value.street2 },
 *         city: value.city
 *       }),
 *       acc
 *     ),
 *     Object.create(null)
 *   )
 * }
 * 
 * function handRolled(x: Type2): Type2 {
 *   return Object.entries(x).reduce(
 *     (acc, [key, value]) =>
 *     (
 *       void (
 *         acc[key] = /abc/.test(key) 
 *           ? (value as number[]).map((value) => value)
 *           : {
 *             street1: value.street1,
 *             ...value.street2 !== undefined && { street2: value.street2 },
 *             city: value.city
 *           }
 *       ),
 *       acc
 *     ),
 *     Object.create(null)
 *   )
 * }
 * 
 * type Type1 = Record<string, {
 *   street1: string
 *   street2?: string
 *   city: string
 * }>
 * 
 * type Type2 =
 *   & { abc: number[] } 
 *   & Record<string, {
 *     street1: string
 *     street2?: string
 *     city: string
 *   }>
 */


const deepClone = JsonSchema.deepClone({
  type: 'object',
  additionalProperties: {
    type: 'object',
    required: ['street1', 'city'],
    properties: {
      street1: { type: 'string' },
      street2: { type: 'string' },
      city: { type: 'string' },
    }
  }
})

const arbitrary = fc.dictionary(
  fc.string(),
  fc.record({
    street1: fc.string(),
    street2: fc.string(),
    city: fc.string(),
  }, { requiredKeys: ['city', 'street1'] })
) satisfies fc.Arbitrary<Type>

const [data] = fc.sample(arbitrary, 1) satisfies Type[]

summary(() => {
  group('〖🏁️〗››› JsonSchema.deepClone: record', () => {
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

run({ throw: true })
