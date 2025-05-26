//////////////////////////
///   ****@ts-nocheck 🤫   ///
/**
 * **Note:**
 *
 * If you are going to make edits to this file, __make sure__ you
 * remove the `@ts-nocheck` directive (above) until you're done.
 *
 * This module cuts a lot of deals with the "type-level devil", as
 * it were, to optimize for IDE performance.
 *
 * Without them, the deep queries into zod schemas (which in v4 are
 * are even deeper than they were in v3) gets prohibitive almost
 * immediately.
 */


import { z } from 'zod/v4'
import type { Box, Boxed, Force, Kind, HKT, newtype, TypeConstructor as Type, inline, Key, Showable } from '@traversable/registry'
import { Either, get, Option, set } from '@traversable/registry'
import * as Lens from './lens-v4.js'
type Lens<S, A> = import('./lens-v4.js').Lens<S, A>
import * as Prism from './prism-v4.js'
type Prism<S, A> = import('./prism-v4.js').Prism<S, A>

export type At<T> = Kind<Map[T['_zod']['def']['type']], T>
export type Apply<Meta extends unknown[], Out> = Meta extends [infer F extends HKT, ...infer T] ? Apply<T, Kind<F, Out>> : Out

export type ApplyFocus<T, KS extends unknown[]>
  = KS extends [infer K extends keyof any, ...infer KS]
  ? K extends keyof T ? ApplyFocus<T[K], KS>
  : K extends `|${infer I extends number & keyof T}|` ? ApplyFocus<T[I], KS>

  : K extends `::${infer H}` ? [T: T, H: H, KS: KS]

  : K extends Op[keyof Op] ? ApplyFocus<K extends typeof Op.optional ? Exclude<T, undefined> : T, KS>
  : ApplyFocus<T, KS>
  : T['_output']


export type OutputOf<T, KS, Queue extends HKT[] = []>
  = KS extends [infer K extends keyof any, ...infer KS]
  ? K extends keyof T ? OutputOf<T[K], KS, Queue>
  : K extends `|${infer I extends number & keyof T}|` ? OutputOf<T[I], KS, [Operator['|number|'], ...Queue]>

  : K extends `::${infer H}` ? OutputOf<Extract<T, { _zod: { def: { shape: Record<keyof T['_zod']['def']['shape'], { _output: H }> } } }>, KS, Queue>
  // OutputOf<{ _output: Extract<T, Record<keyof T, { _output: H }>> }, KS, Queue>

  : K extends Op[keyof Op] ? OutputOf<K extends typeof Op.optional ? Exclude<T, undefined> : T, KS, [Operator[K], ...Queue]>
  : OutputOf<T, KS, Queue>
  : 0 extends Queue['length'] ? T['_output']
  : Apply<Queue, T['_output']>

export type Op = typeof Op
export declare const Op: {
  optional: '?'
  nonoptional: '!'
  array: '[number]'
  record: '[string]'
  member: `|number|`
  // index: `[${number}]`
}

type Operator = {
  [Op.optional]: Lazy.Optional
  [Op.array]: Lazy.Array
  [Op.record]: Lazy.Id
  [Op.member]: Lazy.Maybe
  // [x: typeof Op.index]: Lazy.Array
}

export type Map = {
  union: Lazy.UnionTag
  optional: Lazy.OptionalTag
  object: Lazy.ObjectTag
  tuple: Lazy.TupleTag
  array: Lazy.ArrayTag
  record: Lazy.RecordTag
  // intersection: Lazy.IntersectionTag
}

