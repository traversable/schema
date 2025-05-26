import * as vi from 'vitest'
import { hom } from '@traversable/registry'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳: fn', () => {
  vi.it('〖⛳️〗‹‹‹ ❲hom❳: empty case', () => {
    const actual = hom([])()

    vi.assert.deepEqual(actual, {})
    vi.expectTypeOf(actual).toEqualTypeOf<{}>()
  })

  vi.it('〖⛳️〗‹‹‹ ❲hom❳: standard use case', () => {
    const actual = hom(['a', 'b', 'c'])(1 as const)(2 as const)(3 as const)

    vi.assert.deepEqual(actual, { a: 1, b: 2, c: 3 })
    vi.expectTypeOf(actual).toEqualTypeOf<{ a: 1, b: 2, c: 3 }>()
  })

  vi.it('〖⛳️〗‹‹‹ ❲hom❳: 5+ keys', () => {
    const actual = hom([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f'
    ])(1 as const)
      (2 as const)
      (3 as const)
      (4 as const)
      (5 as const)
      (6 as const)

    const expected = {
      a: 1 as const,
      b: 2 as const,
      c: 3 as const,
      d: 4 as const,
      e: 5 as const,
      f: 6 as const,
    }

    vi.assert.deepEqual(actual, expected)
    vi.expectTypeOf(actual).toEqualTypeOf<typeof expected>()
  })
})
