import * as vi from 'vitest'

import { M, URI, type TypeError } from '@traversable/guard'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/guard/model❳', () => {
  vi.it('〖⛳️〗› ❲Model❳', () => {
    vi.assertType<M.Tuple<[]>>(M.Tuple())
    vi.assertType<M.typeof<M.Tuple<[]>>>(M.Tuple()._type)
    vi.assertType<M.Tuple<[M.Never]>>(M.Tuple(M.Never))
    vi.assertType<M.Tuple<[M.Unknown]>>(M.Tuple(M.Unknown))
    vi.assertType<M.Tuple<[M.String]>>(M.Tuple(M.String))
    vi.assertType<M.typeof<M.Tuple<[M.String]>>>(M.Tuple(M.String)._type)
    vi.assertType<M.Object<{ a: M.Tuple<[M.String]> }>>(M.Object({ a: M.Tuple(M.String) }))

    const schema_01 = M.Array(M.String)
    vi.assert.equal(schema_01.tag, URI.array)
    vi.assert.isFunction(schema_01.def)
    vi.assert.equal(schema_01.def.tag, URI.string)
    vi.assert.equal(schema_01.def.def, '')
    vi.assert.isFalse(schema_01(''))
    vi.assert.isTrue(schema_01([]))
    vi.assert.isTrue(schema_01(['']))

    const schema_02 = M.Optional(M.Number)
    vi.assert.equal(schema_02.tag, URI.optional)
    vi.assert.isFunction(schema_02.def)
    vi.assert.equal(schema_02.def.tag, URI.number)
    vi.assert.equal(schema_02.def.def, 0)
    vi.assert.isFalse(schema_02(''))
    vi.assert.isFalse(schema_02([]))
    vi.assert.isTrue(schema_02(void 0))
    vi.assert.isTrue(schema_02(0))


    const schema_03 = M.Object({})
    vi.assert.equal(schema_03.tag, URI.object)
    vi.assert.isObject(schema_03.def)
    vi.assert.lengthOf(Object.keys(schema_03.def), 0)

    const schema_04 = M.Object({ a: M.Number, b: M.Optional(M.String) })
    vi.assert.equal(schema_04.tag, URI.object)
    vi.assert.isObject(schema_04.def)
    vi.assert.equal(schema_04.def.a.tag, URI.number)
    vi.assert.equal(schema_04.def.b.tag, URI.optional)
    // FAILURE
    vi.assert.isFalse(schema_04(''))
    vi.assert.isFalse(schema_04([]))
    vi.assert.isFalse(schema_04({}))
    vi.assert.isFalse(schema_04({ b: void 0 }))
    vi.assert.isFalse(schema_04({ a: 0, b: false }))
    // SUCCESS
    vi.assert.isTrue(schema_04({ a: 1, b: void 0 }))
    vi.assert.isTrue(schema_04({ a: 1, b: 'hi' }))

    vi.assertType<M.InvalidSchema<TypeError<'A required element cannot follow an optional element.'>>>(
      M.Tuple(
        M.Any,
        M.Optional(M.Any),
        /* @ts-expect-error */
        M.Number
      )
    )

    vi.assertType<M.Object<{ x: M.InvalidSchema<TypeError<'A required element cannot follow an optional element.'>> }>>(
      M.Object({
        x: M.Tuple(
          M.Any,
          M.Optional(M.Any),
          /* @ts-expect-error */
          M.Number
        ),
      })
    )

    const schema_05 = M.Tuple()
    vi.assert.equal(schema_05.tag, URI.tuple)
    vi.assert.isArray(schema_05.def)
    vi.assert.lengthOf(schema_05.def, 0)
    // FAILURE
    vi.assert.isFalse(schema_05({}))
    vi.assert.isFalse(schema_05([void 0]))
    // SUCCESS
    vi.assert.isTrue(schema_05([]))

    const schema_06 = M.Tuple(M.String)
    vi.assert.equal(schema_06.tag, URI.tuple)
    vi.assert.isArray(schema_06.def)
    vi.assert.lengthOf(schema_06.def, 1)
    vi.assert.equal(schema_06.def[0].tag, URI.string)
    vi.assert.equal(schema_06.def[0].def, '')
    // FAILURE
    vi.assert.isFalse(schema_06({}))
    vi.assert.isFalse(schema_06([]))
    vi.assert.isFalse(schema_06([void 0]))
    // SUCCESS
    vi.assert.isTrue(schema_06(['hi']))

    const schema_07 = M.Tuple(M.Any, M.Optional(M.Boolean), M.Optional(M.Number))
    vi.assert.equal(schema_07.tag, URI.tuple)
    vi.assert.isArray(schema_07.def)
    vi.assert.lengthOf(schema_07.def, 3)
    vi.assert.equal(schema_07.def[0].tag, URI.any)
    vi.assert.equal(schema_07.def[0].def, void 0)
    vi.assert.equal(schema_07.def[1].tag, URI.optional)
    vi.assert.equal(schema_07.def[1].def.tag, URI.boolean)
    vi.assert.equal(schema_07.def[1].def.def, false)
    vi.assert.equal(schema_07.def[2].tag, URI.optional)
    vi.assert.equal(schema_07.def[2].def.tag, URI.number)
    vi.assert.equal(schema_07.def[2].def.def, 0)

    // FAILURE
    vi.assert.isFalse(schema_07({}))
    vi.assert.isFalse(schema_07([]))
    vi.assert.isFalse(schema_07([void 0, void 0, void 0, void 0]))
    vi.assert.isFalse(schema_07([1, 'true', 0]))
    vi.assert.isFalse(schema_07([1, false, '0']))
    // SUCCESS
    vi.assert.isTrue(schema_07([void 0]))
    vi.assert.isTrue(schema_07([1]))
    vi.assert.isTrue(schema_07([1, false, 0]))

    const schema_08 = M.Record(M.BigInt)
    vi.assert.equal(schema_08.tag, URI.record)
    vi.assert.isFunction(schema_08.def)
    vi.assert.equal(schema_08.def.tag, URI.bigint)
    vi.assert.equal(schema_08.def.def, 0n)
    // FAILURE
    vi.assert.isFalse(schema_08(''))
    vi.assert.isFalse(schema_08([]))
    vi.assert.isFalse(schema_08({ a: 0 }))
    // SUCCESS
    vi.assert.isTrue(schema_08({}))
    vi.assert.isTrue(schema_08({ a: 1n }))

    const schema_09 = M.Intersect(M.Object({ a: M.Number }), M.Object({ b: M.String }))
    vi.assert.equal(schema_09.tag, URI.intersect)
    vi.assert.isArray(schema_09.def)
    vi.assert.isFunction(schema_09.def[0])
    vi.assert.equal(schema_09.def[0].tag, URI.object)
    vi.assert.equal(schema_09.def[0].def.a.tag, URI.number)
    vi.assert.isFunction(schema_09.def[1])
    vi.assert.equal(schema_09.def[1].tag, URI.object)
    vi.assert.equal(schema_09.def[1].def.b.tag, URI.string)
    // FAILURE
    vi.assert.isFalse(schema_09([]))
    vi.assert.isFalse(schema_09({}))
    vi.assert.isFalse(schema_09({ a: 0 }))
    vi.assert.isFalse(schema_09({ b: 0 }))
    vi.assert.isFalse(schema_09({ a: 0, b: 0 }))
    vi.assert.isFalse(schema_09({ a: '', b: '' }))
    // SUCCESS
    vi.assert.isTrue(schema_09({ a: 0, b: '' }))
    vi.assert.isTrue(schema_09({ a: 0, b: '', c: 'excess is ok' }))
  })
})

