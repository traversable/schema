import * as vi from 'vitest'
import { JsonSchemaTest } from '@traversable/json-schema-test'
import * as fc from 'fast-check'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/json-schema-test❳', () => {
  vi.test('〖️⛳️〗› ❲JsonSchemaTest.SeedGenerator❳: number', () => {
    vi.expect.soft(
      fc.sample(
        JsonSchemaTest.SeedGenerator({
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

  vi.test('〖️⛳️〗› ❲JsonSchemaTest.SeedGenerator❳: string', () => {
    vi.expect.soft(
      fc.sample(
        JsonSchemaTest.SeedGenerator({
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


  vi.test('〖️⛳️〗› ❲JsonSchemaTest.SeedGenerator❳: array', () => {
    vi.expect.soft(
      fc.sample(
        JsonSchemaTest.SeedGenerator({
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

  vi.test('〖️⛳️〗› ❲JsonSchemaTest.SeedGenerator❳: array', () => {
    const Builder = JsonSchemaTest.SeedGenerator({
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
