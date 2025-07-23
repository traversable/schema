import * as z from 'zod'
import type { newtype, Primitive } from '@traversable/registry'
import { fn } from '@traversable/registry'
import type { Atoms } from '@traversable/zod-types'
import { F, tagged } from '@traversable/zod-types'

import { toString } from './to-string.js'

export type deepNullable<T, Atom = Atoms[number]>
  = T extends Primitive ? T
  : T extends Atom ? T
  : T extends readonly unknown[] ? { [I in keyof T]: deepNullable<T[I], Atom> }
  : T extends object ? { -readonly [K in keyof T]: null | deepNullable<T[K], Atom> }
  : T

export declare namespace deepNullable {
  interface Semantic<S extends z.ZodType | z.core.$ZodType> extends newtype<S> {}
}

/** 
 * ## {@link deepNullable `deepNullable`}
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
 * {@link deepNullable `zx.deepNullable`}'s behavior is configurable at the typelevel via
 * the {@link defaults.typelevel `options.typelevel`} property:
 * 
 * - {@link defaults.typelevel `"semantic"`} (**default**): leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepNullable.Semantic `zx.deepNullable.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`}
 * 
 * - {@link defaults.typelevel `"preserveSchemaType"`}: {@link deepNullable `zx.deepNullable`} will 
 *   return what it got, type untouched
 * 
 * @example
 * import * as vi from "vitest"
 * import { z } from "zod"
 * import { zx } from "@traversable/zod"
 * 
 * // Using `zx.deepNullable.writeable` here to make it easier to visualize `zx.deepNullable`'s behavior:
 * vi.expect.soft(zx.deepNullable.writeable(
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

export function deepNullable<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'preserveSchemaType'): T
export function deepNullable<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'applyToOutputType'): z.ZodType<deepNullable<z.infer<T>>>
export function deepNullable<T extends z.ZodType | z.core.$ZodType>(type: T, options: 'semantic'): deepNullable.Semantic<T>
export function deepNullable<T extends z.ZodType | z.core.$ZodType>(type: T): deepNullable.Semantic<T>
export function deepNullable(type: z.core.$ZodType): z.core.$ZodType {
  return F.fold<z.core.$ZodType>(
    (x) => tagged('nullable')(x) ? x._zod.def.innerType : z.nullable(F.out(x))
  )(F.in(type))
}

/** 
 * ## {@link deepNullable.writeable `zx.deepNullable.writeable`}
 * 
 * Convenience function that composes {@link deepNullable `zx.deepNullable`} 
 * and {@link toString `zx.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With 
 * {@link deepNullable.writeable `zx.deepNullable.writeable`}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */

deepNullable.writeable = fn.flow(deepNullable, toString)
