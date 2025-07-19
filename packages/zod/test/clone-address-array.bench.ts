import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'

type AddressArray = {
  street1: string
  street2?: string
  city: string
}[]

const data = [{ street1: '221B Baker St', city: 'London' }] satisfies AddressArray

function zx_clone(x: AddressArray): AddressArray {
  const out: AddressArray = []
  for (let ix = 0; ix < x.length; ix++) {
    out.push(Object.create(null))
    out[ix].street1 = x[ix].street1
    if (x[ix].street2 !== undefined) out[ix].street2 = x[ix].street2
    out[ix].city = x[ix].city
  }
  return out
}

summary(() => {
  group('〖🏁️〗››› AddressArray', () => {
    barplot(() => {
      bench('structuredClone', function* () {
        yield {
          [0]() { return data },
          bench(x: AddressArray) {
            do_not_optimize(
              structuredClone(x)
            )
          }
        }
      }).gc('inner')

      bench('zx.clone', function* () {
        yield {
          [0]() { return data },
          bench(x: AddressArray) {
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


