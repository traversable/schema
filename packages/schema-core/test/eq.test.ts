import * as vi from 'vitest'
import { t } from '@traversable/schema-core'

type Sym = typeof Sym
const Sym = Symbol.for('abc')

const REF = {
  EmptyArray: [],
  EmptyObject: {},
  SingletonObject: { '': void 0 },
  SingletonArray: [void 0],
  Symbol: Sym,
} as const

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('〖⛳️〗› ❲t.eq❳: example-based tests', () => {
    // FAILURE
    vi.assert.isFalse(t.eq(undefined)(null))
    vi.assert.isFalse(t.eq(null)(undefined))
    vi.assert.isFalse(t.eq(Symbol())(undefined))
    vi.assert.isFalse(t.eq(false)(undefined))
    vi.assert.isFalse(t.eq(0n)(undefined))
    vi.assert.isFalse(t.eq(0)(undefined))
    vi.assert.isFalse(t.eq('')(undefined))
    vi.assert.isFalse(t.eq([])(undefined))
    vi.assert.isFalse(t.eq({})(undefined))
    vi.assert.isFalse(t.eq(Symbol())(Symbol()))
    vi.assert.isFalse(t.eq(Sym)(Symbol()))

    // SUCCESS
    vi.assert.isTrue(t.eq(undefined)(undefined))
    vi.assert.isTrue(t.eq(null)(null))
    vi.assert.isTrue(t.eq(Sym)(Sym))
    vi.assert.isTrue(t.eq(false)(false))
    vi.assert.isTrue(t.eq(0n)(0n))
    vi.assert.isTrue(t.eq(0)(0))
    vi.assert.isTrue(t.eq('')(''))

    vi.assert.isTrue(t.eq([])([]))
    vi.assert.isTrue(t.eq(REF.EmptyArray)(REF.EmptyArray))
    vi.assert.isTrue(t.eq([])(REF.EmptyArray))
    vi.assert.isTrue(t.eq(REF.EmptyArray)([]))
    vi.assert.isTrue(t.eq([void 0])([void 0]))
    vi.assert.isTrue(t.eq(REF.SingletonArray)(REF.SingletonArray))
    vi.assert.isTrue(t.eq([void 0])(REF.SingletonArray))
    vi.assert.isTrue(t.eq(REF.SingletonArray)([void 0]))

    vi.assert.isTrue(t.eq({})({}))
    vi.assert.isTrue(t.eq(REF.EmptyObject)(REF.EmptyObject))
    vi.assert.isTrue(t.eq({})(REF.EmptyObject))
    vi.assert.isTrue(t.eq(REF.EmptyObject)({}))

    vi.assert.isTrue(t.eq({ '': void 0 })({ '': void 0 }))
    vi.assert.isTrue(t.eq(REF.SingletonObject)(REF.SingletonObject))
    vi.assert.isTrue(t.eq({ '': void 0 })(REF.SingletonObject))
    vi.assert.isTrue(t.eq(REF.SingletonObject)({ '': void 0 }))
  })

  vi.it('〖⛳️〗› ❲t.eq❳: supports passing a custom equals function', () => {
    const isGoku = t.eq((x: number) => x > 9000)
    vi.assert.isFalse(isGoku(9000))
    vi.assert.isTrue(isGoku(9001))
    vi.assertType<t.eq<number>>(isGoku)

    const isJanet = t.eq((x: { firstName: string }) => x.firstName === 'Janet')
    //    ^? const isJanet: t.eq<{ firstName: string }>
    vi.assert.isFalse(isJanet({ firstName: 'Bill' }))
    vi.assert.isFalse(isJanet(9000))
    vi.assert.isTrue(isJanet({ firstName: 'Janet' }))
    vi.assertType<t.eq<{ firstName: string }>>(isJanet)
  })
})
