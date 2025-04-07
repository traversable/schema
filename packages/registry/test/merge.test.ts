import * as vi from 'vitest'

import { merge, mut } from '@traversable/registry'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳: merge', () => {
  vi.it('〖⛳️〗‹‹‹ ❲merge❳: typelevel tests', () => {
    vi.expectTypeOf(merge([10], { [String()]: Boolean() })).toEqualTypeOf(mut({ 0: 10 }, { [String()]: Boolean() }))
    vi.expectTypeOf(merge({ a: 10 }, { [String()]: Boolean() })).toEqualTypeOf(mut({ a: 10 }, { [String()]: Boolean() }))
    vi.expectTypeOf(merge([10], { a: 100 })).toEqualTypeOf(mut({ 0: 10, a: 100 }))
    vi.expectTypeOf(merge({ a: 100 }, [10])).toEqualTypeOf(mut({ 0: 10, a: 100 }))
    vi.expectTypeOf(merge(Array(Number() || String()), { a: 4, b: 5 })).toEqualTypeOf(mut({ [Number()]: Number() || String() }, { a: 4, b: 5 }))
    vi.expectTypeOf(merge({ a: 4, b: 5 }, Array(Number() || String()))).toEqualTypeOf(mut({ [Number()]: Number() || String(), a: 4, b: 5 }))
    vi.expectTypeOf(merge([], [])).toEqualTypeOf(mut([]))
    vi.expectTypeOf(merge([1], [])).toEqualTypeOf(mut([1]))
    vi.expectTypeOf(merge([], ['a'])).toEqualTypeOf(mut(['a']))
    vi.expectTypeOf(merge([1], ['a'])).toEqualTypeOf(mut(['a']))
    vi.expectTypeOf(merge([1, 2], ['a'])).toEqualTypeOf(mut(['a', 2]))
    vi.expectTypeOf(merge([1], ['a', 'b'])).toEqualTypeOf(mut(['a', 'b']))
    vi.expectTypeOf(merge([1, 2], ['a', 'b', 'c'])).toEqualTypeOf(mut(['a', 'b', 'c']))
    vi.expectTypeOf(merge([1, 2, 3], ['a', 'b', 'c'])).toEqualTypeOf(mut(['a', 'b', 'c']))
    vi.expectTypeOf(merge([1, 2, 3, 4], ['a', 'b', 'c'])).toEqualTypeOf(mut(['a', 'b', 'c', 4]))
    vi.expectTypeOf(merge([1, 2], ['a', 'b', 'c', 'd'])).toEqualTypeOf(mut(['a', 'b', 'c', 'd']))
    vi.expectTypeOf(merge([1, 2, 3, 4], ['a', 'b'])).toEqualTypeOf(mut(['a', 'b', 3, 4]))
    vi.expectTypeOf(merge({ [String()]: Number() || String() }, Array(Boolean() || null)))
      .toEqualTypeOf(mut({ [String()]: Number() || String() }, { [Number()]: Boolean() || null }))
    vi.expectTypeOf(merge({ [Number()]: Number() || String() }, Array(Boolean() || null)))
      .toEqualTypeOf(mut({ [String()]: Number() || String() }, { [Number()]: Boolean() || null }))
    vi.expectTypeOf(merge({ [String() || Number()]: Number() || String() }, Array(Boolean() || null)))
      .toEqualTypeOf(mut({ [String()]: Number() || String() }, { [Number()]: Boolean() || null }))
    vi.expectTypeOf(merge(Array(Boolean() || null), { [String()]: Number() || String() }))
      .toEqualTypeOf(mut({ [Number()]: Boolean() || null }, { [String()]: Number() || String() }))
    vi.expectTypeOf(merge(Array(Boolean() || null), { [Number()]: Number() || String() }))
      .toEqualTypeOf(mut({ [Number()]: Boolean() || null }, { [String()]: Number() || String() },))
    vi.expectTypeOf(merge(Array(Boolean() || null), { [String() || Number()]: Number() || String() }))
      .toEqualTypeOf(mut({ [Number()]: Boolean() || null }, { [String()]: Number() || String() },))

    // vi.expectTypeOf(merge({ [Symbol()]: Number() || String() }, Array(Boolean() || Symbol())))
    //   .toEqualTypeOf(mut({ [Symbol()]: Number() || String() }, { [Number()]: Boolean() || Symbol() }))
    // vi.expectTypeOf(merge(Array(Boolean() || null), { [Symbol()]: Number() || String() }))
    //   .toEqualTypeOf(mut({ [Number()]: Boolean() || null }, { [Symbol()]: Number() || String() },))

  })
})
