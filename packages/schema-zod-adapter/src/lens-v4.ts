import type { HKT } from '@traversable/registry'
import type { Homomorphism } from '@traversable/registry'
import { fn, get, has, Object_assign, Object_create, Object_fromEntries, set, symbol } from '@traversable/registry'

import type { Iso } from './optics-v4.js'
import type { Optic } from './proxy-v4.js'

type Lens<S, A> = import('./optics-v4.js').Lens<S, A>

export type Any = Lens<any, any>
export type LowerBound<T> = [Lens<unknown, unknown>] extends [T] ? unknown : never

export type { Infer as infer, Source as source, Target as target }
type Infer<SA> = SA extends Lens<infer S, infer A> ? [S: S, A: A] : never
type Source<SA> = SA extends Lens<infer S, any> ? S : never
type Target<SA> = SA extends Lens<any, infer T> ? T : never
export type { F as Box }
interface F extends HKT<{ [0]: unknown, [1]: unknown }> { [-1]: Lens<this[0][0], this[0][1]> }
export type UnknownSource<T> = unknown extends Source<T> ? {} | null | undefined : never

export const identity = Object_create<Any>(null)
identity[symbol.tag] = 'Lens'
identity.get = fn.identity
identity.set = fn.const(fn.identity)

export const declare
  : <S>() => Lens<S, S>
  = fn.const(identity)

export function is<S, A>(x: Optic.Any<S, A>): x is Lens<S, A>
export function is<S, A>(x: unknown): x is Lens<S, A>
export function is(x: unknown) {
  return (
    has(symbol.tag, (x) => x === identity[symbol.tag])(x) || (
      has('get', (x) => typeof x === 'function')(x)
      && has('set', (x) => typeof x === 'function')(x)
    )
  )
}

export { Lens_new as new }
function Lens_new<S, A>(
  get: (s: S) => A,
  set: (a: A) => (s: S) => S
): Lens<S, A> {
  return Object_assign(Object_create(null), identity, { get, set })
}

export function compose<S, A, B>(sa: Lens<S, A>, ab: Lens<A, B>): Lens<S, B> {
  return Lens_new(
    (s) => ab.get(sa.get(s)),
    (b) => (s) => sa.set(ab.set(b)(sa.get(s)))(s)
  )
}

export const fromLens
  : <A, B>(lens: Lens<A, B>) => Lens<A, B>
  = fn.identity

export function fromIso<A, B>(iso: Iso<A, B>): Lens<A, B> {
  return Lens_new(
    iso.decode,
    fn.flow(iso.encode, fn.const)
  )
}

export function prop<K extends keyof any, SA extends UnknownSource<SA>>(lens: SA, k: K): Lens<unknown, Target<SA>>
export function prop<K extends keyof A, SA extends Any, S extends Source<SA>, A extends Target<SA>>(lens: SA, k: K): Lens<S, A[K]>
export function prop<K extends string>(k: K): <S extends { [P in K]: unknown }>() => Lens<S, S[K]>
export function prop<K extends number>(k: K): <S extends { [P in K]: unknown }>() => Lens<S, S[K]>
export function prop(
  ...args:
    | [k: keyof any]
    | [lens: Any, k: keyof any]
): {} {
  const [sa, k] = args.length === 1 ? [declare(), args[0]] : args
  const lens = () => Lens_new(
    (s) => sa.get(s)[k],
    (a) => (s) => Object_assign(
      Object_create(null),
      s,
      { [k]: a },
    )
  )
  return args.length === 1 ? lens : lens()
}

export function fromProp<K extends keyof any>(k: K): <S, A extends { [P in K]: unknown }>(lens: Lens<S, A>) => Lens<S, A[K]> {
  return (lens) => Lens_new(
    (s) => lens.get(s)[k],
    (a) => (s) => Object_assign(
      Object_create<{ [P in K]: unknown }>(null),
      s,
      { [k]: a },
    )
  )
}

export function props<A, K extends keyof A>(ks: readonly [K, K, ...K[]]): <S>(lens: Lens<S, A>) => Lens<S, { [P in K]: A[P] }>
export function props<A, K extends keyof A>(ks: readonly K[]): <S>(lens: Lens<S, A>) => Lens<S, { [P in K]: A[P] }>
export function props<A, K extends keyof A>(ks: readonly K[]): <S>(lens: Lens<S, A>) => Lens<S, { [P in K]: A[P] }> {
  return (lens) => Lens_new(
    (s) => {
      const source = lens.get(s)
      const target = Object_create<{ [P in K]: A[P] }>(null)
      for (const k of ks) target[k] = source[k]
      return target
    },
    (next) => (s) => {
      const prev = lens.get(s)
      for (const k of ks) {
        if (next[k] !== prev[k])
          return lens.set(
            Object.assign(
              Object_create(null),
              prev,
              next,
            )
          )(s)
      }
      return s
    }
  )
}

export function homomorphic<S, A>(lens: Lens<S, A>): Homomorphism<S, Lens<S, A>>
export function homomorphic<S, A>(lens: Lens<S, A>) { return fn.map(fn.const(lens)) }

export type fromShape<S> = never | { [K in keyof S]: Lens<S, S[K]> }
export type fromKeys<K extends keyof any, V = unknown> = never | { [P in K]: Lens<{ [P in K]: V }, V> }
export type fromEntries<T extends [k: keyof any, v: unknown], S = { [E in T as E[0]]: E[1] }> = fromShape<S>

/** 
 * ## {@link fromShape `Lens.fromShape`}
 * 
 * Given an arbitrary object, {@link fromShape `Lens.fromShape`} maps
 * over the object's keys to create a new object whose values are
 * lenses that focus from a structure of the same overall shape to
 * that particular property.
 * 
 * @example
 * 
 */
export function fromShape<S>(shape: S): fromShape<S>
export function fromShape(shape: {}) { return fn.map(shape, (_, k) => Lens_new(get.lazy(k), set.lazy(k))) }

export const fromEntries
  : <K extends keyof any, T extends readonly [k: K, v: unknown]>(entries: [...T[]]) => fromEntries<[...T]>
  = fn.flow(
    Object_fromEntries,
    fromShape,
  ) as typeof fromEntries

export const fromKey
  : <K extends keyof any>(k: K) => <S extends { [P in K]: unknown }>() => Lens<S, S[K]>
  = ((k) => fn.pipe(
    Lens_new(get.lazy(k), set.lazy(k)),
    fn.const,
  )) as typeof fromKey

export function fromKeys<K extends keyof any>(...keys: [...K[]]): <V = unknown>() => fromKeys<K, V>
export function fromKeys<K extends keyof any>(...keys: [...K[]]) {
  return fn.pipe(
    fn.map(keys, (k) => [k, void 0] satisfies [keyof any, any]),
    fromEntries,
    fn.const,
  )
}