export declare namespace Lazy {
  type Array = Type.Array
  type Id = Type.Identity
  type Maybe = Type.Option
  interface Optional extends HKT { [-1]: Option<Exclude<this[0], undefined>> }
  interface OptionalIn extends HKT { [-1]: Exclude<this[0], undefined> }
  interface ObjectTag extends HKT<{ _zod: { def: { shape: unknown } } }> { [-1]: [this[0]['_zod']['def']['shape'], ['_zod', 'def', 'shape']] }
  interface TupleTag extends HKT<{ _zod: { def: { items: unknown } } }> { [-1]: [this[0]['_zod']['def']['items'], ['_zod', 'def', 'items']] }
  interface OptionalTag extends HKT<{ _zod: { def: { innerType: unknown } } }> { [-1]: [FocusOptional<this[0]['_zod']['def']['innerType']>, ['_zod', 'def', 'innerType']] }
  interface NonOptionalTag extends HKT<{ _zod: { def: { innerType: unknown } } }> { [-1]: [FocusNonOptional<this[0]['_zod']['def']['innerType']>, ['_zod', 'def', 'innerType']] }
  interface ArrayTag extends HKT<{ _zod: { def: { element: unknown } } }> { [-1]: [FocusArray<this[0]['_zod']['def']['element']>, ['_zod', 'def', 'element']] }
  interface RecordTag extends HKT { [-1]: [FocusRecord<this[0]>, ['valueType']] }

  type FocusOptional<T> = { [Op.optional]: T }
  type FocusNonOptional<T> = { [Op.nonoptional]: T }
  type FocusArray<T> = { [Op.array]: T, [index: `[${number}]`]: T }
  type FocusRecord<T, K extends string = T['keyType']['_output'], V = T['valueType']>
    = string extends K ? { [Op.record]: V }
    : number extends K ? { [Op.array]: V }
    : { [P in K]: V }

  interface UnionTag extends HKT {
    [-3]: this[0]['_zod']['def']['options']
    [-2]: this[-3][number]['_zod']['def']['shape']
    [-1]: [keyof this[-2]] extends [never]
    ? [FocusUnion<this[0]['_zod']['def']['options']>, ['_zod', 'def', 'options']]
    : [FocusTaggedUnion<this[-2]>, ['_zod', 'def', 'options', number,]]
  }
  type FocusUnion<T extends readonly unknown[]> = never | { [K in Extract<keyof T, `${number}`> as `|${K}|`]: T[K] }
  type FocusTaggedUnion<T> = never | { [K in (T[keyof T]['_output']) as `::${K}`]: z.core.$ZodObject<Extract<T, Record<keyof T, { _output: K }>>, {}, {}> }
}

const Schema = z.object({
  A: z.array(
    z.union([
      z.object({ tag: z.literal('B'), b: z.string(), }),
      z.object({ tag: z.literal('C'), c: z.union([z.number(), z.boolean()]), }),
    ])
  ),
})

export type zs2 = Kind<Lazy.UnionTag, typeof zs>
//          ^?

// const xcd = makeLens(Schema, 'A', '[number]', '::B', 'b')
//    ^?


type xs2 = Kind<Lazy.UnionTag, typeof xs>
//   ^?
type ys2 = Kind<Lazy.UnionTag, typeof xs>
//   ^?
type xs = Lazy.FocusUnion<typeof xs._zod.def.options>
//   ^?
type ys = Lazy.FocusUnion<typeof ys._zod.def.options>
//   ^?
type zs = Lazy.FocusUnion<typeof zs._zod.def.options>
//   ^?
const xs = z.union([z.object({ a: z.literal(1) }), z.object({ b: z.literal(2) })])
const ys = z.union([z.number(), z.string()])
const zs = z.union([z.object({ tag: z.literal('A'), one: z.number() }), z.object({ tag: z.literal('B'), two: z.string() })])

export declare function makeLens<Z extends z.ZodType>(type: Z, ...keys: [never, ...never]): never

