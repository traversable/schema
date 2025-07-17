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
        //////////////////////////////////
        /// start: OBJECT
        const next = Object.create(null)
        //////////////////////////////////
        /// start: OBJECT[keyof OBJECT]
        next.firstName = prev.firstName
        if (prev.lastName !== undefined) {
          next.lastName = prev.lastName
        }
        //////////////////////////////////
        /// start: OBJECT
        const next_address = Object.create(null)
        const prev_address = prev.address
        //////////////////////////////////
        /// start: OBJECT[keyof OBJECT]
        next_address.street1 = prev_address.street1
        if (prev_address.street2 !== undefined) {
          next_address.street2 = prev_address.street2
        }
        next_address.city = prev_address.city
        if (prev_address.state !== undefined) {
          //////////////////////////////////
          /// start: OBJECT
          const next_address_state = Object.create(null)
          const prev_address_state = prev_address.state
          //////////////////////////////////
          /// start: OBJECT[keyof OBJECT]
          next_address_state.abbrev = prev_address_state.abbrev
          next_address_state.fullName = prev_address_state.fullName
          // end: OBJECT[keyof OBJECT]
          //////////////////////////////////
          next_address.state = next_address_state
          // end: OBJECT
          //////////////////////////////////
        }
        // end: OBJECT[keyof OBJECT]
        //////////////////////////////////
        next.address = next_address
        // end: OBJECT
        //////////////////////////////////
        // end: OBJECT[keyof OBJECT]
        //////////////////////////////////
        // end: OBJECT
        //////////////////////////////////
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
        //////////////////////////////////
        /// start: ARRAY
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          //////////////////////////////////
          /// start: ARRAY[number]
          next[ix] = prev_item
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
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
        //////////////////////////////////
        /// start: ARRAY
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          //////////////////////////////////
          /// start: ARRAY[number]
          //////////////////////////////////
          /// start: ARRAY
          const length1 = prev_item.length
          const next_ix_ = new Array(length1)
          for (let ix1 = length1; ix1-- !== 0; ) {
            const prev_item = prev_item[ix1]
            //////////////////////////////////
            /// start: ARRAY[number]
            next_ix_[ix1] = prev_item
            /// end: ARRAY[number]
            //////////////////////////////////
          }
          /// end: Array
          //////////////////////////////////
          /// end: ARRAY[number]
          //////////////////////////////////
          next[ix] = next_ix_
        }
        /// end: Array
        //////////////////////////////////
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
        //////////////////////////////////
        /// start: ARRAY
        const length = prev.length
        const next = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_item = prev[ix]
          //////////////////////////////////
          /// start: ARRAY[number]
          //////////////////////////////////
          /// start: OBJECT
          const next_ix_ = Object.create(null)
          //////////////////////////////////
          /// start: OBJECT[keyof OBJECT]
          next_ix_.firstName = prev_item.firstName
          if (prev_item.lastName !== undefined) {
            next_ix_.lastName = prev_item.lastName
          }
          //////////////////////////////////
          /// start: OBJECT
          const next_ix__address = Object.create(null)
          const prev_item_address = prev_item.address
          //////////////////////////////////
          /// start: OBJECT[keyof OBJECT]
          next_ix__address.street1 = prev_item_address.street1
          if (prev_item_address.street2 !== undefined) {
            next_ix__address.street2 = prev_item_address.street2
          }
          next_ix__address.city = prev_item_address.city
          // end: OBJECT[keyof OBJECT]
          //////////////////////////////////
          next_ix_.address = next_ix__address
          // end: OBJECT
          //////////////////////////////////
          // end: OBJECT[keyof OBJECT]
          //////////////////////////////////
          next[ix] = next_ix_
          // end: OBJECT
          //////////////////////////////////
          /// end: ARRAY[number]
          //////////////////////////////////
          next[ix] = next_ix_
        }
        /// end: Array
        //////////////////////////////////
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
        next = prev
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

  vi.test.only('〖⛳️〗› ❲zx.clone.writeable❳: z.array', () => {

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
          const length = prev_b_item_c.length
          const next_b_item_c = new Array(length)
          for (let ix = length; ix-- !== 0; ) {
            const prev_b_item_c_item = prev_b_item_c[ix]
            const next_b_item_c_item = Object.create(null)
            const prev_b_item_c_item_d = prev_b_item_c_item.d
            const next_b_item_c_item_d = prev_b_item_c_item_d
            next_b_item_c_item.d = next_b_item_c_item_d
            next_b_item_c[ix] = next_b_item_c_item
          }
          next_b_item.c = next_b_item_c
          next_b[ix] = next_b_item
        }
        next.b = next_b
        return next
      }
      "
    `)
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


  vi.test.skip('〖⛳️〗› ❲zx.clone.writeable❳: z.tuple', () => {
    vi.expect.soft(format(
      zx.clone.writeable(z.tuple([]), { typeName: 'Type' })
    )).toMatchInlineSnapshot
      (`
      "type Type = []
      function clone(prev: Type) {
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

        if (prev.b !== undefined) {
        }
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
        //////////////////////////////////
        /// start: OBJECT
        const next = Object.create(null)
        //////////////////////////////////
        /// start: OBJECT[keyof OBJECT]
        // end: OBJECT[keyof OBJECT]
        //////////////////////////////////
        // end: OBJECT
        //////////////////////////////////
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
        //////////////////////////////////
        /// start: OBJECT
        const next = Object.create(null)
        //////////////////////////////////
        /// start: OBJECT[keyof OBJECT]
        next.street1 = prev.street1
        if (prev.street2 !== undefined) {
          next.street2 = prev.street2
        }
        next.city = prev.city
        // end: OBJECT[keyof OBJECT]
        //////////////////////////////////
        // end: OBJECT
        //////////////////////////////////
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
        //////////////////////////////////
        /// start: OBJECT
        const next = Object.create(null)
        //////////////////////////////////
        /// start: OBJECT[keyof OBJECT]
        //////////////////////////////////
        /// start: OBJECT
        const next_a = Object.create(null)
        const prev_a = prev.a
        //////////////////////////////////
        /// start: OBJECT[keyof OBJECT]
        next_a.b = prev_a.b
        next_a.c = prev_a.c
        // end: OBJECT[keyof OBJECT]
        //////////////////////////////////
        next.a = next_a
        // end: OBJECT
        //////////////////////////////////
        if (prev.d !== undefined) {
          next.d = prev.d
        }
        //////////////////////////////////
        /// start: OBJECT
        const next_e = Object.create(null)
        const prev_e = prev.e
        //////////////////////////////////
        /// start: OBJECT[keyof OBJECT]
        next_e.f = prev_e.f
        if (prev_e.g !== undefined) {
          //////////////////////////////////
          /// start: OBJECT
          const next_e_g = Object.create(null)
          const prev_e_g = prev_e.g
          //////////////////////////////////
          /// start: OBJECT[keyof OBJECT]
          next_e_g.h = prev_e_g.h
          next_e_g.i = prev_e_g.i
          // end: OBJECT[keyof OBJECT]
          //////////////////////////////////
          next_e.g = next_e_g
          // end: OBJECT
          //////////////////////////////////
        }
        // end: OBJECT[keyof OBJECT]
        //////////////////////////////////
        next.e = next_e
        // end: OBJECT
        //////////////////////////////////
        // end: OBJECT[keyof OBJECT]
        //////////////////////////////////
        // end: OBJECT
        //////////////////////////////////
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
        //////////////////////////////////
        /// start: OBJECT
        const next = Object.create(null)
        //////////////////////////////////
        /// start: OBJECT[keyof OBJECT]
        //////////////////////////////////
        /// start: ARRAY
        const length = prev.b.length
        const next_b = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_b_item = prev.b[ix]
          //////////////////////////////////
          /// start: ARRAY[number]
          next_b[ix] = prev_b_item
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
        //////////////////////////////////
        /// start: ARRAY
        const length1 = prev["0b"].length
        const next__0b__ = new Array(length1)
        for (let ix1 = length1; ix1-- !== 0; ) {
          const prev__0b___item = prev["0b"][ix1]
          //////////////////////////////////
          /// start: ARRAY[number]
          next__0b__[ix1] = prev__0b___item
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
        //////////////////////////////////
        /// start: ARRAY
        const length2 = prev["00b"].length
        const next__00b__ = new Array(length2)
        for (let ix2 = length2; ix2-- !== 0; ) {
          const prev__00b___item = prev["00b"][ix2]
          //////////////////////////////////
          /// start: ARRAY[number]
          next__00b__[ix2] = prev__00b___item
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
        //////////////////////////////////
        /// start: ARRAY
        const length3 = prev["-00b"].length
        const next___00b__ = new Array(length3)
        for (let ix3 = length3; ix3-- !== 0; ) {
          const prev___00b___item = prev["-00b"][ix3]
          //////////////////////////////////
          /// start: ARRAY[number]
          next___00b__[ix3] = prev___00b___item
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
        //////////////////////////////////
        /// start: ARRAY
        const length4 = prev["00b0"].length
        const next__00b0__ = new Array(length4)
        for (let ix4 = length4; ix4-- !== 0; ) {
          const prev__00b0___item = prev["00b0"][ix4]
          //////////////////////////////////
          /// start: ARRAY[number]
          next__00b0__[ix4] = prev__00b0___item
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
        //////////////////////////////////
        /// start: ARRAY
        const length5 = prev["--00b0"].length
        const next____00b0__ = new Array(length5)
        for (let ix5 = length5; ix5-- !== 0; ) {
          const prev____00b0___item = prev["--00b0"][ix5]
          //////////////////////////////////
          /// start: ARRAY[number]
          next____00b0__[ix5] = prev____00b0___item
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
        //////////////////////////////////
        /// start: ARRAY
        const length6 = prev["-^00b0"].length
        const next____00b0__1 = new Array(length6)
        for (let ix6 = length6; ix6-- !== 0; ) {
          const prev____00b0___item1 = prev["-^00b0"][ix6]
          //////////////////////////////////
          /// start: ARRAY[number]
          next____00b0__1[ix6] = prev____00b0___item1
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
        //////////////////////////////////
        /// start: ARRAY
        const length7 = prev[""].length
        const next____ = new Array(length7)
        for (let ix7 = length7; ix7-- !== 0; ) {
          const prev_____item = prev[""][ix7]
          //////////////////////////////////
          /// start: ARRAY[number]
          next____[ix7] = prev_____item
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
        //////////////////////////////////
        /// start: ARRAY
        const length8 = prev._.length
        const next__ = new Array(length8)
        for (let ix8 = length8; ix8-- !== 0; ) {
          const prev___item = prev._[ix8]
          //////////////////////////////////
          /// start: ARRAY[number]
          next__[ix8] = prev___item
          /// end: ARRAY[number]
          //////////////////////////////////
        }
        /// end: Array
        //////////////////////////////////
        // end: OBJECT[keyof OBJECT]
        //////////////////////////////////
        // end: OBJECT
        //////////////////////////////////
        return next
      }
      "
    `)
  })

  vi.test.skip('〖⛳️〗› ❲zx.clone.writeable❳: z.object w/ catchall', () => {
    vi.expect.soft(format(
      zx.clone.writeable(
        z.object({
          street1: z.string(),
          street2: z.optional(z.string()),
          city: z.string(),
        }).catchall(z.boolean()),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { street1: string; street2?: string; city: string } & {
        [x: string]: boolean
      }
      function clone(prev: Type) {
        const next = Object.create(null)
        next.street1 = prev.street1
        if (prev.street2 !== undefined) {
          next.street2 = prev.street2
        }
        next.city = prev.city
        return next
      }
      "
    `)

    vi.expect.soft(format(
      zx.clone.writeable(
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
        }).catchall(z.array(z.array(z.string()))),
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
      } & { [x: string]: Array<Array<string>> }
      function clone(prev: Type) {
        const next = Object.create(null)
        const length = prev.b.length
        const next_b = new Array(length)
        for (let ix = length; ix-- !== 0; ) {
          const prev_b_item = prev.b[ix]
          next_b[ix] = prev_b_item
        }
        const length1 = prev["0b"].length
        const next__0b__ = new Array(length1)
        for (let ix1 = length1; ix1-- !== 0; ) {
          const prev__0b___item = prev["0b"][ix1]
          next__0b__[ix1] = prev__0b___item
        }
        const length2 = prev["00b"].length
        const next__00b__ = new Array(length2)
        for (let ix2 = length2; ix2-- !== 0; ) {
          const prev__00b___item = prev["00b"][ix2]
          next__00b__[ix2] = prev__00b___item
        }
        const length3 = prev["-00b"].length
        const next___00b__ = new Array(length3)
        for (let ix3 = length3; ix3-- !== 0; ) {
          const prev___00b___item = prev["-00b"][ix3]
          next___00b__[ix3] = prev___00b___item
        }
        const length4 = prev["00b0"].length
        const next__00b0__ = new Array(length4)
        for (let ix4 = length4; ix4-- !== 0; ) {
          const prev__00b0___item = prev["00b0"][ix4]
          next__00b0__[ix4] = prev__00b0___item
        }
        const length5 = prev["--00b0"].length
        const next____00b0__ = new Array(length5)
        for (let ix5 = length5; ix5-- !== 0; ) {
          const prev____00b0___item = prev["--00b0"][ix5]
          next____00b0__[ix5] = prev____00b0___item
        }
        const length6 = prev["-^00b0"].length
        const next____00b0__1 = new Array(length6)
        for (let ix6 = length6; ix6-- !== 0; ) {
          const prev____00b0___item1 = prev["-^00b0"][ix6]
          next____00b0__1[ix6] = prev____00b0___item1
        }
        const length7 = prev[""].length
        const next____ = new Array(length7)
        for (let ix7 = length7; ix7-- !== 0; ) {
          const prev_____item = prev[""][ix7]
          next____[ix7] = prev_____item
        }
        const length8 = prev._.length
        const next__ = new Array(length8)
        for (let ix8 = length8; ix8-- !== 0; ) {
          const prev___item = prev._[ix8]
          next__[ix8] = prev___item
        }
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
