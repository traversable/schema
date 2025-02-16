import * as vi from 'vitest'

import { Predicate } from '@traversable/guard'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/guard/predicates❳', () => {
  vi.it('〖⛳️〗› ❲Predicate.parseArgs❳', () => {
    const qs = [() => true, () => false] as const satisfies [any, any]
    const ex_01 = Predicate.parseArgs({}, [])
    const ex_02 = Predicate.parseArgs({ abc: 123 }, qs)
    const ex_03 = Predicate.parseArgs(
      { abc: 123 as const, def: false as const },
      [() => true, () => false, { abc: 0 as const, ghi: 'hey' as const }]
    )

    vi.assert.deepEqual(ex_01, [[], {}])
    vi.assertType<[[], {}]>(ex_01)

    vi.assert.isFunction(ex_02[0][0])
    vi.assert.isFunction(ex_02[0][1])
    vi.assert.deepEqual(ex_02[1], { abc: 123 })
    vi.assertType<[[() => boolean, () => boolean], { abc: number }]>(ex_02)

    vi.assert.isFunction(ex_03[0][0])
    vi.assert.isFunction(ex_03[0][1])
    vi.assert.deepEqual(ex_03[1], { abc: 0 as never, ...({ ghi: 'hey' } as {}), def: false })
    vi.assert.deepEqual(ex_03[1], { abc: 0 as never, ...({ ghi: 'hey' } as {}), def: false })
  })
})