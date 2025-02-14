import type { Functor, Kind, HKT } from './types.js'
import { symbol as Symbol } from './uri.js'

export {
  ana,
  cata,
  constant as const,
  exhaustive,
  identity,
}

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
