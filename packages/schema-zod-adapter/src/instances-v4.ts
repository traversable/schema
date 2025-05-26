import type { Box, Functor, TypeConstructor as F, Type as T } from '@traversable/registry'
import { fn, hom, Object_assign, Object_create, Object_keys, Object_values, symbol } from '@traversable/registry'

/** @internal */
const coerce
  : <S, T>(x: S) => T
  = fn.identity<any>

/** @internal */
export const Const: <T, _ = never>(x: T) => Box<F.Const<T>, _> = coerce

function FreeApply<T>(Sg: Semigroup<T>): Apply<F.Const<T>>
function FreeApply<T>(Sg: Semigroup<T>) {
  const ConstApply = Object_create<Apply<F.Const<T>>>(null)
  ConstApply.ap = function Const_Apply_ap(ff, x) { return Const(Sg.concat(ff, x)) }
  ConstApply.map = function Const_Apply_map() { return fn.identity }
  return ConstApply
}

function FreeApplicative<T>(M: Monoid<T>): Applicative<F.Const<T>> {
  const Const_applicative = Object_create<ReturnType<typeof FreeApplicative<T>>>(null)
  Const_applicative.ap = Apply.free(M).ap
  Const_applicative.map = function Const_map() { return fn.identity }
  Const_applicative.of = function Const_of() { return Const(M.empty) }
  return Const_applicative
}


export interface Monoid<T> extends Semigroup<T> { empty: T }
export namespace Monoid {
  export const staticArray = Object_create<Monoid<any[]>>(null)
  staticArray.empty = Array.of()
  staticArray.concat = (x, y) => x.concat(y)
  export const array = <T>(): Monoid<readonly T[]> => staticArray
}

export interface Pointed<F extends Box.any> { of<T>(x: T): Box<F, T> }
export namespace Pointed {
  export const identity = Object_create<Pointed<F.Identity>>(null)
  identity.of = fn.identity

  export const array = Object_create<Pointed<F.Array>>(null)
  array.of = globalThis.Array.of
}


export declare namespace Apply {
  type target<F> = F extends T.Record<(...args: any) => infer T> ? T.Record<T> : never
}

export interface Apply<F extends Box.any> extends Functor<F> {
  ap<S, T>(fns: Box<F, (x: S) => T>, x: Box<F, S>): Box<F, T>
}

export function Apply() {}
Apply.free = FreeApply

export namespace Apply {
  export const identity = Object_create<Apply<F.Identity>>(null)
    ; (identity as any)[symbol.tag] = 'Apply.identity'
  identity.ap = function Identity_apply(f, x) { return f(x) }
  identity.map = function Identity_map(f) { return (x) => f(x) }

  export const array = Object_create<Apply<F.Array>>(null)
    ; (array as any)[symbol.tag] = 'Apply.array'
  array.ap = function Array_apply(fns, xs) { return fns.flatMap((f) => xs.map(f)) }
  array.map = function Array_map(f) { return (xs) => xs.map(f) }

  export const record = Object_create<Apply<F.Record>>(null)
    ; (record as any)[symbol.tag] = 'Apply.record'
  record.map = function Record_map(f) { return fn.map(f) }
  record.ap = function Record_apply(fns, xs) {
    const ks = Object_keys(xs)
    let out: Apply.target<typeof fns> = Object_create(null)
    let k, f, x
    while ((k = ks.shift()) !== undefined) {
      f = fns[k]
      x = xs[k]
      out[k] = f(x)
    }
    return out
  }
}

export { Functor_ as Functor }
namespace Functor_ {
  export const identity = Object_create<Functor<F.Identity>>(null)
  identity.map = function Identity_map(f) { return f }

  export const array = Object_create<Functor<F.Array>>(null)
  array.map = function Array_map(f) { return (xs) => xs.map(f) }

  export const record = Object_create<Functor<F.Record>>(null)
  record.map = function Record_map(f) { return fn.map(f) }
}

export interface Applicative<F extends Box.any> extends Pointed<F>, Functor<F>, Apply<F> {}

export function Applicative() {}
Applicative.free = FreeApplicative

export namespace Applicative {
  export const identity = Object_create<Applicative<F.Identity>>(null)
  Object_assign(identity, Pointed.identity)
  Object_assign(identity, Functor_.identity)
  Object_assign(identity, Apply.identity)

