import * as vi from 'vitest'
import { v4 } from '@traversable/schema-zod-adapter'
import { z } from 'zod/v4'

vi.describe('〖️⛳️〗‹‹‹ ❲@traversable/schema-zod-adapter❳', () => {
  vi.it('〖️⛳️〗› ❲v4.get❳', () => {
    vi.expect(v4.paths(
      z.object({
        abc: z.boolean(),
        def: z.string(),
      }))
    ).toMatchInlineSnapshot
      (`
      [
        [
          ".abc",
        ],
        [
          ".def",
        ],
      ]
    `)

    /**
     * @example
     * 
     *     0 >>>
     *            ↆ
     *          'abc'
     *            ↆ
     *            ⵁ
     *        
     *            ↆ
     *          'def'
     *            ↆ
     *           '?'
     *            ↆ
     *           '?'
     *            ⵁ
     *        
     *            0
     *            ↆ
     *          'ghi'
     *            ↆ
     *        '[number]'
     *            ↆ
     *        '[number]'
     *            ↆ
     *            ⵁ
     *   
     * 
     * '?' | '[number]'
     */

    vi.expect(v4.paths(
      z.tuple([
        z.object({
          abc: z.literal(1),
          def: z.optional(z.literal(2)),
          ghi: z.array(z.array(z.literal(3))),
        }),
        z.object({
          jkl: z.literal(4),
          mno: z.intersection(z.boolean(), z.number()),
          pqr: z.record(z.enum(['X', 'Y', 'Z']), z.unknown())
        })
      ]), {
      interpreter: {
        string: (k, ix) => `${ix === 0 ? '' : '.'}${k}`,
        number: (k, ix, out) => `[${k}]`,
        optional: () => `?`,
        recordKey: (k) => `[string]`,
        recordValue: (k) => `{}`,
        array: () => `[]`,
        union: () => `|`,
        intersectionLeft: () => [`&`, 0],
        intersectionRight: () => [`&`, 1],
        tuple: () => null,
        object: () => null,
      }
    })
    ).toMatchInlineSnapshot
      (`
      [
        [
          "[0]",
          ".abc",
        ],
        [
          "[0]",
          ".def",
          "?",
          "?",
        ],
        [
          "[0]",
          ".ghi",
          "[]",
          "[]",
        ],
        [
          "[1]",
          ".jkl",
        ],
        [
          "[1]",
          ".mno",
          [
            "&",
            0,
          ],
        ],
        [
          "[1]",
          ".mno",
          [
            "&",
            1,
          ],
        ],
        [
          "[1]",
          ".pqr",
          "[string]",
        ],
        [
          "[1]",
          ".pqr",
          "{}",
        ],
      ]
    `)


  })
})