import { z } from 'zod/v4'
import { fn } from '@traversable/registry'

export { makeLenses } from './lens-types-v4.js'
import * as Lens from './lens-v4.js'
type Lens<S, A> = import('./lens-v4.js').Lens<S, A>
import * as Prism from './prism-v4.js'
type Prism<S, A> = import('./prism-v4.js').Prism<S, A>

export type Result<T, E> = Success<T> | Failure<E>
export declare namespace Result { type Async<T, E> = Promise<Result<T, E>> }
export interface Success<T> { value: T }
export interface Failure<E> { issues: ReadonlyArray<E> }
export interface Standard<T, E> { validate: (value: unknown) => Result<T, E> | Result.Async<T, E> }

export const fromStd = {
  v1: (std) => fn.flow(std.validate, (result) => 'value' in result)
} satisfies Record<string, <T, E>(std: Standard<T, E>) => (value: unknown) => boolean>

export type fromObject<
  Z extends z.core.$ZodObject,
  S extends
  | Z['_zod']['def']['shape']
  = Z['_zod']['def']['shape']
> = never | { [K in keyof S]: Lens<Z['_zod']['~output'], S[K]['_zod']['output']> }

export function fromObject<Z extends z.core.$ZodObject>(type: Z): fromObject<Z>
export function fromObject<Z extends z.core.$ZodObject>(type: Z) {
  return Lens.fromShape(fn.map(type._zod.def.shape, (s) => s._zod.output))
}

export type fromUnion<
  Z extends z.core.$ZodUnion,
  S extends
  | Z['_zod']['def']['options']
  = Z['_zod']['def']['options']
> = { [K in keyof S]: Prism<Z['_zod']['output'], S[K]['_output' & keyof S[K]]> }

export function fromUnion<Z extends z.core.$ZodUnion>(type: Z): fromUnion<Z>
export function fromUnion<Z extends z.core.$ZodUnion>(type: Z) {
  return Prism.fromPatterns(...fn.map(type._zod.def.options, fn.flow((s) => s['~standard'], fromStd.v1)))
}
