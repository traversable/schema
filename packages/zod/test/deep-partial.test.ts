import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepPartial❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepPartial(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepPartial❳: preserves structure of original schema', () => {
    // #382 https://github.com/traversable/schema/issues/382
    const AccessLevel = z.strictObject({
      _id: z.string().regex(/^[a-f\d]{24}$/),
      description: z.string().min(1).optional(),
      name: z.string().min(1),
      tags: z.array(z.string().min(1)).optional()
    })

    const deepPartial = zx.deepPartial(AccessLevel)

    vi.assert.doesNotThrow(() =>
      deepPartial.parse({
        '_id': '5c7589dd5800719820e7b874',
        'description': 'ContactMethodTypesLoad_Description',
        'name': 'api/contactmethodtypes/load',
        'tags': ['API', 'ContactMethodType', 'Load']
      })
    )
  })
})
