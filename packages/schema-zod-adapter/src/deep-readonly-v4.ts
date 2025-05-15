import { z } from 'zod4'
import type { newtype, Primitive } from '@traversable/registry'
import type { Z, Any } from './functor-v4.js'
import { fold } from './functor-v4.js'
import { tagged } from './typename-v4.js'

export type Typelevel =
  | 'applyToSchema'
  | 'applyToOutputType'
  | 'semanticWrapperOnly'
  | 'none'

export interface Options<ReturnType extends Typelevel = never> {
  typelevel?: [ReturnType] extends [never] ? typeof defaults.typelevel : ReturnType
}

export type Unwrap<S> = never | S extends z.ZodReadonly<infer T> ? T : S

export type TypesOnly<T>
  = T extends Primitive ? T
  : T extends readonly unknown[] ? { readonly [I in keyof T]: TypesOnly<T[I]> }
  : T extends object ? { readonly [K in keyof T]: TypesOnly<T[K]> }
  : T

export type Apply<S extends z.ZodType> = {
  applyToOutputType: z.ZodType<TypesOnly<z.infer<S>>>
  semanticWrapperOnly: deepReadonly.Semantics<S>
  applyToSchema: deepReadonly<S>
  none: S
}

export type deepReadonly<S>
  = S extends Z.Nullary ? S
  : S extends z.ZodReadonly<infer T> ? deepReadonly<T>
  : S extends z.ZodMap<infer K, infer V> ? z.ZodReadonly<z.ZodMap<deepReadonly<K>, deepReadonly<V>>>
  : S extends z.ZodSet<infer T> ? z.ZodReadonly<z.ZodSet<deepReadonly<T>>>
  : S extends z.ZodObject<infer T, infer X> ? z.ZodReadonly<z.ZodObject<{ [K in keyof T]: deepReadonly<T[K]> }, X>>
  : S extends z.ZodNonOptional<infer T> ? z.ZodNonOptional<deepReadonly<T>>
  : S extends z.ZodArray<infer T> ? z.ZodReadonly<z.ZodArray<deepReadonly<T>>>
  : S extends z.ZodTuple<infer T, infer Rest> ? z.ZodReadonly<z.ZodTuple<{ [I in keyof T]: deepReadonly<T[I]> }, deepReadonly<Rest>>>
  : S extends z.ZodOptional<infer T> ? z.ZodOptional<deepReadonly<T>>
  : S extends z.ZodIntersection<infer L, infer R> ? z.ZodIntersection<deepReadonly<L>, deepReadonly<R>>
  : S extends z.ZodUnion<infer T> ? z.ZodUnion<{ [I in keyof T]: deepReadonly<T[I]> }>
  : S extends z.ZodNullable<infer T> ? z.ZodNullable<deepReadonly<T>>
  : S extends z.ZodCatch<infer T> ? z.ZodCatch<deepReadonly<T>>
  : S extends z.ZodDefault<infer T> ? z.ZodDefault<deepReadonly<T>>
  : S extends z.ZodTransform<infer O, infer I> ? z.ZodTransform<deepReadonly<O>, deepReadonly<I>>
  : S extends z.ZodPipe<infer A, infer B> ? z.ZodPipe<deepReadonly<A>, deepReadonly<B>>
  : S


export function readonly<S extends z.ZodReadonly>(s: S): S
export function readonly<S extends z.ZodType>(s: S): z.ZodReadonly<S>
export function readonly(s: z.ZodType): z.ZodType {
  return s._zod.def.type === 'readonly' ? s : s.readonly()
}

export const defaults = {
  typelevel: 'applyToOutputType',
} satisfies Required<Options<Typelevel>>


export declare namespace deepReadonly { export { Options, Typelevel, TypesOnly } }
export declare namespace deepReadonly {
  interface Semantics<S extends z.ZodType> extends newtype<S> {}
}

/** 
 * ## {@link deepReadonly `v4.deepReadonly`}
 * 
 * Converts an arbitrary zod schema into its "deep-readonly" form.
 * 
 * That just means that the schema will be traversed, and wrap all {@link z.object `z.object`}
 * properties with {@link z.readonly `z.readonly`}.
 * 
 * Any properties that were already readonly will be left as-is, since re-wrapping
 * again doesn't do anything except make the schema's type harder to read.
 * 
 * ### Options
 * 
 * {@link deepReadonly `v4.deepReadonly`}'s behavior is configurable at the typelevel via
 * the {@link defaults.typelevel `options.typelevel`} property:
 * 
 * - {@link defaults.typelevel `"applyToTypesOnly"`}: apply the transformation to the schema's
 *   output type and wrap it in {@link z.ZodType `z.ZodType`} -- this is the **default behavior**
 * 
 * - {@link defaults.typelevel `"semanticWrapperOnly"`}: leave the schema untouched, but wrap it 
 *   in a no-op interface ({@link deepReadonly.Semantic `deepReadonly.Semantic`}) to make things explicit
 * 
 * - {@link defaults.typelevel `"applyToSchema"`}: this is the most expensive to compute, but preserves 
 *   the structure of the schema itself, which can be useful to keep around sometimes
 * 
 * - {@link defaults.typelevel `"none"`}: {@link deepReadonly `deepReadonly`} will 
 *   return what it got, type untouched
 * 
 * @example
 * import * as vi from "vitest"
 * import { v4 } from "@traversable/schema-zod-adapter"
 * 
 * // Here we use `v4.toString` to make it easier to visualize `v4.deepReadonly`'s behavior:
 * vi.expect(v4.toString(v4.deepReadonly(
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
 * ))).toMatchInlineSnapshot
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

export function deepReadonly<S extends z.ZodType>(schema: S): z.ZodType<TypesOnly<z.infer<S>>>
export function deepReadonly<S extends z.ZodType, K extends deepReadonly.Typelevel>(schema: S, options?: Options<K>): Apply<S>[K]
export function deepReadonly(schema: Any<z.ZodType>) {
  return fold<z.ZodType>((x) => {
    switch (true) {
      default: return x as z.ZodType
      case tagged('readonly')(x): return readonly(x._zod.def.innerType)
      case tagged('map')(x): return readonly(z.map(x._zod.def.keyType, x._zod.def.valueType))
      case tagged('set')(x): return readonly(z.set(x._zod.def.valueType))
      case tagged('array')(x): return readonly(z.array(x._zod.def.element))
      case tagged('object')(x): return readonly(z.object(x._zod.def.shape))
      case tagged('tuple')(x): return !x._zod.def.rest
        ? readonly(z.tuple(x._zod.def.items))
        : readonly(z.tuple(x._zod.def.items, x._zod.def.rest))
    }
  })(schema, [])
}

deepReadonly.defaults = defaults
