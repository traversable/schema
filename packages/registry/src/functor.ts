import type { Kind, HKT } from './hkt.js'

export type Algebra<F extends HKT, T> = never | { (term: Kind<F, T>): T }
export type IndexedAlgebra<Ix, F extends HKT, T> = never | { (src: Kind<F, T>, ix: Ix): T }
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
  export interface Ix<Ix, F extends HKT = HKT, Fix = Kind<F, unknown>> extends Functor<F, Fix> {
    mapWithIndex<S, T>(f: (src: S, ix: Ix, x: Kind<F, S>) => T): (x: Kind<F, S>, ix: Ix) => Kind<F, T>
  }
}
