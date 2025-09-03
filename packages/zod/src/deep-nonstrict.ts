import * as z from 'zod'
import { fn } from '@traversable/registry'
import { F, tagged } from '@traversable/zod-types'

import { toString } from './to-string.js'

/** 
 * ## {@link deepNonStrict `deepNonStrict`}
 * 
 * Converts an arbitrary zod schema into its "deeply-non-strict" form.
 * 
 * That just means that the schema will be traversed, and all {@link z.strictObject `z.strictObject`}
 * schemas will be rewritten as {@link z.object `z.object`} schemas.
 * 
 * @example
 * import * as vi from "vitest"
 * import { z } from "zod"
 * import { zx } from "@traversable/zod"
 * 
 * // Using `zx.deepNonStrict.writeable` here to make it easier to visualize `zx.deepNonStrict`'s behavior:
 * vi.expect.soft(zx.deepNonStrict.writeable(
 *   z.strictObject({
 *     a: z.number(),
 *     b: z.nullable(z.string()),
 *     c: z.strictObject({
 *       d: z.array(
 *         z.strictObject({
 *           e: z.number().max(1),
 *           f: z.boolean()
 *         })
 *       ).length(10)
 *     })
 *   })
 * )).toMatchInlineSnapshot
 *   (`
 *   "z.object({
 *     a: z.number(),
 *     b: z.string().nullable(),
 *     c: z.object({
 *       d: z.array(
 *         z.object({
 *           e: z.number().max(1),
 *           f: z.boolean()
 *         })
 *        ).length(10)
 *     })
 *   })"
 *   `)
 */

export function deepNonStrict<T extends z.ZodType | z.core.$ZodType>(type: T): T
export function deepNonStrict<T extends z.ZodType | z.core.$ZodType>(type: T) {
  return F.fold<z.ZodType | z.core.$ZodType>((x, _i, original) => {
    const clone: any = z.clone(original, x._zod.def as never)
    switch (true) {
      default: return clone
      case tagged('transform')(x): return x
      case tagged('object')(x) && tagged('never')(x._zod.def.catchall): return z.object(clone._zod.def.shape)
    }
  })(type)
}

/** 
 * ## {@link deepNonStrict.writeable `zx.deepNonStrict.writeable`}
 * 
 * Convenience function that composes {@link deepNonStrict `zx.deepNonStrict`} 
 * and {@link toString `zx.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With 
 * {@link deepNonStrict.writeable `zx.deepNonStrict.writeable`}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */

deepNonStrict.writeable = fn.flow(deepNonStrict, toString)
