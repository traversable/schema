import * as fc from 'fast-check'
import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'

type AddressRecord = Record<string, {
  street1: string
  street2?: string
  city: string
}>

const data = {
  one: { street1: '221B Baker St', city: 'London' },
  two: { street1: '4 Privet Dr', city: 'London' },
} satisfies AddressRecord

function zx_clone(x: AddressRecord): AddressRecord {
  const out: AddressRecord = Object.create(null)
  for (let key in x) {
    const value = x[key]
    const newValue = Object.create(null)
    newValue.street1 = value.street1
    if (value.street2 !== undefined) newValue.street2 = value.street2
    newValue.city = value.city
    out[key] = newValue
  }
  return out
}

summary(() => {
  group('〖🏁️〗››› AddressRecord', () => {
    barplot(() => {
      bench('structuredClone', function* () {
        yield {
          [0]() { return data },
          bench(x: AddressRecord) {
            do_not_optimize(
              structuredClone(x)
            )
          }
        }
      }).gc('inner')

      bench('zx.clone', function* () {
        yield {
          [0]() { return data },
          bench(x: AddressRecord) {
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
