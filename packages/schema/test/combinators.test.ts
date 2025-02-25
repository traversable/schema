import * as vi from 'vitest'

import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/schema❳', () => {
  vi.it('t.json', () => {
    // vi.assert.isFalse(t.json.of({ includeUndefined: false })(undefined))

    // vi.assert.isTrue(t.json()(null))
    // vi.assert.isTrue(t.json()(undefined))
    // vi.assert.isTrue(t.json()(''))
    // vi.assert.isTrue(t.json()(0))
    // vi.assert.isTrue(t.json()({}))
    // vi.assert.isTrue(t.json()([]))

    // vi.assert.isTrue(t.json({ a: 1 })({ a: 1 }))
    // vi.assert.isTrue(t.json({ a: 1, b: void 0 })({ a: 1, b: void 0 }))

    // vi.assert.isFalse(t.json()(() => new Date()))
    // vi.assert.isFalse(t.json({ a: 1, b: 2 })({ a: 1 }))
    // vi.assert.isFalse(t.json({ a: 1, b: void 0 })({ a: 1 }))
    // vi.assert.isFalse(t.json({ a: 1, b: void 0 })({ a: 1, b: null }))

    type Circular_1 = { a: 1, b: { c: Circular_1 } }
    type Circular_2 = { d: 2, e: { f: Circular_2 } }
    let circular_1: Circular_1 = { a: 1 } as never
    circular_1.b = { c: circular_1 }
    let circular_2: Circular_2 = { d: 2 } as never
    circular_2.e = { f: circular_2 }


    // const x = { x: 1 } as const
    // vi.assert.isTrue(t.json(x)(x))
    // vi.assert.isTrue(t.json(circular_1)(circular_2))
  })
})
