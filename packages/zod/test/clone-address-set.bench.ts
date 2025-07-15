import { barplot, bench, do_not_optimize, group, run, summary } from 'mitata'

type AddressSet = Set<{
  street1: string
  street2?: string
  city: string
}>

const data = new Set([{ street1: '221B Baker St', city: 'London' }]) satisfies AddressSet

function zx_clone(x: AddressSet): AddressSet {
  const out: AddressSet = new Set()
  for (let value of x) {
    const newValue = Object.create(null)
    newValue.street1 = value.street1
    if (value.street2 !== undefined) newValue.street2 = value.street2
    newValue.city = value.city
    out.add(newValue)
  }
  return out
}

// function zx_clone(x: AddressSet): AddressSet {
//   const out: AddressSet = new Set()
//   for (let value of x) {
//     const newValue = Object.create(null)
//     newValue.street1 = value.street1
//     if (newValue.street2 !== undefined) newValue.street2 = value.street2
//     newValue.city = value.city
//     out.add(newValue)
//   }
//   return out
// }

summary(() => {
  group('〖🏁️〗››› AddressSet', () => {
    barplot(() => {
      bench('structuredClone', function* () {
        yield {
          [0]() { return data },
          bench(x: AddressSet) {
            do_not_optimize(
              structuredClone(x)
            )
          }
        }
      }).gc('inner')

      bench('zx.clone', function* () {
        yield {
          [0]() { return data },
          bench(x: AddressSet) {
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


