import * as vi from 'vitest'
import { z } from 'zod/v4'
import { symbol } from '@traversable/registry'

import { zx } from '@traversable/zod'

/** 
 * @example 
 * interface TestSchema extends z.infer<typeof TestSchema> {}
 * const TestSchema = z.object({
 *   abc: z.optional(
 *     z.union([
 *       z.object({
 *         tag: z.literal('A'),
 *         def: z.optional(z.string()),
 *         ghi: z.array(z.number()),
 *       }),
 *       z.object({
 *         tag: z.literal('B'),
 *         jkl: z.optional(
 *           z.record(
 *             z.object({ 
 *               mno: z.string(),
 *               pqr: z.optional(z.bigint()),
 *             })
 *           )
 *         ),
 *         stu: z.number(),
 *       }),
 *     ])
 *   ),
 *   vwx: z.boolean(),
 * })
 * 
 * abc.?.#A.tag
 * abc.?.#A.tag
 * abc.?.#A.def.?
 * abc.?.#A.def.!
 * abc.?.#A.def
 * abc.?.#A.ghi.[]
 * abc.?.#A.ghi
 * abc.?.#A
 * abc.?.#B.tag
 * abc.?.#B.jkl.?.[].mno
 * abc.?.#B.jkl.?.[].pqr.?
 * abc.?.#B.jkl.?.[].pqr.!
 * abc.?.#B.jkl.?.[].pqr
 * abc.?.#B.jkl.?
 * abc.?.#B.jkl.!.[].mno
 * abc.?.#B.jkl.!.[].pqr.?
 * abc.?.#B.jkl.!.[].pqr.!
 * abc.?.#B.jkl.!.[].pqr
 * abc.?.#B.jkl.!.[]
 * abc.?.#B.jkl.!
 * abc.?.#B.stu
 * abc.?.#B
 * abc.?
 * abc.!.#A.tag
 * abc.!.#A.tag
 * abc.!.#A.def.?
 * abc.!.#A.def.!
 * abc.!.#A.def
 * abc.!.#A.ghi.[]
 * abc.!.#A.ghi
 * abc.!.#A
 * abc.!.#B.tag
 * abc.!.#B.jkl.?.{}.mno
 * abc.!.#B.jkl.?.{}.pqr.?
 * abc.!.#B.jkl.?.{}.pqr.!
 * abc.!.#B.jkl.?.{}.pqr
 * abc.!.#B.jkl.?
 * abc.!.#B.jkl.!.{}.mno
 * abc.!.#B.jkl.!.{}.pqr.?
 * abc.!.#B.jkl.!.{}.pqr.!
 * abc.!.#B.jkl.!.{}.pqr
 * abc.!.#B.jkl.!.{}
 * abc.!.#B.jkl.!
 * abc.!.#B.stu
 * abc.!.#B
 * abc.!
 * abc
 * vwx
 * 
 * get(abc.?.#A.tag)              ->  Prism<TestSchema, 'A' | undefined>
 * get(abc.?.#A.def.?)            ->  Prism<TestSchema, string | undefined>
 * get(abc.?.#A.def.!)            ->  Prism<TestSchema, string | undefined>
 * get(abc.?.#A.def)              ->  Prism<TestSchema, string | undefined>
 * get(abc.?.#A.ghi.[])           ->  Traversal<TestSchema, number | undefined>
 * get(abc.?.#A.ghi)              ->  number[] | undefined
 * get(abc.?.#A)                  ->  { tag: 'A', def: string | undefined, ghi: number[] } | undefined
 * get(abc.?.#B.tag)              ->  'B' | undefined
 * get(abc.?.#B.jkl.?.{}.mno)     ->  
 * get(abc.?.#B.jkl.?.{}.pqr.?)
 * get(abc.?.#B.jkl.?.{}.pqr.!)
 * get(abc.?.#B.jkl.?.{}.pqr)
 * get(abc.?.#B.jkl.?)
 * get(abc.?.#B.jkl.!.{}.mno)
 * get(abc.?.#B.jkl.!.{}.pqr.?)
 * get(abc.?.#B.jkl.!.{}.pqr.!)
 * get(abc.?.#B.jkl.!.{}.pqr)
 * get(abc.?.#B.jkl.!.{})
 * get(abc.?.#B.jkl.!)
 * get(abc.?.#B.stu)
 * get(abc.?.#B)
 * get(abc.?)
 * get(abc.!.#A.tag)
 * get(abc.!.#A.tag)
 * get(abc.!.#A.def.?)
 * get(abc.!.#A.def.!)
 * get(abc.!.#A.def)
 * get(abc.!.#A.ghi.^..)
 * get(abc.!.#A.ghi)
 * get(abc.!.#A)
 * get(abc.!.#B.tag)
 * get(abc.!.#B.jkl.?.^...mno)
 * get(abc.!.#B.jkl.?.^...pqr.?)
 * get(abc.!.#B.jkl.?.^...pqr.!)
 * get(abc.!.#B.jkl.?.^...pqr)
 * get(abc.!.#B.jkl.?)
 * get(abc.!.#B.jkl.!.^...mno)
 * get(abc.!.#B.jkl.!.^...pqr.?)
 * get(abc.!.#B.jkl.!.^...pqr.!)
 * get(abc.!.#B.jkl.!.^...pqr)
 * get(abc.!.#B.jkl.!.^..)
 * get(abc.!.#B.jkl.!)
 * get(abc.!.#B.stu)
 * get(abc.!.#B)
 * get(abc.!)
 * get(abc)
 * get(vwx)
 * 
 * 
 */

