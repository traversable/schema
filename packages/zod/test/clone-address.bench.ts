import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'

type Address = {
  street1: string
  street2?: string
  city: string
}

const data = { street1: '221B Baker St', city: 'London' } satisfies Address

function zx_clone(x: Address): Address {
  const out: Address = Object.create(null)
  out.street1 = x.street1
  if (x.street2 !== undefined) out.street2 = x.street2
  out.city = x.city
  return out
}

summary(() => {
  group('〖🏁️〗››› Address', () => {
    barplot(() => {
      bench('structuredClone', function* () {
        yield {
          [0]() { return data },
          bench(x: Address) {
            do_not_optimize(
              structuredClone(x)
            )
          }
        }
      }).gc('inner')

      bench('zx.clone', function* () {
        yield {
          [0]() { return data },
          bench(x: Address) {
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
