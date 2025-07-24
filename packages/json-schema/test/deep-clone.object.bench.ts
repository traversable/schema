import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'
import { JsonSchema } from '@traversable/json-schema'
import Lodash from 'lodash.clonedeep'

type Type = {
  street1: string
  street2?: string
  city: string
}

const JsonSchema_deepClone = JsonSchema.deepClone({
  type: 'object',
  required: ['street1', 'city'],
  properties: {
    street1: { type: 'string' },
    street2: { type: 'string' },
    city: { type: 'string' },
  }
}) satisfies (cloneMe: Type) => Type

const arbitrary = fc.record({
  street1: fc.string(),
  street2: fc.string(),
  city: fc.string(),
}, { requiredKeys: ['city', 'street1'] }) satisfies fc.Arbitrary<Type>

const [data] = fc.sample(arbitrary, 1) satisfies Type[]

summary(() => {
  group('〖🏁️〗››› JsonSchema.deepClone: object (shallow)', () => {
    barplot(() => {
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

      bench('JsonSchema.deepClone', function* () {
        yield {
          [0]() { return data },
          bench(x: Type) {
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
