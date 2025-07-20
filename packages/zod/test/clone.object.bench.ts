import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import Lodash from 'lodash.clonedeep'

type Type = {
  street1: string
  street2?: string
  city: string
}

const zx_clone = zx.clone(
  z.object({
    street1: z.string(),
    street2: z.optional(z.string()),
    city: z.string(),
  }) satisfies z.ZodType<Type>
)

const arbitrary = fc.record({
  street1: fc.string(),
  street2: fc.string(),
  city: fc.string(),
}, { requiredKeys: ['city', 'street1'] }) satisfies fc.Arbitrary<Type>

const [data] = fc.sample(arbitrary, 1) satisfies Type[]

summary(() => {
  group('〖🏁️〗››› Object', () => {
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

      bench('zx.clone', function* () {
        yield {
          [0]() { return data },
          bench(x: Type) {
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
