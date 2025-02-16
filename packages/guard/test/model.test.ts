import * as vi from 'vitest'

import { M, URI } from '@traversable/guard'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/guard/model❳', () => {
  vi.it('〖⛳️〗› ❲Model❳', () => {
    const schema_01 = M.Array(M.String)
    vi.assert.equal(schema_01.tag, URI.array)
    vi.assert.equal(typeof schema_01.def, 'function')
    vi.assert.equal(schema_01.def.tag, URI.string)
    vi.assert.equal(schema_01.def.def, '')
    vi.assert.isFalse(schema_01(''))
    vi.assert.isTrue(schema_01([]))
    vi.assert.isTrue(schema_01(['']))

    const schema_02 = M.Optional(M.Number)
    vi.assert.equal(schema_02.tag, URI.optional)
    vi.assert.equal(typeof schema_02.def, 'function')
    vi.assert.equal(schema_02.def.tag, URI.number)
    vi.assert.equal(schema_02.def.def, 0)
    vi.assert.isFalse(schema_02(''))
    vi.assert.isFalse(schema_02([]))
    vi.assert.isTrue(schema_02(void 0))
    vi.assert.isTrue(schema_02(0))

    const schema_03 = M.Object({ a: M.Number, b: M.Optional(M.String) })
    vi.assert.equal(schema_03.tag, URI.object)
    vi.assert.equal(typeof schema_03.def, 'object')
    vi.assert.equal(schema_03.def.a.tag, URI.number)
    vi.assert.equal(schema_03.def.b.tag, URI.optional)

    vi.assert.isFalse(schema_03(''))
    vi.assert.isFalse(schema_03([]))
    vi.assert.isFalse(schema_03({}))
    vi.assert.isFalse(schema_03({ b: void 0 }))
    vi.assert.isFalse(schema_03({ a: 0, b: false }))
    vi.assert.isTrue(schema_03({ a: 1, b: void 0 }))
    vi.assert.isTrue(schema_03({ a: 1, b: 'hi' }))


    vi.assertType<M.Object<{ a: M.Number, b: M.Optional<M.String> }>>(schema_03)

  })
})

