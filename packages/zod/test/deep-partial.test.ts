import * as vi from 'vitest'
import { z } from 'zod'
import { zx } from '@traversable/zod'

vi.describe('〖⛳️〗‹‹‹ ❲@traversable/zod❳', () => {
  vi.test('〖⛳️〗› ❲zx.deepPartial❳: throws given a circular schema', () => {
    const Circular = z.object({ get a() { return Circular } })
    vi.assert.throws(() => zx.deepPartial(Circular), 'Circular schema detected')
  })

  vi.test('〖⛳️〗› ❲zx.deepPartial❳: preserves structure of original schema', () => {
    // #382 https://github.com/traversable/schema/issues/382
    const AccessLevel = z.strictObject({
      _id: z.string().regex(/^[a-f\d]{24}$/),
      description: z.string().min(1).optional(),
      name: z.string().min(1),
      tags: z.array(z.string().min(1)).optional()
    })

    const deepPartial_01 = zx.deepPartial(AccessLevel)

    vi.assert.doesNotThrow(() =>
      deepPartial_01.parse({
        '_id': '5c7589dd5800719820e7b874',
        'description': 'ContactMethodTypesLoad_Description',
        'name': 'api/contactmethodtypes/load',
        'tags': ['API', 'ContactMethodType', 'Load']
      })
    )

    // #385 https://github.com/traversable/schema/issues/385
    const Organization = z.object({
      name: z.string(),
      type: z.literal('organization')
    })

    const Individual = z.object({
      name: z.object({
        firstName: z.string(),
        lastName: z.string()
      }),
      type: z.literal('individual')
    })

    const Entity = z.union([Individual, Organization])

    const deepPartial_02 = zx.deepPartial(Entity, 'applyToOutputType')

    vi.assert.doesNotThrow(() =>
      deepPartial_02.parse({
        type: 'individual',
        name: {
          firstName: 'Tyrone',
          lastName: 'Slothrop',
        }
      })
    )

    // #388 https://github.com/traversable/schema/issues/388
    vi.assert.doesNotThrow(() =>
      deepPartial_02.parse({})
    )

    vi.assert.doesNotThrow(
      () => zx.deepPartial(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1),
              f: z.boolean()
            })).length(1)
          })
        })
      ).parse({
        c: {
          d: [
            {}
          ]
        }
      })
    )

    vi.expect.soft(
      zx.deepPartial.writeable(
        z.object({
          a: z.number(),
          b: z.string(),
          c: z.object({
            d: z.array(z.object({
              e: z.number().max(1),
              f: z.boolean()
            })).length(10)
          })
        })
      )
    ).toMatchInlineSnapshot
      (`"z.object({a:z.number().optional(),b:z.string().optional(),c:z.object({d:z.array(z.object({e:z.number().max(1).optional(),f:z.boolean().optional()})).length(10).optional()}).optional()})"`)

  })
})
