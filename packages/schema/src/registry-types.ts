import type * as symbol from './symbol.js'

export type inline<T> = never | T

/** @ts-expect-error hush */
export interface newtype<T extends {} = {}> extends inline<T> { }

export interface TypeError<Msg extends string = string>
  extends newtype<{ [K in Msg]: symbol.type_error }> { }

export declare namespace TypeError {
  interface Unary<Msg extends string = string, T = {}>
    extends newtype<{ [K in Msg]: symbol.type_error } & T> { }
}


export interface HKT<I = unknown, O = unknown> extends newtype<{ [0]: I, [-1]: O }> { _applied?: unknown }

export type Kind<F extends HKT, T extends F[0] = F[0]> = (F & { [0]: T })[-1]

export declare namespace Kind {
  export type Product<F extends HKT, T> = Kind<F, Tuple<Kind<F, T>, T>>
  export type Coproduct<F extends HKT, T> = Kind<F, Either<Kind<F, T>, T>>

  export type infer<G extends HKT> = G extends
    & { [0]: G[0 & keyof G]; _applied: G["_applied" & keyof G] }
    & (infer F extends HKT)
    ? F
    : never
}

export type Tuple<F, S> = never
  | [first: F, second: S]

export type Either<L, R> = never
  | [tag: false, left: L]
  | [tag: true, right: R]

export interface Comparator<in T> { (left: T, right: T): number }
export interface Equal<in T> { (left: T, right: T): boolean; }
export interface Dictionary<T = unknown> { [x: string]: T }

interface Record<K extends keyof any = string, V = unknown> extends newtype<globalThis.Record<K, V>> { }
interface Array<T = unknown> extends newtype<T[]> { }
interface ReadonlyArray<T = unknown> extends newtype<readonly T[]> { }

export declare namespace Type {
  export {
    Comparator,
    Equal,
    Dictionary,
    Array,
    Record,
    ReadonlyArray,
  }
}

export interface Const<T = unknown> extends HKT { [-1]: T }
export interface Identity extends HKT { [-1]: this[0] }

export declare namespace TypeConstructor { export { Const, Identity } }
export declare namespace TypeConstructor {
  interface Eq extends HKT { [-1]: Type.Equal<this[0]> }
  interface Comparator extends HKT { [-1]: Type.Comparator<this[0]> }
  interface Duplicate extends HKT { [-1]: [this[0], this[0]] }
  interface Array extends HKT { [-1]: Type.Array<this[0]> }
  interface ReadonlyArray extends HKT { [-1]: Type.ReadonlyArray<this[0]> }
  interface Record extends HKT<[keyof any, unknown]> { [-1]: Type.Record<this[0][0], this[0][1]> }
  interface Dictionary extends HKT { [-1]: Type.Dictionary<this[0]> }
}


export type Algebra<F extends HKT, T> = never | { (term: Kind<F, T>): T }
export type IndexedAlgebra<Ix, F extends HKT, T> = never | { (term: Kind<F, T>, ix: Ix): T }
export type Coalgebra<F extends HKT, T> = never | { (expr: T): Kind<F, T> }
export type RAlgebra<F extends HKT, T> = never | { (term: Kind.Product<F, T>): T }
export type IndexedRAlgebra<Ix, F extends HKT, T> = never | { (term: Kind.Product<F, T>, ix: Ix): T }

/**
 * ## {@link Functor `Functor`}
 */
export interface Functor<F extends HKT = HKT, Fixpoint = Kind<F, unknown>> {
  map<S, T>(f: (s: S) => T): (F: Kind<F, S>) => Kind<F, T>
}

export declare namespace Functor {
  export {
    Algebra,
    Coalgebra,
    IndexedAlgebra,
    RAlgebra,
    IndexedRAlgebra,
  }
  /**
   * ## {@link Ix `Functor.Ix`}
   * 
   * A {@link Functor `Functor`} that has been equipped with an index.
   * 
   * In addition to `map`, instances of {@link Ix `Functor.Ix`} also implement a method called
   * `mapWithIndex` that will provide to its callback argument an additional parameter, `ix`.
   * 
   * Note that `ix` does not have to be a number. If the source data type is a record, `ix`
   * would be a `string`. For a tree, the index might be a path.
   * 
   * The nice thing about separating the "index" logic into a functor is that it clearly delineates
   * who is responsible for what: 
   * 
   * - When defining a {@link Ix `Functor.Ix`} instance, it's your responsibility to
   * 
   *   1. keep track of the index
   *   2. make sure updates to the index are deterministic
   *   3. provide the index to the caller
   *   4. define its semantics, and communicate them clearly
   */
  export interface Ix<Ix, F extends HKT = HKT, Fixpoint = Kind<F, unknown>> extends Functor<F, Fixpoint> {
    mapWithIndex<S, T>(f: (s: S, ix: Ix) => T): (F: Kind<F, S>, ix: Ix) => Kind<F, T>
  }
}

