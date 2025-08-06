import * as vi from 'vitest'

import { t, get, get$ } from '@traversable/schema'
import { symbol } from '@traversable/registry'

const Schema_01 = t.tuple(t.eq(1))
const Schema_02 = t.record(t.record(t.boolean))
const Schema_03 = t.array(t.array(t.number))
const Schema_04 = t.optional(t.optional(t.string))

const Schema_05 = t.object({
  a: t.tuple(
    t.object({
      b: t.string,
      c: t.array(t.number),
    }),
    t.tuple(
      t.object({
        d: t.boolean,
        e: t.number,
      })
    )
  ),
  b: t.object({
    d: t.boolean,
  }),
  c: t.record(t.boolean)
})

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('〖⛳️〗› ❲get❳', () => {
    vi.assert.equal(get(Schema_01), Schema_01)
    vi.assert.equal(get(Schema_02), Schema_02)
    vi.assert.equal(get(Schema_03), Schema_03)
    vi.assert.equal(get(Schema_04), Schema_04)
    vi.assert.equal(get(Schema_05), Schema_05)
    vi.assert.equal(get(Schema_05, 'z' as never), symbol.notfound)
    vi.assert.deepEqual(get(Schema_05, 'a'), Schema_05.def.a)
    vi.assert.deepEqual(get(Schema_05, 'a', 0), Schema_05.def.a.def[0])
    vi.assert.deepEqual(get(Schema_05, 'a', '0'), Schema_05.def.a.def[0])
    vi.assert.deepEqual(get(Schema_05, 'a', 0, 'b'), Schema_05.def.a.def[0].def.b)
    vi.assert.deepEqual(get(Schema_05, 'a', '0', 'b'), Schema_05.def.a.def[0].def.b)
    vi.assert.deepEqual(get(Schema_05, 'c'), Schema_05.def.c)
    vi.assert.deepEqual(get(t.never), t.never)
    vi.assert.deepEqual(get(t.unknown), t.unknown)
    vi.assert.deepEqual(get(t.any), t.any)
    vi.assert.deepEqual(get(t.void), t.void)
    vi.assert.deepEqual(get(t.null), t.null)
    vi.assert.deepEqual(get(t.undefined), t.undefined)
    vi.assert.deepEqual(get(t.boolean), t.boolean)
    vi.assert.deepEqual(get(t.symbol), t.symbol)
    vi.assert.deepEqual(get(t.bigint), t.bigint)
    vi.assert.deepEqual(get(t.number), t.number)
    vi.assert.deepEqual(get(t.string), t.string)
  })

  vi.it('〖⛳️〗› ❲get$❳', () => {
    vi.assert.equal(get$(Schema_01), Schema_01)
    vi.assert.equal(get$(Schema_02), Schema_02)
    vi.assert.equal(get$(Schema_03), Schema_03)
    vi.assert.equal(get$(Schema_04), Schema_04)
    vi.assert.equal(get$(Schema_05), Schema_05)
    vi.assert.equal(get$(Schema_05, 'z' as never), symbol.notfound)
    vi.assert.deepEqual(get$(Schema_05, 'a'), Schema_05.def.a)
    vi.assert.deepEqual(get$(Schema_05, 'a', 'def', 0), Schema_05.def.a.def[0])
    vi.assert.deepEqual(get$(Schema_05, 'a', 'def', '0'), Schema_05.def.a.def[0])
    vi.assert.deepEqual(get$(Schema_05, 'a', 'def', 0, 'def', 'b'), Schema_05.def.a.def[0].def.b)
    vi.assert.deepEqual(get$(Schema_05, 'a', 'def', '0', 'def', 'b'), Schema_05.def.a.def[0].def.b)
    vi.assert.deepEqual(get$(Schema_05, 'c'), Schema_05.def.c)
    vi.assert.deepEqual(get$(t.never), t.never)
    vi.assert.deepEqual(get$(t.unknown), t.unknown)
    vi.assert.deepEqual(get$(t.any), t.any)
    vi.assert.deepEqual(get$(t.void), t.void)
    vi.assert.deepEqual(get$(t.null), t.null)
    vi.assert.deepEqual(get$(t.undefined), t.undefined)
    vi.assert.deepEqual(get$(t.boolean), t.boolean)
    vi.assert.deepEqual(get$(t.symbol), t.symbol)
    vi.assert.deepEqual(get$(t.bigint), t.bigint)
    vi.assert.deepEqual(get$(t.number), t.number)
    vi.assert.deepEqual(get$(t.string), t.string)
  })
})
