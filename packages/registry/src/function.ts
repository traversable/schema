import type { Functor, Kind, HKT } from './types.js'
import type { FiniteArray, FiniteObject, NonFiniteArray, NonFiniteObject } from './satisfies.js'
import { Array_isArray, Object_create, Object_keys } from './globalThis.js'

export const identity
  : <T>(x: T) => T
  = (x) => x

export { const_ as const }
export const const_
  : <T>(x: T) => <S>(y?: S) => T
  = (x) => () => x

/** 
 * ## {@link ana `fn.ana`}
 * 
 * Short for _anamorphism_. Dual of {@link cata `fn.cata`}.
 * 
 * Repeatedly apply a "reduce" or _fold_ operation to a functor instance using 
 * co-recursion. 
 * 
 * Since the operation is co-recursive, in practice, you're typically building _up_
 * a data structure (like a tree).
 * 
 * The nice thing about using an anamorphism is that it lets you write the operation
 * without having to worry about the recursive bit. 
 * 
 * tl,dr: 
 * 
 * If you can write a `map` function for the data structure you're targeting, then
 * just give that function to {@link ana `fn.any`} along with the non-recursive
 * operation you want performed, and it will take care of repeatedly applying the
 * operation (called a "coalgebra") to the data structure, returning you the final
 * result.
 * 
 * See also:
 * - the [Wikipedia page](https://en.wikipedia.org/wiki/Anamorphism) on anamorphisms
 * - {@link cata `fn.cata`}
 */

export function ana<F extends HKT, Fixpoint>(Functor: Functor<F, Fixpoint>):
  <T>(coalgebra: Functor.Coalgebra<F, T>)
    => <S extends Fixpoint>(expr: S)
      => Kind<F, T>

/// impl.
export function ana<F extends HKT>(F: Functor<F>) {
  return <T>(coalgebra: Functor.Coalgebra<F, T>) => {
    return function loop(expr: T): Kind<F, T> {
      return F.map(loop)(coalgebra(expr))
    }
  }
}

/** 
 * # {@link cata `cata`}
 * 
 * Short for _catamorphism_. Dual of {@link ana `ana`}.
 * 
 * See also:
 * - the [Wikipedia page](https://en.wikipedia.org/wiki/Catamorphism) on catamorphisms
 * - {@link ana `ana`}
 */
export function cata<F extends HKT, Fixpoint>(Functor: Functor<F, Fixpoint>):
  <T>(algebra: Functor.Algebra<F, T>)
    => <S extends Fixpoint>(term: S)
      => T

export function cata<F extends HKT>(F: Functor<F>) {
  return <T>(algebra: Functor.Algebra<F, T>) => {
    return function loop(term: Kind<F, T>): T {
      return algebra(F.map(loop)(term))
    }
  }
}

export function cataIx
  <Ix, F extends HKT, Fixpoint>(IxFunctor: Functor.Ix<Ix, F, Fixpoint>):
  <T>(algebra: Functor.IndexedAlgebra<Ix, F, T>)
    => <S extends Fixpoint>(term: S, ix: Ix)
      => T

export function cataIx
  <Ix, F extends HKT, Fixpoint>(IxFunctor: Functor.Ix<Ix, F, Fixpoint>, initialIndex: Ix):
  <T>(algebra: Functor.IndexedAlgebra<Ix, F, T>)
    => <S extends Fixpoint>(term: S, ix?: Ix)
      => T

export function cataIx<Ix, F extends HKT, Fixpoint>(F: Functor.Ix<Ix, F, Fixpoint>, initialIndex?: Ix) {
  return <T>(g: Functor.IndexedAlgebra<Ix, F, T>) => {
    return function loop(x: Kind<F, T>, ix: Ix): T {
      return g(F.mapWithIndex(loop)(x, ix ?? initialIndex!), ix)
    }
  }
}

export function hylo
  <F extends HKT>(F: Functor<F>):
  <S, T>(
    algebra: Functor.Algebra<F, T>,
    coalgebra: Functor.Coalgebra<F, S>
  ) => (s: S)
      => T

export function hylo<F extends HKT>(Functor: Functor<F>) {
  return <S, T>(
    algebra: Functor.Algebra<F, T>,
    coalgebra: Functor.Coalgebra<F, S>
  ) => (s: S) => {
    const g = Functor.map(hylo(Functor)(algebra, coalgebra))
    return algebra(g(coalgebra(s)))
  }
}

