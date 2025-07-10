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

  vi.test('〖⛳️〗› ❲z.prefault❳: throws', async () => {
    await vi.expect((async () => await zx.equals(z.prefault(z.any(), {})))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.default❳: throws', async () => {
    await vi.expect((async () => await zx.equals(z._default(z.any(), {})))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.success❳: throws', async () => {
    await vi.expect((async () => await zx.equals(z.success(z.any())))()).rejects.toThrowError()
  })
})
