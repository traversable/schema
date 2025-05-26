import type { Algebra, Box, Boxed, F, Coalgebra, RAlgebra, IndexedAlgebra, Functor } from './types.js'
import type { EmptyObject, FiniteArray, FiniteObject, NonFiniteArray, NonFiniteObject } from './satisfies.js'
import { Array_isArray, Object_create, Object_keys } from './globalThis.js'

export const identity
  : <T>(x: T) => T
  = (x) => x

export { const_ as const }
export const const_
  : <T>(x: T) => <S>(y?: S) => T
  = (x) => () => x

/** 
 * ## {@link liftA2 `fn.liftA2`}
 * 
 * @example
 * import type { Box, Boxed, F } from '@traversable/registry'
 * import { fn } from '@traversable/registry'
 * 
 * declare const fx: Box<F.Array, number>
 * declare const fy: Box<F.Array, string>
 * 
 * const ap2 = liftA2(fx, fy)
 * // const ap2: <C>(f: (a: number, b: string) => C) => Array<C>
 * 
 * const xy = ap2((x, y) => ({ x, y }))
 * //    ^? const xy:  Array<{ x: number, y: string }>
 */

export type liftA2<
  Fx extends Box.any,
  Fy extends Box.any,
  A extends Boxed<Fx>,
  B extends Boxed<Fy>,
  F = Box.from<Fx & Fy>
> = never | { <C>(f: (a: A, b: B) => C): Box<F, C> }

/** 
 * @internal 
 * 
 * TODO: need to figure out how to get `F.map` -- probably will need to
 * have the user explicitly pass in the Functor they want to use
 */
declare function liftA2<
  Fx extends Box.any,
  Fy extends Box.any,
  A extends Boxed<Fx>,
  B extends Boxed<Fy>
>(fx: Fx, fy: Fy): liftA2<Fx, Fy, A, B>

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

