import * as vi from 'vitest'

import { Object_entries } from '@traversable/registry'

let x: any = {}

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳: globalThis', () => {
  vi.it('〖⛳️〗‹‹‹ ❲Object_entries❳: typelevel tests', () => {
    let unknownEntry = [String(), Array.of()[0]] as const satisfies [any, any]
    let optionalEntry: [string, _?: unknown] = unknownEntry

    vi.expectTypeOf(Object_entries(x as object)).toEqualTypeOf(Array.of(unknownEntry))
    vi.expectTypeOf(Object_entries({})).toEqualTypeOf(Array.of(optionalEntry))
    vi.expectTypeOf(Object_entries({ [String()]: 1 as const })).toEqualTypeOf(Array.of([String(), 1 as const] satisfies [any, any]))
    vi.expectTypeOf(Object_entries({ a: 3, b: 4 })).toEqualTypeOf(Array.of<[k: "a", v: 3] | [k: "b", v: 4]>())
    vi.expectTypeOf(Object_entries([[1, 2], [3, 4]])).toEqualTypeOf(Array.of<[k: "0", v: [1, 2]] | [k: "1", v: [3, 4]]>())
    vi.expectTypeOf(Object_entries(Array.of(4 as const))).toEqualTypeOf(Array.of<[k: `${number}`, v: 4]>())
    vi.expectTypeOf(Object_entries({ [String()]: 5 as const })).toEqualTypeOf(Array.of<[k: string, v: 5]>())
    vi.expectTypeOf(Object_entries({ [Number()]: 6 as const })).toEqualTypeOf(Array.of<[k: string | number, v: 6]>())
    vi.expectTypeOf(Object_entries({ [Symbol()]: 7 })).toEqualTypeOf(Array.of<[k: symbol, v: 7]>())
    vi.expectTypeOf(Object_entries(Object.assign({} as Record<string, 9000>, Array.of(Boolean()))))
      .toEqualTypeOf(Array.of<[k: string, v: 9000] | [k: `${number}`, v: boolean]>())
    vi.expectTypeOf(Object_entries(Object.assign([1, 2, 3] as const, { a: 4, b: 5, c: 6 } as const)))
      .toEqualTypeOf(Array.of<[k: "0", v: 1] | [k: "1", v: 2] | [k: "2", v: 3]>())
  })
})
