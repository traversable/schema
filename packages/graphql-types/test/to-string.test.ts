import * as vi from 'vitest'
import { toString } from '@traversable/graphql-types'
import * as graphql from 'graphql'
import prettier from '@prettier/sync'

// const format = (src: string) => prettier.format(
//   src,
//   { parser: 'graphql', semi: false, printWidth: 35 }
// )

const format = (src: string) => src

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/graphql-types❳', () => {
  vi.test('〖⛳️〗› ❲toString❳', () => {
    // vi.expect.soft(
    //   format(
    //     toString(
    //       graphql.parse(
    //         format(
    //           `type Pet {
    //             petName: [String!]
    //           }
    //           type Human {
    //             humanName: String!
    //             pet: Pet
    //           }`
    //         )
    //       )
    //     )
    //   )
    // ).toMatchInlineSnapshot
    //   (`
    //   "type Pet {
    //     petName: [String!]
    //   }

    //   type Human {
    //     humanName: String!
    //     pet: Pet
    //   }
    //   "
    // `)

    vi.expect.soft(
      format(
        toString(
          graphql.parse(
            format(
              `type Human {
                def: String
              }
              
              query {
                abc: Boolean
              }`
            )
          )
        )
      )
    ).toMatchInlineSnapshot
      (`
      "type Human { def: String }

      query  { Boolean }"
    `)
  })
})

