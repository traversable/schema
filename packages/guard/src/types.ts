import { symbol as Symbol } from './uri.js'

export type _ = never | unknown
export type inline<T> = never | T
export interface Predicate<in T = unknown> { (value: T): boolean }
export type Guard<T = unknown> = { (u: unknown): u is T }
export type Target<S> = S extends Guard<infer T> ? T : S extends Predicate<infer T> ? T : never
export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
export type Entry<T> = readonly [k: string, v: T]
export type Entries<T> = readonly Entry<T>[]
/** @ts-expect-error hush */
export interface newtype<T extends {} = {}> extends inline<T> { }
export type $<S> = [keyof S] extends [never] ? _ : S
export type { TypePredicate_ as TypePredicate }
type TypePredicate_<I, O> = never | TypePredicate<[I, O]>
interface TypePredicate<T extends [_, _]> { (u: T[0]): u is T[1] }

export interface HKT<I = unknown, O = unknown> extends newtype<{ [0]: I;[-1]: O }> { _applied?: _ }
export type bind<F extends HKT, T = unknown> = F & { [0]: T; _applied: true }
export type Kind<F extends HKT, T extends F[0] = F[0]> = (F & { [0]: T })[-1]
export declare namespace Kind {
  export { bind as of }
  // export type of<F extends HKT> = [F] extends [infer T extends F] ? T : never
  /**
   * ## {@link Kind.infer `Kind.infer`}
   *
   * Given a type constructor that was defined with {@link Kind.new}, infers the
   * type constructor.
   *
   * @example
   * import type { Kind } from "@traversable/registry"
   *
   *  interface ArrayFunctor extends HKT { [-1]: globalThis.Array<this[0]> }
   *  type ArrayKind = Kind.new<ArrayFunctor>
   *  type Test = Kind.infer<ArrayKind>
   *  //   ^? type Test = ArrayFunctor
   */
  export type infer<T> = T extends {
    0: T[0 & keyof T]
    _applied: T["_applied" & keyof T]
  } & (infer F extends HKT)
    ? F
    : never
}

type Algebra<F extends HKT, T> = never | { (term: Kind<F, T>): T }
type Coalgebra<F extends HKT, T> = never | { (expr: T): Kind<F, T> }

interface Typeclass<F extends HKT, _F = any> {
  readonly [Symbol.typeclass]?: 0 extends _F & 1 ? F : Extract<_F, HKT>
}

/**
 * ## {@link Functor `Functor`}
 */
export interface Functor<F extends HKT = HKT, _F = any> extends Typeclass<F, 0 extends _F & 1 ? F : _F> {
  map<S, T>(f: (s: S) => T): (F: Kind<F, S>) => Kind<F, T>
}

export declare namespace Functor {
  export { Algebra, Coalgebra }
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
