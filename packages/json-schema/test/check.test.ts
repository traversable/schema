import * as vi from 'vitest'
import { JsonSchema } from '@traversable/json-schema'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Never', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({
        not: {}
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is never {
        return false
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Unknown', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({})
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is unknown {
        return true
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Null', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({
        type: 'null'
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is null {
        return value === null
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Boolean', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({ type: 'boolean' })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is boolean {
        return typeof value === "boolean"
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Integer', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({ type: 'integer' })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is number {
        return Number.isSafeInteger(value)
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Number', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({ type: 'number' })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is number {
        return Number.isFinite(value)
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.String', () => {
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Enum', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({
        enum: []
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is never {
        return false
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({
        enum: ['A']
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is "A" {
        return value === "A"
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({
        enum: ['A', 'B']
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is "A" | "B" {
        return value === "A" || value === "B"
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Const', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({ const: true })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is true {
        return value === true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({ const: [] })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is [] {
        return Array.isArray(value) && value.length === 0
      }
      "
    `)


    vi.expect.soft(format(
      JsonSchema.check.writeable({ const: [true] })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is [true] {
        return Array.isArray(value) && value.length === 1 && value[0] === true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
        { const: { a: [true] } }
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is { a: [true] } {
        return (
          !!value &&
          typeof value === "object" &&
          Array.isArray(value.a) &&
          value.a.length === 1 &&
          value.a[0] === true
        )
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Union', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable(
        {
          anyOf: []
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is never {
        return false
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
        {
          anyOf: [
            {
              type: 'string'
            }
          ]
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is string {
        return typeof value === "string"
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
        {
          anyOf: [
            {
              type: "object",
              properties: {
                w_k$_: {
                  type: "boolean"
                },
                $4$DLOs7sB: {
                  type: "boolean"
                }
              },
              required: [
                "w_k$_"
              ]
            },
            {
              type: "null"
            }
          ]
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function check(
        value: any,
      ): value is { w_k$_: boolean; $4$DLOs7sB?: boolean } | null {
        return (
          (!!value &&
            typeof value === "object" &&
            typeof value.w_k$_ === "boolean" &&
            (!Object.hasOwn(value, "$4$DLOs7sB") ||
              typeof value.$4$DLOs7sB === "boolean")) ||
          value === null
        )
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
        {
          anyOf: [
            {
              const: "<$\"{hyu"
            }
          ]
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is '<$"{hyu' {
        return value === '<$"{hyu'
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.DisjointUnion', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable(
        {
          oneOf: []
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is never {
        return false
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
        {
          oneOf: [
            {
              type: 'string'
            }
          ]
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is string {
        return typeof value === "string"
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
        {
          oneOf: [
            {
              type: "object",
              properties: {
                w_k$_: {
                  type: "boolean"
                },
                $4$DLOs7sB: {
                  type: "boolean"
                }
              },
              required: [
                "w_k$_"
              ]
            },
            {
              type: "null"
            }
          ]
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function check(
        value: any,
      ): value is { w_k$_: boolean; $4$DLOs7sB?: boolean } | null {
        return (
          (!!value &&
            typeof value === "object" &&
            typeof value.w_k$_ === "boolean" &&
            (!Object.hasOwn(value, "$4$DLOs7sB") ||
              typeof value.$4$DLOs7sB === "boolean")) ||
          value === null
        )
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
        {
          oneOf: [
            {
              const: "<$\"{hyu"
            }
          ]
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is '<$"{hyu' {
        return value === '<$"{hyu'
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Intersection', () => {
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Array', () => {
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Record', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({
        type: 'object',
        additionalProperties: { type: 'boolean' }
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is Record<string, boolean> {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(([key, value]) => typeof value === "boolean")
        )
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({
        type: 'object',
        patternProperties: { "abc": { type: 'boolean' } },
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is { abc: boolean } {
        return (
          !!value &&
          typeof value === "object" &&
          Object.entries(value).every(([key, value]) => {
            if (/abc/.test(key)) return typeof value === "boolean"
            return true
          })
        )
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Tuple', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({
        type: 'array',
        prefixItems: [],
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is [] {
        return Array.isArray(value)
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({
        type: 'array',
        prefixItems: [
          { type: 'boolean' },
          { type: 'string' },
        ],
      })
    )).toMatchInlineSnapshot
      (`
      "function check(value: any): value is [boolean, string] {
        return (
          Array.isArray(value) &&
          typeof value[0] === "boolean" &&
          typeof value[1] === "string"
        )
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Object', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({
        type: 'object',
        required: [],
        properties: {}
      }, { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = {}

      function check(value: any): value is Type {
        return !!value && typeof value === "object"
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({
        type: 'object',
        required: ['street1', 'city'],
        properties: {
          street1: { type: 'string' },
          street2: { type: 'string' },
          city: { type: 'string' },
        }
      }, { typeName: 'Address' })
    )).toMatchInlineSnapshot
      (`
      "type Address = { street1: string; street2?: string; city: string }

      function check(value: any): value is Address {
        return (
          !!value &&
          typeof value === "object" &&
          typeof value.street1 === "string" &&
          (!Object.hasOwn(value, "street2") || typeof value.street2 === "string") &&
          typeof value.city === "string"
        )
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({
        type: 'object',
        required: ['firstName', 'address'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          address: {
            type: 'object',
            required: ['street1', 'city', 'state'],
            properties: {
              street1: { type: 'string' },
              street2: { type: 'string' },
              city: { type: 'string' },
              state: { enum: ['AL', 'AK', 'AZ', '...'] }
            }
          }
        }
      }, { typeName: 'User' })
    )).toMatchInlineSnapshot
      (`
      "type User = {
        firstName: string
        lastName?: string
        address: {
          street1: string
          street2?: string
          city: string
          state: "AL" | "AK" | "AZ" | "..."
        }
      }

      function check(value: any): value is User {
        return (
          !!value &&
          typeof value === "object" &&
          typeof value.firstName === "string" &&
          (!Object.hasOwn(value, "lastName") || typeof value.lastName === "string") &&
          !!value.address &&
          typeof value.address === "object" &&
          typeof value.address.street1 === "string" &&
          (!Object.hasOwn(value.address, "street2") ||
            typeof value.address.street2 === "string") &&
          typeof value.address.city === "string" &&
          (value.address.state === "AL" ||
            value.address.state === "AK" ||
            value.address.state === "AZ" ||
            value.address.state === "...")
        )
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Ref', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable(
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
        }
      )
    )).toMatchInlineSnapshot
      (`
      "type Name = string
      function checkName(value: any) {
        return typeof value === "string"
      }
      function check(value: any): value is { name?: string; children: Array<Name> } {
        return (
          !!value &&
          typeof value === "object" &&
          (!Object.hasOwn(value, "name") || typeof value.name === "string") &&
          Array.isArray(value.children) &&
          value.children.every((value) => checkName(value))
        )
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
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
    )).toMatchInlineSnapshot
      (`
      "type Name = string
      type Type = { name?: string; children: Array<Name> }
      function checkName(value: any) {
        return typeof value === "string"
      }
      function check(value: any): value is Type {
        return (
          !!value &&
          typeof value === "object" &&
          (!Object.hasOwn(value, "name") || typeof value.name === "string") &&
          Array.isArray(value.children) &&
          value.children.every((value) => checkName(value))
        )
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
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
        { stripTypes: true }
      )
    )).toMatchInlineSnapshot
      (`
      "function checkName(value) {
        return typeof value === "string"
      }
      function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (!Object.hasOwn(value, "name") || typeof value.name === "string") &&
          Array.isArray(value.children) &&
          value.children.every((value) => checkName(value))
        )
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable(
        {
          $defs: {
            name: { type: 'string' },
            nested: {
              type: 'array',
              items: { $ref: '#/$defs/name' }
            }
          },
          type: "object",
          required: ['children'],
          properties: {
            name: { type: "string" },
            children: {
              type: "array",
              items: { $ref: "#/$defs/nested" }
            }
          }
        },
        { stripTypes: true }
      )
    )).toMatchInlineSnapshot
      (`
      "function checkName(value) {
        return typeof value === "string"
      }
      function checkNested(value) {
        return Array.isArray(value) && value.every((value) => checkName(value))
      }
      function check(value) {
        return (
          !!value &&
          typeof value === "object" &&
          (!Object.hasOwn(value, "name") || typeof value.name === "string") &&
          Array.isArray(value.children) &&
          value.children.every((value) => checkNested(value))
        )
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({
        $defs: {
          array: {
            type: 'array',
            items: {
              $ref: '#/$defs/recursive'
            }
          },
          recursive: {
            type: 'object',
            required: ['children'],
            properties: {
              children: {
                $ref: '#/$defs/array'
              }
            }
          }
        },
        type: "object",
        required: ['children'],
        properties: {
          children: {
            $ref: '#/$defs/array'
          }
        }
      },
        { stripTypes: true })
    )).toMatchInlineSnapshot
      (`
      "function checkRecursive(value) {
        return !!value && typeof value === "object" && checkArray(value.children)
      }
      function checkArray(value) {
        return Array.isArray(value) && value.every((value) => checkRecursive(value))
      }
      function check(value) {
        return !!value && typeof value === "object" && checkArray(value.children)
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({
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
      }, { typeName: 'User' })
    )).toMatchInlineSnapshot
      (`
      "type State = "AL" | "AK" | "AZ" | "..."
      type Address = { street1: string; street2?: string; city: string; state: State }
      type User = { firstName: string; lastName?: string; address: Address }
      function checkState(value: any) {
        return value === "AL" || value === "AK" || value === "AZ" || value === "..."
      }
      function checkAddress(value: any) {
        return (
          !!value &&
          typeof value === "object" &&
          typeof value.street1 === "string" &&
          (!Object.hasOwn(value, "street2") || typeof value.street2 === "string") &&
          typeof value.city === "string" &&
          checkState(value.state)
        )
      }
      function check(value: any): value is User {
        return (
          !!value &&
          typeof value === "object" &&
          typeof value.firstName === "string" &&
          (!Object.hasOwn(value, "lastName") || typeof value.lastName === "string") &&
          checkAddress(value.address)
        )
      }
      "
    `)


  })

})
