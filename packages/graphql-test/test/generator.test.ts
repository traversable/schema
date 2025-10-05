import * as vi from 'vitest'
import * as fc from 'fast-check'
import prettier from '@prettier/sync'
import * as gql from 'graphql'
import { SeedGenerator, seedToSchema } from '@traversable/graphql-test'
import * as F from '@traversable/graphql-types'

function format(src: string) {
  return prettier.format(src, { parser: 'graphql', printWidth: 60 })
}

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/graphql-test❳', () => {

  vi.test('〖⛳️〗› ❲SeedGenerator❳', () => {
    const Builder = SeedGenerator({
      noDescriptions: true,
      exclude: [
        // 'EnumValueDefinition',
        // 'ObjectField',
        // 'OperationTypeDefinition',
      ],
    })

    try {
      const [seed] = fc.sample(Builder['Document'], 1)
      try {
        const schema = seedToSchema(seed)
        console.log(F.toString(schema))
      } catch (e) {
        console.error('\n\nFAILED: seedToSchema', JSON.stringify(seed, null, 2), '\n\n')
        throw e
      }
    } catch (e) {
      console.error('\n\nFAILED: fc.sample(Builder["Document"])\n\n')
      throw e
    }


    vi.assert.isTrue(true)
  })
})