// data types
export type Primitive = null | undefined | symbol | boolean | bigint | number | string
export type Showable = null | undefined | boolean | bigint | number | string
export type Entry<T> = readonly [k: string, v: T]
export type Entries<T = unknown> = readonly Entry<T>[]

// transforms
export type Force<T> = never | { -readonly [K in keyof T]: T[K] }
export type Intersect<X, _ = unknown> = X extends readonly [infer H, ...infer T] ? Intersect<T, _ & H> : _

// infererence
export type Param<T> = T extends (_: infer I) => unknown ? I : never
export type Returns<T> = T extends (_: never) => infer O ? O : never
export type Conform<S, T, U, _ extends Extract<S, T> = Extract<S, T>> = [_] extends [never] ? Extract<U, S> : _

export type UnionToIntersection<
  T,
  U = (T extends T ? (contra: T) => void : never) extends (contra: infer U) => void ? U : never,
> = U

export type UnionToTuple<U, _ = Thunk<U> extends () => infer X ? X : never> = UnionToTuple.loop<[], U, _>
export declare namespace UnionToTuple {
  type loop<Todo extends readonly unknown[], U, _ = Thunk<U> extends () => infer X ? X : never> = [
    U,
  ] extends [never]
    ? Todo
    : loop<[_, ...Todo], Exclude<U, _>>
}

type Thunk<U> = (U extends U ? (_: () => U) => void : never) extends (_: infer _) => void ? _ : never

export type Join<
  T,
  D extends string,
  Out extends string = ''
> = T extends [infer H extends string, ...infer T]
  ? Join<T, D, `${Out extends '' ? '' : `${Out}${D}`}${H}`>
  : Out


export type Atoms = [
  Date,
  RegExp,
]

/**
 * ## {@link Mut `Mut`}
 * 
 * Applies an inductive constraint to a type parameter such that 
 * its instantiations are all "mutable".
 * 
 * This isn't a pattern I've seen used elsewhere in the wild, but
 * I suspect that it's more efficient that applying a transformation
 * to a previously declared type parameter to force it to be mutable.
 * 
 * Because {@link Mut `Mut`} is an "inductive constraint", the compiler
 * applies the transformation _while_ instantiating its initial value.
 * 
 * @example
 * import { Mut } from '@traversable/registry'
 * 
 * // BEFORE:
 * declare function defineImmutable<const T>(x: T): T
 * const ex_01 = defineImmutable([1, [2, { x: [3, { y: { z: [4] } } ] } ] ])
 * ex_01
 * // ^? const ex_01: readonly [1, readonly [2, readonly [3, { readonly x: readonly [4, { readonly y: { readonly z: readonly [5] } } ] } ] ] ]
 * 
 * // AFTER:
 * declare function defineMutable<const T extends Mut<T>>(x: T): T
 * //                                   ^^^^^^^^^^^^^^^^  note how Mut is applied to T in T's own 'extends' clause
 * 
 * const ex_02 = defineMutable([1, [2, { x: [3, { y: { z: [4] } } ] } ] ])
 * ex_02
 * // ^? const ex_02: [1, [2, [3, { x: [4, { y: { z: [5, [6, [7] ] ] } } ] } ] ] ]
 * 
 */
export type Mut<T, Atom = Atoms[number]>
  = [T] extends [infer U extends Primitive] ? U
  : [T] extends [infer U extends Atom] ? U
  : { -readonly [ix in keyof T]: Mut<T[ix], Atom> }

export type Mutable<T> = never | { -readonly [K in keyof T]: T[K] }

export type NonUnion<
  T,
  _ extends
  | ([T] extends [infer _] ? _ : never)
  = ([T] extends [infer _] ? _ : never)
> = _ extends _ ? [T] extends [_] ? _ : never : never

