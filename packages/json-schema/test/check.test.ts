import * as vi from 'vitest'
import * as fc from 'fast-check'
import { JsonSchema } from '@traversable/json-schema'
import { jsonSchemaTest } from '@traversable/json-schema-test'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.it('〖️⛳️〗› ❲JsonSchema.check.writeable❳: JsonSchema.Never', () => {
    vi.expect.soft(format(
      JsonSchema.check.writeable({ type: 'boolean' })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return typeof value === "boolean"
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({ type: 'object', additionalProperties: { type: 'boolean' } })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
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
      "function check(value) {
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

    vi.expect.soft(format(
      JsonSchema.check.writeable({ const: true })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return value === true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.check.writeable({ const: [] })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
        return Array.isArray(value) && value.length === 0
      }
      "
    `)


    vi.expect.soft(format(
      JsonSchema.check.writeable({ const: [true] })
    )).toMatchInlineSnapshot
      (`
      "function check(value) {
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
      "function check(value) {
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
      "function check(value) {
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

  })
})
