import * as vi from 'vitest'

import { parseKey } from '@traversable/registry'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳: merge', () => {
  vi.it('〖⛳️〗‹‹‹ ❲parseKey❳', () => {
    vi.expect(parseKey('`abc`')).toMatchInlineSnapshot(`"\`abc\`"`)
  })
})