  export const array = Object_create<Applicative<F.Array>>(null)
  Object_assign(array, Pointed.array)
  Object_assign(array, Functor_.array)
  Object_assign(array, Apply.array)
}

export interface Foldable<F extends Box.any> {
  reduce<S, T>(xs: Box<F, S>, init: T, g: (acc: T, x: S) => T): T
  reduceRight<S, T>(xs: Box<F, S>, init: T, g: (acc: T, x: S) => T): T
  foldMap<M>(monoid: Monoid<M>): <S>(xs: Box<F, S>, g: (x: S) => M) => M
}

export namespace Foldable {
  export const identity = Object_create<Foldable<F.Identity>>(null)
  identity.reduce = function Identity_reduce(x, init, g) { return g(init, x) }
  identity.reduceRight = function Identity_reduceRight(x, init, g) { return g(init, x) }
  identity.foldMap = function Identity_foldMap() { return (x, g) => g(x) }

  export const array = Object_create<Foldable<F.Array>>(null)
  array.reduce = function Array_reduce(xs, init, g) { return xs.reduce(g, init) }
  array.reduceRight = function Array_reduceRight(xs, init, g) { return xs.reduceRight(g, init) }
  array.foldMap = function Array_foldMap(M) { return (xs, g) => xs.reduce((acc, x) => M.concat(acc, g(x)), M.empty) }

  export const record = Object_create<Foldable<F.Record>>(null)
  record.reduce = function Record_reduce(xs, init, g) { return Object_values(xs).reduce(g, init) }
  record.reduceRight = function Record_reduceRight(xs, init, g) { return Object_values(xs).reduceRight(g, init) }
  record.foldMap = function Record_foldMap(M) { return (xs, g) => Object_values(xs).reduce((acc, x) => M.concat(acc, g(x)), M.empty) }
}


export interface Traversable<T extends Box.any> extends Functor<T>, Foldable<T> {
  sequence<F extends Box.any>(F: Applicative<F>): <A>(xs: Box<T, Box<F, A>>) => Box<F, Box<T, A>>
  traverse<F extends Box.any>(F: Applicative<F>): <A, B>(xs: Box<T, A>, f: (x: A) => Box<F, A>) => Box<F, Box<T, B>>
}

export namespace Traversable {
  export const identity = Object_create<Traversable<F.Identity>>(null)
  Object_assign(identity, Applicative.identity)
  Object_assign(identity, Foldable.identity)
  identity.sequence = (F) => F.map(fn.identity)
  identity.traverse = (F) => (x, f) => F.map(fn.identity)(f(x))

  export const array = Object_create<Traversable<F.Array>>(null)
  Object_assign(array, Applicative.array)
  Object_assign(array, Foldable.array)
  array.sequence = function Array_sequence(F) {
    return (xs) => xs.reduce(
      (acc, cur) => F.ap(
        fn.pipe(acc, F.map((ts: unknown[]) => (t) => [...ts, t])),
        cur
      ),
      F.of(Array.of()),
    )
  }
  array.traverse = function Array_traverse(F) {
    return (xs, f) => xs.reduce(
      (acc, cur) => F.ap(
        fn.pipe(acc, F.map((ts) => (t) => [...ts, t])),
        f(cur),
      ),
      F.of(Array.of())
    )
  }

  export const record = Object_create<Traversable<F.Record>>(null)
  Object_assign(record, Functor_.record)
  Object_assign(record, Foldable.record)
  record.sequence = function Record_sequence(F) {
    return (xs) => {
      const ks = Object_keys(xs).sort((l, r) => (l).localeCompare(r))
      const tensor = hom(ks)
      let out = F.map(tensor)(xs[ks[0]])
      for (let ix = 1, len = ks.length; ix < len; ix++) {
        out = F.ap(out, xs[ks[ix]])
      }
      return out
    }
  }
  record.traverse = function Record_traverse(F) {
    return (xs, f) => {
      const ks = Object_keys(xs).sort((l, r) => (l).localeCompare(r))
      let out = F.of({})
      if (ks.length === 0) return out
      else for (let ix = 1, len = ks.length; ix < len; ix++) {
        const k = ks[ix]
        out = F.ap(
          fn.pipe(
            out,
            F.map((ys) => (y) => Object_assign({}, ys, { [k]: y })),
          ),
          f(xs[k])
        )
      }
      return out
    }
  }
}


export interface Semigroup<T> { concat(x: T, y: T): T }

