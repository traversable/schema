import { z } from 'zod/v4'
import type { newtype, Primitive } from '@traversable/registry'
import { fn } from '@traversable/registry'
import * as F from './functor.js'
import { toString } from './to-string.js'
import { tagged } from './typename.js'

export type deepPartial<T>
  = T extends Primitive ? T
  : T extends readonly unknown[] ? { [I in keyof T]: deepPartial<T[I]> }
  : T extends object ? { [K in keyof T]+?: deepPartial<T[K]> }
  : T

export declare namespace deepPartial {
  interface Semantics<S extends z.ZodType> extends newtype<S> {}
}

/** @internal */
const optional = (x: z.core.$ZodType) => tagged('optional', x) ? x : z.optional(x)

/** 
 * ## {@link deepPartial `zx.deepPartial`}
 * 
 * Converts an arbitrary zod schema into its "deeply-partial" form.
 * 
 * That just means that the schema will be traversed, and wrap all {@link z.object `z.object`}
 * properties with {@link z.optional `z.optional`}.
 * 
 * Any properties that were already optional will be left as-is, since re-wrapping
 * again doesn't do much besides make the schema's type harder to read.
 * 
 * ### Options
 * 
 * {@link deepPartial `zx.deepPartial`}'s behavior is configurable at the typelevel via
 * the {@link defaults.typelevel `options.typelevel`} property:
 * 
 * - {@link defaults.typelevel `"semanticWrapperOnly"`} (default): leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepPartial.Semantic `zx.deepPartial.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`}
 * 
 * - {@link defaults.typelevel `"preserveSchemaType"`}: {@link deepPartial `zx.deepPartial`} will 
 *   return what it got, type untouched
 * 
 * **Note:** 
 * 
 * Make sure you understand the semantics of {@link deepPartial `deepPartial`}
 * before you use this in production. There's a reason it was removed from zod. This library
 * trusts users to do their due diligence to make sure they understand the tradeoffs.
 * 
 * @example
 * import * as vi from "vitest"
 * import { zx } from "@traversable/zod"
 * 
 * // Here we use `zx.toString` to make it easier to visualize `zx.deepPartial`'s behavior:
 * vi.expect.soft(zx.toString(zx.deepPartial(
 *   z.object({
 *     a: z.number(),
 *     b: z.optional(z.string()),
 *     c: z.object({
 *       d: z.array(z.object({
 *         e: z.number().max(1),
 *         f: z.boolean()
 *       })).length(10)
 *     })
 *   })
 * ))).toMatchInlineSnapshot
 *   (`
 *   "z.object({
 *     a: z.number().optional(),
 *     b: z.string().optional(),
 *     c: z.object({
 *       d: z.array(z.object({
 *         e: z.number().max(1).optional(),
 *         f: z.boolean().optional()
 *       })).length(10).optional()
 *     }).optional()
 *   })"
 *   `)
 */

export function deepPartial<T extends z.ZodType>(type: T, options: 'preserveSchemaType'): T
export function deepPartial<T extends z.ZodType>(type: T, options: 'applyToOutputType'): z.ZodType<deepPartial<z.infer<T>>>
export function deepPartial<T extends z.ZodType>(type: T, options: 'semanticWrapperOnly'): deepPartial.Semantics<T>
export function deepPartial<T extends z.ZodType>(type: T): deepPartial.Semantics<T>
export function deepPartial(type: z.core.$ZodType): z.core.$ZodType {
  return F.fold<z.core.$ZodType>(
    (x) => !tagged('object', x)
      ? F.out(x)
      : z.object(fn.map(x._zod.def.shape, optional))
  )(F.in(type), [])
}

/** 
 * ## {@link deepPartial.writeable `zx.deepPartial.writeable`}
 * 
 * Convenience function that composes {@link deepPartial `zx.deepPartial`} 
 * and {@link toString `zx.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With 
 * {@link deepPartial.writeable `zx.deepPartial.writeable`}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */

deepPartial.writeable = fn.flow(deepPartial, toString)

