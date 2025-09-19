import * as vi from 'vitest'
import { toType } from '@traversable/graphql-types'
import * as graphql from 'graphql'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(
  src,
  { parser: 'typescript', semi: false, printWidth: 35 }
)

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/graphql-types❳', () => {
  vi.test('〖⛳️〗› ❲toType❳', () => {
    vi.expect.soft(format(
      toType(graphql.parse(`
        type Pet {
          petName: [String!]
        }
        type Human {
          humanName: String!
          pet: Pet
        }
        `
      ))
    )).toMatchInlineSnapshot
      (`
      "type Pet = {
        petName?: Array<string>
      }
      type Human = {
        humanName: string
        pet?: Pet
      }
      "
    `)
  })
})
