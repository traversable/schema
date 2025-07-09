import * as vi from 'vitest'
import { z } from 'zod/v4'

import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: unsupported schemas', async () => {
  vi.test('〖⛳️〗› ❲z.custom❳: throws', async () => {
    await vi.expect((async () => await zx.toType(z.custom()))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.transform❳: throws', async () => {
    await vi.expect((async () => await zx.toType(z.transform(() => {})))()).rejects.toThrowError()
  })
})
