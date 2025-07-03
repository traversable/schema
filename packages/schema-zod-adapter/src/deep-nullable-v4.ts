import { z } from 'zod/v4'
import type { newtype, Primitive } from '@traversable/registry'
import { fn } from '@traversable/registry'
import * as F from './functor-v4.js'
import { deepNullable as algebra } from './algebra-v4.js'
import { toString } from './toString-v4.js'

export type deepNullable<T>
  = T extends Primitive ? T
  : T extends readonly unknown[] ? { [I in keyof T]: deepNullable<T[I]> }
  : T extends object ? { -readonly [K in keyof T]: null | deepNullable<T[K]> }
  : T

export declare namespace deepNullable {
  interface Semantics<S extends z.ZodType> extends newtype<S> {}
}

/** 
 * ## {@link deepNullable `v4.deepNullable`}
 * 
 * Converts an arbitrary zod schema into its "deeply-partial" form.
 * 
 * That just means that the schema will be traversed, and wrap all {@link z.object `z.object`}
 * properties with {@link z.nullable `z.nullable`}.
 * 
 * Any properties that were already nullable will be left as-is, since re-wrapping
 * again doesn't do anything except make the schema's type harder to read.
 * 
 * ### Options
 * 
 * {@link deepNullable `v4.deepNullable`}'s behavior is configurable at the typelevel via
 * the {@link defaults.typelevel `options.typelevel`} property:
 * 
 * - {@link defaults.typelevel `"semanticWrapperOnly"`} (**default**): leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepNullable.Semantic `deepNullable.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`}
 * 
 * - {@link defaults.typelevel `"preserveSchemaType"`}: {@link deepNullable `deepNullable`} will 
 *   return what it got, type untouched
 * 
 * @example
 * import * as vi from "vitest"
 * import { v4 } from "@traversable/schema-zod-adapter"
 * 
 * // Using `v4.toString` here to make it easier to visualize `v4.deepNullable`'s behavior:
 * vi.expect.soft(v4.toString(v4.deepNullable(
 *   z.object({
 *     a: z.number(),
 *     b: z.nullable(z.string()),
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
 *     a: z.number().nullable(),
 *     b: z.string().nullable(),
 *     c: z.object({
 *       d: z.array(z.object({
 *         e: z.number().max(1).nullable(),
 *         f: z.boolean().nullable()
 *       })).length(10).nullable()
 *     }).nullable()
 *   })"
 *   `)
 */

export function deepNullable<T extends z.ZodType>(type: T, options: 'preserveSchemaType'): T
export function deepNullable<T extends z.ZodType>(type: T, options: 'applyToOutputType'): z.ZodType<deepNullable<z.infer<T>>>
export function deepNullable<T extends z.ZodType>(type: T, options: 'semanticWrapperOnly'): deepNullable.Semantics<T>
export function deepNullable<T extends z.ZodType>(type: T): deepNullable.Semantics<T>
export function deepNullable(x: z.ZodType) { return F.fold<z.ZodType>(algebra)(F.in(x), []) }


/** 
 * ## {@link deepNullable.write `v4.deepNullable.write`}
 * 
 * Convenience function that composes {@link deepNullable `v4.deepNullable`} 
 * and {@link toString `v4.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With {@link deepNullable.write}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */

deepNullable.write = fn.flow(deepNullable, toString)
