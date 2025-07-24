import * as vi from 'vitest'
import prettier from '@prettier/sync'
import type { Json } from '@traversable/json'
import { JsonSchema } from '@traversable/json-schema'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

function makeTuple<T extends readonly unknown[], R>(prefixItems: readonly [...T]): JsonSchema.Tuple<T>
function makeTuple<T extends readonly unknown[], R>(prefixItems: readonly [...T], items: R): JsonSchema.Tuple<T, R>
function makeTuple<T extends readonly unknown[], R>(prefixItems: readonly [...T], items?: R) {
  return {
    type: 'array' as const,
    prefixItems,
    items
  }
}

const Schema = {
  never: { not: {} } as JsonSchema.Never,
  unknown: {} as JsonSchema.Unknown,
  null: { type: 'null' as const } as JsonSchema.Null,
  boolean: { type: 'boolean' as const } as JsonSchema.Boolean,
  integer: { type: 'integer' } as JsonSchema.Integer,
  number: { type: 'number' } as JsonSchema.Number,
  string: { type: 'string' as const } as JsonSchema.String,
  enum: (...members: readonly (null | boolean | number | string)[]) => ({ enum: members }) as JsonSchema.Enum,
  const: (value: Json) => ({ const: value }) as JsonSchema.Const,
  union: <T extends readonly unknown[]>(anyOf: T) => ({ anyOf }) as JsonSchema.Union<T[number]>,
  intersection: <T extends readonly unknown[]>(allOf: T) => ({ allOf }) as JsonSchema.Intersection<T[number]>,
  array: <T>(items: T) => ({ type: 'array', items }) as JsonSchema.Array<T>,
  tuple: makeTuple,
  record: <A, P>({ additionalProperties, patternProperties }: { additionalProperties?: A, patternProperties?: { [x: string]: P } }) => ({
    type: 'object',
    ...additionalProperties && { additionalProperties },
    ...patternProperties && { patternProperties },
  }) as JsonSchema.Record<A | P>,
  object: <T>(properties: { [x: string]: T }, required: string[] = []) => ({
    type: 'object',
    required,
    properties,
  }) as JsonSchema.Object<T>
}


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: JsonSchema.deepClone.writeable', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.never', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.never
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.unknown', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.unknown
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: unknown) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.null', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.null
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.boolean', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.boolean
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: boolean) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.integer', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.integer
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.number', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.number
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: number) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.string', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.string
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: string) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.enum', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum('a', 'b')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a" | "b") {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a") {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.enum('a', 'b')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "a" | "b") {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.enum', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(null)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: null) {
        const next = prev
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(0)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: 0) {
        const next = prev
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(-0)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: 0) {
        const next = prev
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(false)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: false) {
        const next = prev
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(true)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: true) {
        const next = prev
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const('')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: "") {
        const next = prev
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: []) {
        const next = new Array()
        return next
      }
      "
    `)


    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const(['hey'])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: ["hey"]) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = prev_0_
        next[0] = next_0_
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const({})
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        const next = Object.create(null)
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.const({
          a: 'hey'
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: { a: "hey" }) {
        const next = Object.create(null)
        const prev_a = prev.a
        const next_a = prev_a
        next.a = next_a
        return next
      }
      "
    `)

  })

  /**
   * @example
   * function clone(prev: Array<number>) {
   *   const length = prev.length
   *   const next = new Array(length)
   *   for (let ix = length; ix-- !== 0; ) {
   *     const prev_item = prev[ix]
   *     const next_item = prev_item
   *     next[ix] = next_item
   *   }
   *   return next
   * }
   */
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.array', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.array(Schema.number)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<number>) {
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          const next_item = prev_item
          next[ix] = next_item
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.array(Schema.array(Schema.number))
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Array<Array<number>>) {
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          const length1 = prev_item.length
          const next_item = new Array(length1)
          for (let ix1 = length1; ix1-- !== 0; ) {
            const prev_item_item = prev_item[ix1]
            const next_item_item = prev_item_item
            next_item[ix1] = next_item_item
          }
          next[ix] = next_item
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.array(
          Schema.object({
            c: Schema.object({
              d: Schema.string,
              e: Schema.array(Schema.string),
            }, ['d', 'e'])
          }, ['c'])
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{ c: { d: string; e: Array<string> } }>
      function deepClone(prev: Type) {
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          const next_item = Object.create(null)
          const prev_item_c = prev_item.c
          const next_item_c = Object.create(null)
          const prev_item_c_d = prev_item_c.d
          const next_item_c_d = prev_item_c_d
          next_item_c.d = next_item_c_d
          const prev_item_c_e = prev_item_c.e
          const length1 = prev_item_c_e.length
          const next_item_c_e = new Array(length1)
          for (let ix1 = length1; ix1-- !== 0; ) {
            const prev_item_c_e_item = prev_item_c_e[ix1]
            const next_item_c_e_item = prev_item_c_e_item
            next_item_c_e[ix1] = next_item_c_e_item
          }
          next_item_c.e = next_item_c_e
          next_item.c = next_item_c
          next[ix] = next_item
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.array(
          Schema.object({
            firstName: Schema.string,
            lastName: Schema.string,
            address: Schema.object({
              street1: Schema.string,
              street2: Schema.string,
              city: Schema.string,
            }, ['street1', 'city'])
          }, ['firstName', 'address'])
        ), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{
        firstName: string
        lastName?: string
        address: { street1: string; street2?: string; city: string }
      }>
      function deepClone(prev: Type) {
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          const next_item = Object.create(null)
          const prev_item_firstName = prev_item.firstName
          const next_item_firstName = prev_item_firstName
          next_item.firstName = next_item_firstName
          const prev_item_lastName = prev_item.lastName
          let next_item_lastName
          if (prev_item_lastName !== undefined) {
            next_item_lastName = prev_item_lastName
            next_item.lastName = next_item_lastName
          }
          const prev_item_address = prev_item.address
          const next_item_address = Object.create(null)
          const prev_item_address_street1 = prev_item_address.street1
          const next_item_address_street1 = prev_item_address_street1
          next_item_address.street1 = next_item_address_street1
          const prev_item_address_street2 = prev_item_address.street2
          let next_item_address_street2
          if (prev_item_address_street2 !== undefined) {
            next_item_address_street2 = prev_item_address_street2
            next_item_address.street2 = next_item_address_street2
          }
          const prev_item_address_city = prev_item_address.city
          const next_item_address_city = prev_item_address_city
          next_item_address.city = next_item_address_city
          next_item.address = next_item_address
          next[ix] = next_item
        }
        return next
      }
      "
    `)
  })

  /**
   * @example
   * type Type = Record<string, { street1: string, street2?: string, city: string }>
   * function clone(prev: Type) {
   *   const next = Object.create(null)
   *   for (let key in prev) {
   *     const prev_value = prev[key]
   *     const next_value = Object.create(null)
   *     next_value.street1 = value.street1
   *     if (prev_value.street2 !== undefined) next_value.street2 = prev_value.street2
   *     next_value.city = prev_value.city
   *     next[key] = newValue
   *   }
   *   return out
   * }
   */
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.record', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.record({ additionalProperties: Schema.record({ additionalProperties: Schema.string }) }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, string>>
      function deepClone(prev: Type) {
        const next = Object.create(null)
        for (let key in prev) {
          const prev_value = prev[key]
          const next_value = Object.create(null)
          for (let key1 in prev_value) {
            const prev_value_value = prev_value[key1]
            const next_value_value = prev_value_value
            next_value[key1] = next_value_value
          }
          next[key] = next_value
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.object({
          a: Schema.record({ additionalProperties: Schema.string }),
          b: Schema.record({
            additionalProperties: Schema.object({
              c: Schema.object({
                d: Schema.string,
                e: Schema.record({
                  additionalProperties: Schema.array(Schema.string)
                })
              }, ['d', 'e'])
            }, ['c'])
          })
        }, ['a', 'b']), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: Record<string, string>
        b: Record<string, { c: { d: string; e: Record<string, Array<string>> } }>
      }
      function deepClone(prev: Type) {
        const next = Object.create(null)
        const prev_a = prev.a
        const next_a = Object.create(null)
        for (let key in prev_a) {
          const prev_a_value = prev_a[key]
          const next_a_value = prev_a_value
          next_a[key] = next_a_value
        }
        next.a = next_a
        const prev_b = prev.b
        const next_b = Object.create(null)
        for (let key1 in prev_b) {
          const prev_b_value = prev_b[key1]
          const next_b_value = Object.create(null)
          const prev_b_value_c = prev_b_value.c
          const next_b_value_c = Object.create(null)
          const prev_b_value_c_d = prev_b_value_c.d
          const next_b_value_c_d = prev_b_value_c_d
          next_b_value_c.d = next_b_value_c_d
          const prev_b_value_c_e = prev_b_value_c.e
          const next_b_value_c_e = Object.create(null)
          for (let key2 in prev_b_value_c_e) {
            const prev_b_value_c_e_value = prev_b_value_c_e[key2]
            const length = prev_b_value_c_e_value.length
            const next_b_value_c_e_value = new Array(length)
            for (let ix = length; ix-- !== 0; ) {
              const prev_b_value_c_e_value_item = prev_b_value_c_e_value[ix]
              const next_b_value_c_e_value_item = prev_b_value_c_e_value_item
              next_b_value_c_e_value[ix] = next_b_value_c_e_value_item
            }
            next_b_value_c_e[key2] = next_b_value_c_e_value
          }
          next_b_value_c.e = next_b_value_c_e
          next_b_value.c = next_b_value_c
          next_b[key1] = next_b_value
        }
        next.b = next_b
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.record({
          patternProperties: {
            abc: Schema.string,
            def: Schema.array(Schema.string),
          }
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: Record<"abc" | "def", string | Array<string>>) {
        const next = Object.create(null)
        for (let key in prev) {
          const prev_value = prev[key]
          let next_value
          if (/abc/.test(key)) {
            next_value = prev_value
          } else if (/def/.test(key)) {
            const length = prev_value.length
            next_value = new Array(length)
            for (let ix = length; ix-- !== 0; ) {
              const prev_value_item = prev_value[ix]
              const next_value_item = prev_value_item
              next_value[ix] = next_value_item
            }
          }
          next[key] = next_value
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.record({
          additionalProperties: { type: 'string' },
          patternProperties: {
            abc: Schema.string,
            def: Schema.array(Schema.string),
          }
        })
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(
        prev: Record<string, string> & Record<"abc" | "def", string | Array<string>>,
      ) {
        const next = Object.create(null)
        for (let key in prev) {
          const prev_value = prev[key]
          let next_value
          if (/abc/.test(key)) {
            next_value = prev_value
          } else if (/def/.test(key)) {
            const length = prev_value.length
            next_value = new Array(length)
            for (let ix = length; ix-- !== 0; ) {
              const prev_value_item = prev_value[ix]
              const next_value_item = prev_value_item
              next_value[ix] = next_value_item
            }
          } else {
            next_value = prev_value
          }
          next[key] = next_value
        }
        return next
      }
      "
    `)

  })

  /**
   * @example
   * type Type = [
   *   { street1: string, street2?: string, city: string },
   *   { street1: string, street2?: string, city: string }
   * ]
   * function clone(prev: Type) {
   *   const next = new Array(prev.length)
   *   const prev_0 = prev[0]
   *   const next_0 = Object.create(null)
   *   next_0.street1 = prev_0.street1
   *   if (prev_0.street2 !== undefined) {
   *     next_0.street2 = prev_0.street2
   *   }
   *   next_0.city = prev_0.city
   *   next[0] = next_0
   *   const prev_1 = prev[1]
   *   const next_1 = Object.create(null)
   *   next_1.street1 = prev_1.street1
   *   if (prev_1.street2 !== undefined) {
   *     next_1.street2 = prev_1.street2
   *   }
   *   next_1.city = prev_1.city
   *   next[1] = next_1
   *   return next
   * }
   */
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.tuple', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(Schema.tuple([]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function deepClone(prev: Type) {
        const next = new Array()
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(Schema.tuple([Schema.string, Schema.string]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function deepClone(prev: Type) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = prev_0_
        const prev_1_ = prev[1]
        const next_1_ = prev_1_
        next[0] = next_0_
        next[1] = next_1_
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple([
          Schema.number,
          Schema.tuple([
            Schema.object({ a: Schema.boolean }, [])
          ])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [number, [{ a?: boolean }]]
      function deepClone(prev: Type) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = prev_0_
        const prev_1_ = prev[1]
        const next_1_ = new Array(prev_1_.length)
        const prev____0_ = prev_1_[0]
        const next____0_ = Object.create(null)
        const prev_______a = prev____0_.a
        let next_______a
        if (prev_______a !== undefined) {
          next_______a = prev_______a
          next____0_.a = next_______a
        }
        next_1_[0] = next____0_
        next[0] = next_0_
        next[1] = next_1_
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(Schema.object({
        a: Schema.tuple([Schema.string, Schema.string]),
        b: Schema.tuple([Schema.string, Schema.tuple([Schema.string])]),
      }, ['a']), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: [string, string]; b?: [string, [string]] }
      function deepClone(prev: Type) {
        const next = Object.create(null)
        const prev_a = prev.a
        const next_a = new Array(prev_a.length)
        const prev_a_0_ = prev_a[0]
        const next_a_0_ = prev_a_0_
        const prev_a_1_ = prev_a[1]
        const next_a_1_ = prev_a_1_
        next_a[0] = next_a_0_
        next_a[1] = next_a_1_
        next.a = next_a
        const prev_b = prev.b
        let next_b
        if (prev_b !== undefined) {
          next_b = new Array(prev_b.length)
          const prev_b_0_ = prev_b[0]
          const next_b_0_ = prev_b_0_
          const prev_b_1_ = prev_b[1]
          const next_b_1_ = new Array(prev_b_1_.length)
          const prev_b____0_ = prev_b_1_[0]
          const next_b____0_ = prev_b____0_
          next_b_1_[0] = next_b____0_
          next_b[0] = next_b_0_
          next_b[1] = next_b_1_
          next.b = next_b
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple([
          Schema.object({
            A: Schema.boolean
          }, []),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: boolean }]
      function deepClone(prev: Type) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = Object.create(null)
        const prev____A = prev_0_.A
        let next____A
        if (prev____A !== undefined) {
          next____A = prev____A
          next_0_.A = next____A
        }
        next[0] = next_0_
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple([
          Schema.object({
            A: Schema.tuple([
              Schema.object({
                B: Schema.boolean
              }, [])
            ])
          }, [])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: [{ B?: boolean }] }]
      function deepClone(prev: Type) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = Object.create(null)
        const prev____A = prev_0_.A
        let next____A
        if (prev____A !== undefined) {
          next____A = new Array(prev____A.length)
          const prev____A_0_ = prev____A[0]
          const next____A_0_ = Object.create(null)
          const prev____A____B = prev____A_0_.B
          let next____A____B
          if (prev____A____B !== undefined) {
            next____A____B = prev____A____B
            next____A_0_.B = next____A____B
          }
          next____A[0] = next____A_0_
          next_0_.A = next____A
        }
        next[0] = next_0_
        return next
      }
      "
    `)
  })

  /**
   * @example
   * type Type = [
   *   { street1: string, street2?: string, city: string },
   *   { street1: string, street2?: string, city: string },
   *   ...string[],
   * ]
   * function clone(prev: Type) {
   *   const next = new Array(prev.length)
   *   const prev_0 = prev[0]
   *   const next_0 = Object.create(null)
   *   next_0.street1 = prev_0.street1
   *   if (prev_0.street2 !== undefined) {
   *     next_0.street2 = prev_0.street2
   *   }
   *   next_0.city = prev_0.city
   *   next[0] = next_0
   *   const prev_1 = prev[1]
   *   const next_1 = Object.create(null)
   *   next_1.street1 = prev_1.street1
   *   if (prev_1.street2 !== undefined) {
   *     next_1.street2 = prev_1.street2
   *   }
   *   next_1.city = prev_1.city
   *   next[1] = next_1
   *   const length = prev.length
   *   for (let ix = 2; ix < length; ix++) {
   *     const prev_item = prev[ix]
   *     const next_item = prev_item
   *     next[ix] = next_item
   *   }
   *   return next
   * }
   */
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.tuple w/ rest', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(Schema.tuple([Schema.string, Schema.string], Schema.number), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string, ...number[]]
      function deepClone(prev: Type) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = prev_0_
        const prev_1_ = prev[1]
        const next_1_ = prev_1_
        next[0] = next_0_
        next[1] = next_1_
        const length = prev.length
        for (let ix = 2; ix < length; ix++) {
          const prev_item = prev[ix]
          const next_item = prev_item
          next[ix] = next_item
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple(
          [Schema.boolean, Schema.string, Schema.integer],
          Schema.array(Schema.number)
        )
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [boolean, string, number, ...Array<number>[]]) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = prev_0_
        const prev_1_ = prev[1]
        const next_1_ = prev_1_
        const prev_2_ = prev[2]
        const next_2_ = prev_2_
        next[0] = next_0_
        next[1] = next_1_
        next[2] = next_2_
        const length = prev.length
        for (let ix = 3; ix < length; ix++) {
          const prev_item = prev[ix]
          const length1 = prev_item.length
          const next_item = new Array(length1)
          for (let ix1 = length1; ix1-- !== 0; ) {
            const prev_item_item = prev_item[ix1]
            const next_item_item = prev_item_item
            next_item[ix1] = next_item_item
          }
          next[ix] = next_item
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple([Schema.tuple([Schema.boolean], Schema.boolean)], Schema.boolean)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: [[boolean, ...boolean[]], ...boolean[]]) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = new Array(prev_0_.length)
        const prev____0_ = prev_0_[0]
        const next____0_ = prev____0_
        next_0_[0] = next____0_
        const length1 = prev_0_.length
        for (let ix1 = 1; ix1 < length1; ix1++) {
          const prev____item = prev_0_[ix1]
          const next____item = prev____item
          next_0_[ix1] = next____item
        }
        next[0] = next_0_
        const length = prev.length
        for (let ix = 1; ix < length; ix++) {
          const prev_item = prev[ix]
          const next_item = prev_item
          next[ix] = next_item
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.tuple(
          [
            Schema.object({
              a: Schema.tuple(
                [
                  Schema.object({
                    b: Schema.tuple(
                      [
                        Schema.object({
                          c: Schema.tuple(
                            [
                              Schema.object({
                                d: Schema.string,
                              })
                            ],
                            Schema.object({
                              E: Schema.tuple(
                                [
                                  Schema.string,
                                ], Schema.object({
                                  F: Schema.string,
                                })
                              )
                            })
                          ),
                        })
                      ],
                      Schema.object({
                        G: Schema.string
                      })
                    )
                  })
                ], Schema.object({
                  G: Schema.string
                })
              )
            })
          ],
          Schema.object({
            H: Schema.tuple([Schema.string], Schema.object({
              I: Schema.string,
            }))
          })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [
        {
          a?: [
            {
              b?: [
                { c?: [{ d?: string }, ...{ E?: [string, ...{ F?: string }[]] }[]] },
                ...{ G?: string }[],
              ]
            },
            ...{ G?: string }[],
          ]
        },
        ...{ H?: [string, ...{ I?: string }[]] }[],
      ]
      function deepClone(prev: Type) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = Object.create(null)
        const prev____a = prev_0_.a
        let next____a
        if (prev____a !== undefined) {
          next____a = new Array(prev____a.length)
          const prev____a_0_ = prev____a[0]
          const next____a_0_ = Object.create(null)
          const prev____a____b = prev____a_0_.b
          let next____a____b
          if (prev____a____b !== undefined) {
            next____a____b = new Array(prev____a____b.length)
            const prev____a____b_0_ = prev____a____b[0]
            const next____a____b_0_ = Object.create(null)
            const prev____a____b____c = prev____a____b_0_.c
            let next____a____b____c
            if (prev____a____b____c !== undefined) {
              next____a____b____c = new Array(prev____a____b____c.length)
              const prev____a____b____c_0_ = prev____a____b____c[0]
              const next____a____b____c_0_ = Object.create(null)
              const prev____a____b____c____d = prev____a____b____c_0_.d
              let next____a____b____c____d
              if (prev____a____b____c____d !== undefined) {
                next____a____b____c____d = prev____a____b____c____d
                next____a____b____c_0_.d = next____a____b____c____d
              }
              next____a____b____c[0] = next____a____b____c_0_
              const length4 = prev____a____b____c.length
              for (let ix4 = 1; ix4 < length4; ix4++) {
                const prev____a____b____c_item = prev____a____b____c[ix4]
                const next____a____b____c_item = Object.create(null)
                const prev____a____b____c_item_E = prev____a____b____c_item.E
                let next____a____b____c_item_E
                if (prev____a____b____c_item_E !== undefined) {
                  next____a____b____c_item_E = new Array(
                    prev____a____b____c_item_E.length,
                  )
                  const prev____a____b____c_item_E_0_ = prev____a____b____c_item_E[0]
                  const next____a____b____c_item_E_0_ = prev____a____b____c_item_E_0_
                  next____a____b____c_item_E[0] = next____a____b____c_item_E_0_
                  const length5 = prev____a____b____c_item_E.length
                  for (let ix5 = 1; ix5 < length5; ix5++) {
                    const prev____a____b____c_item_E_item =
                      prev____a____b____c_item_E[ix5]
                    const next____a____b____c_item_E_item = Object.create(null)
                    const prev____a____b____c_item_E_item_F =
                      prev____a____b____c_item_E_item.F
                    let next____a____b____c_item_E_item_F
                    if (prev____a____b____c_item_E_item_F !== undefined) {
                      next____a____b____c_item_E_item_F =
                        prev____a____b____c_item_E_item_F
                      next____a____b____c_item_E_item.F =
                        next____a____b____c_item_E_item_F
                    }
                    next____a____b____c_item_E[ix5] = next____a____b____c_item_E_item
                  }
                  next____a____b____c_item.E = next____a____b____c_item_E
                }
                next____a____b____c[ix4] = next____a____b____c_item
              }
              next____a____b_0_.c = next____a____b____c
            }
            next____a____b[0] = next____a____b_0_
            const length3 = prev____a____b.length
            for (let ix3 = 1; ix3 < length3; ix3++) {
              const prev____a____b_item = prev____a____b[ix3]
              const next____a____b_item = Object.create(null)
              const prev____a____b_item_G = prev____a____b_item.G
              let next____a____b_item_G
              if (prev____a____b_item_G !== undefined) {
                next____a____b_item_G = prev____a____b_item_G
                next____a____b_item.G = next____a____b_item_G
              }
              next____a____b[ix3] = next____a____b_item
            }
            next____a_0_.b = next____a____b
          }
          next____a[0] = next____a_0_
          const length2 = prev____a.length
          for (let ix2 = 1; ix2 < length2; ix2++) {
            const prev____a_item = prev____a[ix2]
            const next____a_item = Object.create(null)
            const prev____a_item_G = prev____a_item.G
            let next____a_item_G
            if (prev____a_item_G !== undefined) {
              next____a_item_G = prev____a_item_G
              next____a_item.G = next____a_item_G
            }
            next____a[ix2] = next____a_item
          }
          next_0_.a = next____a
        }
        next[0] = next_0_
        const length = prev.length
        for (let ix = 1; ix < length; ix++) {
          const prev_item = prev[ix]
          const next_item = Object.create(null)
          const prev_item_H = prev_item.H
          let next_item_H
          if (prev_item_H !== undefined) {
            next_item_H = new Array(prev_item_H.length)
            const prev_item_H_0_ = prev_item_H[0]
            const next_item_H_0_ = prev_item_H_0_
            next_item_H[0] = next_item_H_0_
            const length1 = prev_item_H.length
            for (let ix1 = 1; ix1 < length1; ix1++) {
              const prev_item_H_item = prev_item_H[ix1]
              const next_item_H_item = Object.create(null)
              const prev_item_H_item_I = prev_item_H_item.I
              let next_item_H_item_I
              if (prev_item_H_item_I !== undefined) {
                next_item_H_item_I = prev_item_H_item_I
                next_item_H_item.I = next_item_H_item_I
              }
              next_item_H[ix1] = next_item_H_item
            }
            next_item.H = next_item_H
          }
          next[ix] = next_item
        }
        return next
      }
      "
    `)
  })

  /**
   * @example
   * type Type = { a: Array<{ b: Array<{ c: Array<{ d: string }> }> }> }
   * function clone(prev: Type) {
   *   const next = Object.create(null)
   *   const prev_b = prev.b                 
   *   const length = prev_b.length
   *   const next_b = new Array(length)      
   *   for (let ix = length; ix-- !== 0; ) {
   *     const prev_b_ix = prev_b[ix]
   *     const next_b_ix = Object.create(null)
   *     const prev_b_ix_c = prev_b_ix.c
   *     const length1 = prev_b_ix_c.length
   *     const next_b_ix_c = new Array(length1)
   *     for (let ix1 = length1; ix1-- !== 0; ) {
   *       const prev_b_ix_c_ix = prev_b_ix_c[ix1]
   *       const next_b_ix_c_ix = Object.create(null)
   *       const prev_b_ix_c_ix_d = prev_b_ix_c_ix.d
   *       next_b_ix_c_ix.d = prev_b_ix_c_ix_d
   *       next_b_ix_c[ix1] = next_b_ix_c_ix
   *     }
   *     next_b_ix.c = next_b_ix_c
   *     next_b[ix1] = next_b_ix
   *   }
   *   next.b = next_b
   *   return next
   * }
   */
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.object', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(Schema.object({}))
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: {}) {
        const next = Object.create(null)
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(Schema.object({
        street1: Schema.string,
        street2: Schema.string,
        city: Schema.string,
      }, ['street1', 'city']), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: string; city: string }
      function deepClone(prev: Type) {
        const next = Object.create(null)
        const prev_street1 = prev.street1
        const next_street1 = prev_street1
        next.street1 = next_street1
        const prev_street2 = prev.street2
        let next_street2
        if (prev_street2 !== undefined) {
          next_street2 = prev_street2
          next.street2 = next_street2
        }
        const prev_city = prev.city
        const next_city = prev_city
        next.city = next_city
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.object({
          a: Schema.object({
            b: Schema.string,
            c: Schema.string,
          }, ['b', 'c']),
          d: Schema.string,
          e: Schema.object({
            f: Schema.string,
            g: Schema.object({
              h: Schema.string,
              i: Schema.string,
            }, ['h', 'i'])
          }, ['f'])
        }, ['a', 'e']),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: { b: string; c: string }
        d?: string
        e: { f: string; g?: { h: string; i: string } }
      }
      function deepClone(prev: Type) {
        const next = Object.create(null)
        const prev_a = prev.a
        const next_a = Object.create(null)
        const prev_a_b = prev_a.b
        const next_a_b = prev_a_b
        next_a.b = next_a_b
        const prev_a_c = prev_a.c
        const next_a_c = prev_a_c
        next_a.c = next_a_c
        next.a = next_a
        const prev_d = prev.d
        let next_d
        if (prev_d !== undefined) {
          next_d = prev_d
          next.d = next_d
        }
        const prev_e = prev.e
        const next_e = Object.create(null)
        const prev_e_f = prev_e.f
        const next_e_f = prev_e_f
        next_e.f = next_e_f
        const prev_e_g = prev_e.g
        let next_e_g
        if (prev_e_g !== undefined) {
          next_e_g = Object.create(null)
          const prev_e_g_h = prev_e_g.h
          const next_e_g_h = prev_e_g_h
          next_e_g.h = next_e_g_h
          const prev_e_g_i = prev_e_g.i
          const next_e_g_i = prev_e_g_i
          next_e_g.i = next_e_g_i
          next_e.g = next_e_g
        }
        next.e = next_e
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.object({
          b: Schema.array(
            Schema.object({
              c: Schema.array(
                Schema.object({
                  d: Schema.string
                }, ['d'])
              ),
            }, ['c'])
          )
        }, ['b']), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { b: Array<{ c: Array<{ d: string }> }> }
      function deepClone(prev: Type) {
        const next = Object.create(null)
        const prev_b = prev.b
        const length = prev_b.length
        const next_b = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_b_item = prev_b[ix]
          const next_b_item = Object.create(null)
          const prev_b_item_c = prev_b_item.c
          const length1 = prev_b_item_c.length
          const next_b_item_c = new Array(length1)
          for (let ix1 = length1; ix1-- !== 0; ) {
            const prev_b_item_c_item = prev_b_item_c[ix1]
            const next_b_item_c_item = Object.create(null)
            const prev_b_item_c_item_d = prev_b_item_c_item.d
            const next_b_item_c_item_d = prev_b_item_c_item_d
            next_b_item_c_item.d = next_b_item_c_item_d
            next_b_item_c[ix1] = next_b_item_c_item
          }
          next_b_item.c = next_b_item_c
          next_b[ix] = next_b_item
        }
        next.b = next_b
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(Schema.object({
        b: Schema.array(Schema.string),
        '0b': Schema.array(Schema.string),
        '00b': Schema.array(Schema.string),
        '-00b': Schema.array(Schema.string),
        '00b0': Schema.array(Schema.string),
        '--00b0': Schema.array(Schema.string),
        '-^00b0': Schema.array(Schema.string),
        '': Schema.array(Schema.string),
        '_': Schema.array(Schema.string),
      }, ['b', '0b', '00b', '-00b', '00b0', '--00b0', '-^00b0', '', '_']),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        b: Array<string>
        "0b": Array<string>
        "00b": Array<string>
        "-00b": Array<string>
        "00b0": Array<string>
        "--00b0": Array<string>
        "-^00b0": Array<string>
        "": Array<string>
        _: Array<string>
      }
      function deepClone(prev: Type) {
        const next = Object.create(null)
        const prev_b = prev.b
        const length = prev_b.length
        const next_b = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_b_item = prev_b[ix]
          const next_b_item = prev_b_item
          next_b[ix] = next_b_item
        }
        next.b = next_b
        const prev__0b__ = prev["0b"]
        const length1 = prev__0b__.length
        const next__0b__ = new Array(length1)
        for (let ix1 = length1; ix1-- !== 0; ) {
          const prev___b___item = prev__0b__[ix1]
          const next___b___item = prev___b___item
          next__0b__[ix1] = next___b___item
        }
        next["0b"] = next__0b__
        const prev__00b__ = prev["00b"]
        const length2 = prev__00b__.length
        const next__00b__ = new Array(length2)
        for (let ix2 = length2; ix2-- !== 0; ) {
          const prev___0b___item = prev__00b__[ix2]
          const next___0b___item = prev___0b___item
          next__00b__[ix2] = next___0b___item
        }
        next["00b"] = next__00b__
        const prev___00b__ = prev["-00b"]
        const length3 = prev___00b__.length
        const next___00b__ = new Array(length3)
        for (let ix3 = length3; ix3-- !== 0; ) {
          const prev____0b___item = prev___00b__[ix3]
          const next____0b___item = prev____0b___item
          next___00b__[ix3] = next____0b___item
        }
        next["-00b"] = next___00b__
        const prev__00b0__ = prev["00b0"]
        const length4 = prev__00b0__.length
        const next__00b0__ = new Array(length4)
        for (let ix4 = length4; ix4-- !== 0; ) {
          const prev___0b0___item = prev__00b0__[ix4]
          const next___0b0___item = prev___0b0___item
          next__00b0__[ix4] = next___0b0___item
        }
        next["00b0"] = next__00b0__
        const prev____00b0__ = prev["--00b0"]
        const length5 = prev____00b0__.length
        const next____00b0__ = new Array(length5)
        for (let ix5 = length5; ix5-- !== 0; ) {
          const prev_____0b0___item = prev____00b0__[ix5]
          const next_____0b0___item = prev_____0b0___item
          next____00b0__[ix5] = next_____0b0___item
        }
        next["--00b0"] = next____00b0__
        const prev____00b0__1 = prev["-^00b0"]
        const length6 = prev____00b0__1.length
        const next____00b0__1 = new Array(length6)
        for (let ix6 = length6; ix6-- !== 0; ) {
          const prev_____0b0__1_item = prev____00b0__1[ix6]
          const next_____0b0__1_item = prev_____0b0__1_item
          next____00b0__1[ix6] = next_____0b0__1_item
        }
        next["-^00b0"] = next____00b0__1
        const prev____ = prev[""]
        const length7 = prev____.length
        const next____ = new Array(length7)
        for (let ix7 = length7; ix7-- !== 0; ) {
          const prev_____item = prev____[ix7]
          const next_____item = prev_____item
          next____[ix7] = next_____item
        }
        next[""] = next____
        const prev__ = prev._
        const length8 = prev__.length
        const next__ = new Array(length8)
        for (let ix8 = length8; ix8-- !== 0; ) {
          const prev___item = prev__[ix8]
          const next___item = prev___item
          next__[ix8] = next___item
        }
        next._ = next__
        return next
      }
      "
    `)
  })

  /**
   * @example
   * type Type = { street1: string, street2?: string, city: string } & { postalCode?: string }
   * function clone(prev: Type) {
   *   const next = Object.create(null)
   *   next.street1 = prev.street1
   *   if (prev.street2 !== undefined) next.street2 = prev.street2
   *   next.city = prev.city
   *   if (prev.postalCode !== undefined) next.postalCode = prev.postalCode
   *   return next
   * }
   */
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.intersection', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.intersection([
          Schema.object({
            abc: Schema.string
          }, ['abc']),
          Schema.object({
            def: Schema.string
          }, ['def'])
        ]), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string } & { def: string }
      function deepClone(prev: Type) {
        const next = Object.create(null)
        const prev_abc = prev.abc
        const next_abc = prev_abc
        next.abc = next_abc
        const prev_def = prev.def
        const next_def = prev_def
        next.def = next_def
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.intersection([
          Schema.object({
            abc: Schema.string,
            def: Schema.object({
              ghi: Schema.string,
              jkl: Schema.string
            }, ['ghi', 'jkl'])
          }, ['abc', 'def']),
          Schema.object({
            mno: Schema.string,
            pqr: Schema.object({
              stu: Schema.string,
              vwx: Schema.string,
            }, ['stu', 'vwx'])
          }, ['mno', 'pqr'])
        ]), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string; def: { ghi: string; jkl: string } } & {
        mno: string
        pqr: { stu: string; vwx: string }
      }
      function deepClone(prev: Type) {
        const next = Object.create(null)
        const prev_abc = prev.abc
        const next_abc = prev_abc
        next.abc = next_abc
        const prev_def = prev.def
        const next_def = Object.create(null)
        const prev_def_ghi = prev_def.ghi
        const next_def_ghi = prev_def_ghi
        next_def.ghi = next_def_ghi
        const prev_def_jkl = prev_def.jkl
        const next_def_jkl = prev_def_jkl
        next_def.jkl = next_def_jkl
        next.def = next_def
        const prev_mno = prev.mno
        const next_mno = prev_mno
        next.mno = next_mno
        const prev_pqr = prev.pqr
        const next_pqr = Object.create(null)
        const prev_pqr_stu = prev_pqr.stu
        const next_pqr_stu = prev_pqr_stu
        next_pqr.stu = next_pqr_stu
        const prev_pqr_vwx = prev_pqr.vwx
        const next_pqr_vwx = prev_pqr_vwx
        next_pqr.vwx = next_pqr_vwx
        next.pqr = next_pqr
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.null,
          Schema.intersection([
            Schema.object({
              a: Schema.string
            }, ['a']),
            Schema.object({
              b: Schema.string
            }, ['b'])
          ])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = null | ({ a: string } & { b: string })
      function deepClone(prev: Type) {
        let next
        function check(value) {
          return value === null
        }
        if (check(prev)) {
          next = prev
        }
        function check1(value) {
          return (
            !!value &&
            typeof value === "object" &&
            typeof value.a === "string" &&
            !!value &&
            typeof value === "object" &&
            typeof value.b === "string"
          )
        }
        if (check1(prev)) {
          next = Object.create(null)
          const prev_a = prev.a
          const next_a = prev_a
          next.a = next_a
          const prev_b = prev.b
          const next_b = prev_b
          next.b = next_b
        }
        return next
      }
      "
    `)
  })

  /**
   * @example
   * type Type = number | { street1: string, street2?: string, city: string }
   * function clone(prev: Type) {
   *   if (typeof prev === 'number') {
   *     return prev
   *   }
   *   const next = Object.create(null)
   *   next.street1 = prev.street1
   *   if (prev.street2 !== undefined) next.street2 = prev.street2
   *   next.city = prev.city
   *   return next
   * }
   */
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone.writeable❳: Schema.union', () => {
    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(prev: never) {
        const next = undefined
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.const('A'),
            onA: Schema.string,
          }, ['tag', 'onA']),
          Schema.object({
            tag: Schema.const('B'),
            onB: Schema.string,
          }, ['tag', 'onB']),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepClone(
        prev: { tag: "A"; onA: string } | { tag: "B"; onB: string },
      ) {
        let next
        if (prev.tag === "A") {
          next = Object.create(null)
          const prev_tag = prev.tag
          const next_tag = prev_tag
          next.tag = next_tag
          const prev_onA = prev.onA
          const next_onA = prev_onA
          next.onA = next_onA
        }
        if (prev.tag === "B") {
          next = Object.create(null)
          const prev_tag1 = prev.tag
          const next_tag1 = prev_tag1
          next.tag = next_tag1
          const prev_onB = prev.onB
          const next_onB = prev_onB
          next.onB = next_onB
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.number,
          Schema.object({
            street1: Schema.string,
            street2: Schema.string,
            city: Schema.string
          }, ['street1', 'city'])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = number | { street1: string; street2?: string; city: string }
      function deepClone(prev: Type) {
        let next
        if (typeof prev === "number") {
          next = prev
        }
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            typeof value.street1 === "string" &&
            (!Object.hasOwn(value, "street2") || typeof value.street2 === "string") &&
            typeof value.city === "string"
          )
        }
        if (check(prev)) {
          next = Object.create(null)
          const prev_street1 = prev.street1
          const next_street1 = prev_street1
          next.street1 = next_street1
          const prev_street2 = prev.street2
          let next_street2
          if (prev_street2 !== undefined) {
            next_street2 = prev_street2
            next.street2 = next_street2
          }
          const prev_city = prev.city
          const next_city = prev_city
          next.city = next_city
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.const('ABC'),
            abc: Schema.number,
          }, ['tag', 'abc']),
          Schema.object({
            tag: Schema.const('DEF'),
            def: Schema.integer,
          }, ['tag', 'def'])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: number }
      function deepClone(prev: Type) {
        let next
        if (prev.tag === "ABC") {
          next = Object.create(null)
          const prev_tag = prev.tag
          const next_tag = prev_tag
          next.tag = next_tag
          const prev_abc = prev.abc
          const next_abc = prev_abc
          next.abc = next_abc
        }
        if (prev.tag === "DEF") {
          next = Object.create(null)
          const prev_tag1 = prev.tag
          const next_tag1 = prev_tag1
          next.tag = next_tag1
          const prev_def = prev.def
          const next_def = prev_def
          next.def = next_def
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.const('NON_DISCRIMINANT'),
            abc: Schema.number,
          }, ['tag', 'abc']),
          Schema.object({
            tag: Schema.const('NON_DISCRIMINANT'),
            def: Schema.integer,
          }, ['tag', 'def'])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: "NON_DISCRIMINANT"; abc: number }
        | { tag: "NON_DISCRIMINANT"; def: number }
      function deepClone(prev: Type) {
        let next
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "NON_DISCRIMINANT" &&
            Number.isFinite(value.abc)
          )
        }
        if (check(prev)) {
          next = Object.create(null)
          const prev_tag = prev.tag
          const next_tag = prev_tag
          next.tag = next_tag
          const prev_abc = prev.abc
          const next_abc = prev_abc
          next.abc = next_abc
        }
        function check1(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "NON_DISCRIMINANT" &&
            Number.isSafeInteger(value.def)
          )
        }
        if (check1(prev)) {
          next = Object.create(null)
          const prev_tag1 = prev.tag
          const next_tag1 = prev_tag1
          next.tag = next_tag1
          const prev_def = prev.def
          const next_def = prev_def
          next.def = next_def
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag1: Schema.const('ABC'),
            abc: Schema.union([
              Schema.object({
                tag2: Schema.const('ABC_JKL'),
                jkl: Schema.union([
                  Schema.object({
                    tag3: Schema.const('ABC_JKL_ONE'),
                  }, ['tag3']),
                  Schema.object({
                    tag3: Schema.const('ABC_JKL_TWO'),
                  }, ['tag3']),
                ])
              }, ['tag2', 'jkl']),
              Schema.object({
                tag2: Schema.const('ABC_MNO'),
                mno: Schema.union([
                  Schema.object({
                    tag3: Schema.const('ABC_MNO_ONE'),
                  }, ['tag3']),
                  Schema.object({
                    tag3: Schema.const('ABC_MNO_TWO'),
                  }, ['tag3']),
                ])
              }, ['tag2', 'mno']),
            ])
          }, ['tag1', 'abc']),
          Schema.object({
            tag1: Schema.const('DEF'),
            def: Schema.union([
              Schema.object({
                tag2: Schema.const('DEF_PQR'),
                pqr: Schema.union([
                  Schema.object({
                    tag3: Schema.const('DEF_PQR_ONE'),
                  }, ['tag3']),
                  Schema.object({
                    tag3: Schema.const('DEF_PQR_TWO'),
                  }, ['tag3']),
                ])
              }, ['tag2', 'pqr']),
              Schema.object({
                tag2: Schema.const('DEF_STU'),
                stu: Schema.union([
                  Schema.object({
                    tag3: Schema.const('DEF_STU_ONE'),
                  }, ['tag3']),
                  Schema.object({
                    tag3: Schema.const('DEF_STU_TWO'),
                  }, ['tag3']),
                ])
              }, ['tag2', 'stu']),
            ])
          }, ['tag1', 'def']),
        ]),
        { typeName: 'Type' }
      ),
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | {
            tag1: "ABC"
            abc:
              | {
                  tag2: "ABC_JKL"
                  jkl: { tag3: "ABC_JKL_ONE" } | { tag3: "ABC_JKL_TWO" }
                }
              | {
                  tag2: "ABC_MNO"
                  mno: { tag3: "ABC_MNO_ONE" } | { tag3: "ABC_MNO_TWO" }
                }
          }
        | {
            tag1: "DEF"
            def:
              | {
                  tag2: "DEF_PQR"
                  pqr: { tag3: "DEF_PQR_ONE" } | { tag3: "DEF_PQR_TWO" }
                }
              | {
                  tag2: "DEF_STU"
                  stu: { tag3: "DEF_STU_ONE" } | { tag3: "DEF_STU_TWO" }
                }
          }
      function deepClone(prev: Type) {
        let next
        if (prev.tag1 === "ABC") {
          next = Object.create(null)
          const prev_tag1 = prev.tag1
          const next_tag1 = prev_tag1
          next.tag1 = next_tag1
          const prev_abc = prev.abc
          let next_abc
          if (prev.abc.tag2 === "ABC_JKL") {
            next_abc = Object.create(null)
            const prev_abc_tag2 = prev_abc.tag2
            const next_abc_tag2 = prev_abc_tag2
            next_abc.tag2 = next_abc_tag2
            const prev_abc_jkl = prev_abc.jkl
            let next_abc_jkl
            if (prev.abc.jkl.tag3 === "ABC_JKL_ONE") {
              next_abc_jkl = Object.create(null)
              const prev_abc_jkl_tag3 = prev_abc_jkl.tag3
              const next_abc_jkl_tag3 = prev_abc_jkl_tag3
              next_abc_jkl.tag3 = next_abc_jkl_tag3
            }
            if (prev.abc.jkl.tag3 === "ABC_JKL_TWO") {
              next_abc_jkl = Object.create(null)
              const prev_abc_jkl_tag1 = prev_abc_jkl.tag3
              const next_abc_jkl_tag1 = prev_abc_jkl_tag1
              next_abc_jkl.tag3 = next_abc_jkl_tag1
            }
            next_abc.jkl = next_abc_jkl
          }
          if (prev.abc.tag2 === "ABC_MNO") {
            next_abc = Object.create(null)
            const prev_abc_tag1 = prev_abc.tag2
            const next_abc_tag1 = prev_abc_tag1
            next_abc.tag2 = next_abc_tag1
            const prev_abc_mno = prev_abc.mno
            let next_abc_mno
            if (prev.abc.mno.tag3 === "ABC_MNO_ONE") {
              next_abc_mno = Object.create(null)
              const prev_abc_mno_tag3 = prev_abc_mno.tag3
              const next_abc_mno_tag3 = prev_abc_mno_tag3
              next_abc_mno.tag3 = next_abc_mno_tag3
            }
            if (prev.abc.mno.tag3 === "ABC_MNO_TWO") {
              next_abc_mno = Object.create(null)
              const prev_abc_mno_tag1 = prev_abc_mno.tag3
              const next_abc_mno_tag1 = prev_abc_mno_tag1
              next_abc_mno.tag3 = next_abc_mno_tag1
            }
            next_abc.mno = next_abc_mno
          }
          next.abc = next_abc
        }
        if (prev.tag1 === "DEF") {
          next = Object.create(null)
          const prev_tag2 = prev.tag1
          const next_tag2 = prev_tag2
          next.tag1 = next_tag2
          const prev_def = prev.def
          let next_def
          if (prev.def.tag2 === "DEF_PQR") {
            next_def = Object.create(null)
            const prev_def_tag2 = prev_def.tag2
            const next_def_tag2 = prev_def_tag2
            next_def.tag2 = next_def_tag2
            const prev_def_pqr = prev_def.pqr
            let next_def_pqr
            if (prev.def.pqr.tag3 === "DEF_PQR_ONE") {
              next_def_pqr = Object.create(null)
              const prev_def_pqr_tag3 = prev_def_pqr.tag3
              const next_def_pqr_tag3 = prev_def_pqr_tag3
              next_def_pqr.tag3 = next_def_pqr_tag3
            }
            if (prev.def.pqr.tag3 === "DEF_PQR_TWO") {
              next_def_pqr = Object.create(null)
              const prev_def_pqr_tag1 = prev_def_pqr.tag3
              const next_def_pqr_tag1 = prev_def_pqr_tag1
              next_def_pqr.tag3 = next_def_pqr_tag1
            }
            next_def.pqr = next_def_pqr
          }
          if (prev.def.tag2 === "DEF_STU") {
            next_def = Object.create(null)
            const prev_def_tag1 = prev_def.tag2
            const next_def_tag1 = prev_def_tag1
            next_def.tag2 = next_def_tag1
            const prev_def_stu = prev_def.stu
            let next_def_stu
            if (prev.def.stu.tag3 === "DEF_STU_ONE") {
              next_def_stu = Object.create(null)
              const prev_def_stu_tag3 = prev_def_stu.tag3
              const next_def_stu_tag3 = prev_def_stu_tag3
              next_def_stu.tag3 = next_def_stu_tag3
            }
            if (prev.def.stu.tag3 === "DEF_STU_TWO") {
              next_def_stu = Object.create(null)
              const prev_def_stu_tag1 = prev_def_stu.tag3
              const next_def_stu_tag1 = prev_def_stu_tag1
              next_def_stu.tag3 = next_def_stu_tag1
            }
            next_def.stu = next_def_stu
          }
          next.def = next_def
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({
            tag: Schema.const('ABC'),
            abc: Schema.union([
              Schema.object({
                tag: Schema.const('ABC_JKL'),
                jkl: Schema.union([
                  Schema.object({
                    tag: Schema.const('ABC_JKL_ONE'),
                  }, ['tag']),
                  Schema.object({
                    tag: Schema.const('ABC_JKL_TWO'),
                  }, ['tag']),
                ])
              }, ['tag', 'jkl']),
              Schema.object({
                tag: Schema.const('ABC_MNO'),
                mno: Schema.union([
                  Schema.object({
                    tag: Schema.const('ABC_MNO_ONE'),
                  }, ['tag']),
                  Schema.object({
                    tag: Schema.const('ABC_MNO_TWO'),
                  }, ['tag']),
                ])
              }, ['tag', 'mno']),
            ])
          }, ['tag', 'abc']),
          Schema.object({
            tag: Schema.const('DEF'),
            def: Schema.union([
              Schema.object({
                tag: Schema.const('DEF_PQR'),
                pqr: Schema.union([
                  Schema.object({
                    tag: Schema.const('DEF_PQR_ONE'),
                  }, ['tag']),
                  Schema.object({
                    tag: Schema.const('DEF_PQR_TWO'),
                  }, ['tag']),
                ])
              }, ['tag', 'pqr']),
              Schema.object({
                tag: Schema.const('DEF_STU'),
                stu: Schema.union([
                  Schema.object({
                    tag: Schema.const('DEF_STU_ONE'),
                  }, ['tag']),
                  Schema.object({
                    tag: Schema.const('DEF_STU_TWO'),
                  }, ['tag']),
                ])
              }, ['tag', 'stu']),
            ])
          }, ['tag', 'def']),
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | {
            tag: "ABC"
            abc:
              | {
                  tag: "ABC_JKL"
                  jkl: { tag: "ABC_JKL_ONE" } | { tag: "ABC_JKL_TWO" }
                }
              | {
                  tag: "ABC_MNO"
                  mno: { tag: "ABC_MNO_ONE" } | { tag: "ABC_MNO_TWO" }
                }
          }
        | {
            tag: "DEF"
            def:
              | {
                  tag: "DEF_PQR"
                  pqr: { tag: "DEF_PQR_ONE" } | { tag: "DEF_PQR_TWO" }
                }
              | {
                  tag: "DEF_STU"
                  stu: { tag: "DEF_STU_ONE" } | { tag: "DEF_STU_TWO" }
                }
          }
      function deepClone(prev: Type) {
        let next
        if (prev.tag === "ABC") {
          next = Object.create(null)
          const prev_tag = prev.tag
          const next_tag = prev_tag
          next.tag = next_tag
          const prev_abc = prev.abc
          let next_abc
          if (prev.abc.tag === "ABC_JKL") {
            next_abc = Object.create(null)
            const prev_abc_tag = prev_abc.tag
            const next_abc_tag = prev_abc_tag
            next_abc.tag = next_abc_tag
            const prev_abc_jkl = prev_abc.jkl
            let next_abc_jkl
            if (prev.abc.jkl.tag === "ABC_JKL_ONE") {
              next_abc_jkl = Object.create(null)
              const prev_abc_jkl_tag = prev_abc_jkl.tag
              const next_abc_jkl_tag = prev_abc_jkl_tag
              next_abc_jkl.tag = next_abc_jkl_tag
            }
            if (prev.abc.jkl.tag === "ABC_JKL_TWO") {
              next_abc_jkl = Object.create(null)
              const prev_abc_jkl_tag1 = prev_abc_jkl.tag
              const next_abc_jkl_tag1 = prev_abc_jkl_tag1
              next_abc_jkl.tag = next_abc_jkl_tag1
            }
            next_abc.jkl = next_abc_jkl
          }
          if (prev.abc.tag === "ABC_MNO") {
            next_abc = Object.create(null)
            const prev_abc_tag1 = prev_abc.tag
            const next_abc_tag1 = prev_abc_tag1
            next_abc.tag = next_abc_tag1
            const prev_abc_mno = prev_abc.mno
            let next_abc_mno
            if (prev.abc.mno.tag === "ABC_MNO_ONE") {
              next_abc_mno = Object.create(null)
              const prev_abc_mno_tag = prev_abc_mno.tag
              const next_abc_mno_tag = prev_abc_mno_tag
              next_abc_mno.tag = next_abc_mno_tag
            }
            if (prev.abc.mno.tag === "ABC_MNO_TWO") {
              next_abc_mno = Object.create(null)
              const prev_abc_mno_tag1 = prev_abc_mno.tag
              const next_abc_mno_tag1 = prev_abc_mno_tag1
              next_abc_mno.tag = next_abc_mno_tag1
            }
            next_abc.mno = next_abc_mno
          }
          next.abc = next_abc
        }
        if (prev.tag === "DEF") {
          next = Object.create(null)
          const prev_tag1 = prev.tag
          const next_tag1 = prev_tag1
          next.tag = next_tag1
          const prev_def = prev.def
          let next_def
          if (prev.def.tag === "DEF_PQR") {
            next_def = Object.create(null)
            const prev_def_tag = prev_def.tag
            const next_def_tag = prev_def_tag
            next_def.tag = next_def_tag
            const prev_def_pqr = prev_def.pqr
            let next_def_pqr
            if (prev.def.pqr.tag === "DEF_PQR_ONE") {
              next_def_pqr = Object.create(null)
              const prev_def_pqr_tag = prev_def_pqr.tag
              const next_def_pqr_tag = prev_def_pqr_tag
              next_def_pqr.tag = next_def_pqr_tag
            }
            if (prev.def.pqr.tag === "DEF_PQR_TWO") {
              next_def_pqr = Object.create(null)
              const prev_def_pqr_tag1 = prev_def_pqr.tag
              const next_def_pqr_tag1 = prev_def_pqr_tag1
              next_def_pqr.tag = next_def_pqr_tag1
            }
            next_def.pqr = next_def_pqr
          }
          if (prev.def.tag === "DEF_STU") {
            next_def = Object.create(null)
            const prev_def_tag1 = prev_def.tag
            const next_def_tag1 = prev_def_tag1
            next_def.tag = next_def_tag1
            const prev_def_stu = prev_def.stu
            let next_def_stu
            if (prev.def.stu.tag === "DEF_STU_ONE") {
              next_def_stu = Object.create(null)
              const prev_def_stu_tag = prev_def_stu.tag
              const next_def_stu_tag = prev_def_stu_tag
              next_def_stu.tag = next_def_stu_tag
            }
            if (prev.def.stu.tag === "DEF_STU_TWO") {
              next_def_stu = Object.create(null)
              const prev_def_stu_tag1 = prev_def_stu.tag
              const next_def_stu_tag1 = prev_def_stu_tag1
              next_def_stu.tag = next_def_stu_tag1
            }
            next_def.stu = next_def_stu
          }
          next.def = next_def
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.object({ tag: Schema.const('A') }, ['tag']),
          Schema.object({ tag: Schema.const('B') }, ['tag']),
          Schema.object({ tag: Schema.array(Schema.string) }, ['tag'])
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "A" } | { tag: "B" } | { tag: Array<string> }
      function deepClone(prev: Type) {
        let next
        function check(value) {
          return !!value && typeof value === "object" && value.tag === "A"
        }
        if (check(prev)) {
          next = Object.create(null)
          const prev_tag = prev.tag
          const next_tag = prev_tag
          next.tag = next_tag
        }
        function check1(value) {
          return !!value && typeof value === "object" && value.tag === "B"
        }
        if (check1(prev)) {
          next = Object.create(null)
          const prev_tag1 = prev.tag
          const next_tag1 = prev_tag1
          next.tag = next_tag1
        }
        function check2(value) {
          return (
            !!value &&
            typeof value === "object" &&
            Array.isArray(value.tag) &&
            value.tag.every((value) => typeof value === "string")
          )
        }
        if (check2(prev)) {
          next = Object.create(null)
          const prev_tag2 = prev.tag
          const length = prev_tag2.length
          const next_tag2 = new Array(length)
          for (let ix = length; ix-- !== 0; ) {
            const prev_tag__item = prev_tag2[ix]
            const next_tag__item = prev_tag__item
            next_tag2[ix] = next_tag__item
          }
          next.tag = next_tag2
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      JsonSchema.deepClone.writeable(
        Schema.union([
          Schema.union([
            Schema.object({ abc: Schema.string }, ['abc']),
            Schema.object({ def: Schema.string }, ['def'])
          ]),
          Schema.union([
            Schema.object({ ghi: Schema.string }, ['ghi']),
            Schema.object({ jkl: Schema.string }, ['jkl'])
          ])
        ]), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { abc: string }
        | { def: string }
        | { ghi: string }
        | { jkl: string }
      function deepClone(prev: Type) {
        let next
        function check(value) {
          return !!value && typeof value === "object" && typeof value.abc === "string"
        }
        if (check(prev)) {
          next = Object.create(null)
          const prev_abc = prev.abc
          const next_abc = prev_abc
          next.abc = next_abc
        }
        function check1(value) {
          return !!value && typeof value === "object" && typeof value.def === "string"
        }
        if (check1(prev)) {
          next = Object.create(null)
          const prev_def = prev.def
          const next_def = prev_def
          next.def = next_def
        }
        function check2(value) {
          return !!value && typeof value === "object" && typeof value.ghi === "string"
        }
        if (check2(prev)) {
          next = Object.create(null)
          const prev_ghi = prev.ghi
          const next_ghi = prev_ghi
          next.ghi = next_ghi
        }
        function check3(value) {
          return !!value && typeof value === "object" && typeof value.jkl === "string"
        }
        if (check3(prev)) {
          next = Object.create(null)
          const prev_jkl = prev.jkl
          const next_jkl = prev_jkl
          next.jkl = next_jkl
        }
        return next
      }
      "
    `)

  })
})


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: JsonSchema.deepClone.writeable', () => {
  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.array', () => {
    const clone_01 = JsonSchema.deepClone(
      Schema.array(
        Schema.object({
          firstName: Schema.string,
          lastName: Schema.string,
          address: Schema.object({
            street1: Schema.string,
            street2: Schema.string,
            city: Schema.string,
          }, ['street1', 'city'])
        }, ['firstName', 'address'])
      )
    )

    vi.expect.soft(clone_01([])).to.deep.equal([])
    vi.expect.soft(clone_01([
      { firstName: 'Peter', lastName: 'Venkman', address: { street1: '123 Main St', street2: 'Unit B', city: 'Brooklyn' } },
      { firstName: 'Ray', lastName: 'Stantz', address: { street1: '456 2nd St', city: 'Queens' } },
      { firstName: 'Egon', lastName: 'Spengler', address: { street1: '789 Cesar Chavez', city: 'Boston' } },
    ])).toMatchInlineSnapshot
      (`
      [
        {
          "address": {
            "city": "Brooklyn",
            "street1": "123 Main St",
            "street2": "Unit B",
          },
          "firstName": "Peter",
          "lastName": "Venkman",
        },
        {
          "address": {
            "city": "Queens",
            "street1": "456 2nd St",
          },
          "firstName": "Ray",
          "lastName": "Stantz",
        },
        {
          "address": {
            "city": "Boston",
            "street1": "789 Cesar Chavez",
          },
          "firstName": "Egon",
          "lastName": "Spengler",
        },
      ]
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.tuple', () => {
    const clone_01 = JsonSchema.deepClone({
      type: 'array',
      prefixItems: [
        { type: 'number' },
        {
          type: 'array',
          prefixItems: [
            {
              type: 'object',
              required: ['a'],
              properties: {
                a: { type: 'boolean' }
              }
            }
          ]
        }
      ],
    })

    vi.expect.soft(clone_01(
      [1, [{ a: false }]]
    )).toMatchInlineSnapshot
      (`
      [
        1,
        [
          {
            "a": false,
          },
        ],
      ]
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.tuple w/ rest', () => {
    const clone_01 = JsonSchema.deepClone({
      type: 'array',
      items: { type: 'array', items: { type: 'number' } },
      prefixItems: [
        { type: 'boolean' },
        { type: 'string' },
        { type: 'integer' }
      ],
    })

    vi.expect.soft(clone_01(
      [false, '', 0]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        0,
      ]
    `)

    vi.expect.soft(clone_01(
      [false, '', 0, []]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        0,
        [],
      ]
    `)

    vi.expect.soft(clone_01(
      [false, '', 0, [1]]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        0,
        [
          1,
        ],
      ]
    `)

    vi.expect.soft(clone_01(
      [false, '', 0, [1, 2]]
    )).toMatchInlineSnapshot
      (`
      [
        false,
        "",
        0,
        [
          1,
          2,
        ],
      ]
    `)

    const clone_02 = JsonSchema.deepClone({
      type: 'array',
      items: { type: 'boolean' },
      prefixItems: [
        {
          type: 'array',
          items: { type: 'boolean' }
        },
      ]
    })


    vi.expect.soft(clone_02(
      [[false]]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
        ],
      ]
    `)

    vi.expect.soft(clone_02(
      [[false], false]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
        ],
        false,
      ]
    `)

    vi.expect.soft(clone_02(
      [[false, true]]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
          true,
        ],
      ]
    `)

    vi.expect.soft(clone_02(
      [[false, true], false]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
          true,
        ],
        false,
      ]
    `)

    vi.expect.soft(clone_02(
      [[false, true, true], false, false]
    )).toMatchInlineSnapshot
      (`
      [
        [
          false,
          true,
          true,
        ],
        false,
        false,
      ]
    `)

    const clone_03 = JsonSchema.deepClone(
      Schema.tuple(
        [
          Schema.object({
            a: Schema.tuple(
              [
                Schema.object({
                  b: Schema.tuple(
                    [
                      Schema.object({
                        c: Schema.tuple(
                          [
                            Schema.object({
                              d: Schema.string,
                            })
                          ],
                          Schema.object({
                            E: Schema.tuple(
                              [
                                Schema.string,
                              ], Schema.object({
                                F: Schema.string,
                              })
                            )
                          })
                        ),
                      })
                    ],
                    Schema.object({
                      G: Schema.string
                    })
                  )
                })
              ], Schema.object({
                H: Schema.string
              })
            )
          })
        ],
        Schema.object({
          I: Schema.tuple([Schema.string], Schema.object({
            J: Schema.string,
          }))
        })
      )
    )

    vi.expect.soft(clone_03(
      // TODO:
      [{ a: [{ b: [{ c: [{ d: 'hey' }] }] }] }] as never
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    `)

    vi.expect.soft(clone_03(
      // TODO:
      [{ a: [{ b: [{ c: [{ d: 'hey' }, { E: ['hey'] }] }] }] }] as never
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                    {
                      "E": [
                        "hey",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    `)

    vi.expect.soft(clone_03(
      // TODO:
      [{ a: [{ b: [{ c: [{ d: 'hey' }, { E: ['EE', { F: 'FF' }] }] }] }] }] as never
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    `)

    vi.expect.soft(clone_03(
      // TODO:
      [
        {
          a: [
            {
              b: [
                {
                  c: [
                    {
                      d: 'hey'
                    },
                    {
                      E: [
                        'EE',
                        { F: 'FF' },
                      ]
                    },
                    {
                      E: [
                        'EE',
                        { F: 'FF' },
                      ]
                    }
                  ]
                },
                { G: 'GG' },
              ]
            },
            { H: 'HH' },
          ]
        },
        {
          I: [
            'I0',
            { J: 'JJ' },
          ]
        }
      ] as never
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                      ],
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                      ],
                    },
                  ],
                },
                {
                  "G": "GG",
                },
              ],
            },
            {
              "H": "HH",
            },
          ],
        },
        {
          "I": [
            "I0",
            {
              "J": "JJ",
            },
          ],
        },
      ]
    `)

    vi.expect.soft(clone_03(
      // TODO:
      [
        {
          a: [
            {
              b: [
                {
                  c: [
                    {
                      d: 'hey'
                    },
                    {
                      E: [
                        'EE',
                        { F: 'FF' },
                        { F: 'FF' },
                      ]
                    },
                    {
                      E: [
                        'EE',
                        { F: 'FF' },
                        { F: 'FFF' },
                        { F: 'FFFF' },
                      ]
                    }
                  ]
                },
                { G: 'GG' },
                { G: 'GGG' },
              ]
            },
            { H: 'HH' },
            { H: 'HHH' },
          ]
        },
        {
          I: [
            'I0',
            { J: 'JJ' },
            { J: 'JJJ' },
          ]
        }
      ] as never
    )).toMatchInlineSnapshot
      (`
      [
        {
          "a": [
            {
              "b": [
                {
                  "c": [
                    {
                      "d": "hey",
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                        {
                          "F": "FF",
                        },
                      ],
                    },
                    {
                      "E": [
                        "EE",
                        {
                          "F": "FF",
                        },
                        {
                          "F": "FFF",
                        },
                        {
                          "F": "FFFF",
                        },
                      ],
                    },
                  ],
                },
                {
                  "G": "GG",
                },
                {
                  "G": "GGG",
                },
              ],
            },
            {
              "H": "HH",
            },
            {
              "H": "HHH",
            },
          ],
        },
        {
          "I": [
            "I0",
            {
              "J": "JJ",
            },
            {
              "J": "JJJ",
            },
          ],
        },
      ]
    `)

  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.object', () => {
    const clone_01 = JsonSchema.deepClone(Schema.object({}))
    vi.expect.soft(clone_01({})).toMatchInlineSnapshot(`{}`)

    const clone_02 = JsonSchema.deepClone(
      Schema.object({
        a: Schema.object({
          b: Schema.string,
          c: Schema.string,
        }),
        d: Schema.string,
        e: Schema.object({
          f: Schema.string,
          g: Schema.object({
            h: Schema.string,
            i: Schema.string,
          }, ['h', 'i'])
        }, ['f'])
      }, ['a', 'e'])
    )

    vi.expect.soft(clone_02(
      {
        a: {
          b: 'B',
          c: 'C',
        },
        d: 'D',
        e: {
          f: 'F',
          g: {
            h: 'H',
            i: 'I',
          }
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {
          "b": "B",
          "c": "C",
        },
        "d": "D",
        "e": {
          "f": "F",
          "g": {
            "h": "H",
            "i": "I",
          },
        },
      }
    `)

    vi.expect.soft(clone_02(
      {
        a: {
          b: 'B',
          c: 'C',
        },
        e: {
          f: 'F',
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {
          "b": "B",
          "c": "C",
        },
        "e": {
          "f": "F",
        },
      }
    `)

    const clone_03 = JsonSchema.deepClone({
      type: 'object',
      required: ['a', 'b'],
      properties: {
        a: {
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        b: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            required: ['c'],
            properties: {
              c: {
                type: 'object',
                required: ['d', 'e'],
                properties: {
                  d: { type: 'string' },
                  e: {
                    type: 'object',
                    additionalProperties: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    vi.expect.soft(clone_03(
      {
        a: {},
        b: {}
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {},
        "b": {},
      }
    `)

    vi.expect.soft(clone_03(
      {
        a: {
          aa: 'AA',
          ab: 'AB',
        },
        b: {
          bb: {
            c: {
              d: 'D',
              e: {}
            }
          }
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {
          "aa": "AA",
          "ab": "AB",
        },
        "b": {
          "bb": {
            "c": {
              "d": "D",
              "e": {},
            },
          },
        },
      }
    `)

    vi.expect.soft(clone_03(
      {
        a: {
          aa: 'AA',
          ab: 'AB',
        },
        b: {
          bb: {
            c: {
              d: 'D',
              e: {
                ee: ['E1', 'E2'],
                ff: [],
                gg: ['G']
              }
            }
          }
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "a": {
          "aa": "AA",
          "ab": "AB",
        },
        "b": {
          "bb": {
            "c": {
              "d": "D",
              "e": {
                "ee": [
                  "E1",
                  "E2",
                ],
                "ff": [],
                "gg": [
                  "G",
                ],
              },
            },
          },
        },
      }
    `)

    const clone_04 = JsonSchema.deepClone(
      Schema.object({
        b: Schema.array(
          Schema.object({
            c: Schema.array(
              Schema.object({
                d: Schema.string
              })
            ),
          })
        )
      })
    )

    vi.expect.soft(clone_04(
      {
        b: []
      }
    )).toMatchInlineSnapshot
      (`
      {
        "b": [],
      }
    `)

    vi.expect.soft(clone_04(
      {
        b: [
          {
            c: []
          }
        ]
      }
    )).toMatchInlineSnapshot
      (`
      {
        "b": [
          {
            "c": [],
          },
        ],
      }
    `)

    vi.expect.soft(clone_04(
      {
        b: [
          {
            c: [
              {
                d: ''
              }
            ]
          }
        ]
      }
    )).toMatchInlineSnapshot
      (`
      {
        "b": [
          {
            "c": [
              {
                "d": "",
              },
            ],
          },
        ],
      }
    `)

    vi.expect.soft(clone_04(
      {
        b: [
          {
            c: [
              {
                d: 'D1'
              },
              {
                d: 'D2'
              },
            ]
          },
          {
            c: [
              {
                d: 'D3'
              },
              {
                d: 'D4'
              }
            ]
          }
        ]
      }
    )).toMatchInlineSnapshot
      (`
      {
        "b": [
          {
            "c": [
              {
                "d": "D1",
              },
              {
                "d": "D2",
              },
            ],
          },
          {
            "c": [
              {
                "d": "D3",
              },
              {
                "d": "D4",
              },
            ],
          },
        ],
      }
    `)


    const clone_05 = JsonSchema.deepClone(
      Schema.object({
        b: Schema.array(Schema.string),
        '0b': Schema.array(Schema.string),
        '00b': Schema.array(Schema.string),
        '-00b': Schema.array(Schema.string),
        '00b0': Schema.array(Schema.string),
        '--00b0': Schema.array(Schema.string),
        '-^00b0': Schema.array(Schema.string),
        '': Schema.array(Schema.string),
        '_': Schema.array(Schema.string),
      })
    )

    vi.expect.soft(clone_05(
      {
        b: [],
        '0b': [],
        '00b': [],
        '-00b': [],
        '00b0': [],
        '--00b0': [],
        '-^00b0': [],
        '': [],
        '_': [],
      }
    )).toMatchInlineSnapshot
      (`
      {
        "": [],
        "--00b0": [],
        "-00b": [],
        "-^00b0": [],
        "00b": [],
        "00b0": [],
        "0b": [],
        "_": [],
        "b": [],
      }
    `)

    vi.expect.soft(clone_05(
      {
        b: [
          'B_1',
          'B_2',
        ],
        '0b': [
          '0B_1',
          '0B_2',
        ],
        '00b': [
          '00B_1',
          '00B_2',
        ],
        '-00b': [
          '-00B_1',
          '-00B_2',
        ],
        '00b0': [
          '00B0_1',
          '00B0_2',
        ],
        '--00b0': [
          '--00B0_1',
          '--00B0_2',
        ],
        '-^00b0': [
          '-^00B0_1',
          '-^00B0_2',
        ],
        '': [
          '_1',
          '_2',
        ],
        '_': [
          '__1',
          '__2',
        ],
      }
    )).toMatchInlineSnapshot
      (`
      {
        "": [
          "_1",
          "_2",
        ],
        "--00b0": [
          "--00B0_1",
          "--00B0_2",
        ],
        "-00b": [
          "-00B_1",
          "-00B_2",
        ],
        "-^00b0": [
          "-^00B0_1",
          "-^00B0_2",
        ],
        "00b": [
          "00B_1",
          "00B_2",
        ],
        "00b0": [
          "00B0_1",
          "00B0_2",
        ],
        "0b": [
          "0B_1",
          "0B_2",
        ],
        "_": [
          "__1",
          "__2",
        ],
        "b": [
          "B_1",
          "B_2",
        ],
      }
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.intersection', () => {
    const clone_01 = JsonSchema.deepClone(
      Schema.intersection([
        Schema.object({
          abc: Schema.string
        }),
        Schema.object({
          def: Schema.string
        })
      ])
    )

    vi.expect.soft(clone_01(
      {
        abc: 'ABC',
        def: 'DEF',
      }
    )).toMatchInlineSnapshot
      (`
      {
        "abc": "ABC",
        "def": "DEF",
      }
    `)
  })

  vi.test('〖⛳️〗› ❲JsonSchema.deepClone❳: Schema.union', () => {
    const clone_01 = JsonSchema.deepClone(Schema.union([]))

    vi.expect.soft(clone_01(undefined as never)).toMatchInlineSnapshot(`undefined`)
    vi.expect.soft(clone_01(null as never)).toMatchInlineSnapshot(`undefined`)

    const clone_02 = JsonSchema.deepClone(
      Schema.union([
        Schema.number,
        Schema.object({
          street1: Schema.string,
          street2: Schema.string,
          city: Schema.string
        }, ['street1', 'city'])
      ])
    )

    vi.expect.soft(clone_02(0)).toMatchInlineSnapshot(`0`)
    vi.expect.soft(clone_02(-0)).toMatchInlineSnapshot(`-0`)

    vi.expect.soft(clone_02(
      {
        street1: '221B Baker St',
        city: 'London'
      })
    ).toMatchInlineSnapshot
      (`
      {
        "city": "London",
        "street1": "221B Baker St",
      }
    `)

    vi.expect.soft(clone_02(
      {
        street1: '221 Baker St',
        street2: '#B',
        city: 'London'
      })
    ).toMatchInlineSnapshot
      (`
      {
        "city": "London",
        "street1": "221 Baker St",
        "street2": "#B",
      }
    `)

    const clone_03 = JsonSchema.deepClone(
      Schema.union([
        Schema.object({
          yea: Schema.enum('YAY'),
          onYea: Schema.union([
            Schema.number,
            Schema.array(Schema.string)
          ]),
        }, ['yea', 'onYea']),
        Schema.object({
          boo: Schema.enum('NOO'),
          onBoo: Schema.union([
            Schema.object({
              tag: Schema.boolean,
              opt: Schema.string,
            }, ['tag']),
            Schema.record({ additionalProperties: Schema.string })
          ]),
        }, ['boo', 'onBoo']),
      ])
    )

    vi.expect.soft(clone_03(
      {
        yea: 'YAY',
        onYea: 1
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onYea": 1,
        "yea": "YAY",
      }
    `)

    vi.expect.soft(clone_03(
      {
        yea: 'YAY',
        onYea: []
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onYea": [],
        "yea": "YAY",
      }
    `)

    vi.expect.soft(clone_03(
      {
        onYea: [
          'Y1',
          'Y2',
          'Y3',
        ],
        yea: 'YAY',
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onYea": [
          "Y1",
          "Y2",
          "Y3",
        ],
        "yea": "YAY",
      }
    `)

    vi.expect.soft(clone_03(
      {
        boo: 'NOO',
        onBoo: {},
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {},
      }
    `)

    vi.expect.soft(clone_03(
      {
        boo: 'NOO',
        onBoo: {
          tag: false
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {
          "tag": false,
        },
      }
    `)

    vi.expect.soft(clone_03(
      {
        boo: 'NOO',
        onBoo: {
          opt: 'sup',
          tag: false,
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {
          "opt": "sup",
          "tag": false,
        },
      }
    `)

    vi.expect.soft(clone_03(
      {
        boo: 'NOO',
        onBoo: {
          opt: 'sup',
          tag: false,
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {
          "opt": "sup",
          "tag": false,
        },
      }
    `)

    vi.expect.soft(clone_03(
      {
        boo: 'NOO',
        onBoo: {}
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {},
      }
    `)

    vi.expect.soft(clone_03(
      {
        boo: 'NOO',
        onBoo: {
          X: 'X',
          Y: 'Y',
          Z: 'Z',
        }
      }
    )).toMatchInlineSnapshot
      (`
      {
        "boo": "NOO",
        "onBoo": {
          "X": "X",
          "Y": "Y",
          "Z": "Z",
        },
      }
    `)

    const clone_04 = JsonSchema.deepClone(
      Schema.union([
        Schema.object({
          tag: Schema.enum('A'),
          onA: Schema.string,
        }, ['tag', 'onA']),
        Schema.object({
          tag: Schema.enum('B'),
          onB: Schema.string,
        }, ['tag', 'onB']),
      ])
    )

    vi.expect.soft(clone_04(
      {
        onA: 'HEYY',
        tag: 'A',
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onA": "HEYY",
        "tag": "A",
      }
    `)

    vi.expect.soft(clone_04(
      {
        onB: 'HEYY',
        tag: 'B',
      }
    )).toMatchInlineSnapshot
      (`
      {
        "onB": "HEYY",
        "tag": "B",
      }
    `)
  })
})
