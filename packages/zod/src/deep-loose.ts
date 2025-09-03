import * as z from 'zod'
import { fn } from '@traversable/registry'
import { F, tagged } from '@traversable/zod-types'

import { toString } from './to-string.js'

/** 
 * ## {@link deepLoose `deepLoose`}
 * 
 * Converts an arbitrary zod schema into its "deeply-loose" form.
 * 
 * That just means that the schema will be traversed, and all {@link z.object `z.object`}
 * and {@link z.strictObject `z.strictObject`} schemas will be rewritten as 
 * {@link z.looseObject `z.looseObject`} schemas.
 * 
 * @example
 * import * as vi from "vitest"
 * import { z } from "zod"
 * import { zx } from "@traversable/zod"
 * 
 * // Using `zx.deepLoose.writeable` here to make it easier to visualize `zx.deepLoose`'s behavior:
 * vi.expect.soft(zx.deepLoose.writeable(
 *   z.object({
 *     a: z.number(),
 *     b: z.nullable(z.string()),
 *     c: z.object({
 *       d: z.array(
 *         z.object({
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
 *         }).catchall(z.unknown())
 *       ).length(10)
 *     }).catchall(z.unknown())
 *   }).catchall(z.unknown())"
 *   `)
 */

export function deepLoose<T extends z.ZodType | z.core.$ZodType>(type: T): T
export function deepLoose<T extends z.ZodType | z.core.$ZodType>(type: T) {
  return F.fold<z.ZodType | z.core.$ZodType>((x, _i, original) => {
    const clone: any = z.clone(original, x._zod.def as never)
    switch (true) {
      default: return clone
      case tagged('transform')(x): return x
      case tagged('object')(x): return z.looseObject(clone._zod.def.shape)
    }
  })(type)
}

/** 
 * ## {@link deepLoose.writeable `zx.deepLoose.writeable`}
 * 
 * Convenience function that composes {@link deepLoose `zx.deepLoose`} 
 * and {@link toString `zx.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With 
 * {@link deepLoose.writeable `zx.deepLoose.writeable`}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */

deepLoose.writeable = fn.flow(deepLoose, toString)
