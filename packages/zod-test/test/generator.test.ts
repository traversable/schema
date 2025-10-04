import * as vi from 'vitest'
import * as fc from 'fast-check'
import { zxTest } from '@traversable/zod-test'

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

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/zod-test❳: type-level tests', () => {
  vi.test('〖️⛳️〗› ❲zxTest.SeedGenerator❳: Builder["*"] return type', () => {
    vi.expectTypeOf(zxTest.SeedGenerator()['*']).toEqualTypeOf<
      fc.Arbitrary<
        | [10]
        | [15]
        | [20]
        | [25]
        | [30]
        | [35]
        | [40]
        | [45]
        | [50]
        | [55]
        | [60]
        | [100, zxTest.Bounds.int]
        | [150, zxTest.Bounds.bigint]
        | [200, zxTest.Bounds.number]
        | [250, zxTest.Bounds.string]
        | [500, any]
        | [550, string | number | bigint | boolean]
        | zxTest.Seed.Seed.TemplateLiteral
        | [1000, unknown, zxTest.Bounds.array]
        | [1500, unknown]
        | [2000, unknown]
        | [2500, unknown]
        | [3000, unknown]
        | [3500, unknown]
        | [4000, unknown]
        | [5000, unknown]
        | [5500, unknown]
        | [5600, unknown]
        | [6000, [[7500, [string, unknown][]], [7500, [string, unknown][]]]]
        | [6500, [unknown, unknown]]
        | [7000, unknown]
        | [7500, [string, unknown][]]
        | [8000, unknown[]]
        | [8500, unknown[]]
        | [9000, [unknown, unknown]]
        | [9500, unknown]
        | [10000, unknown]
        | [10500, () => unknown]
        | [100000, unknown]
      >
    >()
  })
})

