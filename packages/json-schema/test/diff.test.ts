import * as vi from 'vitest'
import { JsonSchema } from '@traversable/json-schema'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.test('〖️⛳️〗› ❲JsonSchema.diff.writeable❳: JsonSchema.Never', () => {
    vi.expect.soft(format(
      JsonSchema.diff.writeable(
        { not: {} }
      )
    )).toMatchInlineSnapshot
      (`
      "function diff(x: never, y: never) {
        const diff = []
        if (!Object.is(x, y)) {
          diff.push({ type: "update", path: \`/\`, value: y })
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
        const diff = []
        if (x !== y) {
          diff.push({ type: "update", path: \`/\`, value: y })
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
        const diff = []
        if (x !== y) {
          diff.push({ type: "update", path: \`/\`, value: y })
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
        const diff = []
        if (x !== y && (x === x || y === y)) {
          diff.push({ type: "update", path: \`/\`, value: y })
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
        const diff = []
        if (x !== y && (x === x || y === y)) {
          diff.push({ type: "update", path: \`/\`, value: y })
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
        const diff = []
        if (x !== y) {
          diff.push({ type: "update", path: \`/\`, value: y })
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
        const diff = []
        if (x === y) return diff
        const length = Math.min(x.length, y.length)
        let ix = 0
        for (; ix < length; ix++) {
          const x_item = x[ix]
          const y_item = y[ix]
          if (x_item.street1 !== y_item.street1) {
            diff.push({
              type: "update",
              path: \`/\${ix}/street1\`,
              value: y_item.street1,
            })
          }
          if (y_item?.street2 === undefined && x_item?.street2 !== undefined) {
            diff.push({ type: "delete", path: \`/\${ix}/street2\` })
          } else if (x_item?.street2 === undefined && y_item?.street2 !== undefined) {
            diff.push({
              type: "insert",
              path: \`/\${ix}/street2\`,
              value: y_item?.street2,
            })
          } else {
            if (x_item?.street2 !== y_item?.street2) {
              diff.push({
                type: "update",
                path: \`/\${ix}/street2\`,
                value: y_item?.street2,
              })
            }
          }
          if (x_item.city !== y_item.city) {
            diff.push({ type: "update", path: \`/\${ix}/city\`, value: y_item.city })
          }
        }
        if (length < x.length) {
          for (; ix < x.length; ix++) {
            diff.push({ type: "delete", path: \`/\${ix}\` })
          }
        }
        if (length < y.length) {
          for (; ix < y.length; ix++) {
            diff.push({ type: "insert", path: \`/\${ix}\`, value: y[ix] })
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
        const diff = []
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
                  type: "update",
                  path: \`/\${ix}/\${ix1}/\${ix2}\`,
                  value: y_item_item_item,
                })
              }
            }
            if (length2 < x_item_item.length) {
              for (; ix2 < x_item_item.length; ix2++) {
                diff.push({ type: "delete", path: \`/\${ix}/\${ix1}/\${ix2}\` })
              }
            }
            if (length2 < y_item_item.length) {
              for (; ix2 < y_item_item.length; ix2++) {
                diff.push({
                  type: "insert",
                  path: \`/\${ix}/\${ix1}/\${ix2}\`,
                  value: y_item_item[ix2],
                })
              }
            }
          }
          if (length1 < x_item.length) {
            for (; ix1 < x_item.length; ix1++) {
              diff.push({ type: "delete", path: \`/\${ix}/\${ix1}\` })
            }
          }
          if (length1 < y_item.length) {
            for (; ix1 < y_item.length; ix1++) {
              diff.push({ type: "insert", path: \`/\${ix}/\${ix1}\`, value: y_item[ix1] })
            }
          }
        }
        if (length < x.length) {
          for (; ix < x.length; ix++) {
            diff.push({ type: "delete", path: \`/\${ix}\` })
          }
        }
        if (length < y.length) {
          for (; ix < y.length; ix++) {
            diff.push({ type: "insert", path: \`/\${ix}\`, value: y[ix] })
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
        const diff = []
        if (x === y) return diff
        const seen = new Set()
        for (let key in x) {
          seen.add(key)
          if (!(key in y)) {
            diff.push({ type: "delete", path: \`/\${key}\` })
            continue
          }
          if (/abc/.test(key)) {
            if (x[key] !== y[key]) {
              diff.push({ type: "update", path: \`/\${key}\`, value: y[key] })
            }
          } else if (/def/.test(key)) {
            if (x[key] !== y[key] && (x[key] === x[key] || y[key] === y[key])) {
              diff.push({ type: "update", path: \`/\${key}\`, value: y[key] })
            }
          } else {
            const length = Math.min(x[key].length, y[key].length)
            let ix = 0
            for (; ix < length; ix++) {
              const x_key__item = x[key][ix]
              const y_key__item = y[key][ix]
              if (x_key__item !== y_key__item) {
                diff.push({
                  type: "update",
                  path: \`/\${key}/\${ix}\`,
                  value: y_key__item,
                })
              }
            }
            if (length < x[key].length) {
              for (; ix < x[key].length; ix++) {
                diff.push({ type: "delete", path: \`/\${key}/\${ix}\` })
              }
            }
            if (length < y[key].length) {
              for (; ix < y[key].length; ix++) {
                diff.push({
                  type: "insert",
                  path: \`/\${key}/\${ix}\`,
                  value: y[key][ix],
                })
              }
            }
          }
        }
        for (let key in y) {
          if (seen.has(key)) {
            continue
          }
          if (!(key in x)) {
            diff.push({ type: "insert", path: \`/\${key}\`, value: y[key] })
            continue
          }
          if (/abc/.test(key)) {
            if (x[key] !== y[key]) {
              diff.push({ type: "update", path: \`/\${key}\`, value: y[key] })
            }
          } else if (/def/.test(key)) {
            if (x[key] !== y[key] && (x[key] === x[key] || y[key] === y[key])) {
              diff.push({ type: "update", path: \`/\${key}\`, value: y[key] })
            }
          } else {
            const length = Math.min(x[key].length, y[key].length)
            let ix = 0
            for (; ix < length; ix++) {
              const x_key__item = x[key][ix]
              const y_key__item = y[key][ix]
              if (x_key__item !== y_key__item) {
                diff.push({
                  type: "update",
                  path: \`/\${key}/\${ix}\`,
                  value: y_key__item,
                })
              }
            }
            if (length < x[key].length) {
              for (; ix < x[key].length; ix++) {
                diff.push({ type: "delete", path: \`/\${key}/\${ix}\` })
              }
            }
            if (length < y[key].length) {
              for (; ix < y[key].length; ix++) {
                diff.push({
                  type: "insert",
                  path: \`/\${key}/\${ix}\`,
                  value: y[key][ix],
                })
              }
            }
          }
        }
        return diff
      }
      "
    `)

    type Type = Record<string, boolean> & { abc: string; def: number }
    function diff(x: Type, y: Type) {
      let diff = []
      let seen = new Set(['abc', 'def'])

      for (let k in x) {
        seen.add(k)
        if (!(k in y)) {
          diff.push({ type: 'delete', path: `/${k}` })
          continue
        }
        if (/abc/.test(k)) {
          if (x[k] !== y[k]) {
            diff.push({ type: 'update', path: `/${k}`, value: y[k] })
          }
        }
        else if (/def/.test(k)) {
          if (x[k] !== y[k]) {
            diff.push({ type: 'update', path: `/${k}`, value: y[k] })
          }
        }
        else {
          if (x[k] !== y[k]) {
            diff.push({ type: 'update', path: `/${k}`, value: y[k] })
          }
        }
      }

      for (let k in y) {
        if (seen.has(k)) {
          continue
        }

        if (!(k in x)) {
          diff.push({ type: 'insert', path: `/${k}`, value: y[k] })
          continue
        }

        if (/abc/.test(k)) {
          if (x[k] !== y[k]) {
            diff.push({ type: 'update', path: `/${k}`, value: y[k] })
          }
        }
        else if (/def/.test(k)) {
          if (x[k] !== y[k]) {
            diff.push({ type: 'update', path: `/${k}`, value: y[k] })
          }
        }
        else {
          if (x[k] !== y[k]) {
            diff.push({ type: 'update', path: `/${k}`, value: y[k] })
          }
        }
      }
    }

    // function diff3(
    //   x: Record<string, Array<string>> & { abc: string; def: number },
    //   y: Record<string, Array<string>> & { abc: string; def: number },
    // ) {
    //   const diff = []
    //   if (x === y) return true
    //   const x_keys = Object.keys(x)
    //   const y_keys = Object.keys(y)
    //   const length = x_keys.length
    //   if (length !== y_keys.length) return false
    //   for (let ix = 0; ix < length; ix++) {
    //     const key = x_keys[ix]
    //     const x_value = x[key]
    //     const y_value = y[key]
    //     if (/abc/.test(key)) {
    //       if (x_value !== y_value) {
    //         diff.push({ type: "update", path: `/`, value: y_value })
    //       }
    //     }
    //     if (/def/.test(key)) {
    //       if (x_value !== y_value && (x_value === x_value || y_value === y_value)) {
    //         diff.push({ type: "update", path: `/`, value: y_value })
    //       }
    //     }
    //     const length1 = Math.min(x_value.length, y_value.length)
    //     let ix1 = 0
    //     for (; ix1 < length1; ix1++) {
    //       const x_value1_item = x_value[ix1]
    //       const y_value1_item = y_value[ix1]
    //       if (x_value1_item !== y_value1_item) {
    //         diff.push({ type: "update", path: `/${ix1}`, value: y_value1_item })
    //       }
    //     }
    //     if (length1 < x_value.length) {
    //       for (; ix1 < x_value.length; ix1++) {
    //         diff.push({ type: "delete", path: `/${ix1}` })
    //       }
    //     }
    //     if (length1 < y_value.length) {
    //       for (; ix1 < y_value.length; ix1++) {
    //         diff.push({ type: "insert", path: `/${ix1}`, value: y_value[ix1] })
    //       }
    //     }
    //   }
    //   return diff
    // }

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
        const diff = []
        if (x === y) return diff
        if (x.firstName !== y.firstName) {
          diff.push({ type: "update", path: \`/firstName\`, value: y.firstName })
        }
        if (y?.lastName === undefined && x?.lastName !== undefined) {
          diff.push({ type: "delete", path: \`/lastName\` })
        } else if (x?.lastName === undefined && y?.lastName !== undefined) {
          diff.push({ type: "insert", path: \`/lastName\`, value: y?.lastName })
        } else {
          if (x?.lastName !== y?.lastName) {
            diff.push({ type: "update", path: \`/lastName\`, value: y?.lastName })
          }
        }
        const length = Math.min(x.addresses.length, y.addresses.length)
        let ix = 0
        for (; ix < length; ix++) {
          const x_addresses_item = x.addresses[ix]
          const y_addresses_item = y.addresses[ix]
          if (x_addresses_item.street1 !== y_addresses_item.street1) {
            diff.push({
              type: "update",
              path: \`/addresses/\${ix}/street1\`,
              value: y_addresses_item.street1,
            })
          }
          if (
            y_addresses_item?.street2 === undefined &&
            x_addresses_item?.street2 !== undefined
          ) {
            diff.push({ type: "delete", path: \`/addresses/\${ix}/street2\` })
          } else if (
            x_addresses_item?.street2 === undefined &&
            y_addresses_item?.street2 !== undefined
          ) {
            diff.push({
              type: "insert",
              path: \`/addresses/\${ix}/street2\`,
              value: y_addresses_item?.street2,
            })
          } else {
            if (x_addresses_item?.street2 !== y_addresses_item?.street2) {
              diff.push({
                type: "update",
                path: \`/addresses/\${ix}/street2\`,
                value: y_addresses_item?.street2,
              })
            }
          }
          if (x_addresses_item.city !== y_addresses_item.city) {
            diff.push({
              type: "update",
              path: \`/addresses/\${ix}/city\`,
              value: y_addresses_item.city,
            })
          }
        }
        if (length < x.addresses.length) {
          for (; ix < x.addresses.length; ix++) {
            diff.push({ type: "delete", path: \`/addresses/\${ix}\` })
          }
        }
        if (length < y.addresses.length) {
          for (; ix < y.addresses.length; ix++) {
            diff.push({
              type: "insert",
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

})
