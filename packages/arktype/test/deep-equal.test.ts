import * as vi from 'vitest'
import prettier from '@prettier/sync'
import { type } from 'arktype'
import { ark } from '@traversable/arktype'

const format = (src: string) => prettier.format(src, { parser: 'typescript', semi: false })

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: ark.deepEqual.writeable', () => {
  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.never', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.never
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.unknown', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.unknown
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: unknown, r: unknown) {
        if (Object.is(l, r)) return true
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.null', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.null
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: null, r: null) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.boolean', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.boolean
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: boolean, r: boolean) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.keywords.number.integer', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.keywords.number.integer
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.number', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.number
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: number, r: number) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.string', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.string
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: string, r: string) {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.enumerated', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.enumerated()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: never, r: never) {
        if (!Object.is(l, r)) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.enumerated('a')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: "a", r: "a") {
        if (l !== r) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.enumerated('a', 'b')
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: "a" | "b", r: "a" | "b") {
        if (l !== r) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.array', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.number.array()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Array<number>, r: Array<number>) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (l_item !== r_item && (l_item === l_item || r_item === r_item))
            return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.number.array().array()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: Array<Array<number>>, r: Array<Array<number>>) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          const length1 = l_item.length
          if (length1 !== r_item.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l_item_item = l_item[ix]
            const r_item_item = r_item[ix]
            if (
              l_item_item !== r_item_item &&
              (l_item_item === l_item_item || r_item_item === r_item_item)
            )
              return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.number.array().array().array()
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(
        l: Array<Array<Array<number>>>,
        r: Array<Array<Array<number>>>,
      ) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          const length1 = l_item.length
          if (length1 !== r_item.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l_item_item = l_item[ix]
            const r_item_item = r_item[ix]
            const length2 = l_item_item.length
            if (length2 !== r_item_item.length) return false
            for (let ix = length2; ix-- !== 0; ) {
              const l_item_item_item = l_item_item[ix]
              const r_item_item_item = r_item_item[ix]
              if (
                l_item_item_item !== r_item_item_item &&
                (l_item_item_item === l_item_item_item ||
                  r_item_item_item === r_item_item_item)
              )
                return false
            }
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          "a?": type.number.array(),
          "b?": type.string,
        }),
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(
        l: { a?: Array<number>; b?: string },
        r: { a?: Array<number>; b?: string },
      ) {
        if (l === r) return true
        if (l?.a !== r?.a) {
          if ((l?.a === undefined || r?.a === undefined) && l?.a !== r?.a)
            return false
          if (l?.a !== r?.a) {
            const length = l?.a?.length
            if (length !== r?.a?.length) return false
            for (let ix = length; ix-- !== 0; ) {
              const l__a_item = l?.a[ix]
              const r__a_item = r?.a[ix]
              if (
                l__a_item !== r__a_item &&
                (l__a_item === l__a_item || r__a_item === r__a_item)
              )
                return false
            }
          }
        }
        if ((l?.b === undefined || r?.b === undefined) && l?.b !== r?.b) return false
        if (l?.b !== r?.b) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.Record', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type('Record<string, Record<string, string>>'),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, string>>
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const l_keys = Object.keys(l)
        const r_keys = Object.keys(r)
        const length = l_keys.length
        if (length !== r_keys.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const key = l_keys[ix]
          const l_k_ = l[key]
          const r_k_ = r[key]
          const l_k_1_keys = Object.keys(l_k_)
          const r_k_1_keys = Object.keys(r_k_)
          const length1 = l_k_1_keys.length
          if (length1 !== r_k_1_keys.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const key1 = l_k_1_keys[ix]
            const l_k___k_ = l_k_[key1]
            const r_k___k_ = r_k_[key1]
            if (l_k___k_ !== r_k___k_) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type('Record<string, Record<string, string[]>>'),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Record<string, Record<string, Array<string>>>
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const l_keys = Object.keys(l)
        const r_keys = Object.keys(r)
        const length = l_keys.length
        if (length !== r_keys.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const key = l_keys[ix]
          const l_k_ = l[key]
          const r_k_ = r[key]
          const l_k_1_keys = Object.keys(l_k_)
          const r_k_1_keys = Object.keys(r_k_)
          const length1 = l_k_1_keys.length
          if (length1 !== r_k_1_keys.length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const key1 = l_k_1_keys[ix]
            const l_k___k_ = l_k_[key1]
            const r_k___k_ = r_k_[key1]
            const length2 = l_k___k_.length
            if (length2 !== r_k___k_.length) return false
            for (let ix = length2; ix-- !== 0; ) {
              const l_k___k_1_item = l_k___k_[ix]
              const r_k___k_1_item = r_k___k_[ix]
              if (l_k___k_1_item !== r_k___k_1_item) return false
            }
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.tuple', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type([]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = Array<undefined>
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        for (let ix = length; ix-- !== 0; ) {
          const l_item = l[ix]
          const r_item = r[ix]
          if (!Object.is(l_item, r_item)) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type([
          'string',
          'string',
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l[0] !== r[0]) return false
        if (l[1] !== r[1]) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type([
          {
            street1: 'string',
            "street2?": 'string',
            city: 'string'
          },
          {
            street1: 'string',
            "street2?": 'string',
            city: 'string'
          },
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [
        { city: string; street1: string; street2?: string },
        { city: string; street1: string; street2?: string },
      ]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l[0] !== r[0]) {
          if (l[0].city !== r[0].city) return false
          if (l[0].street1 !== r[0].street1) return false
          if (
            (l[0]?.street2 === undefined || r[0]?.street2 === undefined) &&
            l[0]?.street2 !== r[0]?.street2
          )
            return false
          if (l[0]?.street2 !== r[0]?.street2) return false
        }
        if (l[1] !== r[1]) {
          if (l[1].city !== r[1].city) return false
          if (l[1].street1 !== r[1].street1) return false
          if (
            (l[1]?.street2 === undefined || r[1]?.street2 === undefined) &&
            l[1]?.street2 !== r[1]?.street2
          )
            return false
          if (l[1]?.street2 !== r[1]?.street2) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type([
          'number',
          [
            { a: 'boolean' }
          ]
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [number, [{ a: boolean }]]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l[0] !== r[0] && (l[0] === l[0] || r[0] === r[0])) return false
        if (l[1] !== r[1]) {
          if (l[1][0] !== r[1][0]) {
            if (l[1][0].a !== r[1][0].a) return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          a: ['string', 'string'],
          "b?": ['string', ['string']],
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: [string, string]; b?: [string, [string]] }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
          if (l.a[0] !== r.a[0]) return false
          if (l.a[1] !== r.a[1]) return false
        }
        if (l?.b !== r?.b) {
          if ((l?.b === undefined || r?.b === undefined) && l?.b !== r?.b)
            return false
          if (l?.b !== r?.b) {
            if (l.b?.[0] !== r.b?.[0]) return false
            if (l.b?.[1] !== r.b?.[1]) {
              if (l.b[1]?.[0] !== r.b[1]?.[0]) return false
            }
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type([
          {
            "A?": 'boolean'
          },
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: boolean }]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l[0] !== r[0]) {
          if ((l[0]?.A === undefined || r[0]?.A === undefined) && l[0]?.A !== r[0]?.A)
            return false
          if (l[0]?.A !== r[0]?.A) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type([
          {
            "A?": [
              {
                "B?": 'boolean'
              }
            ]
          }
        ]),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [{ A?: [{ B?: boolean }] }]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l[0] !== r[0]) {
          if (l[0]?.A !== r[0]?.A) {
            if (
              (l[0]?.A === undefined || r[0]?.A === undefined) &&
              l[0]?.A !== r[0]?.A
            )
              return false
            if (l[0]?.A !== r[0]?.A) {
              if (l[0].A?.[0] !== r[0].A?.[0]) {
                if (
                  (l[0].A[0]?.B === undefined || r[0].A[0]?.B === undefined) &&
                  l[0].A[0]?.B !== r[0].A[0]?.B
                )
                  return false
                if (l[0].A[0]?.B !== r[0].A[0]?.B) return false
              }
            }
          }
        }
        return true
      }
      "
    `)

  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.tuple w/ rest', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type(
          [
            'string',
            'string',
            '...',
            'number[]'
          ],
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = [string, string, ...number[]]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        if (l[0] !== r[0]) return false
        if (l[1] !== r[1]) return false
        if (length > 2) {
          for (let ix = length; ix-- !== 2; ) {
            const l_item = l[ix]
            const r_item = r[ix]
            if (l_item !== r_item && (l_item === l_item || r_item === r_item))
              return false
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type([
          'boolean',
          'string',
          type.keywords.number.integer,
          '...',
          'number[][]'
        ])
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(
        l: [boolean, string, number, ...Array<number>[]],
        r: [boolean, string, number, ...Array<number>[]],
      ) {
        if (l === r) return true
        const length = l.length
        if (length !== r.length) return false
        if (l[0] !== r[0]) return false
        if (l[1] !== r[1]) return false
        if (l[2] !== r[2] && (l[2] === l[2] || r[2] === r[2])) return false
        if (length > 3) {
          for (let ix = length; ix-- !== 3; ) {
            const l_item = l[ix]
            const r_item = r[ix]
            const length1 = l_item.length
            if (length1 !== r_item.length) return false
            for (let ix = length1; ix-- !== 0; ) {
              const l_item1_item = l_item[ix]
              const r_item1_item = r_item[ix]
              if (
                l_item1_item !== r_item1_item &&
                (l_item1_item === l_item1_item || r_item1_item === r_item1_item)
              )
                return false
            }
          }
        }
        return true
      }
      "
    `)


    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type(
          {
            "a?": [
              {
                "b?": [
                  {
                    "c?": [
                      { "d?": 'string' },
                      '...',
                      [{ "E?": ['string', '...', [{ "F?": 'string' }, '[]']] }],
                    ]
                  },
                  '...',
                  [{ "G?": 'string' }, '[]'],
                ]
              },
              '...',
              [{ "H?": 'string' }, '[]'],
            ]
          }
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a?: [
          {
            b?: [
              { c?: [{ d?: string }, { E?: [string, ...{ F?: string }[]] }] },
              ...{ G?: string }[],
            ]
          },
          ...{ H?: string }[],
        ]
      }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l?.a !== r?.a) {
          if ((l?.a === undefined || r?.a === undefined) && l?.a !== r?.a)
            return false
          if (l?.a !== r?.a) {
            const length = l.a.length
            if (length !== r.a.length) return false
            if (l.a?.[0] !== r.a?.[0]) {
              if (l.a[0]?.b !== r.a[0]?.b) {
                if (
                  (l.a[0]?.b === undefined || r.a[0]?.b === undefined) &&
                  l.a[0]?.b !== r.a[0]?.b
                )
                  return false
                if (l.a[0]?.b !== r.a[0]?.b) {
                  const length1 = l.a[0].b.length
                  if (length1 !== r.a[0].b.length) return false
                  if (l.a[0].b?.[0] !== r.a[0].b?.[0]) {
                    if (l.a[0].b[0]?.c !== r.a[0].b[0]?.c) {
                      if (
                        (l.a[0].b[0]?.c === undefined ||
                          r.a[0].b[0]?.c === undefined) &&
                        l.a[0].b[0]?.c !== r.a[0].b[0]?.c
                      )
                        return false
                      if (l.a[0].b[0]?.c !== r.a[0].b[0]?.c) {
                        if (l.a[0].b[0].c?.[0] !== r.a[0].b[0].c?.[0]) {
                          if (
                            (l.a[0].b[0].c[0]?.d === undefined ||
                              r.a[0].b[0].c[0]?.d === undefined) &&
                            l.a[0].b[0].c[0]?.d !== r.a[0].b[0].c[0]?.d
                          )
                            return false
                          if (l.a[0].b[0].c[0]?.d !== r.a[0].b[0].c[0]?.d)
                            return false
                        }
                        if (l.a[0].b[0].c?.[1] !== r.a[0].b[0].c?.[1]) {
                          if (l.a[0].b[0].c[1]?.E !== r.a[0].b[0].c[1]?.E) {
                            if (
                              (l.a[0].b[0].c[1]?.E === undefined ||
                                r.a[0].b[0].c[1]?.E === undefined) &&
                              l.a[0].b[0].c[1]?.E !== r.a[0].b[0].c[1]?.E
                            )
                              return false
                            if (l.a[0].b[0].c[1]?.E !== r.a[0].b[0].c[1]?.E) {
                              const length3 = l.a[0].b[0].c[1].E.length
                              if (length3 !== r.a[0].b[0].c[1].E.length) return false
                              if (l.a[0].b[0].c[1].E?.[0] !== r.a[0].b[0].c[1].E?.[0])
                                return false
                              if (length3 > 1) {
                                for (let ix = length3; ix-- !== 1; ) {
                                  const l_a_0__b_0__c_1__E_item =
                                    l.a[0].b[0].c[1].E[ix]
                                  const r_a_0__b_0__c_1__E_item =
                                    r.a[0].b[0].c[1].E[ix]
                                  if (
                                    (l_a_0__b_0__c_1__E_item?.F === undefined ||
                                      r_a_0__b_0__c_1__E_item?.F === undefined) &&
                                    l_a_0__b_0__c_1__E_item?.F !==
                                      r_a_0__b_0__c_1__E_item?.F
                                  )
                                    return false
                                  if (
                                    l_a_0__b_0__c_1__E_item?.F !==
                                    r_a_0__b_0__c_1__E_item?.F
                                  )
                                    return false
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  if (length1 > 1) {
                    for (let ix = length1; ix-- !== 1; ) {
                      const l_a_0__b_item = l.a[0].b[ix]
                      const r_a_0__b_item = r.a[0].b[ix]
                      if (
                        (l_a_0__b_item?.G === undefined ||
                          r_a_0__b_item?.G === undefined) &&
                        l_a_0__b_item?.G !== r_a_0__b_item?.G
                      )
                        return false
                      if (l_a_0__b_item?.G !== r_a_0__b_item?.G) return false
                    }
                  }
                }
              }
            }
            if (length > 1) {
              for (let ix = length; ix-- !== 1; ) {
                const l_a_item = l.a[ix]
                const r_a_item = r.a[ix]
                if (
                  (l_a_item?.H === undefined || r_a_item?.H === undefined) &&
                  l_a_item?.H !== r_a_item?.H
                )
                  return false
                if (l_a_item?.H !== r_a_item?.H) return false
              }
            }
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.object', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({})
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: {}, r: {}) {
        if (l === r) return true
        if (Object.keys(l).length !== Object.keys(r).length) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          street1: 'string',
          "street2?": 'string',
          city: 'string'
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { city: string; street1: string; street2?: string }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.city !== r.city) return false
        if (l.street1 !== r.street1) return false
        if (
          (l?.street2 === undefined || r?.street2 === undefined) &&
          l?.street2 !== r?.street2
        )
          return false
        if (l?.street2 !== r?.street2) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          "a?": type.number.array(),
          "b?": 'string',
          "c?": {
            "d?": {
              "e?": type.boolean.array()
            }
          }
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a?: Array<number>
        b?: string
        c?: { d?: { e?: Array<boolean> } }
      }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l?.a !== r?.a) {
          if ((l?.a === undefined || r?.a === undefined) && l?.a !== r?.a)
            return false
          if (l?.a !== r?.a) {
            const length = l?.a?.length
            if (length !== r?.a?.length) return false
            for (let ix = length; ix-- !== 0; ) {
              const l__a_item = l?.a[ix]
              const r__a_item = r?.a[ix]
              if (
                l__a_item !== r__a_item &&
                (l__a_item === l__a_item || r__a_item === r__a_item)
              )
                return false
            }
          }
        }
        if ((l?.b === undefined || r?.b === undefined) && l?.b !== r?.b) return false
        if (l?.b !== r?.b) return false
        if (l?.c !== r?.c) {
          if ((l?.c === undefined || r?.c === undefined) && l?.c !== r?.c)
            return false
          if (l?.c !== r?.c) {
            if (l.c?.d !== r.c?.d) {
              if ((l.c?.d === undefined || r.c?.d === undefined) && l.c?.d !== r.c?.d)
                return false
              if (l.c?.d !== r.c?.d) {
                if (l.c.d?.e !== r.c.d?.e) {
                  if (
                    (l.c.d?.e === undefined || r.c.d?.e === undefined) &&
                    l.c.d?.e !== r.c.d?.e
                  )
                    return false
                  if (l.c.d?.e !== r.c.d?.e) {
                    const length1 = l.c.d?.e?.length
                    if (length1 !== r.c.d?.e?.length) return false
                    for (let ix = length1; ix-- !== 0; ) {
                      const l_c_d__e_item = l.c.d?.e[ix]
                      const r_c_d__e_item = r.c.d?.e[ix]
                      if (l_c_d__e_item !== r_c_d__e_item) return false
                    }
                  }
                }
              }
            }
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          "a": {
            b: 'string',
            c: 'string'
          },
          "d?": 'string',
          e: {
            f: 'string',
            "g?": {
              h: 'string',
              i: 'string'
            }
          },
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        a: { b: string; c: string }
        e: { f: string; g?: { h: string; i: string } }
        d?: string
      }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.a !== r.a) {
          if (l.a.b !== r.a.b) return false
          if (l.a.c !== r.a.c) return false
        }
        if (l.e !== r.e) {
          if (l.e.f !== r.e.f) return false
          if (l.e?.g !== r.e?.g) {
            if ((l.e?.g === undefined || r.e?.g === undefined) && l.e?.g !== r.e?.g)
              return false
            if (l.e?.g !== r.e?.g) {
              if (l.e.g.h !== r.e.g.h) return false
              if (l.e.g.i !== r.e.g.i) return false
            }
          }
        }
        if ((l?.d === undefined || r?.d === undefined) && l?.d !== r?.d) return false
        if (l?.d !== r?.d) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          b: [
            {
              c: [
                {
                  d: 'string'
                },
                '[]'
              ]
            },
            '[]'
          ]
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { b: Array<{ c: Array<{ d: string }> }> }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.b !== r.b) {
          const length = l.b.length
          if (length !== r.b.length) return false
          for (let ix = length; ix-- !== 0; ) {
            const l_b_item = l.b[ix]
            const r_b_item = r.b[ix]
            if (l_b_item.c !== r_b_item.c) {
              const length1 = l_b_item.c.length
              if (length1 !== r_b_item.c.length) return false
              for (let ix = length1; ix-- !== 0; ) {
                const l_b_item_c_item = l_b_item.c[ix]
                const r_b_item_c_item = r_b_item.c[ix]
                if (l_b_item_c_item.d !== r_b_item_c_item.d) return false
              }
            }
          }
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type(
          {
            b: type.string.array(),
            "0b": type.string.array(),
            "00b": type.string.array(),
            "-00b": type.string.array(),
            "00b0": type.string.array(),
            "--00b0": type.string.array(),
            "-^00b0": type.string.array(),
            "": type.string.array(),
            _: type.string.array(),
          }
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = {
        "": Array<string>
        "--00b0": Array<string>
        "-00b": Array<string>
        "-^00b0": Array<string>
        "00b": Array<string>
        "00b0": Array<string>
        "0b": Array<string>
        _: Array<string>
        b: Array<string>
      }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l[""] !== r[""]) {
          const length = l[""].length
          if (length !== r[""].length) return false
          for (let ix = length; ix-- !== 0; ) {
            const l_____item = l[""][ix]
            const r_____item = r[""][ix]
            if (l_____item !== r_____item) return false
          }
        }
        if (l["--00b0"] !== r["--00b0"]) {
          const length1 = l["--00b0"].length
          if (length1 !== r["--00b0"].length) return false
          for (let ix = length1; ix-- !== 0; ) {
            const l____00b0___item = l["--00b0"][ix]
            const r____00b0___item = r["--00b0"][ix]
            if (l____00b0___item !== r____00b0___item) return false
          }
        }
        if (l["-00b"] !== r["-00b"]) {
          const length2 = l["-00b"].length
          if (length2 !== r["-00b"].length) return false
          for (let ix = length2; ix-- !== 0; ) {
            const l___00b___item = l["-00b"][ix]
            const r___00b___item = r["-00b"][ix]
            if (l___00b___item !== r___00b___item) return false
          }
        }
        if (l["-^00b0"] !== r["-^00b0"]) {
          const length3 = l["-^00b0"].length
          if (length3 !== r["-^00b0"].length) return false
          for (let ix = length3; ix-- !== 0; ) {
            const l____00b0__1_item = l["-^00b0"][ix]
            const r____00b0__1_item = r["-^00b0"][ix]
            if (l____00b0__1_item !== r____00b0__1_item) return false
          }
        }
        if (l["00b"] !== r["00b"]) {
          const length4 = l["00b"].length
          if (length4 !== r["00b"].length) return false
          for (let ix = length4; ix-- !== 0; ) {
            const l__00b___item = l["00b"][ix]
            const r__00b___item = r["00b"][ix]
            if (l__00b___item !== r__00b___item) return false
          }
        }
        if (l["00b0"] !== r["00b0"]) {
          const length5 = l["00b0"].length
          if (length5 !== r["00b0"].length) return false
          for (let ix = length5; ix-- !== 0; ) {
            const l__00b0___item = l["00b0"][ix]
            const r__00b0___item = r["00b0"][ix]
            if (l__00b0___item !== r__00b0___item) return false
          }
        }
        if (l["0b"] !== r["0b"]) {
          const length6 = l["0b"].length
          if (length6 !== r["0b"].length) return false
          for (let ix = length6; ix-- !== 0; ) {
            const l__0b___item = l["0b"][ix]
            const r__0b___item = r["0b"][ix]
            if (l__0b___item !== r__0b___item) return false
          }
        }
        if (l._ !== r._) {
          const length7 = l._.length
          if (length7 !== r._.length) return false
          for (let ix = length7; ix-- !== 0; ) {
            const l___item = l._[ix]
            const r___item = r._[ix]
            if (l___item !== r___item) return false
          }
        }
        if (l.b !== r.b) {
          const length8 = l.b.length
          if (length8 !== r.b.length) return false
          for (let ix = length8; ix-- !== 0; ) {
            const l_b_item = l.b[ix]
            const r_b_item = r.b[ix]
            if (l_b_item !== r_b_item) return false
          }
        }
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.intersection', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type(type.number.and('1')),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = 1
      function deepEqual(l: Type, r: Type) {
        if (l !== r && (l === l || r === r)) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          abc: 'string'
        }).and({
          def: 'string'
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string; def: string }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.abc !== r.abc) return false
        if (l.def !== r.def) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          abc: 'string',
          def: {
            ghi: 'string',
            jkl: 'string'
          }
        }).and(
          {
            abc: 'string',
            def: {
              ghi: 'string',
              jkl: 'string'
            }
          }
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: string; def: { ghi: string; jkl: string } }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        if (l.abc !== r.abc) return false
        if (l.def !== r.def) {
          if (l.def.ghi !== r.def.ghi) return false
          if (l.def.jkl !== r.def.jkl) return false
        }
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type.null.or(
          [
            { a: 'string' },
            '&',
            { b: 'string' }
          ]
        ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: string; b: string } | null
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            typeof value.a === "string" &&
            typeof value.b === "string"
          )
        }
        if (check(l) && check(r)) {
          if (l.a !== r.a) return false
          if (l.b !== r.b) return false
          satisfied = true
        }
        function check1(value) {
          return value === null
        }
        if (check1(l) && check1(r)) {
          if (l !== r) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual.writeable❳: type.union', () => {
    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type
          .number
          .or(type.string)
      )
    )).toMatchInlineSnapshot
      (`
      "function deepEqual(l: number | string, r: number | string) {
        if (Object.is(l, r)) return true
        let satisfied = false
        if (typeof l === "number" && typeof r === "number") {
          if (l !== r && (l === l || r === r)) return false
          satisfied = true
        }
        if (typeof l === "string" && typeof r === "string") {
          if (l !== r) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type
          .number.array()
          .or(type.boolean)
          .or(type.string),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = string | Array<number> | boolean
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (typeof l === "string" && typeof r === "string") {
          if (l !== r) return false
          satisfied = true
        }
        function check(value) {
          return (
            Array.isArray(value) && value.every((value) => Number.isFinite(value))
          )
        }
        if (check(l) && check(r)) {
          const length = l.length
          if (length !== r.length) return false
          for (let ix = length; ix-- !== 0; ) {
            const l_item = l[ix]
            const r_item = r[ix]
            if (l_item !== r_item && (l_item === l_item || r_item === r_item))
              return false
          }
          satisfied = true
        }
        if (typeof l === "boolean" && typeof r === "boolean") {
          if (l !== r) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type
          .number.array()
          .or(type.boolean)
          .or(type.string)
          .or(
            type({
              "A?": 'string'
            })
          )
          .or(
            type({
              "B?": '100',
              "C?": '200',
            })
          ),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | string
        | { A?: string }
        | { B?: 100; C?: 200 }
        | Array<number>
        | boolean
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (typeof l === "string" && typeof r === "string") {
          if (l !== r) return false
          satisfied = true
        }
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            (!Object.hasOwn(value, "A") || typeof value.A === "string")
          )
        }
        if (check(l) && check(r)) {
          if ((l?.A === undefined || r?.A === undefined) && l?.A !== r?.A)
            return false
          if (l?.A !== r?.A) return false
          satisfied = true
        }
        function check1(value) {
          return (
            !!value &&
            typeof value === "object" &&
            (!Object.hasOwn(value, "B") || value.B === 100) &&
            (!Object.hasOwn(value, "C") || value.C === 200)
          )
        }
        if (check1(l) && check1(r)) {
          if ((l?.B === undefined || r?.B === undefined) && l?.B !== r?.B)
            return false
          if (l?.B !== r?.B && (l?.B === l?.B || r?.B === r?.B)) return false
          if ((l?.C === undefined || r?.C === undefined) && l?.C !== r?.C)
            return false
          if (l?.C !== r?.C && (l?.C === l?.C || r?.C === r?.C)) return false
          satisfied = true
        }
        function check2(value) {
          return (
            Array.isArray(value) && value.every((value) => Number.isFinite(value))
          )
        }
        if (check2(l) && check2(r)) {
          const length = l.length
          if (length !== r.length) return false
          for (let ix = length; ix-- !== 0; ) {
            const l_item = l[ix]
            const r_item = r[ix]
            if (l_item !== r_item && (l_item === l_item || r_item === r_item))
              return false
          }
          satisfied = true
        }
        if (typeof l === "boolean" && typeof r === "boolean") {
          if (l !== r) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          tag: '"A"',
          onA: 'string',
        })
          .or({
            tag: '"B"',
            onB: 'string'
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { onA: string; tag: "A" } | { onB: string; tag: "B" }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (l.tag === "A") {
          if (l.onA !== r.onA) return false
          if (l.tag !== r.tag) return false
          satisfied = true
        }
        if (l.tag === "B") {
          if (l.onB !== r.onB) return false
          if (l.tag !== r.tag) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type(['1', '2', '3'])
          .or({
            a: '"A"',
            b: '"B"',
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a: "A"; b: "B" } | [1, 2, 3]
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return (
            !!value && typeof value === "object" && value.a === "A" && value.b === "B"
          )
        }
        if (check(l) && check(r)) {
          if (l.a !== r.a) return false
          if (l.b !== r.b) return false
          satisfied = true
        }
        function check1(value) {
          return (
            Array.isArray(value) &&
            3 <= value.length &&
            value[0] === 1 &&
            value[1] === 2 &&
            value[2] === 3
          )
        }
        if (check1(l) && check1(r)) {
          if (l[0] !== r[0] && (l[0] === l[0] || r[0] === r[0])) return false
          if (l[1] !== r[1] && (l[1] === l[1] || r[1] === r[1])) return false
          if (l[2] !== r[2] && (l[2] === l[2] || r[2] === r[2])) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          c: '"C"',
          d: '"D"',
        })
          .or({
            "a?": ['1', '2', '3'],
            "b?": type.string.array(),
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { a?: [1, 2, 3]; b?: Array<string> } | { c: "C"; d: "D" }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            (!Object.hasOwn(value, "a") ||
              (Array.isArray(value.a) &&
                3 <= value.a.length &&
                value.a?.[0] === 1 &&
                value.a?.[1] === 2 &&
                value.a?.[2] === 3)) &&
            (!Object.hasOwn(value, "b") ||
              (Array.isArray(value.b) &&
                value.b.every((value) => typeof value === "string")))
          )
        }
        if (check(l) && check(r)) {
          if (l?.a !== r?.a) {
            if ((l?.a === undefined || r?.a === undefined) && l?.a !== r?.a)
              return false
            if (l?.a !== r?.a) {
              if (
                l.a?.[0] !== r.a?.[0] &&
                (l.a?.[0] === l.a?.[0] || r.a?.[0] === r.a?.[0])
              )
                return false
              if (
                l.a?.[1] !== r.a?.[1] &&
                (l.a?.[1] === l.a?.[1] || r.a?.[1] === r.a?.[1])
              )
                return false
              if (
                l.a?.[2] !== r.a?.[2] &&
                (l.a?.[2] === l.a?.[2] || r.a?.[2] === r.a?.[2])
              )
                return false
            }
          }
          if (l?.b !== r?.b) {
            if ((l?.b === undefined || r?.b === undefined) && l?.b !== r?.b)
              return false
            if (l?.b !== r?.b) {
              const length1 = l?.b?.length
              if (length1 !== r?.b?.length) return false
              for (let ix = length1; ix-- !== 0; ) {
                const l__b_item = l?.b[ix]
                const r__b_item = r?.b[ix]
                if (l__b_item !== r__b_item) return false
              }
            }
          }
          satisfied = true
        }
        function check1(value) {
          return (
            !!value && typeof value === "object" && value.c === "C" && value.d === "D"
          )
        }
        if (check1(l) && check1(r)) {
          if (l.c !== r.c) return false
          if (l.d !== r.d) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type
          .number
          .or({
            street1: 'string',
            "street2?": 'string',
            city: 'string',
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = number | { city: string; street1: string; street2?: string }
      function deepEqual(l: Type, r: Type) {
        if (Object.is(l, r)) return true
        let satisfied = false
        if (typeof l === "number" && typeof r === "number") {
          if (l !== r && (l === l || r === r)) return false
          satisfied = true
        }
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            typeof value.city === "string" &&
            typeof value.street1 === "string" &&
            (!Object.hasOwn(value, "street2") || typeof value.street2 === "string")
          )
        }
        if (check(l) && check(r)) {
          if (l.city !== r.city) return false
          if (l.street1 !== r.street1) return false
          if (
            (l?.street2 === undefined || r?.street2 === undefined) &&
            l?.street2 !== r?.street2
          )
            return false
          if (l?.street2 !== r?.street2) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          tag: '"ABC"',
          abc: 'number',
        }).or({
          tag: '"DEF"',
          def: type.keywords.number.integer,
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type = { abc: number; tag: "ABC" } | { def: number; tag: "DEF" }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (l.tag === "ABC") {
          if (l.abc !== r.abc && (l.abc === l.abc || r.abc === r.abc)) return false
          if (l.tag !== r.tag) return false
          satisfied = true
        }
        if (l.tag === "DEF") {
          if (l.def !== r.def && (l.def === l.def || r.def === r.def)) return false
          if (l.tag !== r.tag) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          tag: '"NON_DISCRIMINANT"',
          abc: 'number',
        }).or({
          tag: '"NON_DISCRIMINANT"',
          def: type.keywords.number.integer,
        }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { abc: number; tag: "NON_DISCRIMINANT" }
        | { def: number; tag: "NON_DISCRIMINANT" }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            Number.isFinite(value.abc) &&
            value.tag === "NON_DISCRIMINANT"
          )
        }
        if (check(l) && check(r)) {
          if (l.abc !== r.abc && (l.abc === l.abc || r.abc === r.abc)) return false
          if (l.tag !== r.tag) return false
          satisfied = true
        }
        function check1(value) {
          return (
            !!value &&
            typeof value === "object" &&
            Number.isSafeInteger(value.def) &&
            value.tag === "NON_DISCRIMINANT"
          )
        }
        if (check1(l) && check1(r)) {
          if (l.def !== r.def && (l.def === l.def || r.def === r.def)) return false
          if (l.tag !== r.tag) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type(
          [
            {
              tag1: '"ABC"',
              abc: [
                {
                  tag2: '"ABC_JKL"',
                  jkl: [{ tag3: '"ABC_JKL_ONE"' }, '|', { tag3: '"ABC_JKL_TWO"' }]
                },
                '|',
                {
                  tag2: '"ABC_MNO"',
                  mno: [{ tag3: '"ABC_MNO_ONE"' }, '|', { tag3: '"ABC_MNO_TWO"' }]
                }
              ]
            },
            '|',
            {
              tag1: '"DEF"',
              def: [
                {
                  tag2: '"DEF_PQR"',
                  pqr: [{ tag3: '"DEF_PQR_ONE"' }, '|', { tag3: '"DEF_PQR_TWO"' }]
                },
                '|',
                {
                  tag2: '"DEF_STU"',
                  stu: [{ tag3: '"DEF_STU_ONE"' }, '|', { tag3: '"DEF_STU_TWO"' }]
                }
              ]
            }
          ]
        ),
        { typeName: 'Type' }
      ),
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | {
            abc:
              | {
                  jkl: { tag3: "ABC_JKL_ONE" } | { tag3: "ABC_JKL_TWO" }
                  tag2: "ABC_JKL"
                }
              | {
                  mno: { tag3: "ABC_MNO_ONE" } | { tag3: "ABC_MNO_TWO" }
                  tag2: "ABC_MNO"
                }
            tag1: "ABC"
          }
        | {
            def:
              | {
                  pqr: { tag3: "DEF_PQR_ONE" } | { tag3: "DEF_PQR_TWO" }
                  tag2: "DEF_PQR"
                }
              | {
                  stu: { tag3: "DEF_STU_ONE" } | { tag3: "DEF_STU_TWO" }
                  tag2: "DEF_STU"
                }
            tag1: "DEF"
          }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (l.tag1 === "ABC") {
          let satisfied1 = false
          if (l.abc.tag2 === "ABC_JKL") {
            let satisfied2 = false
            if (l.abc.jkl.tag3 === "ABC_JKL_ONE") {
              if (l.abc.jkl.tag3 !== r.abc.jkl.tag3) return false
              satisfied2 = true
            }
            if (l.abc.jkl.tag3 === "ABC_JKL_TWO") {
              if (l.abc.jkl.tag3 !== r.abc.jkl.tag3) return false
              satisfied2 = true
            }
            if (!satisfied2) return false
            if (l.abc.tag2 !== r.abc.tag2) return false
            satisfied1 = true
          }
          if (l.abc.tag2 === "ABC_MNO") {
            let satisfied3 = false
            if (l.abc.mno.tag3 === "ABC_MNO_ONE") {
              if (l.abc.mno.tag3 !== r.abc.mno.tag3) return false
              satisfied3 = true
            }
            if (l.abc.mno.tag3 === "ABC_MNO_TWO") {
              if (l.abc.mno.tag3 !== r.abc.mno.tag3) return false
              satisfied3 = true
            }
            if (!satisfied3) return false
            if (l.abc.tag2 !== r.abc.tag2) return false
            satisfied1 = true
          }
          if (!satisfied1) return false
          if (l.tag1 !== r.tag1) return false
          satisfied = true
        }
        if (l.tag1 === "DEF") {
          let satisfied4 = false
          if (l.def.tag2 === "DEF_PQR") {
            let satisfied5 = false
            if (l.def.pqr.tag3 === "DEF_PQR_ONE") {
              if (l.def.pqr.tag3 !== r.def.pqr.tag3) return false
              satisfied5 = true
            }
            if (l.def.pqr.tag3 === "DEF_PQR_TWO") {
              if (l.def.pqr.tag3 !== r.def.pqr.tag3) return false
              satisfied5 = true
            }
            if (!satisfied5) return false
            if (l.def.tag2 !== r.def.tag2) return false
            satisfied4 = true
          }
          if (l.def.tag2 === "DEF_STU") {
            let satisfied6 = false
            if (l.def.stu.tag3 === "DEF_STU_ONE") {
              if (l.def.stu.tag3 !== r.def.stu.tag3) return false
              satisfied6 = true
            }
            if (l.def.stu.tag3 === "DEF_STU_TWO") {
              if (l.def.stu.tag3 !== r.def.stu.tag3) return false
              satisfied6 = true
            }
            if (!satisfied6) return false
            if (l.def.tag2 !== r.def.tag2) return false
            satisfied4 = true
          }
          if (!satisfied4) return false
          if (l.tag1 !== r.tag1) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({ tag: type.string.array() })
          .or({
            tag: '"B"',
            "onB?": type.string.array()
          })
          .or({
            tag: '"A"',
            "onA?": type.keywords.Record('string', type({ "abc?": 'number' }).array())
          }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { tag: Array<string> }
        | { tag: "A"; onA?: Record<string, Array<{ abc?: number }>> }
        | { tag: "B"; onB?: Array<string> }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return (
            !!value &&
            typeof value === "object" &&
            Array.isArray(value.tag) &&
            value.tag.every((value) => typeof value === "string")
          )
        }
        if (check(l) && check(r)) {
          if (l.tag !== r.tag) {
            const length = l.tag.length
            if (length !== r.tag.length) return false
            for (let ix = length; ix-- !== 0; ) {
              const l_tag_item = l.tag[ix]
              const r_tag_item = r.tag[ix]
              if (l_tag_item !== r_tag_item) return false
            }
          }
          satisfied = true
        }
        function check1(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "A" &&
            (!Object.hasOwn(value, "onA") ||
              (!!value.onA &&
                typeof value.onA === "object" &&
                Object.entries(value.onA).every(
                  ([key, value]) =>
                    Array.isArray(value) &&
                    value.every(
                      (value) =>
                        !!value &&
                        typeof value === "object" &&
                        (!Object.hasOwn(value, "abc") || Number.isFinite(value?.abc)),
                    ),
                )))
          )
        }
        if (check1(l) && check1(r)) {
          if (l.tag !== r.tag) return false
          if (l?.onA !== r?.onA) {
            if ((l?.onA === undefined || r?.onA === undefined) && l?.onA !== r?.onA)
              return false
            if (l?.onA !== r?.onA) {
              const l__onA_keys = Object.keys(l?.onA)
              const r__onA_keys = Object.keys(r?.onA)
              const length1 = l__onA_keys.length
              if (length1 !== r__onA_keys.length) return false
              for (let ix = length1; ix-- !== 0; ) {
                const key = l__onA_keys[ix]
                const l__onA_k_ = l?.onA[key]
                const r__onA_k_ = r?.onA[key]
                const length2 = l__onA_k_?.length
                if (length2 !== r__onA_k_?.length) return false
                for (let ix = length2; ix-- !== 0; ) {
                  const l__onA_k_1_item = l__onA_k_[ix]
                  const r__onA_k_1_item = r__onA_k_[ix]
                  if (
                    (l__onA_k_1_item?.abc === undefined ||
                      r__onA_k_1_item?.abc === undefined) &&
                    l__onA_k_1_item?.abc !== r__onA_k_1_item?.abc
                  )
                    return false
                  if (
                    l__onA_k_1_item?.abc !== r__onA_k_1_item?.abc &&
                    (l__onA_k_1_item?.abc === l__onA_k_1_item?.abc ||
                      r__onA_k_1_item?.abc === r__onA_k_1_item?.abc)
                  )
                    return false
                }
              }
            }
          }
          satisfied = true
        }
        function check2(value) {
          return (
            !!value &&
            typeof value === "object" &&
            value.tag === "B" &&
            (!Object.hasOwn(value, "onB") ||
              (Array.isArray(value.onB) &&
                value.onB.every((value) => typeof value === "string")))
          )
        }
        if (check2(l) && check2(r)) {
          if (l.tag !== r.tag) return false
          if (l?.onB !== r?.onB) {
            if ((l?.onB === undefined || r?.onB === undefined) && l?.onB !== r?.onB)
              return false
            if (l?.onB !== r?.onB) {
              const length3 = l?.onB?.length
              if (length3 !== r?.onB?.length) return false
              for (let ix = length3; ix-- !== 0; ) {
                const l__onB_item = l?.onB[ix]
                const r__onB_item = r?.onB[ix]
                if (l__onB_item !== r__onB_item) return false
              }
            }
          }
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({ abc: 'string' })
          .or({ def: 'string' })
          .or({ ghi: 'string' })
          .or({ jkl: 'string' }),
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { abc: string }
        | { def: string }
        | { ghi: string }
        | { jkl: string }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        function check(value) {
          return !!value && typeof value === "object" && typeof value.abc === "string"
        }
        if (check(l) && check(r)) {
          if (l.abc !== r.abc) return false
          satisfied = true
        }
        function check1(value) {
          return !!value && typeof value === "object" && typeof value.def === "string"
        }
        if (check1(l) && check1(r)) {
          if (l.def !== r.def) return false
          satisfied = true
        }
        function check2(value) {
          return !!value && typeof value === "object" && typeof value.ghi === "string"
        }
        if (check2(l) && check2(r)) {
          if (l.ghi !== r.ghi) return false
          satisfied = true
        }
        function check3(value) {
          return !!value && typeof value === "object" && typeof value.jkl === "string"
        }
        if (check3(l) && check3(r)) {
          if (l.jkl !== r.jkl) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)

    vi.expect.soft(format(
      ark.deepEqual.writeable(
        type({
          "tag?": '"A"',
          "onA?":
            type.boolean
              .or(type.string)
              .or(type.string.array())
        }).or({
          "tag?": '"B"',
          "onB?": {
            "C?":
              type.boolean
                .or(type.string)
                .or(type.string.array())
          }
        })
        ,
        { typeName: 'Type' }
      )
    )).toMatchInlineSnapshot
      (`
      "type Type =
        | { onA?: string | Array<string> | boolean; tag?: "A" }
        | { onB?: { C?: string | Array<string> | boolean }; tag?: "B" }
      function deepEqual(l: Type, r: Type) {
        if (l === r) return true
        let satisfied = false
        if (l.tag === "A") {
          if ((l?.onA === undefined || r?.onA === undefined) && l?.onA !== r?.onA)
            return false
          if (l?.onA !== r?.onA) {
            let satisfied1 = false
            if (typeof l?.onA === "string" && typeof r?.onA === "string") {
              if (l?.onA !== r?.onA) return false
              satisfied1 = true
            }
            function check(value) {
              return (
                Array.isArray(value) &&
                value.every((value) => typeof value === "string")
              )
            }
            if (check(l?.onA) && check(r?.onA)) {
              const length = l?.onA?.length
              if (length !== r?.onA?.length) return false
              for (let ix = length; ix-- !== 0; ) {
                const l__onA_item = l?.onA[ix]
                const r__onA_item = r?.onA[ix]
                if (l__onA_item !== r__onA_item) return false
              }
              satisfied1 = true
            }
            if (typeof l?.onA === "boolean" && typeof r?.onA === "boolean") {
              if (l?.onA !== r?.onA) return false
              satisfied1 = true
            }
            if (!satisfied1) return false
          }
          if ((l?.tag === undefined || r?.tag === undefined) && l?.tag !== r?.tag)
            return false
          if (l?.tag !== r?.tag) return false
          satisfied = true
        }
        if (l.tag === "B") {
          if (l?.onB !== r?.onB) {
            if ((l?.onB === undefined || r?.onB === undefined) && l?.onB !== r?.onB)
              return false
            if (l?.onB !== r?.onB) {
              if (
                (l.onB?.C === undefined || r.onB?.C === undefined) &&
                l.onB?.C !== r.onB?.C
              )
                return false
              if (l.onB?.C !== r.onB?.C) {
                let satisfied2 = false
                if (typeof l.onB?.C === "string" && typeof r.onB?.C === "string") {
                  if (l.onB?.C !== r.onB?.C) return false
                  satisfied2 = true
                }
                function check1(value) {
                  return (
                    Array.isArray(value) &&
                    value.every((value) => typeof value === "string")
                  )
                }
                if (check1(l.onB?.C) && check1(r.onB?.C)) {
                  const length1 = l.onB?.C?.length
                  if (length1 !== r.onB?.C?.length) return false
                  for (let ix = length1; ix-- !== 0; ) {
                    const l_onB__C_item = l.onB?.C[ix]
                    const r_onB__C_item = r.onB?.C[ix]
                    if (l_onB__C_item !== r_onB__C_item) return false
                  }
                  satisfied2 = true
                }
                if (typeof l.onB?.C === "boolean" && typeof r.onB?.C === "boolean") {
                  if (l.onB?.C !== r.onB?.C) return false
                  satisfied2 = true
                }
                if (!satisfied2) return false
              }
            }
          }
          if ((l?.tag === undefined || r?.tag === undefined) && l?.tag !== r?.tag)
            return false
          if (l?.tag !== r?.tag) return false
          satisfied = true
        }
        if (!satisfied) return false
        return true
      }
      "
    `)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: ark.deepEqual', () => {
  vi.test('〖⛳️〗› ❲ark.deepEqual❳: type.array', () => {
    const equal_01 = ark.deepEqual(
      type([
        {
          firstName: 'string',
          "lastName?": 'string',
          address: {
            street1: 'string',
            "street2?": 'string',
            city: 'string'
          },
        },
        '[]'
      ])
    )

    vi.expect.soft(equal_01([], [])).toBeTruthy()
    vi.expect.soft(equal_01(
      [
        { firstName: 'Peter', lastName: 'Venkman', address: { street1: '123 Main St', street2: 'Unit B', city: 'Brooklyn' } },
        { firstName: 'Ray', lastName: 'Stantz', address: { street1: '456 2nd St', city: 'Queens' } },
        { firstName: 'Egon', lastName: 'Spengler', address: { street1: '789 Cesar Chavez', city: 'Boston' } },
      ],
      [
        { firstName: 'Peter', lastName: 'Venkman', address: { street1: '123 Main St', street2: 'Unit B', city: 'Brooklyn' } },
        { firstName: 'Ray', lastName: 'Stantz', address: { street1: '456 2nd St', city: 'Queens' } },
        { firstName: 'Egon', lastName: 'Spengler', address: { street1: '789 Cesar Chavez', city: 'Boston' } },
      ]
    )).toBeTruthy()
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual❳: type.tuple', () => {
    const equal_01 = ark.deepEqual(
      type([
        'number',
        [
          {
            a: 'boolean'
          }
        ]
      ])
    )

    vi.expect.soft(equal_01(
      [
        1,
        [
          {
            a: false
          }
        ]
      ],
      [
        1,
        [
          {
            a: false
          }
        ]
      ]
    )).toBeTruthy()
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual❳: type.tuple w/ rest', () => {
    const equal_01 = ark.deepEqual(
      type([
        'boolean',
        'string',
        'number.integer',
        '...',
        'number[][]'
      ])
    )

    vi.expect.soft(
      equal_01(
        [false, '', 0],
        [false, '', 0]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_01(
        [false, '', 0, []],
        [false, '', 0, []]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_01(
        [false, '', 0, [1]],
        [false, '', 0, [1]]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_01(
        [false, '', 0, [1, 2]],
        [false, '', 0, [1, 2]]
      )
    ).toBeTruthy()

    const equal_02 = ark.deepEqual(
      type([
        type.boolean.array(),
        '...',
        'boolean[]'
      ])
    )

    vi.expect.soft(
      equal_02(
        [[false]],
        [[false]]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_02(
        [[false], false],
        [[false], false]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_02(
        [[false, true]],
        [[false, true]]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_02(
        [[false, true], false],
        [[false, true], false]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_02(
        [[false, true, true], false, false],
        [[false, true, true], false, false]
      )
    ).toBeTruthy()

    const equal_03 = ark.deepEqual(
      type([
        {
          "a?": [
            {
              "b?": [
                {
                  "c?": [
                    {
                      "d?": 'string'
                    },
                    '...',
                    [
                      {
                        "E?": [
                          'string',
                          '...',
                          [{ "F?": 'string' }, '[]']
                        ]
                      },
                      '[]'
                    ]
                  ]
                },
                '...',
                [{ "G?": 'string' }, '[]']
              ]
            },
            '...',
            [{ "H?": 'string' }, '[]']
          ]
        },
        '...',
        [
          {
            "I": [
              'string',
              '...',
              [{ "J?": 'string' }, '[]'],
            ]
          },
          '[]',
        ]
      ])
    )

    vi.expect.soft(
      equal_03(
        [
          {
            a: [
              {
                b: [
                  {
                    c: [
                      {
                        d: 'hey'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        [
          {
            a: [
              {
                b: [
                  {
                    c: [
                      {
                        d: 'hey'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
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
                          'hey'
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
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
                          'hey'
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
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
                          {
                            F: 'FF'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
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
                          {
                            F: 'FF'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
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
        ],
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
        ]
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
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
        ],
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
        ]
      )
    ).toBeTruthy()
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual❳: type.object', () => {
    const equal_01 = ark.deepEqual(type({}))

    vi.expect.soft(
      equal_01(
        {},
        {}
      )
    ).toBeTruthy()

    const equal_02 = ark.deepEqual(
      type({
        a: {
          b: '"B"',
          c: '"C"',
        },
        "d?": '"D"',
        e: {
          f: '"F"',
          "g?": {
            h: '"H"',
            i: '"I"',
          }
        }
      }),
    )

    vi.expect.soft(
      equal_02(
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
        },
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
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_02(
        {
          a: {
            b: 'B',
            c: 'C',
          },
          e: {
            f: 'F',
          }
        },
        {
          a: {
            b: 'B',
            c: 'C',
          },
          e: {
            f: 'F',
          }
        }
      )
    ).toBeTruthy()

    const equal_03 = ark.deepEqual(
      type({
        "a?": type.keywords.Record('string', 'string'),
        "b?": type.keywords.Record('string', {
          c: {
            d: 'string',
            e: type.keywords.Record('string', 'string[]')
          }
        })
      })
    )

    vi.expect.soft(
      equal_03(
        {
          a: {},
          b: {}
        },
        {
          a: {},
          b: {}
        }
      )).toBeTruthy()

    vi.expect.soft(
      equal_03(
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
        },
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
      )).toBeTruthy()

    vi.expect.soft(
      equal_03(
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
        },
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
      )
    ).toBeTruthy()

    const equal_04 = ark.deepEqual(
      type({
        "b?": type({
          c: type({
            d: 'string'
          }).array()
        }).array()
      })
    )

    vi.expect.soft(
      equal_04(
        {
          b: []
        },
        {
          b: []
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_04(
        {
          b: [
            {
              c: []
            }
          ]
        },
        {
          b: [
            {
              c: []
            }
          ]
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_04(
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
        },
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
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_04(
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
        },
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
      )
    ).toBeTruthy()

    const equal_05 = ark.deepEqual(
      type({
        b: type.string.array(),
        "0b": type.string.array(),
        "00b": type.string.array(),
        "-00b": type.string.array(),
        "00b0": type.string.array(),
        "--00b0": type.string.array(),
        "-^00b0": type.string.array(),
        "": type.string.array(),
        _: type.string.array(),
      })
    )

    vi.expect.soft(
      equal_05(
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
        },
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
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_05(
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
        },
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
      )
    ).toBeTruthy()

  })

  vi.test('〖⛳️〗› ❲ark.deepEqual❳: type.intersection', () => {
    const equal_01 = ark.deepEqual(
      type({
        abc: '"ABC"'
      }).and({
        def: '"DEF"'
      })
    )

    vi.expect.soft(
      equal_01(
        {
          abc: 'ABC',
          def: 'DEF',
        },
        {
          abc: 'ABC',
          def: 'DEF',
        }
      )
    ).toBeTruthy()
  })

  vi.test('〖⛳️〗› ❲ark.deepEqual❳: type.union', () => {
    const equal_01 = ark.deepEqual(
      type
        .number
        .or({
          street1: 'string',
          "street2?": 'string',
          city: 'string'
        })
    )

    vi.expect.soft(
      equal_01(
        0,
        0
      )
    ).toBeTruthy()
    vi.expect.soft(
      equal_01(
        -0,
        -0
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_01(
        {
          street1: '221B Baker St',
          city: 'London'
        },
        {
          street1: '221B Baker St',
          city: 'London'
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_01(
        {
          street1: '221 Baker St',
          street2: '#B',
          city: 'London'
        },
        {
          street1: '221 Baker St',
          street2: '#B',
          city: 'London'
        }
      )
    ).toBeTruthy()

    const equal_03 = ark.deepEqual(
      type({
        yea: '"YAY"',
        onYea: [
          'number',
          '|',
          'string[]'
        ],
      },
        '|',
        {
          boo: '"NOO"',
          onBoo: [
            {
              tag: 'boolean',
              "opt?": 'string',
            },
            '|',
            'Record<string, string>'
          ]
        }
      )
    )

    vi.expect.soft(
      equal_03(
        {
          yea: 'YAY',
          onYea: 1
        },
        {
          yea: 'YAY',
          onYea: 1
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
        {
          yea: 'YAY',
          onYea: []
        },
        {
          yea: 'YAY',
          onYea: []
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
        {
          onYea: [
            'Y1',
            'Y2',
            'Y3',
          ],
          yea: 'YAY',
        },
        {
          onYea: [
            'Y1',
            'Y2',
            'Y3',
          ],
          yea: 'YAY',
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
        {
          boo: 'NOO',
          onBoo: {},
        },
        {
          boo: 'NOO',
          onBoo: {},
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
        {
          boo: 'NOO',
          onBoo: {
            tag: false
          }
        },
        {
          boo: 'NOO',
          onBoo: {
            tag: false
          }
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
        {
          boo: 'NOO',
          onBoo: {
            opt: 'sup',
            tag: false,
          }
        },
        {
          boo: 'NOO',
          onBoo: {
            opt: 'sup',
            tag: false,
          }
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
        {
          boo: 'NOO',
          onBoo: {
            opt: 'sup',
            tag: false,
          }
        },
        {
          boo: 'NOO',
          onBoo: {
            opt: 'sup',
            tag: false,
          }
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
        {
          boo: 'NOO',
          onBoo: {}
        },
        {
          boo: 'NOO',
          onBoo: {}
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_03(
        {
          boo: 'NOO',
          onBoo: {
            X: 'X',
            Y: 'Y',
            Z: 'Z',
          }
        },
        {
          boo: 'NOO',
          onBoo: {
            X: 'X',
            Y: 'Y',
            Z: 'Z',
          }
        }
      )
    ).toBeTruthy()

    const equal_04 = ark.deepEqual(
      type([
        {
          tag: '"A"',
          onA: 'string',
        },
        '|',
        {
          tag: '"B"',
          onB: 'string',
        }
      ])
    )

    vi.expect.soft(
      equal_04(
        {
          onA: 'HEYY',
          tag: 'A',
        },
        {
          onA: 'HEYY',
          tag: 'A',
        }
      )
    ).toBeTruthy()

    vi.expect.soft(
      equal_04(
        {
          onB: 'HEYY',
          tag: 'B',
        },
        {
          onB: 'HEYY',
          tag: 'B',
        }
      )
    ).toBeTruthy()

  })
})
