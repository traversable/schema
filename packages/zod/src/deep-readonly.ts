import { z } from 'zod'
import type { newtype, Primitive } from '@traversable/registry'
import { fn } from '@traversable/registry'
import type { Atoms } from '@traversable/zod-types'
import { F, tagged } from '@traversable/zod-types'

import { toString } from './to-string.js'

export type deepReadonly<T, Atom = Atoms[number]>
  = T extends Primitive ? T
  : T extends Atom ? T
  : T extends readonly unknown[] ? { readonly [I in keyof T]: deepReadonly<T[I], Atom> }
  : T extends Map<infer K, infer V> ? ReadonlyMap<deepReadonly<K, Atom>, deepReadonly<V, Atom>>
  : T extends Set<infer V> ? ReadonlySet<deepReadonly<V, Atom>>
  : T extends object ? { readonly [K in keyof T]: deepReadonly<T[K], Atom> }
  : T

export declare namespace deepReadonly {
  interface Semantic<S extends z.ZodType | z.core.$ZodType> extends newtype<S> {}
}

/** 
 * ## {@link deepReadonly `zx.deepReadonly`}
 * 
 * Converts an arbitrary zod schema into its "deeply-readonly" form.
 * 
 * That just means that the schema will be traversed, and wrap all {@link z.object `z.object`}
 * properties with {@link z.readonly `z.readonly`}.
 * 
 * Any properties that were already readonly will be left as-is, since re-wrapping
 * again doesn't do much besides make the schema's type harder to read.
 * 
 * ### Options
 * 
 * {@link deepReadonly `zx.deepReadonly`}'s behavior is configurable at the typelevel via
 * the {@link defaults.typelevel `options.typelevel`} property:
 * 
 * - {@link defaults.typelevel `"semantic"`} (**default**): leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepReadonly.Semantic `deepReadonly.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`}
 * 
 * - {@link defaults.typelevel `"preserveSchemaType"`}: {@link deepReadonly `zx.deepReadonly`} will 
 *   return what it got, type untouched
 * 
 * @example
 * import * as vi from "vitest"
 * import { z } from "zod"
 * import { zx } from "@traversable/zod"
 * 
 * // Using `zx.deepReadonly.writeable` here to make it easier to visualize `zx.deepReadonly`'s behavior:
 * vi.expect.soft(zx.deepReadonly.writeable(
 *   z.object({
 *     a: z.number(),
 *     b: z.readonly(z.string()),
 *     c: z.object({
 *       d: z.array(z.object({
 *         e: z.number().max(1),
 *         f: z.boolean()
 *       })).length(10)
 *     })
 *   })
 * )).toMatchInlineSnapshot
 *   (`
 *   "z.object({
 *     a: z.number().readonly(),
 *     b: z.string().readonly(),
 *     c: z.object({
 *       d: z.array(z.object({
 *         e: z.number().max(1).readonly(),
 *         f: z.boolean().readonly()
 *       })).length(10).readonly()
 *     }).readonly()
 *   })"
 *   `)
 */

export function deepReadonly<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'preserveSchemaType'): T
export function deepReadonly<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'applyToOutputType'): z.ZodType<deepReadonly<z.infer<T>>>
export function deepReadonly<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'semantic'): deepReadonly.Semantic<T>
export function deepReadonly<T extends z.ZodType | z.core.$ZodType>(type: T): deepReadonly.Semantic<T>
export function deepReadonly(type: z.core.$ZodType): z.core.$ZodType {
  return F.fold<z.core.$ZodType>(
    (x) => tagged('readonly')(x)
      ? x._zod.def.innerType
      : z.readonly(F.out(x))
  )(F.in(type))
}

/** 
 * ## {@link deepReadonly.writeable `zx.deepReadonly.writeable`}
 * 
 * Convenience function that composes {@link deepReadonly `zx.deepReadonly`} 
 * and {@link toString `zx.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With 
 * {@link deepReadonly.writeable `deepReadonly.writeable`}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */
deepReadonly.writeable = fn.flow(deepReadonly, toString)
