import * as vi from 'vitest'
import { JsonSchema } from '@traversable/json-schema'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖️⛳️〗› ❲JsonSchema.toType❳: JsonSchema.Unknown', () => {
    vi.expect.soft(format(
      JsonSchema.toType({}, { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = unknown
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.toType❳: JsonSchema.Never', () => {
    vi.expect.soft(format(
      JsonSchema.toType({ not: {} }, { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = never
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.toType❳: JsonSchema.AllOf', () => {

    vi.expect.soft(format(
      JsonSchema.toType(
        {
          allOf: [
            { type: 'number' },
            { const: 1 },
          ]
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = number & 1
      "
    `)
  })
})