const BIG_SCHEMA = z.object({
  A: z.optional(
    z.union([
      z.literal(1),
      z.array(
        z.object({
          H: z.literal('two'),
          I: z.union([
            z.number(),
            z.object({
              J: z.optional(z.literal(false)),
            })
          ]),
        })
      ),
      z.record(
        z.enum(['x', 'y', 'z']),
        z.optional(
          z.union([
            z.boolean(),
            z.number().int()
          ])
        )
      ),
    ])
  ),
  B: z.optional(
    z.array(
      z.tuple([
        z.literal(7),
        z.record(
          z.number(),
          z.union([
            z.object({
              discriminant: z.literal('circle'),
              radius: z.number(),
            }),
            z.object({
              discriminant: z.literal('rectangle'),
              width: z.number(),
              length: z.number(),
            }),
            z.object({
              discrimnant: z.literal('square'),
              length: z.number(),
            }),
          ])
        )
      ]),
    )
  ),
  C: z.optional(z.tuple([
    z.object({
      J: z.unknown(),
      K: z.optional(z.string()),
    })
  ])),
  D: z.object({
    E: z.optional(
      z.array(
        z.object({
          F: z.number(),
          G: z.union([
            z.object({
              tag: z.literal(7000),
              L: z.optional(z.number().array()),
              M: z.set(z.array(z.string())),
            }),
            z.object({
              tag: z.literal(8000),
            }),
            z.object({
              tag: z.literal(9000),
            }),
          ])
        })
      )
    )
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.classic.makeLens', () => {
  vi.it.skip('temp 1', () => {

    const LENS_040 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      }
    )

    const RESULT_040 = LENS_040({ D: {} })

    vi.expect.soft(RESULT_040).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": [
            undefined,
          ],
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)

    const LENS_041 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      }
    )
    const RESULT_041 = LENS_041(
      { D: {} }
    )

    vi.expect.soft(RESULT_041).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)

    const LENS_042 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ʔ.ꖛ0
    )
    const MODIFY_042 = LENS_042.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      })
    const RESULT_042 = MODIFY_042({ D: {} })

    vi.expect.soft(RESULT_042).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_0421 = MODIFY_042({ D: {}, A: { x: false, y: 1, z: 2 } })

    vi.expect.soft(RESULT_0421).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": [
            false,
          ],
          "y": 1,
          "z": 2,
        },
        "D": {},
      }
    `)

    const RESULT_0422 = MODIFY_042({ D: {}, A: { x: 0, y: 1, z: 2 } })

    vi.expect.soft(RESULT_0422).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": 0,
          "y": 1,
          "z": 2,
        },
        "D": {},
      }
    `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.union([
          z.object({ tag: z.literal('A'), a: z.string() }),
          z.object({ tag: z.literal('B'), b: z.number() })
        ]),
        (proxy) => proxy.ꖛA.a
      ).get({ tag: 'A', a: 'hey' })
    ).toMatchInlineSnapshot
      (`"hey"`)

    const LENS_044 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ǃ
    )

    const MODIFY_044 = LENS_044.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        console.log('FOCUS', focus)
        return [focus]
      }
    )

    const RESULT_044 = MODIFY_044({ D: {}, A: { x: 1, y: 2, z: 3 } })

    vi.expect.soft(RESULT_044).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": [
            1,
          ],
          "y": 2,
          "z": 3,
        },
        "D": {},
      }
    `)

    const RESULT_0441 = LENS_044.modify((focus) => [focus], { D: {} })

    vi.expect.soft(RESULT_0441).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)

    // const RESULT_0442 = LENS_044.get({ D: {} })

    // vi.expect.soft(RESULT_0442).toMatchInlineSnapshot
    //   (`undefined`)


    // const RESULT_0443 = LENS_044.set(42)({ D: {} })

    // vi.expect.soft(RESULT_0443).toMatchInlineSnapshot
    //   (`
    //   {
    //     "A": {
    //       "x": 42,
    //       "y": undefined,
    //       "z": undefined,
    //     },
    //     "D": {},
    //   }
    // `)

  })

  vi.it('temp 2', () => {
    const PATH_01 = zx.classic.parsePath(z.union([
      z.object({
        tag: z.literal(7000),
        M: z.set(z.array(z.number()))
      }),
      z.object({
        tag: z.literal(8000),
      }),
    ]), 'ꖛ7000')

    vi.expect.soft(PATH_01).toMatchInlineSnapshot
      (`
      [
        Symbol(@traversable/schema/URI::union),
        0,
      ]
    `)

    const PATH_02 = zx.classic.parsePath(z.union([
      z.object({
        tag: z.literal(7000),
        M: z.set(z.array(z.number()))
      }),
      z.object({
        tag: z.literal(8000),
      }),
    ]), 'ꖛ7000', 'tag')
    vi.expect.soft(PATH_02).toMatchInlineSnapshot
      (`
      [
        Symbol(@traversable/schema/URI::union),
        0,
        Symbol(@traversable/schema/URI::object),
        "tag",
      ]
    `)

    const PATH_03 = zx.classic.parsePath(z.tuple([
      z.union([
        z.object({
          tag: z.literal(7000),
          M: z.set(z.array(z.number()))
        }),
        z.object({
          tag: z.literal(8000),
        }),
      ])
    ]), '0', 'ꖛ7000', 'tag')

    vi.expect.soft(PATH_03).toMatchInlineSnapshot
      (`
      [
        Symbol(@traversable/schema/URI::tuple),
        0,
        Symbol(@traversable/schema/URI::union),
        0,
        Symbol(@traversable/schema/URI::object),
        "tag",
      ]
    `)

    const PATH_04 = zx.classic.parsePath(z.tuple([
      z.union([
        z.object({
          tag: z.literal(7000),
          M: z.set(z.array(z.number()))
        }),
        z.object({
          tag: z.literal(8000),
        }),
      ])
    ]), '0', 'ꖛ8000', 'tag')

    vi.expect.soft(PATH_04).toMatchInlineSnapshot
      (`
      [
        Symbol(@traversable/schema/URI::tuple),
        0,
        Symbol(@traversable/schema/URI::union),
        1,
        Symbol(@traversable/schema/URI::object),
        "tag",
      ]
    `)

    const PATH_05 = zx.classic.parsePath(
      z.object({
        a: z.tuple([
          z.union([
            z.object({
              tag: z.literal(7000),
              M: z.set(z.array(z.number()))
            }),
            z.object({
              tag: z.literal(8000),
            }),
          ])
        ])
      }), 'a', '0', 'ꖛ7000', 'tag')

    vi.expect.soft(PATH_05).toMatchInlineSnapshot
      (`
      [
        Symbol(@traversable/schema/URI::object),
        "a",
        Symbol(@traversable/schema/URI::tuple),
        0,
        Symbol(@traversable/schema/URI::union),
        0,
        Symbol(@traversable/schema/URI::object),
        "tag",
      ]
    `)

    const PATH_06 = zx.classic.parsePath(
      z.object({
        a: z.optional(
          z.tuple([
            z.union([
              z.object({
                tag: z.literal(7000),
                M: z.set(z.array(z.number()))
              }),
              z.object({
                tag: z.literal(8000),
              }),
            ])
          ])
        )
      }), 'a', 'ǃ', '0', 'ꖛ7000', 'tag')

    vi.expect.soft(PATH_06).toMatchInlineSnapshot
      (`
      [
        Symbol(@traversable/schema/URI::object),
        "a",
        Symbol(@traversable/schema/URI::coalesce),
        Symbol(@traversable/schema/URI::tuple),
        0,
        Symbol(@traversable/schema/URI::union),
        0,
        Symbol(@traversable/schema/URI::object),
        "tag",
      ]
    `)


    const RESULT_115 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string[]>()
        return focus
      }
    )({ D: {} })

    /**
     * TODO: turn this test back on
     */
    // vi.assert.deepEqual(RESULT_115, {
    //   "D": {
    //     "E": [
    //       {
    //         "G": {
    //           "L": [],
    //           "M": new globalThis.Set([[]]),
    //           "tag": 7000,
    //         },
    //       },
    //     ] as never,
    //   },
    // })


    // const TEMP_LENS = zx.classic.makeLens(
    //   z.union([
    //     z.object({
    //       tag: z.literal(7000),
    //       M: z.set(z.array(z.number()))
    //     }),
    //     z.object({
    //       tag: z.literal(8000),
    //     }),
    //   ]),
    //   (proxy) => proxy.ꖛ7000
    // )

    // const LENS_002 = zx.classic.makeLens(
    //   z.object({
    //     A: z.union([
    //       z.object({
    //         tag_level_1: z.literal('LEVEL_ONE_A'),
    //         onOneA: z.union([
    //           z.object({
    //             tag_level_2A: z.literal('LEVEL_TWOA_A'),
    //             onTwoA_A: z.object({
    //               U: z.literal('U'),
    //               asdd: z.symbol()
    //             }),
    //           }),
    //           z.object({
    //             tag_level_2A: z.literal('LEVEL_TWOA_B'),
    //             onTwoA_B: z.object({
    //               V: z.literal('V'),
    //               dsfsa: z.number(),
    //             })
    //           })
    //         ]),
    //       }),
    //       z.object({
    //         tag_level_1: z.literal('LEVEL_ONE_B'),
    //         onOneB: z.union([
    //           z.object({
    //             tag_level_2B: z.literal('LEVEL_TWOB_A'),
    //             onTwoB_A: z.object({
    //               W: z.literal('W'),
    //               sdfawe: z.boolean(),
    //             }),
    //           }),
    //           z.object({
    //             tag_level_2B: z.literal('LEVEL_TWOB_B'),
    //             onTwoB_B: z.object({
    //               X: z.literal('X'),
    //               sdgwaer: z.number(),
    //             })
    //           })
    //         ]),
    //       }),
    //     ])
    //   }),
    //   (proxy) => proxy.A.ꖛLEVEL_ONE_A.onOneA.ꖛLEVEL_TWOA_A
    // )

    // vi.expect.soft(LENS_002.modify(
    //   (focus) => [focus],
    //   { A: { tag_level_1: 'LEVEL_ONE_B', onOneB: { tag_level_2B: 'LEVEL_TWOB_B', onTwoB_B: { sdgwaer: 0, X: 'X' } } } }
    // )).toMatchInlineSnapshot
    //   (`
    //   {
    //     "A": {
    //       "onOneB": {
    //         "onTwoB_B": {
    //           "X": "X",
    //           "sdgwaer": 0,
    //         },
    //         "tag_level_2B": "LEVEL_TWOB_B",
    //       },
    //       "tag_level_1": "LEVEL_ONE_B",
    //     },
    //   }
    // `)

    //   vi.expect.soft(RESULT_115).toMatchInlineSnapshot
    //     (`
    //     {
    //       "D": {
    //         "E": [
    //           {
    //             "G": {
    //               "L": [],
    //               "M": Set {
    //                 [],
    //               },
    //               "tag": 7000,
    //             },
    //           },
    //         ],
    //       },
    //     }
    //   `)

  })

  const Schema_01 = z.object({
    E: z.optional(
      z.array(
        z.object({
          F: z.number(),
          G: z.union([
            z.object({
              tag: z.literal(7000),
              L: z.optional(z.number().array()),
              M: z.set(z.array(z.string())),
            }),
            z.object({
              tag: z.literal(8000),
            }),
            z.object({
              tag: z.literal(9000),
            }),
          ])
        })
      )
    )
  })

  const Schema_02 = z.object({
    E: z.optional(
      z.array(
        z.object({
          F: z.number(),
          G: z.union([
            z.object({
              tag: z.literal(7000),
              L: z.optional(z.number().array()),
              M: z.set(z.array(z.string())),
              N: z.union([
                z.object({
                  nestedTag: z.literal(10_000),
                  on10_000: z.array(z.boolean()),
                }),
                z.object({
                  nestedTag: z.literal(11_000),
                  on11_000: z.object({ O: z.boolean() }),
                }),
              ])
            }),
            z.object({
              tag: z.literal(8000),
            }),
            z.object({
              tag: z.literal(9000),
            }),
          ])
        })
      )
    )
  })

  const Schema_03 = z.optional(
    z.union([
      z.object({
        tagA: z.literal('one'),
        one: z.union([
          z.object({
            tagB: z.literal('three'),
            three: z.union([
              z.object({
                tagC: z.literal('seven'),
                seven: z.object({
                  a: z.number(),
                  b: z.string(),
                  c: z.boolean(),
                })
              }),
              z.object({
                tagC: z.literal('eight'),
                eight: z.object({
                  d: z.number(),
                  e: z.string(),
                  f: z.boolean(),
                })
              })
            ])
          }),
          z.object({
            tagB: z.literal('four'),
            four: z.union([
              z.object({
                tagC: z.literal('nine'),
                nine: z.object({
                  g: z.number(),
                  h: z.string(),
                  i: z.boolean(),
                })
              }),
              z.object({
                tagC: z.literal('ten'),
                ten: z.object({
                  j: z.number(),
                  k: z.string(),
                  l: z.boolean(),
                })
              })
            ])
          })
        ]),
      }),
      z.object({
        tagA: z.literal('two'),
        two: z.union([
          z.object({
            tagB: z.literal('five'),
            five: z.union([
              z.object({
                tagC: z.literal('eleven'),
                eleven: z.object({
                  m: z.number(),
                  n: z.string(),
                  o: z.boolean(),
                }),
              }),
              z.object({
                tagC: z.literal('twelve'),
                twelve: z.object({
                  p: z.number(),
                  q: z.string(),
                  r: z.boolean(),
                }),
              }),
            ])
          }),
          z.object({
            tagC: z.literal('six'),
            six: z.union([
              z.object({
                tagC: z.literal('thirteen'),
                thirteen: z.object({
                  s: z.number(),
                  t: z.string(),
                  u: z.boolean(),
                }),
              }),
              z.object({
                tagC: z.literal('fourteen'),
                fourteen: z.object({
                  v: z.number(),
                  w: z.string(),
                  x: z.boolean(),
                }),
              })
            ])
          })
        ])
      }),
    ])
  )

  vi.it.only('zx.classic.getFallback', () => {
    vi.expect.soft(zx.classic.getFallback(Schema_03)).toMatchInlineSnapshot
      (`undefined`)

    vi.expect.soft(zx.classic.getFallback(Schema_03, symbol.coalesce)).toMatchInlineSnapshot
      (`undefined`)

    vi.expect.soft(zx.classic.getFallback(Schema_03, symbol.coalesce, symbol.union, 0)).toMatchInlineSnapshot
      (`
      {
        "one": {
          "tagB": "three",
          "three": {
            "seven": {
              "a": undefined,
              "b": undefined,
              "c": undefined,
            },
            "tagC": "seven",
          },
        },
        "tagA": "one",
      }
    `)

    vi.expect.soft(zx.classic.getFallback(Schema_03, symbol.coalesce, symbol.union, 1)).toMatchInlineSnapshot
      (`
      {
        "tagA": "two",
        "two": {
          "five": {
            "eleven": {
              "m": undefined,
              "n": undefined,
              "o": undefined,
            },
            "tagC": "eleven",
          },
          "tagB": "five",
        },
      }
    `)

    vi.expect.soft(zx.classic.getFallback(Schema_03, symbol.coalesce, symbol.union, 0, symbol.object, 'one')).toMatchInlineSnapshot
      (`
      {
        "one": undefined,
        "tagA": "one",
      }
    `)

    vi.expect.soft(zx.classic.getFallback(Schema_03, symbol.coalesce, symbol.union, 0, symbol.object, 'one', symbol.union, 0)).toMatchInlineSnapshot
      (`
      {
        "one": {
          "tagB": "three",
          "three": {
            "seven": {
              "a": undefined,
              "b": undefined,
              "c": undefined,
            },
            "tagC": "seven",
          },
        },
        "tagA": "one",
      }
    `)


    // vi.expect.soft(zx.classic.getFallback(Schema_01)).toMatchInlineSnapshot
    //   (`undefined`)

    // vi.expect.soft(zx.classic.getFallback(Schema_01, symbol.object, 'E')).toMatchInlineSnapshot
    //   (`undefined`)

    // vi.expect.soft(zx.classic.getFallback(Schema_01, symbol.object, 'E', symbol.coalesce, symbol.array)).toMatchInlineSnapshot
    //   (`
    //   [
    //     {
    //       "F": undefined,
    //       "G": undefined,
    //     },
    //   ]
    // `)

    // vi.expect.soft(
    //   zx.classic.getFallback(
    //     Schema_01,
    //     symbol.object,
    //     'E',
    //     symbol.coalesce,
    //     symbol.array,
    //     symbol.object,
    //     'G',
    //     symbol.union,
    //     0,
    //   )
    // ).toMatchInlineSnapshot
    //   (`
    //   [
    //     {
    //       "F": undefined,
    //       "G": {
    //         "L": [],
    //         "M": Set {
    //           [],
    //         },
    //         "tag": 7000,
    //       },
    //     },
    //   ]
    // `)

    // vi.expect.soft(
    //   zx.classic.getFallback(
    //     Schema_01,
    //     symbol.object,
    //     'E',
    //     symbol.coalesce,
    //     symbol.array,
    //     symbol.object,
    //     'G',
    //     symbol.union,
    //     0,
    //     symbol.object,
    //     'M',
    //   )
    // ).toMatchInlineSnapshot
    //   (`
    //   [
    //     {
    //       "F": undefined,
    //       "G": {
    //         "L": [],
    //         "M": Set {
    //           [],
    //         },
    //         "tag": 7000,
    //       },
    //     },
    //   ]
    // `)

    // vi.expect.soft(
    //   zx.classic.getFallback(
    //     Schema_02,
    //     symbol.object,
    //     'E',
    //     symbol.coalesce,
    //     symbol.array,
    //     symbol.object,
    //     'G',
    //     symbol.union,
    //     0,
    //     symbol.object,
    //     'N',
    //     symbol.union,
    //     0,
    //   )
    // ).toMatchInlineSnapshot
    //   (`
    //   [
    //     {
    //       "F": undefined,
    //       "G": {
    //         "L": [],
    //         "M": Set {
    //           [],
    //         },
    //         "N": {
    //           "nestedTag": 10000,
    //           "on10_000": [],
    //         },
    //         "tag": 7000,
    //       },
    //     },
    //   ]
    // `)

    // vi.expect.soft(
    //   zx.classic.getFallback(
    //     Schema_02,
    //     symbol.object,
    //     'E',
    //     symbol.coalesce,
    //     symbol.array,
    //     symbol.object,
    //     'G',
    //     symbol.union,
    //     0,
    //     symbol.object,
    //     'N',
    //     symbol.union,
    //     1,
    //   )
    // ).toMatchInlineSnapshot
    //   (`
    //   [
    //     {
    //       "F": undefined,
    //       "G": {
    //         "L": [],
    //         "M": Set {
    //           [],
    //         },
    //         "N": {
    //           "nestedTag": 11000,
    //           "on11_000": {
    //             "O": undefined,
    //           },
    //         },
    //         "tag": 7000,
    //       },
    //     },
    //   ]
    // `)


  })

  vi.it('zx.classic.getSubSchema', () => {

    vi.expect.soft(zx.classic.getSubSchema(Schema_01)._zod.def.type).toMatchInlineSnapshot
      (`"object"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"optional"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.optional,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"array"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"array"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"object"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'F',
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"number"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
      )._zod.def.type).toMatchInlineSnapshot
      (`"union"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        0,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"object"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        0,
        symbol.object,
        'tag',
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"literal"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        0,
        symbol.object,
        'L',
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"optional"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        0,
        symbol.object,
        'L',
        symbol.optional,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"array"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        0,
        symbol.object,
        'L',
        symbol.optional,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"array"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        0,
        symbol.object,
        'L',
        symbol.optional,
        symbol.array,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"number"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        0,
        symbol.object,
        'M',
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"set"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        0,
        symbol.object,
        'M',
        symbol.set,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"array"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        0,
        symbol.object,
        'M',
        symbol.set,
        symbol.array,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"string"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        1,
      )._zod.def.type).toMatchInlineSnapshot
      (`"object"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        1,
        symbol.object,
        'tag',
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"literal"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        1,
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"object"`)

    vi.expect.soft(
      zx.classic.getSubSchema(
        Schema_01,
        symbol.object,
        'E',
        symbol.coalesce,
        symbol.array,
        symbol.object,
        'G',
        symbol.union,
        1,
        symbol.object,
        'tag',
      )._zod.def.type
    ).toMatchInlineSnapshot
      (`"literal"`)
  })


  vi.it('〖⛳️〗› ❲zx.classic.getSchemaCursor❳', () => {
    // zx.classic.getSchemaCursor(z.record(z.enum(['X', 'Y']), z.union([z.object({ A: z.literal('a') }), z.object({ B: z.literal('b') })])), 'x')

    zx.classic.makeLens(
      z.record(z.enum(['X', 'Y']), z.union([z.object({ A: z.literal('a') }), z.object({ B: z.literal('b') })])),
      (proxy) => proxy.X.ꖛ0
    )

    //
    // 'A'
    // A.ʔ
    // A.ʔ.ꖛ0
    // A.ʔ.ꖛ1
    // A.ʔ.ꖛ2
    // A.ʔ.ꖛ2.x
    // A.ʔ.ꖛ2.x.ʔ
    // A.ʔ.ꖛ2.x.ʔ.ꖛ0
    // A.ʔ.ꖛ2.x.ǃ
    // A.ʔ.ꖛ2.x.ǃ.ꖛ0
    // A.ʔ.ꖛ2.x.ǃ.ꖛ1
    // A.ʔ.ꖛ2.y
    // A.ʔ.ꖛ2.y.ʔ
    // A.ʔ.ꖛ2.y.ʔ.ꖛ0
    // A.ʔ.ꖛ2.y.ʔ.ꖛ1
    // A.ʔ.ꖛ2.y.ǃ
    // A.ʔ.ꖛ2.y.ǃ.ꖛ0
    // A.ʔ.ꖛ2.y.ǃ.ꖛ1
    // A.ʔ.ꖛ2.z
    // A.ʔ.ꖛ2.z.ʔ
    // A.ʔ.ꖛ2.z.ʔ.ꖛ0
    // A.ʔ.ꖛ2.z.ʔ.ꖛ1
    // A.ʔ.ꖛ2.z.ǃ
    // A.ʔ.ꖛ2.z.ǃ.ꖛ0
    // A.ʔ.ꖛ2.z.ǃ.ꖛ1
    // A.ʔ.ꖛ2.ᣔꓸꓸ
    // A.ʔ.ꖛ2.ᣔꓸꓸ.ʔ
    // A.ʔ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ0
    // A.ʔ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ1
    // A.ʔ.ꖛ2.ᣔꓸꓸ.ǃ
    // A.ʔ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ0
    // A.ʔ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ1
    // A.ǃ
    // A.ǃ.ꖛ0
    // A.ǃ.ꖛ1
    // A.ǃ.ꖛ2
    // A.ǃ.ꖛ2.x
    // A.ǃ.ꖛ2.x.ʔ
    // A.ǃ.ꖛ2.x.ʔ.ꖛ0
    // A.ǃ.ꖛ2.x.ǃ
    // A.ǃ.ꖛ2.x.ǃ.ꖛ0
    // A.ǃ.ꖛ2.x.ǃ.ꖛ1
    // A.ǃ.ꖛ2.y
    // A.ǃ.ꖛ2.y.ʔ
    // A.ǃ.ꖛ2.y.ʔ.ꖛ0
    // A.ǃ.ꖛ2.y.ʔ.ꖛ1
    // A.ǃ.ꖛ2.y.ǃ
    // A.ǃ.ꖛ2.y.ǃ.ꖛ0
    // A.ǃ.ꖛ2.y.ǃ.ꖛ1
    // A.ǃ.ꖛ2.z
    // A.ǃ.ꖛ2.z.ʔ
    // A.ǃ.ꖛ2.z.ʔ.ꖛ0
    // A.ǃ.ꖛ2.z.ʔ.ꖛ1
    // A.ǃ.ꖛ2.z.ǃ
    // A.ǃ.ꖛ2.z.ǃ.ꖛ0
    // A.ǃ.ꖛ2.z.ǃ.ꖛ1
    // A.ǃ.ꖛ2.ᣔꓸꓸ
    // A.ǃ.ꖛ2.ᣔꓸꓸ.ʔ
    // A.ǃ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ0
    // A.ǃ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ1
    // A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ
    // A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ0
    // A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ1
    // B
    // B.ǃ
    // B.ǃ.ᣔꓸꓸ
    // B.ǃ.ᣔꓸꓸ[0]
    // B.ǃ.ᣔꓸꓸ[1]
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.discriminant
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.radius
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.discriminant
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.length
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.width
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.discriminent
    // B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.length
    // B.ʔ
    // B.ʔ.ᣔꓸꓸ
    // B.ʔ.ᣔꓸꓸ[0]
    // B.ʔ.ᣔꓸꓸ[1]
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.discriminant
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.radius
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.discriminant
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.length
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.width
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.discriminent
    // B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.length
    // C
    // C.ǃ
    // C.ǃ[0]
    // C.ǃ[0].J
    // C.ǃ[0].K
    // C.ǃ[0].K.ǃ
    // C.ǃ[0].K.ʔ
    // C.ʔ
    // C.ʔ[0]
    // C.ʔ[0].J
    // C.ʔ[0].K
    // C.ʔ[0].K.ʔ
    // C.ʔ[0].K.ǃ
    // D
    // D.E
    // D.E.ǃ
    // D.E.ǃ.ᣔꓸꓸ
    // D.E.ǃ.ᣔꓸꓸ.F
    // D.E.ǃ.ᣔꓸꓸ.G
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ.ᣔꓸꓸ
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ.ᣔꓸꓸ
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.M
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ.ᣔꓸꓸ
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.tag
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ8000
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ8000.tag
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ9000
    // D.E.ǃ.ᣔꓸꓸ.G.ꖛ9000.tag
    // D.E.ʔ
    // D.E.ʔ.ᣔꓸꓸ
    // D.E.ʔ.ᣔꓸꓸ.F
    // D.E.ʔ.ᣔꓸꓸ.G
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ.ᣔꓸꓸ
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ.ᣔꓸꓸ
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.M
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ.ᣔꓸꓸ
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.tag
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ8000
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ8000.tag
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ9000
    // D.E.ʔ.ᣔꓸꓸ.G.ꖛ9000.tag
    // vi.expect.soft(zx.classic.getSchemaCursor(z.))
  })

  vi.it('〖⛳️〗› ❲zx.classic.makeLens❳: types', () => {
    zx.classic.makeLens(
      z.object({}),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<Record<string, never>>()
        //              ^?
      },
      {}
    )

    zx.classic.makeLens(
      z.object({ ABC: z.optional(z.object({ DEF: z.optional(z.object({ GHI: z.optional(z.literal(1)) })) })) }),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ ABC?: { DEF?: { GHI?: 1 } } }>()
        //              ^?
      },
      {}
    )

    zx.classic.makeLens(
      z.object({ ABC: z.optional(z.object({ DEF: z.optional(z.object({ GHI: z.optional(z.literal(1)) })) })) }),
      (proxy) => proxy.ABC
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ DEF?: { GHI?: 1 } } | undefined>()
        //              ^?
      },
      {}
    )

    vi.expect.soft(
      zx.classic.makeLens(
        z.object({
          ABC: z.optional(
            z.array(
              z.object({
                DEF: z.optional(
                  z.array(
                    z.object({
                      GHI: z.optional(z.array(z.number()))
                    })
                  )
                )
              })
            )
          )
        }),
        // (proxy) => proxy.ABC
        (proxy) => proxy.ABC.ǃ
      ).set(
        [],
        { ABC: undefined },
      )
    ).toMatchInlineSnapshot
      (`
      {
        "ABC": [],
      }
    `)


    zx.classic.makeLens(
      z.object({ ABC: z.optional(z.object({ DEF: z.optional(z.object({ GHI: z.optional(z.literal(1)) })) })) }),
      (proxy) => proxy.ABC.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ DEF?: { GHI?: 1 } }>()
        //              ^?
        return focus
      },
      {}
    )

    zx.classic.makeLens(
      z.object({ ABC: z.optional(z.object({ DEF: z.optional(z.object({ GHI: z.optional(z.literal(1)) })) })) }),
      (proxy) => proxy.ABC.ʔ.DEF
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ GHI?: 1 } | undefined>()
        //              ^?
        return focus
      },
      {}
    )

    zx.classic.makeLens(
      z.object({ ABC: z.optional(z.object({ DEF: z.optional(z.object({ GHI: z.optional(z.literal(1)) })) })) }),
      (proxy) => proxy.ABC.ʔ.DEF.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ GHI?: 1 }>()
        //              ^?
        return focus
      },
      {}
    )

    zx.classic.makeLens(
      z.object({ ABC: z.optional(z.object({ DEF: z.optional(z.object({ GHI: z.optional(z.literal(1)) })) })) }),
      (proxy) => proxy.ABC.ʔ.DEF.ʔ.GHI
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<1 | undefined>()
        //              ^?
        return focus
      },
      {}
    )

    zx.classic.makeLens(
      z.object({ ABC: z.optional(z.object({ DEF: z.optional(z.object({ GHI: z.optional(z.literal(1)) })) })) }),
      (proxy) => proxy.ABC.ʔ.DEF.ʔ.GHI.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<1>()
        //              ^?
        return focus
      },
      {}
    )

    zx.classic.makeLens(
      z.tuple([]),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[]>()
        //              ^?
      },
      []
    )

    zx.classic.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[1, [2, [3, [4]]]]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<1>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[2, [3, [4]]]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<2>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[3, [4]]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][1][0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<3>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][1][1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[4]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][1][1][0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<4>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<1 | undefined>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[_?: 2, _?: [_?: 3, _?: [_?: 4]]] | undefined>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[_?: 2, _?: [_?: 3, _?: [_?: 4]]]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<2 | undefined>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[0].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<2>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[_?: 3, _?: [_?: 4]] | undefined>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[1].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[_?: 3, _?: [_?: 4]]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[1].ʔ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<3 | undefined>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[1].ʔ[0].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<3>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[1].ʔ[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[_?: 4] | undefined>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[1].ʔ[1].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[_?: 4]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[1].ʔ[1].ʔ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<4 | undefined>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.tuple([
            z.optional(z.literal(2)),
            z.optional(
              z.tuple([
                z.optional(z.literal(3)),
                z.optional(z.tuple([z.optional(z.literal(4))]))
              ])
            )
          ])
        )]
      ),
      (proxy) => proxy[1].ʔ[1].ʔ[1].ʔ[0].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<4>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            [
              _?: 1,
              _?: {
                ABC?: [
                  _?: 2,
                  _?: {
                    DEF?: [
                      _?: 3,
                      _?: {
                        GHI?: [_?: 4]
                      }
                    ]
                  }
                ]
              }
            ]
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            undefined | {
              ABC?: [
                _?: 2,
                _?: {
                  DEF?: [
                    _?: 3,
                    _?: {
                      GHI?: [
                        _?: 4
                      ]
                    }
                  ]
                }
              ]
            }
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            {
              ABC?: [
                _?: 2,
                _?: {
                  DEF?: [
                    _?: 3,
                    _?: {
                      GHI?: [
                        _?: 4
                      ]
                    }
                  ]
                }
              ]
            }
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            | undefined
            | [
              _?: 2,
              _?: {
                DEF?: [
                  _?: 3,
                  _?: {
                    GHI?: [
                      _?: 4
                    ]
                  }
                ]
              }
            ]
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            [
              _?: 2,
              _?: {
                DEF?: [
                  _?: 3,
                  _?: {
                    GHI?: [
                      _?: 4
                    ]
                  }
                ]
              }
            ]
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<2 | undefined>()
        //              ^?
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            | undefined
            | {
              DEF?: [
                _?: 3,
                _?: {
                  GHI?: [
                    _?: 4
                  ]
                }
              ]
            }
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            {
              DEF?: [
                _?: 3,
                _?: {
                  GHI?: [
                    _?: 4
                  ]
                }
              ]
            }
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1].ʔ.DEF
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            | undefined
            | [
              _?: 3,
              _?: {
                GHI?: [
                  _?: 4
                ]
              }
            ]
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1].ʔ.DEF.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            [
              _?: 3,
              _?: {
                GHI?: [
                  _?: 4
                ]
              }
            ]
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1].ʔ.DEF.ʔ[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          //            ^?
          <
            | undefined
            | {
              GHI?: [
                _?: 4
              ]
            }
          >()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1].ʔ.DEF.ʔ[1].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ GHI?: [_?: 4] }>()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1].ʔ.DEF.ʔ[1].ʔ.GHI
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<undefined | [_?: 4]>()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1].ʔ.DEF.ʔ[1].ʔ.GHI.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[_?: 4]>()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1].ʔ.DEF.ʔ[1].ʔ.GHI.ʔ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<4 | undefined>()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.tuple([
        z.optional(z.literal(1)),
        z.optional(
          z.object({
            ABC: z.optional(
              z.tuple([
                z.optional(z.literal(2)),
                z.optional(
                  z.object({
                    DEF: z.optional(
                      z.tuple([
                        z.optional(z.literal(3)),
                        z.optional(
                          z.object({
                            GHI: z.optional(
                              z.tuple([
                                z.optional(z.literal(4)),
                              ])
                            )
                          })
                        )
                      ])
                    )
                  })
                )
              ])
            )
          })
        )
      ]),
      (proxy) => proxy[1].ʔ.ABC.ʔ[1].ʔ.DEF.ʔ[1].ʔ.GHI.ʔ[0].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<4>()
      },
      [1, { ABC: [2, { DEF: [3, { GHI: [4] }] }] }]
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            globalThis.Array<
              | undefined
              | [
                _?: {
                  ABC: globalThis.Array<
                    | undefined
                    | [
                      _?: 2,
                      _?: {
                        DEF: globalThis.Array<
                          | undefined
                          | [
                            _?: 3,
                            _?: {
                              GHI: globalThis.Array<
                                | undefined
                                | [_?: 4]
                              >
                            }
                          ]
                        >
                      }
                    ]
                  >
                }
              ]
            >
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            | undefined
            | [
              _?: {
                ABC: globalThis.Array<
                  | undefined
                  | [
                    _?: 2,
                    _?: {
                      DEF: globalThis.Array<
                        | undefined
                        | [
                          _?: 3,
                          _?: {
                            GHI: globalThis.Array<
                              | undefined
                              | [_?: 4]
                            >
                          }
                        ]
                      >
                    }
                  ]
                >
              }
            ]
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            [
              _?: {
                ABC: globalThis.Array<
                  | undefined
                  | [
                    _?: 2,
                    _?: {
                      DEF: globalThis.Array<
                        | undefined
                        | [
                          _?: 3,
                          _?: {
                            GHI: globalThis.Array<
                              | undefined
                              | [_?: 4]
                            >
                          }
                        ]
                      >
                    }
                  ]
                >
              }
            ]
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            | undefined
            | {
              ABC: globalThis.Array<
                | undefined
                | [
                  _?: 2,
                  _?: {
                    DEF: globalThis.Array<
                      | undefined
                      | [
                        _?: 3,
                        _?: {
                          GHI: globalThis.Array<
                            | undefined
                            | [_?: 4]
                          >
                        }
                      ]
                    >
                  }
                ]
              >
            }
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              ABC: globalThis.Array<
                | undefined
                | [
                  _?: 2,
                  _?: {
                    DEF: globalThis.Array<
                      | undefined
                      | [
                        _?: 3,
                        _?: {
                          GHI: globalThis.Array<
                            | undefined
                            | [_?: 4]
                          >
                        }
                      ]
                    >
                  }
                ]
              >
            }
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            | undefined
            | [
              _?: 2,
              _?: {
                DEF: globalThis.Array<
                  | undefined
                  | [
                    _?: 3,
                    _?: {
                      GHI: globalThis.Array<
                        | undefined
                        | [_?: 4]
                      >
                    }
                  ]
                >
              }
            ]
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            [
              _?: 2,
              _?: {
                DEF: globalThis.Array<
                  | undefined
                  | [
                    _?: 3,
                    _?: {
                      GHI: globalThis.Array<
                        | undefined
                        | [_?: 4]
                      >
                    }
                  ]
                >
              }
            ]
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            | undefined
            | {
              DEF: globalThis.Array<
                | undefined
                | [
                  _?: 3,
                  _?: {
                    GHI: globalThis.Array<
                      | undefined
                      | [_?: 4]
                    >
                  }
                ]
              >
            }
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              DEF: globalThis.Array<
                | undefined
                | [
                  _?: 3,
                  _?: {
                    GHI: globalThis.Array<
                      | undefined
                      | [_?: 4]
                    >
                  }
                ]
              >
            }
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            globalThis.Array<
              | undefined
              | [
                _?: 3,
                _?: {
                  GHI: globalThis.Array<
                    | undefined
                    | [_?: 4]
                  >
                }
              ]
            >
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            | undefined
            | [
              _?: 3,
              _?: {
                GHI: globalThis.Array<
                  | undefined
                  | [_?: 4]
                >
              }
            ]
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            [
              _?: 3,
              _?: {
                GHI: globalThis.Array<
                  | undefined
                  | [_?: 4]
                >
              }
            ]
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            | undefined
            | {
              GHI: globalThis.Array<
                | undefined
                | [_?: 4]
              >
            }
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ[1].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              GHI: globalThis.Array<
                | undefined
                | [_?: 4]
              >
            }
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ[1].ʔ.GHI
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            globalThis.Array<
              | undefined
              | [_?: 4]
            >
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ[1].ʔ.GHI.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            | undefined
            | [_?: 4]
          >()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ[1].ʔ.GHI.ᣔꓸꓸ.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[_?: 4]>()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ[1].ʔ.GHI.ᣔꓸꓸ.ʔ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<4 | undefined>()
      },
      []
    )

    zx.classic.makeLens(
      z.array(
        z.optional(
          z.tuple([
            z.optional(
              z.object({
                ABC: z.array(
                  z.optional(
                    z.tuple([
                      z.optional(z.literal(2)),
                      z.optional(
                        z.object({
                          DEF: z.array(
                            z.optional(
                              z.tuple([
                                z.optional(z.literal(3)),
                                z.optional(
                                  z.object({
                                    GHI: z.array(
                                      z.optional(
                                        z.tuple([
                                          z.optional(z.literal(4)),
                                        ])
                                      )
                                    )
                                  })
                                )
                              ])
                            )
                          )
                        })
                      )
                    ])
                  )
                )
              })
            )
          ])
        )
      ),
      (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ[1].ʔ.GHI.ᣔꓸꓸ.ʔ[0].ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<4>()
      },
      []
    )

  })

  vi.it('〖⛳️〗› ❲zx.classic.makeLens❳: terms', () => {

    vi.expect.soft(
      zx.classic.makeLens(
        z.array(
          z.optional(
            z.tuple([
              z.optional(
                z.object({
                  ABC: z.array(
                    z.optional(
                      z.tuple([
                        z.optional(z.literal(2)),
                        z.optional(
                          z.object({
                            DEF: z.array(
                              z.optional(
                                z.tuple([
                                  z.optional(z.literal(3)),
                                  z.optional(
                                    z.object({
                                      GHI: z.array(
                                        z.optional(
                                          z.tuple([
                                            z.optional(z.literal(4)),
                                          ])
                                        )
                                      )
                                    })
                                  )
                                ])
                              )
                            )
                          })
                        )
                      ])
                    )
                  )
                })
              )
            ])
          )
        ),
        (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ[1].ʔ.GHI.ᣔꓸꓸ.ʔ[0].ʔ
      ).modify(
        (focus) => focus * 100,
        [
          [
            {
              ABC: [
                [
                  2,
                  {
                    DEF: [
                      [
                        3,
                        { GHI: [] },
                      ],
                      [
                        3,
                        { GHI: [[4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4]] },
                      ],
                    ]
                  }
                ],
                [
                  2,
                  {
                    DEF: [
                      [
                        3,
                        { GHI: [[4], [4], [4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4], [4]] },
                      ],
                    ]
                  }
                ]
              ]
            }
          ],
          [
            {
              ABC: [
                [
                  2,
                  {
                    DEF: [
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4], [4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4], [4], [4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4], [4], [4], [4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4]] },
                      ],
                    ]
                  }
                ],
                [
                  2,
                  {
                    DEF: [
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4], [4]] },
                      ],
                    ]
                  }
                ]
              ]
            }
          ]
        ]
      )
    ).toMatchInlineSnapshot
      (`
      [
        [
          {
            "ABC": [
              [
                2,
                {
                  "DEF": [
                    [
                      3,
                      {
                        "GHI": [],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                  ],
                },
              ],
              [
                2,
                {
                  "DEF": [
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        ],
        [
          {
            "ABC": [
              [
                2,
                {
                  "DEF": [
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                  ],
                },
              ],
              [
                2,
                {
                  "DEF": [
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": [
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                          [
                            400,
                          ],
                        ],
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        ],
      ]
    `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.array(
          z.optional(
            z.tuple([
              z.optional(
                z.object({
                  ABC: z.array(
                    z.optional(
                      z.tuple([
                        z.optional(z.literal(2)),
                        z.optional(
                          z.object({
                            DEF: z.array(
                              z.optional(
                                z.tuple([
                                  z.optional(z.literal(3)),
                                  z.optional(
                                    z.object({
                                      GHI: z.array(
                                        z.optional(
                                          z.tuple([
                                            z.optional(z.literal(4)),
                                          ])
                                        )
                                      )
                                    })
                                  )
                                ])
                              )
                            )
                          })
                        )
                      ])
                    )
                  )
                })
              )
            ])
          )
        ),
        (proxy) => proxy.ᣔꓸꓸ.ʔ[0].ʔ.ABC.ᣔꓸꓸ.ʔ[1].ʔ.DEF.ᣔꓸꓸ.ʔ[1].ʔ.GHI
      ).modify(
        (focus) => ({ RENAMED: focus.map((x) => (x?.[0] ?? 5) ** (x?.[0] ?? 5)) }),
        [
          [
            {
              ABC: [
                [
                  2,
                  {
                    DEF: [
                      [
                        3,
                        { GHI: [] },
                      ],
                      [
                        3,
                        { GHI: [[4]] },
                      ],
                      [
                        3,
                        { GHI: [[], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [], [4]] },
                      ],
                    ]
                  }
                ],
                [
                  2,
                  {
                    DEF: [
                      [
                        3,
                        { GHI: [[], [4], [], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [], [4], [], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[], [4], [], [4], [], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [], [4], [], [4], [], [4]] },
                      ],
                    ]
                  }
                ]
              ]
            }
          ],
          [
            {
              ABC: [
                [
                  2,
                  {
                    DEF: [
                      [
                        3,
                        { GHI: [[], [4], [], [4], [], [4], [], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [], [4], [], [4], [], [4], [], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[], [4], [], [4], [], [4], [], [4], [], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [], [4], [], [4], [], [4], [], [4], [], [4]] },
                      ],
                    ]
                  }
                ],
                [
                  2,
                  {
                    DEF: [
                      [
                        3,
                        { GHI: [[], [4], [], [4], [], [4], [], [4], [], [4], [], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [], [4], [], [4], [], [4], [], [4], [], [4], [], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[], [4], [], [4], [], [4], [], [4], [], [4], [], [4], [], [4]] },
                      ],
                      [
                        3,
                        { GHI: [[4], [], [4], [], [4], [], [4], [], [4], [], [4], [], [4], [], [4]] },
                      ],
                    ]
                  }
                ]
              ]
            }
          ]
        ]
      )
    ).toMatchInlineSnapshot
      (`
      [
        [
          {
            "ABC": [
              [
                2,
                {
                  "DEF": [
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                  ],
                },
              ],
              [
                2,
                {
                  "DEF": [
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        ],
        [
          {
            "ABC": [
              [
                2,
                {
                  "DEF": [
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                  ],
                },
              ],
              [
                2,
                {
                  "DEF": [
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                    [
                      3,
                      {
                        "GHI": {
                          "RENAMED": [
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                            3125,
                            256,
                          ],
                        },
                      },
                    ],
                  ],
                },
              ],
            ],
          },
        ],
      ]
    `)

    const L_01 = zx.classic.makeLens(
      z.object({
        ABC: z.optional(
          z.array(
            z.object({
              DEF: z.boolean()
            })
          )
        )
      }),
      (proxy) => proxy.ABC.ʔ.ᣔꓸꓸ
    )

    // vi.expect.soft(
    //   zx.classic.makeLens(
    //     z.object({
    //       ABC: z.optional(
    //         z.array(
    //           z.object({
    //             DEF: z.boolean()
    //           })
    //         )
    //       )
    //     }),
    //     (proxy) => proxy.ABC.ʔ.ᣔꓸꓸ
    //   ).fallback
    // ).toMatchInlineSnapshot
    //   (`
    //   {
    //     "DEF": undefined,
    //   }
    // `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.object({
          ABC: z.optional(
            z.array(
              z.object({
                DEF: z.boolean()
              })
            )
          )
        }),
        (proxy) => proxy.ABC.ʔ.ᣔꓸꓸ
      ).get(
        {}
      )
    ).toMatchInlineSnapshot
      (`undefined`)

    vi.expect.soft(
      zx.classic.makeLens(
        z.object({
          ABC: z.optional(
            z.array(
              z.object({
                DEF: z.boolean()
              })
            )
          )
        }),
        (proxy) => proxy.ABC.ʔ.ᣔꓸꓸ
      ).get(
        {}
      )
    ).toMatchInlineSnapshot
      (`undefined`)

    vi.expect.soft(
      zx.classic.makeLens(
        z.object({
          ABC: z.optional(
            z.array(
              z.object({
                DEF: z.boolean()
              })
            )
          )
        }),
        (proxy) => proxy.ABC.ʔ.ᣔꓸꓸ
      ).set(
        { DEF: false },
        {
          ABC: [
            { DEF: true },
            { DEF: true }
          ]
        }
      )
    ).toMatchInlineSnapshot
      (`
      {
        "ABC": [
          {
            "DEF": false,
          },
          {
            "DEF": false,
          },
        ],
      }
    `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.object({
          ABC: z.optional(
            z.array(
              z.object({
                DEF: z.boolean()
              })
            )
          )
        }),
        (proxy) => proxy.ABC.ʔ.ᣔꓸꓸ
      ).modify(
        (focus) => ({
          RENAMED: [
            focus.DEF,
            !focus.DEF,
          ]
        }),
        {
          ABC: [
            { DEF: false },
            { DEF: false },
            { DEF: true },
          ]
        }
      )
    ).toMatchInlineSnapshot
      (`
      {
        "ABC": [
          {
            "RENAMED": [
              false,
              true,
            ],
          },
          {
            "RENAMED": [
              false,
              true,
            ],
          },
          {
            "RENAMED": [
              true,
              false,
            ],
          },
        ],
      }
    `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.array(
          z.object({
            ABC: z.array(
              z.object({
                DEF: z.number()
              })
            )
          }),
        ),
        (proxy) => proxy.ᣔꓸꓸ.ABC.ᣔꓸꓸ.DEF
      ).get(
        [
          { ABC: [] },
          {
            ABC: [
              { DEF: 1 }
            ]
          },
          {
            ABC: [
              { DEF: 2 },
              { DEF: 3 },
            ]
          }
        ]
      )
    ).toMatchInlineSnapshot
      (`
      [
        1,
        2,
        3,
      ]
    `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.record(
          z.enum(['A', 'B', 'C']),
          z.object({
            ABC: z.array(
              z.object({
                DEF: z.number()
              })
            )
          }),
        ),
        (proxy) => proxy.ᣔꓸꓸ
      ).modify(
        (focus) => focus.ABC.map((x) => x.DEF),
        {
          A: { ABC: [] },
          B: { ABC: [{ DEF: 1 }, { DEF: 2 }] },
          C: { ABC: [{ DEF: 3 }, { DEF: 4 }, { DEF: 5 }] },
        }
      )
    ).toMatchInlineSnapshot
      (`
      {
        "A": [],
        "B": [
          1,
          2,
        ],
        "C": [
          3,
          4,
          5,
        ],
      }
    `)

    // TODO:
    // vi.expect.soft(
    //   zx.classic.makeLens(
    //     z.record(
    //       z.enum(['A', 'B', 'C']),
    //       z.object({
    //         ABC: z.array(
    //           z.object({
    //             DEF: z.number()
    //           })
    //         )
    //       }),
    //     ),
    //     (proxy) => proxy.C
    //   ).modify(
    //     (focus) => focus.ABC.filter((x) => x.DEF > 4).map((x) => x.DEF),
    //     {
    //       A: { ABC: [] },
    //       B: { ABC: [{ DEF: 1 }, { DEF: 2 }] },
    //       C: { ABC: [{ DEF: 3 }, { DEF: 4 }, { DEF: 5 }] },
    //     }
    //   )
    // ).toMatchInlineSnapshot
    //   (`
    //   {
    //     "A": {
    //       "ABC": [],
    //     },
    //     "B": {
    //       "ABC": [
    //         {
    //           "DEF": 1,
    //         },
    //         {
    //           "DEF": 2,
    //         },
    //       ],
    //     },
    //     "C": [
    //       5,
    //     ],
    //   }
    // `)


    // TODO:
    // vi.expect.soft(
    //   zx.classic.makeLens(
    //     z.object({ ABC: z.optional(z.array(z.object({ DEF: z.optional(z.array(z.object({ GHI: z.optional(z.array(z.number())) }))) }))) }),
    //     (proxy) => proxy.ABC.ǃ
    //   ).modify(
    //     (proxy) => proxy,
    //     { ABC: undefined }
    //   )
    // ).toMatchInlineSnapshot
    //   (`
    //   {
    //     "ABC": [
    //       {
    //         "DEF": [
    //           {
    //             "GHI": [],
    //           },
    //         ],
    //       },
    //     ],
    //   }
    // `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.object({ ABC: z.optional(z.array(z.object({ DEF: z.optional(z.array(z.object({ GHI: z.optional(z.array(z.number())) }))) }))) }),
        (proxy) => proxy.ABC.ʔ
      ).modify(
        (proxy) => proxy,
        { ABC: undefined }
      )
    ).toMatchInlineSnapshot
      (`
      {
        "ABC": undefined,
      }
    `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.object({
          ABC: z.optional(
            z.array(
              z.object({
                DEF: z.optional(
                  z.array(
                    z.object({
                      GHI: z.optional(
                        z.array(
                          z.number()
                        )
                      )
                    })
                  )
                )
              })
            )
          )
        }),
        (proxy) => proxy.ABC.ʔ
      ).set(
        [],
        { ABC: undefined },
      )
    ).toMatchInlineSnapshot
      (`
      {
        "ABC": undefined,
      }
    `)


    vi.expect.soft(
      zx.classic.makeLens(
        z.array(z.array(z.number())),
        (proxy) => proxy.ᣔꓸꓸ
      ).get(
        [[1, 2, 3]]
      )
    )
      .toMatchInlineSnapshot
      (`
        [
          [
            1,
            2,
            3,
          ],
        ]
      `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.record(z.string(), z.array(z.number())),
        (proxy) => proxy.ᣔꓸꓸ
      ).get(
        { a: [1, 2, 3] }
      )
    )
      .toMatchInlineSnapshot
      (`
        {
          "a": [
            [
              1,
              2,
              3,
            ],
          ],
        }
      `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.set(z.array(z.number())),
        (proxy) => proxy.ᣔꓸꓸ
      ).get(
        new Set([[1, 2, 3]])
      )
    )
      .toMatchInlineSnapshot
      (`
        [
          [
            1,
            2,
            3,
          ],
        ]
      `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.union([z.string(), z.number()]),
        (proxy) => proxy.ꖛ0
      ).get('hey')
    ).toMatchInlineSnapshot
      (`"hey"`)

    vi.expect.soft(
      zx.classic.makeLens(
        z.union([z.string(), z.number()]),
        (proxy) => proxy.ꖛ0
      ).get(0)
    ).toMatchInlineSnapshot
      (`undefined`)

    vi.expect.soft(
      zx.classic.makeLens(
        z.array(z.union([z.string(), z.number()])),
        (proxy) => proxy.ᣔꓸꓸ.ꖛ0
      ).get([0, 'ho', 1])
    ).toMatchInlineSnapshot
      (`
      [
        undefined,
        "ho",
        undefined,
      ]
    `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.array(z.union([z.string(), z.number()])),
        (proxy) => proxy.ᣔꓸꓸ.ꖛ1
      ).get([0, 'ho', 1])
    ).toMatchInlineSnapshot
      (`
      [
        0,
        undefined,
        1,
      ]
    `)

    vi.expect.soft(
      zx.classic.makeLens(
        z.union([
          z.object({
            tag: z.literal('A'),
            onA: z.boolean(),
          }),
          z.object({
            tag: z.literal('B'),
            onB: z.string(),
          })
        ]),
        (proxy) => proxy.ꖛB
      ).get({ tag: 'A', onA: true })
    ).toMatchInlineSnapshot
      (`undefined`)

    vi.expect.soft(
      zx.classic.makeLens(
        z.union([
          z.object({
            tag: z.literal('A'),
            onA: z.boolean(),
          }),
          z.object({
            tag: z.literal('B'),
            onB: z.string(),
          })
        ]),
        (proxy) => proxy.ꖛB
      ).get({ tag: 'B', onB: 'BBBB' })
    ).toMatchInlineSnapshot
      (`
      {
        "onB": "BBBB",
        "tag": "B",
      }
    `)

    const LENS_000 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy
    )

    const RESULT_000 = LENS_000.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              D: {
                E?: {
                  F: number
                  G: {
                    tag: 7000
                    M: Set<string[]>
                    L?: number[] | undefined
                  } | {
                    tag: 8000
                  } | {
                    tag: 9000
                  }
                }[] | undefined
              }
              A?: 1 | {
                H: "two"
                I: number | {
                  J?: false | undefined
                }
              }[] | Record<"x" | "y" | "z", number | boolean | undefined> | undefined
              B?: [7, Record<number, {
                discriminant: "circle"
                radius: number
              } | {
                discriminant: "rectangle"
                width: number
                length: number
              } | {
                discrimnant: "square"
                length: number
              }>][] | undefined
              C?: [{
                J: unknown
                K?: string | undefined
              }] | undefined
            }
          >()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_000).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_001 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A
    )

    const RESULT_001 = LENS_001.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            1 | {
              H: "two"
              I: number | {
                J?: false | undefined
              }
            }[] | Record<"x" | "y" | "z", number | boolean | undefined> | undefined
          >()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_001).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_002 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ
    )

    const RESULT_002 = LENS_002.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            1 | {
              H: "two"
              I: number | {
                J?: false | undefined
              }
            }[] | Record<"x" | "y" | "z", number | boolean | undefined>
          >()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_002).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_003 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ0
    )

    const RESULT_003 = LENS_003.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<1>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_003).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_004 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ1
    )

    const RESULT_004 = LENS_004.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<
          {
            H: "two"
            I: number | {
              J?: false | undefined
            }
          }[]
        >()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_004).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_005 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2
    )

    const RESULT_005 = LENS_005.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            Record<"x" | "y" | "z", number | boolean | undefined>
          >()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_005).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_006 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x
      // (proxy) => proxy.A.ʔ.ꖛ2.x
    )

    const RESULT_006 = LENS_006.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_006).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_007 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ʔ
    )

    const RESULT_007 = LENS_007.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_007).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_008 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ʔ.ꖛ0
    )

    const RESULT_008 = LENS_008.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_008).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_009 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ǃ
    )

    const RESULT_009 = LENS_009.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return focus
      },
      { D: {} }
    )

    // vi.expect.soft(RESULT_009).toMatchInlineSnapshot
    //   (`
    //   {
    //     "D": {},
    //   }
    // `)

    const LENS_010 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ǃ.ꖛ0
    )

    const RESULT_010 = LENS_010.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_010).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_012 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ǃ.ꖛ1
    )

    const RESULT_012 = LENS_012.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_012).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_013 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y
    )

    const RESULT_013 = LENS_013.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_013).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_014 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ʔ
    )

    const RESULT_014 = LENS_014.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_014).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_015 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ʔ.ꖛ0
    )

    const RESULT_015 = LENS_015.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_015).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_017 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ʔ.ꖛ1
    )

    const RESULT_017 = LENS_017.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_017).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_018 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ǃ
    )

    const RESULT_018 = LENS_018.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_018).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_019 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ǃ.ꖛ0
    )

    const RESULT_019 = LENS_019.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_019).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_020 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ǃ.ꖛ1
    )

    const MODIFY_020 = LENS_020.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(MODIFY_020).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_021 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z
    )

    const GET_021 = LENS_021.get({ D: {} })

    vi.expect.soft(GET_021).toMatchInlineSnapshot
      (`undefined`)

    const SET_021 = LENS_021.set(1, { D: {} })

    vi.expect.soft(SET_021).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const MODIFY_021 = LENS_021.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(MODIFY_021).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_022 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ʔ
    )

    const GET_022 = LENS_022.get({ D: {} })

    vi.expect.soft(GET_022).toMatchInlineSnapshot
      (`undefined`)

    const SET_022 = LENS_022.set(1, { D: {} })

    vi.expect.soft(SET_022).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const MODIFY_022 = LENS_022.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return focus
      },
      { D: {} }
    )

    vi.expect.soft(MODIFY_022).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_023 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ʔ.ꖛ0
    )

    const MODIFY_023 = LENS_023.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      }
    )

    const RESULT_023 = MODIFY_023({ D: {} })

    vi.expect.soft(RESULT_023).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_024 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ʔ.ꖛ1
    )

    const MODIFY_024 = LENS_024.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return focus
      }
    )

    const RESULT_024 = MODIFY_024({ D: {} })

    vi.expect.soft(RESULT_024).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_025 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ǃ
    )

    const MODIFY_025 = LENS_025.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return focus
      }
    )

    const RESULT_025 = MODIFY_025({ D: {} })

    vi.expect.soft(RESULT_025).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_026 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ǃ.ꖛ0
    )

    const MODIFY_026 = LENS_026.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      }
    )
    const RESULT_026 = MODIFY_026({ D: {} })

    vi.expect.soft(RESULT_026).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_027 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ǃ.ꖛ1
    )

    const MODIFY_027 = LENS_027.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      }
    )

    const RESULT_027 = MODIFY_027({ D: {} })

    vi.expect.soft(RESULT_027).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_028 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ
    )

    const MODIFY_028 = LENS_028.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      }
    )

    const RESULT_028 = MODIFY_028({ D: {} })

    vi.expect.soft(RESULT_028).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_029 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ.ʔ
    )

    const MODIFY_029 = LENS_029.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      }
    )

    const RESULT_029 = MODIFY_029({ D: {} })

    vi.expect.soft(RESULT_029).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_030 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ0
    )

    const MODIFY_030 = LENS_030.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      }
    )

    const RESULT_030 = MODIFY_030({ D: {} })

    vi.expect.soft(RESULT_030).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_031 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ1
    )

    const MODIFY_031 = LENS_031.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      }
    )

    const RESULT_031 = MODIFY_031({ D: {} })

    vi.expect.soft(RESULT_031).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_032 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ.ǃ
    )

    const MODIFY_032 = LENS_032.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      }
    )

    const RESULT_032 = MODIFY_032({ D: {} })

    vi.expect.soft(RESULT_032).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const LENS_033 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ0
    )

    const MODIFY_033 = LENS_033.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return focus
      }
    )

    const RESULT_033 = MODIFY_033({ D: {} })

    vi.assert.deepEqual(RESULT_033, {
      "A": {
        "x": undefined,
        "y": undefined,
        "z": undefined,
      },
      "D": {},
    })

    vi.expect.soft(RESULT_033).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)



    const RESULT_034 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_034).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)

    const LENS_035 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ
    )

    const MODIFY_035 = LENS_035.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            | undefined
            | 1
            | Array<{
              H:
              | undefined
              | "two"
              I:
              | undefined
              | number
              | {
                J: false
              }
            }>
            | {
              x: number | boolean | undefined
              y: number | boolean | undefined
              z: number | boolean | undefined
            }
          >()
        return [focus]
      }
    )

    const RESULT_035 = MODIFY_035({ D: {} })

    vi.expect.soft(RESULT_035).toMatchInlineSnapshot
      (`
      {
        "A": [
          undefined,
        ],
        "D": {},
      }
    `)

    const LENS_037 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ0
    )

    const MODIFY_037 = LENS_037.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<1>()
        return [focus]
      }
    )

    const RESULT_037 = MODIFY_037({ D: {} })

    vi.expect.soft(RESULT_037).toMatchInlineSnapshot
      (`
      {
        "A": [
          1,
        ],
        "D": {},
      }
    `)

    const LENS_038 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ1
    )

    const MODIFY_038 = LENS_038.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              H: "two"
              I: number | {
                J?: false | undefined
              }
            }[]
          >()
        return [focus]
      },
    )

    const RESULT_038 = MODIFY_038({ D: {} })

    vi.expect.soft(RESULT_038).toMatchInlineSnapshot
      (`
      {
        "A": [
          [
            {
              "H": "two",
              "I": {
                "J": false,
              },
            },
          ],
        ],
        "D": {},
      }
    `)

    const LENS_039 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2
    )

    const MODIFY_039 = LENS_039.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<Record<"x" | "y" | "z", number | boolean | undefined>>()
        return [focus]
      }
    )

    const RESULT_039 = MODIFY_039({ D: {} })

    vi.expect.soft(RESULT_039).toMatchInlineSnapshot
      (`
      {
        "A": [
          {
            "x": undefined,
            "y": undefined,
            "z": undefined,
          },
        ],
        "D": {},
      }
    `)


    const LENS_045 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ǃ.ꖛ0
    )

    const MODIFY_045 = LENS_045.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      }
    )

    const RESULT_045 = MODIFY_045({ D: {} })

    // TODO:
    // vi.expect.soft(RESULT_045).toMatchInlineSnapshot
    //   (`
    //   {
    //     "A": {
    //       "x": undefined,
    //     },
    //     "D": {},
    //   }
    // `)

    const LENS_047 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ǃ.ꖛ1
    )

    const MODIFY_047 = LENS_047.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      })

    const RESULT_047 = MODIFY_047({ D: {} })

    vi.expect.soft(RESULT_047).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
        },
        "D": {},
      }
    `)

    const LENS_048 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y
    )

    const MODIFY_048 = LENS_048.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
    )

    const RESULT_048 = MODIFY_048({ D: {} })

    vi.expect.soft(RESULT_048).toMatchInlineSnapshot
      (`
      {
        "A": {
          "y": [
            undefined,
            undefined,
          ],
        },
        "D": {},
      }
    `)

    const RESULT_049 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_049).toMatchInlineSnapshot
      (`
      {
        "A": {
          "y": [
            undefined,
            undefined,
          ],
        },
        "D": {},
      }
    `)

    const RESULT_050 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_050).toMatchInlineSnapshot
      (`
      {
        "A": {
          "y": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_051 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_051).toMatchInlineSnapshot
      (`
      {
        "A": {
          "y": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_052 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_052).toMatchInlineSnapshot
      (`
      {
        "A": {
          "y": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_054 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_054).toMatchInlineSnapshot
      (`
      {
        "A": {
          "y": [
            undefined,
            undefined,
          ],
        },
        "D": {},
      }
    `)

    const RESULT_055 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_055).toMatchInlineSnapshot
      (`
      {
        "A": {
          "y": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_056 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_056).toMatchInlineSnapshot
      (`
      {
        "A": {
          "y": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_057 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_057).toMatchInlineSnapshot
      (`
      {
        "A": {
          "z": [
            undefined,
            undefined,
          ],
        },
        "D": {},
      }
    `)

    const RESULT_058 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_058).toMatchInlineSnapshot
      (`
      {
        "A": {
          "z": [
            undefined,
            undefined,
          ],
        },
        "D": {},
      }
    `)

    const RESULT_059 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_059).toMatchInlineSnapshot
      (`
      {
        "A": {
          "z": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_060 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_060).toMatchInlineSnapshot
      (`
      {
        "A": {
          "z": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_061 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_061).toMatchInlineSnapshot
      (`
      {
        "A": {
          "z": [
            undefined,
            undefined,
          ],
        },
        "D": {},
      }
    `)

    const RESULT_062 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_062).toMatchInlineSnapshot
      (`
      {
        "A": {
          "z": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_063 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_063).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_064 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_064).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": [
            undefined,
            undefined,
          ],
          "y": [
            undefined,
            undefined,
          ],
          "z": [
            undefined,
            undefined,
          ],
        },
        "D": {},
      }
    `)

    const RESULT_065 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_065).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": [
            undefined,
            undefined,
          ],
          "y": [
            undefined,
            undefined,
          ],
          "z": [
            undefined,
            undefined,
          ],
        },
        "D": {},
      }
    `)

    const RESULT_066 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_066).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_067 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_067).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_068 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_068).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": [
            undefined,
            undefined,
          ],
          "y": [
            undefined,
            undefined,
          ],
          "z": [
            undefined,
            undefined,
          ],
        },
        "D": {},
      }
    `)

    const RESULT_069 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_069).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_070 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_070).toMatchInlineSnapshot
      (`
      {
        "A": {
          "x": undefined,
          "y": undefined,
          "z": undefined,
        },
        "D": {},
      }
    `)

    const RESULT_071 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            [7, Record<number, {
              discriminant: "circle"
              radius: number
            } | {
              discriminant: "rectangle"
              width: number
              length: number
            } | {
              discrimnant: "square"
              length: number
            }>][] | undefined
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_071).toMatchInlineSnapshot
      (`
      {
        "B": [
          undefined,
        ],
        "D": {},
      }
    `)

    const RESULT_072 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            [7 | undefined, {
              [x: number]: {
                discriminant: "circle" | undefined
                radius: number | undefined
              } | {
                discriminant: "rectangle" | undefined
                width: number | undefined
                length: number | undefined
              } | {
                discrimnant: "square" | undefined
                length: number | undefined
              }
            }][]
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_072).toMatchInlineSnapshot
      (`
      {
        "B": [
          [
            [
              7,
              {},
            ],
          ],
        ],
        "D": {},
      }
    `)

    const RESULT_073 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<
          [7, Record<number, {
            discriminant: "circle"
            radius: number
          } | {
            discriminant: "rectangle"
            width: number
            length: number
          } | {
            discrimnant: "square"
            length: number
          }>]
        >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_073).toMatchInlineSnapshot
      (`
      {
        "B": [
          [
            [
              7,
              {},
            ],
          ],
        ],
        "D": {},
      }
    `)

    const RESULT_07401 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<7>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07401).toMatchInlineSnapshot
      (`
      {
        "B": [
          [
            7,
            {},
          ],
        ],
        "D": {},
      }
    `)

    const RESULT_07402 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            Record<number, {
              discriminant: "circle"
              radius: number
            } | {
              discriminant: "rectangle"
              width: number
              length: number
            } | {
              discrimnant: "square"
              length: number
            }>
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07402).toMatchInlineSnapshot
      (`
      {
        "B": [
          [
            7,
            {},
          ],
        ],
        "D": {},
      }
    `)

    const RESULT_07403 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{
          discriminant: "circle"
          radius: number
        } | {
          discriminant: "rectangle"
          width: number
          length: number
        } | {
          discrimnant: "square"
          length: number
        }
        >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07403).toMatchInlineSnapshot
      (`
      {
        "B": [
          [
            7,
            {},
          ],
        ],
        "D": {},
      }
    `)

    const RESULT_07404 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{
          discriminant: "circle"
          radius: number
        }>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07404).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_07405 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.discriminant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'circle'>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07405).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_07406 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.radius
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07406).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_07407 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<
          {
            discriminant: "rectangle"
            width: number
            length: number
          }
        >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07407).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_07408 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.discriminant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'rectangle'>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07408).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_07409 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.length
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07409).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_07410 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.width
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07410).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_07411 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              discrimnant: "square"
              length: number
            }
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07411).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_07412 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.discrimnant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'square'>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07412).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_07413 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.length
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_07413).toMatchInlineSnapshot
      (`
      {
        "B": {},
        "D": {},
      }
    `)

    const RESULT_074 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.length
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_074).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_075 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            [7, Record<number, {
              discriminant: "circle"
              radius: number
            } | {
              discriminant: "rectangle"
              width: number
              length: number
            } | {
              discrimnant: "square"
              length: number
            }>][]
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_075).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_076 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            [7, Record<number, {
              discriminant: "circle"
              radius: number
            } | {
              discriminant: "rectangle"
              width: number
              length: number
            } | {
              discrimnant: "square"
              length: number
            }>]
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_076).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_077 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<7>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_077).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_079 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            Record<number, {
              discriminant: "circle"
              radius: number
            } | {
              discriminant: "rectangle"
              width: number
              length: number
            } | {
              discrimnant: "square"
              length: number
            }>
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_079).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_080 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              discriminant: "circle"
              radius: number
            } | {
              discriminant: "rectangle"
              width: number
              length: number
            } | {
              discrimnant: "square"
              length: number
            }
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_080).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_081 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ discriminant: "circle"; radius: number }>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_081).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_082 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.discriminant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'circle'>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_082).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_083 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.radius
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_083).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_084 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              discriminant: "rectangle"
              width: number
              length: number
            }
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_084).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_085 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.discriminant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'rectangle'>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_085).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_086 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.width
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_086).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_087 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ discrimnant: "square"; length: number }>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_087).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_088 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.discrimnant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'square'>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_088).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_0890 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.length
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_0890).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_089 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            [{
              J: unknown
              K?: string | undefined
            }] | undefined
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_089).toMatchInlineSnapshot
      (`
      {
        "C": [
          undefined,
        ],
        "D": {},
      }
    `)

    const RESULT_090 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[{ J: {}; K: string }]>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_090).toMatchInlineSnapshot
      (`
      {
        "C": [
          [
            {
              "J": undefined,
              "K": undefined,
            },
          ],
        ],
        "D": {},
      }
    `)

    const RESULT_091 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ J: unknown; K?: string | undefined }>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_091).toMatchInlineSnapshot
      (`
      {
        "C": [
          {
            "J": undefined,
            "K": undefined,
          },
        ],
        "D": {},
      }
    `)

    const RESULT_092 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0].J
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<unknown>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_092).toMatchInlineSnapshot
      (`
      {
        "C": [
          {
            "J": [
              undefined,
            ],
            "K": undefined,
          },
        ],
        "D": {},
      }
    `)

    const RESULT_093 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0].K
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_093).toMatchInlineSnapshot
      (`
      {
        "C": [
          {
            "J": undefined,
            "K": [
              undefined,
            ],
          },
        ],
        "D": {},
      }
    `)

    const RESULT_094 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0].K.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_094).toMatchInlineSnapshot
      (`
      {
        "C": [
          {
            "J": undefined,
            "K": [
              [
                {
                  "J": undefined,
                  "K": undefined,
                },
              ],
            ],
          },
        ],
        "D": {},
      }
    `)

    const RESULT_095 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0].K.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_095).toMatchInlineSnapshot
      (`
      {
        "C": [
          {
            "J": undefined,
            "K": undefined,
          },
        ],
        "D": {},
      }
    `)

    const RESULT_096 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[{ J: unknown; K?: string | undefined }]>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_096).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_097 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ J: unknown; K?: string | undefined }>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_097).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_098 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0].J
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<unknown>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_098).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_099 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0].K
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_099).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_100 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0].K.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_100).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_101 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0].K.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_101).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_102 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              E?: {
                F: number
                G: {
                  tag: 7000
                  M: Set<string[]>
                  L?: number[] | undefined
                } | {
                  tag: 8000
                } | {
                  tag: 9000
                }
              }[] | undefined
            }
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_102).toMatchInlineSnapshot
      (`
      {
        "D": [
          {},
        ],
      }
    `)

    const RESULT_103 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              F: number
              G: {
                tag: 7000
                M: Set<string[]>
                L?: number[] | undefined
              } | {
                tag: 8000
              } | {
                tag: 9000
              }
            }[] | undefined
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_103).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": [
            undefined,
          ],
        },
      }
    `)

    const RESULT_104 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              F: number | undefined
              G: {
                tag: 7000 | undefined
                M: Set<string[]>
                L: number[]
              } | {
                tag: 8000 | undefined
              } | {
                tag: 9000 | undefined
              }
            }[]
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_104).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": [
            [
              {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            ],
          ],
        },
      }
    `)

    const RESULT_105 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              F: number
              G: {
                tag: 7000
                M: Set<string[]>
                L?: number[] | undefined
              } | {
                tag: 8000
              } | {
                tag: 9000
              }
            }
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_105).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": [
            [
              {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            ],
          ],
        },
      }
    `)

    const RESULT_106 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.F
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_106).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": [
            {
              "F": [
                undefined,
              ],
              "G": [
                {
                  "L": [],
                  "M": Set {
                    [],
                  },
                  "tag": 7000,
                },
                {
                  "tag": 8000,
                },
                {
                  "tag": 9000,
                },
              ],
            },
          ],
        },
      }
    `)

    const RESULT_107 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              tag: 7000
              M: Set<string[]>
              L?: number[] | undefined
            } | {
              tag: 8000
            } | {
              tag: 9000
            }
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_107).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": [
            {
              "F": undefined,
              "G": [
                [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              ],
            },
          ],
        },
      }
    `)

    const RESULT_108 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 7000, L?: number[], M: Set<string[]> }>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_108).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_109 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[] | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_109).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_110 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[]>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_110).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_111 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_111).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_112 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[]>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_112).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_113 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_1130 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ.ᣔꓸꓸ
    ).set(1)({ D: {} })

    vi.expect.soft(RESULT_1130).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_1131 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ.ᣔꓸꓸ
    ).set(1, { D: {} })

    vi.expect.soft(RESULT_1131).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    vi.expect.soft(RESULT_113).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_114 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.M
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<Set<string[]>>()
        return [focus]
      }
    )({ D: {} })

    vi.expect.soft(RESULT_114).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_116 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_116).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_117 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<7000>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_117).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": {
            "F": {
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
            "G": {
              "0": {
                "L": [],
                "M": Set {
                  [],
                },
                "tag": 7000,
              },
              "1": {
                "tag": 8000,
              },
              "2": {
                "tag": 9000,
              },
              "G": {
                "F": undefined,
                "G": [
                  {
                    "L": [],
                    "M": Set {
                      [],
                    },
                    "tag": 7000,
                  },
                  {
                    "tag": 8000,
                  },
                  {
                    "tag": 9000,
                  },
                ],
              },
            },
          },
        },
      }
    `)

    const RESULT_118 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ8000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 8000 }>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_118).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": [
            {
              "F": undefined,
              "G": [
                {
                  "F": undefined,
                  "G": [
                    {
                      "L": [],
                      "M": Set {
                        [],
                      },
                      "tag": 7000,
                    },
                    {
                      "tag": 8000,
                    },
                    {
                      "tag": 9000,
                    },
                  ],
                },
              ],
            },
          ],
        },
      }
    `)

    const LENS_119 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ8000.tag
      // (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ8000.tag
      // ǃ.ᣔꓸꓸ.G.ꖛ8000.tag
    )

    const MODIFY_119 = LENS_119.modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<8000>()
        return [focus]
      },
      { D: { E: [{ F: 9, G: { tag: 8000, } }] } }
    )

    vi.expect.soft(MODIFY_119).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": [
            {
              "F": 9,
              "G": {
                "tag": [
                  8000,
                ],
              },
            },
          ],
        },
      }
    `)

    const RESULT_120 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ9000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 9000 }>()
        return [focus]
      },
      { D: {} }
    )

    /**
     * TODO: "pick" which (tagged?) union member to generate
     */

    vi.expect.soft(RESULT_120).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": [
            {
              "F": undefined,
              "G": [
                {
                  "F": undefined,
                  "G": [
                    {
                      "L": [],
                      "M": Set {
                        [],
                      },
                      "tag": 7000,
                    },
                    {
                      "tag": 8000,
                    },
                    {
                      "tag": 9000,
                    },
                  ],
                },
              ],
            },
          ],
        },
      }
    `)

    type BigSchema = z.infer<typeof BIG_SCHEMA>

    const RESULT_121 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ9000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<9000>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_121).toMatchInlineSnapshot
      (`
      {
        "D": {
          "E": [
            {
              "F": undefined,
              "G": [
                {
                  "F": undefined,
                  "G": [
                    {
                      "L": [],
                      "M": Set {
                        [],
                      },
                      "tag": 7000,
                    },
                    {
                      "tag": 8000,
                    },
                    {
                      "tag": 9000,
                    },
                  ],
                },
              ],
            },
          ],
        },
      }
    `)

    const RESULT_122 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              F: number
              G: {
                tag: 7000
                M: Set<string[]>
                L?: number[] | undefined
              } | {
                tag: 8000
              } | {
                tag: 9000
              }
            }[]
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_122).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_123 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              F: number
              G: {
                tag: 7000
                M: Set<string[]>
                L?: number[] | undefined
              } | {
                tag: 8000
              } | {
                tag: 9000
              }
            }
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_123).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_124 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.F
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_124).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_125 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              tag: 7000
              M: Set<string[]>
              L?: number[] | undefined
            } | {
              tag: 8000
            } | {
              tag: 9000
            }
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_125).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_126 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            {
              tag: 7000
              M: Set<string[]>
              L?: number[] | undefined
            }
          >()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_126).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_127 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[] | undefined>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_127).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_128 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[]>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_128).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_129 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_129).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_130 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[]>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_130).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_131 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_131).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_132 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.M
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<Set<string[]>>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_132).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_133 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string[]>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_133).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_134 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_134).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_135 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<7000>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_135).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_136 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ8000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 8000 }>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_136).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_137 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ8000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<8000>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_137).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_138 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ9000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 9000 }>()
        return [focus]
      },
      { D: {} }
    )

    vi.expect.soft(RESULT_138).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

    const RESULT_139 = zx.classic.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ9000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<9000>()
        return [focus]
      },
      { D: {} }
    )

    /**
     * TODO: Should return:
     *
     * { D: {} }
     *
     * ?
     */
    vi.expect.soft(RESULT_139).toMatchInlineSnapshot
      (`
      {
        "D": {},
      }
    `)

  })
})

