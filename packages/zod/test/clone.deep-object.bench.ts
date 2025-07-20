import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import Lodash from 'lodash.clonedeep'

type Type = {
  a: Array<{
    b: Array<{ c: string, d: string, e: string }>
    f: Array<{ g: string, h: string, i: string }>
    j: Array<{ k: string, l: string, m: string }>
  }>
  n: Array<{
    o: Array<{ p: string, q: string, r: string }>
    s: Array<{ t: string, u: string, v: string }>
    w: Array<{ x: string, y: string, z: string }>
  }>
}

const zx_clone = zx.clone(
  z.object({
    a: z.array(
      z.object({
        b: z.array(z.object({ c: z.string(), d: z.string(), e: z.string() })),
        f: z.array(z.object({ g: z.string(), h: z.string(), i: z.string() })),
        j: z.array(z.object({ k: z.string(), l: z.string(), m: z.string() })),
      })
    ),
    n: z.array(
      z.object({
        o: z.array(z.object({ p: z.string(), q: z.string(), r: z.string() })),
        s: z.array(z.object({ t: z.string(), u: z.string(), v: z.string() })),
        w: z.array(z.object({ x: z.string(), y: z.string(), z: z.string() })),
      })
    )
  }) satisfies z.ZodType<Type>
)

const arbitrary = fc.record({
  a: fc.array(
    fc.record({
      b: fc.array(fc.record({ c: fc.string(), d: fc.string(), e: fc.string() })),
      f: fc.array(fc.record({ g: fc.string(), h: fc.string(), i: fc.string() })),
      j: fc.array(fc.record({ k: fc.string(), l: fc.string(), m: fc.string() })),
    })
  ),
  n: fc.array(
    fc.record({
      o: fc.array(fc.record({ p: fc.string(), q: fc.string(), r: fc.string() })),
      s: fc.array(fc.record({ t: fc.string(), u: fc.string(), v: fc.string() })),
      w: fc.array(fc.record({ x: fc.string(), y: fc.string(), z: fc.string() })),
    })
  )
}) satisfies fc.Arbitrary<Type>

const [data] = fc.sample(arbitrary, 1)

summary(() => {
  group('〖🏁️〗››› zx.clone: object (deep)', () => {
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
