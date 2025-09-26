import * as vi from 'vitest'
import { zxTest } from '@traversable/zod-test'
import * as fc from 'fast-check'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/zod-test❳', () => {
  vi.test('〖️⛳️〗› ❲zxTest.SeedGenerator❳: int', () => {
    vi.expect.soft(
      fc.sample(
        zxTest.SeedGenerator({
          include: ['int'],
          int: { unbounded: true }
        })['int'],
        1,
      )[0]
    ).toMatchInlineSnapshot
      (`
      [
        100,
        [
          null,
          null,
          null,
        ],
      ]
    `)
  })

  vi.test('〖️⛳️〗› ❲zxTest.SeedGenerator❳: bigint', () => {
    vi.expect.soft(
      fc.sample(
        zxTest.SeedGenerator({
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

  vi.test('〖️⛳️〗› ❲zxTest.SeedGenerator❳: number', () => {
    vi.expect.soft(
      fc.sample(
        zxTest.SeedGenerator({
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

  vi.test('〖️⛳️〗› ❲zxTest.SeedGenerator❳: string', () => {
    vi.expect.soft(
      fc.sample(
        zxTest.SeedGenerator({
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

  vi.test('〖️⛳️〗› ❲zxTest.SeedGenerator❳: array', () => {
    vi.expect.soft(
      fc.sample(
        zxTest.SeedGenerator({
          include: ['never', 'array'],
          array: { unbounded: true },
        })['array'],
        1,
      )[0][2]
    ).toMatchInlineSnapshot
      (`
      [
        null,
        null,
      ]
    `)
  })

  vi.test('〖️⛳️〗› ❲zxTest.SeedGenerator❳: array', () => {
    const Builder = zxTest.SeedGenerator({
      include: ['never', 'array'],
      array: { unbounded: true },
    })

    const [seed] = fc.sample(Builder.array, 1)

    vi.expect.soft(
      seed[0]
    ).toMatchInlineSnapshot
      (`1000`)

    vi.expect((seed[1] as any)[0]).toBeOneOf([
      35,  // byTag.never
      1000 // byTag.array
    ])

    vi.expect.soft(
      seed[2]
    ).toMatchInlineSnapshot
      (`
      [
        null,
        null,
      ]
    `)
  })
})
