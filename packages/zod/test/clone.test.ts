import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.clone.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.never', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.never()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.any', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.any()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: any) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.unknown', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.unknown()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: unknown) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.void', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.void()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: void) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.undefined', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.undefined()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: undefined) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.null', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.null()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: null) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.boolean', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.boolean()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: boolean) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.symbol', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.symbol()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: symbol) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.nan', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.int()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: number) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.int', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.int()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: number) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.bigint', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.bigint()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: bigint) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.number', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.number()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: number) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.string', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.string()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: string) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.enum', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.enum([])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.enum(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a") {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.enum(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a" | "b") {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.literal', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.literal([])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.literal('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a") {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.literal(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a" | "b") {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.templateLiteral', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.templateLiteral([])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "") {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.templateLiteral(['a'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "a") {
        const next = prev
        return next
      }
      "
    `)
    vi.expect.soft(format(
      zx.clone.writeable(
        z.templateLiteral(['a', 'b'])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: "ab") {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.file', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.file()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: File) {
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.date', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.date())
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Date) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.lazy', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.lazy(() => z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: number) {
        const next = prev
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.optional', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.optional(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: undefined | number) {
        if (prev !== undefined) {
          const next = prev
          undefined.next = next
        }
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.nullable', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.nullable(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: null | number) {
        if (prev !== null) {
          const next = prev
        }
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

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.array', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.array(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Array<number>) {
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
      zx.clone.writeable(
        z.array(z.array(z.number()))
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Array<Array<number>>) {
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
      zx.clone.writeable(
        z.array(
          z.object({
            c: z.object({
              d: z.string(),
              e: z.array(z.string()),
            })
          })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{ c: { d: string; e: Array<string> } }>
      function clone(prev: Type) {
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
      zx.clone.writeable(
        z.array(
          z.object({
            firstName: z.string(),
            lastName: z.optional(z.string()),
            address: z.object({
              street1: z.string(),
              street2: z.optional(z.string()),
              city: z.string(),
            })
          })
        ), {
        typeName: 'Type'
      }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<{
        firstName: string
        lastName?: string
        address: { street1: string; street2?: string; city: string }
      }>
      function clone(prev: Type) {
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          const next_item = Object.create(null)
          const prev_item_firstName = prev_item.firstName
          const next_item_firstName = prev_item_firstName
          next_item.firstName = next_item_firstName
          const prev_item_lastName = prev_item.lastName
          if (prev_item_lastName !== undefined) {
            const next_item_lastName = prev_item_lastName
            next_item.lastName = next_item_lastName
          }
          const prev_item_address = prev_item.address
          const next_item_address = Object.create(null)
          const prev_item_address_street1 = prev_item_address.street1
          const next_item_address_street1 = prev_item_address_street1
          next_item_address.street1 = next_item_address_street1
          const prev_item_address_street2 = prev_item_address.street2
          if (prev_item_address_street2 !== undefined) {
            const next_item_address_street2 = prev_item_address_street2
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

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.record', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.record(z.string(), z.record(z.string(), z.string())), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
       "type Type = Record<string, Record<string, string>>
       function clone(prev: Type) {
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
      zx.clone.writeable(
        z.object({
          a: z.record(z.string(), z.string()),
          b: z.record(
            z.string(),
            z.object({
              c: z.object({
                d: z.string(),
                e: z.record(
                  z.string(),
                  z.array(z.string()),
                )
              })
            })
          )
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
       "type Type = {
         a: Record<string, string>
         b: Record<string, { c: { d: string; e: Record<string, Array<string>> } }>
       }
       function clone(prev: Type) {
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

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.tuple', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function clone(prev: Type) {
        const next = new Array(prev)
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([z.string(), z.string()]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function clone(prev: Type) {
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
      zx.clone.writeable(
        z.tuple([z.number(), z.tuple([z.object({ a: z.boolean() })])])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: [number, [{ a: boolean }]]) {
        const next = new Array(prev.length)
        const prev_0_ = prev[0]
        const next_0_ = prev_0_
        const prev_1_ = prev[1]
        const next_1_ = new Array(prev_1_.length)
        const prev____0_ = prev_1_[0]
        const next____0_ = Object.create(null)
        const prev_______a = prev____0_.a
        const next_______a = prev_______a
        next____0_.a = next_______a
        next_1_[0] = next____0_
        next[0] = next_0_
        next[1] = next_1_
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.object({
        a: z.tuple([z.string(), z.string()]),
        b: z.optional(z.tuple([z.string(), z.optional(z.tuple([z.string()]))]))
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: [string, string]; b?: [string, _?: [string]] }
      function clone(prev: Type) {
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
        if (prev_b !== undefined) {
          const next_b = new Array(prev_b.length)
          const prev_b_0_ = prev_b[0]
          const next_b_0_ = prev_b_0_
          const prev_b_1_ = prev_b[1]
          if (prev_b_1_ !== undefined) {
            const next_b_1_ = new Array(prev_b_1_.length)
            const prev_b____0_ = prev_b_1_[0]
            const next_b____0_ = prev_b____0_
            next_b_1_[0] = next_b____0_
            next_b[1] = next_b_1_
          }
          next_b[0] = next_b_0_
          next_b[1] = next_b_1_
          next.b = next_b
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

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.object', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.object({}))
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: {}) {
        const next = Object.create(null)
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(z.object({
        street1: z.string(),
        street2: z.optional(z.string()),
        city: z.string(),
      }), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: string; city: string }
      function clone(prev: Type) {
        const next = Object.create(null)
        const prev_street1 = prev.street1
        const next_street1 = prev_street1
        next.street1 = next_street1
        const prev_street2 = prev.street2
        if (prev_street2 !== undefined) {
          const next_street2 = prev_street2
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
      zx.clone.writeable(
        z.object({
          a: z.object({
            b: z.string(),
            c: z.string(),
          }),
          d: z.optional(z.string()),
          e: z.object({
            f: z.string(),
            g: z.optional(
              z.object({
                h: z.string(),
                i: z.string(),
              })
            )
          })
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: { b: string; c: string }
        d?: string
        e: { f: string; g?: { h: string; i: string } }
      }
      function clone(prev: Type) {
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
        if (prev_d !== undefined) {
          const next_d = prev_d
          next.d = next_d
        }
        const prev_e = prev.e
        const next_e = Object.create(null)
        const prev_e_f = prev_e.f
        const next_e_f = prev_e_f
        next_e.f = next_e_f
        const prev_e_g = prev_e.g
        if (prev_e_g !== undefined) {
          const next_e_g = Object.create(null)
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
      zx.clone.writeable(
        z.object({
          b: z.array(
            z.object({
              c: z.array(
                z.object({
                  d: z.string()
                })
              ),
            })
          )
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { b: Array<{ c: Array<{ d: string }> }> }
      function clone(prev: Type) {
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
      zx.clone.writeable(z.object({
        b: z.array(z.string()),
        '0b': z.array(z.string()),
        '00b': z.array(z.string()),
        '-00b': z.array(z.string()),
        '00b0': z.array(z.string()),
        '--00b0': z.array(z.string()),
        '-^00b0': z.array(z.string()),
        '': z.array(z.string()),
        '_': z.array(z.string()),
      }), { typeName: 'Type' })
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
      function clone(prev: Type) {
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
   * function clone(prev: AddressIntersection) {
   *   const next = Object.create(null)
   *   next.street1 = prev.street1
   *   if (prev.street2 !== undefined) next.street2 = prev.street2
   *   next.city = prev.city
   *   if (prev.postalCode !== undefined) next.postalCode = prev.postalCode
   *   return next
   * }
   */

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.intersection', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.intersection(
          z.object({
            abc: z.string()
          }),
          z.object({
            def: z.string()
          })
        ), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string } & { def: string }
      function clone(prev: Type) {
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
      zx.clone.writeable(
        z.intersection(
          z.object({
            abc: z.string(),
            def: z.object({
              ghi: z.string(),
              jkl: z.string()
            })
          }),
          z.object({
            mno: z.string(),
            pqr: z.object({
              stu: z.string(),
              vwx: z.string(),
            })
          })
        ), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string; def: { ghi: string; jkl: string } } & {
        mno: string
        pqr: { stu: string; vwx: string }
      }
      function clone(prev: Type) {
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
  })

  /**
   * @example
   * type Type = Set<{ street1: string, street2?: string, city: string }>
   * function clone(prev: Type) {
   *   const next = new Set()
   *   for (let value of prev) {
   *     const next_value = Object.create(null)
   *     next_value.street1 = value.street1
   *     if (value.street2 !== undefined) {
   *       next_value.street2 = value.street2
   *     }
   *     next_value.city = value.city
   *     next.add(next_value)
   *   }
   *   return next
   * }
   */

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.set', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.set(z.number()),
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Set<number>) {
        const next = new Set()
        for (let value of prev) {
          const next_value = value
          next.add(next_value)
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.set(
          z.object({
            street1: z.string(),
            street2: z.optional(z.string()),
            city: z.string(),
          })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Set<{ street1: string; street2?: string; city: string }>
      function clone(prev: Type) {
        const next = new Set()
        for (let value of prev) {
          const next_value = Object.create(null)
          const value_street1 = value.street1
          const next_value_street1 = value_street1
          next_value.street1 = next_value_street1
          const value_street2 = value.street2
          if (value_street2 !== undefined) {
            const next_value_street2 = value_street2
            next_value.street2 = next_value_street2
          }
          const value_city = value.city
          const next_value_city = value_city
          next_value.city = next_value_city
          next.add(next_value)
        }
        return next
      }
      "
    `)

  })

  /**
   * @example
   * type Type = Map<{ street1: string, street2?: string, city: string }, string>
   * function clone(prev: Type) {
   *   const next = new Map()
   *   for (let [key, value] of prev) {
   *     const next_key = Object.create(null)
   *     next_key.street1 = key.street1
   *     if (key.street2 !== undefined) {
   *       next_key.street2 = key.street2
   *     }
   *     next_key.city = key.city
   *     const next_value = value
   *     next.set(next_key, next_value)
   *   }
   *   return out
   * }
   */

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.map', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.map(z.number(), z.unknown()),
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Map<number, unknown>) {
        const next = new Map()
        for (let [key, value] of prev) {
          const next_key = key
          const next_value = value
          next.set(next_key, next_value)
        }
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.map(
          z.object({
            street1: z.string(),
            street2: z.optional(z.string()),
            city: z.string(),
          }),
          z.string()
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Map<{ street1: string; street2?: string; city: string }, string>
      function clone(prev: Type) {
        const next = new Map()
        for (let [key, value] of prev) {
          const next_key = Object.create(null)
          const key_street1 = key.street1
          const next_key_street1 = key_street1
          next_key.street1 = next_key_street1
          const key_street2 = key.street2
          if (key_street2 !== undefined) {
            const next_key_street2 = key_street2
            next_key.street2 = next_key_street2
          }
          const key_city = key.city
          const next_key_city = key_city
          next_key.city = next_key_city
          const next_value = value
          next.set(next_key, next_value)
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

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.union', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        const next = undefined
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([
          z.object({
            tag: z.literal('A'),
            onA: z.string(),
          }),
          z.object({
            tag: z.literal('B'),
            onB: z.string(),
          }),
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: { tag: "A"; onA: string } | { tag: "B"; onB: string }) {
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
      zx.clone.writeable(
        z.union([
          z.number(),
          z.object({
            street1: z.string(),
            street2: z.optional(z.string()),
            city: z.string()
          })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = number | { street1: string; street2?: string; city: string }
      function clone(prev: Type) {
        let next
        if (typeof prev === "number") {
          next = prev
        }
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            typeof value.street1 === "string" &&
            (!Object.hasOwn(value, "street2") ||
              typeof value?.street2 === "string") &&
            typeof value.city === "string"
          )
        }
        if (check(prev)) {
          next = Object.create(null)
          const prev_street1 = prev.street1
          const next_street1 = prev_street1
          next.street1 = next_street1
          const prev_street2 = prev.street2
          if (prev_street2 !== undefined) {
            const next_street2 = prev_street2
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

    // vi.expect.soft(format(
    //   zx.clone.writeable(
    //     z.union([
    //       z.object({ tag: z.literal('ABC'), abc: z.number() }),
    //       z.object({ tag: z.literal('DEF'), def: z.bigint() })
    //     ]),
    //     { typeName: 'Type' }
    //   )
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: bigint }
    //   function clone(prev: Type) {
    //     return next
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.clone.writeable(
    //     z.union([
    //       z.object({ tag: z.literal('NON_DISCRIMINANT'), abc: z.number() }),
    //       z.object({ tag: z.literal('NON_DISCRIMINANT'), def: z.bigint() })
    //     ]),
    //     { typeName: 'Type' }
    //   )
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type =
    //     | { tag: "NON_DISCRIMINANT"; abc: number }
    //     | { tag: "NON_DISCRIMINANT"; def: bigint }
    //   function clone(prev: Type) {
    //     return next
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.clone.writeable(
    //     z.union([
    //       z.object({
    //         tag1: z.literal('ABC'),
    //         abc: z.union([
    //           z.object({
    //             tag2: z.literal('ABC_JKL'),
    //             jkl: z.union([
    //               z.object({
    //                 tag3: z.literal('ABC_JKL_ONE'),
    //               }),
    //               z.object({
    //                 tag3: z.literal('ABC_JKL_TWO'),
    //               }),
    //             ])
    //           }),
    //           z.object({
    //             tag2: z.literal('ABC_MNO'),
    //             mno: z.union([
    //               z.object({
    //                 tag3: z.literal('ABC_MNO_ONE'),
    //               }),
    //               z.object({
    //                 tag3: z.literal('ABC_MNO_TWO'),
    //               }),
    //             ])
    //           }),
    //         ])
    //       }),
    //       z.object({
    //         tag1: z.literal('DEF'),
    //         def: z.union([
    //           z.object({
    //             tag2: z.literal('DEF_PQR'),
    //             pqr: z.union([
    //               z.object({
    //                 tag3: z.literal('DEF_PQR_ONE'),
    //               }),
    //               z.object({
    //                 tag3: z.literal('DEF_PQR_TWO'),
    //               }),
    //             ])
    //           }),
    //           z.object({
    //             tag2: z.literal('DEF_STU'),
    //             stu: z.union([
    //               z.object({
    //                 tag3: z.literal('DEF_STU_ONE'),
    //               }),
    //               z.object({
    //                 tag3: z.literal('DEF_STU_TWO'),
    //               }),
    //             ])
    //           }),
    //         ])
    //       }),
    //     ]),
    //     { typeName: 'Type' }
    //   ),
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type =
    //     | {
    //         tag1: "ABC"
    //         abc:
    //           | {
    //               tag2: "ABC_JKL"
    //               jkl: { tag3: "ABC_JKL_ONE" } | { tag3: "ABC_JKL_TWO" }
    //             }
    //           | {
    //               tag2: "ABC_MNO"
    //               mno: { tag3: "ABC_MNO_ONE" } | { tag3: "ABC_MNO_TWO" }
    //             }
    //       }
    //     | {
    //         tag1: "DEF"
    //         def:
    //           | {
    //               tag2: "DEF_PQR"
    //               pqr: { tag3: "DEF_PQR_ONE" } | { tag3: "DEF_PQR_TWO" }
    //             }
    //           | {
    //               tag2: "DEF_STU"
    //               stu: { tag3: "DEF_STU_ONE" } | { tag3: "DEF_STU_TWO" }
    //             }
    //       }
    //   function clone(prev: Type) {
    //     return next
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.clone.writeable(
    //     z.union([
    //       z.object({
    //         tag: z.literal('ABC'),
    //         abc: z.union([
    //           z.object({
    //             tag: z.literal('ABC_JKL'),
    //             jkl: z.union([
    //               z.object({
    //                 tag: z.literal('ABC_JKL_ONE'),
    //               }),
    //               z.object({
    //                 tag: z.literal('ABC_JKL_TWO'),
    //               }),
    //             ])
    //           }),
    //           z.object({
    //             tag: z.literal('ABC_MNO'),
    //             mno: z.union([
    //               z.object({
    //                 tag: z.literal('ABC_MNO_ONE'),
    //               }),
    //               z.object({
    //                 tag: z.literal('ABC_MNO_TWO'),
    //               }),
    //             ])
    //           }),
    //         ])
    //       }),
    //       z.object({
    //         tag: z.literal('DEF'),
    //         def: z.union([
    //           z.object({
    //             tag: z.literal('DEF_PQR'),
    //             pqr: z.union([
    //               z.object({
    //                 tag: z.literal('DEF_PQR_ONE'),
    //               }),
    //               z.object({
    //                 tag: z.literal('DEF_PQR_TWO'),
    //               }),
    //             ])
    //           }),
    //           z.object({
    //             tag: z.literal('DEF_STU'),
    //             stu: z.union([
    //               z.object({
    //                 tag: z.literal('DEF_STU_ONE'),
    //               }),
    //               z.object({
    //                 tag: z.literal('DEF_STU_TWO'),
    //               }),
    //             ])
    //           }),
    //         ])
    //       }),
    //     ]),
    //     { typeName: 'Type' }
    //   )
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type =
    //     | {
    //         tag: "ABC"
    //         abc:
    //           | {
    //               tag: "ABC_JKL"
    //               jkl: { tag: "ABC_JKL_ONE" } | { tag: "ABC_JKL_TWO" }
    //             }
    //           | {
    //               tag: "ABC_MNO"
    //               mno: { tag: "ABC_MNO_ONE" } | { tag: "ABC_MNO_TWO" }
    //             }
    //       }
    //     | {
    //         tag: "DEF"
    //         def:
    //           | {
    //               tag: "DEF_PQR"
    //               pqr: { tag: "DEF_PQR_ONE" } | { tag: "DEF_PQR_TWO" }
    //             }
    //           | {
    //               tag: "DEF_STU"
    //               stu: { tag: "DEF_STU_ONE" } | { tag: "DEF_STU_TWO" }
    //             }
    //       }
    //   function clone(prev: Type) {
    //     return next
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.clone.writeable(
    //     z.union([z.object({ tag: z.literal('A') }), z.object({ tag: z.literal('B') }), z.object({ tag: z.array(z.string()) })]),
    //     { typeName: 'Type' }
    //   )
    // )).toMatchInlineSnapshot
    //   (`
    //   "type Type = { tag: "A" } | { tag: "B" } | { tag: Array<string> }
    //   function clone(prev: Type) {
    //     return next
    //   }
    //   "
    // `)

    // vi.expect.soft(format(
    //   zx.clone.writeable(
    //     z.union([z.number(), z.array(z.string())])
    //   ))).toMatchInlineSnapshot
    //   (`
    //     "function clone(prev: number | Array<string>) {
    //       return next
    //     }
    //     "
    //   `)

    // vi.expect.soft(format(
    //   zx.clone.writeable(
    //     z.union([
    //       z.union([
    //         z.object({ abc: z.string() }),
    //         z.object({ def: z.string() })
    //       ]),
    //       z.union([
    //         z.object({ ghi: z.string() }),
    //         z.object({ jkl: z.string() })
    //       ])
    //     ]), {
    //     typeName: 'Type'
    //   }
    //   ))).toMatchInlineSnapshot
    //   (`
    //     "type Type =
    //       | ({ abc: string } | { def: string })
    //       | ({ ghi: string } | { jkl: string })
    //     function clone(prev: Type) {
    //       return next
    //     }
    //     "
    //   `)

  })

  vi.test.skip('〖⛳️〗› ❲zx.clone.writeable❳: z.tuple w/ rest', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([z.string(), z.string()], z.number()), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string, ...number[]]
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.tuple([
          z.object({ a: z.string() }),
          z.object({ b: z.string() })
        ],
          z.object({ c: z.number() })
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ a: string }, { b: string }, ...{ c: number }[]]
      function clone(prev: Type) {
        return next
      }
      "
    `)
  })

})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.clone.writeable', () => {
  vi.test('〖⛳️〗› ❲zx.clone❳: z.array', () => {
    const clone_01 = zx.clone(
      z.array(
        z.object({
          firstName: z.string(),
          lastName: z.optional(z.string()),
          address: z.object({
            street1: z.string(),
            street2: z.optional(z.string()),
            city: z.string(),
          })
        })
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

  vi.test('〖⛳️〗› ❲zx.clone❳: z.tuple', () => {
    const clone_01 = zx.clone(
      z.tuple([
        z.number(),
        z.tuple([
          z.object({
            a: z.boolean()
          })
        ])
      ])
    )

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

  vi.test('〖⛳️〗› ❲zx.clone❳: z.object', () => {
    const clone_01 = zx.clone(z.object({}))
    vi.expect.soft(clone_01({})).toMatchInlineSnapshot(`{}`)

    const clone_02 = zx.clone(
      z.object({
        a: z.object({
          b: z.string(),
          c: z.string(),
        }),
        d: z.optional(z.string()),
        e: z.object({
          f: z.string(),
          g: z.optional(
            z.object({
              h: z.string(),
              i: z.string(),
            })
          )
        })
      })
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

    const clone_03 = zx.clone(
      z.object({
        a: z.record(z.string(), z.string()),
        b: z.record(
          z.string(),
          z.object({
            c: z.object({
              d: z.string(),
              e: z.record(
                z.string(),
                z.array(z.string()),
              )
            })
          })
        )
      })
    )

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

    const clone_04 = zx.clone(
      z.object({
        b: z.array(
          z.object({
            c: z.array(
              z.object({
                d: z.string()
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


    const clone_05 = zx.clone(
      z.object({
        b: z.array(z.string()),
        '0b': z.array(z.string()),
        '00b': z.array(z.string()),
        '-00b': z.array(z.string()),
        '00b0': z.array(z.string()),
        '--00b0': z.array(z.string()),
        '-^00b0': z.array(z.string()),
        '': z.array(z.string()),
        '_': z.array(z.string()),
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

  vi.test('〖⛳️〗› ❲zx.clone❳: z.intersection', () => {
    const clone_01 = zx.clone(
      z.intersection(
        z.object({
          abc: z.string()
        }),
        z.object({
          def: z.string()
        })
      )
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

  vi.test('〖⛳️〗› ❲zx.clone❳: z.union', () => {
    const clone_01 = zx.clone(z.union([]))

    vi.expect.soft(clone_01(undefined as never)).toMatchInlineSnapshot(`undefined`)
    vi.expect.soft(clone_01(null as never)).toMatchInlineSnapshot(`undefined`)

    const clone_02 = zx.clone(
      z.union([
        z.number(),
        z.object({
          street1: z.string(),
          street2: z.optional(z.string()),
          city: z.string()
        })
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

    const clone_03 = zx.clone(
      z.union([
        z.object({
          yea: z.literal('YAY'),
          onYea: z.union([
            z.number(),
            z.array(z.string())
          ]),
        }),
        z.object({
          boo: z.literal('NOO'),
          onBoo: z.union([
            z.object({
              tag: z.boolean(),
              opt: z.optional(z.string()),
            }),
            z.record(z.string(), z.string())
          ]),
        }),
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

    const clone_04 = zx.clone(
      z.union([
        z.object({
          tag: z.literal('A'),
          onA: z.string(),
        }),
        z.object({
          tag: z.literal('B'),
          onB: z.string(),
        }),
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