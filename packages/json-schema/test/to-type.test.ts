import * as vi from 'vitest'
import { JsonSchema } from '@traversable/json-schema'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

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
        type: "object",
        required: ['children'],
        properties: {
          name: { type: "string" },
          children: {
            type: "array",
            items: { $ref: "#/$defs/name" }
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
        type Type = { name?: string; children: Array<Name> }
        "
      `)

    const canonizeRefName = ($ref: string) =>
      'Custom_' + ($ref.startsWith('#/$defs') ? $ref.substring('#/$defs'.length) : $ref).replaceAll(/\W/g, '')

    const actual_02 = JsonSchema.toType(
      {
        $defs: {
          name: { type: 'string' },
        },
        type: "object",
        required: ['children'],
        properties: {
          name: { type: "string" },
          children: {
            type: "array",
            items: { $ref: "#/$defs/name" }
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
      "type Custom_name = string
      type Type = { name?: string; children: Array<Custom_name> }
      "
    `)
  })

})
