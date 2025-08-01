import * as vi from 'vitest'
import { z } from 'zod'

import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.deepEqual.classic (unsupported schemas)', async () => {
  vi.test('〖⛳️〗› ❲z.promise❳: throws', async () => {
    await vi.expect((async () => await zx.deepEqual.classic(z.promise(z.any())))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.transform❳: throws', async () => {
    await vi.expect((async () => await zx.deepEqual.classic(z.transform(() => {})))()).rejects.toThrowError()
  })
})
