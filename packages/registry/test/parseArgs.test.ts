import * as vi from 'vitest'

import { parseArgs } from '@traversable/registry'

type SchemaOptions = {
  optionalTreatment?: unknown
  treatArraysAsObjects?: unknown
  eq: {}
}

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳', () => {
  vi.test('〖⛳️〗› ❲parseArgs❳', () => {
    const qs = [() => true, () => false] as const satisfies [any, any]

    const fallbacks_01 = {
      optionalTreatment: 'treatUndefinedAndOptionalAsTheSame',
      treatArraysAsObjects: false,
      eq: {}
    } satisfies Required<SchemaOptions>
    const ex_01 = parseArgs(fallbacks_01, [])

    const fallbacks_02 = {
      optionalTreatment: 'presentButUndefinedIsOK',
      treatArraysAsObjects: true,
      eq: {}
    } satisfies Required<SchemaOptions>
    const ex_02 = parseArgs(fallbacks_02, qs)

    const fallbacks_03 = {
      optionalTreatment: 'presentButUndefinedIsOK',
      treatArraysAsObjects: true,
      eq: {}
    } satisfies Required<SchemaOptions>
    const ex_03 = parseArgs(
      fallbacks_03,
      [() => true, () => false, { optionalTreatment: 'exactOptional' }]
    )

    vi.assert.deepEqual(ex_01, [[], fallbacks_01])
    vi.assert.isFunction(ex_02[0][0])
    vi.assert.isFunction(ex_02[0][1])
    vi.assert.deepEqual(ex_02[1], fallbacks_02)
    vi.assert.isFunction(ex_03[0][0])
    vi.assert.isFunction(ex_03[0][1])
    vi.assert.deepEqual(ex_03[1], { optionalTreatment: 'exactOptional', treatArraysAsObjects: true, eq: {} })

    vi.assertType<[[], typeof fallbacks_01]>(ex_01)
    vi.assertType<[[() => boolean, () => boolean], typeof fallbacks_02]>(ex_02)
    vi.assertType<[((_: never) => unknown)[], typeof fallbacks_02]>(ex_03)
  })
})
