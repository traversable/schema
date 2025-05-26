import type { HKT } from '@traversable/registry'
import { fn, has, Object_assign, Object_create, Option, symbol } from '@traversable/registry'

import type { Optic } from './proxy-v4.js'
import type { Optional } from './optics-v4.js'
import {
  Iso,
  Lens,
} from './optics-v4.js'
type Prism<S, A> = import('./optics-v4.js').Prism<S, A>

export type Any = Prism<any, any>
export type { Infer as infer, Source as source, Target as target }
type Infer<SA> = SA extends Prism<infer S, infer A> ? [S: S, A: A] : never
type Source<SA> = SA extends Prism<infer S, any> ? S : never
type Target<SA> = SA extends Prism<any, infer T> ? T : never
export type { F as Box }
interface F extends HKT<{ [0]: unknown, [1]: unknown }> { [-1]: Prism<this[0][0], this[0][1]> }
export type UnknownSource<T> = unknown extends Source<T> ? {} | null | undefined : never

export type KeyOf<T, K extends keyof T = keyof T> = K & (T extends readonly any[] ? number : unknown)

export const identity = Object_create<Any>(null)
identity[symbol.tag] = 'Prism'
identity.embed = fn.identity
identity.match = Option.some

export const declare
  : <S>() => Prism<S, S>
  = fn.const(identity)

export function is<S, A>(x: Optic.Any): x is Prism<S, A>
export function is<S, A>(x: unknown): x is Prism<S, A>
export function is(x: unknown) {
  return (
    has(symbol.tag, (x) => x === identity[symbol.tag])(x) || (
      has('match', (x) => typeof x === 'function')(x)
      && has('embed', (x) => typeof x === 'function')(x)
    )
  )
}

export { Prism_new as new }
function Prism_new<S, A>(
  match: (s: S) => Option<A>,
  embed: (a: A) => S
): Prism<S, A> {
  return Object_assign(Object_create(null), identity, { match, embed })
}

export function compose<S, A, B>(sa: Prism<S, A>, ab: Prism<A, B>): Prism<S, B>
export function compose<S, A, B>(sa: Prism<S, A>, ab: Prism<A, B>) {
  return Prism_new(
    fn.flow(sa.match, Option.flatMap(ab.match)),
    fn.flow(ab.embed, sa.embed),
  )
}

export const fromPrism
  : <A, B>(prism: Prism<A, B>) => Prism<A, B>
  = fn.identity

export function fromIso<A, B>(iso: Iso<A, B>): Prism<A, B> {
  return Prism_new(
    fn.flow(iso.decode, Option.some),
    iso.encode,
  )
}

export function fromPredicate<A, B extends A>(predicate: (a: A) => a is B): Prism<A, B>
export function fromPredicate<A>(predicate: (a: A) => boolean): Prism<A, A>
export function fromPredicate(predicate: (x: unknown) => boolean): Prism<unknown, unknown> {
  return Prism_new(
    Option.fromPredicate(predicate),
    fn.identity,
  )
}

export function modify<A, B extends A>(f: (a: A) => B): <S>(sa: Prism<S, A>) => (s: S) => S
export function modify<A, B extends A>(f: (a: A) => B) {
  return <S>(sa: Prism<S, A>) => {
    const apply = modifyOption(f)(sa)
    return (s: S) =>
      fn.pipe(
        apply(s),
        Option.getOrElse(() => s),
      ) satisfies S
  }
}

export function modifyOption<A, B extends A>(f: (a: A) => B): <S>(sa: Prism<S, A>) => (s: S) => Option<S>
export function modifyOption<A, B extends A>(f: (a: A) => B) {
  return <S>(sa: Prism<S, A>) => (s: S) => fn.pipe(
    sa.match(s),
    Option.map(
      fn.flow(
        (a) => [a, f(a)] satisfies [any, any],
        ([a, b]) => a === b ? s : sa.embed(b)
      )
    )
  ) satisfies Option<S>
}

export const set
  : <A>(a: A) => (<S>(sa: Prism<S, A>) => (s: S) => S)
  // (a) => modify(() => a)
  = fn.flow(fn.const, modify)

export type Sequence<T> = never | { [K in keyof T]: Prism<T[KeyOf<T>], T[K]> }

export function sequence<T>(patterns: { [K in keyof T]: (x: unknown) => x is T[K] }): Sequence<T>
export function sequence<T>(patterns: { [K in keyof T]: (x: T[K]) => boolean }): Sequence<T>
export function sequence(patterns: { [x: number]: (x: unknown) => boolean }) {
  return fn.map(
    patterns,
    (predicate) => Prism_new(Option.fromPredicate(predicate), fn.identity),
  ) satisfies Sequence<unknown>
}
