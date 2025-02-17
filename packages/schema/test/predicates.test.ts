import * as vi from 'vitest'

import { Predicate } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/guard/predicates❳', () => {
  vi.it('〖⛳️〗› ❲Predicate.parseArgs❳', () => {
    const qs = [() => true, () => false] as const satisfies [any, any]

    const fallbacks_01 = {
      optionalTreatment: 'treatUndefinedAndOptionalAsTheSame',
      treatArraysAsObjects: false
    } satisfies Required<Predicate.object$.Options>

    const ex_01 = Predicate.parseArgs(
      fallbacks_01,
      []
    )

    const fallbacks_02 = {
      optionalTreatment: 'presentButUndefinedIsOK',
      treatArraysAsObjects: true,
    } satisfies Required<Predicate.object$.Options>

    const ex_02 = Predicate.parseArgs(
      fallbacks_02,
      qs
    )

    const fallbacks_03 = {
      optionalTreatment: 'presentButUndefinedIsOK',
      treatArraysAsObjects: true
    } satisfies Required<Predicate.object$.Options>

    const ex_03 = Predicate.parseArgs(
      fallbacks_03,
      [() => true, () => false, { optionalTreatment: 'exactOptional' }]
    )

    vi.assert.deepEqual(ex_01, [[], fallbacks_01])
    vi.assertType<[[], typeof fallbacks_01]>(ex_01)

    vi.assert.isFunction(ex_02[0][0])
    vi.assert.isFunction(ex_02[0][1])
    vi.assert.strictEqual(ex_02[1], fallbacks_02)
    vi.assertType<[[() => boolean, () => boolean], typeof fallbacks_02]>(ex_02)

    vi.assert.isFunction(ex_03[0][0])
    vi.assert.isFunction(ex_03[0][1])
    vi.assert.deepEqual(ex_03[1], { optionalTreatment: 'exactOptional', treatArraysAsObjects: true })
    vi.assertType<[((_: never) => boolean)[], typeof fallbacks_02]>(ex_03)
  })
})