import { z } from 'zod4'
import type { newtype, Primitive } from '@traversable/registry'
import { fn } from '@traversable/registry'
import * as F from './functor-v4.js'
import { deepPartial as algebra } from './algebra-v4.js'
import { toString } from './toString-v4.js'

export type deepPartial<T>
  = T extends Primitive ? T
  : T extends readonly unknown[] ? { [I in keyof T]: deepPartial<T[I]> }
  : T extends object ? { [K in keyof T]+?: deepPartial<T[K]> }
  : T

export declare namespace deepPartial {
  interface Semantics<S extends z.ZodType> extends newtype<S> {}
}

/** 
 * ## {@link deepPartial `v4.deepPartial`}
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
 * {@link deepPartial `v4.deepPartial`}'s behavior is configurable at the typelevel via
 * the {@link defaults.typelevel `options.typelevel`} property:
 * 
 * - {@link defaults.typelevel `"semanticWrapperOnly"`} (default): leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepPartial.Semantic `deepPartial.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`}
 * 
 * - {@link defaults.typelevel `"preserveSchemaType"`}: {@link deepPartial `deepPartial`} will 
 *   return what it got, type untouched
 * 
 * **Note:** 
 * 
 * Make sure you understand the semantics of {@link deepPartial `v4.deepPartial`}
 * before you use this in production. There's a reason it was removed from zod. This library
 * trusts users to do their due diligence to make sure they understand the tradeoffs.
 * 
 * @example
 * import * as vi from "vitest"
 * import { v4 } from "@traversable/schema-zod-adapter"
 * 
 * // Here we use `v4.toString` to make it easier to visualize `v4.deepPartial`'s behavior:
 * vi.expect(v4.toString(v4.deepPartial(
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
export function deepPartial(x: z.core.$ZodType) { return F.fold<z.core.$ZodType>(algebra)(F.in(x)) }

/** 
 * ## {@link deepPartial.write `v4.deepPartial.write`}
 * 
 * Convenience function that composes {@link deepPartial `v4.deepPartial`} 
 * and {@link toString `v4.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With {@link deepPartial.write}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */
deepPartial.write = fn.flow(deepPartial, toString)
