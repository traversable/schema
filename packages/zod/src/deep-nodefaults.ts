import * as z from 'zod'
import { fn } from '@traversable/registry'
import { F, tagged, isOptionalDeep, isDefaultDeep } from '@traversable/zod-types'

import { toString } from './to-string.js'

export declare namespace deepNoDefaults {
  type Options = {
    replaceWithOptional?: boolean
  }
}

const defaultOptions = {
  replaceWithOptional: true
} satisfies deepNoDefaults.Options

/** 
 * ## {@link deepNoDefaults `zx.deepNoDefaults`}
 * 
 * Recursively removes any {@link z._default `z.default`} nodes.
 * 
 * Unless you opt out, if the node is an object property, the property will 
 * be wrapped with {@link z.optional `z.optional`}.
 * 
 * To opt out, pass `{ replaceWithOptional: false }` as the second argument 
 * to {@link zx.deepNoDefaults `zx.deepNoDefaults`}.
* 
 * @example
 * import * as vi from "vitest"
 * import { zx } from "@traversable/zod"
 * 
 * // Using `zx.deepNoDefaults.writeable` here to make it easier to visualize `zx.deepNoDefaults`'s behavior:
 * vi.expect.soft(zx.deepNoDefaults.writeable(
 *   z.object({
 *     a: z.number().default(0),
 *     b: z.boolean().default(false).optional(),
 *     c: z.boolean().optional().default(false),
 *     d: z.union([z.string().default(''), z.number().default(0)]),
 *     e: z.array(
 *       z.object({
 *         f: z.number().default(0),
 *         g: z.boolean().default(false).optional(),
 *         h: z.boolean().optional().default(false),
 *         i: z.union([z.string().default(''), z.number().default(0)]),
 *       }).default({
 *         f: 0,
 *         g: false,
 *         h: false,
 *         i: '',
 *       })
 *     ).default([])
 *   })
 * )).toMatchInlineSnapshot
 *   (`
 *     "z.object({
 *       a: z.number().optional(),
 *       b: z.boolean().optional(),
 *       c: z.boolean().optional(),
 *       d: z.union([z.string(), z.number()]).optional(),
 *       e: z
 *         .array(
 *           z.object({
 *             f: z.number().optional(),
 *             g: z.boolean().optional(),
 *             h: z.boolean().optional(),
 *             i: z.union([z.string(), z.number()]).optional(),
 *           }),
 *         )
 *         .optional(),
 *     })
 *     "
 *   `)
 */

export function deepNoDefaults<T extends z.ZodType>(type: T, opts?: deepNoDefaults.Options): z.ZodType<z.infer<T>>
export function deepNoDefaults<T extends z.ZodType>(
  type: T,
  opts: deepNoDefaults.Options = defaultOptions
): z.ZodType {
  return F.fold<z.ZodType>((x, _i, original) => {
    const clone: any = z.clone(original, x._zod.def as never)
    switch (true) {
      default: return clone
      case tagged('transform')(x): return x
      case clone instanceof z.ZodDiscriminatedUnion: return z.union(clone._zod.def.options)
      case tagged('default')(x): return x._zod.def.innerType
      case tagged('object')(x) && tagged('object', original): {
        return z.object(
          fn.map(
            x._zod.def.shape,
            (v, k) => isOptionalDeep(v) ? v
              : opts.replaceWithOptional && isDefaultDeep(original._zod.def.shape[k]) ? z.optional(v)
                : v
          )
        )
      }
    }
  })(type)
}

/**
 * ## {@link deepNoDefaults.writeable `zx.deepNoDefaults.writeable`}
 * 
 * Convenience function that composes {@link deepNoDefaults `zx.deepNoDefaults`} 
 * and {@link toString `zx.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With 
 * {@link deepNoDefaults.writeable `zx.deepNoDefaults.writeable`}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */

deepNoDefaults.writeable = fn.flow(deepNoDefaults, toString)
