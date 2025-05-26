import * as vi from 'vitest'
import { v4, registerDSL } from '@traversable/schema-zod-adapter'
import { z } from 'zod/v4'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it('〖⛳️〗› ❲v4.makeLens❳: types', () => {
    v4.makeLens(
      z.object({}),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<Record<string, never>>()
        //              ^?
      },
      {}
    )

    v4.makeLens(
      z.object({ ABC: z.optional(z.object({ DEF: z.optional(z.object({ GHI: z.optional(z.literal(1)) })) })) }),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ ABC?: { DEF?: { GHI?: 1 } } }>()
        //              ^?
      },
      {}
    )

    v4.makeLens(
      z.object({ ABC: z.optional(z.object({ DEF: z.optional(z.object({ GHI: z.optional(z.literal(1)) })) })) }),
      (proxy) => proxy.ABC
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ DEF?: { GHI?: 1 } } | undefined>()
        //              ^?
      },
      {}
    )

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
      z.tuple([]),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[]>()
        //              ^?
      },
      []
    )

    v4.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[1, [2, [3, [4]]]]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    v4.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<1>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    v4.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[2, [3, [4]]]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    v4.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<2>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    v4.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[3, [4]]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    v4.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][1][0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<3>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    v4.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][1][1]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[4]>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    v4.makeLens(
      z.tuple([z.literal(1), z.tuple([z.literal(2), z.tuple([z.literal(3), z.tuple([z.literal(4)])])])]),
      (proxy) => proxy[1][1][1][0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<4>()
        //              ^?
      },
      [1, [2, [3, [4]]]]
    )

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

    v4.makeLens(
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

  vi.it('〖⛳️〗› ❲v4.makeLens❳: terms', () => {

    vi.expect(
      v4.makeLens(
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


    vi.expect(
      v4.makeLens(
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

    const L_01 = v4.makeLens(
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

    vi.expect(
      v4.makeLens(
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
      ).fallback
    ).toMatchInlineSnapshot
      (`
      {
        "DEF": undefined,
      }
    `)

    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
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

    type record = z.infer<typeof record>
    const record = z.record(
      z.enum({ 1: 'A', 2: 'B', 3: 'C' }),
      z.object({
        ABC: z.array(
          z.object({
            DEF: z.number()
          })
        )
      }),
    )

    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
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
        (proxy) => proxy.C
      ).modify(
        (focus) => focus.ABC.filter((x) => x.DEF > 4).map((x) => x.DEF),
        {
          A: { ABC: [] },
          B: { ABC: [{ DEF: 1 }, { DEF: 2 }] },
          C: { ABC: [{ DEF: 3 }, { DEF: 4 }, { DEF: 5 }] },
        }
      )
    ).toMatchInlineSnapshot
      (`
      {
        "A": {
          "ABC": [],
        },
        "B": {
          "ABC": [
            {
              "DEF": 1,
            },
            {
              "DEF": 2,
            },
          ],
        },
        "C": [
          5,
        ],
      }
    `)

    vi.expect(
      v4.makeLens(
        z.object({ ABC: z.optional(z.array(z.object({ DEF: z.optional(z.array(z.object({ GHI: z.optional(z.array(z.number())) }))) }))) }),
        (proxy) => proxy.ABC.ǃ
      ).modify(
        (proxy) => proxy,
        { ABC: undefined }
      )
    ).toMatchInlineSnapshot
      (`
      {
        "ABC": [
          {
            "DEF": [
              {
                "GHI": [],
              },
            ],
          },
        ],
      }
    `)

    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
        z.object({ ABC: z.optional(z.array(z.object({ DEF: z.optional(z.array(z.object({ GHI: z.optional(z.array(z.number())) }))) }))) }),
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

    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
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


    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
        z.union([z.string(), z.number()]),
        (proxy) => proxy.ꖛ0
      ).get('hey')
    ).toMatchInlineSnapshot
      (`"hey"`)

    // vi.expect(
    //   v4.makeLens(
    //     z.union([z.string(), z.number()]),
    //     (proxy) => proxy.ꖛ0
    //   ).get(0)
    // ).toMatchInlineSnapshot
    //   (`undefined`)

    // vi.expect(
    //   v4.makeLens(
    //     z.array(z.union([z.string(), z.number()])),
    //     (proxy) => proxy.ᣔꓸꓸ.ꖛ0
    //   ).get([0, 'ho', 1])
    // ).toMatchInlineSnapshot
    //   (`
    //   [
    //     undefined,
    //     "ho",
    //     undefined,
    //   ]
    // `)

    // vi.expect(
    //   v4.makeLens(
    //     z.array(z.union([z.string(), z.number()])),
    //     (proxy) => proxy.ᣔꓸꓸ.ꖛ1
    //   ).get([0, 'ho', 1])
    // ).toMatchInlineSnapshot
    //   (`
    //   [
    //     0,
    //     undefined,
    //     1,
    //   ]
    // `)

    vi.expect(
      v4.makeLens(
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

    vi.expect(
      v4.makeLens(
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

    const RESULT_000 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy
    ).modify(
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
        return [focus]
      },
      { D: {} }
    )

    vi.expect(RESULT_000).toMatchInlineSnapshot
      (`
      [
        {
          "D": {},
        },
      ]
    `)

    const RESULT_001 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A
    ).modify(
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
        return [focus]
      },
      { D: {} }
    )

    const RESULT_002 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ
    ).modify(
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
        return [focus]
      },
      { D: {} }
    )

    const RESULT_003 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<1>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_004 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<
          {
            H: "two"
            I: number | {
              J?: false | undefined
            }
          }[]
        >()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_005 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            Record<"x" | "y" | "z", number | boolean | undefined>
          >()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_006 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_007 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_008 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_009 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_010 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_012 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.x.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_013 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_014 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_015 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_017 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_018 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_019 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_020 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.y.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_021 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_022 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_023 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_024 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_025 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_026 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_027 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_028 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_029 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_030 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_031 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_032 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.ᣔꓸꓸ.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_033 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_034 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_035 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf
          <
            1 | {
              H: "two" | undefined
              I: number | {
                J: false
              } | undefined
            }[] | {
              x: number | boolean | undefined
              y: number | boolean | undefined
              z: number | boolean | undefined
            } | undefined
          >()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_037 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<1>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_038 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ1
    ).modify(
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
      { D: {} }
    )

    const RESULT_039 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<Record<"x" | "y" | "z", number | boolean | undefined>>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_040 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_041 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_042 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_044 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_045 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_047 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.x.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_048 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_049 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_050 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_051 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_052 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_054 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_055 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_056 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.y.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_057 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_058 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_059 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_060 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_061 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_062 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.z.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_063 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ʔ.ꖛ2.z.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_064 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_065 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_066 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_067 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ʔ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_068 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number | boolean | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_069 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<boolean>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_070 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.A.ǃ.ꖛ2.ᣔꓸꓸ.ǃ.ꖛ1
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_071 = v4.makeLens(
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

    const RESULT_072 = v4.makeLens(
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

    const RESULT_073 = v4.makeLens(
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

    const RESULT_07401 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<7>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_07402 = v4.makeLens(
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

    const RESULT_07403 = v4.makeLens(
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

    const RESULT_07404 = v4.makeLens(
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

    const RESULT_07405 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.discriminant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'circle'>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_07406 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.radius
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_07407 = v4.makeLens(
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

    const RESULT_07408 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.discriminant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'rectangle'>()
        return [focus]
      },
      { D: {} }
    )
    const RESULT_07409 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.length
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_07410 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.width
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_07411 = v4.makeLens(
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

    const RESULT_07412 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.discrimnant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'square'>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_07413 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ǃ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.length
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_075 = v4.makeLens(
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

    const RESULT_076 = v4.makeLens(
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

    const RESULT_077 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<7>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_079 = v4.makeLens(
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

    const RESULT_080 = v4.makeLens(
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

    const RESULT_081 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ discriminant: "circle"; radius: number }>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_082 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.discriminant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'circle'>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_083 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ0.radius
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_084 = v4.makeLens(
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

    const RESULT_085 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.discriminant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'rectangle'>()
        return [focus]
      },
      { D: {} }
    )
    const RESULT_074 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.length
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_086 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ1.width
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_087 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ discrimnant: "square"; length: number }>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_088 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.discrimnant
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<'square'>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_0890 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.B.ʔ.ᣔꓸꓸ[1].ᣔꓸꓸ.ꖛ2.length
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_089 = v4.makeLens(
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

    const RESULT_090 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[{ J: {}; K: string }]>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_091 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ J: unknown; K?: string | undefined }>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_092 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0].J
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<unknown>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_093 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0].K
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_094 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0].K.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_095 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ǃ[0].K.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_096 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<[{ J: unknown; K?: string | undefined }]>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_097 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0]
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ J: unknown; K?: string | undefined }>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_098 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0].J
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<unknown>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_099 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0].K
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_100 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0].K.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_101 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.C.ʔ[0].K.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_102 = v4.makeLens(
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

    const RESULT_103 = v4.makeLens(
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

    const RESULT_104 = v4.makeLens(
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

    const RESULT_105 = v4.makeLens(
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

    const RESULT_106 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.F
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_107 = v4.makeLens(
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

    /** 
     * TODO: typelevel bug
     */
    const RESULT_108 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 7000, L?: number[], M: Set<string[]> }>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_109 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[] | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_110 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[]>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_111 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_112 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[]>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_113 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_114 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.M
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<Set<string[]>>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_115 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string[]>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_116 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_117 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ7000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<7000>()
        return [focus]
      },
      { D: {} }
    )

    /** 
     * TODO: bug
     */
    const RESULT_118 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ8000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 8000 }>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_119 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ8000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<8000>()
        return [focus]
      },
      { D: {} }
    )

    /** 
     * TODO: BUG
     */
    const RESULT_120 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ9000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 9000 }>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_121 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ǃ.ᣔꓸꓸ.G.ꖛ9000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<9000>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_122 = v4.makeLens(
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

    const RESULT_123 = v4.makeLens(
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

    const RESULT_124 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.F
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_125 = v4.makeLens(
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

    /**
     * TODO: bug
     */
    const RESULT_126 = v4.makeLens(
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

    const RESULT_127 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[] | undefined>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_128 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[]>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_129 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ǃ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_130 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number[]>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_131 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.L.ʔ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<number>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_132 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.M
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<Set<string[]>>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_133 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string[]>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_134 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.M.ᣔꓸꓸ.ᣔꓸꓸ
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<string>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_135 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ7000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<7000>()
        return [focus]
      },
      { D: {} }
    )

    /** 
     * TODO: bug
     */
    const RESULT_136 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ8000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 8000 }>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_137 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ8000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<8000>()
        return [focus]
      },
      { D: {} }
    )

    /** 
     * TODO: bug
     */
    const RESULT_138 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ9000
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<{ tag: 9000 }>()
        return [focus]
      },
      { D: {} }
    )

    const RESULT_139 = v4.makeLens(
      BIG_SCHEMA,
      (proxy) => proxy.D.E.ʔ.ᣔꓸꓸ.G.ꖛ9000.tag
    ).modify(
      (focus) => {
        vi.expectTypeOf(focus).toEqualTypeOf<9000>()
        return [focus]
      },
      { D: {} }
    )

  })
})

