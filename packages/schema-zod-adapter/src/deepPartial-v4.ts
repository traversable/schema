import { z } from 'zod4'
import { type newtype, type Primitive, fn } from '@traversable/registry'
import { type Z, type Any, fold } from './functor-v4.js'

export type Typelevel =
  | 'applyToSchema'
  | 'applyToOutputType'
  | 'semanticWrapperOnly'
  | 'none'

export interface Options<
  Typelevel extends
  | deepPartial.Typelevel
  = deepPartial.Typelevel
> {
  typelevel?: Typelevel
}

export interface Config extends Required<Options> {}

export const defaults = {
  typelevel: 'applyToOutputType',
} satisfies Config

export type UnwrapOptional<S> = never | S extends z.ZodOptional<infer T> ? T : S
export function asOptional<S extends z.ZodOptional>(s: S): S
export function asOptional<S extends z.ZodType>(s: S): z.ZodOptional<S>
export function asOptional(s: z.ZodType): z.ZodType {
  return s._zod.def.type === 'optional' ? s : z.optional(s)
}


export type deepPartial<S>
  = S extends Z.Nullary ? S
  : S extends z.ZodObject<infer T, infer X> ? z.ZodObject<{ [K in keyof T]: z.ZodOptional<deepPartial<UnwrapOptional<T[K]>>> }, X>
  : S extends z.ZodNonOptional<infer T> ? z.ZodNonOptional<deepPartial<T>>
  : S extends z.ZodOptional<infer T> ? z.ZodOptional<deepPartial<T>>
  : S extends z.ZodArray<infer T> ? z.ZodArray<deepPartial<T>>
  : S extends z.ZodTuple<infer T, infer Rest> ? z.ZodTuple<{ [I in keyof T]: deepPartial<T[I]> }, deepPartial<Rest>>
  : S extends z.ZodIntersection<infer L, infer R> ? z.ZodIntersection<deepPartial<L>, deepPartial<R>>
  : S extends z.ZodUnion<infer T> ? z.ZodUnion<{ [I in keyof T]: deepPartial<T[I]> }>
  : S extends z.ZodReadonly<infer T> ? z.ZodReadonly<deepPartial<T>>
  : S extends z.ZodNullable<infer T> ? z.ZodNullable<deepPartial<T>>
  : S extends z.ZodCatch<infer T> ? z.ZodCatch<deepPartial<T>>
  : S extends z.ZodDefault<infer T> ? z.ZodDefault<deepPartial<T>>
  : S extends z.ZodTransform<infer O, infer I> ? z.ZodTransform<deepPartial<O>, deepPartial<I>>
  : S extends z.ZodMap<infer K, infer V> ? z.ZodMap<deepPartial<K>, deepPartial<V>>
  : S extends z.ZodSet<infer T> ? z.ZodSet<deepPartial<T>>
  : S extends z.ZodPipe<infer A, infer B> ? z.ZodPipe<deepPartial<A>, deepPartial<B>>
  : S

type TypesOnly<S>
  = S extends Primitive ? S
  : S extends readonly unknown[] ? { [I in keyof S]: TypesOnly<S[I]> }
  : S extends object ? { [K in keyof S]+?: TypesOnly<S[K]> }
  : S

declare namespace deepPartial { export { Options, Typelevel, TypesOnly } }
declare namespace deepPartial {
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
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`} -- this is the **default behavior**
 * 
 * - {@link defaults.typelevel `"semanticWrapperOnly"`}: leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepPartial.Semantic `deepPartial.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToSchema"`}: this is the most expensive to compute, but preserves 
 *   the structure of the schema itself, which can be useful to keep around sometimes
 * 
 * - {@link defaults.typelevel `"none"`}: {@link deepPartial `deepPartial`} will 
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
 * 
 */
export function deepPartial<S extends z.ZodType>(schema: S, options: Options<'applyToSchema'>): deepPartial<S>
export function deepPartial<S extends z.ZodType>(schema: S, options: Options<'semanticWrapperOnly'>): deepPartial.Semantics<S>
export function deepPartial<S extends z.ZodType>(schema: S, options: Options<'none'>): S
export function deepPartial<S extends z.ZodType, T = z.infer<S>>(schema: S, options?: Options<'applyToOutputType'>): z.ZodType<TypesOnly<T>>
export function deepPartial<S extends z.ZodType>(schema: S, options?: Options): S
export function deepPartial(schema: Any) {
  return fold((x) => x._zod.def.type === 'object' ? z.object(fn.map(x._zod.def.shape, asOptional)) : x)(schema)
}
