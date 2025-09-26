import * as vi from 'vitest'
import { toString } from '@traversable/graphql-types'
import * as graphql from 'graphql'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(
  src,
  { parser: 'graphql', semi: false, printWidth: 35 }
)

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/graphql-types❳', () => {
  vi.test('〖⛳️〗› ❲toString❳', () => {
    vi.expect.soft(format(
      toString(
        graphql.parse(format(`
          type Pet {
            petName: [String!]
          }

          type Human {
            humanName: String!
            pet: Pet
          }
        `))
      )
    )).toMatchInlineSnapshot
      (`
      "type Pet {
        petName: [String!]
      }

      type Human {
        humanName: String!
        pet: Pet
      }
      "
    `)

    vi.expect.soft(format(
      toString(
        graphql.parse(
          format(`
            query {
              abc: Boolean
            }
          `)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "query {
        abc: Boolean
      }
      "
    `)

    vi.expect.soft(format(
      toString(
        graphql.parse(
          format(`
            fragment comparisonFields on Character {
              name
              appearsIn
              friends {
                name
              }
            }
          `)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "fragment comparisonFields on Character {
        name
        appearsIn
        friends {
          name
        }
      }
      "
    `)

  })
})