export declare namespace Semigroup {
  /** 
   * ## {@link Semigroup.Traversable `Semigroup.Traversable`}
   * 
   * Relaxes the constraint on `F` by requiring an {@link Apply `Apply`}, 
   * rather than an {@link Applicative `link Applicative`} instance.
   * 
   * Note that there's no free lunch here -- you'll still need to provide a way
   * to handle the empty case (this isn't a free Applicative).
   * 
   * The "upside" of using {@link Semigroup.Traversable} is that it enables inversion
   * of control at the call-site, rather than having the constructor baked into
   * the Functor.
   * 
   * The "downside" is that the user needs to specify it, and could possibly mess it
   * up if they don't understand the semantics of the Functor they're working with.
   * 
   * See also:
   * - [`Data.Semigroup.Traversable`](https://hackage.haskell.org/package/semigroupoids-6.0.1/docs/Data-Semigroup-Traversable.html)
   */
  export interface Traversable<T extends Box.any> extends Functor<T>, Foldable<T> {
    sequenceMaybe<F extends Box.any>(F: Apply<F>): <A>(xs: Box<T, Box<F, A>>, of: () => Box<F, A>) => Box<F, Box<A, T>>
    traverseMaybe<F extends Box.any>(F: Apply<F>): <A, B>(xs: Box<T, A>, f: (x: A) => Box<F, B>, of: () => Box<F, A>) => Box<F, Box<T, B>>
  }
}

export namespace Semigroup {
  export const staticArray = Object_create<Semigroup<any[]>>(null)
  staticArray.concat = function Semigroup_Array_concat(x, y) { return x.concat(y) }
  export const array = <T>(): Semigroup<readonly T[]> => staticArray

  export const staticRecord = Object_create<Semigroup<{ [x: string]: any }>>(null)
  staticRecord.concat = function Semigroup_Record_concat(x, y) { return { ...x, ...y } }
  export const record = <T>(): Semigroup<{ [x: string]: T }> => staticRecord

  export namespace Traversable {
    export const identity = Object_create<Semigroup.Traversable<F.Identity>>(null)
    Object_assign(identity, Apply.identity)
    Object_assign(identity, Foldable.identity)
    identity.sequenceMaybe = function Identity_sequenceMaybe(F) { return F.map(fn.identity) }
    identity.traverseMaybe = function Identity_traverseMaybe(F) { return (x, f) => F.map(fn.identity)(f(x)) }

    export const array = Object_create<Semigroup.Traversable<F.Array>>(null)
    Object_assign(array, Apply.array)
    Object_assign(array, Foldable.array)
    array.map = function Semigroup_Traversable_Array_map(f) { return (xs) => xs.map(f) }
    array.sequenceMaybe = function Array_sequenceMaybe(F) {
      return (xs, of) => xs.reduce(
        (acc, cur) => F.ap(
          fn.pipe(acc, F.map((ts: unknown[]) => (t) => [...ts, t])),
          cur
        ),
        of()
      )
    }
    array.traverseMaybe = function Array_traverseMaybe(F) {
      return (xs, f, of) => xs.reduce(
        (acc, cur) => F.ap(
          fn.pipe(acc, F.map((ts: unknown[]) => (t) => [...ts, t])),
          f(cur),
        ),
        of()
      )
    }

    export const record = Object_create<Semigroup.Traversable<F.Record>>(null)
    Object_assign(record, Apply.record)
    Object_assign(record, Foldable.record)
    record.map = function Semigroup_Traversable_Record_map(f) { return fn.map(f) }
    record.sequenceMaybe = function Record_sequenceMaybe(F) {
      return (xs, of) => {
        const ks = Object_keys(xs).sort((l, r) => (l).localeCompare(r))
        const tensor = hom(ks)
        let out = F.map(tensor)(xs[ks[0]])
        for (let ix = 1, len = ks.length; ix < len; ix++) {
          out = F.ap(out, xs[ks[ix]])
        }
        return out
      }
    }

    record.traverseMaybe = function Record_traverseMaybe(F) {
      return (xs, f, of) => {

        const ks = Object_keys(xs).sort((l, r) => (l).localeCompare(r))
        let out = of()
        if (ks.length === 0) return out
        else for (let ix = 1, len = ks.length; ix < len; ix++) {
          const k = ks[ix]
          out = F.ap(
            fn.pipe(
              out,
              F.map((ys) => (y) => Object_assign({}, ys, { [k]: y })),
            ),
            f(xs[k])
          )
        }
      }
    }
  }

}
