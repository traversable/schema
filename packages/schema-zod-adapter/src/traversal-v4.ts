import type { Box, HKT } from '@traversable/registry'
import { fn, has, Object_assign, Object_create, Option, symbol } from '@traversable/registry'

import { Applicative, Apply, Const, Monoid, Traversable, Semigroup } from './instances-v4.js'

import type { Optic } from './proxy-v4.js'
import { Iso, Lens, Optional, Prism } from './optics-v4.js'
import type { TraversalWithPredicate } from './optics-v4.js'
type Traversal<S, A> = import('./optics-v4.js').Traversal<S, A>

export type Any = Traversal<any, any>
export type AnyWithPredicate = TraversalWithPredicate<any, any>
export type { Infer as infer, Source as source, Target as target }
type Infer<SA> = SA extends Traversal<infer S, infer A> ? [S: S, A: A] : never
type Source<SA> = SA extends Traversal<infer S, any> ? S : never
type Target<SA> = SA extends Traversal<any, infer T> ? T : never
export type {
  F as Box,
  FwithFallback as BoxWithFallback,
}
interface F extends HKT<{ [0]: unknown, [1]: unknown }> { [-1]: Traversal<this[0][0], this[0][1]> }
interface FwithFallback extends HKT<{ [0]: unknown, [1]: unknown }> { [-1]: TraversalWithPredicate<this[0][0], this[0][1]> }
export type UnknownSource<T> = unknown extends Source<T> ? {} | null | undefined : never

export const identity = Object_create<Traversal<any, any>>(null)
identity[symbol.tag] = 'Traversal' as const
identity.modify = fn.const(fn.identity)

export const identityWithPredicate = Object_create<TraversalWithPredicate<any, any>>(null)
identityWithPredicate[symbol.tag] = 'TraversalWithPredicate' as const
identityWithPredicate.modifyWithFallback = fn.const(fn.identity)

export function Traversal() {}

Traversal.new = ((modify) => Object_assign(
  Object_create(null),
  identity,
  { modify }
)) satisfies <S, A>(modify: Traversal<S, A>['modify']) => Traversal<S, A>

Traversal.newWithFallback = ((modifyWithFallback) => {
  return Object_assign(
    Object_create(null),
    identityWithPredicate,
    { modifyWithFallback }
  )
}) satisfies <S, A>(modifyWithFallback: TraversalWithPredicate<S, A>['modifyWithFallback']) => TraversalWithPredicate<S, A>

export const declare
  : <S>() => Traversal<S, S>
  = fn.const(identity)

export const declareWithFallback
  : <S>() => TraversalWithPredicate<S, S>
  = fn.const(identityWithPredicate)

export function is<S, A>(x: Optic.Any<S, A>): x is TraversalWithPredicate<S, A>
export function is<S, A>(x: unknown): x is TraversalWithPredicate<S, A>
export function is(x: unknown) {
  return (
    has(symbol.tag, (x) => x === identityWithPredicate[symbol.tag])(x)
    // || ( has('modify', (x) => typeof x === 'function')(x))
  )
}

export function compose<S, A, B>(sa: Traversal<S, A>, ab: Traversal<A, B>): Traversal<S, B>
export function compose<A, B>(ab: Traversal<A, B>): <S>(sa: Traversal<S, A>) => Traversal<S, B>
export function compose<S, A, B>(
  ...args:
    | [ab: Traversal<A, B>]
    | [sa: Traversal<S, A>, ab: Traversal<A, B>]
): Traversal<S, B> | ((sa: Traversal<S, A>) => Traversal<S, B>) {
  if (args.length === 1) return (sa: Traversal<S, A>) => compose(sa, ...args)
  else {
    const [sa, ab] = args
    return Traversal.new((F) => (f) => sa.modify(F)(ab.modify(F)(f)))
  }
}

export function composeWithFallback<S, A, B>(sa: TraversalWithPredicate<S, A>, ab: TraversalWithPredicate<A, B>, fallback: any): TraversalWithPredicate<S, B>
export function composeWithFallback<A, B>(ab: TraversalWithPredicate<A, B>): <S>(sa: TraversalWithPredicate<S, A>, fallback: any) => TraversalWithPredicate<S, B>
export function composeWithFallback<S, A, B>(
  ...args:
    | [ab: TraversalWithPredicate<A, B>]
    | [sa: TraversalWithPredicate<S, A>, ab: TraversalWithPredicate<A, B>, fallback: any]
): TraversalWithPredicate<S, B> | ((sa: TraversalWithPredicate<S, A>, fallback: any) => TraversalWithPredicate<S, B>) {
  if (args.length === 1) return (sa: TraversalWithPredicate<S, A>, fallback: any) => composeWithFallback(sa, args[0], fallback)
  else {
    const [sa, ab, fallback] = args
    return Traversal.newWithFallback((F) => (f) => sa.modifyWithFallback(F)(ab.modifyWithFallback(F)(f, fallback), fallback))
  }
}


