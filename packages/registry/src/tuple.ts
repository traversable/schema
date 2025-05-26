import type { Bind, HKT2 as HKT, Kind, TypeConstructor as F } from './hkt.js'
import type { Profunctor } from './functor.js'

export interface Tuple<F, S> extends Bind<F.Tuple> { [0]: F, [1]: S, [Symbol.iterator](): Iterator<F | S> }

export function first<A, B>(x: Tuple<A, B>): A { return x[0] }
export function second<A, B>(x: Tuple<A, B>): B { return x[1] }

export interface Strong<F extends HKT> extends Profunctor<F> {
  first<A, B, T>(F: Kind<F, Tuple<A, B>>): Kind<F, Tuple<Tuple<A, B>, Tuple<T, B>>>
  second<A, B, T>(F: Kind<F, Tuple<A, B>>): Kind<F, Tuple<Tuple<A, B>, Tuple<A, T>>>
}