export function para
  <F extends HKT, Fixpoint>(F: Functor<F, Fixpoint>):
  <T>(g: Functor.RAlgebra<F, T>)
    => <S extends Fixpoint>(term: S)
      => T

export function para
  <F extends HKT, Fixpoint>(F: Functor<F, Fixpoint>):
  <T>(g: Functor.RAlgebra<F, T>)
    => <S extends Fixpoint>(term: S)
      => T

export function para<F extends HKT>(F: Functor<F>) {
  return <T>(g: Functor.RAlgebra<F, T>) => {
    function fanout(term: T): Kind<F, [F, T]> { return [term, para(F)(g)(term)] }
    return flow(F.map(fanout), g)
  }
}

export function catamorphism<Ix, F extends HKT, Fix>(F: Functor.Ix<Ix, F, Fix>, initialIndex: NoInfer<Ix>) {
  return <T>(g: (src: Kind<F, T>, ix: Ix, x: Kind<F, Fix>) => T) => {
    return function loop(src: Kind<F, T>, ix: Ix): T {
      return g(F.mapWithIndex(loop)(src, ix ?? initialIndex), ix ?? initialIndex, src)
    }
  }
}

type MapFn<S, T, K extends keyof S = KeyOf<S>> = (src: S[K], k: K, xs: S) => T
type KeyOf<T> = T extends readonly unknown[] ? number & keyof T : keyof T

export function map<S, T>(f: MapFn<S, T>): Lift<S, T>
export function map<S extends FiniteArray<S>, T>(src: S, mapfn: (x: S[number], ix: number, xs: S) => T): Map<S, T>
export function map<S extends FiniteObject<S>, T>(src: S, mapfn: (x: S[keyof S], ix: keyof S, xs: S) => T): Map<S, T>
export function map<S extends NonFiniteArray<S>, T>(src: S, mapfn: (x: S[number], ix: number, xs: S) => T): Map<S, T>
export function map<S extends NonFiniteObject<S>, T>(src: S, mapfn: (x: S[keyof S], ix: string, xs: S) => T): Map<S, T>
export function map<S extends {}, T>(src: S, mapfn: (x: S[keyof S], ix: string, xs: S) => T): Map<S, T>
export function map(
  ...args: [mapfn: any] | [src: any, mapfn: any]
): {} {
  if (typeof args[0] === 'function') return (src: any) => map(src, args[0])
  else {
    const [src, mapfn] = args
    if (Array_isArray(src)) return src.map(mapfn as never)
    const ks = Object_keys(src)
    let out: { [x: string]: unknown } = Object_create(null)
    let k: string | undefined
    while ((k = ks.shift()) !== undefined) out[k] = mapfn(src[k], k, src)
    return out
  }
}

export type Map<S, T> = Kind<MapTo<T>, S>
export type Lift<S, T> = unknown extends S ? Homomorphism<S, T> : (xs: S) => { [K in keyof S]: T }

export interface MapTo<S> extends HKT {
  [-1]: [this[0]] extends [MapTo<S>[0] & infer T] ? { [K in keyof T]: S } : never
}

export interface Homomorphism<S = any, T = unknown> extends MapTo<T> {
  <const R extends { [K in keyof R]: S }>(x: R): Kind<this, R>
  <const R extends Partial<readonly R[]>>(x: R): Kind<this, R>
}

export const exhaustive
  : <_ extends never = never>(..._: _[]) => _
  = (..._) => { throw Error('Exhaustive match failed') }

export const assertIsNotCalled
  : <_ extends void = void>(..._: _[]) => never
  = (..._) => { throw Error('Exhaustive match failed') }

export const fanout
  : <A, B, C>(ab: (a: A) => B, ac: (a: A) => C) => (a: A) => [B, C]
  = (ab, ac) => (a) => [ab(a), ac(a)]

export function flow<A extends readonly unknown[], B>(ab: (...a: A) => B): (...a: A) => B
export function flow<A extends readonly unknown[], B, C>(ab: (...a: A) => B, bc: (b: B) => C): (...a: A) => C
export function flow<A extends readonly unknown[], B, C, D>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (...a: A) => D
export function flow<A extends readonly unknown[], B, C, D, E>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E): (...a: A) => E
export function flow(
  ...args:
    | [ab: Function]
    | [ab: Function, bc: Function]
    | [ab: Function, bc: Function, cd: Function]
    | [ab: Function, bc: Function, cd: Function, de: Function]
) {
  switch (true) {
    default: return void 0
    case args.length === 1: return args[0]
    case args.length === 2: return function (this: unknown) { return args[1](args[0].apply(this, arguments)) }
    case args.length === 3: return function (this: unknown) { return args[2](args[1](args[0].apply(this, arguments))) }
    case args.length === 4: return function (this: unknown) { return args[3](args[2](args[1](args[0].apply(this, arguments)))) }
  }
}

