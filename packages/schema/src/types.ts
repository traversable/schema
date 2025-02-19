import { symbol as Symbol } from './uri.js'
import type { t } from './model.js'

export interface Predicate<T = unknown> { (value: T): boolean, (value?: T): boolean }
export interface Thunk<out T = unknown> { (): T }
export type Guard<T = unknown> = { (u: unknown): u is T }

type _3 = Guard<number>
type _4 = ((u: unknown) => u is number) extends _3 ? true : false

export type { TypePredicate_ as TypePredicate }
type TypePredicate_<I = unknown, O = unknown> = never | TypePredicate<[I, O]>

interface TypePredicate<T extends [unknown, unknown]> {
  (u: T[0]): u is T[1]
  (u: T[1]): boolean
}

type inline<T> = never | T
export type Primitive = null | undefined | symbol | boolean | number | bigint | string
export type Target<S> = S extends Guard<infer T> ? T : S extends Predicate<infer T> ? T : never
export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
export type Entry<T> = readonly [k: string, v: T]
export type Entries<T> = readonly Entry<T>[]
/** @ts-expect-error hush */
export interface newtype<T extends {} = {}> extends inline<T> { }
export type $<S> = [keyof S] extends [never] ? unknown : S
export type Param<T> = T extends (_: infer I) => unknown ? I : never
export type Intersect<X, _ = unknown> = X extends readonly [infer H, ...infer T] ? Intersect<T, _ & H> : _
export type Conform<S, T, U, _ extends Extract<S, T> = Extract<S, T>> = [_] extends [never] ? Extract<U, S> : _

export interface HKT<I = unknown, O = unknown> extends newtype<{ [0]: I;[-1]: O }> { _applied?: unknown }
export type Kind<F extends HKT, T extends F[0] = F[0]> = (F & { [0]: T })[-1]
export declare namespace Kind {
  export type infer<G extends HKT, T extends G[0] = never> = G extends {
    0: G[0 & keyof G]
    _applied: G["_applied" & keyof G]
  } & (infer F extends HKT)
    ? F
    : never
}

type Algebra<F extends HKT, T> = never | { (term: Kind<F, T>): T }
type Coalgebra<F extends HKT, T> = never | { (expr: T): Kind<F, T> }
type IndexedAlgebra<Ix, F extends HKT, T> = never | { (term: Kind<F, T>, ix: Ix): T }

interface Typeclass<F extends HKT, _F = any> {
  readonly _F?: 0 extends _F & 1 ? F : Extract<_F, HKT>
}

/**
 * ## {@link Functor `Functor`}
 */
export interface Functor<F extends HKT = HKT, _F = any> extends Typeclass<F, 0 extends _F & 1 ? F : _F> {
  map<S, T>(f: (s: S) => T): (F: Kind<F, S>) => Kind<F, T>
}

export interface IndexedFunctor<Ix, F extends HKT = HKT, _F = any> extends Functor<F, _F> {
  mapWithIndex<S, T>(f: (s: S, ix: Ix) => T): (F: Kind<F, S>, ix: Ix) => Kind<F, T>
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

  interface Invariant<F extends HKT = HKT> {
    imap<A, B>(F: Kind<F, A>, to: (a: A) => B, from: (b: B) => A): Kind<F, B>
    imap<A, B>(to: (a: A) => B, from: (b: B) => A): (F: Kind<F, A>) => Kind<F, B>
  }

  interface Covariant<F extends HKT = HKT> {
    // map<A, B>(f: (a: A) => B): (F: Kind<F, A>) => Kind<F, B>
    map<A, B>(F: Kind<F, A>, f: (a: A) => B): Kind<F, B>
  }
}

export interface Const<T = unknown> extends HKT { [-1]: T }
export interface Identity extends HKT { [-1]: this[0] }

export interface TypeError<Msg extends string = string> extends newtype<{ [K in Msg]: Symbol.type_error }> { }
export type InvalidItem = never | TypeError<'A required element cannot follow an optional element.'>

export type ValidateTuple<
  T extends readonly unknown[],
  V = ValidateOptionals<[...T]>
> = [V] extends [['ok']] ? T : V

type ValidateOptionals<S extends unknown[], Acc extends unknown[] = []>
  = t.Optional<any> extends S[number]
  ? S extends [infer H, ...infer T]
  ? t.Optional<any> extends H
  ? T[number] extends t.Optional<any>
  ? ['ok']
  : [...Acc, H, ...{ [Ix in keyof T]: T[Ix] extends t.Optional<any> ? T[Ix] : InvalidItem }]
  : ValidateOptionals<T, [...Acc, H]>
  : ['ok']
  : ['ok']
  ;

export type Label<S extends readonly unknown[], T = S['length'] extends keyof Labels ? Labels[S['length']] : never>
  = never | [T] extends [never]
  ? { [ix in keyof S]: S[ix] }
  : { [ix in keyof T]: S[ix & keyof S] }
  ;

export type _ = never
export interface Labels {
  1: readonly [ᙚ?: _]
  2: readonly [ᙚ?: _, ᙚ?: _]
  3: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _]
  4: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  5: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  6: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  7: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  8: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  9: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
}
