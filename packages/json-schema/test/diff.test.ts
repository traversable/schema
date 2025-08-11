import * as vi from 'vitest'
import type { Insert, Update, Delete } from '@sinclair/typebox/value'
import { Diff as oracle } from '@sinclair/typebox/value'
import prettier from '@prettier/sync'
import { fn } from '@traversable/registry'
import { JsonSchema } from '@traversable/json-schema'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

const adapter = {
  add({ path, value }: JsonSchema.diff.Add) {
    return { type: 'insert', path, value } satisfies Insert
  },
  replace({ path, value }: JsonSchema.diff.Replace) {
    return { type: 'update', path, value } satisfies Update
  },
  remove({ path }: JsonSchema.diff.Remove) {
    return { type: 'delete', path } satisfies Delete
  },
}

function adapt(xs: JsonSchema.diff.Edit[]) {
  return xs.map((x) => adapter[x.type](x as never))
}

function sort<T extends { path: string }>(x: T, y: T) {
  return x.path < y.path ? -1 : y.path < x.path ? 1 : 0
}

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳: JsonSchema.diff.writeable', () => {
  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Never', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { not: {} }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: never, y: never) {
        let diff = []
        if (!Object.is(x, y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Null', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { type: 'null' }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: null, y: null) {
        let diff = []
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Boolean', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { type: 'boolean' }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: boolean, y: boolean) {
        let diff = []
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Integer', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { type: 'integer' }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: number, y: number) {
        let diff = []
        if (x !== y && (x === x || y === y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Number', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { type: 'number' }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: number, y: number) {
        let diff = []
        if (x !== y && (x === x || y === y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.String', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { type: 'string' }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: string, y: string) {
        let diff = []
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Enum', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { enum: [] }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: never, y: never) {
        let diff = []
        if (!Object.is(x, y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { enum: [0] }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: 0, y: 0) {
        let diff = []
        if (x !== y && (x === x || y === y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { enum: [0, 1] }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: 0 | 1, y: 0 | 1) {
        let diff = []
        if (x !== y && (x === x || y === y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { enum: [0, 'two'] }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: 0 | "two", y: 0 | "two") {
        let diff = []
        if (!Object.is(x, y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { enum: ['one', 'two'] }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: "one" | "two", y: "one" | "two") {
        let diff = []
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Const', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { const: null }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: null, y: null) {
        let diff = []
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { const: false }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: false, y: false) {
        let diff = []
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { const: 0 }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: 0, y: 0) {
        let diff = []
        if (x !== y && (x === x || y === y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { const: 'hey' }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: "hey", y: "hey") {
        let diff = []
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { const: [] }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: [], y: []) {
        let diff = []
        if (x === y) return diff
        if (x.length !== y.length) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { const: [0, false] }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: [0, false], y: [0, false]) {
        let diff = []
        if (x === y) return diff
        if (x[0] !== y[0] && (x[0] === x[0] || y[0] === y[0])) {
          diff.push({ type: "replace", path: "/0", value: y[0] })
        }
        if (x[1] !== y[1]) {
          diff.push({ type: "replace", path: "/1", value: y[1] })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { const: [[], [[false]]] }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: [[], [[false]]], y: [[], [[false]]]) {
        let diff = []
        if (x === y) return diff
        if (x[0].length !== y[0].length) {
          diff.push({ type: "replace", path: "/0", value: y[0] })
        }
        if (x[1][0][0] !== y[1][0][0]) {
          diff.push({ type: "replace", path: "/1/0/0", value: y[1][0][0] })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { const: {} }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: {}, y: {}) {
        let diff = []
        if (x === y) return diff
        if (Object.keys(x).length !== Object.keys(y).length) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          const: {
            abc: 123,
            def: false
          }
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: { abc: 123; def: false }, y: { abc: 123; def: false }) {
        let diff = []
        if (x === y) return diff
        if (x.abc !== y.abc && (x.abc === x.abc || y.abc === y.abc)) {
          diff.push({ type: "replace", path: "/abc", value: y.abc })
        }
        if (x.def !== y.def) {
          diff.push({ type: "replace", path: "/def", value: y.def })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          type: 'array',
          items: {
            const: {
              abc: 123,
              def: false
            }
          }
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(
        x: Array<{ abc: 123; def: false }>,
        y: Array<{ abc: 123; def: false }>,
      ) {
        let diff = []
        if (x === y) return diff
        const length = Math.min(x.length, y.length)
        let ix = 0
        for (; ix < length; ix++) {
          const x_item = x[ix]
          const y_item = y[ix]
          if (
            x_item.abc !== y_item.abc &&
            (x_item.abc === x_item.abc || y_item.abc === y_item.abc)
          ) {
            diff.push({ type: "replace", path: \`/\${ix}/abc\`, value: y_item.abc })
          }
          if (x_item.def !== y_item.def) {
            diff.push({ type: "replace", path: \`/\${ix}/def\`, value: y_item.def })
          }
        }
        if (length < x.length) {
          for (; ix < x.length; ix++) {
            diff.push({ type: "remove", path: \`/\${ix}\` })
          }
        }
        if (length < y.length) {
          for (; ix < y.length; ix++) {
            diff.push({ type: "add", path: \`/\${ix}\`, value: y[ix] })
          }
        }
        return diff
      }
      "
    `)

  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Array', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          type: 'array',
          items: {
            type: 'object',
            required: ['street1', 'city'],
            properties: {
              street1: { type: 'string' },
              street2: { type: 'string' },
              city: { type: 'string' },
            }
          }
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{ street1: string; street2?: string; city: string }>
      function diff(x: Type, y: Type) {
        let diff = []
        if (x === y) return diff
        const length = Math.min(x.length, y.length)
        let ix = 0
        for (; ix < length; ix++) {
          const x_item = x[ix]
          const y_item = y[ix]
          if (x_item.street1 !== y_item.street1) {
            diff.push({
              type: "replace",
              path: \`/\${ix}/street1\`,
              value: y_item.street1,
            })
          }
          if (y_item?.street2 === undefined && x_item?.street2 !== undefined) {
            diff.push({ type: "remove", path: \`/\${ix}/street2\` })
          } else if (x_item?.street2 === undefined && y_item?.street2 !== undefined) {
            diff.push({ type: "add", path: \`/\${ix}/street2\`, value: y_item?.street2 })
          } else if (x_item?.street2 !== undefined && y_item?.street2 !== undefined) {
            if (x_item?.street2 !== y_item?.street2) {
              diff.push({
                type: "replace",
                path: \`/\${ix}/street2\`,
                value: y_item?.street2,
              })
            }
          }
          if (x_item.city !== y_item.city) {
            diff.push({ type: "replace", path: \`/\${ix}/city\`, value: y_item.city })
          }
        }
        if (length < x.length) {
          for (; ix < x.length; ix++) {
            diff.push({ type: "remove", path: \`/\${ix}\` })
          }
        }
        if (length < y.length) {
          for (; ix < y.length; ix++) {
            diff.push({ type: "add", path: \`/\${ix}\`, value: y[ix] })
          }
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<Array<Array<string>>>
      function diff(x: Type, y: Type) {
        let diff = []
        if (x === y) return diff
        const length = Math.min(x.length, y.length)
        let ix = 0
        for (; ix < length; ix++) {
          const x_item = x[ix]
          const y_item = y[ix]
          const length1 = Math.min(x_item.length, y_item.length)
          let ix1 = 0
          for (; ix1 < length1; ix1++) {
            const x_item_item = x_item[ix1]
            const y_item_item = y_item[ix1]
            const length2 = Math.min(x_item_item.length, y_item_item.length)
            let ix2 = 0
            for (; ix2 < length2; ix2++) {
              const x_item_item_item = x_item_item[ix2]
              const y_item_item_item = y_item_item[ix2]
              if (x_item_item_item !== y_item_item_item) {
                diff.push({
                  type: "replace",
                  path: \`/\${ix}/\${ix1}/\${ix2}\`,
                  value: y_item_item_item,
                })
              }
            }
            if (length2 < x_item_item.length) {
              for (; ix2 < x_item_item.length; ix2++) {
                diff.push({ type: "remove", path: \`/\${ix}/\${ix1}/\${ix2}\` })
              }
            }
            if (length2 < y_item_item.length) {
              for (; ix2 < y_item_item.length; ix2++) {
                diff.push({
                  type: "add",
                  path: \`/\${ix}/\${ix1}/\${ix2}\`,
                  value: y_item_item[ix2],
                })
              }
            }
          }
          if (length1 < x_item.length) {
            for (; ix1 < x_item.length; ix1++) {
              diff.push({ type: "remove", path: \`/\${ix}/\${ix1}\` })
            }
          }
          if (length1 < y_item.length) {
            for (; ix1 < y_item.length; ix1++) {
              diff.push({ type: "add", path: \`/\${ix}/\${ix1}\`, value: y_item[ix1] })
            }
          }
        }
        if (length < x.length) {
          for (; ix < x.length; ix++) {
            diff.push({ type: "remove", path: \`/\${ix}\` })
          }
        }
        if (length < y.length) {
          for (; ix < y.length; ix++) {
            diff.push({ type: "add", path: \`/\${ix}\`, value: y[ix] })
          }
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Record', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          type: 'object',
          patternProperties: {
            abc: { type: 'string' },
            def: { type: 'number' }
          },
          additionalProperties: {
            type: 'array',
            items: { type: 'string' }
          }
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Array<string>> & { abc: string; def: number }
      function diff(x: Type, y: Type) {
        let diff = []
        if (x === y) return diff
        const seen = new Set()
        for (let key in x) {
          seen.add(key)
          if (!(key in y)) {
            diff.push({ type: "remove", path: \`/\${key}\` })
            continue
          }
          if (/abc/.test(key)) {
            if (x[key] !== y[key]) {
              diff.push({ type: "replace", path: \`/\${key}\`, value: y[key] })
            }
          } else if (/def/.test(key)) {
            if (x[key] !== y[key] && (x[key] === x[key] || y[key] === y[key])) {
              diff.push({ type: "replace", path: \`/\${key}\`, value: y[key] })
            }
          } else {
            const length = Math.min(x[key].length, y[key].length)
            let ix = 0
            for (; ix < length; ix++) {
              const x_key__item = x[key][ix]
              const y_key__item = y[key][ix]
              if (x_key__item !== y_key__item) {
                diff.push({
                  type: "replace",
                  path: \`/\${key}/\${ix}\`,
                  value: y_key__item,
                })
              }
            }
            if (length < x[key].length) {
              for (; ix < x[key].length; ix++) {
                diff.push({ type: "remove", path: \`/\${key}/\${ix}\` })
              }
            }
            if (length < y[key].length) {
              for (; ix < y[key].length; ix++) {
                diff.push({ type: "add", path: \`/\${key}/\${ix}\`, value: y[key][ix] })
              }
            }
          }
        }
        for (let key in y) {
          if (seen.has(key)) {
            continue
          }
          if (!(key in x)) {
            diff.push({ type: "add", path: \`/\${key}\`, value: y[key] })
            continue
          }
          if (/abc/.test(key)) {
            if (x[key] !== y[key]) {
              diff.push({ type: "replace", path: \`/\${key}\`, value: y[key] })
            }
          } else if (/def/.test(key)) {
            if (x[key] !== y[key] && (x[key] === x[key] || y[key] === y[key])) {
              diff.push({ type: "replace", path: \`/\${key}\`, value: y[key] })
            }
          } else {
            const length = Math.min(x[key].length, y[key].length)
            let ix = 0
            for (; ix < length; ix++) {
              const x_key__item = x[key][ix]
              const y_key__item = y[key][ix]
              if (x_key__item !== y_key__item) {
                diff.push({
                  type: "replace",
                  path: \`/\${key}/\${ix}\`,
                  value: y_key__item,
                })
              }
            }
            if (length < x[key].length) {
              for (; ix < x[key].length; ix++) {
                diff.push({ type: "remove", path: \`/\${key}/\${ix}\` })
              }
            }
            if (length < y[key].length) {
              for (; ix < y[key].length; ix++) {
                diff.push({ type: "add", path: \`/\${key}/\${ix}\`, value: y[key][ix] })
              }
            }
          }
        }
        return diff
      }
      "
    `)

  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Object', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          type: 'object',
          required: ['firstName', 'addresses'],
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            addresses: {
              type: 'array',
              items: {
                type: 'object',
                required: ['street1', 'city'],
                properties: {
                  street1: { type: 'string' },
                  street2: { type: 'string' },
                  city: { type: 'string' },
                }
              }
            }
          }
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        firstName: string
        lastName?: string
        addresses: Array<{ street1: string; street2?: string; city: string }>
      }
      function diff(x: Type, y: Type) {
        let diff = []
        if (x === y) return diff
        if (x.firstName !== y.firstName) {
          diff.push({ type: "replace", path: "/firstName", value: y.firstName })
        }
        if (y?.lastName === undefined && x?.lastName !== undefined) {
          diff.push({ type: "remove", path: "/lastName" })
        } else if (x?.lastName === undefined && y?.lastName !== undefined) {
          diff.push({ type: "add", path: "/lastName", value: y?.lastName })
        } else if (x?.lastName !== undefined && y?.lastName !== undefined) {
          if (x?.lastName !== y?.lastName) {
            diff.push({ type: "replace", path: "/lastName", value: y?.lastName })
          }
        }
        const length = Math.min(x.addresses.length, y.addresses.length)
        let ix = 0
        for (; ix < length; ix++) {
          const x_addresses_item = x.addresses[ix]
          const y_addresses_item = y.addresses[ix]
          if (x_addresses_item.street1 !== y_addresses_item.street1) {
            diff.push({
              type: "replace",
              path: \`/addresses/\${ix}/street1\`,
              value: y_addresses_item.street1,
            })
          }
          if (
            y_addresses_item?.street2 === undefined &&
            x_addresses_item?.street2 !== undefined
          ) {
            diff.push({ type: "remove", path: \`/addresses/\${ix}/street2\` })
          } else if (
            x_addresses_item?.street2 === undefined &&
            y_addresses_item?.street2 !== undefined
          ) {
            diff.push({
              type: "add",
              path: \`/addresses/\${ix}/street2\`,
              value: y_addresses_item?.street2,
            })
          } else if (
            x_addresses_item?.street2 !== undefined &&
            y_addresses_item?.street2 !== undefined
          ) {
            if (x_addresses_item?.street2 !== y_addresses_item?.street2) {
              diff.push({
                type: "replace",
                path: \`/addresses/\${ix}/street2\`,
                value: y_addresses_item?.street2,
              })
            }
          }
          if (x_addresses_item.city !== y_addresses_item.city) {
            diff.push({
              type: "replace",
              path: \`/addresses/\${ix}/city\`,
              value: y_addresses_item.city,
            })
          }
        }
        if (length < x.addresses.length) {
          for (; ix < x.addresses.length; ix++) {
            diff.push({ type: "remove", path: \`/addresses/\${ix}\` })
          }
        }
        if (length < y.addresses.length) {
          for (; ix < y.addresses.length; ix++) {
            diff.push({
              type: "add",
              path: \`/addresses/\${ix}\`,
              value: y.addresses[ix],
            })
          }
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Tuple', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          type: 'array',
          prefixItems: [],
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: [], y: []) {
        let diff = []
        if (x === y) return diff
        if (x.length !== y.length) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          type: 'array',
          prefixItems: [
            { type: 'string' }
          ],
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: [string], y: [string]) {
        let diff = []
        if (x === y) return diff
        if (x[0] !== y[0]) {
          diff.push({ type: "replace", path: "/0", value: y[0] })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          type: 'array',
          prefixItems: [
            { type: 'string' },
            { type: 'number' },
          ],
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: [string, number], y: [string, number]) {
        let diff = []
        if (x === y) return diff
        if (x[0] !== y[0]) {
          diff.push({ type: "replace", path: "/0", value: y[0] })
        }
        if (x[1] !== y[1] && (x[1] === x[1] || y[1] === y[1])) {
          diff.push({ type: "replace", path: "/1", value: y[1] })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          type: 'array',
          prefixItems: [
            {
              type: 'array',
              prefixItems: [
                { type: 'string' },
              ],
            },
            {
              type: 'array',
              prefixItems: [
                {
                  type: 'array',
                  prefixItems: [
                    { type: 'string' },
                    { type: 'number' }
                  ]
                }
              ]
            },
          ],
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(
        x: [[string], [[string, number]]],
        y: [[string], [[string, number]]],
      ) {
        let diff = []
        if (x === y) return diff
        if (x[0][0] !== y[0][0]) {
          diff.push({ type: "replace", path: "/0/0", value: y[0][0] })
        }
        if (x[1][0][0] !== y[1][0][0]) {
          diff.push({ type: "replace", path: "/1/0/0", value: y[1][0][0] })
        }
        if (
          x[1][0][1] !== y[1][0][1] &&
          (x[1][0][1] === x[1][0][1] || y[1][0][1] === y[1][0][1])
        ) {
          diff.push({ type: "replace", path: "/1/0/1", value: y[1][0][1] })
        }
        return diff
      }
      "
    `)
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Union', () => {

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          anyOf: []
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = never
      function diff(x: Type, y: Type) {
        let diff = []
        if (x === y) return diff
        if (!Object.is(x, y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          anyOf: [
            { type: 'string' }
          ]
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = string
      function diff(x: Type, y: Type) {
        let diff = []
        if (x === y) return diff
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          anyOf: [
            { type: 'number' },
            { type: 'string' },
            {
              type: 'array',
              items: {
                type: 'number'
              }
            },
            {
              type: 'object',
              required: ['street1', 'city'],
              properties: {
                street1: { type: 'string' },
                street2: { type: 'string' },
                city: { type: 'string' },
              }
            }
          ]
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | number
        | string
        | Array<number>
        | { street1: string; street2?: string; city: string }
      function diff(x: Type, y: Type) {
        let diff = []
        if (Object.is(x, y)) return diff
        function check(value) {
          return (
            Array.isArray(value) && value.every((value) => Number.isFinite(value))
          )
        }
        function check1(value) {
          return (
            !!value &&
            typeof value === "object" &&
            typeof value.street1 === "string" &&
            (!Object.hasOwn(value, "street2") || typeof value.street2 === "string") &&
            typeof value.city === "string"
          )
        }
        if (typeof x === "number" && typeof y === "number") {
          if (x !== y && (x === x || y === y)) {
            diff.push({ type: "replace", path: "", value: y })
          }
        } else if (typeof x === "string" && typeof y === "string") {
          if (x !== y) {
            diff.push({ type: "replace", path: "", value: y })
          }
        } else if (check(x) && check(y)) {
          const length = Math.min(x.length, y.length)
          let ix = 0
          for (; ix < length; ix++) {
            const x_item = x[ix]
            const y_item = y[ix]
            if (x_item !== y_item && (x_item === x_item || y_item === y_item)) {
              diff.push({ type: "replace", path: \`/\${ix}\`, value: y_item })
            }
          }
          if (length < x.length) {
            for (; ix < x.length; ix++) {
              diff.push({ type: "remove", path: \`/\${ix}\` })
            }
          }
          if (length < y.length) {
            for (; ix < y.length; ix++) {
              diff.push({ type: "add", path: \`/\${ix}\`, value: y[ix] })
            }
          }
        } else if (check1(x) && check1(y)) {
          if (x.street1 !== y.street1) {
            diff.push({ type: "replace", path: "/street1", value: y.street1 })
          }
          if (y?.street2 === undefined && x?.street2 !== undefined) {
            diff.push({ type: "remove", path: "/street2" })
          } else if (x?.street2 === undefined && y?.street2 !== undefined) {
            diff.push({ type: "add", path: "/street2", value: y?.street2 })
          } else if (x?.street2 !== undefined && y?.street2 !== undefined) {
            if (x?.street2 !== y?.street2) {
              diff.push({ type: "replace", path: "/street2", value: y?.street2 })
            }
          }
          if (x.city !== y.city) {
            diff.push({ type: "replace", path: "/city", value: y.city })
          }
        } else {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          anyOf: [
            { type: 'string' }
          ]
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = string
      function diff(x: Type, y: Type) {
        let diff = []
        if (x === y) return diff
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          anyOf: [
            {
              type: 'object',
              required: ['tag', 'onA'],
              properties: {
                tag: { const: 'A' },
                onA: { type: 'number' }
              }
            },
            {
              type: 'object',
              required: ['tag', 'onB'],
              properties: {
                tag: { const: 'B' },
                onB: { type: 'string' }
              }
            },
          ]
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "A"; onA: number } | { tag: "B"; onB: string }
      function diff(x: Type, y: Type) {
        let diff = []
        if (x === y) return diff
        if (x.tag === "A" && y.tag === "A") {
          if (x.tag !== y.tag) {
            diff.push({ type: "replace", path: "/tag", value: y.tag })
          }
          if (x.onA !== y.onA && (x.onA === x.onA || y.onA === y.onA)) {
            diff.push({ type: "replace", path: "/onA", value: y.onA })
          }
        } else if (x.tag === "B" && y.tag === "B") {
          if (x.tag !== y.tag) {
            diff.push({ type: "replace", path: "/tag", value: y.tag })
          }
          if (x.onB !== y.onB) {
            diff.push({ type: "replace", path: "/onB", value: y.onB })
          }
        } else {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Intersection', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          allOf: []
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: unknown, y: unknown) {
        let diff = []
        if (x === y) return diff
        if (!Object.is(x, y)) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          allOf: [
            { type: 'string' }
          ]
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: string, y: string) {
        let diff = []
        if (x === y) return diff
        if (x !== y) {
          diff.push({ type: "replace", path: "", value: y })
        }
        return diff
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        {
          allOf: [
            {
              type: 'object',
              required: ['abc', 'ghi'],
              properties: {
                abc: { type: 'string' },
                def: { type: 'number' },
                ghi: { type: 'integer' },
              }
            },
            {
              type: 'object',
              required: ['jkl', 'pqr'],
              properties: {
                jkl: { type: 'null' },
                def: { type: 'boolean' },
                pqr: {
                  type: 'array',
                  items: { type: 'string' },
                },
              }
            }
          ]
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string; def?: number; ghi: number } & {
        jkl: null
        def?: boolean
        pqr: Array<string>
      }
      function diff(x: Type, y: Type) {
        let diff = []
        if (x === y) return diff
        if (x.abc !== y.abc) {
          diff.push({ type: "replace", path: "/abc", value: y.abc })
        }
        if (y?.def === undefined && x?.def !== undefined) {
          diff.push({ type: "remove", path: "/def" })
        } else if (x?.def === undefined && y?.def !== undefined) {
          diff.push({ type: "add", path: "/def", value: y?.def })
        } else if (x?.def !== undefined && y?.def !== undefined) {
          if (x?.def !== y?.def && (x?.def === x?.def || y?.def === y?.def)) {
            diff.push({ type: "replace", path: "/def", value: y?.def })
          }
        }
        if (x.ghi !== y.ghi && (x.ghi === x.ghi || y.ghi === y.ghi)) {
          diff.push({ type: "replace", path: "/ghi", value: y.ghi })
        }
        if (x.jkl !== y.jkl) {
          diff.push({ type: "replace", path: "/jkl", value: y.jkl })
        }
        if (y?.def === undefined && x?.def !== undefined) {
          diff.push({ type: "remove", path: "/def" })
        } else if (x?.def === undefined && y?.def !== undefined) {
          diff.push({ type: "add", path: "/def", value: y?.def })
        } else if (x?.def !== undefined && y?.def !== undefined) {
          if (x?.def !== y?.def) {
            diff.push({ type: "replace", path: "/def", value: y?.def })
          }
        }
        const length = Math.min(x.pqr.length, y.pqr.length)
        let ix = 0
        for (; ix < length; ix++) {
          const x_pqr_item = x.pqr[ix]
          const y_pqr_item = y.pqr[ix]
          if (x_pqr_item !== y_pqr_item) {
            diff.push({ type: "replace", path: \`/pqr/\${ix}\`, value: y_pqr_item })
          }
        }
        if (length < x.pqr.length) {
          for (; ix < x.pqr.length; ix++) {
            diff.push({ type: "remove", path: \`/pqr/\${ix}\` })
          }
        }
        if (length < y.pqr.length) {
          for (; ix < y.pqr.length; ix++) {
            diff.push({ type: "add", path: \`/pqr/\${ix}\`, value: y.pqr[ix] })
          }
        }
        return diff
      }
      "
    `)
  })

})

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳: JsonSchema.diff', () => {

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Never', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        { not: {} }
      ),
      adapt
    )

    const x_1 = 0 as never
    const y_1 = 1 as never

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Null', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        { type: 'null' }
      ),
      adapt,
    )

    const x_1 = null as never
    const y_1 = undefined as never

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Boolean', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        { type: 'boolean' }
      ),
      adapt
    )

    const x_1 = true
    const y_1 = false

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Integer', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        { type: 'integer' }
      ),
      adapt,
    )

    const x_1 = 0
    const y_1 = 1
    // const y_1 = NaN

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Number', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        { type: 'number' }
      ),
      adapt,
    )

    const x_1 = 0.25
    const y_1 = 1.5

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.String', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        { type: 'string' }
      ),
      adapt,
    )

    const x_1 = ''
    const y_1 = ' '

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Enum', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        { enum: ['A', 'B'] }
      ),
      adapt
    )

    const x_1 = 'A'
    const y_1 = 'B'

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Const', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        { const: null }
      ),
      adapt,
    )

    const x_1 = null
    const y_1 = undefined as never

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )

    const diff_2 = fn.flow(
      JsonSchema.diff(
        { const: 0 }
      ),
      adapt,
    )

    const x_2 = 0
    const y_2 = 1 as never

    vi.assert.deepEqual(
      diff_2(x_2, x_2).sort(sort),
      oracle(x_2, x_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(y_2, y_2).sort(sort),
      oracle(y_2, y_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(x_2, y_2).sort(sort),
      oracle(x_2, y_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(y_2, x_2).sort(sort),
      oracle(y_2, x_2).sort(sort)
    )

    const diff_3 = fn.flow(
      JsonSchema.diff(
        { const: false }
      ),
      adapt,
    )

    const x_3 = false
    const y_3 = true as never

    vi.assert.deepEqual(
      diff_3(x_3, x_3).sort(sort),
      oracle(x_3, x_3).sort(sort)
    )

    vi.assert.deepEqual(
      diff_3(y_3, y_3).sort(sort),
      oracle(y_3, y_3).sort(sort)
    )

    vi.assert.deepEqual(
      diff_3(x_3, y_3).sort(sort),
      oracle(x_3, y_3).sort(sort)
    )

    vi.assert.deepEqual(
      diff_3(y_3, x_3).sort(sort),
      oracle(y_3, x_3).sort(sort)
    )

    const diff_4 = fn.flow(
      JsonSchema.diff(
        { const: [] }
      ),
      adapt,
    )

    const x_4 = [] as []
    const y_4 = 'hi' as never

    vi.assert.deepEqual(
      diff_4(x_4, x_4).sort(sort),
      oracle(x_4, x_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(y_4, y_4).sort(sort),
      oracle(y_4, y_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(x_4, y_4).sort(sort),
      oracle(x_4, y_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(y_4, x_4).sort(sort),
      oracle(y_4, x_4).sort(sort)
    )

    const diff_5 = fn.flow(
      JsonSchema.diff(
        { const: [1] }
      ),
      adapt,
    )

    const x_5 = [1] as [1]
    const y_5 = [2] as never

    vi.assert.deepEqual(
      diff_5(x_5, x_5).sort(sort),
      oracle(x_5, x_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(y_5, y_5).sort(sort),
      oracle(y_5, y_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(x_5, y_5).sort(sort),
      oracle(x_5, y_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(y_5, x_5).sort(sort),
      oracle(y_5, x_5).sort(sort)
    )

    const diff_6 = fn.flow(
      JsonSchema.diff(
        { const: { a: 1 } }
      ),
      adapt,
    )

    const x_6 = { a: 1 } as const
    const y_6 = { a: 2 } as never

    vi.assert.deepEqual(
      diff_6(x_6, x_6).sort(sort),
      oracle(x_6, x_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(y_6, y_6).sort(sort),
      oracle(y_6, y_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(x_6, y_6).sort(sort),
      oracle(x_6, y_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(y_6, x_6).sort(sort),
      oracle(y_6, x_6).sort(sort)
    )

    const diff_7 = fn.flow(
      JsonSchema.diff(
        { const: { a: 1, b: 2 } }
      ),
      adapt,
    )

    const x_7 = { a: 1, b: 2 } as const
    const y_7 = { a: 2, b: 2 } as never

    vi.assert.deepEqual(
      diff_7(x_7, x_7).sort(sort),
      oracle(x_7, x_7).sort(sort)
    )

    vi.assert.deepEqual(
      diff_7(y_7, y_7).sort(sort),
      oracle(y_7, y_7).sort(sort)
    )

    vi.assert.deepEqual(
      diff_7(x_7, y_7).sort(sort),
      oracle(x_7, y_7).sort(sort)
    )

    vi.assert.deepEqual(
      diff_7(y_7, x_7).sort(sort),
      oracle(y_7, x_7).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Array', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        {
          type: 'array',
          items: { type: 'string' }
        }
      ),
      adapt,
    )

    const x_1 = Array.of<string>()
    const y_1 = ['']

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )

  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Record', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        {
          type: 'object',
          additionalProperties: {
            type: 'array',
            items: { type: 'string' }
          },
          patternProperties: {
            abc: { type: 'string' },
            def: { type: 'number' }
          }
        }
      ),
      adapt,
    )

    const x_1 = { abc: 'hey', def: 0, x: [] } as never
    const y_1 = { abc: 'ho', def: 1, x: ['suuuup', ''], y: ['hello', ''] } as never

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Object', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        {
          type: 'object',
          required: ['abc', 'def'],
          properties: {
            abc: { type: 'string' },
            def: { type: 'number' }
          }
        }
      ),
      adapt,
    )

    const x_1 = { abc: 'hey', def: 0 }
    const y_1 = { abc: 'ho', def: 1 }

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Tuple', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        {
          type: 'array',
          prefixItems: [],
        }
      ),
      adapt,
    )

    const x_1: [] = []
    const y_1 = 'hi' as never

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )

    const diff_2 = fn.flow(
      JsonSchema.diff(
        {
          type: 'array',
          prefixItems: [
            { type: 'string' }
          ],
        }
      ),
      adapt,
    )

    const x_2 = ['hey'] as [string]
    const y_2 = ['ho'] as [string]

    vi.assert.deepEqual(
      diff_2(x_2, x_2).sort(sort),
      oracle(x_2, x_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(y_2, y_2).sort(sort),
      oracle(y_2, y_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(x_2, y_2).sort(sort),
      oracle(x_2, y_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(y_2, x_2).sort(sort),
      oracle(y_2, x_2).sort(sort)
    )
  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Union', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        {
          anyOf: [],
        }
      ),
      adapt,
    )

    const x_1 = 0 as never
    const y_1 = 1 as never

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )

    const diff_2 = fn.flow(
      JsonSchema.diff(
        {
          anyOf: [
            { type: 'string' }
          ],
        }
      ),
      adapt,
    )

    const x_2 = 'hey'
    const y_2 = 'ho'

    vi.assert.deepEqual(
      diff_2(x_2, x_2).sort(sort),
      oracle(x_2, x_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(y_2, y_2).sort(sort),
      oracle(y_2, y_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(x_2, y_2).sort(sort),
      oracle(x_2, y_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(y_2, x_2).sort(sort),
      oracle(y_2, x_2).sort(sort)
    )

    const diff_3 = fn.flow(
      JsonSchema.diff(
        {
          anyOf: [
            { type: 'string' },
            { type: 'number' },
          ],
        }
      ),
      adapt,
    )

    const x_3 = 'hey'
    const y_3 = 0

    vi.assert.deepEqual(
      diff_3(x_3, x_3).sort(sort),
      oracle(x_3, x_3).sort(sort)
    )

    vi.assert.deepEqual(
      diff_3(y_3, y_3).sort(sort),
      oracle(y_3, y_3).sort(sort)
    )

    vi.assert.deepEqual(
      diff_3(x_3, y_3).sort(sort),
      oracle(x_3, y_3).sort(sort)
    )

    vi.assert.deepEqual(
      diff_3(y_3, x_3).sort(sort),
      oracle(y_3, x_3).sort(sort)
    )

    const diff_4 = fn.flow(
      JsonSchema.diff(
        {
          anyOf: [
            { type: 'string' },
            { type: 'number' },
            {
              type: 'array',
              items: { type: 'string' }
            },
          ],
        }
      ),
      adapt,
    )

    const x_4 = 'hey'
    const y_4 = 0
    const z_4 = ['hey']

    vi.assert.deepEqual(
      diff_4(x_4, x_4).sort(sort),
      oracle(x_4, x_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(y_4, y_4).sort(sort),
      oracle(y_4, y_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(z_4, z_4).sort(sort),
      oracle(z_4, z_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(x_4, y_4).sort(sort),
      oracle(x_4, y_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(y_4, x_4).sort(sort),
      oracle(y_4, x_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(x_4, z_4).sort(sort),
      oracle(x_4, z_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(z_4, x_4).sort(sort),
      oracle(z_4, x_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(z_4, y_4).sort(sort),
      oracle(z_4, y_4).sort(sort)
    )

    vi.assert.deepEqual(
      diff_4(y_4, z_4).sort(sort),
      oracle(y_4, z_4).sort(sort)
    )

    const diff_5 = fn.flow(
      JsonSchema.diff(
        {
          anyOf: [
            {
              type: 'array',
              items: { type: 'string' }
            },
            {
              type: 'object',
              required: ['abc'],
              properties: {
                abc: { type: 'string' },
                def: { type: 'number' }
              }
            }
          ],
        }
      ),
      adapt,
    )

    const w_5 = ['hey']
    const x_5 = ['ho', 'let\'s', 'go']
    const y_5 = { abc: 'yay' }
    const z_5 = { abc: 'yo', def: 1 }

    vi.assert.deepEqual(
      diff_5(w_5, w_5).sort(sort),
      oracle(w_5, w_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(x_5, x_5).sort(sort),
      oracle(x_5, x_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(y_5, y_5).sort(sort),
      oracle(y_5, y_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(z_5, z_5).sort(sort),
      oracle(z_5, z_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(w_5, x_5).sort(sort),
      oracle(w_5, x_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(x_5, w_5).sort(sort),
      oracle(x_5, w_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(w_5, y_5).sort(sort),
      oracle(w_5, y_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(y_5, w_5).sort(sort),
      oracle(y_5, w_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(w_5, z_5).sort(sort),
      oracle(w_5, z_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(z_5, w_5).sort(sort),
      oracle(z_5, w_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(x_5, y_5).sort(sort),
      oracle(x_5, y_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(y_5, x_5).sort(sort),
      oracle(y_5, x_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(x_5, z_5).sort(sort),
      oracle(x_5, z_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(z_5, x_5).sort(sort),
      oracle(z_5, x_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(z_5, y_5).sort(sort),
      oracle(z_5, y_5).sort(sort)
    )

    vi.assert.deepEqual(
      diff_5(y_5, z_5).sort(sort),
      oracle(y_5, z_5).sort(sort)
    )

    const diff_6 = fn.flow(
      JsonSchema.diff(
        {
          anyOf: [
            {
              type: 'object',
              required: ['tag', 'onA'],
              properties: {
                tag: { const: 'A' },
                onA: { type: 'number' }
              }
            },
            {
              type: 'object',
              required: ['tag', 'onB'],
              properties: {
                tag: { const: 'B' },
                onB: { type: 'string' }
              }
            }
          ],
        }
      ),
      adapt,
    )

    const w_6 = { tag: 'A', onA: 0 } as const
    const x_6 = { tag: 'A', onA: 1 } as const
    const y_6 = { tag: 'B', onB: 'one' } as const
    const z_6 = { tag: 'B', onB: 'two' } as const

    vi.assert.deepEqual(
      diff_6(w_6, w_6).sort(sort),
      oracle(w_6, w_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(x_6, x_6).sort(sort),
      oracle(x_6, x_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(y_6, y_6).sort(sort),
      oracle(y_6, y_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(z_6, z_6).sort(sort),
      oracle(z_6, z_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(w_6, x_6).sort(sort),
      oracle(w_6, x_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(x_6, w_6).sort(sort),
      oracle(x_6, w_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(z_6, y_6).sort(sort),
      oracle(z_6, y_6).sort(sort)
    )

    vi.assert.deepEqual(
      diff_6(y_6, z_6).sort(sort),
      oracle(y_6, z_6).sort(sort)
    )

    vi.expect.soft(
      diff_6(w_6, y_6)
    ).toMatchInlineSnapshot
      (`
      [
        {
          "path": "",
          "type": "update",
          "value": {
            "onB": "one",
            "tag": "B",
          },
        },
      ]
    `)

    vi.expect.soft(
      diff_6(y_6, w_6)
    ).toMatchInlineSnapshot
      (`
      [
        {
          "path": "",
          "type": "update",
          "value": {
            "onA": 0,
            "tag": "A",
          },
        },
      ]
    `)

    vi.expect.soft(
      diff_6(w_6, z_6)
    ).toMatchInlineSnapshot
      (`
      [
        {
          "path": "",
          "type": "update",
          "value": {
            "onB": "two",
            "tag": "B",
          },
        },
      ]
    `)

    vi.expect.soft(
      diff_6(z_6, w_6)
    ).toMatchInlineSnapshot
      (`
      [
        {
          "path": "",
          "type": "update",
          "value": {
            "onA": 0,
            "tag": "A",
          },
        },
      ]
    `)

    vi.expect.soft(
      diff_6(x_6, y_6)
    ).toMatchInlineSnapshot
      (`
      [
        {
          "path": "",
          "type": "update",
          "value": {
            "onB": "one",
            "tag": "B",
          },
        },
      ]
    `)

    vi.expect.soft(
      diff_6(y_6, x_6)
    ).toMatchInlineSnapshot
      (`
      [
        {
          "path": "",
          "type": "update",
          "value": {
            "onA": 1,
            "tag": "A",
          },
        },
      ]
    `)

    vi.expect.soft(
      diff_6(x_6, z_6)
    ).toMatchInlineSnapshot
      (`
      [
        {
          "path": "",
          "type": "update",
          "value": {
            "onB": "two",
            "tag": "B",
          },
        },
      ]
    `)

    vi.expect.soft(
      diff_6(z_6, x_6)
    ).toMatchInlineSnapshot
      (`
      [
        {
          "path": "",
          "type": "update",
          "value": {
            "onA": 1,
            "tag": "A",
          },
        },
      ]
    `)

  })

  vi.test('〖️⛳️〗› ❲JsonSchema.diff❳: JsonSchema.Intersection', () => {
    const diff_1 = fn.flow(
      JsonSchema.diff(
        {
          allOf: [],
        }
      ),
      adapt,
    )

    const x_1 = 0 as never
    const y_1 = 1 as never

    vi.assert.deepEqual(
      diff_1(x_1, x_1).sort(sort),
      oracle(x_1, x_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, y_1).sort(sort),
      oracle(y_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(x_1, y_1).sort(sort),
      oracle(x_1, y_1).sort(sort)
    )

    vi.assert.deepEqual(
      diff_1(y_1, x_1).sort(sort),
      oracle(y_1, x_1).sort(sort)
    )

    const diff_2 = fn.flow(
      JsonSchema.diff(
        {
          allOf: [
            {
              type: 'object',
              required: ['abc'],
              properties: {
                abc: { type: 'integer' },
                def: { type: 'string' },
              }
            },
            {
              type: 'object',
              required: ['ghi'],
              properties: {
                ghi: { type: 'number' },
                jkl: { type: 'boolean' },
              }
            }
          ],
        }
      ),
      adapt,
    )

    const x_2 = { abc: 0, def: '', ghi: 1.1, jkl: false }
    const y_2 = { abc: 1, def: 'hey', ghi: 0.1, jkl: true }

    vi.assert.deepEqual(
      diff_2(x_2, x_2).sort(sort),
      oracle(x_2, x_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(y_2, y_2).sort(sort),
      oracle(y_2, y_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(x_2, y_2).sort(sort),
      oracle(x_2, y_2).sort(sort)
    )

    vi.assert.deepEqual(
      diff_2(y_2, x_2).sort(sort),
      oracle(y_2, x_2).sort(sort)
    )
  })

})