export declare function makeLens<
  Focus extends At<O[0][K15]>,
  K01 extends keyof A[0],
  K02 extends keyof B[0],
  K03 extends keyof C[0],
  K04 extends keyof D[0],
  K05 extends keyof E[0],
  K06 extends keyof F[0],
  K07 extends keyof G[0],
  K08 extends keyof H[0],
  K09 extends keyof I[0],
  K10 extends keyof J[0],
  K11 extends keyof K[0],
  K12 extends keyof L[0],
  K13 extends keyof M[0],
  K14 extends keyof N[0],
  K15 extends keyof O[0],
  K16 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K01]>,
  C extends At<B[0][K02]>,
  D extends At<C[0][K03]>,
  E extends At<D[0][K04]>,
  F extends At<E[0][K05]>,
  G extends At<F[0][K06]>,
  H extends At<G[0][K07]>,
  I extends At<H[0][K08]>,
  J extends At<I[0][K09]>,
  K extends At<J[0][K10]>,
  L extends At<K[0][K11]>,
  M extends At<L[0][K12]>,
  N extends At<M[0][K13]>,
  O extends At<N[0][K14]>,
  Path = [
    ...A[1], K01,
    ...B[1], K02,
    ...C[1], K03,
    ...D[1], K04,
    ...E[1], K05,
    ...F[1], K06,
    ...G[1], K07,
    ...H[1], K08,
    ...I[1], K09,
    ...J[1], K10,
    ...K[1], K11,
    ...L[1], K12,
    ...M[1], K13,
    ...N[1], K14,
    ...O[1], K15,
    ...Focus[1], K16,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K01, K02, K03, K04, K05, K06, K07, K08, K09, K10, K11, K12, K13, K14, K15, K16]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<N[0][K14]>,
  K01 extends keyof A[0],
  K02 extends keyof B[0],
  K03 extends keyof C[0],
  K04 extends keyof D[0],
  K05 extends keyof E[0],
  K06 extends keyof F[0],
  K07 extends keyof G[0],
  K08 extends keyof H[0],
  K09 extends keyof I[0],
  K10 extends keyof J[0],
  K11 extends keyof K[0],
  K12 extends keyof L[0],
  K13 extends keyof M[0],
  K14 extends keyof N[0],
  K15 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K01]>,
  C extends At<B[0][K02]>,
  D extends At<C[0][K03]>,
  E extends At<D[0][K04]>,
  F extends At<E[0][K05]>,
  G extends At<F[0][K06]>,
  H extends At<G[0][K07]>,
  I extends At<H[0][K08]>,
  J extends At<I[0][K09]>,
  K extends At<J[0][K10]>,
  L extends At<K[0][K11]>,
  M extends At<L[0][K12]>,
  N extends At<M[0][K13]>,
  Path = [
    ...A[1], K01,
    ...B[1], K02,
    ...C[1], K03,
    ...D[1], K04,
    ...E[1], K05,
    ...F[1], K06,
    ...G[1], K07,
    ...H[1], K08,
    ...I[1], K09,
    ...J[1], K10,
    ...K[1], K11,
    ...L[1], K12,
    ...M[1], K13,
    ...N[1], K14,
    ...Focus[1], K15,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K01, K02, K03, K04, K05, K06, K07, K08, K09, K10, K11, K12, K13, K14, K15]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<M[0][K13]>,
  K01 extends keyof A[0],
  K02 extends keyof B[0],
  K03 extends keyof C[0],
  K04 extends keyof D[0],
  K05 extends keyof E[0],
  K06 extends keyof F[0],
  K07 extends keyof G[0],
  K08 extends keyof H[0],
  K09 extends keyof I[0],
  K10 extends keyof J[0],
  K11 extends keyof K[0],
  K12 extends keyof L[0],
  K13 extends keyof M[0],
  K14 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K01]>,
  C extends At<B[0][K02]>,
  D extends At<C[0][K03]>,
  E extends At<D[0][K04]>,
  F extends At<E[0][K05]>,
  G extends At<F[0][K06]>,
  H extends At<G[0][K07]>,
  I extends At<H[0][K08]>,
  J extends At<I[0][K09]>,
  K extends At<J[0][K10]>,
  L extends At<K[0][K11]>,
  M extends At<L[0][K12]>,
  Path = [
    ...A[1], K01,
    ...B[1], K02,
    ...C[1], K03,
    ...D[1], K04,
    ...E[1], K05,
    ...F[1], K06,
    ...G[1], K07,
    ...H[1], K08,
    ...I[1], K09,
    ...J[1], K10,
    ...K[1], K11,
    ...L[1], K12,
    ...M[1], K13,
    ...Focus[1], K14,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K01, K02, K03, K04, K05, K06, K07, K08, K09, K10, K11, K12, K13, K14]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<L[0][K12]>,
  K01 extends keyof A[0],
  K02 extends keyof B[0],
  K03 extends keyof C[0],
  K04 extends keyof D[0],
  K05 extends keyof E[0],
  K06 extends keyof F[0],
  K07 extends keyof G[0],
  K08 extends keyof H[0],
  K09 extends keyof I[0],
  K10 extends keyof J[0],
  K11 extends keyof K[0],
  K12 extends keyof L[0],
  K13 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K01]>,
  C extends At<B[0][K02]>,
  D extends At<C[0][K03]>,
  E extends At<D[0][K04]>,
  F extends At<E[0][K05]>,
  G extends At<F[0][K06]>,
  H extends At<G[0][K07]>,
  I extends At<H[0][K08]>,
  J extends At<I[0][K09]>,
  K extends At<J[0][K10]>,
  L extends At<K[0][K11]>,
  Path = [
    ...A[1], K01,
    ...B[1], K02,
    ...C[1], K03,
    ...D[1], K04,
    ...E[1], K05,
    ...F[1], K06,
    ...G[1], K07,
    ...H[1], K08,
    ...I[1], K09,
    ...J[1], K10,
    ...K[1], K11,
    ...L[1], K12,
    ...Focus[1], K13,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K01, K02, K03, K04, K05, K06, K07, K08, K09, K10, K11, K12, K13]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<K[0][K11]>,
  K01 extends keyof A[0],
  K02 extends keyof B[0],
  K03 extends keyof C[0],
  K04 extends keyof D[0],
  K05 extends keyof E[0],
  K06 extends keyof F[0],
  K07 extends keyof G[0],
  K08 extends keyof H[0],
  K09 extends keyof I[0],
  K10 extends keyof J[0],
  K11 extends keyof K[0],
  K12 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K01]>,
  C extends At<B[0][K02]>,
  D extends At<C[0][K03]>,
  E extends At<D[0][K04]>,
  F extends At<E[0][K05]>,
  G extends At<F[0][K06]>,
  H extends At<G[0][K07]>,
  I extends At<H[0][K08]>,
  J extends At<I[0][K09]>,
  K extends At<J[0][K10]>,
  Path = [
    ...A[1], K01,
    ...B[1], K02,
    ...C[1], K03,
    ...D[1], K04,
    ...E[1], K05,
    ...F[1], K06,
    ...G[1], K07,
    ...H[1], K08,
    ...I[1], K09,
    ...J[1], K10,
    ...K[1], K11,
    ...Focus[1], K12,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K01, K02, K03, K04, K05, K06, K07, K08, K09, K10, K11, K12]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<J[0][K10]>,
  K01 extends keyof A[0],
  K02 extends keyof B[0],
  K03 extends keyof C[0],
  K04 extends keyof D[0],
  K05 extends keyof E[0],
  K06 extends keyof F[0],
  K07 extends keyof G[0],
  K08 extends keyof H[0],
  K09 extends keyof I[0],
  K10 extends keyof J[0],
  K11 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K01]>,
  C extends At<B[0][K02]>,
  D extends At<C[0][K03]>,
  E extends At<D[0][K04]>,
  F extends At<E[0][K05]>,
  G extends At<F[0][K06]>,
  H extends At<G[0][K07]>,
  I extends At<H[0][K08]>,
  J extends At<I[0][K09]>,
  Path = [
    ...A[1], K01,
    ...B[1], K02,
    ...C[1], K03,
    ...D[1], K04,
    ...E[1], K05,
    ...F[1], K06,
    ...G[1], K07,
    ...H[1], K08,
    ...I[1], K09,
    ...J[1], K10,
    ...Focus[1], K11,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K01, K02, K03, K04, K05, K06, K07, K08, K09, K10, K11]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<I[0][K09]>,
  K01 extends keyof A[0],
  K02 extends keyof B[0],
  K03 extends keyof C[0],
  K04 extends keyof D[0],
  K05 extends keyof E[0],
  K06 extends keyof F[0],
  K07 extends keyof G[0],
  K08 extends keyof H[0],
  K09 extends keyof I[0],
  K10 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K01]>,
  C extends At<B[0][K02]>,
  D extends At<C[0][K03]>,
  E extends At<D[0][K04]>,
  F extends At<E[0][K05]>,
  G extends At<F[0][K06]>,
  H extends At<G[0][K07]>,
  I extends At<H[0][K08]>,
  Path = [
    ...A[1], K01,
    ...B[1], K02,
    ...C[1], K03,
    ...D[1], K04,
    ...E[1], K05,
    ...F[1], K06,
    ...G[1], K07,
    ...H[1], K08,
    ...I[1], K09,
    ...Focus[1], K10,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K01, K02, K03, K04, K05, K06, K07, K08, K09, K10]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<H[0][K8]>,
  K1 extends keyof A[0],
  K2 extends keyof B[0],
  K3 extends keyof C[0],
  K4 extends keyof D[0],
  K5 extends keyof E[0],
  K6 extends keyof F[0],
  K7 extends keyof G[0],
  K8 extends keyof H[0],
  K9 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K1]>,
  C extends At<B[0][K2]>,
  D extends At<C[0][K3]>,
  E extends At<D[0][K4]>,
  F extends At<E[0][K5]>,
  G extends At<F[0][K6]>,
  H extends At<G[0][K7]>,
  Path = [
    ...A[1], K1,
    ...B[1], K2,
    ...C[1], K3,
    ...D[1], K4,
    ...E[1], K5,
    ...F[1], K6,
    ...G[1], K7,
    ...H[1], K8,
    ...Focus[1], K9,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K1, K2, K3, K4, K5, K6, K7, K8, K9]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<G[0][K7]>,
  K1 extends keyof A[0],
  K2 extends keyof B[0],
  K3 extends keyof C[0],
  K4 extends keyof D[0],
  K5 extends keyof E[0],
  K6 extends keyof F[0],
  K7 extends keyof G[0],
  K8 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K1]>,
  C extends At<B[0][K2]>,
  D extends At<C[0][K3]>,
  E extends At<D[0][K4]>,
  F extends At<E[0][K5]>,
  G extends At<F[0][K6]>,
  Path = [
    ...A[1], K1,
    ...B[1], K2,
    ...C[1], K3,
    ...D[1], K4,
    ...E[1], K5,
    ...F[1], K6,
    ...G[1], K7,
    ...Focus[1], K8,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K1, K2, K3, K4, K5, K6, K7, K8]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<F[0][K6]>,
  K1 extends keyof A[0],
  K2 extends keyof B[0],
  K3 extends keyof C[0],
  K4 extends keyof D[0],
  K5 extends keyof E[0],
  K6 extends keyof F[0],
  K7 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K1]>,
  C extends At<B[0][K2]>,
  D extends At<C[0][K3]>,
  E extends At<D[0][K4]>,
  F extends At<E[0][K5]>,
  Path = [
    ...A[1], K1,
    ...B[1], K2,
    ...C[1], K3,
    ...D[1], K4,
    ...E[1], K5,
    ...F[1], K6,
    ...Focus[1], K7,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K1, K2, K3, K4, K5, K6, K7]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<E[0][K5]>,
  K1 extends keyof A[0],
  K2 extends keyof B[0],
  K3 extends keyof C[0],
  K4 extends keyof D[0],
  K5 extends keyof E[0],
  K6 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K1]>,
  C extends At<B[0][K2]>,
  D extends At<C[0][K3]>,
  E extends At<D[0][K4]>,
  Path = [
    ...A[1], K1,
    ...B[1], K2,
    ...C[1], K3,
    ...D[1], K4,
    ...E[1], K5,
    ...Focus[1], K6,
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K1, K2, K3, K4, K5, K6]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<D[0][K4]>,
  K1 extends keyof A[0],
  K2 extends keyof B[0],
  K3 extends keyof C[0],
  K4 extends keyof D[0],
  K5 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K1]>,
  C extends At<B[0][K2]>,
  D extends At<C[0][K3]>,
  Path = [
    ...A[1], K1,
    ...B[1], K2,
    ...C[1], K3,
    ...D[1], K4,
    ...Focus[1], K5
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K1, K2, K3, K4, K5]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<C[0][K3]>,
  K1 extends keyof A[0],
  K2 extends keyof B[0],
  K3 extends keyof C[0],
  K4 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K1]>,
  C extends At<B[0][K2]>,
  Path = [
    ...A[1], K1,
    ...B[1], K2,
    ...C[1], K3,
    ...Focus[1], K4
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K1, K2, K3, K4]): Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<B[0][K2]>,
  K1 extends keyof A[0],
  K2 extends keyof B[0],
  K3 extends keyof Focus[0],
  Z extends z.ZodType,
  A extends At<Z>,
  B extends At<A[0][K1]>,
  Path = [
    ...A[1], K1,
    ...B[1], K2,
    ...Focus[1], K3
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K1, K2, K3]): Lens<z.infer<Z>, Out>