export const fromTraversal
  : <A, B>(traversal: Traversal<A, B>) => Traversal<A, B>
  = fn.identity

export const fromTraversalWithFallback
  : <A, B>(traversal: TraversalWithPredicate<A, B>) => TraversalWithPredicate<A, B>
  = fn.identity

export const toTraversalWithFallback
  : <A, B>(traversal: Traversal<A, B>, fallback: B) => TraversalWithPredicate<A, B>
  = (traversal, fallback) => {
    return Traversal.newWithFallback((F) => traversal.modify({ ...F, of() { return fallback } }))
  }

export function fromIso<A, B>(iso: Iso<A, B>): Traversal<A, B> {
  return Traversal.new((F) => (f) => (s) => fn.pipe(
    f(iso.decode(s)),
    F.map(iso.encode)
  ))
}

export function fromIsoWithFallback<A, B>(iso: Iso<A, B>): TraversalWithPredicate<A, B> {
  return Traversal.newWithFallback((F) => (f) => (s) => fn.pipe(
    f(iso.decode(s)),
    F.map(iso.encode)
  ))
}


export function fromPrism<A, B>(prism: Prism<A, B>): Traversal<A, B> {
  return Traversal.new((F) => (f) => (s) => fn.pipe(
    prism.match(s),
    (option) =>
      Option.isNone(option)
        ? F.of(s)
        : fn.pipe(
          f(option.value),
          F.map((a) => Prism.set(a)(prism)(s)),
        )
  ))
}

export function fromPrismWithFallback<A, B>(prism: Prism<A, B>, fallback: A): TraversalWithPredicate<A, B> {
  return Traversal.newWithFallback((F) => (f) => (s) => fn.pipe(
    prism.match(s),
    (option) =>
      Option.isNone(option)
        ? fallback
        : fn.pipe(
          f(option.value),
          F.map((a) => Prism.set(a)(prism)(s)),
        )
  ))
}

export function fromLens<A, B>(lens: Lens<A, B>): Traversal<A, B> {
  return Traversal.new((F) => (f) => (s) => fn.pipe(
    f(lens.get(s)),
    F.map((a) => lens.set(a)(s))
  ))
}

export function fromLensWithFallback<A, B>(lens: Lens<A, B>, fallback: B): TraversalWithPredicate<A, B> {
  return Traversal.newWithFallback((F) => (f) => (s) => fn.pipe(
    f(lens.get(s)),
    // f(lens.get(s) ?? fallback),
    F.map((a) => lens.set(a)(s))
  ))
}

export function prop<SA extends UnknownSource<SA>, K extends keyof any>(traversal: SA, k: K): Traversal<unknown, Target<SA>>
export function prop<SA extends Any, S extends Source<SA>, A extends Target<SA>, K extends keyof A>(traversal: SA, k: K): Traversal<S, A[K]>
export function prop<K extends string>(k: K): Traversal<{ [x: string]: unknown }, unknown>
export function prop<K extends number>(k: K): Traversal<{ [x: number]: unknown }, unknown>
export function prop(
  ...args:
    | [k: keyof any]
    | [sa: Any, k: keyof any]
) {
  const [sa, k] = args.length === 1 ? [declare(), args[0]] : args
  return fn.pipe(
    Lens.declare(),
    (lens) => Lens.prop(lens, k),
    fromLens,
    (ab) => compose(sa, ab)
  )
}

export function propWithFallback<SA extends UnknownSource<SA>, K extends keyof any>(traversal: SA, k: K, fallback: unknown): TraversalWithPredicate<unknown, Target<SA>>
export function propWithFallback<SA extends Any, S extends Source<SA>, A extends Target<SA>, K extends keyof A>(traversal: SA, k: K, fallback: unknown): TraversalWithPredicate<S, A[K]>
export function propWithFallback<K extends string>(k: K, fallback: unknown): TraversalWithPredicate<{ [x: string]: unknown }, unknown>
export function propWithFallback<K extends number>(k: K, fallback: unknown): TraversalWithPredicate<{ [x: number]: unknown }, unknown>
export function propWithFallback(
  ...args:
    | [k: keyof any, fallback: unknown]
    | [sa: AnyWithPredicate, k: keyof any, fallback: unknown]
) {
  const [sa, k, fallback] = args.length === 2 ? [declareWithFallback(), args[0], args[1]] : args
  return fn.pipe(
    Lens.declare(),
    (lens) => Lens.prop(lens, k),
    (lens) => fromLensWithFallback(lens, fallback),
    (ab) => composeWithFallback(sa, ab, fallback)
  )
}


export function fromOptional<A, B>(sa: Optional<A, B>): Traversal<A, B> {
  return Traversal.new((F) => (f) => (s) => fn.pipe(
    sa.getOption(s),
    (option) =>
      Option.isNone(option)
        ? F.of(s)
        : fn.pipe(
          f(option.value),
          F.map((a) => sa.set(a)(s))
        )
  ))
}

