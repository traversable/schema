import * as vi from 'vitest'
import { z } from 'zod/v4'

import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.equals (unsupported schemas)', async () => {
  vi.test('〖⛳️〗› ❲z.custom❳: throws', async () => {
    await vi.expect((async () => await zx.equals(z.custom()))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.promise❳: throws', async () => {
    await vi.expect((async () => await zx.equals(z.promise(z.any())))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.transform❳: throws', async () => {
    await vi.expect((async () => await zx.equals(z.transform(() => {})))()).rejects.toThrowError()
  })
})