interface Fn extends globalThis.Function {}
type _ = unknown

export { pipe }
function pipe(): void
function pipe<const A>(a: A): A
function pipe<const A, B>(a: A, ab: (a: A) => B): B
function pipe<const A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C
function pipe<const A, B, C, D>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D): D
function pipe<const A, B, C, D, E>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E
): E
function pipe<const A, B, C, D, E, F>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F
): F
function pipe<const A, B, C, D, E, F, G>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G
): G
function pipe<const A, B, C, D, E, F, G, H>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H
): H
function pipe<const A, B, C, D, E, F, G, H, I>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I
): I
function pipe<const A, B, C, D, E, F, G, H, I, J>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J
): J
function pipe<const A, B, C, D, E, F, G, H, I, J, K>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K
): K
function pipe<const A, B, C, D, E, F, G, H, I, J, K, L>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (k: K) => L
): L
function pipe<const A, B, C, D, E, F, G, H, I, J, K, L, M>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (k: K) => L,
  lm: (l: L) => M
): M
function pipe<const A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (k: K) => L,
  lm: (l: L) => M,
  mn: (m: M) => N
): N
function pipe<const A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (k: K) => L,
  lm: (l: L) => M,
  mn: (m: M) => N,
  no: (n: N) => O
): O
function pipe<const A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (k: K) => L,
  lm: (l: L) => M,
  mn: (m: M) => N,
  no: (n: N) => O,
  op: (o: O) => P
): P
function pipe<const A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (k: K) => L,
  lm: (l: L) => M,
  mn: (m: M) => N,
  no: (n: N) => O,
  op: (o: O) => P,
  pq: (p: P) => Q
): Q
function pipe<const A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (k: K) => L,
  lm: (l: L) => M,
  mn: (m: M) => N,
  no: (n: N) => O,
  op: (o: O) => P,
  pq: (p: P) => Q,
  qr: (q: Q) => R
): R
function pipe<const A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (k: K) => L,
  lm: (l: L) => M,
  mn: (m: M) => N,
  no: (n: N) => O,
  op: (o: O) => P,
  pq: (p: P) => Q,
  qr: (q: Q) => R,
  rs: (r: R) => S
): S
function pipe<const A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
  ij: (i: I) => J,
  jk: (j: J) => K,
  kl: (k: K) => L,
  lm: (l: L) => M,
  mn: (m: M) => N,
  no: (n: N) => O,
  op: (o: O) => P,
  pq: (p: P) => Q,
  qr: (q: Q) => R,
  rs: (r: R) => S,
  st: (s: S) => T
): T
function pipe(
  ...a:
    | [_]
    | [_, Fn]
    | [_, Fn, Fn]
    | [_, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
    | [_, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn, Fn]
): unknown {
  switch (true) {
    case a.length === 1:
      return a[0]
    case a.length === 2:
      return a[1](a[0])
    case a.length === 3:
      return a[2](a[1](a[0]))
    case a.length === 4:
      return a[3](a[2](a[1](a[0])))
    case a.length === 5:
      return a[4](a[3](a[2](a[1](a[0]))))
    case a.length === 6:
      return a[5](a[4](a[3](a[2](a[1](a[0])))))
    case a.length === 7:
      return a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))
    case a.length === 8:
      return a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))
    case a.length === 9:
      return a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))
    case a.length === 10:
      return a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))
    case a.length === 11:
      return a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))
    case a.length === 12:
      return a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))
    case a.length === 13:
      return a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))))
    case a.length === 14:
      return a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))))
    case a.length === 15:
      return a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))))))
    case a.length === 16:
      return a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))))))
    case a.length === 17:
      return a[16](a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))))))))
    case a.length === 18:
      return a[17](a[16](a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))))))))
    case a.length === 19:
      return a[18](a[17](a[16](a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0]))))))))))))))))))
    case a.length === 20:
      return a[19](a[18](a[17](a[16](a[15](a[14](a[13](a[12](a[11](a[10](a[9](a[8](a[7](a[6](a[5](a[4](a[3](a[2](a[1](a[0])))))))))))))))))))
    default: {
      const args: Fn[] = a
      let ret: unknown = args[0]
      for (let ix = 1, len = args.length; ix < len; ix++) ret = args[ix](ret)
      return ret
    }
  }
}