export function ana<F extends Box.any, Fixpoint>(F: Functor<F, Fixpoint>): <T>(g: Coalgebra<F, T>) => <S extends Fixpoint>(expr: S) => Box<F, T>
export function ana<F extends Box.any>(F: Functor<F>) {
  return <T>(g: Coalgebra<F, T>) => {
    return function loop(expr: T): Box<F, T> {
      return F.map(loop)(g(expr))
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
export function cata<F extends Box.any, Fixpoint>(F: Functor<F, Fixpoint>): <T>(g: Algebra<F, T>) => <S extends Fixpoint>(x: S) => T
export function cata<F extends Box.any>(F: Functor<F>) {
  return <T>(g: Algebra<F, T>) => {
    return function loop(x: Box<F, T>): T {
      return g(F.map(loop)(x))
    }
  }
}

export function cataIx<Ix, F extends Box.any, Fixpoint>(Ix: Functor.Ix<Ix, F, Fixpoint>):
  <T>(g: IndexedAlgebra<Ix, F, T>) => <S extends Fixpoint>(x: S, ix: Ix) => T

export function cataIx
  <Ix, F extends Box.any, Fixpoint>(Ix: Functor.Ix<Ix, F, Fixpoint>, initialIndex: Ix):
  <T>(g: IndexedAlgebra<Ix, F, T>)
    => <S extends Fixpoint>(x: S, ix?: Ix)
      => T

export function cataIx<Ix, F extends Box.any, Fixpoint>(Ix: Functor.Ix<Ix, F, Fixpoint>, initialIndex?: Ix) {
  return <T>(g: IndexedAlgebra<Ix, F, T>) => {
    return function loop(x: Box<F, T>, ix: Ix): T {
      return g(Ix.mapWithIndex(loop)(x, ix ?? initialIndex!), ix)
    }
  }
}

export function hylo<F extends Box.any>(F: Functor<F>): <S, T>(f: Algebra<F, T>, h: Coalgebra<F, S>) => (s: S) => T
export function hylo<F extends Box.any>(F: Functor<F>) {
  return <S, T>(
    f: Algebra<F, T>,
    h: Coalgebra<F, S>
  ) => (s: S) => {
    const g = F.map(hylo(F)(f, h))
    return f(g(h(s)))
  }
}

export function para<F extends Box.any, Fixpoint>(F: Functor<F, Fixpoint>): <T>(g: RAlgebra<F, T>) => <S extends Fixpoint>(term: S) => T
export function para<F extends Box.any>(F: Functor<F>) {
  return <T>(g: RAlgebra<F, T>) => {
    function fanout(x: T): Box<F, [F, T]> { return [x, para(F)(g)(x)] }
    return flow(F.map(fanout), g)
  }
}

export const fanout
  : <A, B, C>(ab: (a: A) => B, ac: (a: A) => C) => (a: A) => [B, C]
  = (ab, ac) => (a) => [ab(a), ac(a)]

export function paraIx
  <Ix, F extends Box.any, Fixpoint>(F: Functor.Ix<Ix, F, Fixpoint>):
  <T>(ralgebra: Functor.RAlgebra<F, T>)
    => <S extends Fixpoint>(term: S, ix: Ix)
      => T

export function paraIx<Ix, F extends Box.any>(F: Functor.Ix<Ix, F>) {
  return <T>(ralgebra: Functor.RAlgebra<F, T>) => {
    function fanout(term: T, ix: Ix): Box<F, [F, T]> { return [term, paraIx(F)(ralgebra)(term, ix)] }
    return flow(
      F.mapWithIndex(fanout),
      ralgebra,
    )
  }
}

type MapFn<S, T, K extends keyof S = KeyOf<S>> = (src: S[K], k: K, xs: S) => T
type KeyOf<T> = T extends readonly unknown[] ? number & keyof T : keyof T
export interface MapTo<S> extends Box.any { [-1]: [this[0]] extends [MapTo<S>[0] & infer T] ? { [K in keyof T]: S } : never }
export type Lift<S, T> = unknown extends S ? Homomorphism<S, T> : (xs: S) => { [K in keyof S]: T }
export type Map<S, T> = Box<MapTo<T>, S>
export interface Homomorphism<S = any, T = unknown> extends MapTo<T> {
  <const R extends { [K in keyof R]: S }>(x: R): Box<this, R>
  <const R extends Partial<readonly R[]>>(x: R): Box<this, R>
}


type Top<T> = [{} | null | undefined] extends [T] ? unknown : never
type Bottom<T> = [T] extends [never] ? unknown : never

export function map<S extends Top<S>, T>(f: MapFn<S, T>): Homomorphism<S, T>
export function map<S, T>(f: MapFn<S, T>): (xs: S) => { [K in keyof S]: T }
export function map<S extends EmptyObject<S>, T>(src: S, mapfn: (x: S[keyof S], ix: string, xs: S) => T): Map<S, T>
export function map<S extends FiniteArray<S>, T>(src: S, mapfn: (x: S[number], ix: number, xs: S) => T): Map<S, T>
export function map<S extends FiniteObject<S>, T>(src: S, mapfn: (x: S[keyof S], ix: keyof S, xs: S) => T): Map<S, T>
export function map<S extends NonFiniteArray<S>, T>(src: S, mapfn: (x: S[number], ix: number, xs: S) => T): Map<S, T>
export function map<S extends NonFiniteObject<S>, T>(src: S, mapfn: (x: S[keyof S], ix: string, xs: S) => T): Map<S, T>
export function map<S extends {}, T>(src: S, mapfn: (x: S[keyof S], ix: keyof S, xs: S) => T): Map<S, T>
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

export const exhaustive
  : <_ extends never = never>(..._: _[]) => _
  = (..._) => { throw Error('Exhaustive match failed') }

export const assertIsNotCalled
  : <_ extends void = void>(..._: _[]) => never
  = (..._) => { throw Error('Exhaustive match failed') }

export function flow<A extends readonly unknown[], B>(ab: (...a: A) => B): (...a: A) => B
export function flow<A extends readonly unknown[], B, C>(ab: (...a: A) => B, bc: (b: B) => C): (...a: A) => C
export function flow<A extends readonly unknown[], B, C, D>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (...a: A) => D
export function flow<A extends readonly unknown[], B, C, D, E>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E): (...a: A) => E
export function flow<A extends readonly unknown[], B, C, D, E, F>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F): (...a: A) => E
export function flow(
  ...args:
    | [ab: Function]
    | [ab: Function, bc: Function]
    | [ab: Function, bc: Function, cd: Function]
    | [ab: Function, bc: Function, cd: Function, de: Function]
    | [ab: Function, bc: Function, cd: Function, de: Function, ef: Function]
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

// export function apo<F extends HKT2>(F: Bifunctor<F>): <T>(g: RCoalgebra<F, T>) => (x: T) => Either<T, Fix<F>>
// export function apo<F extends HKT2>(F: Bifunctor<F>) {
//   return <T>(g: RCoalgebra<F, T>) => {
//     function fanin(x: Either<Fix<F>, T>): Fix<F>
//     function fanin(x: Either<Fix<F>, T>) { return Either.isLeft(x) ? x : apo(F)(g)(x.right) }
//     function loop(x: T): Fix<F>
//     function loop(x: T) { return F.map(loop)(fanin(g(x))) }
//     return loop
//   }
// }
