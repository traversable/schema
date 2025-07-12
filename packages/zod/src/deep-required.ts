import { z } from 'zod'
import type { newtype, Primitive } from '@traversable/registry'
import { fn } from '@traversable/registry'
import * as F from './functor.js'
import { toString } from './to-string.js'
import { tagged } from './typename.js'
import type { Atoms } from './utils.js'

export type deepRequired<T, Atom = Atoms[number]>
  = T extends Primitive ? T & {}
  : T extends Atom ? T
  : T extends readonly unknown[] ? { [I in keyof T]-?: deepRequired<T[I], Atom> }
  : T extends object ? { [K in keyof T]-?: deepRequired<T[K], Atom> }
  : T & {}

export declare namespace deepRequired {
  interface Semantic<S extends z.ZodType> extends newtype<S> {}
}

/** 
 * ## {@link deepRequired `zx.deepRequired`}
 * 
 * Converts an arbitrary zod schema into its "deeply-required" form.
 * 
 * That just means that the schema will be traversed, and any {@link z.optional `z.optional`}
 * nodes will be unwrapped.
 *
 * ### Options
 * 
 * {@link deepRequired `zx.deepRequired`}'s behavior is configurable at the typelevel via
 * the {@link defaults.typelevel `options.typelevel`} property:
 * 
 * - {@link defaults.typelevel `"semantic"`} (default): leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepRequired.Semantic `zx.deepRequired.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`}
 * 
 * - {@link defaults.typelevel `"preserveSchemaType"`}: {@link deepRequired `zx.deepRequired`} will 
 *   return what it got, type untouched
 * 
 * **Note:** 
 * 
 * Make sure you understand the semantics of {@link deepRequired `deepRequired`}
 * before you use this in production. There's a reason it was removed from zod proper. 
 * This library trusts users to do their due diligence to make sure they understand
 * the tradeoffs.
 * 
 * @example
 * import * as vi from "vitest"
 * import { zx } from "@traversable/zod"
 * 
 * // Using `zx.deepRequired.writeable` here to make it easier to visualize `zx.deepRequired`'s behavior:
 * vi.expect.soft(zx.deepRequired.writeable(
 *   z.object({
 *     a: z.optional(z.number()),
 *     b: z.optional(z.string()),
 *     c: z.object({
 *       d: z.optional(
 *         z.array(
 *           z.optional(
 *             z.object({
 *               e: z.number().max(1),
 *               f: z.optional(z.optional(z.boolean()))
 *             })
 *           )
 *         )
 *       )
 *     })
 *   })
 * )).toMatchInlineSnapshot(
 *   `"z.object({
 *        a: z.number(),
 *        b: z.string(),
 *        c: z.object({
 *          d: z.array(
 *            z.object({
 *              e: z.number().max(1),
 *              f: z.boolean()
 *            })
 *          )
 *        })
 *     })"`
 *   )
 */

export function deepRequired<T extends z.ZodType>(type: T, options: 'preserveSchemaType'): T
export function deepRequired<T extends z.ZodType>(type: T, options: 'applyToOutputType'): z.ZodType<deepRequired<z.infer<T>>>
export function deepRequired<T extends z.ZodType>(type: T, options: 'semantic'): deepRequired.Semantic<T>
export function deepRequired<T extends z.ZodType>(type: T): deepRequired.Semantic<T>
export function deepRequired(type: z.core.$ZodType) {
  return F.fold<z.core.$ZodType>((x) => tagged('optional')(x) ? x._zod.def.innerType : F.out(x))(F.in(type))
}

/**
 * ## {@link deepRequired.writeable `zx.deepRequired.writeable`}
 * 
 * Convenience function that composes {@link deepRequired `zx.deepRequired`} 
 * and {@link toString `zx.toString`}.
 * 
 * This option is useful when you have particularly large schemas, and are 
 * starting to feel the TS compiler drag. With 
 * {@link deepRequired.writeable `zx.deepRequired.writeable`}, you
 * can pay that price one by writing the new schema to disc.
 * 
 * Keep in mind that the most expensive part of the transformation is at the
 * type-level; writing to disc solves that problem, but introduces a syncing problem,
 * so if you don't "own" the schema, make sure you've at least thought about what
 * you'll do when the schema inevitably changes.
 */

deepRequired.writeable = fn.flow(deepRequired, toString)
