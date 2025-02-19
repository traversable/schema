import type { Functor, Kind, HKT, IndexedFunctor } from './types.js'

export {
  ana,
  cata,
  constant as const,
  exhaustive,
  identity,
}

/** @internal */
const Object_keys
  : <T>(x: T) => map.keyof<T>[]
  = <never>globalThis.Object.keys

const identity
  : <T>(x: T) => T
  = (x) => x

const constant
  : <T>(x: T) => <S>(y?: S) => T
  = (x) => () => x

const exhaustive
  : <_ extends never = never>(..._: _[]) => _
  = (..._) => { throw new Error('Exhaustive match failed') }

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

function ana<F extends HKT, _F>(Functor: Functor<F, _F>):
  <T>(coalgebra: Functor.Coalgebra<F, T>)
    => <S extends _F>(expr: S)
      => Kind<F, T>

/// impl.
function ana<F extends HKT>(Functor: Functor<F>) {
  return <T>(coalgebra: Functor.Coalgebra<F, T>) => {
    return function loop(expr: T): Kind<F, T> {
      return Functor.map(loop)(coalgebra(expr))
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
function cata<F extends HKT, _F>(F: Functor<F, _F>):
  <T>(algebra: Functor.Algebra<F, T>)
    => <S extends _F>(term: S)
      => T

function cata<F extends HKT>(F: Functor<F>) {
  return <T>(algebra: Functor.Algebra<F, T>) => {
    return function loop(term: Kind<F, T>): T {
      return algebra(F.map(loop)(term))
    }
  }
}

export function cataIx
  <Ix, F extends HKT, _F>(F: IndexedFunctor<Ix, F, _F>):
  <T>(algebra: Functor.IndexedAlgebra<Ix, F, T>)
    => <S extends _F>(term: S, ix: Ix)
      => T

export function cataIx<Ix, F extends HKT, _F>(F: IndexedFunctor<Ix, F, _F>) {
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