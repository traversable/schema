import * as vi from 'vitest'
import { vxTest } from '@traversable/valibot-test'
import * as fc from 'fast-check'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/zod-test❳', () => {
  vi.test('〖️⛳️〗› ❲vxTest.SeedGenerator❳: bigint', () => {
    vi.expect.soft(
      fc.sample(
        vxTest.SeedGenerator({
          include: ['bigint'],
          bigint: { unbounded: true }
        })['bigint'],
        1,
      )[0]
    ).toMatchInlineSnapshot
      (`
      [
        150,
        [
          null,
          null,
          null,
        ],
      ]
    `)
  })

  vi.test('〖️⛳️〗› ❲vxTest.SeedGenerator❳: number', () => {
    vi.expect.soft(
      fc.sample(
        vxTest.SeedGenerator({
          include: ['number'],
          number: { unbounded: true }
        })['number'],
        1,
      )[0]
    ).toMatchInlineSnapshot
      (`
      [
        200,
        [
          null,
          null,
          null,
          false,
          false,
        ],
      ]
    `)
  })

  vi.test('〖️⛳️〗› ❲vxTest.SeedGenerator❳: string', () => {
    vi.expect.soft(
      fc.sample(
        vxTest.SeedGenerator({
          include: ['string'],
          string: { unbounded: true }
        })['string'],
        1,
      )[0]
    ).toMatchInlineSnapshot
      (`
      [
        250,
        [
          null,
          null,
        ],
      ]
    `)
  })
})
