import * as vi from 'vitest'
import { z } from 'zod/v4'

import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳: zx.equals.classic (unsupported schemas)', async () => {
  vi.test('〖⛳️〗› ❲z.custom❳: throws', async () => {
    await vi.expect((async () => await zx.equals.classic(z.custom()))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.promise❳: throws', async () => {
    await vi.expect((async () => await zx.equals.classic(z.promise(z.any())))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.transform❳: throws', async () => {
    await vi.expect((async () => await zx.equals.classic(z.transform(() => {})))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.prefault❳: throws', async () => {
    await vi.expect((async () => await zx.equals.classic(z.prefault(z.any(), {})))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.default❳: throws', async () => {
    await vi.expect((async () => await zx.equals.classic(z._default(z.any(), {})))()).rejects.toThrowError()
  })

  vi.test('〖⛳️〗› ❲z.success❳: throws', async () => {
    await vi.expect((async () => await zx.equals.classic(z.success(z.any())))()).rejects.toThrowError()
  })
})