export declare function makeLens<
  Focus extends At<A[0][K1]>,
  K1 extends keyof A[0],
  K2 extends keyof Focus[0],
  A extends At<Z>,
  Z extends z.ZodType,
  Path = [
    ...A[1], K1,
    ...Focus[1], K2
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K1, K2]): Focus[0][K2]
// Lens<z.infer<Z>, Out>

export declare function makeLens<
  Focus extends At<Z>,
  K1 extends keyof Focus[0],
  Z extends z.ZodType,
  Path = [
    ...Focus[1], K1
  ],
  Out = OutputOf<Z, Path>
>(type: Z, ...k: [K1]): Lens<z.infer<Z>, Out>

export declare function makeLens<Z extends z.core.$ZodType>(type: Z): Lens<z.infer<Z>, z.infer<Z>>








// type Optional<T, K extends keyof T> = Z.get.type<T[K]> extends 'optional' ? `${Key<K>}?` : K

type Optional<T, K extends keyof T> = `${K}?`

declare const Z: {
  literal: Z.Literal
  optional: Z.Optional
  array: Z.Array
  record: Z.Record
  union: Z.Union
  tuple: Z.Tuple
  object: Z.Object
}

declare namespace Z {
  namespace get {
    type output<T> = T['_output']
    type zodOutput<T> = T['_zod']['output']
    type type<T> = T['_zod']['def']['type']
    type innerType<T> = T['_zod']['def']['innerType']
    type element<T> = T['_zod']['def']['element']
    type keyType<T> = T['_zod']['def']['keyType']
    type valueType<T> = T['_zod']['def']['valueType']
    type options<T> = T['_zod']['def']['options']
    type shape<T> = T['_zod']['def']['shape']
    type items<T> = T['_zod']['def']['items']
  }

