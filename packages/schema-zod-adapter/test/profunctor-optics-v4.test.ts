import * as vi from 'vitest'
import { v4 } from '@traversable/schema-zod-adapter'
import { fn } from '@traversable/registry'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it('〖⛳️〗› ❲v4.❳', () => {
    vi.expect(v4.Pro.set(v4.Pro.prop('foo'), 42, { foo: null })).toMatchInlineSnapshot
      (`
      {
        "foo": 42,
      }
    `)

    vi.expect(v4.Pro.get(v4.Pro.pick(['foo', 'bar']), { foo: 'something', bar: 42, baz: true })).toMatchInlineSnapshot
      (`
      {
        "bar": 42,
        "foo": "something",
      }
    `)


    vi.expect(v4.Pro.get(v4.Pro.pick([]), { foo: 'something', bar: 42, baz: true })).toMatchInlineSnapshot
      (`{}`)

    vi.expect(v4.Pro.get(v4.Pro.propOr(0, 'abc'), { abc: undefined })).toMatchInlineSnapshot
      (`0`)

    vi.expect(v4.Pro.get(v4.Pro.pipe(v4.Pro.prop('abc'), v4.Pro.propOr({ def: { ghi: 100 } }, 'def')), { abc: undefined })).toMatchInlineSnapshot
      (`
      {
        "def": {
          "ghi": 100,
        },
      }
    `)


    vi.expect(v4.Pro.collect(v4.Pro.pipe(v4.Pro.traverse, v4.Pro.prop('foo'), v4.Pro.prop('bar')))([
      { foo: { bar: 1 } },
      { foo: { bar: 2 } },
    ])).toMatchInlineSnapshot
      (`
      [
        1,
        2,
      ]
    `)


    vi.expect(v4.Pro.scavenge({ foo: { bar: undefined } }, v4.Pro.pipe(v4.Pro.traverse, v4.Pro.prop('foo'), v4.Pro.prop('bar')), [
      { foo: { bar: 1 } },
      undefined,
    ])).toMatchInlineSnapshot
      (`
      [
        1,
        Symbol(@traversable/schema/URI::notfound),
      ]
    `)


    vi.expect(v4.Pro.scavenge({ foo: { bar: 2 } }, v4.Pro.pipe(v4.Pro.traverse, v4.Pro.prop('foo'), v4.Pro.prop('bar')), [
      { foo: { bar: 1 } },
      undefined,
    ])).toMatchInlineSnapshot
      (`
      [
        1,
        2,
      ]
    `)

    vi.expect(v4.Pro.scavenge({ foo: { bar: 2 } }, v4.Pro.pipe(v4.Pro.traverse, v4.Pro.prop('foo'), v4.Pro.prop('bar')), [
      { foo: { bar: 1 } },
      {},
    ])).toMatchInlineSnapshot
      (`
      [
        1,
        Symbol(@traversable/schema/URI::notfound),
      ]
    `)

    vi.expect(
      v4.Pro.scavenge(
        { d: -1 },
        v4.Pro.pipe(v4.Pro.prop('foo'), v4.Pro.traverse, v4.Pro.traverse, v4.Pro.prop('c')),
        { foo: { a: [{ c: undefined }, { c: { d: 2 } }, {}], b: [{ c: { d: 4 } }, { c: { d: 5 } }, { c: { d: 6 } }] } },
      )
    ).toMatchInlineSnapshot
      (`undefined`)


    vi.expect(
      v4.Pro.collect(v4.Pro.pipe(v4.Pro.prop('foo'), v4.Pro.traverse, v4.Pro.traverse, v4.Pro.prop('c')))(
        { foo: { a: [{ c: 1 }, { c: 2 }, { c: 3 }], b: [{ c: 4 }, { c: 5 }, { c: 6 }] } },
      )
    ).toMatchInlineSnapshot
      (`
      {
        "a": [
          1,
          2,
          3,
        ],
        "b": [
          4,
          5,
          6,
        ],
      }
    `)

    vi.expect(
      v4.Pro.collectObject(
        v4.Pro.pipe(
          v4.Pro.prop('F'),
          v4.Pro.traverse,
          v4.Pro.prop('G'),
        )
      )({
        F: {
          X: {
            G: []
          }
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "X": [],
      }
    `)

    vi.expect(
      v4.Pro.collectObject(
        v4.Pro.pipe(
          v4.Pro.prop('F'),
          v4.Pro.traverse,
          v4.Pro.prop('G'),
        )
      )({
        F: {
          ABC: {
            G: [
              { one: 1 },
              { two: 2 },
              { three: 3 },
            ],
          },
          DEF: {
            G: [
              { four: 4 },
              { five: 5 },
            ]
          },
          GHI: {
            G: [],
          },
          JKL: {
            G: undefined
          }
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "ABC": [
          {
            "one": 1,
          },
          {
            "two": 2,
          },
          {
            "three": 3,
          },
        ],
        "DEF": [
          {
            "four": 4,
          },
          {
            "five": 5,
          },
        ],
        "GHI": [],
        "JKL": Symbol(@traversable/schema/URI::notfound),
      }
    `)


    vi.expect(
      v4.Pro.collectObject(
        v4.Pro.pipe(
          v4.Pro.prop('F'),
          v4.Pro.traverse,
          v4.Pro.prop('G'),
        )
      )({
        F: {
          X: {
            G: []
          }
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "X": [],
      }
    `)

    vi.expect(
      v4.Pro.collectObject(
        v4.Pro.pipe(
          v4.Pro.prop('F'),
          v4.Pro.traverse,
          v4.Pro.prop('G'),
        )
      )({
        F: {
          X: {
            G: []
          }
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "X": [],
      }
    `)



    vi.expect(
      v4.Pro.collectObject(
        v4.Pro.pipe(
          v4.Pro.prop('foo'),
          v4.Pro.traverse,
          v4.Pro.traverse,
          v4.Pro.prop('c'),
        )
      )({
        foo: {
          a: [
            { c: 1 },
            { c: 2 },
            { c: 3 },
          ],
          b: [
            { c: 4 },
            { c: 5 },
            { c: 6 },
          ]
        }
      })
    ).toMatchInlineSnapshot
      (`
      {
        "a": [
          1,
          2,
          3,
        ],
        "b": [
          4,
          5,
          6,
        ],
      }
    `)

    vi.expect(
      v4.Pro.set(
        v4.Pro.pipe(
          v4.Pro.prop('foo'),
          v4.Pro.traverse,
          v4.Pro.traverse,
          v4.Pro.prop('c'),
        ),
        9000,
        {
          foo: {
            a: [
              { c: 1 },
              { c: 2 },
              { c: 3 },
            ],
            b: [
              { c: 4 },
              { c: 5 },
              { c: 6 }
            ]
          }
        }
      )
    ).toMatchInlineSnapshot
      (`
      {
        "foo": {
          "a": [
            {
              "c": 9000,
            },
            {
              "c": 9000,
            },
            {
              "c": 9000,
            },
          ],
          "b": [
            {
              "c": 9000,
            },
            {
              "c": 9000,
            },
            {
              "c": 9000,
            },
          ],
        },
      }
    `)

    vi.expect(
      v4.Pro.modify(
        v4.Pro.pipe(
          v4.Pro.prop('foo'),
          v4.Pro.traverse,
          v4.Pro.traverse,
          v4.Pro.prop('c'),
        ),
        (x) => x + 1,
        {
          foo: {
            a: [
              { c: 1 },
              { c: 2 },
              { c: 3 },
            ],
            b: [
              { c: 4 },
              { c: 5 },
              { c: 6 },
            ]
          }
        }
      )
    ).toMatchInlineSnapshot
      (`
      {
        "foo": {
          "a": [
            {
              "c": 2,
            },
            {
              "c": 3,
            },
            {
              "c": 4,
            },
          ],
          "b": [
            {
              "c": 5,
            },
            {
              "c": 6,
            },
            {
              "c": 7,
            },
          ],
        },
      }
    `)

    vi.expect(
      v4.Pro.collect(
        v4.Pro.pipe(
          v4.Pro.prop('foo'),
          v4.Pro.traverse
        )
      )({
        foo: [
          {
            bar: [
              { baz: 1 },
              { baz: 2 },
            ]
          },
          {
            bar: [
              { baz: 3 },
              { baz: 4 },
            ]
          }
        ]
      })
    ).toMatchInlineSnapshot
      (`
      [
        {
          "bar": [
            {
              "baz": 1,
            },
            {
              "baz": 2,
            },
          ],
        },
        {
          "bar": [
            {
              "baz": 3,
            },
            {
              "baz": 4,
            },
          ],
        },
      ]
    `)

    vi.expect(
      v4.Pro.collect(
        v4.Pro.pipe(
          v4.Pro.prop('foo'),
          v4.Pro.traverse,
          v4.Pro.prop('bar'),
        )
      )({
        foo: [
          {
            bar: [
              { baz: 1 },
              { baz: 2 }
            ]
          },
          {
            bar: [
              { baz: 3 },
              { baz: 4 }
            ]
          }
        ]
      })
    ).toMatchInlineSnapshot
      (`
      [
        [
          {
            "baz": 1,
          },
          {
            "baz": 2,
          },
        ],
        [
          {
            "baz": 3,
          },
          {
            "baz": 4,
          },
        ],
      ]
    `)

    vi.expect(
      v4.Pro.collect(
        v4.Pro.pipe(
          v4.Pro.prop('foo'),
          v4.Pro.traverse,
          v4.Pro.prop('bar'),
          v4.Pro.traverse,
        )
      )({
        foo: [
          {
            bar: [
              { baz: 1 },
              { baz: 2 },
            ]
          },
          {
            bar: [
              { baz: 3 },
              { baz: 4 },
            ]
          }
        ]
      })
    ).toMatchInlineSnapshot
      (`
      [
        {
          "baz": 1,
        },
        {
          "baz": 2,
        },
        {
          "baz": 3,
        },
        {
          "baz": 4,
        },
      ]
    `)

    vi.expect(
      v4.Pro.collect(
        v4.Pro.pipe(
          v4.Pro.prop('foo'),
          v4.Pro.traverse,
          v4.Pro.prop('bar'),
          v4.Pro.traverse,
          v4.Pro.prop('baz'),
        )
      )({
        foo: [
          {
            bar: [
              { baz: 1 },
              { baz: 2 },
            ]
          },
          {
            bar: [
              { baz: 3 },
              { baz: 4 },
            ]
          }
        ]
      })
    ).toMatchInlineSnapshot
      (`
      [
        1,
        2,
        3,
        4,
      ]
    `)

  })
})
