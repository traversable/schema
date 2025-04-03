import * as vi from 'vitest'
import { omitWhere } from '@traversable/registry'


vi.it('〖⛳️〗› ❲omitWhere❳', () => {
  let ex_01 = { a: 1, b: 2, c: () => false } as const
  vi.assert.hasAllKeys(omitWhere(ex_01, (x) => typeof x === 'function'), ['a', 'b'])
  vi.assert.doesNotHaveAnyKeys(omitWhere(ex_01, (x) => typeof x === 'function'), ['c'])
  vi.assert.hasAllKeys(omitWhere(ex_01, (x) => typeof x === 'number'), ['c'])
  vi.assert.doesNotHaveAnyKeys(omitWhere(ex_01, (x) => typeof x === 'number'), ['a', 'b'])
})
