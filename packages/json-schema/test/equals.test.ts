import * as vi from 'vitest'
import * as fc from 'fast-check'
import { JsonSchema } from '@traversable/json-schema'
import { jsonSchemaTest } from '@traversable/json-schema-test'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.it('〖️⛳️〗› ❲JsonSchema.equals.writeable❳: JsonSchema.Never', () => {
    vi.expect.soft(format(
      JsonSchema.equals.writeable({ type: 'boolean' })
    )).toMatchInlineSnapshot
      (`
      "function equals(l: boolean, r: boolean) {
        if (l === r) return true
        if (l !== r) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.equals.writeable({ type: 'object', additionalProperties: { type: 'boolean' } })
    )).toMatchInlineSnapshot
      (`
      "function equals(l: Record<string, boolean>, r: Record<string, boolean>) {
        if (l === r) return true
        const l_keys = Object.keys(l)
        const r_keys = Object.keys(r)
        const length = l_keys.length
        if (length !== r_keys.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const key = l_keys[ix]
          const l_k_ = l[key]
          const r_k_ = r[key]
          if (l_k_ !== r_k_) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.equals.writeable({
        type: 'object',
        patternProperties: { "abc": { type: 'boolean' } },
      }, { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<"abc", boolean>
      function equals(l: Type, r: Type) {
        if (l === r) return true
        const l_keys = Object.keys(l)
        const r_keys = Object.keys(r)
        const length = l_keys.length
        if (length !== r_keys.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const key = l_keys[ix]
          const l_k_ = l[key]
          const r_k_ = r[key]
          if (/abc/.test(key)) {
            if (l_k_ !== r_k_) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.equals.writeable({ const: true })
    )).toMatchInlineSnapshot
      (`
      "function equals(l: true, r: true) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.equals.writeable({ const: [] })
    )).toMatchInlineSnapshot
      (`
      "function equals(l: [], r: []) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.equals.writeable({ const: [true] })
    )).toMatchInlineSnapshot
      (`
      "function equals(l: [true], r: [true]) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.equals.writeable(
        { const: { a: [true] } }
      )
    )).toMatchInlineSnapshot
      (`
      "function equals(l: { a: [true] }, r: { a: [true] }) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)

  })
})

