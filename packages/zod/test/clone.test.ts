import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'
import prettier from '@prettier/sync'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.clone.writeable', () => {

  vi.test('', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.object({
          firstName: z.string(),
          lastName: z.optional(z.string()),
          address: z.object({
            street1: z.string(),
            street2: z.optional(z.string()),
            city: z.string(),
            state: z.optional(
              z.object({
                abbrev: z.string(),
                fullName: z.string(),
              })
            )
          })
        }), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        firstName: string
        lastName?: string
        address: {
          street1: string
          street2?: string
          city: string
          state?: { abbrev: string; fullName: string }
        }
      }
      function clone(prev: Type) {
        const next = Object.create(null)
        const prev_firstName = prev.firstName
        const next_firstName = prev_firstName
        next.firstName = next_firstName
        const prev_lastName = prev.lastName
        if (prev.lastName !== undefined) {
          const next_lastName = prev_lastName
        }
        next.lastName = next_lastName
        const prev_address = prev.address
        const next_address = Object.create(null)
        const prev_address_street1 = prev_address.street1
        const next_address_street1 = prev_address_street1
        next_address.street1 = next_address_street1
        const prev_address_street2 = prev_address.street2
        if (prev.address.street2 !== undefined) {
          const next_address_street2 = prev_address_street2
        }
        next_address.street2 = next_address_street2
        const prev_address_city = prev_address.city
        const next_address_city = prev_address_city
        next_address.city = next_address_city
        const prev_address_state = prev_address.state
        if (prev.address.state !== undefined) {
          const next_address_state = Object.create(null)
          const prev_address_state_abbrev = prev_address_state.abbrev
          const next_address_state_abbrev = prev_address_state_abbrev
          next_address_state.abbrev = next_address_state_abbrev
          const prev_address_state_fullName = prev_address_state.fullName
          const next_address_state_fullName = prev_address_state_fullName
          next_address_state.fullName = next_address_state_fullName
        }
        next_address.state = next_address_state
        next.address = next_address
        return next
      }
      "
    `)
  })

  vi.test('', () => {
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
          next.item = prev.item
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
            next.item.item = prev.item.item
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
          if (prev.item.lastName !== undefined) {
            const next_item_lastName = prev_item_lastName
          }
          next_item.lastName = next_item_lastName
          const prev_item_address = prev_item.address
          const next_item_address = Object.create(null)
          const prev_item_address_street1 = prev_item_address.street1
          const next_item_address_street1 = prev_item_address_street1
          next_item_address.street1 = next_item_address_street1
          const prev_item_address_street2 = prev_item_address.street2
          if (prev.item.address.street2 !== undefined) {
            const next_item_address_street2 = prev_item_address_street2
          }
          next_item_address.street2 = next_item_address_street2
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

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.never', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.never()
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
        next = prev
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
          next = prev
        }
        return next
      }
      "
    `)
  })

  vi.test.skip('〖⛳️〗› ❲zx.clone.writeable❳: z.nullable', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.nullable(z.number())
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: null | number) {
        if (prev !== null) {
          next = prev
        }
        return next
      }
      "
    `)
  })

  vi.test.skip('〖⛳️〗› ❲zx.clone.writeable❳: z.set', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.set(z.number()),
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Set<number>) {
        return next
      }
      "
    `)
  })

  vi.test.skip('〖⛳️〗› ❲zx.clone.writeable❳: z.map', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.map(z.number(), z.unknown()),
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: Map<number, unknown>) {
        return next
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲zx.clone.writeable❳: z.array', () => {

    /**
     * @example
     * function clone(prev) {
     *   /////////////
     *   /// OBJECT(
     *   //    { ident: 'prev' },
     *   //    { path: ['next'] },
     *   // )
     *   const next = Object.create(null)
     *   ////////////
     *   // ARRAY(
     *   //   { path: ['prev', 'b'] },
     *   //   { path: ['next', 'b'] },
     *   // )
     *   // joinPath(['prev', 'b'])
     *   const prev_b = prev.b                 
     *   const length = prev_b.length
     *   // joinPath(['next', 'b'])
     *   const next_b = new Array(length)      
     *   for (let ix = length; ix-- !== 0; ) {
     *     // ident(joinPath(['prev', 'b', '[ix]']))
     *     const prev_b_ix = prev_b[ix]
     *     ////////////
     *     // OBJECT(
     *     //    { ident: 'prev_b_ix' },
     *     //    { path: ['next_b', symbol.array] },
     *     // )
     *     const next_b_ix = Object.create(null)
     *     ////////////
     *     // ARRAY(
     *     //   { path: ['prev', 'b'] },
     *     //   { path: ['next', 'b'] },
     *     // )
     *     const prev_b_ix_c = prev_b_ix.c
     *     const length = prev_b_ix_c.length
     *     const next_b_ix_c = new Array(length)
     *     for (let ix = length; ix-- !== 0; ) {
     *       const prev_b_ix_c_ix = prev_b_ix_c[ix]
     *       ////////////
     *       // OBJECT(
     *       //    { ident: 'prev_b_ix' },
     *       //    { path: ['next_b', symbol.array] },
     *       // )
     *       const next_b_ix_c_ix = Object.create(null)
     *       const prev_b_ix_c_ix_d = prev_b_ix_c_ix.d
     *       next_b_ix_c_ix.d = prev_b_ix_c_ix_d
     *       // OBJECT(
     *       ////////////
     *       next_b_ix_c[ix] = next_b_ix_c_ix
     *     }
     *     // ARRAY(
     *     ////////////
     *     next_b_ix.c = next_b_ix_c
     *     // OBJECT(
     *     ////////////
     *     next_b[ix] = next_b_ix
     *   }
     *   // ARRAY(
     *   ////////////
     *   next.b = next_b
     *   return next
     * }
     */

  })

  // vi.expect.soft(format(
  //   zx.clone.writeable(
  //     z.array(z.number())
  //   )
  // )).toMatchInlineSnapshot
  //   (`
  //   "function clone(prev: Array<number>) {
  //     //////////////////////////////////
  //     /// start: ARRAY
  //     const length = prev.length
  //     const next = new Array(length)
  //     for (let ix = length; ix-- !== 0; ) {
  //       const prev_item = prev[ix]
  //       //////////////////////////////////
  //       /// start: ARRAY[number]
  //       next[ix] = prev_item
  //       /// end: ARRAY[number]
  //       //////////////////////////////////
  //     }
  //     /// end: Array
  //     //////////////////////////////////
  //     return next
  //   }
  //   "
  // `)

  // vi.expect.soft(format(
  //   zx.clone.writeable(
  //     z.array(z.object({
  //       c: z.object({
  //         d: z.string(),
  //         e: z.array(z.string()),
  //       })
  //     })), {
  //     typeName: 'Type'
  //   })
  // )).toMatchInlineSnapshot
  //   (`
  //   "type Type = Array<{ c: { d: string; e: Array<string> } }>
  //   function clone(prev: Type) {
  //     //////////////////////////////////
  //     /// start: ARRAY
  //     const length = prev.length
  //     const next = new Array(length)
  //     for (let ix = length; ix-- !== 0; ) {
  //       const prev_item = prev[ix]
  //       //////////////////////////////////
  //       /// start: ARRAY[number]
  //       //////////////////////////////////
  //       /// start: OBJECT
  //       const next_ix_ = Object.create(null)
  //       //////////////////////////////////
  //       /// start: OBJECT[keyof OBJECT]
  //       //////////////////////////////////
  //       /// start: OBJECT
  //       const next_ix__c = Object.create(null)
  //       const prev_item_c = prev_item.c
  //       //////////////////////////////////
  //       /// start: OBJECT[keyof OBJECT]
  //       next_ix__c.d = prev_item_c.d
  //       //////////////////////////////////
  //       /// start: ARRAY
  //       const length1 = prev_item_c.e.length
  //       const next_ix__c_e = new Array(length1)
  //       for (let ix1 = length1; ix1-- !== 0; ) {
  //         const prev_item_c_e_item = prev_item_c.e[ix1]
  //         //////////////////////////////////
  //         /// start: ARRAY[number]
  //         next_ix__c_e[ix1] = prev_item_c_e_item
  //         /// end: ARRAY[number]
  //         //////////////////////////////////
  //       }
  //       /// end: Array
  //       //////////////////////////////////
  //       // end: OBJECT[keyof OBJECT]
  //       //////////////////////////////////
  //       next_ix_.c = next_ix__c
  //       // end: OBJECT
  //       //////////////////////////////////
  //       // end: OBJECT[keyof OBJECT]
  //       //////////////////////////////////
  //       next[ix] = next_ix_
  //       // end: OBJECT
  //       //////////////////////////////////
  //       /// end: ARRAY[number]
  //       //////////////////////////////////
  //       next[ix] = next_ix_
  //     }
  //     /// end: Array
  //     //////////////////////////////////
  //     return next
  //   }
  //   "
  // `)


  vi.test.only('〖⛳️〗› ❲zx.clone.writeable❳: z.tuple', () => {
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
        const next = new Array(prev)
        const prev_0_ = prev[0]
        const next_0_ = prev_0_
        const prev_1_ = prev[1]
        const next_1_ = prev_1_
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
        const next = new Array(prev)
        const prev_0_ = prev[0]
        const next_0_ = prev_0_
        const prev_1_ = prev[1]
        const next_1_ = new Array(prev_1_)
        const prev____0_ = prev_1_[0]
        const next____0_ = Object.create(null)
        const prev_______a = prev____0_.a
        const next_______a = prev_______a
        next____0_.a = next_______a
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
        const next_a = new Array(prev_a)
        const prev_a_0_ = prev_a[0]
        const next_a_0_ = prev_a_0_
        const prev_a_1_ = prev_a[1]
        const next_a_1_ = prev_a_1_
        next.a = next_a
        const prev_b = prev.b
        if (prev_b !== undefined) {
          const next_b = new Array(prev_b)
          const prev_b_0_ = prev_b[0]
          const next_b_0_ = prev_b_0_
          const prev_b_1_ = prev_b[1]
          if (prev_b_1_ !== undefined) {
            const next_b_1_ = new Array(prev_b_1_)
            const prev_b____0_ = prev_b_1_[0]
            const next_b____0_ = prev_b____0_
          }
        }
        next.b = next_b
        return next
      }
      "
    `)
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
      zx.clone.writeable(z.tuple([z.object({ a: z.string() }), z.object({ b: z.string() })], z.object({ c: z.number() })), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ a: string }, { b: string }, ...{ c: number }[]]
      function clone(prev: Type) {
        return next
      }
      "
    `)
  })

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
        if (prev.street2 !== undefined) {
          const next_street2 = prev_street2
        }
        next.street2 = next_street2
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
        if (prev.d !== undefined) {
          const next_d = prev_d
        }
        next.d = next_d
        const prev_e = prev.e
        const next_e = Object.create(null)
        const prev_e_f = prev_e.f
        const next_e_f = prev_e_f
        next_e.f = next_e_f
        const prev_e_g = prev_e.g
        if (prev.e.g !== undefined) {
          const next_e_g = Object.create(null)
          const prev_e_g_h = prev_e_g.h
          const next_e_g_h = prev_e_g_h
          next_e_g.h = next_e_g_h
          const prev_e_g_i = prev_e_g.i
          const next_e_g_i = prev_e_g_i
          next_e_g.i = next_e_g_i
        }
        next_e.g = next_e_g
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

  vi.test.skip('〖⛳️〗› ❲zx.clone.writeable❳: z.union', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([])
      )
    )).toMatchInlineSnapshot
      (`
      "function clone(prev: never) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([
          z.object({ tag: z.literal('ABC'), abc: z.number() }),
          z.object({ tag: z.literal('DEF'), def: z.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "ABC"; abc: number } | { tag: "DEF"; def: bigint }
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([
          z.object({ tag: z.literal('NON_DISCRIMINANT'), abc: z.number() }),
          z.object({ tag: z.literal('NON_DISCRIMINANT'), def: z.bigint() })
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: "NON_DISCRIMINANT"; abc: number }
        | { tag: "NON_DISCRIMINANT"; def: bigint }
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([
          z.object({
            tag1: z.literal('ABC'),
            abc: z.union([
              z.object({
                tag2: z.literal('ABC_JKL'),
                jkl: z.union([
                  z.object({
                    tag3: z.literal('ABC_JKL_ONE'),
                  }),
                  z.object({
                    tag3: z.literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              z.object({
                tag2: z.literal('ABC_MNO'),
                mno: z.union([
                  z.object({
                    tag3: z.literal('ABC_MNO_ONE'),
                  }),
                  z.object({
                    tag3: z.literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          z.object({
            tag1: z.literal('DEF'),
            def: z.union([
              z.object({
                tag2: z.literal('DEF_PQR'),
                pqr: z.union([
                  z.object({
                    tag3: z.literal('DEF_PQR_ONE'),
                  }),
                  z.object({
                    tag3: z.literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              z.object({
                tag2: z.literal('DEF_STU'),
                stu: z.union([
                  z.object({
                    tag3: z.literal('DEF_STU_ONE'),
                  }),
                  z.object({
                    tag3: z.literal('DEF_STU_TWO'),
                  }),
                ])
              }),
            ])
          }),
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
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([
          z.object({
            tag: z.literal('ABC'),
            abc: z.union([
              z.object({
                tag: z.literal('ABC_JKL'),
                jkl: z.union([
                  z.object({
                    tag: z.literal('ABC_JKL_ONE'),
                  }),
                  z.object({
                    tag: z.literal('ABC_JKL_TWO'),
                  }),
                ])
              }),
              z.object({
                tag: z.literal('ABC_MNO'),
                mno: z.union([
                  z.object({
                    tag: z.literal('ABC_MNO_ONE'),
                  }),
                  z.object({
                    tag: z.literal('ABC_MNO_TWO'),
                  }),
                ])
              }),
            ])
          }),
          z.object({
            tag: z.literal('DEF'),
            def: z.union([
              z.object({
                tag: z.literal('DEF_PQR'),
                pqr: z.union([
                  z.object({
                    tag: z.literal('DEF_PQR_ONE'),
                  }),
                  z.object({
                    tag: z.literal('DEF_PQR_TWO'),
                  }),
                ])
              }),
              z.object({
                tag: z.literal('DEF_STU'),
                stu: z.union([
                  z.object({
                    tag: z.literal('DEF_STU_ONE'),
                  }),
                  z.object({
                    tag: z.literal('DEF_STU_TWO'),
                  }),
                ])
              }),
            ])
          }),
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
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([z.object({ tag: z.literal('A') }), z.object({ tag: z.literal('B') }), z.object({ tag: z.array(z.string()) })]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { tag: "A" } | { tag: "B" } | { tag: Array<string> }
      function clone(prev: Type) {
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([z.number(), z.array(z.string())])
      ))).toMatchInlineSnapshot
      (`
        "function clone(prev: number | Array<string>) {
          return next
        }
        "
      `)

    vi.expect.soft(format(
      zx.clone.writeable(
        z.union([
          z.union([
            z.object({ abc: z.string() }),
            z.object({ def: z.string() })
          ]),
          z.union([
            z.object({ ghi: z.string() }),
            z.object({ jkl: z.string() })
          ])
        ]), {
        typeName: 'Type'
      }
      ))).toMatchInlineSnapshot
      (`
        "type Type =
          | ({ abc: string } | { def: string })
          | ({ ghi: string } | { jkl: string })
        function clone(prev: Type) {
          return next
        }
        "
      `)
  })

  vi.test.skip('〖⛳️〗› ❲zx.clone.writeable❳: z.intersection', () => {
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
        return next
      }
      "
    `)
  })

  vi.test.skip('〖⛳️〗› ❲zx.clone.writeable❳: z.record', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.record(z.string(), z.record(z.string(), z.string())), {
        typeName: 'Type'
      })
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, string>>
      function clone(prev: Type) {
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

        return next
      }
      "
    `)
  })

})
