import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'
import * as fc from 'fast-check'

type DeepAddress = { b: Array<{ c: Array<{ d: string }> }> }

const arbitrary = fc.record({
  b: fc.array(
    fc.record({
      c: fc.array(
        fc.record({
          d: fc.string()
        })
      )
    })
  )
}) satisfies fc.Arbitrary<DeepAddress>

const [data] = fc.sample(arbitrary, 1)

console.log('data', JSON.stringify(data, null, 2))

function zx_clone(prev: DeepAddress) {
  const next = Object.create(null)
  const prev_b = prev.b
  const length = prev_b.length
  const next_b = new Array(length)
  for (let ix = length; ix-- !== 0;) {
    const prev_b_item = prev_b[ix]
    const next_b_item = Object.create(null)
    const prev_b_item_c = prev_b_item.c
    const length = prev_b_item_c.length
    const next_b_item_c = new Array(length)
    for (let ix = length; ix-- !== 0;) {
      const prev_b_item_c_item = prev_b_item_c[ix]
      const next_b_item_c_item = Object.create(null)
      const prev_b_item_c_item_d = prev_b_item_c_item.d
      const next_b_item_c_item_d = prev_b_item_c_item_d
      next_b_item_c_item.d = next_b_item_c_item_d
      next_b_item_c[ix] = next_b_item_c_item
    }
    next_b_item.c = next_b_item_c
    next_b[ix] = next_b_item
  }
  next.b = next_b
  return next
}

summary(() => {
  group('〖🏁️〗››› Address Deep', () => {
    barplot(() => {
      bench('structuredClone', function* () {
        yield {
          [0]() { return data },
          bench(x: DeepAddress) {
            do_not_optimize(
              structuredClone(x)
            )
          }
        }
      }).gc('inner')

      bench('zx.clone', function* () {
        yield {
          [0]() { return data },
          bench(x: DeepAddress) {
            do_not_optimize(
              zx_clone(x)
            )
          }
        }
      }).gc('inner')
    })
  })
})

run()
