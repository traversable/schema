import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'

type AddressMap = Map<{
  street1: string
  street2?: string
  city: string
}, string>

const data = new Map([[{ street1: '221B Baker St', city: 'London' }, '01']]) satisfies AddressMap

function zx_clone(x: AddressMap): AddressMap {
  const out: AddressMap = new Map()
  for (let [key, value] of x) {
    const newKey = Object.create(null)
    newKey.street1 = key.street1
    if (key.street2 !== undefined) newKey.street2 = key.street2
    newKey.city = key.city
    const newValue = value
    out.set(newKey, newValue)
  }
  return out
}

summary(() => {
  group('〖🏁️〗››› AddressMap', () => {
    barplot(() => {
      bench('structuredClone', function* () {
        yield {
          [0]() { return data },
          bench(x: AddressMap) {
            do_not_optimize(
              structuredClone(x)
            )
          }
        }
      }).gc('inner')

      bench('zx.clone', function* () {
        yield {
          [0]() { return data },
          bench(x: AddressMap) {
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
