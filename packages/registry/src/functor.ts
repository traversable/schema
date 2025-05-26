import type { Bind, Box, Boxed, Kind, HKT, HKT2 } from './hkt.js'
import type { Either } from './either.js'
import type { typeclass } from './symbol.js'

export class Fix<F extends Box.any> { constructor(public readonly value: Box<F, Fix<F>>) {} }
export function fix<F extends Box.any>(value: Box<F, Fix<F>>): Fix<F> { return new Fix(value) }
export function unfix<F extends Box.any>(term: Fix<F>): Box<F, Fix<F>> { return term.value }

export type IndexedAlgebra<Ix, F extends Box.any, T> = never | { (x: Box<F, T>, ix: Ix): T }

export type Algebra<F extends Box.any, T> = never | { (x: Box<F, T>): T }

export type Coalgebra<F extends Box.any, T> = never | { (x: T): Box<F, T> }

export type RAlgebra<F extends Box.any, T> = never | { (x: Box<F, Product<Box<F, T>, T>>): T }

export type RCoalgebra<F extends Box.any, T> = never | { (x: T): Box<F, Either<T, Fix<F>>> }

export type IndexedRAlgebra<Ix, F extends Box.any, T> = never | { (x: Kind.Product<F, T>, ix: Ix): T }

export type Product<X, Y> = never | [first: X, second: Y]

export interface Sum<F extends Box.any> extends HKT<[unknown, unknown]> { [-1]: Either<this[0][0], Box<F, this[0][1]>> }

export interface Profunctor<F extends Box.any> {
  dimap<S, T, A, B>(
    from: (s: S) => A,
    to: (b: B) => T,
  ): (F: Box<F, [A, B]>) => Box<F, [S, T]>
}

export interface Bifunctor<F extends HKT<[unknown, unknown]> = HKT<[unknown, unknown]>> {
  map<S, T>(f: (s: S) => T): <E>(F: Kind<F, [E, S]>) => Kind<F, [E, T]>
  mapLeft<D, E>(f: (d: D) => E): <T>(F: Kind<F, [D, T]>) => Kind<F, [E, T]>
}

/**
 * ## {@link Functor `Functor`}
 */
export interface Functor<F extends Box.any = Box.any, Fixpoint = Box<F, unknown>> extends Bind<F> {
  map<S, T>(f: (s: S) => T): (F: Box<F, S>) => Box<F, T>
}

export declare namespace Functor {
  export {
    Algebra,
    Coalgebra,
    IndexedAlgebra,
    RAlgebra,
    IndexedRAlgebra,
  }
  export type infer<T> = T extends Functor<infer F> ? Boxed<F> : never

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
  export interface Ix<Ix, F extends Box.any = Box.any, Fixpoint = Box<F, unknown>> extends Functor<F, Fixpoint> {
    mapWithIndex<S, T>(f: (s: S, ix: Ix) => T): (F: Box<F, S>, ix: Ix) => Box<F, T>
  }
}
