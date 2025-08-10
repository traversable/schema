import { barplot, bench, boxplot, do_not_optimize, group, run, summary } from 'mitata'
// import { JsonSchema } from '@traversable/json-schema'
import Lodash from 'lodash.clonedeep'
import * as fc from 'fast-check'

type User = {
  firstName: string
  lastName?: string
  addresses: {
    street1: string
    street2?: string
    city: string
  }[]
}

const arbitraryUser = fc.record({
  firstName: fc.string(),
  lastName: fc.string(),
  addresses: fc.array(
    fc.record({
      street1: fc.string(),
      street2: fc.string(),
      city: fc.string(),
    }, { requiredKeys: ['street1', 'city'] }),
    { minLength: 1, maxLength: 10 }
  )
}, { requiredKeys: ['firstName', 'addresses'] })

const data = fc.sample(arbitraryUser, 10)

function cloneUser(user: User): User {
  return {
    firstName: user.firstName,
    ...user.lastName !== undefined &&
    ({ lastName: user.lastName }),
    addresses: user.addresses.map((address) => ({
      street1: address.street1,
      ...address.street2 !== undefined &&
      ({ street2: address.street2 }),
      city: address.city
    }))
  }
}

boxplot(() => {
  summary(() => {
    group('〖🏁️〗››› JsonSchema.deepClone: real-world example', () => {
      barplot(() => {

        bench('Lodash', function* () {
          yield {
            [0]() { return data },
            bench(xs: User[]) {
              do_not_optimize(
                xs.forEach((x) => Lodash(x))
              )
            }
          }
        }).gc('inner')

        bench('deepClone', function* () {
          yield {
            [0]() { return data },
            bench(xs: User[]) {
              do_not_optimize(
                xs.forEach((x) => cloneUser(x))
              )
            }
          }
        }).gc('inner')

      })
    })
  })
})

await run({ throw: true })
