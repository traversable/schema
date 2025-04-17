import type { NonUnion } from '@traversable/registry'
import { Match } from '@traversable/registry/satisfies'
import * as vi from 'vitest'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳', () => {
  vi.it('〖⛳️〗› ❲NonUnion❳', () => {
    function nonunion<T extends NonUnion<T>>(x: T): T
    function nonunion(x: unknown) { return x }

    vi.assertType<1>(nonunion(1))
    vi.assertType<number>(nonunion(1 as number))

    /* @ts-expect-error */
    vi.assertType<never>(nonunion(1 as 1 | 2))
    /* @ts-expect-error */
    nonunion(Math.random() > 0.5)
  })
})

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/registry❳: Match', () => {
  vi.test('〖⛳️〗› ❲Match.match❳', () => {
    // FINITE
    vi.expectTypeOf(Match.match([1], [2])).toEqualTypeOf(1 as const)
    vi.expectTypeOf(Match.match([1], { b: 2 })).toEqualTypeOf(2 as const)
    vi.expectTypeOf(Match.match({ a: 1 }, [2])).toEqualTypeOf(3 as const)
    vi.expectTypeOf(Match.match({ a: 1 }, { b: 2 })).toEqualTypeOf(4 as const)
    // MIXED
    vi.expectTypeOf(Match.match(Array(Number() || String()), [2])).toEqualTypeOf(5 as const)
    vi.expectTypeOf(Match.match([1], Array(Number() || String()))).toEqualTypeOf(6 as const)
    vi.expectTypeOf(Match.match([1], { [Number()]: 2 })).toEqualTypeOf(7 as const)
    vi.expectTypeOf(Match.match({ [Number()]: 1 }, [2])).toEqualTypeOf(8 as const)
    vi.expectTypeOf(Match.match({ a: 1 }, Array(Number() || String()))).toEqualTypeOf(9 as const)
    vi.expectTypeOf(Match.match(Array(Number() || String()), { a: 2 })).toEqualTypeOf(10 as const)
    vi.expectTypeOf(Match.match({ [Number()]: 1 }, { b: 2 })).toEqualTypeOf(11 as const)
    vi.expectTypeOf(Match.match({ a: 1 }, { [Number()]: 2 })).toEqualTypeOf(12 as const)
    // NON-FINITE
    vi.expectTypeOf(Match.match(Array(Number() || String()), Array(Number() || String()))).toEqualTypeOf(13 as const)
    vi.expectTypeOf(Match.match(Array(Number() || String()), { [String()]: Number() })).toEqualTypeOf(14 as const)
    vi.expectTypeOf(Match.match({ [String()]: Number() }, Array(Number() || String()))).toEqualTypeOf(15 as const)
    vi.expectTypeOf(Match.match({ [Number()]: String() }, { [String()]: Number() })).toEqualTypeOf(16 as const)
  })
})
