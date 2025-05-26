import * as vi from 'vitest'
import { v4 } from '@traversable/schema-zod-adapter'
import { fn } from '@traversable/registry'
import { z } from 'zod/v4'


vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it('〖⛳️〗› ❲v4.Lens❳', () => {
    const lens_01 = fn.pipe(
      v4.Lens.declare<{ x: number, y: number }>(),
      v4.Lens.prop('x'),
    )

    vi.assert.equal(lens_01.get({ x: 1, y: 2 }), 1)
    vi.assert.deepEqual(lens_01.set(3)({ x: 1, y: 2 }), { x: 3, y: 2 })
  })
})

// declare let input_01: Parameters<typeof ex_01.get>[0]
// declare let input_02: Parameters<typeof ex_02.get>[0]
// declare let input_03: Parameters<typeof ex_03.get>[0]
// declare let input_04: Parameters<typeof ex_04.get>[0]

// let schema_01 = z.object({
//   a: z.literal(0),
//   b: z.object({
//     c: z.union([
//       z.optional(
//         z.array(
//           z.optional(
//             z.object({
//               d: z.literal(1),
//               e: z.literal(2),
//               f: z.literal(3),
//               g: z.object({
//                 i: z.literal(4),
//                 j: z.object({
//                   k: z.tuple([
//                     z.tuple([
//                       z.tuple([
//                         z.tuple([
//                           z.tuple([
//                             z.tuple([
//                               z.tuple([
//                                 z.literal(9000),
//                               ])
//                             ])
//                           ])
//                         ])
//                       ])
//                     ])
//                   ])
//                 }),
//               })
//             })
//           )
//         )
//       ),
//       z.int32(),
//     ]),
//     i: z.literal(5),
//     j: z.literal(6),
//   }),
//   k: z.literal(7),
//   l: z.literal(8),
// })

// let ex_01 = v4.makeLenses(schema_01, 'b', 'c', '|0|', '?', '[number]', '?', 'g', 'j', 'k', '0', '0', '0', '0', '0', '0', '0')
// let _01 = ex_01.get(input_01)
// //  ^?


// let schema_02 = z.record(z.enum(['A', 'B']), z.tuple([z.literal(1), z.optional(z.literal(2))]))
// let ex_02 = v4.makeLenses(schema_02, 'A', '1', '?')
// let _02 = ex_02.get(input_02)
// //  ^?

// let schema_03 = z.record(z.enum(['a', 'b', 'c']), z.tuple([z.literal(1), z.optional(z.literal(2))]))
// let ex_03 = v4.makeLenses(schema_03, 'a')
// let _03 = ex_03.get(input_03)
// //  ^?Queue

// // let schema_04 = z.intersection(z.object({ c: z.optional(z.literal(2)), d: z.literal(3) }), z.object({ e: z.literal(4), f: z.optional(z.literal(5)) }))
// // let ex_04 = v4.makeLenses(schema_04, '0')
// // let _04 = ex_04.get(input_04)
// // //  ^?

// let schema_05 = z.tuple([z.record(z.string(), z.number()), z.optional(z.string())])
// let ex_05 = v4.makeLenses(schema_05, '0', '[string]')

// vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
//   vi.it('〖️⛳️〗› ❲v4.get❳', () => {
//   })
// })

// /**
//  * {
//  *   a: 0,
//  *   b: {
//  *     c: 9000,
//  *     i: 5,
//  *     j: 6,
//  *   },
//  *   k: 7,
//  *   l: 8,
//  * }
//  *
//  * {
//  *   a: 0,
//  *   b: {
//  *     c: undefined
//  *     i: 5,
//  *     j: 6,
//  *   },
//  *   k: 7,
//  *   l: 8,
//  *   }
//  * }
//  *
//  * {
//  *   a: 0,
//  *   b: {
//  *     c: []
//  *     i: 5,
//  *     j: 6,
//  *   },
//  *   k: 7,
//  *   l: 8,
//  *   }
//  * }
//  *
//  * {
//  *   a: 0,
//  *   b: {
//  *     c: [undefined] // is this a real case? I think so, with a zod schema
//  *     i: 5,
//  *     j: 6,
//  *   },
//  *   k: 7,
//  *   l: 8,
//  *   }
//  * }
//  *
//  * {
//  *   a: 0,
//  *   b: {
//  *     c: [
//  *       {
//  *         d: 1,
//  *         e: 2,
//  *         f: 3,
//  *         g: {
//  *           i: 4,
//  *           j: {
//  *             k: [[[9000]]]
//  *           }
//  *         }
//  *       }
//  *     ] // is this a real case? I think so, with a zod schema
//  *     i: 5,
//  *     j: 6,
//  *   },
//  *   k: 7,
//  *   l: 8,
//  *   }
//  * }
//  */
