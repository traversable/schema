import * as vi from 'vitest'
import { t } from '@traversable/schema'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/schema-to-string❳', () => {
  vi.it('〖⛳️〗› ❲pre-install❳', () => {
    // vi.expect.soft(t.string.toString()).toMatchInlineSnapshot(`"t.string"`)
    vi.assert.doesNotHaveAnyKeys(t.string, ['toType'])
  })

  vi.it('〖⛳️〗› ❲pre-install❳', () => {
    import('@traversable/schema-to-string/install')
      .then(() => vi.assert.equal(t.string.toType(), 'string'))
      .catch((e) => vi.assert.fail(e.message))
  })
})