export function fromOptionalWithFallback<A, B>(sa: Optional<A, B>, fallback: A): TraversalWithPredicate<A, B> {
  return Traversal.newWithFallback((F) => (f) => (s) => fn.pipe(
    sa.getOption(s),
    (option) =>
      Option.isNone(option)
        ? fallback
        : fn.pipe(
          f(option.value),
          F.map((a) => sa.set(a)(s))
        )
  ))
}

export function fromTraversable<T extends Box.any>(T: Traversable<T>): <A>() => Traversal<Box<T, A>, A> {
  return () => Traversal.new((F) => (f) => (s) => T.traverse(F)(s, f))
}

export function fromTraversableWithFallback<T extends Box.any>(T: Semigroup.Traversable<T>): <A>(fallback: A) => TraversalWithPredicate<Box<T, A>, A> {
  return (fallback) => Traversal.newWithFallback((F) => (f) => (s) => T.traverseMaybe(F)(s, f, () => fallback))
}

export function traverse<T extends Box.any>(T: Traversable<T>): <S, A>(sta: Traversal<S, Box<T, A>>) => Traversal<S, A>
export function traverse<T extends Box.any>(T: Traversable<T>) {
  return <S, A>(sta: Traversal<S, Box<T, A>>) => compose(sta, fromTraversable(T)()) satisfies Traversal<S, A>
}

// export function traverseWithFallback<T extends Box.any>(T: Traversable<T>): <S, A>(
//   sta: TraversalWithPredicate<S, Box<T, A>>,
//   predicate: (x: Box<T, A>) => boolean,
//   onFalse: Box<T, A>
// ) => TraversalWithPredicate<S, A>

export function traverseWithFallback<T extends Box.any>(T: Semigroup.Traversable<T>) {
  return <S, A>(
    sta: TraversalWithPredicate<S, Box<T, A>>,
    predicate: (x: Box<T, A>) => boolean,
    onFalse: Box<T, A>
  ): TraversalWithPredicate<S, A> => {
    // TODO: look into removing this type assertion                        vvvvvvvv
    return composeWithFallback(sta, fromTraversableWithFallback(T)(onFalse as never), onFalse)
  }
}

export const array = traverse(Traversable.array)

export const traverseArray: {
  <S, A>(sta: Traversal<S, A>): Traversal<S, A[]>
  <S, A>(sta: Traversal<S, A>): Traversal<S, A>
} = array

export const record = traverse(Traversable.record)

export const traverseRecord: {
  <S, A>(sta: Traversal<S, A>): Traversal<S, Record<string, A>>
  <S, A>(sta: Traversal<S, A>): Traversal<S, A>
} = record

export const modify
  : <A, B extends A = A>(f: (a: A) => B) => <S>(sa: Traversal<S, A>) => ((s: S) => S)
  = (f) => (sa) => sa.modify(Applicative.identity)(f)


export const modifyWithFallback
  : <A, B extends A = A>(f: (a: A) => B, fallback: A) => <S>(sa: TraversalWithPredicate<S, A>) => ((s: S) => S)
  = (f, fallback) => (sa) => sa.modifyWithFallback(Apply.identity)(f, fallback)

export const set
  : <A>(a: A) => <S>(sa: Traversal<S, A>) => (s: S) => S
  = fn.flow(fn.const, modify)

export function foldMap<M>(M: Monoid<M>): <A>(f: (a: A) => M) => <S>(sa: Traversal<S, A>) => (s: S) => M {
  return (f) => (sa) => sa.modify(Applicative.free(M))(fn.flow(f, Const))
}

export function reduce<M>(Sg: Semigroup<M>): <A>(f: (a: A) => M, fallback: M) => <S>(sa: TraversalWithPredicate<S, A>) => (s: S) => M {
  return (f, fallback) => (sa) => sa.modifyWithFallback(Apply.free(Sg))(fn.flow(f, Const), fallback)
}

export function getAll<S>(s: S): <A>(sa: Traversal<S, A>) => readonly A[] {
  return <A>(sa: Traversal<S, A>) => foldMap(Monoid.array<A>())(Applicative.array.of<A>)(sa)(s)
}

export function getAllWithFallback<S, A>(s: S, fallback: A): (sa: TraversalWithPredicate<S, A>) => readonly A[] {
  return (sa: TraversalWithPredicate<S, A>) => reduce(Semigroup.array<A>())(() => [], [])(sa)(s)
}

export function get<S, A>(sa: Traversal<S, A>): (s: S) => readonly A[] {
  return fn.flow(getAll, (f) => f(sa))
}

export function getWithFallback<S, A>(sa: TraversalWithPredicate<S, A>): (s: S, fallback: A) => readonly A[] {
  return fn.flow(getAllWithFallback, (f) => f(sa))
}
