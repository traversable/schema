import { z } from 'zod4'
import type { newtype, Primitive } from '@traversable/registry'
import { fn } from '@traversable/registry'
import type { Z, Any } from './functor-v4.js'
import { fold } from './functor-v4.js'

export type Typelevel =
  | 'applyToSchema'
  | 'applyToOutputType'
  | 'semanticWrapperOnly'
  | 'none'

export interface Options<ReturnType extends Typelevel = never> {
  typelevel?: [ReturnType] extends [never] ? typeof defaults.typelevel : ReturnType
}

export type Unwrap<S> = never | S extends z.ZodNullable<infer T> ? T : S

export type TypesOnly<T>
  = T extends Primitive ? T
  : T extends readonly unknown[] ? { [I in keyof T]: TypesOnly<T[I]> }
  : T extends object ? { -readonly [K in keyof T]: null | TypesOnly<T[K]> }
  : T

export type Apply<S extends z.ZodType> = {
  applyToOutputType: z.ZodType<TypesOnly<z.infer<S>>>
  semanticWrapperOnly: deepNullable.Semantics<S>
  applyToSchema: deepNullable<S>
  none: S
}

export type deepNullable<S>
  = S extends Z.Nullary ? S
  : S extends z.ZodObject<infer T, infer X> ? z.ZodObject<{ [K in keyof T]: z.ZodNullable<deepNullable<Unwrap<T[K]>>> }, X>
  : S extends z.ZodOptional<infer T> ? z.ZodOptional<deepNullable<T>>
  : S extends z.ZodNonOptional<infer T> ? z.ZodNonOptional<deepNullable<T>>
  : S extends z.ZodArray<infer T> ? z.ZodArray<deepNullable<T>>
  : S extends z.ZodTuple<infer T, infer Rest> ? z.ZodTuple<{ [I in keyof T]: deepNullable<T[I]> }, deepNullable<Rest>>
  : S extends z.ZodIntersection<infer L, infer R> ? z.ZodIntersection<deepNullable<L>, deepNullable<R>>
  : S extends z.ZodUnion<infer T> ? z.ZodUnion<{ [I in keyof T]: deepNullable<T[I]> }>
  : S extends z.ZodReadonly<infer T> ? z.ZodReadonly<deepNullable<T>>
  : S extends z.ZodNullable<infer T> ? z.ZodNullable<deepNullable<T>>
  : S extends z.ZodCatch<infer T> ? z.ZodCatch<deepNullable<T>>
  : S extends z.ZodDefault<infer T> ? z.ZodDefault<deepNullable<T>>
  : S extends z.ZodTransform<infer O, infer I> ? z.ZodTransform<deepNullable<O>, deepNullable<I>>
  : S extends z.ZodMap<infer K, infer V> ? z.ZodMap<deepNullable<K>, deepNullable<V>>
  : S extends z.ZodSet<infer T> ? z.ZodSet<deepNullable<T>>
  : S extends z.ZodPipe<infer A, infer B> ? z.ZodPipe<deepNullable<A>, deepNullable<B>>
  : S

export const defaults = {
  typelevel: 'applyToOutputType',
} satisfies Options<Typelevel>

export function nullable<S extends z.ZodNullable>(s: S): S
export function nullable<S extends z.ZodType>(s: S): z.ZodNullable<S>
export function nullable(s: z.ZodType): z.ZodType {
  return s._zod.def.type === 'nullable' ? s : z.nullable(s)
}


export declare namespace deepNullable { export { Options, Typelevel, TypesOnly } }
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
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`} -- this is the **default behavior**
 * 
 * - {@link defaults.typelevel `"semanticWrapperOnly"`}: leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepNullable.Semantic `deepNullable.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToSchema"`}: this is the most expensive to compute, but preserves 
 *   the structure of the schema itself, which can be useful to keep around sometimes
 * 
 * - {@link defaults.typelevel `"none"`}: {@link deepNullable `deepNullable`} will 
 *   return what it got, type untouched
 * 
 * @example
 * import * as vi from "vitest"
 * import { v4 } from "@traversable/schema-zod-adapter"
 * 
 * // Using `v4.toString` here to make it easier to visualize `v4.deepNullable`'s behavior:
 * vi.expect(v4.toString(v4.deepNullable(
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
export function deepNullable<S extends z.ZodType>(schema: S): z.ZodType<TypesOnly<z.infer<S>>>
export function deepNullable<S extends z.ZodType, K extends deepNullable.Typelevel>(schema: S, options?: Options<K>): Apply<S>[K]
export function deepNullable(schema: Any) { return fold((x) => x._zod.def.type === 'object' ? z.object(fn.map(x._zod.def.shape, nullable)) : x)(schema, []) }

deepNullable.defaults = defaults
