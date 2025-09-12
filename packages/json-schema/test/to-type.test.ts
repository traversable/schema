import * as vi from 'vitest'
import { JsonSchema, canonizeRefName as canonizeRef } from '@traversable/json-schema'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false, printWidth: 40 })

const canonizeRefName = (ref: string) => `Custom${canonizeRef(ref)}`

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖️⛳️〗› ❲JsonSchema.toType❳: JsonSchema.Unknown', () => {
    vi.expect.soft(format(
      JsonSchema.toType({}, { typeName: 'Type' }).result
    )).toMatchInlineSnapshot
      (`
      "type Type = unknown
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.toType❳: JsonSchema.Never', () => {
    vi.expect.soft(format(
      JsonSchema.toType({ not: {} }, { typeName: 'Type' }).result
    )).toMatchInlineSnapshot
      (`
      "type Type = never
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.toType❳: JsonSchema.Intersection', () => {
    vi.expect.soft(format(
      JsonSchema.toType(
        {
          allOf: [
            { type: 'number' },
            { const: 1 },
          ]
        },
        { typeName: 'Type' }
      ).result
    )).toMatchInlineSnapshot
      (`
      "type Type = number & 1
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.toType❳: JsonSchema.Union', () => {
    vi.expect.soft(format(
      JsonSchema.toType(
        {
          anyOf: [
            { type: 'number' },
            { type: 'string' },
          ]
        },
        { typeName: 'Type' }
      ).result
    )).toMatchInlineSnapshot
      (`
      "type Type = number | string
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.toType❳: JsonSchema.DisjointUnion', () => {
    vi.expect.soft(format(
      JsonSchema.toType(
        {
          oneOf: [
            { type: 'number' },
            { const: 'string' },
          ]
        },
        { typeName: 'Type' }
      ).result
    )).toMatchInlineSnapshot
      (`
      "type Type = number | "string"
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.toType❳: JsonSchema.Ref', () => {
    const actual_01 = JsonSchema.toType(
      {
        $defs: {
          name: { type: 'string' },
        },
        type: 'object',
        required: ['children'],
        properties: {
          name: { type: 'string' },
          children: {
            type: 'array',
            items: { $ref: '#/$defs/name' }
          }
        }
      },
      { typeName: 'Type' }
    )

    vi.expect.soft(format(
      [
        ...Object.values(actual_01.refs),
        actual_01.result
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "type Name = string
      type Type = {
        name?: string
        children: Array<Name>
      }
      "
    `)

    const actual_02 = JsonSchema.toType(
      {
        $defs: {
          name: { type: 'string' },
        },
        type: 'object',
        required: ['children'],
        properties: {
          name: { type: 'string' },
          children: {
            type: 'array',
            items: { $ref: '#/$defs/name' }
          }
        }
      },
      { typeName: 'Type', canonizeRefName }
    )

    vi.expect.soft(format(
      [
        ...Object.values(actual_02.refs),
        actual_02.result
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "type CustomName = string
      type Type = {
        name?: string
        children: Array<CustomName>
      }
      "
    `)

    const actual_03 = JsonSchema.toType(
      {
        $defs: {
          state: { enum: ['AL', 'AK', 'AZ', '...'] },
          address: {
            type: 'object',
            required: ['street1', 'city', 'state'],
            properties: {
              street1: { type: 'string' },
              street2: { type: 'string' },
              city: { type: 'string' },
              state: {
                $ref: '#/$defs/state'
              }
            }
          }
        },
        type: 'object',
        required: ['firstName', 'address'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          address: {
            $ref: '#/$defs/address'
          }
        }
      },
      { typeName: 'User' }
    )

    vi.expect.soft(format(
      [
        ...Object.values(actual_03.refs),
        actual_03.result
      ].join('\n')
    )).toMatchInlineSnapshot
      (`
      "type State = "AL" | "AK" | "AZ" | "..."
      type Address = {
        street1: string
        street2?: string
        city: string
        state: State
      }
      type User = {
        firstName: string
        lastName?: string
        address: Address
      }
      "
    `)
  })

})
