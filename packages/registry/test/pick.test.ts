import * as vi from 'vitest'
import { pickWhere } from '@traversable/registry'

vi.it('〖⛳️〗› ❲pickWhere❳', () => {
  let ex_01 = { a: 1, b: 2, c: () => false } as const
  vi.assert.hasAllKeys(pickWhere(ex_01, (x) => typeof x === 'function'), ['c'])
  vi.assert.doesNotHaveAnyKeys(pickWhere(ex_01, (x) => typeof x === 'function'), ['a', 'b'])
  vi.assert.hasAllKeys(pickWhere(ex_01, (x) => typeof x === 'number'), ['a', 'b'])
  vi.assert.doesNotHaveAnyKeys(pickWhere(ex_01, (x) => typeof x === 'number'), ['c'])
})
