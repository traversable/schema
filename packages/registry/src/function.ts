import type { Functor, Kind, HKT } from './types.js'

/** @internal */
const Object_keys
  : <T>(x: T) => map.keyof<T>[]
  = <never>globalThis.Object.keys

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

export function cataIx<Ix, F extends HKT, Fixpoint>(F: Functor.Ix<Ix, F, Fixpoint>) {
  return <T>(g: Functor.IndexedAlgebra<Ix, F, T>) => {
    return function loop(term: Kind<F, T>, ix: Ix): T {
      return g(F.mapWithIndex(loop)(term, ix), ix)
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

export function map<const S, T>(mapfn: (value: S[map.keyof<S>], key: map.keyof<S>, src: S) => T): (src: S) => { -readonly [K in keyof S]: T }
export function map<const S, T>(src: S, mapfn: (value: S[map.keyof<S>], key: map.keyof<S>, src: S) => T): { -readonly [K in keyof S]: T }
export function map<const S, T>(
  ...args:
    | [mapfn: (value: S[keyof S], key: map.keyof<S>, src: S) => T]
    | [src: S, mapfn: (value: S[keyof S], key: map.keyof<S>, src: S) => T]
) {
  if (args.length === 1) return (src: S) => map(src, args[0])
  else {
    const [src, mapfn] = args
    if (globalThis.Array.isArray(src)) return src.map(mapfn as never)
    const keys = Object_keys(src)
    let out: { [K in keyof S]+?: T } = {}
    for (let ix = 0, len = keys.length; ix < len; ix++) {
      const k = keys[ix]
      out[k] = mapfn(src[k], k, src)
    }
    return out
  }
}

export declare namespace map {
  type keyof<
    T,
    K extends
    | keyof T & ([T] extends [readonly unknown[]] ? [number] extends [T["length"]] ? number : Extract<keyof T, `${number}`> : keyof T)
    = keyof T & ([T] extends [readonly unknown[]] ? [number] extends [T["length"]] ? number : Extract<keyof T, `${number}`> : keyof T)
  > = K;
}

export const exhaustive
  : <_ extends never = never>(..._: _[]) => _
  = (..._) => { throw new Error('Exhaustive match failed') }

export const fanout
  : <A, B, C>(ab: (a: A) => B, ac: (a: A) => C) => (a: A) => [B, C]
  = (ab, ac) => (a) => [ab(a), ac(a)]

function flow<A extends readonly unknown[], B>(ab: (...a: A) => B): (...a: A) => B
function flow<A extends readonly unknown[], B, C>(ab: (...a: A) => B, bc: (b: B) => C): (...a: A) => C
function flow<A extends readonly unknown[], B, C, D>(ab: (...a: A) => B, bc: (b: B) => C, cd: (c: C) => D): (...a: A) => D
function flow(
  ...args:
    | [ab: Function]
    | [ab: Function, bc: Function]
    | [ab: Function, bc: Function, cd: Function]
) {
  switch (true) {
    default: return void 0
    case args.length === 1: return args[0]
    case args.length === 2: return function (this: unknown) { return args[1](args[0].apply(this, arguments)) }
    case args.length === 3: return function (this: unknown) { return args[2](args[1](args[0].apply(this, arguments))) }
  }
}
