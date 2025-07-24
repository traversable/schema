import * as vi from 'vitest'
import { z } from 'zod'

import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.deepEqual.classic (unsupported schemas)', async () => {
  vi.test('〖⛳️〗› ❲z.custom❳: throws', async () => {
    await vi.expect((async () => await zx.deepEqual.classic(z.custom()))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.promise❳: throws', async () => {
    await vi.expect((async () => await zx.deepEqual.classic(z.promise(z.any())))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.transform❳: throws', async () => {
    await vi.expect((async () => await zx.deepEqual.classic(z.transform(() => {})))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.prefault❳: throws', async () => {
    await vi.expect((async () => await zx.deepEqual.classic(z.prefault(z.any(), {})))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.default❳: throws', async () => {
    await vi.expect((async () => await zx.deepEqual.classic(z._default(z.any(), {})))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.success❳: throws', async () => {
    await vi.expect((async () => await zx.deepEqual.classic(z.success(z.any())))()).rejects.toThrowError()
  })
})
