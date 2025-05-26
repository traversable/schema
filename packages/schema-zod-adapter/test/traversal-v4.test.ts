import * as vi from 'vitest'
import { v4 } from '@traversable/schema-zod-adapter'
import { fn } from '@traversable/registry'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it('〖⛳️〗› ❲v4.Traversal❳', () => {
    type Tweet = { text: string }
    type Tweets = { tweets: Tweet[] }

    const traversal_01 = fn.pipe(
      // v4.Lens.declare<Tweets>(),
      v4.Lens.prop('tweets')<Tweets>(),
      v4.Traversal.fromLens,
    )

    vi.expectTypeOf(traversal_01).toEqualTypeOf<v4.Traversal<Tweets, Tweet[]>>()

    vi.expect(
      fn.pipe(
        // {},
        traversal_01,
        v4.Traversal.getAll({ tweets: [] }),
      )
    ).toMatchInlineSnapshot
      (`
      [
        [],
      ]
    `)

    vi.expect(
      fn.pipe(
        // {},
        traversal_01,
        v4.Traversal.getAll({ tweets: [{ text: 'A' }, { text: 'B' }] }),
      )
    ).toMatchInlineSnapshot
      (`
      [
        [
          {
            "text": "A",
          },
          {
            "text": "B",
          },
        ],
      ]
    `)

    const lens_02 = fn.pipe(traversal_01, v4.Traversal.modify((xs) => xs.map((x) => ({ ...x, text: x.text.concat('C') }))))

    vi.expect(
      lens_02({ tweets: [{ text: 'A' }, { text: 'B' }] })
    ).toMatchInlineSnapshot
      (`
      {
        "tweets": [
          {
            "text": "AC",
          },
          {
            "text": "BC",
          },
        ],
      }
    `)
  })

  vi.it('〖⛳️〗› ❲v4.Traversal❳: Traveral.fromOptionalWithFallback', () => {
    const traversal_01 = v4.Traversal.fromOptionalWithFallback(v4.Optional.fromPrism(v4.Prism.fromPredicate((x) => x !== undefined)), 1 as {} | null)
    vi.expect(v4.Traversal.getAllWithFallback(undefined, 1 as {} | null)(traversal_01)).toMatchInlineSnapshot
      (`1`)

    const traversal_02 = v4.Traversal.fromOptionalWithFallback(v4.Optional.fromPrism(v4.Prism.fromPredicate((x) => x !== undefined)), { x: 2 })
    vi.expect(v4.Traversal.modifyWithFallback((x) => ({ x }), { x: 3 } as {} | null)(traversal_02)(1)).toMatchInlineSnapshot
      (`
      {
        "x": 1,
      }
    `)

    vi.expect(v4.Traversal.modifyWithFallback((x) => ({ x }), { x: 3 } as {} | null)(traversal_02)(undefined)).toMatchInlineSnapshot
      (`
      {
        "x": 2,
      }
    `)
  })

  vi.it('〖⛳️〗› ❲v4.Traversal❳: Traveral.getWithFallback', () => {
    const traversal_01 = v4.Traversal.fromPrismWithFallback(v4.Prism.fromPredicate((x) => typeof x !== 'string'), ['fallback', 1])
    vi.expect(v4.Traversal.getWithFallback(traversal_01)('hey', ['fallback', 2])).toMatchInlineSnapshot
      (`
      [
        "fallback",
        1,
      ]
    `)
  })
})


// const _x = fn.pipe(
//   Lens.declare<{ x: number[], y: number[] }>(),
//   Lens.prop('x'),
//   Traversal.fromLens,
// )

// type Polymer = z.infer<typeof Polymer>

// // TODO: optional properties
// const Polymer = z.object({
//   isCircular: z.boolean(),
//   isDoubleStranded: z.boolean(),
//   sequence: z.array(
//     z.union([
//       z.object({ tag: z.literal('C'), pos: z.number().int() }),
//       z.object({ tag: z.literal('G'), pos: z.number().int() }),
//       z.object({ tag: z.literal('A'), pos: z.number().int() }),
//       z.object({ tag: z.literal('T'), pos: z.number().int() }),
//     ])
//   ),
// })

// const sds = asTraversal(
//   Lens.new(
//     (x: { a: number, b: boolean }) => x.a,
//     (a) => (x) => ({ ...x, a }))
// )({
//   X: { a: 1, b: false },
//   Y: { a: 2, b: true },
// })

// const sx = Lens.fromShape({
//   a: 1 as const,
//   b: 2 as const,
//   c: 3 as const,
// })

// const sy = Lens.fromKeys(
//   'a',
//   'b',
//   'c',
// )<1 | 2 | 3>()

// const sz = Lens.fromEntries([
//   ['a', 1 as const],
//   ['b', 2 as const],
//   ['c', 3 as const],
// ])