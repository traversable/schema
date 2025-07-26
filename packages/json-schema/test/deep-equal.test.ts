import * as vi from 'vitest'
import { JsonSchema } from '@traversable/json-schema'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema❳', () => {
  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Never', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ not: {} })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ enum: [] })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Unknown', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({})
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: unknown, r: unknown) {
        if (Object.is(l, r)) return true
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Null', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ type: 'null' })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: null, r: null) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Boolean', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ type: 'boolean' })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: boolean, r: boolean) {
        if (l === r) return true
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Integer', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ type: 'integer' })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Number', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ type: 'number' })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.String', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ type: 'string' })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: string, r: string) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Enum', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ enum: [] })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ enum: [1] })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: 1, r: 1) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ enum: ["1", false, 2] })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: "1" | false | 2, r: "1" | false | 2) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Const', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ const: true })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: true, r: true) {
        if (l === r) return true
        if (l !== r) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ const: [] })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: [], r: []) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({ const: [true] })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: [true], r: [true]) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        if (l[0] !== r[0]) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable(
        { const: { a: [true] } }
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: { a: [true] }, r: { a: [true] }) {
        if (l === r) return true
        if (l.a !== r.a) {
          const length = l.a.length
          if (length !== r.a.length) return false
          if (l.a[0] !== r.a[0]) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable(
        {
          type: 'object',
          required: [],
          properties: {
            a: { const: [true] }
          }
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a?: [true] }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if ((l?.a === undefined || r?.a === undefined) && l?.a !== r?.a) return false
        if (l?.a !== r?.a) {
          const length = l?.a?.length
          if (length !== r?.a?.length) return false
          if (l?.a?.[0] !== r?.a?.[0]) return false
        }
        return true
      }
      "
    `)

  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Array', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable(
        { type: 'array', items: {} }
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Array<unknown>, r: Array<unknown>) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (!Object.is(l_item, r_item)) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({
        type: 'array',
        items: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(
        l: Array<Array<Array<string>>>,
        r: Array<Array<Array<string>>>,
      ) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          const length1 = l_item.length
          if (length1 !== r_item.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l_item_item = l_item[ix]
            const r_item_item = r_item[ix]
            const length2 = l_item_item.length
            if (length2 !== r_item_item.length) return false
            for (let ix = length2; ix-- !== 0; ) {
              const l_item_item_item = l_item_item[ix]
              const r_item_item_item = r_item_item[ix]
              if (l_item_item_item !== r_item_item_item) return false
            }
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({
        type: 'array',
        items: {
          type: 'object',
          required: ['a'],
          properties: {
            a: {
              type: 'array',
              items: {
                type: 'object',
                required: ['b'],
                properties: {
                  b: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  },
                  c: { type: 'string' }
                }
              }
            },
            d: {
              type: 'array',
              items: {
                type: 'object',
                required: ['f'],
                properties: {
                  e: {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  },
                  f: { type: 'string' }
                }
              }
            }
          }
        }
      }, { typeName: 'Type' }),
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{
        a: Array<{ b: Array<string>; c?: string }>
        d?: Array<{ e?: Array<string>; f: string }>
      }>
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item.a !== r_item.a) {
            const length1 = l_item.a.length
            if (length1 !== r_item.a.length) return false
            for (let ix = length1; ix-- !== 0; ) {
              const l_item_a_item = l_item.a[ix]
              const r_item_a_item = r_item.a[ix]
              if (l_item_a_item.b !== r_item_a_item.b) {
                const length2 = l_item_a_item.b.length
                if (length2 !== r_item_a_item.b.length) return false
                for (let ix = length2; ix-- !== 0; ) {
                  const l_item_a_item_b_item = l_item_a_item.b[ix]
                  const r_item_a_item_b_item = r_item_a_item.b[ix]
                  if (l_item_a_item_b_item !== r_item_a_item_b_item) return false
                }
              }
              if (
                (l_item_a_item?.c === undefined || r_item_a_item?.c === undefined) &&
                l_item_a_item?.c !== r_item_a_item?.c
              )
                return false
              if (l_item_a_item?.c !== r_item_a_item?.c) return false
            }
          }
          if (l_item?.d !== r_item?.d) {
            if (
              (l_item?.d === undefined || r_item?.d === undefined) &&
              l_item?.d !== r_item?.d
            )
              return false
            if (l_item?.d !== r_item?.d) {
              const length3 = l_item?.d?.length
              if (length3 !== r_item?.d?.length) return false
              for (let ix = length3; ix-- !== 0; ) {
                const l_item__d_item = l_item?.d[ix]
                const r_item__d_item = r_item?.d[ix]
                if (l_item__d_item?.e !== r_item__d_item?.e) {
                  if (
                    (l_item__d_item?.e === undefined ||
                      r_item__d_item?.e === undefined) &&
                    l_item__d_item?.e !== r_item__d_item?.e
                  )
                    return false
                  if (l_item__d_item?.e !== r_item__d_item?.e) {
                    const length4 = l_item__d_item?.e?.length
                    if (length4 !== r_item__d_item?.e?.length) return false
                    for (let ix = length4; ix-- !== 0; ) {
                      const l_item__d_item__e_item = l_item__d_item?.e[ix]
                      const r_item__d_item__e_item = r_item__d_item?.e[ix]
                      if (l_item__d_item__e_item !== r_item__d_item__e_item)
                        return false
                    }
                  }
                }
                if (l_item__d_item.f !== r_item__d_item.f) return false
              }
            }
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable(
        {
          type: 'array',
          items: {
            type: 'number'
          }
        }
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Array<number>, r: Array<number>) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item !== r_item && (l_item === l_item || r_item === r_item))
            return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable(
        {
          type: 'array',
          items: {
            type: 'object',
            required: ['c'],
            properties: {
              c: {
                type: 'object',
                required: ['d', 'e'],
                properties: {
                  d: { type: 'string' },
                  e: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{ c: { d: string; e: Array<string> } }>
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item.c !== r_item.c) {
            if (l_item.c.d !== r_item.c.d) return false
            if (l_item.c.e !== r_item.c.e) {
              const length1 = l_item.c.e.length
              if (length1 !== r_item.c.e.length) return false
              for (let ix = length1; ix-- !== 0; ) {
                const l_item_c_e_item = l_item.c.e[ix]
                const r_item_c_e_item = r_item.c.e[ix]
                if (l_item_c_e_item !== r_item_c_e_item) return false
              }
            }
          }
        }
        return true
      }
      "
    `)

  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Tuple', () => {
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Record', () => {
    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({
        type: 'object',
        additionalProperties: {
          type: 'boolean'
        }
      })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Record<string, boolean>, r: Record<string, boolean>) {
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
      JsonSchema.deepEqual.writeable({
        type: 'object',
        patternProperties: { "abc": { type: 'boolean' } },
      }, { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: boolean }
      function deepEqual(l: Type, r: Type) {
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
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Object', () => {

    vi.expect.soft(format(
      JsonSchema.deepEqual.writeable({
        type: 'object',
        required: [],
        properties: {
          a: {
            type: 'boolean'
          }
        }
      })
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: { a?: boolean }, r: { a?: boolean }) {
        if (l === r) return true
        if ((l?.a === undefined || r?.a === undefined) && l?.a !== r?.a) return false
        if (l?.a !== r?.a) {
          if (l?.a !== r?.a) return false
        }
        return true
      }
      "
    `)
  })

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Intersection', () => {
  })

  function equals(l: { V9$_?: "<$\"{hyu" }, r: { V9$_?: "<$\"{hyu" }) {
    if (l === r) return true
    let satisfied = false
    if (l.V9$_ === "<$\"{hyu") {
      if ((l?.V9$_ === undefined || r?.V9$_ === undefined) && l?.V9$_ !== r?.V9$_) return false
      if (l?.V9$_ !== r?.V9$_) {
        if (l?.V9$_ !== r?.V9$_) return false
      }
      satisfied = true
    }
    if (!satisfied) return false
    return true
  }

  vi.it('〖️⛳️〗› ❲JsonSchema.deepEqual.writeable❳: JsonSchema.Union', () => {
    vi.expect.soft(
      JsonSchema.deepEqual.writeable(
        {
          "anyOf": [
            {
              "type": "object",
              "properties": {
                "V9$_": {
                  "const": "<$\"{hyu"
                }
              },
              "required": []
            }
          ]
        }
      )
    ).toMatchInlineSnapshot
      (`
      "function deepEqual (l: { V9$_?: "<$\\"{hyu" }, r: { V9$_?: "<$\\"{hyu" }) {
      if (l === r) return true
      if ((l?.V9$_ === undefined || r?.V9$_ === undefined) && l?.V9$_ !== r?.V9$_) return false
      if (l?.V9$_ !== r?.V9$_) {
      if (l?.V9$_ !== r?.V9$_) return false;
      }
      return true;
      }"
    `)
  })

})

