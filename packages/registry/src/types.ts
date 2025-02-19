import type { symbol as Symbol } from './uri.js'

export type Primitive = null | undefined | symbol | boolean | number | bigint | string
export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
export type Entry<T> = readonly [k: string, v: T]
export type Entries<T> = readonly Entry<T>[]
export type Param<T> = T extends (_: infer I) => unknown ? I : never
export type Intersect<X, _ = unknown> = X extends readonly [infer H, ...infer T] ? Intersect<T, _ & H> : _
export type inline<T> = never | T

/** @ts-expect-error hush */
export interface newtype<T extends {} = {}> extends inline<T> { }
export interface TypeError<Msg extends string = string> extends newtype<{ [K in Msg]: Symbol.type_error }> { }

export interface HKT<I = unknown, O = unknown> extends newtype<{ [0]: I;[-1]: O }> { _applied?: unknown }
export type Kind<F extends HKT, T extends F[0] = F[0]> = (F & { [0]: T })[-1]

export declare namespace Kind {
  export type infer<G extends HKT> = G extends
    & { [0]: G[0 & keyof G]; _applied: G["_applied" & keyof G] }
    & (infer F extends HKT)
    ? F
    : never
}

export interface Const<T = unknown> extends HKT { [-1]: T }
export interface Identity extends HKT { [-1]: this[0] }

interface Typeclass<F extends HKT, _F = any> {
  readonly _F?: 0 extends _F & 1 ? F : Extract<_F, HKT>
}

export interface IndexedFunctor<Ix, F extends HKT = HKT, _F = any> extends Functor<F, _F> {
  mapWithIndex<S, T>(f: (s: S, ix: Ix) => T): (F: Kind<F, S>, ix: Ix) => Kind<F, T>
}

/**
 * ## {@link Functor `Functor`}
 */
export interface Functor<F extends HKT = HKT, _F = any> extends Typeclass<F, 0 extends _F & 1 ? F : _F> {
  map<S, T>(f: (s: S) => T): (F: Kind<F, S>) => Kind<F, T>
}

export declare namespace Functor {
  export { Algebra, IndexedAlgebra, Coalgebra }
  export type infer<T> = T extends Functor<any, infer F> ? Exclude<F, undefined> : never
}
export declare namespace Functor {
  type map<F extends HKT> =
    | never
    | {
      <S, T>(F: Kind<F, S>, f: (s: S) => T): Kind<F, T>
      <S, T>(f: (s: S) => T): { (F: Kind<F, S>): Kind<F, T> }
    }
}

export type Algebra<F extends HKT, T> = never | { (term: Kind<F, T>): T }
export type Coalgebra<F extends HKT, T> = never | { (expr: T): Kind<F, T> }
export type IndexedAlgebra<Ix, F extends HKT, T> = never | { (term: Kind<F, T>, ix: Ix): T }