  type infer<T> = T['_output' & keyof T]
  interface Type<T> { _output: T }
  interface Indexed { [x: number]: Z.Typed }
  interface Named { [x: string]: Z.Typed }
  type Ordered = readonly Z.Typed[]
  interface Infer<
    T extends
    | { _output: unknown }
    = { _output: unknown }
  > { _output: T['_output'] }
  interface Typed<
    T extends
    | { _zod: { def: { type: unknown } } }
    = { _zod: { def: { type: unknown } } }
  > { _zod: { def: { type: T['_zod']['def']['type'] } } }
  //
  interface Literal<
    T extends
    | { _zod: { output: Showable } }
    = { _zod: { output: Showable } }
  > { _zod: { output: T['_zod']['output'] } }
  interface Optional<
    T extends
    | { _zod: { def: { innerType: Z.Typed } } }
    = { _zod: { def: { innerType: Z.Typed } } }
  > { _zod: { def: { innerType: T['_zod']['def']['innerType'] } } }
  interface Array<
    T extends
    | { _zod: { def: { element: Z.Typed } } }
    = { _zod: { def: { element: Z.Typed } } }
  > { _zod: { def: { element: T['_zod']['def']['element'] } } }
  interface Record<
    T extends
    | { _zod: { def: { keyType: Z.Type<keyof any>, valueType: Z.Typed } } }
    = { _zod: { def: { keyType: Z.Type<keyof any>, valueType: Z.Typed } } }
  > { _zod: { def: { keyType: T['_zod']['def']['keyType'], valueType: T['_zod']['def']['valueType'] } } }
  interface Union<
    T extends
    | { _zod: { def: { options: Z.Indexed } } }
    = { _zod: { def: { options: Z.Indexed } } }
  > { _zod: { def: { options: T['_zod']['def']['options'] } } }
  interface Tuple<
    T extends
    | { _zod: { def: { items: Z.Ordered } } }
    = { _zod: { def: { items: Z.Ordered } } }
  > { _zod: { def: { items: T['_zod']['def']['items'] } } }
  interface Object<
    T extends
    | { _zod: { def: { shape: Z.Named } } }
    = { _zod: { def: { shape: Z.Named } } }
  > { _zod: { def: { shape: T['_zod']['def']['shape'] } } }
}

