import { z } from 'zod'
import type { newtype, Primitive } from '@traversable/registry'
import { fn } from '@traversable/registry'
import type { Atoms } from '@traversable/zod-types'
import { F, tagged } from '@traversable/zod-types'

import { toString } from './to-string.js'

export type deepOptional<T, Atom = Atoms[number]>
  = T extends Primitive ? undefined | T
  : T extends Atom ? undefined | T
  : { [K in keyof T]+?: deepOptional<T[K], Atom> }

export declare namespace deepOptional {
  interface Semantic<S extends z.ZodType | z.core.$ZodType> extends newtype<S> {}
}

/** 
 * ## {@link deepOptional `zx.deepOptional`}
 * 
 * Recursively wraps every node in your zod schema with {@link z.optional `z.optional`}.
 * 
 * That just means that the schema will be traversed, and wrap all {@link z.object `z.object`}
 * properties with {@link z.optional `z.optional`}.
 *
 * ### Options
 * 
 * {@link deepOptional `zx.deepOptional`}'s behavior is configurable at the typelevel via
 * the {@link defaults.typelevel `options.typelevel`} property:
 * 
 * - {@link defaults.typelevel `"semantic"`} (default): leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepOptional.Semantic `zx.deepOptional.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`}
 * 
 * - {@link defaults.typelevel `"preserveSchemaType"`}: {@link deepOptional `zx.deepOptional`} will 
 *   return what it got, type untouched
 * 
 * @example
 * import * as vi from "vitest"
 * import { zx } from "@traversable/zod"
 * 
 * // Using `zx.deepOptional.writeable` here to make it easier to visualize `zx.deepOptional`'s behavior:
 * vi.expect.soft(zx.deepOptional.writeable(
 *   z.object({
 *     a: z.number(),
 *     b: z.string(),
 *     c: z.object({
 *       d: z.tuple([
 *         z.bigint(),
 *         z.object({
 *           e: z.number().max(1),
 *           f: z.boolean()
 *         }),
 *       ])
 *     })
 *   })
 * )).toMatchInlineSnapshot
 *   (`
 *   "z.object({
 *     a: z.number().optional(),
 *     b: z.string().optional(),
 *     c: z.object({
 *       d: z.tuple([
 *         z.bigint().optional(),
 *         z.object({
 *           e: z.number().max(1).optional(),
 *           f: z.boolean().optional()
 *         }).optional()
 *       ]).optional()
 *     }).optional()
 *   })"
 *   `)
 */

export function deepOptional<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'preserveSchemaType'): T
export function deepOptional<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'applyToOutputType'): z.ZodType<deepOptional<z.infer<T>>>
export function deepOptional<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'semantic'): deepOptional.Semantic<T>
export function deepOptional<T extends z.ZodType | z.core.$ZodType>(type: T): deepOptional.Semantic<T>
export function deepOptional(type: z.core.$ZodType) {
  return F.fold<z.core.$ZodType>(
    (x, _, input) => {
      const clone: any = z.clone(input, x._zod.def as never)
      switch (true) {
        default: return clone
        case tagged('transform')(x): return x
        case tagged('object')(x): return z.object(
          fn.map(
            clone._zod.def.shape,
            (v) => tagged('optional', v) ? v : z.optional(v as never)
          )
        )
      }
    }
  )(type)
}

/**
 * ## {@link deepOptional.writeable `zx.deepOptional.writeable`}
 * 
 * Convenience function that composes {@link deepOptional `zx.deepOptional`} 
 * and {@link toString `zx.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With 
 * {@link deepOptional.writeable `zx.deepOptional.writeable`}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */

deepOptional.writeable = fn.flow(deepOptional, toString)
