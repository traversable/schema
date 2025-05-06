import * as vi from 'vitest'
import { t } from '@traversable/schema'
import { z } from 'zod'

/**
 * ### Performance side-by-side
 * 
 * Here's the type we're targeting:
 * 
 * __Target__
 * 
 * |    Metric    |    Value    |
 * |--------------|-------------|
 * | line span    |     L21-314 |
 * | line count   |         293 |
 * | formatter    |    prettier |
 * |--------------|-------------|
 * 
 */

type Target = {
  1: ["3"]
  2: ["3"]
  0.2: { 22: ["3", "+", "30"] }
  3: ["3"]
  0.3: { 33: ["3", "+", "30"]; 0.33: { 333: ["3", "+", "30", "300"] } }
  4: ["4"]
  0.4: {
    44: ["4", "+", "40"]
    0.44: {
      444: ["4", "+", "40", "400"]
      0.444: { 4444: ["4", "+", "40", "+", "400", "+", "4000"] }
    }
  }
  5: ["5"]
  0.5: {
    55: ["5", "+", "50"]
    0.55: {
      555: ["5", "+", "50", "500"]
      0.555: {
        5555: ["5", "+", "50", "+", "500", "+", "5000"]
        0.5555: {
          55555: ["5", "+", "50", "+", "500", "+", "5000", "+", "50000"]
        }
      }
    }
  }
  6: ["6"]
  0.6: {
    66: ["6", "+", "60"]
    0.66: {
      666: ["6", "+", "60", "600"]
      0.666: {
        6666: ["6", "+", "60", "+", "600", "+", "6000"]
        0.6666: {
          66666: ["6", "+", "60", "+", "600", "+", "6000", "+", "60000"]
          0.66666: {
            666666: [
              "6",
              "+",
              "60",
              "+",
              "600",
              "+",
              "6000",
              "+",
              "60000",
              "+",
              "600000",
            ]
          }
        }
      }
    }
  }
  7: ["7"]
  0.7: {
    77: ["7", "+", "70"]
    0.77: {
      777: ["7", "+", "70", "700"]
      0.777: {
        7777: ["7", "+", "70", "+", "700", "+", "7000"]
        0.7777: {
          77777: ["7", "+", "70", "+", "700", "+", "7000", "+", "70000"]
          0.77777: {
            777777: [
              "7",
              "+",
              "70",
              "+",
              "700",
              "+",
              "7000",
              "+",
              "70000",
              "+",
              "700000",
            ]
            0.777777: {
              7777777: [
                "7",
                "+",
                "70",
                "+",
                "700",
                "+",
                "7000",
                "+",
                "70000",
                "+",
                "700000",
                "+",
                "7000000",
              ]
            }
          }
        }
      }
    }
  }
  8: ["8"]
  0.8: {
    88: ["8", "+", "80"]
    0.88: {
      888: ["8", "+", "80", "800"]
      0.888: {
        8888: ["8", "+", "80", "+", "800", "+", "8000"]
        0.8888: {
          88888: ["8", "+", "80", "+", "800", "+", "8000", "+", "80000"]
          0.88888: {
            888888: [
              "8",
              "+",
              "80",
              "+",
              "800",
              "+",
              "8000",
              "+",
              "80000",
              "+",
              "800000",
            ]
            0.888888: {
              8888888: [
                "8",
                "+",
                "80",
                "+",
                "800",
                "+",
                "8000",
                "+",
                "80000",
                "+",
                "800000",
                "+",
                "8000000",
              ]
              0.8888888: {
                88888888: [
                  "8",
                  "+",
                  "80",
                  "+",
                  "800",
                  "+",
                  "8000",
                  "+",
                  "80000",
                  "+",
                  "800000",
                  "+",
                  "8000000",
                  "+",
                  "80000000",
                ]
                0.88888888: {
                  888888888: [
                    "8",
                    "+",
                    "80",
                    "+",
                    "800",
                    "+",
                    "8000",
                    "+",
                    "80000",
                    "+",
                    "800000",
                    "+",
                    "8000000",
                    "+",
                    "80000000",
                    "+",
                    "800000000",
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
  9: ["9"]
  0.9: {
    99: ["9", "+", "90"]
    0.99: {
      999: ["9", "+", "90", "900"]
      0.999: {
        9999: ["9", "+", "90", "+", "900", "+", "9000"]
        0.9999: {
          99999: ["9", "+", "90", "+", "900", "+", "9000", "+", "90000"]
          0.99999: {
            999999: [
              "9",
              "+",
              "90",
              "+",
              "900",
              "+",
              "9000",
              "+",
              "90000",
              "+",
              "900000",
            ]
            0.999999: {
              9999999: [
                "9",
                "+",
                "90",
                "+",
                "900",
                "+",
                "9000",
                "+",
                "90000",
                "+",
                "900000",
                "+",
                "9000000",
              ]
              0.9999999: {
                99999999: [
                  "9",
                  "+",
                  "90",
                  "+",
                  "900",
                  "+",
                  "9000",
                  "+",
                  "90000",
                  "+",
                  "900000",
                  "+",
                  "9000000",
                  "+",
                  "90000000",
                ]
                0.99999999: {
                  999999999: [
                    "9",
                    "+",
                    "90",
                    "+",
                    "900",
                    "+",
                    "9000",
                    "+",
                    "90000",
                    "+",
                    "900000",
                    "+",
                    "9000000",
                    "+",
                    "90000000",
                    "+",
                    "900000000",
                  ]
                  0.999999999: {
                    9999999999: [
                      "9",
                      "+",
                      "90",
                      "+",
                      "900",
                      "+",
                      "9000",
                      "+",
                      "90000",
                      "+",
                      "900000",
                      "+",
                      "9000000",
                      "+",
                      "90000000",
                      "+",
                      "900000000",
                      "+",
                      "9000000000",
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

/**
 * ### Performance side-by-side
 * 
 * Here's the `traversable` schema:
 * 
 * __t: schema__
 * 
 * |    Metric    |    Value    |
 * |--------------|-------------|
 * | vendor       | traversable |
 * | line span    |    L333-733 |
 * | line count   |         400 |
 * | formatter    |    prettier |
 * |--------------|-------------|
 * 
 */

const TraversableSchema = t.object({
  [1]: t.tuple(t.eq(`${3}`)),
  [2]: t.tuple(t.eq(`${3}`)),
  [0.2]: t.object({
    [22]: t.tuple(t.eq(`${3}`), t.eq("+"), t.eq(`${3e1}`)),
  }),
  [3]: t.tuple(t.eq(`${3}`)),
  [0.3]: t.object({
    [33]: t.tuple(t.eq(`${3}`), t.eq("+"), t.eq(`${3e1}`)),
    [0.33]: t.object({
      [333]: t.tuple(t.eq(`${3}`), t.eq("+"), t.eq(`${3e1}`), t.eq(`${3e2}`)),
    }),
  }),
  [4]: t.tuple(t.eq(`${4}`)),
  [0.4]: t.object({
    [44]: t.tuple(t.eq(`${4}`), t.eq("+"), t.eq(`${4e1}`)),
    [0.44]: t.object({
      [444]: t.tuple(t.eq(`${4}`), t.eq("+"), t.eq(`${4e1}`), t.eq(`${4e2}`)),
      [0.444]: t.object({
        [4444]: t.tuple(
          t.eq(`${4}`),
          t.eq("+"),
          t.eq(`${4e1}`),
          t.eq("+"),
          t.eq(`${4e2}`),
          t.eq("+"),
          t.eq(`${4e3}`),
        ),
      }),
    }),
  }),
  [5]: t.tuple(t.eq(`${5}`)),
  [0.5]: t.object({
    [55]: t.tuple(t.eq(`${5}`), t.eq("+"), t.eq(`${5e1}`)),
    [0.55]: t.object({
      [555]: t.tuple(t.eq(`${5}`), t.eq("+"), t.eq(`${5e1}`), t.eq(`${5e2}`)),
      [0.555]: t.object({
        [5555]: t.tuple(
          t.eq(`${5}`),
          t.eq("+"),
          t.eq(`${5e1}`),
          t.eq("+"),
          t.eq(`${5e2}`),
          t.eq("+"),
          t.eq(`${5e3}`),
        ),
        [0.5555]: t.object({
          [55555]: t.tuple(
            t.eq(`${5}`),
            t.eq("+"),
            t.eq(`${5e1}`),
            t.eq("+"),
            t.eq(`${5e2}`),
            t.eq("+"),
            t.eq(`${5e3}`),
            t.eq("+"),
            t.eq(`${5e4}`),
          ),
        }),
      }),
    }),
  }),
  [6]: t.tuple(t.eq(`${6}`)),
  [0.6]: t.object({
    [66]: t.tuple(t.eq(`${6}`), t.eq("+"), t.eq(`${6e1}`)),
    [0.66]: t.object({
      [666]: t.tuple(t.eq(`${6}`), t.eq("+"), t.eq(`${6e1}`), t.eq(`${6e2}`)),
      [0.666]: t.object({
        [6666]: t.tuple(
          t.eq(`${6}`),
          t.eq("+"),
          t.eq(`${6e1}`),
          t.eq("+"),
          t.eq(`${6e2}`),
          t.eq("+"),
          t.eq(`${6e3}`),
        ),
        [0.6666]: t.object({
          [66666]: t.tuple(
            t.eq(`${6}`),
            t.eq("+"),
            t.eq(`${6e1}`),
            t.eq("+"),
            t.eq(`${6e2}`),
            t.eq("+"),
            t.eq(`${6e3}`),
            t.eq("+"),
            t.eq(`${6e4}`),
          ),
          [0.66666]: t.object({
            [666666]: t.tuple(
              t.eq(`${6}`),
              t.eq("+"),
              t.eq(`${6e1}`),
              t.eq("+"),
              t.eq(`${6e2}`),
              t.eq("+"),
              t.eq(`${6e3}`),
              t.eq("+"),
              t.eq(`${6e4}`),
              t.eq("+"),
              t.eq(`${6e5}`),
            ),
          }),
        }),
      }),
    }),
  }),
  [7]: t.tuple(t.eq(`${7}`)),
  [0.7]: t.object({
    [77]: t.tuple(t.eq(`${7}`), t.eq("+"), t.eq(`${7e1}`)),
    [0.77]: t.object({
      [777]: t.tuple(t.eq(`${7}`), t.eq("+"), t.eq(`${7e1}`), t.eq(`${7e2}`)),
      [0.777]: t.object({
        [7777]: t.tuple(
          t.eq(`${7}`),
          t.eq("+"),
          t.eq(`${7e1}`),
          t.eq("+"),
          t.eq(`${7e2}`),
          t.eq("+"),
          t.eq(`${7e3}`),
        ),
        [0.7777]: t.object({
          [77777]: t.tuple(
            t.eq(`${7}`),
            t.eq("+"),
            t.eq(`${7e1}`),
            t.eq("+"),
            t.eq(`${7e2}`),
            t.eq("+"),
            t.eq(`${7e3}`),
            t.eq("+"),
            t.eq(`${7e4}`),
          ),
          [0.77777]: t.object({
            [777777]: t.tuple(
              t.eq(`${7}`),
              t.eq("+"),
              t.eq(`${7e1}`),
              t.eq("+"),
              t.eq(`${7e2}`),
              t.eq("+"),
              t.eq(`${7e3}`),
              t.eq("+"),
              t.eq(`${7e4}`),
              t.eq("+"),
              t.eq(`${7e5}`),
            ),
            [0.777777]: t.object({
              [7777777]: t.tuple(
                t.eq(`${7}`),
                t.eq("+"),
                t.eq(`${7e1}`),
                t.eq("+"),
                t.eq(`${7e2}`),
                t.eq("+"),
                t.eq(`${7e3}`),
                t.eq("+"),
                t.eq(`${7e4}`),
                t.eq("+"),
                t.eq(`${7e5}`),
                t.eq("+"),
                t.eq(`${7e6}`),
              ),
            }),
          }),
        }),
      }),
    }),
  }),
  [8]: t.tuple(t.eq(`${8}`)),
  [0.8]: t.object({
    [88]: t.tuple(t.eq(`${8}`), t.eq("+"), t.eq(`${8e1}`)),
    [0.88]: t.object({
      [888]: t.tuple(t.eq(`${8}`), t.eq("+"), t.eq(`${8e1}`), t.eq(`${8e2}`)),
      [0.888]: t.object({
        [8888]: t.tuple(
          t.eq(`${8}`),
          t.eq("+"),
          t.eq(`${8e1}`),
          t.eq("+"),
          t.eq(`${8e2}`),
          t.eq("+"),
          t.eq(`${8e3}`),
        ),
        [0.8888]: t.object({
          [88888]: t.tuple(
            t.eq(`${8}`),
            t.eq("+"),
            t.eq(`${8e1}`),
            t.eq("+"),
            t.eq(`${8e2}`),
            t.eq("+"),
            t.eq(`${8e3}`),
            t.eq("+"),
            t.eq(`${8e4}`),
          ),
          [0.88888]: t.object({
            [888888]: t.tuple(
              t.eq(`${8}`),
              t.eq("+"),
              t.eq(`${8e1}`),
              t.eq("+"),
              t.eq(`${8e2}`),
              t.eq("+"),
              t.eq(`${8e3}`),
              t.eq("+"),
              t.eq(`${8e4}`),
              t.eq("+"),
              t.eq(`${8e5}`),
            ),
            [0.888888]: t.object({
              [8888888]: t.tuple(
                t.eq(`${8}`),
                t.eq("+"),
                t.eq(`${8e1}`),
                t.eq("+"),
                t.eq(`${8e2}`),
                t.eq("+"),
                t.eq(`${8e3}`),
                t.eq("+"),
                t.eq(`${8e4}`),
                t.eq("+"),
                t.eq(`${8e5}`),
                t.eq("+"),
                t.eq(`${8e6}`),
              ),
              [0.8888888]: t.object({
                [88888888]: t.tuple(
                  t.eq(`${8}`),
                  t.eq("+"),
                  t.eq(`${8e1}`),
                  t.eq("+"),
                  t.eq(`${8e2}`),
                  t.eq("+"),
                  t.eq(`${8e3}`),
                  t.eq("+"),
                  t.eq(`${8e4}`),
                  t.eq("+"),
                  t.eq(`${8e5}`),
                  t.eq("+"),
                  t.eq(`${8e6}`),
                  t.eq("+"),
                  t.eq(`${8e7}`),
                ),
                [0.88888888]: t.object({
                  [888888888]: t.tuple(
                    t.eq(`${8}`),
                    t.eq("+"),
                    t.eq(`${8e1}`),
                    t.eq("+"),
                    t.eq(`${8e2}`),
                    t.eq("+"),
                    t.eq(`${8e3}`),
                    t.eq("+"),
                    t.eq(`${8e4}`),
                    t.eq("+"),
                    t.eq(`${8e5}`),
                    t.eq("+"),
                    t.eq(`${8e6}`),
                    t.eq("+"),
                    t.eq(`${8e7}`),
                    t.eq("+"),
                    t.eq(`${8e8}`),
                  ),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
  [9]: t.tuple(t.eq(`${9}`)),
  [0.9]: t.object({
    [99]: t.tuple(t.eq(`${9}`), t.eq("+"), t.eq(`${9e1}`)),
    [0.99]: t.object({
      [999]: t.tuple(t.eq(`${9}`), t.eq("+"), t.eq(`${9e1}`), t.eq(`${9e2}`)),
      [0.999]: t.object({
        [9999]: t.tuple(
          t.eq(`${9}`),
          t.eq("+"),
          t.eq(`${9e1}`),
          t.eq("+"),
          t.eq(`${9e2}`),
          t.eq("+"),
          t.eq(`${9e3}`),
        ),
        [0.9999]: t.object({
          [99999]: t.tuple(
            t.eq(`${9}`),
            t.eq("+"),
            t.eq(`${9e1}`),
            t.eq("+"),
            t.eq(`${9e2}`),
            t.eq("+"),
            t.eq(`${9e3}`),
            t.eq("+"),
            t.eq(`${9e4}`),
          ),
          [0.99999]: t.object({
            [999999]: t.tuple(
              t.eq(`${9}`),
              t.eq("+"),
              t.eq(`${9e1}`),
              t.eq("+"),
              t.eq(`${9e2}`),
              t.eq("+"),
              t.eq(`${9e3}`),
              t.eq("+"),
              t.eq(`${9e4}`),
              t.eq("+"),
              t.eq(`${9e5}`),
            ),
            [0.999999]: t.object({
              [9999999]: t.tuple(
                t.eq(`${9}`),
                t.eq("+"),
                t.eq(`${9e1}`),
                t.eq("+"),
                t.eq(`${9e2}`),
                t.eq("+"),
                t.eq(`${9e3}`),
                t.eq("+"),
                t.eq(`${9e4}`),
                t.eq("+"),
                t.eq(`${9e5}`),
                t.eq("+"),
                t.eq(`${9e6}`),
              ),
              [0.9999999]: t.object({
                [99999999]: t.tuple(
                  t.eq(`${9}`),
                  t.eq("+"),
                  t.eq(`${9e1}`),
                  t.eq("+"),
                  t.eq(`${9e2}`),
                  t.eq("+"),
                  t.eq(`${9e3}`),
                  t.eq("+"),
                  t.eq(`${9e4}`),
                  t.eq("+"),
                  t.eq(`${9e5}`),
                  t.eq("+"),
                  t.eq(`${9e6}`),
                  t.eq("+"),
                  t.eq(`${9e7}`),
                ),
                [0.99999999]: t.object({
                  [999999999]: t.tuple(
                    t.eq(`${9}`),
                    t.eq("+"),
                    t.eq(`${9e1}`),
                    t.eq("+"),
                    t.eq(`${9e2}`),
                    t.eq("+"),
                    t.eq(`${9e3}`),
                    t.eq("+"),
                    t.eq(`${9e4}`),
                    t.eq("+"),
                    t.eq(`${9e5}`),
                    t.eq("+"),
                    t.eq(`${9e6}`),
                    t.eq("+"),
                    t.eq(`${9e7}`),
                    t.eq("+"),
                    t.eq(`${9e8}`),
                  ),
                  [0.999999999]: t.object({
                    [9999999999]: t.tuple(
                      t.eq(`${9}`),
                      t.eq("+"),
                      t.eq(`${9e1}`),
                      t.eq("+"),
                      t.eq(`${9e2}`),
                      t.eq("+"),
                      t.eq(`${9e3}`),
                      t.eq("+"),
                      t.eq(`${9e4}`),
                      t.eq("+"),
                      t.eq(`${9e5}`),
                      t.eq("+"),
                      t.eq(`${9e6}`),
                      t.eq("+"),
                      t.eq(`${9e7}`),
                      t.eq("+"),
                      t.eq(`${9e8}`),
                      t.eq("+"),
                      t.eq(`${9e9}`),
                    ),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
})

/**
 * ### Performance side-by-side
 * 
 * Here's the `zod` schema
 * 
 * Note that the definition is roughly the same number of lines 
 * (436 lines vs. 400 lines for `z` and `t`, respectively):
 * 
 * __z: schema__
 * 
 * |    Metric    |    Value    |
 * |--------------|-------------|
 * | vendor       | traversable |
 * | line span    |   L755-1191 |
 * | line count   |         436 |
 * | formatter    |    prettier |
 * |--------------|-------------|
 * 
 */

const ZodSchema = z.object({
  [1]: z.tuple([z.literal(`${3}`)]),
  [2]: z.tuple([z.literal(`${3}`)]),
  [0.2]: z.object({
    [22]: z.tuple([z.literal(`${3}`), z.literal("+"), z.literal(`${3e1}`)]),
  }),
  [3]: z.tuple([z.literal(`${3}`)]),
  [0.3]: z.object({
    [33]: z.tuple([z.literal(`${3}`), z.literal("+"), z.literal(`${3e1}`)]),
    [0.33]: z.object({
      [333]: z.tuple([
        z.literal(`${3}`),
        z.literal("+"),
        z.literal(`${3e1}`),
        z.literal(`${3e2}`),
      ]),
    }),
  }),
  [4]: z.tuple([z.literal(`${4}`)]),
  [0.4]: z.object({
    [44]: z.tuple([z.literal(`${4}`), z.literal("+"), z.literal(`${4e1}`)]),
    [0.44]: z.object({
      [444]: z.tuple([
        z.literal(`${4}`),
        z.literal("+"),
        z.literal(`${4e1}`),
        z.literal(`${4e2}`),
      ]),
      [0.444]: z.object({
        [4444]: z.tuple([
          z.literal(`${4}`),
          z.literal("+"),
          z.literal(`${4e1}`),
          z.literal("+"),
          z.literal(`${4e2}`),
          z.literal("+"),
          z.literal(`${4e3}`),
        ]),
      }),
    }),
  }),
  [5]: z.tuple([z.literal(`${5}`)]),
  [0.5]: z.object({
    [55]: z.tuple([z.literal(`${5}`), z.literal("+"), z.literal(`${5e1}`)]),
    [0.55]: z.object({
      [555]: z.tuple([
        z.literal(`${5}`),
        z.literal("+"),
        z.literal(`${5e1}`),
        z.literal(`${5e2}`),
      ]),
      [0.555]: z.object({
        [5555]: z.tuple([
          z.literal(`${5}`),
          z.literal("+"),
          z.literal(`${5e1}`),
          z.literal("+"),
          z.literal(`${5e2}`),
          z.literal("+"),
          z.literal(`${5e3}`),
        ]),
        [0.5555]: z.object({
          [55555]: z.tuple([
            z.literal(`${5}`),
            z.literal("+"),
            z.literal(`${5e1}`),
            z.literal("+"),
            z.literal(`${5e2}`),
            z.literal("+"),
            z.literal(`${5e3}`),
            z.literal("+"),
            z.literal(`${5e4}`),
          ]),
        }),
      }),
    }),
  }),
  [6]: z.tuple([z.literal(`${6}`)]),
  [0.6]: z.object({
    [66]: z.tuple([z.literal(`${6}`), z.literal("+"), z.literal(`${6e1}`)]),
    [0.66]: z.object({
      [666]: z.tuple([
        z.literal(`${6}`),
        z.literal("+"),
        z.literal(`${6e1}`),
        z.literal(`${6e2}`),
      ]),
      [0.666]: z.object({
        [6666]: z.tuple([
          z.literal(`${6}`),
          z.literal("+"),
          z.literal(`${6e1}`),
          z.literal("+"),
          z.literal(`${6e2}`),
          z.literal("+"),
          z.literal(`${6e3}`),
        ]),
        [0.6666]: z.object({
          [66666]: z.tuple([
            z.literal(`${6}`),
            z.literal("+"),
            z.literal(`${6e1}`),
            z.literal("+"),
            z.literal(`${6e2}`),
            z.literal("+"),
            z.literal(`${6e3}`),
            z.literal("+"),
            z.literal(`${6e4}`),
          ]),
          [0.66666]: z.object({
            [666666]: z.tuple([
              z.literal(`${6}`),
              z.literal("+"),
              z.literal(`${6e1}`),
              z.literal("+"),
              z.literal(`${6e2}`),
              z.literal("+"),
              z.literal(`${6e3}`),
              z.literal("+"),
              z.literal(`${6e4}`),
              z.literal("+"),
              z.literal(`${6e5}`),
            ]),
          }),
        }),
      }),
    }),
  }),
  [7]: z.tuple([z.literal(`${7}`)]),
  [0.7]: z.object({
    [77]: z.tuple([z.literal(`${7}`), z.literal("+"), z.literal(`${7e1}`)]),
    [0.77]: z.object({
      [777]: z.tuple([
        z.literal(`${7}`),
        z.literal("+"),
        z.literal(`${7e1}`),
        z.literal(`${7e2}`),
      ]),
      [0.777]: z.object({
        [7777]: z.tuple([
          z.literal(`${7}`),
          z.literal("+"),
          z.literal(`${7e1}`),
          z.literal("+"),
          z.literal(`${7e2}`),
          z.literal("+"),
          z.literal(`${7e3}`),
        ]),
        [0.7777]: z.object({
          [77777]: z.tuple([
            z.literal(`${7}`),
            z.literal("+"),
            z.literal(`${7e1}`),
            z.literal("+"),
            z.literal(`${7e2}`),
            z.literal("+"),
            z.literal(`${7e3}`),
            z.literal("+"),
            z.literal(`${7e4}`),
          ]),
          [0.77777]: z.object({
            [777777]: z.tuple([
              z.literal(`${7}`),
              z.literal("+"),
              z.literal(`${7e1}`),
              z.literal("+"),
              z.literal(`${7e2}`),
              z.literal("+"),
              z.literal(`${7e3}`),
              z.literal("+"),
              z.literal(`${7e4}`),
              z.literal("+"),
              z.literal(`${7e5}`),
            ]),
            [0.777777]: z.object({
              [7777777]: z.tuple([
                z.literal(`${7}`),
                z.literal("+"),
                z.literal(`${7e1}`),
                z.literal("+"),
                z.literal(`${7e2}`),
                z.literal("+"),
                z.literal(`${7e3}`),
                z.literal("+"),
                z.literal(`${7e4}`),
                z.literal("+"),
                z.literal(`${7e5}`),
                z.literal("+"),
                z.literal(`${7e6}`),
              ]),
            }),
          }),
        }),
      }),
    }),
  }),
  [8]: z.tuple([z.literal(`${8}`)]),
  [0.8]: z.object({
    [88]: z.tuple([z.literal(`${8}`), z.literal("+"), z.literal(`${8e1}`)]),
    [0.88]: z.object({
      [888]: z.tuple([
        z.literal(`${8}`),
        z.literal("+"),
        z.literal(`${8e1}`),
        z.literal(`${8e2}`),
      ]),
      [0.888]: z.object({
        [8888]: z.tuple([
          z.literal(`${8}`),
          z.literal("+"),
          z.literal(`${8e1}`),
          z.literal("+"),
          z.literal(`${8e2}`),
          z.literal("+"),
          z.literal(`${8e3}`),
        ]),
        [0.8888]: z.object({
          [88888]: z.tuple([
            z.literal(`${8}`),
            z.literal("+"),
            z.literal(`${8e1}`),
            z.literal("+"),
            z.literal(`${8e2}`),
            z.literal("+"),
            z.literal(`${8e3}`),
            z.literal("+"),
            z.literal(`${8e4}`),
          ]),
          [0.88888]: z.object({
            [888888]: z.tuple([
              z.literal(`${8}`),
              z.literal("+"),
              z.literal(`${8e1}`),
              z.literal("+"),
              z.literal(`${8e2}`),
              z.literal("+"),
              z.literal(`${8e3}`),
              z.literal("+"),
              z.literal(`${8e4}`),
              z.literal("+"),
              z.literal(`${8e5}`),
            ]),
            [0.888888]: z.object({
              [8888888]: z.tuple([
                z.literal(`${8}`),
                z.literal("+"),
                z.literal(`${8e1}`),
                z.literal("+"),
                z.literal(`${8e2}`),
                z.literal("+"),
                z.literal(`${8e3}`),
                z.literal("+"),
                z.literal(`${8e4}`),
                z.literal("+"),
                z.literal(`${8e5}`),
                z.literal("+"),
                z.literal(`${8e6}`),
              ]),
              [0.8888888]: z.object({
                [88888888]: z.tuple([
                  z.literal(`${8}`),
                  z.literal("+"),
                  z.literal(`${8e1}`),
                  z.literal("+"),
                  z.literal(`${8e2}`),
                  z.literal("+"),
                  z.literal(`${8e3}`),
                  z.literal("+"),
                  z.literal(`${8e4}`),
                  z.literal("+"),
                  z.literal(`${8e5}`),
                  z.literal("+"),
                  z.literal(`${8e6}`),
                  z.literal("+"),
                  z.literal(`${8e7}`),
                ]),
                [0.88888888]: z.object({
                  [888888888]: z.tuple([
                    z.literal(`${8}`),
                    z.literal("+"),
                    z.literal(`${8e1}`),
                    z.literal("+"),
                    z.literal(`${8e2}`),
                    z.literal("+"),
                    z.literal(`${8e3}`),
                    z.literal("+"),
                    z.literal(`${8e4}`),
                    z.literal("+"),
                    z.literal(`${8e5}`),
                    z.literal("+"),
                    z.literal(`${8e6}`),
                    z.literal("+"),
                    z.literal(`${8e7}`),
                    z.literal("+"),
                    z.literal(`${8e8}`),
                  ]),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
  [9]: z.tuple([z.literal(`${9}`)]),
  [0.9]: z.object({
    [99]: z.tuple([z.literal(`${9}`), z.literal("+"), z.literal(`${9e1}`)]),
    [0.99]: z.object({
      [999]: z.tuple([
        z.literal(`${9}`),
        z.literal("+"),
        z.literal(`${9e1}`),
        z.literal(`${9e2}`),
      ]),
      [0.999]: z.object({
        [9999]: z.tuple([
          z.literal(`${9}`),
          z.literal("+"),
          z.literal(`${9e1}`),
          z.literal("+"),
          z.literal(`${9e2}`),
          z.literal("+"),
          z.literal(`${9e3}`),
        ]),
        [0.9999]: z.object({
          [99999]: z.tuple([
            z.literal(`${9}`),
            z.literal("+"),
            z.literal(`${9e1}`),
            z.literal("+"),
            z.literal(`${9e2}`),
            z.literal("+"),
            z.literal(`${9e3}`),
            z.literal("+"),
            z.literal(`${9e4}`),
          ]),
          [0.99999]: z.object({
            [999999]: z.tuple([
              z.literal(`${9}`),
              z.literal("+"),
              z.literal(`${9e1}`),
              z.literal("+"),
              z.literal(`${9e2}`),
              z.literal("+"),
              z.literal(`${9e3}`),
              z.literal("+"),
              z.literal(`${9e4}`),
              z.literal("+"),
              z.literal(`${9e5}`),
            ]),
            [0.999999]: z.object({
              [9999999]: z.tuple([
                z.literal(`${9}`),
                z.literal("+"),
                z.literal(`${9e1}`),
                z.literal("+"),
                z.literal(`${9e2}`),
                z.literal("+"),
                z.literal(`${9e3}`),
                z.literal("+"),
                z.literal(`${9e4}`),
                z.literal("+"),
                z.literal(`${9e5}`),
                z.literal("+"),
                z.literal(`${9e6}`),
              ]),
              [0.9999999]: z.object({
                [99999999]: z.tuple([
                  z.literal(`${9}`),
                  z.literal("+"),
                  z.literal(`${9e1}`),
                  z.literal("+"),
                  z.literal(`${9e2}`),
                  z.literal("+"),
                  z.literal(`${9e3}`),
                  z.literal("+"),
                  z.literal(`${9e4}`),
                  z.literal("+"),
                  z.literal(`${9e5}`),
                  z.literal("+"),
                  z.literal(`${9e6}`),
                  z.literal("+"),
                  z.literal(`${9e7}`),
                ]),
                [0.99999999]: z.object({
                  [999999999]: z.tuple([
                    z.literal(`${9}`),
                    z.literal("+"),
                    z.literal(`${9e1}`),
                    z.literal("+"),
                    z.literal(`${9e2}`),
                    z.literal("+"),
                    z.literal(`${9e3}`),
                    z.literal("+"),
                    z.literal(`${9e4}`),
                    z.literal("+"),
                    z.literal(`${9e5}`),
                    z.literal("+"),
                    z.literal(`${9e6}`),
                    z.literal("+"),
                    z.literal(`${9e7}`),
                    z.literal("+"),
                    z.literal(`${9e8}`),
                  ]),
                  [0.999999999]: z.object({
                    [9999999999]: z.tuple([
                      z.literal(`${9}`),
                      z.literal("+"),
                      z.literal(`${9e1}`),
                      z.literal("+"),
                      z.literal(`${9e2}`),
                      z.literal("+"),
                      z.literal(`${9e3}`),
                      z.literal("+"),
                      z.literal(`${9e4}`),
                      z.literal("+"),
                      z.literal(`${9e5}`),
                      z.literal("+"),
                      z.literal(`${9e6}`),
                      z.literal("+"),
                      z.literal(`${9e7}`),
                      z.literal("+"),
                      z.literal(`${9e8}`),
                      z.literal("+"),
                      z.literal(`${9e9}`),
                    ]),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
})



vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema-to-string❳', () => {

  vi.it('〖⛳️〗‹ ❲side-by-side❳: zod', () => {
    /** 
     * First, let's confirm that both schemas represent the same type:
     */
    vi.assertType<Target>(ZodSchema._type)
    vi.assertType<Target>(TraversableSchema._type)

    vi.assertType<
      /** 
       * ### Performance side-by-side
       * 
       * Here's the full-length `t` schema
       * 
       * __t: schema type__
       * 
       * |    Metric             |    Value    |
       * |-----------------------|-------------|
       * | span                  |  L1226-1671 |
       * | line count            |         445 |
       * | formatter             |    prettier |
       * | % greater than target |  __51.87%__ |
       * |-----------------------|-------------|
       * 
       * Showing my math for `% greater than target`
       * 
       * ```
       * (445 / 293) * 100 - 100 = 51.877133105802045`
       * ```
       */

      t.object<{
        1: t.tuple<[t.eq<"3">]>
        2: t.tuple<[t.eq<"3">]>
        0.2: t.object<{ 22: t.tuple<[t.eq<"3">, t.eq<"+">, t.eq<"30">]> }>
        3: t.tuple<[t.eq<"3">]>
        0.3: t.object<{
          33: t.tuple<[t.eq<"3">, t.eq<"+">, t.eq<"30">]>
          0.33: t.object<{
            333: t.tuple<[t.eq<"3">, t.eq<"+">, t.eq<"30">, t.eq<"300">]>
          }>
        }>
        4: t.tuple<[t.eq<"4">]>
        0.4: t.object<{
          44: t.tuple<[t.eq<"4">, t.eq<"+">, t.eq<"40">]>
          0.44: t.object<{
            444: t.tuple<[t.eq<"4">, t.eq<"+">, t.eq<"40">, t.eq<"400">]>
            0.444: t.object<{
              4444: t.tuple<
                [
                  t.eq<"4">,
                  t.eq<"+">,
                  t.eq<"40">,
                  t.eq<"+">,
                  t.eq<"400">,
                  t.eq<"+">,
                  t.eq<"4000">,
                ]
              >
            }>
          }>
        }>
        5: t.tuple<[t.eq<"5">]>
        0.5: t.object<{
          55: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">]>
          0.55: t.object<{
            555: t.tuple<[t.eq<"5">, t.eq<"+">, t.eq<"50">, t.eq<"500">]>
            0.555: t.object<{
              5555: t.tuple<
                [
                  t.eq<"5">,
                  t.eq<"+">,
                  t.eq<"50">,
                  t.eq<"+">,
                  t.eq<"500">,
                  t.eq<"+">,
                  t.eq<"5000">,
                ]
              >
              0.5555: t.object<{
                55555: t.tuple<
                  [
                    t.eq<"5">,
                    t.eq<"+">,
                    t.eq<"50">,
                    t.eq<"+">,
                    t.eq<"500">,
                    t.eq<"+">,
                    t.eq<"5000">,
                    t.eq<"+">,
                    t.eq<"50000">,
                  ]
                >
              }>
            }>
          }>
        }>
        6: t.tuple<[t.eq<"6">]>
        0.6: t.object<{
          66: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">]>
          0.66: t.object<{
            666: t.tuple<[t.eq<"6">, t.eq<"+">, t.eq<"60">, t.eq<"600">]>
            0.666: t.object<{
              6666: t.tuple<
                [
                  t.eq<"6">,
                  t.eq<"+">,
                  t.eq<"60">,
                  t.eq<"+">,
                  t.eq<"600">,
                  t.eq<"+">,
                  t.eq<"6000">,
                ]
              >
              0.6666: t.object<{
                66666: t.tuple<
                  [
                    t.eq<"6">,
                    t.eq<"+">,
                    t.eq<"60">,
                    t.eq<"+">,
                    t.eq<"600">,
                    t.eq<"+">,
                    t.eq<"6000">,
                    t.eq<"+">,
                    t.eq<"60000">,
                  ]
                >
                0.66666: t.object<{
                  666666: t.tuple<
                    [
                      t.eq<"6">,
                      t.eq<"+">,
                      t.eq<"60">,
                      t.eq<"+">,
                      t.eq<"600">,
                      t.eq<"+">,
                      t.eq<"6000">,
                      t.eq<"+">,
                      t.eq<"60000">,
                      t.eq<"+">,
                      t.eq<"600000">,
                    ]
                  >
                }>
              }>
            }>
          }>
        }>
        7: t.tuple<[t.eq<"7">]>
        0.7: t.object<{
          77: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">]>
          0.77: t.object<{
            777: t.tuple<[t.eq<"7">, t.eq<"+">, t.eq<"70">, t.eq<"700">]>
            0.777: t.object<{
              7777: t.tuple<
                [
                  t.eq<"7">,
                  t.eq<"+">,
                  t.eq<"70">,
                  t.eq<"+">,
                  t.eq<"700">,
                  t.eq<"+">,
                  t.eq<"7000">,
                ]
              >
              0.7777: t.object<{
                77777: t.tuple<
                  [
                    t.eq<"7">,
                    t.eq<"+">,
                    t.eq<"70">,
                    t.eq<"+">,
                    t.eq<"700">,
                    t.eq<"+">,
                    t.eq<"7000">,
                    t.eq<"+">,
                    t.eq<"70000">,
                  ]
                >
                0.77777: t.object<{
                  777777: t.tuple<
                    [
                      t.eq<"7">,
                      t.eq<"+">,
                      t.eq<"70">,
                      t.eq<"+">,
                      t.eq<"700">,
                      t.eq<"+">,
                      t.eq<"7000">,
                      t.eq<"+">,
                      t.eq<"70000">,
                      t.eq<"+">,
                      t.eq<"700000">,
                    ]
                  >
                  0.777777: t.object<{
                    7777777: t.tuple<
                      [
                        t.eq<"7">,
                        t.eq<"+">,
                        t.eq<"70">,
                        t.eq<"+">,
                        t.eq<"700">,
                        t.eq<"+">,
                        t.eq<"7000">,
                        t.eq<"+">,
                        t.eq<"70000">,
                        t.eq<"+">,
                        t.eq<"700000">,
                        t.eq<"+">,
                        t.eq<"7000000">,
                      ]
                    >
                  }>
                }>
              }>
            }>
          }>
        }>
        8: t.tuple<[t.eq<"8">]>
        0.8: t.object<{
          88: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">]>
          0.88: t.object<{
            888: t.tuple<[t.eq<"8">, t.eq<"+">, t.eq<"80">, t.eq<"800">]>
            0.888: t.object<{
              8888: t.tuple<
                [
                  t.eq<"8">,
                  t.eq<"+">,
                  t.eq<"80">,
                  t.eq<"+">,
                  t.eq<"800">,
                  t.eq<"+">,
                  t.eq<"8000">,
                ]
              >
              0.8888: t.object<{
                88888: t.tuple<
                  [
                    t.eq<"8">,
                    t.eq<"+">,
                    t.eq<"80">,
                    t.eq<"+">,
                    t.eq<"800">,
                    t.eq<"+">,
                    t.eq<"8000">,
                    t.eq<"+">,
                    t.eq<"80000">,
                  ]
                >
                0.88888: t.object<{
                  888888: t.tuple<
                    [
                      t.eq<"8">,
                      t.eq<"+">,
                      t.eq<"80">,
                      t.eq<"+">,
                      t.eq<"800">,
                      t.eq<"+">,
                      t.eq<"8000">,
                      t.eq<"+">,
                      t.eq<"80000">,
                      t.eq<"+">,
                      t.eq<"800000">,
                    ]
                  >
                  0.888888: t.object<{
                    8888888: t.tuple<
                      [
                        t.eq<"8">,
                        t.eq<"+">,
                        t.eq<"80">,
                        t.eq<"+">,
                        t.eq<"800">,
                        t.eq<"+">,
                        t.eq<"8000">,
                        t.eq<"+">,
                        t.eq<"80000">,
                        t.eq<"+">,
                        t.eq<"800000">,
                        t.eq<"+">,
                        t.eq<"8000000">,
                      ]
                    >
                    0.8888888: t.object<{
                      88888888: t.tuple<
                        [
                          t.eq<"8">,
                          t.eq<"+">,
                          t.eq<"80">,
                          t.eq<"+">,
                          t.eq<"800">,
                          t.eq<"+">,
                          t.eq<"8000">,
                          t.eq<"+">,
                          t.eq<"80000">,
                          t.eq<"+">,
                          t.eq<"800000">,
                          t.eq<"+">,
                          t.eq<"8000000">,
                          t.eq<"+">,
                          t.eq<"80000000">,
                        ]
                      >
                      0.88888888: t.object<{
                        888888888: t.tuple<
                          [
                            t.eq<"8">,
                            t.eq<"+">,
                            t.eq<"80">,
                            t.eq<"+">,
                            t.eq<"800">,
                            t.eq<"+">,
                            t.eq<"8000">,
                            t.eq<"+">,
                            t.eq<"80000">,
                            t.eq<"+">,
                            t.eq<"800000">,
                            t.eq<"+">,
                            t.eq<"8000000">,
                            t.eq<"+">,
                            t.eq<"80000000">,
                            t.eq<"+">,
                            t.eq<"800000000">,
                          ]
                        >
                      }>
                    }>
                  }>
                }>
              }>
            }>
          }>
        }>
        9: t.tuple<[t.eq<"9">]>
        0.9: t.object<{
          99: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">]>
          0.99: t.object<{
            999: t.tuple<[t.eq<"9">, t.eq<"+">, t.eq<"90">, t.eq<"900">]>
            0.999: t.object<{
              9999: t.tuple<
                [
                  t.eq<"9">,
                  t.eq<"+">,
                  t.eq<"90">,
                  t.eq<"+">,
                  t.eq<"900">,
                  t.eq<"+">,
                  t.eq<"9000">,
                ]
              >
              0.9999: t.object<{
                99999: t.tuple<
                  [
                    t.eq<"9">,
                    t.eq<"+">,
                    t.eq<"90">,
                    t.eq<"+">,
                    t.eq<"900">,
                    t.eq<"+">,
                    t.eq<"9000">,
                    t.eq<"+">,
                    t.eq<"90000">,
                  ]
                >
                0.99999: t.object<{
                  999999: t.tuple<
                    [
                      t.eq<"9">,
                      t.eq<"+">,
                      t.eq<"90">,
                      t.eq<"+">,
                      t.eq<"900">,
                      t.eq<"+">,
                      t.eq<"9000">,
                      t.eq<"+">,
                      t.eq<"90000">,
                      t.eq<"+">,
                      t.eq<"900000">,
                    ]
                  >
                  0.999999: t.object<{
                    9999999: t.tuple<
                      [
                        t.eq<"9">,
                        t.eq<"+">,
                        t.eq<"90">,
                        t.eq<"+">,
                        t.eq<"900">,
                        t.eq<"+">,
                        t.eq<"9000">,
                        t.eq<"+">,
                        t.eq<"90000">,
                        t.eq<"+">,
                        t.eq<"900000">,
                        t.eq<"+">,
                        t.eq<"9000000">,
                      ]
                    >
                    0.9999999: t.object<{
                      99999999: t.tuple<
                        [
                          t.eq<"9">,
                          t.eq<"+">,
                          t.eq<"90">,
                          t.eq<"+">,
                          t.eq<"900">,
                          t.eq<"+">,
                          t.eq<"9000">,
                          t.eq<"+">,
                          t.eq<"90000">,
                          t.eq<"+">,
                          t.eq<"900000">,
                          t.eq<"+">,
                          t.eq<"9000000">,
                          t.eq<"+">,
                          t.eq<"90000000">,
                        ]
                      >
                      0.99999999: t.object<{
                        999999999: t.tuple<
                          [
                            t.eq<"9">,
                            t.eq<"+">,
                            t.eq<"90">,
                            t.eq<"+">,
                            t.eq<"900">,
                            t.eq<"+">,
                            t.eq<"9000">,
                            t.eq<"+">,
                            t.eq<"90000">,
                            t.eq<"+">,
                            t.eq<"900000">,
                            t.eq<"+">,
                            t.eq<"9000000">,
                            t.eq<"+">,
                            t.eq<"90000000">,
                            t.eq<"+">,
                            t.eq<"900000000">,
                          ]
                        >
                        0.999999999: t.object<{
                          9999999999: t.tuple<
                            [
                              t.eq<"9">,
                              t.eq<"+">,
                              t.eq<"90">,
                              t.eq<"+">,
                              t.eq<"900">,
                              t.eq<"+">,
                              t.eq<"9000">,
                              t.eq<"+">,
                              t.eq<"90000">,
                              t.eq<"+">,
                              t.eq<"900000">,
                              t.eq<"+">,
                              t.eq<"9000000">,
                              t.eq<"+">,
                              t.eq<"90000000">,
                              t.eq<"+">,
                              t.eq<"900000000">,
                              t.eq<"+">,
                              t.eq<"9000000000">,
                            ]
                          >
                        }>
                      }>
                    }>
                  }>
                }>
              }>
            }>
          }>
        }>
      }>
    >(TraversableSchema)

    vi.assertType<
      /** 
       * ### Performance side-by-side
       * 
       * Here's the full-length `z` schema
       * 
       * __z: schema type__
       * 
       * |        Metric         |     Value     |
       * |-----------------------|---------------|
       * | span                  |    L1696-6349 |
       * | line count            |          4653 |
       * | formatter             |      prettier |
       * | % greater than target |  __1488.05%__ |
       * |-----------------------|---------------|
       * 
       * Showing my math for `% greater than target`
       * 
       * ```
       * (4653 / 293) * 100 - 100 = 1488.0546075085324`
       * ```
       */

      z.ZodObject<{
        1: z.ZodTuple<[z.ZodLiteral<"3">], null>
        2: z.ZodTuple<[z.ZodLiteral<"3">], null>
        0.2: z.ZodObject<
          {
            22: z.ZodTuple<
              [z.ZodLiteral<"3">, z.ZodLiteral<"+">, z.ZodLiteral<"30">],
              null
            >
          },
          "strip",
          z.ZodTypeAny,
          { 22: ["3", "+", "30"] },
          { 22: ["3", "+", "30"] }
        >
        3: z.ZodTuple<[z.ZodLiteral<"3">], null>
        0.3: z.ZodObject<
          {
            33: z.ZodTuple<
              [z.ZodLiteral<"3">, z.ZodLiteral<"+">, z.ZodLiteral<"30">],
              null
            >
            0.33: z.ZodObject<
              {
                333: z.ZodTuple<
                  [
                    z.ZodLiteral<"3">,
                    z.ZodLiteral<"+">,
                    z.ZodLiteral<"30">,
                    z.ZodLiteral<"300">,
                  ],
                  null
                >
              },
              "strip",
              z.ZodTypeAny,
              { 333: ["3", "+", "30", "300"] },
              { 333: ["3", "+", "30", "300"] }
            >
          },
          "strip",
          z.ZodTypeAny,
          { 33: ["3", "+", "30"]; 0.33: { 333: ["3", "+", "30", "300"] } },
          { 33: ["3", "+", "30"]; 0.33: { 333: ["3", "+", "30", "300"] } }
        >
        4: z.ZodTuple<[z.ZodLiteral<"4">], null>
        0.4: z.ZodObject<
          {
            44: z.ZodTuple<
              [z.ZodLiteral<"4">, z.ZodLiteral<"+">, z.ZodLiteral<"40">],
              null
            >
            0.44: z.ZodObject<
              {
                444: z.ZodTuple<
                  [
                    z.ZodLiteral<"4">,
                    z.ZodLiteral<"+">,
                    z.ZodLiteral<"40">,
                    z.ZodLiteral<"400">,
                  ],
                  null
                >
                0.444: z.ZodObject<
                  {
                    4444: z.ZodTuple<
                      [
                        z.ZodLiteral<"4">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"40">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"400">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"4000">,
                      ],
                      null
                    >
                  },
                  "strip",
                  z.ZodTypeAny,
                  { 4444: ["4", "+", "40", "+", "400", "+", "4000"] },
                  { 4444: ["4", "+", "40", "+", "400", "+", "4000"] }
                >
              },
              "strip",
              z.ZodTypeAny,
              {
                444: ["4", "+", "40", "400"]
                0.444: { 4444: ["4", "+", "40", "+", "400", "+", "4000"] }
              },
              {
                444: ["4", "+", "40", "400"]
                0.444: { 4444: ["4", "+", "40", "+", "400", "+", "4000"] }
              }
            >
          },
          "strip",
          z.ZodTypeAny,
          {
            44: ["4", "+", "40"]
            0.44: {
              444: ["4", "+", "40", "400"]
              0.444: { 4444: ["4", "+", "40", "+", "400", "+", "4000"] }
            }
          },
          {
            44: ["4", "+", "40"]
            0.44: {
              444: ["4", "+", "40", "400"]
              0.444: { 4444: ["4", "+", "40", "+", "400", "+", "4000"] }
            }
          }
        >
        5: z.ZodTuple<[z.ZodLiteral<"5">], null>
        0.5: z.ZodObject<
          {
            55: z.ZodTuple<
              [z.ZodLiteral<"5">, z.ZodLiteral<"+">, z.ZodLiteral<"50">],
              null
            >
            0.55: z.ZodObject<
              {
                555: z.ZodTuple<
                  [
                    z.ZodLiteral<"5">,
                    z.ZodLiteral<"+">,
                    z.ZodLiteral<"50">,
                    z.ZodLiteral<"500">,
                  ],
                  null
                >
                0.555: z.ZodObject<
                  {
                    5555: z.ZodTuple<
                      [
                        z.ZodLiteral<"5">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"50">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"500">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"5000">,
                      ],
                      null
                    >
                    0.5555: z.ZodObject<
                      {
                        55555: z.ZodTuple<
                          [
                            z.ZodLiteral<"5">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"50">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"500">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"5000">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"50000">,
                          ],
                          null
                        >
                      },
                      "strip",
                      z.ZodTypeAny,
                      {
                        55555: [
                          "5",
                          "+",
                          "50",
                          "+",
                          "500",
                          "+",
                          "5000",
                          "+",
                          "50000",
                        ]
                      },
                      {
                        55555: [
                          "5",
                          "+",
                          "50",
                          "+",
                          "500",
                          "+",
                          "5000",
                          "+",
                          "50000",
                        ]
                      }
                    >
                  },
                  "strip",
                  z.ZodTypeAny,
                  {
                    5555: ["5", "+", "50", "+", "500", "+", "5000"]
                    0.5555: {
                      55555: [
                        "5",
                        "+",
                        "50",
                        "+",
                        "500",
                        "+",
                        "5000",
                        "+",
                        "50000",
                      ]
                    }
                  },
                  {
                    5555: ["5", "+", "50", "+", "500", "+", "5000"]
                    0.5555: {
                      55555: [
                        "5",
                        "+",
                        "50",
                        "+",
                        "500",
                        "+",
                        "5000",
                        "+",
                        "50000",
                      ]
                    }
                  }
                >
              },
              "strip",
              z.ZodTypeAny,
              {
                555: ["5", "+", "50", "500"]
                0.555: {
                  5555: ["5", "+", "50", "+", "500", "+", "5000"]
                  0.5555: {
                    55555: ["5", "+", "50", "+", "500", "+", "5000", "+", "50000"]
                  }
                }
              },
              {
                555: ["5", "+", "50", "500"]
                0.555: {
                  5555: ["5", "+", "50", "+", "500", "+", "5000"]
                  0.5555: {
                    55555: ["5", "+", "50", "+", "500", "+", "5000", "+", "50000"]
                  }
                }
              }
            >
          },
          "strip",
          z.ZodTypeAny,
          {
            55: ["5", "+", "50"]
            0.55: {
              555: ["5", "+", "50", "500"]
              0.555: {
                5555: ["5", "+", "50", "+", "500", "+", "5000"]
                0.5555: {
                  55555: ["5", "+", "50", "+", "500", "+", "5000", "+", "50000"]
                }
              }
            }
          },
          {
            55: ["5", "+", "50"]
            0.55: {
              555: ["5", "+", "50", "500"]
              0.555: {
                5555: ["5", "+", "50", "+", "500", "+", "5000"]
                0.5555: {
                  55555: ["5", "+", "50", "+", "500", "+", "5000", "+", "50000"]
                }
              }
            }
          }
        >
        6: z.ZodTuple<[z.ZodLiteral<"6">], null>
        0.6: z.ZodObject<
          {
            66: z.ZodTuple<
              [z.ZodLiteral<"6">, z.ZodLiteral<"+">, z.ZodLiteral<"60">],
              null
            >
            0.66: z.ZodObject<
              {
                666: z.ZodTuple<
                  [
                    z.ZodLiteral<"6">,
                    z.ZodLiteral<"+">,
                    z.ZodLiteral<"60">,
                    z.ZodLiteral<"600">,
                  ],
                  null
                >
                0.666: z.ZodObject<
                  {
                    6666: z.ZodTuple<
                      [
                        z.ZodLiteral<"6">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"60">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"600">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"6000">,
                      ],
                      null
                    >
                    0.6666: z.ZodObject<
                      {
                        66666: z.ZodTuple<
                          [
                            z.ZodLiteral<"6">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"60">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"600">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"6000">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"60000">,
                          ],
                          null
                        >
                        0.66666: z.ZodObject<
                          {
                            666666: z.ZodTuple<
                              [
                                z.ZodLiteral<"6">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"60">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"600">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"6000">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"60000">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"600000">,
                              ],
                              null
                            >
                          },
                          "strip",
                          z.ZodTypeAny,
                          {
                            666666: [
                              "6",
                              "+",
                              "60",
                              "+",
                              "600",
                              "+",
                              "6000",
                              "+",
                              "60000",
                              "+",
                              "600000",
                            ]
                          },
                          {
                            666666: [
                              "6",
                              "+",
                              "60",
                              "+",
                              "600",
                              "+",
                              "6000",
                              "+",
                              "60000",
                              "+",
                              "600000",
                            ]
                          }
                        >
                      },
                      "strip",
                      z.ZodTypeAny,
                      {
                        66666: [
                          "6",
                          "+",
                          "60",
                          "+",
                          "600",
                          "+",
                          "6000",
                          "+",
                          "60000",
                        ]
                        0.66666: {
                          666666: [
                            "6",
                            "+",
                            "60",
                            "+",
                            "600",
                            "+",
                            "6000",
                            "+",
                            "60000",
                            "+",
                            "600000",
                          ]
                        }
                      },
                      {
                        66666: [
                          "6",
                          "+",
                          "60",
                          "+",
                          "600",
                          "+",
                          "6000",
                          "+",
                          "60000",
                        ]
                        0.66666: {
                          666666: [
                            "6",
                            "+",
                            "60",
                            "+",
                            "600",
                            "+",
                            "6000",
                            "+",
                            "60000",
                            "+",
                            "600000",
                          ]
                        }
                      }
                    >
                  },
                  "strip",
                  z.ZodTypeAny,
                  {
                    6666: ["6", "+", "60", "+", "600", "+", "6000"]
                    0.6666: {
                      66666: [
                        "6",
                        "+",
                        "60",
                        "+",
                        "600",
                        "+",
                        "6000",
                        "+",
                        "60000",
                      ]
                      0.66666: {
                        666666: [
                          "6",
                          "+",
                          "60",
                          "+",
                          "600",
                          "+",
                          "6000",
                          "+",
                          "60000",
                          "+",
                          "600000",
                        ]
                      }
                    }
                  },
                  {
                    6666: ["6", "+", "60", "+", "600", "+", "6000"]
                    0.6666: {
                      66666: [
                        "6",
                        "+",
                        "60",
                        "+",
                        "600",
                        "+",
                        "6000",
                        "+",
                        "60000",
                      ]
                      0.66666: {
                        666666: [
                          "6",
                          "+",
                          "60",
                          "+",
                          "600",
                          "+",
                          "6000",
                          "+",
                          "60000",
                          "+",
                          "600000",
                        ]
                      }
                    }
                  }
                >
              },
              "strip",
              z.ZodTypeAny,
              {
                666: ["6", "+", "60", "600"]
                0.666: {
                  6666: ["6", "+", "60", "+", "600", "+", "6000"]
                  0.6666: {
                    66666: ["6", "+", "60", "+", "600", "+", "6000", "+", "60000"]
                    0.66666: {
                      666666: [
                        "6",
                        "+",
                        "60",
                        "+",
                        "600",
                        "+",
                        "6000",
                        "+",
                        "60000",
                        "+",
                        "600000",
                      ]
                    }
                  }
                }
              },
              {
                666: ["6", "+", "60", "600"]
                0.666: {
                  6666: ["6", "+", "60", "+", "600", "+", "6000"]
                  0.6666: {
                    66666: ["6", "+", "60", "+", "600", "+", "6000", "+", "60000"]
                    0.66666: {
                      666666: [
                        "6",
                        "+",
                        "60",
                        "+",
                        "600",
                        "+",
                        "6000",
                        "+",
                        "60000",
                        "+",
                        "600000",
                      ]
                    }
                  }
                }
              }
            >
          },
          "strip",
          z.ZodTypeAny,
          {
            66: ["6", "+", "60"]
            0.66: {
              666: ["6", "+", "60", "600"]
              0.666: {
                6666: ["6", "+", "60", "+", "600", "+", "6000"]
                0.6666: {
                  66666: ["6", "+", "60", "+", "600", "+", "6000", "+", "60000"]
                  0.66666: {
                    666666: [
                      "6",
                      "+",
                      "60",
                      "+",
                      "600",
                      "+",
                      "6000",
                      "+",
                      "60000",
                      "+",
                      "600000",
                    ]
                  }
                }
              }
            }
          },
          {
            66: ["6", "+", "60"]
            0.66: {
              666: ["6", "+", "60", "600"]
              0.666: {
                6666: ["6", "+", "60", "+", "600", "+", "6000"]
                0.6666: {
                  66666: ["6", "+", "60", "+", "600", "+", "6000", "+", "60000"]
                  0.66666: {
                    666666: [
                      "6",
                      "+",
                      "60",
                      "+",
                      "600",
                      "+",
                      "6000",
                      "+",
                      "60000",
                      "+",
                      "600000",
                    ]
                  }
                }
              }
            }
          }
        >
        7: z.ZodTuple<[z.ZodLiteral<"7">], null>
        0.7: z.ZodObject<
          {
            77: z.ZodTuple<
              [z.ZodLiteral<"7">, z.ZodLiteral<"+">, z.ZodLiteral<"70">],
              null
            >
            0.77: z.ZodObject<
              {
                777: z.ZodTuple<
                  [
                    z.ZodLiteral<"7">,
                    z.ZodLiteral<"+">,
                    z.ZodLiteral<"70">,
                    z.ZodLiteral<"700">,
                  ],
                  null
                >
                0.777: z.ZodObject<
                  {
                    7777: z.ZodTuple<
                      [
                        z.ZodLiteral<"7">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"70">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"700">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"7000">,
                      ],
                      null
                    >
                    0.7777: z.ZodObject<
                      {
                        77777: z.ZodTuple<
                          [
                            z.ZodLiteral<"7">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"70">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"700">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"7000">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"70000">,
                          ],
                          null
                        >
                        0.77777: z.ZodObject<
                          {
                            777777: z.ZodTuple<
                              [
                                z.ZodLiteral<"7">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"70">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"700">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"7000">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"70000">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"700000">,
                              ],
                              null
                            >
                            0.777777: z.ZodObject<
                              {
                                7777777: z.ZodTuple<
                                  [
                                    z.ZodLiteral<"7">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"70">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"700">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"7000">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"70000">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"700000">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"7000000">,
                                  ],
                                  null
                                >
                              },
                              "strip",
                              z.ZodTypeAny,
                              {
                                7777777: [
                                  "7",
                                  "+",
                                  "70",
                                  "+",
                                  "700",
                                  "+",
                                  "7000",
                                  "+",
                                  "70000",
                                  "+",
                                  "700000",
                                  "+",
                                  "7000000",
                                ]
                              },
                              {
                                7777777: [
                                  "7",
                                  "+",
                                  "70",
                                  "+",
                                  "700",
                                  "+",
                                  "7000",
                                  "+",
                                  "70000",
                                  "+",
                                  "700000",
                                  "+",
                                  "7000000",
                                ]
                              }
                            >
                          },
                          "strip",
                          z.ZodTypeAny,
                          {
                            777777: [
                              "7",
                              "+",
                              "70",
                              "+",
                              "700",
                              "+",
                              "7000",
                              "+",
                              "70000",
                              "+",
                              "700000",
                            ]
                            0.777777: {
                              7777777: [
                                "7",
                                "+",
                                "70",
                                "+",
                                "700",
                                "+",
                                "7000",
                                "+",
                                "70000",
                                "+",
                                "700000",
                                "+",
                                "7000000",
                              ]
                            }
                          },
                          {
                            777777: [
                              "7",
                              "+",
                              "70",
                              "+",
                              "700",
                              "+",
                              "7000",
                              "+",
                              "70000",
                              "+",
                              "700000",
                            ]
                            0.777777: {
                              7777777: [
                                "7",
                                "+",
                                "70",
                                "+",
                                "700",
                                "+",
                                "7000",
                                "+",
                                "70000",
                                "+",
                                "700000",
                                "+",
                                "7000000",
                              ]
                            }
                          }
                        >
                      },
                      "strip",
                      z.ZodTypeAny,
                      {
                        77777: [
                          "7",
                          "+",
                          "70",
                          "+",
                          "700",
                          "+",
                          "7000",
                          "+",
                          "70000",
                        ]
                        0.77777: {
                          777777: [
                            "7",
                            "+",
                            "70",
                            "+",
                            "700",
                            "+",
                            "7000",
                            "+",
                            "70000",
                            "+",
                            "700000",
                          ]
                          0.777777: {
                            7777777: [
                              "7",
                              "+",
                              "70",
                              "+",
                              "700",
                              "+",
                              "7000",
                              "+",
                              "70000",
                              "+",
                              "700000",
                              "+",
                              "7000000",
                            ]
                          }
                        }
                      },
                      {
                        77777: [
                          "7",
                          "+",
                          "70",
                          "+",
                          "700",
                          "+",
                          "7000",
                          "+",
                          "70000",
                        ]
                        0.77777: {
                          777777: [
                            "7",
                            "+",
                            "70",
                            "+",
                            "700",
                            "+",
                            "7000",
                            "+",
                            "70000",
                            "+",
                            "700000",
                          ]
                          0.777777: {
                            7777777: [
                              "7",
                              "+",
                              "70",
                              "+",
                              "700",
                              "+",
                              "7000",
                              "+",
                              "70000",
                              "+",
                              "700000",
                              "+",
                              "7000000",
                            ]
                          }
                        }
                      }
                    >
                  },
                  "strip",
                  z.ZodTypeAny,
                  {
                    7777: ["7", "+", "70", "+", "700", "+", "7000"]
                    0.7777: {
                      77777: [
                        "7",
                        "+",
                        "70",
                        "+",
                        "700",
                        "+",
                        "7000",
                        "+",
                        "70000",
                      ]
                      0.77777: {
                        777777: [
                          "7",
                          "+",
                          "70",
                          "+",
                          "700",
                          "+",
                          "7000",
                          "+",
                          "70000",
                          "+",
                          "700000",
                        ]
                        0.777777: {
                          7777777: [
                            "7",
                            "+",
                            "70",
                            "+",
                            "700",
                            "+",
                            "7000",
                            "+",
                            "70000",
                            "+",
                            "700000",
                            "+",
                            "7000000",
                          ]
                        }
                      }
                    }
                  },
                  {
                    7777: ["7", "+", "70", "+", "700", "+", "7000"]
                    0.7777: {
                      77777: [
                        "7",
                        "+",
                        "70",
                        "+",
                        "700",
                        "+",
                        "7000",
                        "+",
                        "70000",
                      ]
                      0.77777: {
                        777777: [
                          "7",
                          "+",
                          "70",
                          "+",
                          "700",
                          "+",
                          "7000",
                          "+",
                          "70000",
                          "+",
                          "700000",
                        ]
                        0.777777: {
                          7777777: [
                            "7",
                            "+",
                            "70",
                            "+",
                            "700",
                            "+",
                            "7000",
                            "+",
                            "70000",
                            "+",
                            "700000",
                            "+",
                            "7000000",
                          ]
                        }
                      }
                    }
                  }
                >
              },
              "strip",
              z.ZodTypeAny,
              {
                777: ["7", "+", "70", "700"]
                0.777: {
                  7777: ["7", "+", "70", "+", "700", "+", "7000"]
                  0.7777: {
                    77777: ["7", "+", "70", "+", "700", "+", "7000", "+", "70000"]
                    0.77777: {
                      777777: [
                        "7",
                        "+",
                        "70",
                        "+",
                        "700",
                        "+",
                        "7000",
                        "+",
                        "70000",
                        "+",
                        "700000",
                      ]
                      0.777777: {
                        7777777: [
                          "7",
                          "+",
                          "70",
                          "+",
                          "700",
                          "+",
                          "7000",
                          "+",
                          "70000",
                          "+",
                          "700000",
                          "+",
                          "7000000",
                        ]
                      }
                    }
                  }
                }
              },
              {
                777: ["7", "+", "70", "700"]
                0.777: {
                  7777: ["7", "+", "70", "+", "700", "+", "7000"]
                  0.7777: {
                    77777: ["7", "+", "70", "+", "700", "+", "7000", "+", "70000"]
                    0.77777: {
                      777777: [
                        "7",
                        "+",
                        "70",
                        "+",
                        "700",
                        "+",
                        "7000",
                        "+",
                        "70000",
                        "+",
                        "700000",
                      ]
                      0.777777: {
                        7777777: [
                          "7",
                          "+",
                          "70",
                          "+",
                          "700",
                          "+",
                          "7000",
                          "+",
                          "70000",
                          "+",
                          "700000",
                          "+",
                          "7000000",
                        ]
                      }
                    }
                  }
                }
              }
            >
          },
          "strip",
          z.ZodTypeAny,
          {
            77: ["7", "+", "70"]
            0.77: {
              777: ["7", "+", "70", "700"]
              0.777: {
                7777: ["7", "+", "70", "+", "700", "+", "7000"]
                0.7777: {
                  77777: ["7", "+", "70", "+", "700", "+", "7000", "+", "70000"]
                  0.77777: {
                    777777: [
                      "7",
                      "+",
                      "70",
                      "+",
                      "700",
                      "+",
                      "7000",
                      "+",
                      "70000",
                      "+",
                      "700000",
                    ]
                    0.777777: {
                      7777777: [
                        "7",
                        "+",
                        "70",
                        "+",
                        "700",
                        "+",
                        "7000",
                        "+",
                        "70000",
                        "+",
                        "700000",
                        "+",
                        "7000000",
                      ]
                    }
                  }
                }
              }
            }
          },
          {
            77: ["7", "+", "70"]
            0.77: {
              777: ["7", "+", "70", "700"]
              0.777: {
                7777: ["7", "+", "70", "+", "700", "+", "7000"]
                0.7777: {
                  77777: ["7", "+", "70", "+", "700", "+", "7000", "+", "70000"]
                  0.77777: {
                    777777: [
                      "7",
                      "+",
                      "70",
                      "+",
                      "700",
                      "+",
                      "7000",
                      "+",
                      "70000",
                      "+",
                      "700000",
                    ]
                    0.777777: {
                      7777777: [
                        "7",
                        "+",
                        "70",
                        "+",
                        "700",
                        "+",
                        "7000",
                        "+",
                        "70000",
                        "+",
                        "700000",
                        "+",
                        "7000000",
                      ]
                    }
                  }
                }
              }
            }
          }
        >
        8: z.ZodTuple<[z.ZodLiteral<"8">], null>
        0.8: z.ZodObject<
          {
            88: z.ZodTuple<
              [z.ZodLiteral<"8">, z.ZodLiteral<"+">, z.ZodLiteral<"80">],
              null
            >
            0.88: z.ZodObject<
              {
                888: z.ZodTuple<
                  [
                    z.ZodLiteral<"8">,
                    z.ZodLiteral<"+">,
                    z.ZodLiteral<"80">,
                    z.ZodLiteral<"800">,
                  ],
                  null
                >
                0.888: z.ZodObject<
                  {
                    8888: z.ZodTuple<
                      [
                        z.ZodLiteral<"8">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"80">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"800">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"8000">,
                      ],
                      null
                    >
                    0.8888: z.ZodObject<
                      {
                        88888: z.ZodTuple<
                          [
                            z.ZodLiteral<"8">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"80">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"800">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"8000">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"80000">,
                          ],
                          null
                        >
                        0.88888: z.ZodObject<
                          {
                            888888: z.ZodTuple<
                              [
                                z.ZodLiteral<"8">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"80">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"800">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"8000">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"80000">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"800000">,
                              ],
                              null
                            >
                            0.888888: z.ZodObject<
                              {
                                8888888: z.ZodTuple<
                                  [
                                    z.ZodLiteral<"8">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"80">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"800">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"8000">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"80000">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"800000">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"8000000">,
                                  ],
                                  null
                                >
                                0.8888888: z.ZodObject<
                                  {
                                    88888888: z.ZodTuple<
                                      [
                                        z.ZodLiteral<"8">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"80">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"800">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"8000">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"80000">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"800000">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"8000000">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"80000000">,
                                      ],
                                      null
                                    >
                                    0.88888888: z.ZodObject<
                                      {
                                        888888888: z.ZodTuple<
                                          [
                                            z.ZodLiteral<"8">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"80">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"800">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"8000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"80000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"800000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"8000000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"80000000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"800000000">,
                                          ],
                                          null
                                        >
                                      },
                                      "strip",
                                      z.ZodTypeAny,
                                      {
                                        888888888: [
                                          "8",
                                          "+",
                                          "80",
                                          "+",
                                          "800",
                                          "+",
                                          "8000",
                                          "+",
                                          "80000",
                                          "+",
                                          "800000",
                                          "+",
                                          "8000000",
                                          "+",
                                          "80000000",
                                          "+",
                                          "800000000",
                                        ]
                                      },
                                      {
                                        888888888: [
                                          "8",
                                          "+",
                                          "80",
                                          "+",
                                          "800",
                                          "+",
                                          "8000",
                                          "+",
                                          "80000",
                                          "+",
                                          "800000",
                                          "+",
                                          "8000000",
                                          "+",
                                          "80000000",
                                          "+",
                                          "800000000",
                                        ]
                                      }
                                    >
                                  },
                                  "strip",
                                  z.ZodTypeAny,
                                  {
                                    88888888: [
                                      "8",
                                      "+",
                                      "80",
                                      "+",
                                      "800",
                                      "+",
                                      "8000",
                                      "+",
                                      "80000",
                                      "+",
                                      "800000",
                                      "+",
                                      "8000000",
                                      "+",
                                      "80000000",
                                    ]
                                    0.88888888: {
                                      888888888: [
                                        "8",
                                        "+",
                                        "80",
                                        "+",
                                        "800",
                                        "+",
                                        "8000",
                                        "+",
                                        "80000",
                                        "+",
                                        "800000",
                                        "+",
                                        "8000000",
                                        "+",
                                        "80000000",
                                        "+",
                                        "800000000",
                                      ]
                                    }
                                  },
                                  {
                                    88888888: [
                                      "8",
                                      "+",
                                      "80",
                                      "+",
                                      "800",
                                      "+",
                                      "8000",
                                      "+",
                                      "80000",
                                      "+",
                                      "800000",
                                      "+",
                                      "8000000",
                                      "+",
                                      "80000000",
                                    ]
                                    0.88888888: {
                                      888888888: [
                                        "8",
                                        "+",
                                        "80",
                                        "+",
                                        "800",
                                        "+",
                                        "8000",
                                        "+",
                                        "80000",
                                        "+",
                                        "800000",
                                        "+",
                                        "8000000",
                                        "+",
                                        "80000000",
                                        "+",
                                        "800000000",
                                      ]
                                    }
                                  }
                                >
                              },
                              "strip",
                              z.ZodTypeAny,
                              {
                                8888888: [
                                  "8",
                                  "+",
                                  "80",
                                  "+",
                                  "800",
                                  "+",
                                  "8000",
                                  "+",
                                  "80000",
                                  "+",
                                  "800000",
                                  "+",
                                  "8000000",
                                ]
                                0.8888888: {
                                  88888888: [
                                    "8",
                                    "+",
                                    "80",
                                    "+",
                                    "800",
                                    "+",
                                    "8000",
                                    "+",
                                    "80000",
                                    "+",
                                    "800000",
                                    "+",
                                    "8000000",
                                    "+",
                                    "80000000",
                                  ]
                                  0.88888888: {
                                    888888888: [
                                      "8",
                                      "+",
                                      "80",
                                      "+",
                                      "800",
                                      "+",
                                      "8000",
                                      "+",
                                      "80000",
                                      "+",
                                      "800000",
                                      "+",
                                      "8000000",
                                      "+",
                                      "80000000",
                                      "+",
                                      "800000000",
                                    ]
                                  }
                                }
                              },
                              {
                                8888888: [
                                  "8",
                                  "+",
                                  "80",
                                  "+",
                                  "800",
                                  "+",
                                  "8000",
                                  "+",
                                  "80000",
                                  "+",
                                  "800000",
                                  "+",
                                  "8000000",
                                ]
                                0.8888888: {
                                  88888888: [
                                    "8",
                                    "+",
                                    "80",
                                    "+",
                                    "800",
                                    "+",
                                    "8000",
                                    "+",
                                    "80000",
                                    "+",
                                    "800000",
                                    "+",
                                    "8000000",
                                    "+",
                                    "80000000",
                                  ]
                                  0.88888888: {
                                    888888888: [
                                      "8",
                                      "+",
                                      "80",
                                      "+",
                                      "800",
                                      "+",
                                      "8000",
                                      "+",
                                      "80000",
                                      "+",
                                      "800000",
                                      "+",
                                      "8000000",
                                      "+",
                                      "80000000",
                                      "+",
                                      "800000000",
                                    ]
                                  }
                                }
                              }
                            >
                          },
                          "strip",
                          z.ZodTypeAny,
                          {
                            888888: [
                              "8",
                              "+",
                              "80",
                              "+",
                              "800",
                              "+",
                              "8000",
                              "+",
                              "80000",
                              "+",
                              "800000",
                            ]
                            0.888888: {
                              8888888: [
                                "8",
                                "+",
                                "80",
                                "+",
                                "800",
                                "+",
                                "8000",
                                "+",
                                "80000",
                                "+",
                                "800000",
                                "+",
                                "8000000",
                              ]
                              0.8888888: {
                                88888888: [
                                  "8",
                                  "+",
                                  "80",
                                  "+",
                                  "800",
                                  "+",
                                  "8000",
                                  "+",
                                  "80000",
                                  "+",
                                  "800000",
                                  "+",
                                  "8000000",
                                  "+",
                                  "80000000",
                                ]
                                0.88888888: {
                                  888888888: [
                                    "8",
                                    "+",
                                    "80",
                                    "+",
                                    "800",
                                    "+",
                                    "8000",
                                    "+",
                                    "80000",
                                    "+",
                                    "800000",
                                    "+",
                                    "8000000",
                                    "+",
                                    "80000000",
                                    "+",
                                    "800000000",
                                  ]
                                }
                              }
                            }
                          },
                          {
                            888888: [
                              "8",
                              "+",
                              "80",
                              "+",
                              "800",
                              "+",
                              "8000",
                              "+",
                              "80000",
                              "+",
                              "800000",
                            ]
                            0.888888: {
                              8888888: [
                                "8",
                                "+",
                                "80",
                                "+",
                                "800",
                                "+",
                                "8000",
                                "+",
                                "80000",
                                "+",
                                "800000",
                                "+",
                                "8000000",
                              ]
                              0.8888888: {
                                88888888: [
                                  "8",
                                  "+",
                                  "80",
                                  "+",
                                  "800",
                                  "+",
                                  "8000",
                                  "+",
                                  "80000",
                                  "+",
                                  "800000",
                                  "+",
                                  "8000000",
                                  "+",
                                  "80000000",
                                ]
                                0.88888888: {
                                  888888888: [
                                    "8",
                                    "+",
                                    "80",
                                    "+",
                                    "800",
                                    "+",
                                    "8000",
                                    "+",
                                    "80000",
                                    "+",
                                    "800000",
                                    "+",
                                    "8000000",
                                    "+",
                                    "80000000",
                                    "+",
                                    "800000000",
                                  ]
                                }
                              }
                            }
                          }
                        >
                      },
                      "strip",
                      z.ZodTypeAny,
                      {
                        88888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                        ]
                        0.88888: {
                          888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                          ]
                          0.888888: {
                            8888888: [
                              "8",
                              "+",
                              "80",
                              "+",
                              "800",
                              "+",
                              "8000",
                              "+",
                              "80000",
                              "+",
                              "800000",
                              "+",
                              "8000000",
                            ]
                            0.8888888: {
                              88888888: [
                                "8",
                                "+",
                                "80",
                                "+",
                                "800",
                                "+",
                                "8000",
                                "+",
                                "80000",
                                "+",
                                "800000",
                                "+",
                                "8000000",
                                "+",
                                "80000000",
                              ]
                              0.88888888: {
                                888888888: [
                                  "8",
                                  "+",
                                  "80",
                                  "+",
                                  "800",
                                  "+",
                                  "8000",
                                  "+",
                                  "80000",
                                  "+",
                                  "800000",
                                  "+",
                                  "8000000",
                                  "+",
                                  "80000000",
                                  "+",
                                  "800000000",
                                ]
                              }
                            }
                          }
                        }
                      },
                      {
                        88888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                        ]
                        0.88888: {
                          888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                          ]
                          0.888888: {
                            8888888: [
                              "8",
                              "+",
                              "80",
                              "+",
                              "800",
                              "+",
                              "8000",
                              "+",
                              "80000",
                              "+",
                              "800000",
                              "+",
                              "8000000",
                            ]
                            0.8888888: {
                              88888888: [
                                "8",
                                "+",
                                "80",
                                "+",
                                "800",
                                "+",
                                "8000",
                                "+",
                                "80000",
                                "+",
                                "800000",
                                "+",
                                "8000000",
                                "+",
                                "80000000",
                              ]
                              0.88888888: {
                                888888888: [
                                  "8",
                                  "+",
                                  "80",
                                  "+",
                                  "800",
                                  "+",
                                  "8000",
                                  "+",
                                  "80000",
                                  "+",
                                  "800000",
                                  "+",
                                  "8000000",
                                  "+",
                                  "80000000",
                                  "+",
                                  "800000000",
                                ]
                              }
                            }
                          }
                        }
                      }
                    >
                  },
                  "strip",
                  z.ZodTypeAny,
                  {
                    8888: ["8", "+", "80", "+", "800", "+", "8000"]
                    0.8888: {
                      88888: [
                        "8",
                        "+",
                        "80",
                        "+",
                        "800",
                        "+",
                        "8000",
                        "+",
                        "80000",
                      ]
                      0.88888: {
                        888888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                          "+",
                          "800000",
                        ]
                        0.888888: {
                          8888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                            "+",
                            "8000000",
                          ]
                          0.8888888: {
                            88888888: [
                              "8",
                              "+",
                              "80",
                              "+",
                              "800",
                              "+",
                              "8000",
                              "+",
                              "80000",
                              "+",
                              "800000",
                              "+",
                              "8000000",
                              "+",
                              "80000000",
                            ]
                            0.88888888: {
                              888888888: [
                                "8",
                                "+",
                                "80",
                                "+",
                                "800",
                                "+",
                                "8000",
                                "+",
                                "80000",
                                "+",
                                "800000",
                                "+",
                                "8000000",
                                "+",
                                "80000000",
                                "+",
                                "800000000",
                              ]
                            }
                          }
                        }
                      }
                    }
                  },
                  {
                    8888: ["8", "+", "80", "+", "800", "+", "8000"]
                    0.8888: {
                      88888: [
                        "8",
                        "+",
                        "80",
                        "+",
                        "800",
                        "+",
                        "8000",
                        "+",
                        "80000",
                      ]
                      0.88888: {
                        888888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                          "+",
                          "800000",
                        ]
                        0.888888: {
                          8888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                            "+",
                            "8000000",
                          ]
                          0.8888888: {
                            88888888: [
                              "8",
                              "+",
                              "80",
                              "+",
                              "800",
                              "+",
                              "8000",
                              "+",
                              "80000",
                              "+",
                              "800000",
                              "+",
                              "8000000",
                              "+",
                              "80000000",
                            ]
                            0.88888888: {
                              888888888: [
                                "8",
                                "+",
                                "80",
                                "+",
                                "800",
                                "+",
                                "8000",
                                "+",
                                "80000",
                                "+",
                                "800000",
                                "+",
                                "8000000",
                                "+",
                                "80000000",
                                "+",
                                "800000000",
                              ]
                            }
                          }
                        }
                      }
                    }
                  }
                >
              },
              "strip",
              z.ZodTypeAny,
              {
                888: ["8", "+", "80", "800"]
                0.888: {
                  8888: ["8", "+", "80", "+", "800", "+", "8000"]
                  0.8888: {
                    88888: ["8", "+", "80", "+", "800", "+", "8000", "+", "80000"]
                    0.88888: {
                      888888: [
                        "8",
                        "+",
                        "80",
                        "+",
                        "800",
                        "+",
                        "8000",
                        "+",
                        "80000",
                        "+",
                        "800000",
                      ]
                      0.888888: {
                        8888888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                          "+",
                          "800000",
                          "+",
                          "8000000",
                        ]
                        0.8888888: {
                          88888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                            "+",
                            "8000000",
                            "+",
                            "80000000",
                          ]
                          0.88888888: {
                            888888888: [
                              "8",
                              "+",
                              "80",
                              "+",
                              "800",
                              "+",
                              "8000",
                              "+",
                              "80000",
                              "+",
                              "800000",
                              "+",
                              "8000000",
                              "+",
                              "80000000",
                              "+",
                              "800000000",
                            ]
                          }
                        }
                      }
                    }
                  }
                }
              },
              {
                888: ["8", "+", "80", "800"]
                0.888: {
                  8888: ["8", "+", "80", "+", "800", "+", "8000"]
                  0.8888: {
                    88888: ["8", "+", "80", "+", "800", "+", "8000", "+", "80000"]
                    0.88888: {
                      888888: [
                        "8",
                        "+",
                        "80",
                        "+",
                        "800",
                        "+",
                        "8000",
                        "+",
                        "80000",
                        "+",
                        "800000",
                      ]
                      0.888888: {
                        8888888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                          "+",
                          "800000",
                          "+",
                          "8000000",
                        ]
                        0.8888888: {
                          88888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                            "+",
                            "8000000",
                            "+",
                            "80000000",
                          ]
                          0.88888888: {
                            888888888: [
                              "8",
                              "+",
                              "80",
                              "+",
                              "800",
                              "+",
                              "8000",
                              "+",
                              "80000",
                              "+",
                              "800000",
                              "+",
                              "8000000",
                              "+",
                              "80000000",
                              "+",
                              "800000000",
                            ]
                          }
                        }
                      }
                    }
                  }
                }
              }
            >
          },
          "strip",
          z.ZodTypeAny,
          {
            88: ["8", "+", "80"]
            0.88: {
              888: ["8", "+", "80", "800"]
              0.888: {
                8888: ["8", "+", "80", "+", "800", "+", "8000"]
                0.8888: {
                  88888: ["8", "+", "80", "+", "800", "+", "8000", "+", "80000"]
                  0.88888: {
                    888888: [
                      "8",
                      "+",
                      "80",
                      "+",
                      "800",
                      "+",
                      "8000",
                      "+",
                      "80000",
                      "+",
                      "800000",
                    ]
                    0.888888: {
                      8888888: [
                        "8",
                        "+",
                        "80",
                        "+",
                        "800",
                        "+",
                        "8000",
                        "+",
                        "80000",
                        "+",
                        "800000",
                        "+",
                        "8000000",
                      ]
                      0.8888888: {
                        88888888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                          "+",
                          "800000",
                          "+",
                          "8000000",
                          "+",
                          "80000000",
                        ]
                        0.88888888: {
                          888888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                            "+",
                            "8000000",
                            "+",
                            "80000000",
                            "+",
                            "800000000",
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          {
            88: ["8", "+", "80"]
            0.88: {
              888: ["8", "+", "80", "800"]
              0.888: {
                8888: ["8", "+", "80", "+", "800", "+", "8000"]
                0.8888: {
                  88888: ["8", "+", "80", "+", "800", "+", "8000", "+", "80000"]
                  0.88888: {
                    888888: [
                      "8",
                      "+",
                      "80",
                      "+",
                      "800",
                      "+",
                      "8000",
                      "+",
                      "80000",
                      "+",
                      "800000",
                    ]
                    0.888888: {
                      8888888: [
                        "8",
                        "+",
                        "80",
                        "+",
                        "800",
                        "+",
                        "8000",
                        "+",
                        "80000",
                        "+",
                        "800000",
                        "+",
                        "8000000",
                      ]
                      0.8888888: {
                        88888888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                          "+",
                          "800000",
                          "+",
                          "8000000",
                          "+",
                          "80000000",
                        ]
                        0.88888888: {
                          888888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                            "+",
                            "8000000",
                            "+",
                            "80000000",
                            "+",
                            "800000000",
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        >
        9: z.ZodTuple<[z.ZodLiteral<"9">], null>
        0.9: z.ZodObject<
          {
            99: z.ZodTuple<
              [z.ZodLiteral<"9">, z.ZodLiteral<"+">, z.ZodLiteral<"90">],
              null
            >
            0.99: z.ZodObject<
              {
                999: z.ZodTuple<
                  [
                    z.ZodLiteral<"9">,
                    z.ZodLiteral<"+">,
                    z.ZodLiteral<"90">,
                    z.ZodLiteral<"900">,
                  ],
                  null
                >
                0.999: z.ZodObject<
                  {
                    9999: z.ZodTuple<
                      [
                        z.ZodLiteral<"9">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"90">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"900">,
                        z.ZodLiteral<"+">,
                        z.ZodLiteral<"9000">,
                      ],
                      null
                    >
                    0.9999: z.ZodObject<
                      {
                        99999: z.ZodTuple<
                          [
                            z.ZodLiteral<"9">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"90">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"900">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"9000">,
                            z.ZodLiteral<"+">,
                            z.ZodLiteral<"90000">,
                          ],
                          null
                        >
                        0.99999: z.ZodObject<
                          {
                            999999: z.ZodTuple<
                              [
                                z.ZodLiteral<"9">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"90">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"900">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"9000">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"90000">,
                                z.ZodLiteral<"+">,
                                z.ZodLiteral<"900000">,
                              ],
                              null
                            >
                            0.999999: z.ZodObject<
                              {
                                9999999: z.ZodTuple<
                                  [
                                    z.ZodLiteral<"9">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"90">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"900">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"9000">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"90000">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"900000">,
                                    z.ZodLiteral<"+">,
                                    z.ZodLiteral<"9000000">,
                                  ],
                                  null
                                >
                                0.9999999: z.ZodObject<
                                  {
                                    99999999: z.ZodTuple<
                                      [
                                        z.ZodLiteral<"9">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"90">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"900">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"9000">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"90000">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"900000">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"9000000">,
                                        z.ZodLiteral<"+">,
                                        z.ZodLiteral<"90000000">,
                                      ],
                                      null
                                    >
                                    0.99999999: z.ZodObject<
                                      {
                                        999999999: z.ZodTuple<
                                          [
                                            z.ZodLiteral<"9">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"90">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"900">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"9000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"90000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"900000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"9000000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"90000000">,
                                            z.ZodLiteral<"+">,
                                            z.ZodLiteral<"900000000">,
                                          ],
                                          null
                                        >
                                        0.999999999: z.ZodObject<
                                          {
                                            9999999999: z.ZodTuple<
                                              [
                                                z.ZodLiteral<"9">,
                                                z.ZodLiteral<"+">,
                                                z.ZodLiteral<"90">,
                                                z.ZodLiteral<"+">,
                                                z.ZodLiteral<"900">,
                                                z.ZodLiteral<"+">,
                                                z.ZodLiteral<"9000">,
                                                z.ZodLiteral<"+">,
                                                z.ZodLiteral<"90000">,
                                                z.ZodLiteral<"+">,
                                                z.ZodLiteral<"900000">,
                                                z.ZodLiteral<"+">,
                                                z.ZodLiteral<"9000000">,
                                                z.ZodLiteral<"+">,
                                                z.ZodLiteral<"90000000">,
                                                z.ZodLiteral<"+">,
                                                z.ZodLiteral<"900000000">,
                                                z.ZodLiteral<"+">,
                                                z.ZodLiteral<"9000000000">,
                                              ],
                                              null
                                            >
                                          },
                                          "strip",
                                          z.ZodTypeAny,
                                          {
                                            9999999999: [
                                              "9",
                                              "+",
                                              "90",
                                              "+",
                                              "900",
                                              "+",
                                              "9000",
                                              "+",
                                              "90000",
                                              "+",
                                              "900000",
                                              "+",
                                              "9000000",
                                              "+",
                                              "90000000",
                                              "+",
                                              "900000000",
                                              "+",
                                              "9000000000",
                                            ]
                                          },
                                          {
                                            9999999999: [
                                              "9",
                                              "+",
                                              "90",
                                              "+",
                                              "900",
                                              "+",
                                              "9000",
                                              "+",
                                              "90000",
                                              "+",
                                              "900000",
                                              "+",
                                              "9000000",
                                              "+",
                                              "90000000",
                                              "+",
                                              "900000000",
                                              "+",
                                              "9000000000",
                                            ]
                                          }
                                        >
                                      },
                                      "strip",
                                      z.ZodTypeAny,
                                      {
                                        999999999: [
                                          "9",
                                          "+",
                                          "90",
                                          "+",
                                          "900",
                                          "+",
                                          "9000",
                                          "+",
                                          "90000",
                                          "+",
                                          "900000",
                                          "+",
                                          "9000000",
                                          "+",
                                          "90000000",
                                          "+",
                                          "900000000",
                                        ]
                                        0.999999999: {
                                          9999999999: [
                                            "9",
                                            "+",
                                            "90",
                                            "+",
                                            "900",
                                            "+",
                                            "9000",
                                            "+",
                                            "90000",
                                            "+",
                                            "900000",
                                            "+",
                                            "9000000",
                                            "+",
                                            "90000000",
                                            "+",
                                            "900000000",
                                            "+",
                                            "9000000000",
                                          ]
                                        }
                                      },
                                      {
                                        999999999: [
                                          "9",
                                          "+",
                                          "90",
                                          "+",
                                          "900",
                                          "+",
                                          "9000",
                                          "+",
                                          "90000",
                                          "+",
                                          "900000",
                                          "+",
                                          "9000000",
                                          "+",
                                          "90000000",
                                          "+",
                                          "900000000",
                                        ]
                                        0.999999999: {
                                          9999999999: [
                                            "9",
                                            "+",
                                            "90",
                                            "+",
                                            "900",
                                            "+",
                                            "9000",
                                            "+",
                                            "90000",
                                            "+",
                                            "900000",
                                            "+",
                                            "9000000",
                                            "+",
                                            "90000000",
                                            "+",
                                            "900000000",
                                            "+",
                                            "9000000000",
                                          ]
                                        }
                                      }
                                    >
                                  },
                                  "strip",
                                  z.ZodTypeAny,
                                  {
                                    99999999: [
                                      "9",
                                      "+",
                                      "90",
                                      "+",
                                      "900",
                                      "+",
                                      "9000",
                                      "+",
                                      "90000",
                                      "+",
                                      "900000",
                                      "+",
                                      "9000000",
                                      "+",
                                      "90000000",
                                    ]
                                    0.99999999: {
                                      999999999: [
                                        "9",
                                        "+",
                                        "90",
                                        "+",
                                        "900",
                                        "+",
                                        "9000",
                                        "+",
                                        "90000",
                                        "+",
                                        "900000",
                                        "+",
                                        "9000000",
                                        "+",
                                        "90000000",
                                        "+",
                                        "900000000",
                                      ]
                                      0.999999999: {
                                        9999999999: [
                                          "9",
                                          "+",
                                          "90",
                                          "+",
                                          "900",
                                          "+",
                                          "9000",
                                          "+",
                                          "90000",
                                          "+",
                                          "900000",
                                          "+",
                                          "9000000",
                                          "+",
                                          "90000000",
                                          "+",
                                          "900000000",
                                          "+",
                                          "9000000000",
                                        ]
                                      }
                                    }
                                  },
                                  {
                                    99999999: [
                                      "9",
                                      "+",
                                      "90",
                                      "+",
                                      "900",
                                      "+",
                                      "9000",
                                      "+",
                                      "90000",
                                      "+",
                                      "900000",
                                      "+",
                                      "9000000",
                                      "+",
                                      "90000000",
                                    ]
                                    0.99999999: {
                                      999999999: [
                                        "9",
                                        "+",
                                        "90",
                                        "+",
                                        "900",
                                        "+",
                                        "9000",
                                        "+",
                                        "90000",
                                        "+",
                                        "900000",
                                        "+",
                                        "9000000",
                                        "+",
                                        "90000000",
                                        "+",
                                        "900000000",
                                      ]
                                      0.999999999: {
                                        9999999999: [
                                          "9",
                                          "+",
                                          "90",
                                          "+",
                                          "900",
                                          "+",
                                          "9000",
                                          "+",
                                          "90000",
                                          "+",
                                          "900000",
                                          "+",
                                          "9000000",
                                          "+",
                                          "90000000",
                                          "+",
                                          "900000000",
                                          "+",
                                          "9000000000",
                                        ]
                                      }
                                    }
                                  }
                                >
                              },
                              "strip",
                              z.ZodTypeAny,
                              {
                                9999999: [
                                  "9",
                                  "+",
                                  "90",
                                  "+",
                                  "900",
                                  "+",
                                  "9000",
                                  "+",
                                  "90000",
                                  "+",
                                  "900000",
                                  "+",
                                  "9000000",
                                ]
                                0.9999999: {
                                  99999999: [
                                    "9",
                                    "+",
                                    "90",
                                    "+",
                                    "900",
                                    "+",
                                    "9000",
                                    "+",
                                    "90000",
                                    "+",
                                    "900000",
                                    "+",
                                    "9000000",
                                    "+",
                                    "90000000",
                                  ]
                                  0.99999999: {
                                    999999999: [
                                      "9",
                                      "+",
                                      "90",
                                      "+",
                                      "900",
                                      "+",
                                      "9000",
                                      "+",
                                      "90000",
                                      "+",
                                      "900000",
                                      "+",
                                      "9000000",
                                      "+",
                                      "90000000",
                                      "+",
                                      "900000000",
                                    ]
                                    0.999999999: {
                                      9999999999: [
                                        "9",
                                        "+",
                                        "90",
                                        "+",
                                        "900",
                                        "+",
                                        "9000",
                                        "+",
                                        "90000",
                                        "+",
                                        "900000",
                                        "+",
                                        "9000000",
                                        "+",
                                        "90000000",
                                        "+",
                                        "900000000",
                                        "+",
                                        "9000000000",
                                      ]
                                    }
                                  }
                                }
                              },
                              {
                                9999999: [
                                  "9",
                                  "+",
                                  "90",
                                  "+",
                                  "900",
                                  "+",
                                  "9000",
                                  "+",
                                  "90000",
                                  "+",
                                  "900000",
                                  "+",
                                  "9000000",
                                ]
                                0.9999999: {
                                  99999999: [
                                    "9",
                                    "+",
                                    "90",
                                    "+",
                                    "900",
                                    "+",
                                    "9000",
                                    "+",
                                    "90000",
                                    "+",
                                    "900000",
                                    "+",
                                    "9000000",
                                    "+",
                                    "90000000",
                                  ]
                                  0.99999999: {
                                    999999999: [
                                      "9",
                                      "+",
                                      "90",
                                      "+",
                                      "900",
                                      "+",
                                      "9000",
                                      "+",
                                      "90000",
                                      "+",
                                      "900000",
                                      "+",
                                      "9000000",
                                      "+",
                                      "90000000",
                                      "+",
                                      "900000000",
                                    ]
                                    0.999999999: {
                                      9999999999: [
                                        "9",
                                        "+",
                                        "90",
                                        "+",
                                        "900",
                                        "+",
                                        "9000",
                                        "+",
                                        "90000",
                                        "+",
                                        "900000",
                                        "+",
                                        "9000000",
                                        "+",
                                        "90000000",
                                        "+",
                                        "900000000",
                                        "+",
                                        "9000000000",
                                      ]
                                    }
                                  }
                                }
                              }
                            >
                          },
                          "strip",
                          z.ZodTypeAny,
                          {
                            999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                            ]
                            0.999999: {
                              9999999: [
                                "9",
                                "+",
                                "90",
                                "+",
                                "900",
                                "+",
                                "9000",
                                "+",
                                "90000",
                                "+",
                                "900000",
                                "+",
                                "9000000",
                              ]
                              0.9999999: {
                                99999999: [
                                  "9",
                                  "+",
                                  "90",
                                  "+",
                                  "900",
                                  "+",
                                  "9000",
                                  "+",
                                  "90000",
                                  "+",
                                  "900000",
                                  "+",
                                  "9000000",
                                  "+",
                                  "90000000",
                                ]
                                0.99999999: {
                                  999999999: [
                                    "9",
                                    "+",
                                    "90",
                                    "+",
                                    "900",
                                    "+",
                                    "9000",
                                    "+",
                                    "90000",
                                    "+",
                                    "900000",
                                    "+",
                                    "9000000",
                                    "+",
                                    "90000000",
                                    "+",
                                    "900000000",
                                  ]
                                  0.999999999: {
                                    9999999999: [
                                      "9",
                                      "+",
                                      "90",
                                      "+",
                                      "900",
                                      "+",
                                      "9000",
                                      "+",
                                      "90000",
                                      "+",
                                      "900000",
                                      "+",
                                      "9000000",
                                      "+",
                                      "90000000",
                                      "+",
                                      "900000000",
                                      "+",
                                      "9000000000",
                                    ]
                                  }
                                }
                              }
                            }
                          },
                          {
                            999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                            ]
                            0.999999: {
                              9999999: [
                                "9",
                                "+",
                                "90",
                                "+",
                                "900",
                                "+",
                                "9000",
                                "+",
                                "90000",
                                "+",
                                "900000",
                                "+",
                                "9000000",
                              ]
                              0.9999999: {
                                99999999: [
                                  "9",
                                  "+",
                                  "90",
                                  "+",
                                  "900",
                                  "+",
                                  "9000",
                                  "+",
                                  "90000",
                                  "+",
                                  "900000",
                                  "+",
                                  "9000000",
                                  "+",
                                  "90000000",
                                ]
                                0.99999999: {
                                  999999999: [
                                    "9",
                                    "+",
                                    "90",
                                    "+",
                                    "900",
                                    "+",
                                    "9000",
                                    "+",
                                    "90000",
                                    "+",
                                    "900000",
                                    "+",
                                    "9000000",
                                    "+",
                                    "90000000",
                                    "+",
                                    "900000000",
                                  ]
                                  0.999999999: {
                                    9999999999: [
                                      "9",
                                      "+",
                                      "90",
                                      "+",
                                      "900",
                                      "+",
                                      "9000",
                                      "+",
                                      "90000",
                                      "+",
                                      "900000",
                                      "+",
                                      "9000000",
                                      "+",
                                      "90000000",
                                      "+",
                                      "900000000",
                                      "+",
                                      "9000000000",
                                    ]
                                  }
                                }
                              }
                            }
                          }
                        >
                      },
                      "strip",
                      z.ZodTypeAny,
                      {
                        99999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                        ]
                        0.99999: {
                          999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                          ]
                          0.999999: {
                            9999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                            ]
                            0.9999999: {
                              99999999: [
                                "9",
                                "+",
                                "90",
                                "+",
                                "900",
                                "+",
                                "9000",
                                "+",
                                "90000",
                                "+",
                                "900000",
                                "+",
                                "9000000",
                                "+",
                                "90000000",
                              ]
                              0.99999999: {
                                999999999: [
                                  "9",
                                  "+",
                                  "90",
                                  "+",
                                  "900",
                                  "+",
                                  "9000",
                                  "+",
                                  "90000",
                                  "+",
                                  "900000",
                                  "+",
                                  "9000000",
                                  "+",
                                  "90000000",
                                  "+",
                                  "900000000",
                                ]
                                0.999999999: {
                                  9999999999: [
                                    "9",
                                    "+",
                                    "90",
                                    "+",
                                    "900",
                                    "+",
                                    "9000",
                                    "+",
                                    "90000",
                                    "+",
                                    "900000",
                                    "+",
                                    "9000000",
                                    "+",
                                    "90000000",
                                    "+",
                                    "900000000",
                                    "+",
                                    "9000000000",
                                  ]
                                }
                              }
                            }
                          }
                        }
                      },
                      {
                        99999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                        ]
                        0.99999: {
                          999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                          ]
                          0.999999: {
                            9999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                            ]
                            0.9999999: {
                              99999999: [
                                "9",
                                "+",
                                "90",
                                "+",
                                "900",
                                "+",
                                "9000",
                                "+",
                                "90000",
                                "+",
                                "900000",
                                "+",
                                "9000000",
                                "+",
                                "90000000",
                              ]
                              0.99999999: {
                                999999999: [
                                  "9",
                                  "+",
                                  "90",
                                  "+",
                                  "900",
                                  "+",
                                  "9000",
                                  "+",
                                  "90000",
                                  "+",
                                  "900000",
                                  "+",
                                  "9000000",
                                  "+",
                                  "90000000",
                                  "+",
                                  "900000000",
                                ]
                                0.999999999: {
                                  9999999999: [
                                    "9",
                                    "+",
                                    "90",
                                    "+",
                                    "900",
                                    "+",
                                    "9000",
                                    "+",
                                    "90000",
                                    "+",
                                    "900000",
                                    "+",
                                    "9000000",
                                    "+",
                                    "90000000",
                                    "+",
                                    "900000000",
                                    "+",
                                    "9000000000",
                                  ]
                                }
                              }
                            }
                          }
                        }
                      }
                    >
                  },
                  "strip",
                  z.ZodTypeAny,
                  {
                    9999: ["9", "+", "90", "+", "900", "+", "9000"]
                    0.9999: {
                      99999: [
                        "9",
                        "+",
                        "90",
                        "+",
                        "900",
                        "+",
                        "9000",
                        "+",
                        "90000",
                      ]
                      0.99999: {
                        999999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                          "+",
                          "900000",
                        ]
                        0.999999: {
                          9999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                            "+",
                            "9000000",
                          ]
                          0.9999999: {
                            99999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                              "+",
                              "90000000",
                            ]
                            0.99999999: {
                              999999999: [
                                "9",
                                "+",
                                "90",
                                "+",
                                "900",
                                "+",
                                "9000",
                                "+",
                                "90000",
                                "+",
                                "900000",
                                "+",
                                "9000000",
                                "+",
                                "90000000",
                                "+",
                                "900000000",
                              ]
                              0.999999999: {
                                9999999999: [
                                  "9",
                                  "+",
                                  "90",
                                  "+",
                                  "900",
                                  "+",
                                  "9000",
                                  "+",
                                  "90000",
                                  "+",
                                  "900000",
                                  "+",
                                  "9000000",
                                  "+",
                                  "90000000",
                                  "+",
                                  "900000000",
                                  "+",
                                  "9000000000",
                                ]
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  {
                    9999: ["9", "+", "90", "+", "900", "+", "9000"]
                    0.9999: {
                      99999: [
                        "9",
                        "+",
                        "90",
                        "+",
                        "900",
                        "+",
                        "9000",
                        "+",
                        "90000",
                      ]
                      0.99999: {
                        999999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                          "+",
                          "900000",
                        ]
                        0.999999: {
                          9999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                            "+",
                            "9000000",
                          ]
                          0.9999999: {
                            99999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                              "+",
                              "90000000",
                            ]
                            0.99999999: {
                              999999999: [
                                "9",
                                "+",
                                "90",
                                "+",
                                "900",
                                "+",
                                "9000",
                                "+",
                                "90000",
                                "+",
                                "900000",
                                "+",
                                "9000000",
                                "+",
                                "90000000",
                                "+",
                                "900000000",
                              ]
                              0.999999999: {
                                9999999999: [
                                  "9",
                                  "+",
                                  "90",
                                  "+",
                                  "900",
                                  "+",
                                  "9000",
                                  "+",
                                  "90000",
                                  "+",
                                  "900000",
                                  "+",
                                  "9000000",
                                  "+",
                                  "90000000",
                                  "+",
                                  "900000000",
                                  "+",
                                  "9000000000",
                                ]
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                >
              },
              "strip",
              z.ZodTypeAny,
              {
                999: ["9", "+", "90", "900"]
                0.999: {
                  9999: ["9", "+", "90", "+", "900", "+", "9000"]
                  0.9999: {
                    99999: ["9", "+", "90", "+", "900", "+", "9000", "+", "90000"]
                    0.99999: {
                      999999: [
                        "9",
                        "+",
                        "90",
                        "+",
                        "900",
                        "+",
                        "9000",
                        "+",
                        "90000",
                        "+",
                        "900000",
                      ]
                      0.999999: {
                        9999999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                          "+",
                          "900000",
                          "+",
                          "9000000",
                        ]
                        0.9999999: {
                          99999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                            "+",
                            "9000000",
                            "+",
                            "90000000",
                          ]
                          0.99999999: {
                            999999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                              "+",
                              "90000000",
                              "+",
                              "900000000",
                            ]
                            0.999999999: {
                              9999999999: [
                                "9",
                                "+",
                                "90",
                                "+",
                                "900",
                                "+",
                                "9000",
                                "+",
                                "90000",
                                "+",
                                "900000",
                                "+",
                                "9000000",
                                "+",
                                "90000000",
                                "+",
                                "900000000",
                                "+",
                                "9000000000",
                              ]
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              {
                999: ["9", "+", "90", "900"]
                0.999: {
                  9999: ["9", "+", "90", "+", "900", "+", "9000"]
                  0.9999: {
                    99999: ["9", "+", "90", "+", "900", "+", "9000", "+", "90000"]
                    0.99999: {
                      999999: [
                        "9",
                        "+",
                        "90",
                        "+",
                        "900",
                        "+",
                        "9000",
                        "+",
                        "90000",
                        "+",
                        "900000",
                      ]
                      0.999999: {
                        9999999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                          "+",
                          "900000",
                          "+",
                          "9000000",
                        ]
                        0.9999999: {
                          99999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                            "+",
                            "9000000",
                            "+",
                            "90000000",
                          ]
                          0.99999999: {
                            999999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                              "+",
                              "90000000",
                              "+",
                              "900000000",
                            ]
                            0.999999999: {
                              9999999999: [
                                "9",
                                "+",
                                "90",
                                "+",
                                "900",
                                "+",
                                "9000",
                                "+",
                                "90000",
                                "+",
                                "900000",
                                "+",
                                "9000000",
                                "+",
                                "90000000",
                                "+",
                                "900000000",
                                "+",
                                "9000000000",
                              ]
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            >
          },
          "strip",
          z.ZodTypeAny,
          {
            99: ["9", "+", "90"]
            0.99: {
              999: ["9", "+", "90", "900"]
              0.999: {
                9999: ["9", "+", "90", "+", "900", "+", "9000"]
                0.9999: {
                  99999: ["9", "+", "90", "+", "900", "+", "9000", "+", "90000"]
                  0.99999: {
                    999999: [
                      "9",
                      "+",
                      "90",
                      "+",
                      "900",
                      "+",
                      "9000",
                      "+",
                      "90000",
                      "+",
                      "900000",
                    ]
                    0.999999: {
                      9999999: [
                        "9",
                        "+",
                        "90",
                        "+",
                        "900",
                        "+",
                        "9000",
                        "+",
                        "90000",
                        "+",
                        "900000",
                        "+",
                        "9000000",
                      ]
                      0.9999999: {
                        99999999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                          "+",
                          "900000",
                          "+",
                          "9000000",
                          "+",
                          "90000000",
                        ]
                        0.99999999: {
                          999999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                            "+",
                            "9000000",
                            "+",
                            "90000000",
                            "+",
                            "900000000",
                          ]
                          0.999999999: {
                            9999999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                              "+",
                              "90000000",
                              "+",
                              "900000000",
                              "+",
                              "9000000000",
                            ]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          {
            99: ["9", "+", "90"]
            0.99: {
              999: ["9", "+", "90", "900"]
              0.999: {
                9999: ["9", "+", "90", "+", "900", "+", "9000"]
                0.9999: {
                  99999: ["9", "+", "90", "+", "900", "+", "9000", "+", "90000"]
                  0.99999: {
                    999999: [
                      "9",
                      "+",
                      "90",
                      "+",
                      "900",
                      "+",
                      "9000",
                      "+",
                      "90000",
                      "+",
                      "900000",
                    ]
                    0.999999: {
                      9999999: [
                        "9",
                        "+",
                        "90",
                        "+",
                        "900",
                        "+",
                        "9000",
                        "+",
                        "90000",
                        "+",
                        "900000",
                        "+",
                        "9000000",
                      ]
                      0.9999999: {
                        99999999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                          "+",
                          "900000",
                          "+",
                          "9000000",
                          "+",
                          "90000000",
                        ]
                        0.99999999: {
                          999999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                            "+",
                            "9000000",
                            "+",
                            "90000000",
                            "+",
                            "900000000",
                          ]
                          0.999999999: {
                            9999999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                              "+",
                              "90000000",
                              "+",
                              "900000000",
                              "+",
                              "9000000000",
                            ]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        >
      },
        "strip",
        z.ZodTypeAny,
        {
          1: ["3"]
          2: ["3"]
          0.2: { 22: ["3", "+", "30"] }
          3: ["3"]
          0.3: { 33: ["3", "+", "30"]; 0.33: { 333: ["3", "+", "30", "300"] } }
          4: ["4"]
          0.4: {
            44: ["4", "+", "40"]
            0.44: {
              444: ["4", "+", "40", "400"]
              0.444: { 4444: ["4", "+", "40", "+", "400", "+", "4000"] }
            }
          }
          5: ["5"]
          0.5: {
            55: ["5", "+", "50"]
            0.55: {
              555: ["5", "+", "50", "500"]
              0.555: {
                5555: ["5", "+", "50", "+", "500", "+", "5000"]
                0.5555: {
                  55555: ["5", "+", "50", "+", "500", "+", "5000", "+", "50000"]
                }
              }
            }
          }
          6: ["6"]
          0.6: {
            66: ["6", "+", "60"]
            0.66: {
              666: ["6", "+", "60", "600"]
              0.666: {
                6666: ["6", "+", "60", "+", "600", "+", "6000"]
                0.6666: {
                  66666: ["6", "+", "60", "+", "600", "+", "6000", "+", "60000"]
                  0.66666: {
                    666666: [
                      "6",
                      "+",
                      "60",
                      "+",
                      "600",
                      "+",
                      "6000",
                      "+",
                      "60000",
                      "+",
                      "600000",
                    ]
                  }
                }
              }
            }
          }
          7: ["7"]
          0.7: {
            77: ["7", "+", "70"]
            0.77: {
              777: ["7", "+", "70", "700"]
              0.777: {
                7777: ["7", "+", "70", "+", "700", "+", "7000"]
                0.7777: {
                  77777: ["7", "+", "70", "+", "700", "+", "7000", "+", "70000"]
                  0.77777: {
                    777777: [
                      "7",
                      "+",
                      "70",
                      "+",
                      "700",
                      "+",
                      "7000",
                      "+",
                      "70000",
                      "+",
                      "700000",
                    ]
                    0.777777: {
                      7777777: [
                        "7",
                        "+",
                        "70",
                        "+",
                        "700",
                        "+",
                        "7000",
                        "+",
                        "70000",
                        "+",
                        "700000",
                        "+",
                        "7000000",
                      ]
                    }
                  }
                }
              }
            }
          }
          8: ["8"]
          0.8: {
            88: ["8", "+", "80"]
            0.88: {
              888: ["8", "+", "80", "800"]
              0.888: {
                8888: ["8", "+", "80", "+", "800", "+", "8000"]
                0.8888: {
                  88888: ["8", "+", "80", "+", "800", "+", "8000", "+", "80000"]
                  0.88888: {
                    888888: [
                      "8",
                      "+",
                      "80",
                      "+",
                      "800",
                      "+",
                      "8000",
                      "+",
                      "80000",
                      "+",
                      "800000",
                    ]
                    0.888888: {
                      8888888: [
                        "8",
                        "+",
                        "80",
                        "+",
                        "800",
                        "+",
                        "8000",
                        "+",
                        "80000",
                        "+",
                        "800000",
                        "+",
                        "8000000",
                      ]
                      0.8888888: {
                        88888888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                          "+",
                          "800000",
                          "+",
                          "8000000",
                          "+",
                          "80000000",
                        ]
                        0.88888888: {
                          888888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                            "+",
                            "8000000",
                            "+",
                            "80000000",
                            "+",
                            "800000000",
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          9: ["9"]
          0.9: {
            99: ["9", "+", "90"]
            0.99: {
              999: ["9", "+", "90", "900"]
              0.999: {
                9999: ["9", "+", "90", "+", "900", "+", "9000"]
                0.9999: {
                  99999: ["9", "+", "90", "+", "900", "+", "9000", "+", "90000"]
                  0.99999: {
                    999999: [
                      "9",
                      "+",
                      "90",
                      "+",
                      "900",
                      "+",
                      "9000",
                      "+",
                      "90000",
                      "+",
                      "900000",
                    ]
                    0.999999: {
                      9999999: [
                        "9",
                        "+",
                        "90",
                        "+",
                        "900",
                        "+",
                        "9000",
                        "+",
                        "90000",
                        "+",
                        "900000",
                        "+",
                        "9000000",
                      ]
                      0.9999999: {
                        99999999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                          "+",
                          "900000",
                          "+",
                          "9000000",
                          "+",
                          "90000000",
                        ]
                        0.99999999: {
                          999999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                            "+",
                            "9000000",
                            "+",
                            "90000000",
                            "+",
                            "900000000",
                          ]
                          0.999999999: {
                            9999999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                              "+",
                              "90000000",
                              "+",
                              "900000000",
                              "+",
                              "9000000000",
                            ]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          1: ["3"]
          2: ["3"]
          0.2: { 22: ["3", "+", "30"] }
          3: ["3"]
          0.3: { 33: ["3", "+", "30"]; 0.33: { 333: ["3", "+", "30", "300"] } }
          4: ["4"]
          0.4: {
            44: ["4", "+", "40"]
            0.44: {
              444: ["4", "+", "40", "400"]
              0.444: { 4444: ["4", "+", "40", "+", "400", "+", "4000"] }
            }
          }
          5: ["5"]
          0.5: {
            55: ["5", "+", "50"]
            0.55: {
              555: ["5", "+", "50", "500"]
              0.555: {
                5555: ["5", "+", "50", "+", "500", "+", "5000"]
                0.5555: {
                  55555: ["5", "+", "50", "+", "500", "+", "5000", "+", "50000"]
                }
              }
            }
          }
          6: ["6"]
          0.6: {
            66: ["6", "+", "60"]
            0.66: {
              666: ["6", "+", "60", "600"]
              0.666: {
                6666: ["6", "+", "60", "+", "600", "+", "6000"]
                0.6666: {
                  66666: ["6", "+", "60", "+", "600", "+", "6000", "+", "60000"]
                  0.66666: {
                    666666: [
                      "6",
                      "+",
                      "60",
                      "+",
                      "600",
                      "+",
                      "6000",
                      "+",
                      "60000",
                      "+",
                      "600000",
                    ]
                  }
                }
              }
            }
          }
          7: ["7"]
          0.7: {
            77: ["7", "+", "70"]
            0.77: {
              777: ["7", "+", "70", "700"]
              0.777: {
                7777: ["7", "+", "70", "+", "700", "+", "7000"]
                0.7777: {
                  77777: ["7", "+", "70", "+", "700", "+", "7000", "+", "70000"]
                  0.77777: {
                    777777: [
                      "7",
                      "+",
                      "70",
                      "+",
                      "700",
                      "+",
                      "7000",
                      "+",
                      "70000",
                      "+",
                      "700000",
                    ]
                    0.777777: {
                      7777777: [
                        "7",
                        "+",
                        "70",
                        "+",
                        "700",
                        "+",
                        "7000",
                        "+",
                        "70000",
                        "+",
                        "700000",
                        "+",
                        "7000000",
                      ]
                    }
                  }
                }
              }
            }
          }
          8: ["8"]
          0.8: {
            88: ["8", "+", "80"]
            0.88: {
              888: ["8", "+", "80", "800"]
              0.888: {
                8888: ["8", "+", "80", "+", "800", "+", "8000"]
                0.8888: {
                  88888: ["8", "+", "80", "+", "800", "+", "8000", "+", "80000"]
                  0.88888: {
                    888888: [
                      "8",
                      "+",
                      "80",
                      "+",
                      "800",
                      "+",
                      "8000",
                      "+",
                      "80000",
                      "+",
                      "800000",
                    ]
                    0.888888: {
                      8888888: [
                        "8",
                        "+",
                        "80",
                        "+",
                        "800",
                        "+",
                        "8000",
                        "+",
                        "80000",
                        "+",
                        "800000",
                        "+",
                        "8000000",
                      ]
                      0.8888888: {
                        88888888: [
                          "8",
                          "+",
                          "80",
                          "+",
                          "800",
                          "+",
                          "8000",
                          "+",
                          "80000",
                          "+",
                          "800000",
                          "+",
                          "8000000",
                          "+",
                          "80000000",
                        ]
                        0.88888888: {
                          888888888: [
                            "8",
                            "+",
                            "80",
                            "+",
                            "800",
                            "+",
                            "8000",
                            "+",
                            "80000",
                            "+",
                            "800000",
                            "+",
                            "8000000",
                            "+",
                            "80000000",
                            "+",
                            "800000000",
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          9: ["9"]
          0.9: {
            99: ["9", "+", "90"]
            0.99: {
              999: ["9", "+", "90", "900"]
              0.999: {
                9999: ["9", "+", "90", "+", "900", "+", "9000"]
                0.9999: {
                  99999: ["9", "+", "90", "+", "900", "+", "9000", "+", "90000"]
                  0.99999: {
                    999999: [
                      "9",
                      "+",
                      "90",
                      "+",
                      "900",
                      "+",
                      "9000",
                      "+",
                      "90000",
                      "+",
                      "900000",
                    ]
                    0.999999: {
                      9999999: [
                        "9",
                        "+",
                        "90",
                        "+",
                        "900",
                        "+",
                        "9000",
                        "+",
                        "90000",
                        "+",
                        "900000",
                        "+",
                        "9000000",
                      ]
                      0.9999999: {
                        99999999: [
                          "9",
                          "+",
                          "90",
                          "+",
                          "900",
                          "+",
                          "9000",
                          "+",
                          "90000",
                          "+",
                          "900000",
                          "+",
                          "9000000",
                          "+",
                          "90000000",
                        ]
                        0.99999999: {
                          999999999: [
                            "9",
                            "+",
                            "90",
                            "+",
                            "900",
                            "+",
                            "9000",
                            "+",
                            "90000",
                            "+",
                            "900000",
                            "+",
                            "9000000",
                            "+",
                            "90000000",
                            "+",
                            "900000000",
                          ]
                          0.999999999: {
                            9999999999: [
                              "9",
                              "+",
                              "90",
                              "+",
                              "900",
                              "+",
                              "9000",
                              "+",
                              "90000",
                              "+",
                              "900000",
                              "+",
                              "9000000",
                              "+",
                              "90000000",
                              "+",
                              "900000000",
                              "+",
                              "9000000000",
                            ]
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      >
    >(ZodSchema)

  })
})