// interface ProxyNullary extends HKT<{ _output: unknown }> { [-1]: Z.get.output<this[0]> }
// interface ProxyLiteral extends HKT { [-1]: Z.get.zodOutput<this[0]> }
// interface ProxyOptional extends HKT {
//   [-3]: this[0]['_zod']['def']['innerType'],
//   [-2]: this[-3]['_zod']['def']['type']
//   [-1]: this[-2]
//   // Kind<ProxyMap[Z.get.type<this[-2]> & keyof ProxyMap], this[-2]> 
// }
// interface ProxyArray extends HKT { [-1]: ProxyElement<Z.get.element<this[0]>> }
// type ProxyElement<T> = T
// interface ProxyRecord extends HKT {
//   [-1]: [ProxyKey<Z.get.keyType<this[0]>>, ProxyValue<Z.get.valueType<this[0]>>]
// }
// type ProxyKey<T> = T
// type ProxyValue<T> = T
// interface ProxyUnion extends HKT { [-1]: ProxyMembers<Z.get.options<this[0]>> }
// type ProxyMembers<T> = { [I in keyof T]: T[I] }
// interface ProxyTuple extends HKT { [-1]: ProxyItems<Z.get.items<this[0]>> }
// type ProxyItems<T> = never | { [I in keyof T]: T[I] }
// interface ProxyObject extends HKT { [-1]: ProxyShape<this[0]['_zod']['def']['shape']> }
// type ProxyShape<T> = never | { [P in keyof T as Optional<T, P>]: typeOf<T[P]> }
// type ProxyMap = {
//   never: ProxyNullary
//   unknown: ProxyNullary
//   any: ProxyNullary
//   void: ProxyNullary
//   undefined: ProxyNullary
//   null: ProxyNullary
//   boolean: ProxyNullary
//   number: ProxyNullary
//   string: ProxyNullary
//   literal: ProxyLiteral
//   optional: ProxyOptional
//   array: ProxyArray
//   record: ProxyRecord
//   union: ProxyUnion
//   tuple: ProxyTuple
//   object: ProxyObject
// }

