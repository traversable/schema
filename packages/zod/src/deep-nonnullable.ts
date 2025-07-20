import * as z from 'zod'
import type { newtype, Primitive } from '@traversable/registry'
import { fn } from '@traversable/registry'
import * as F from './functor.js'
import { toString } from './to-string.js'
import { tagged } from './typename.js'
import type { Atoms } from './utils.js'

export type deepNonNullable<T, Atom = Atoms[number]>
  = T extends Primitive ? T
  : T extends Atom ? T
  : T extends readonly unknown[] ? { [I in keyof T]: deepNonNullable<T[I], Atom> }
  : T extends object ? { -readonly [K in keyof T]: null | deepNonNullable<T[K], Atom> }
  : T

export declare namespace deepNonNullable {
  interface Semantic<S extends z.ZodType | z.core.$ZodType> extends newtype<S> {}
}

/** 
 * ## {@link deepNonNullable `deepNonNullable`}
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
 * {@link deepNonNullable `zx.deepNonNullable`}'s behavior is configurable at the typelevel via
 * the {@link defaults.typelevel `options.typelevel`} property:
 * 
 * - {@link defaults.typelevel `"semantic"`} (**default**): leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepNonNullable.Semantic `zx.deepNonNullable.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`}
 * 
 * - {@link defaults.typelevel `"preserveSchemaType"`}: {@link deepNonNullable `zx.deepNonNullable`} will 
 *   return what it got, type untouched
 * 
 * @example
 * import * as vi from "vitest"
 * import { z } from "zod"
 * import { zx } from "@traversable/zod"
 * 
 * // Using `zx.deepNonNullable.writeable` here to make it easier to visualize `zx.deepNonNullable`'s behavior:
 * vi.expect.soft(zx.deepNonNullable.writeable(
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
 * )).toMatchInlineSnapshot
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

export function deepNonNullable<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'preserveSchemaType'): T
export function deepNonNullable<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'applyToOutputType'): z.ZodType<deepNonNullable<z.infer<T>>>
export function deepNonNullable<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'semantic'): deepNonNullable.Semantic<T>
export function deepNonNullable<T extends z.ZodType | z.core.$ZodType>(type: T): deepNonNullable.Semantic<T>
export function deepNonNullable(type: z.core.$ZodType): z.core.$ZodType {
  return F.fold<z.core.$ZodType>(
    (x) => tagged('nullable')(x) ? x._zod.def.innerType : F.out(x)
  )(F.in(type))
}

/** 
 * ## {@link deepNonNullable.writeable `zx.deepNonNullable.writeable`}
 * 
 * Convenience function that composes {@link deepNonNullable `zx.deepNonNullable`} 
 * and {@link toString `zx.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With 
 * {@link deepNonNullable.writeable `zx.deepNonNullable.writeable`}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */

deepNonNullable.writeable = fn.flow(deepNonNullable, toString)
