import * as vi from 'vitest'

import { Codec } from '@traversable/derive-codec'
import { t } from '@traversable/schema-core'

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/derive-codec❳', () => {
  vi.it('〖⛳️〗› ❲Codec❳', () => {
    type ServerUser = t.typeof<typeof ServerUser>
    const ServerUser = t.object({
      createdAt: t.string,
      updatedAt: t.string,
    })

    type ClientUser = {
      id: number
      createdAt: Date
      updatedAt: Date
    }

    const id = 0
    const createdAt = new Date(2021, 0, 31)
    const updatedAt = new Date()

    const clientUser = {
      id,
      createdAt,
      updatedAt,
    } satisfies ClientUser

    const serverResponse = [{
      data: {
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
      }
    }] satisfies [any]

    const codec_01 = Codec
      .new(ServerUser)
      .extend(({ data }: { data: ServerUser }) => data)
      .unextend((_) => ({ data: _ }))
      .extend(([_]: [{ data: ServerUser }]) => _)
      .unextend((_) => [_])
      .pipe(($) => ({ ...$, id }))
      .unpipe(({ id, ...$ }) => $)
      .pipe(($) => ({ ...$, createdAt: new Date($.createdAt), updatedAt: new Date($.updatedAt) }))
      .unpipe(($) => ({ ...$, createdAt: $.createdAt.toISOString(), updatedAt: $.updatedAt.toISOString() }))

    vi.assert.deepEqual(codec_01.decode(serverResponse), clientUser)
    vi.assert.deepEqual(codec_01.encode(codec_01.decode(serverResponse)), serverResponse)
    vi.assert.deepEqual(codec_01.decode(codec_01.encode(codec_01.decode(serverResponse))), clientUser)
    vi.assert.deepEqual(codec_01.encode(codec_01.decode(codec_01.encode(codec_01.decode(serverResponse)))), serverResponse)
  })
})