type MakeProxy<Z> = typeOf<Z>

type typeOf<T>
  = [T] extends [Z.Object] ? t.object<T['_zod']['def']['shape']>
  : [T] extends [Z.Optional] ? t.optional<T['_zod']['def']['innerType']>
  : [T] extends [Z.Tuple] ? typeOfItems<T['_zod']['def']['items']>
  : [T] extends [Z.Union] ? UnionType<T['_zod']['def']['options']>
  : [T] extends [Z.Record] ? Record<T['_zod']['def']['keyType']['_output'], typeOf<T['_zod']['def']['valueType']>>
  : [T] extends [Z.Array] ? t.array<T['_zod']['def']['element']>
  : T['_output' & keyof T]

declare namespace t {
  export { t_object as object }
}
declare namespace t {
  interface t_object<S> extends newtype<{ [K in keyof S]: typeOf<S[K]> }> {}
  interface union<S> extends newtype<{ [I in keyof S]: typeOf<S[I]> }> {}
  interface prism<T extends [keyof any, unknown]> extends newtype<{ [E in T as E[0]]: { [K in keyof E[1]]: typeOf<E[1][K]> } }> {}

  interface optional<S> {
    ʔ: typeOf<S>
    ǃ: typeOf<S>
  }
  interface array<S> {
    ↆ: typeOf<S>
    map<T>(f: (x: typeOf<S>) => T): T
  }
}


type typeOfItems<T> = { [I in Extract<keyof T, `${number}`>]: typeOf<T[I]> }

type UnionType<
  T extends Z.Indexed,
  K extends keyof any = keyof T[number]['_zod']['def']['shape'],
  Disc extends keyof any = T[number]['_zod']['def']['shape'][K]['_output']
>
  = [K] extends [never] ? never | t.union<T>
  : never | t.prism<Disc extends Disc ? [Disc, Extract<T[number]['_zod']['def']['shape'], Record<K, { _output: Disc }>>] : never>
// { [P in Disc]: Extract<T[number]['_zod']['def']['shape'], Record<K, { _output: P }>> extends infer U ? { [K in keyof U]: typeOf<U[K]> } : never }
// : { [P in Disc]: Extract<T[number]['_zod']['def']['shape'], Record<K, { _output: P }>> extends infer U ? { [K in keyof U]: typeOf<U[K]> } : never }



declare function makeProxy<Z extends Z.Typed, T, P = MakeProxy<Z>>(type: Z, selector: (proxy: P) => T): (data: Z.infer<Z>) => Force<T>

// type __3 = typeOfOptions<[z.ZodObject<{ a: z.ZodLiteral<'A'>, b: z.ZodString }>, z.ZodObject<{ a: z.ZodLiteral<'B'>, c: z.ZodArray }>]>
// type __4 = typeOfOptions<[z.ZodObject<{ a: z.ZodLiteral<'A'> }>, z.ZodObject<{ b: z.ZodLiteral<'B'> }>]>

// const zsxs = makeProxy(
//   z.union([
//     z.object({
//       tag: z.literal('A'),
//       /** a stuff */
//       a: z.optional(z.array(z.string())),
//     }),
//     z.object({
//       tag: z.literal('B'),
//       /** b stuff */
//       b: z.optional(
//         z.object({
//           c: z.optional(z.null()),
//         })
//       )
//     }),
//   ]),
//   (xs) => xs
//   // .B.b.ʔ.c.ǃ
// )

// zsxs({ tag: 'A' }).A

// const xyss = makeProxy(
//   z.union([
//     z.object({
//       tag: z.literal('A'),
//       a: z.tuple([z.literal(1)]),
//     }),
//     z.object({
//       tag: z.literal('B'),
//       b: z.optional(z.boolean())
//     }),
//   ]),
//   ($) => $.B.b
// )

function prop<S, K extends keyof S>(key: K): (s: S) => [S[K], () => S]
function prop<S, K extends keyof S>(key: K) {
  return (value: S) => [get(value, [key]), () => value]
}

function match<S, A extends S>(predicate: (s: S) => s is A) {
  return (value: S) => [
    Either.fromPredicate(predicate)(value),
    () => value
  ] satisfies [any, any]
}
