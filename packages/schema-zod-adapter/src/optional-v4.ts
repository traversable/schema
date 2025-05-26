import type { HKT } from '@traversable/registry'
import { fn, has, Object_assign, Object_create, Option, symbol } from '@traversable/registry'

import type { Optic } from './proxy-v4.js'
import {
  Lens,
  Iso,
  Prism,
} from './optics-v4.js'

type Optional<S, A> = import('./optics-v4.js').Optional<S, A>

export type Any = Optional<any, any>
export type { Infer as infer, Source as source, Target as target }
type Infer<SA> = SA extends Optional<infer S, infer A> ? [S: S, A: A] : never
type Source<SA> = SA extends Optional<infer S, any> ? S : never
type Target<SA> = SA extends Optional<any, infer T> ? T : never
export type { F as Box }
interface F extends HKT<{ [0]: unknown, [1]: unknown }> { [-1]: Optional<this[0][0], this[0][1]> }
export type UnknownSource<T> = unknown extends Source<T> ? {} | null | undefined : never

export const identity = Object_create<Optional<any, any>>(null)
identity[symbol.tag] = 'Optional'
identity.getOption = Option.some
identity.set = fn.const

export { Optional_new as new }
function Optional_new<S, A>(
  getOption: Optional<S, A>['getOption'],
  set: Optional<S, A>['set']
): Optional<S, A> {
  return Object_assign(Object_create(null), identity, { getOption, set })
}


export const declare
  : <S>() => Optional<S, S>
  = fn.const(identity)

export function is<S, A>(x: Optic.Any<S, A>): x is Optional<S, A>
export function is<S, A>(x: unknown): x is Optional<S, A>
export function is(x: unknown) {
  return (
    has(symbol.tag, (x) => x === identity[symbol.tag])(x) || (
      has('getOption', (x) => typeof x === 'function')(x)
      && has('set', (x) => typeof x === 'function')(x)
    )
  )
}

export const fromOptional
  : <A, B>(optional: Optional<A, B>) => Optional<A, B>
  = fn.identity

export function fromIso<A, B>(iso: Iso<A, B>): Optional<A, B> {
  return Optional_new(
    fn.flow(iso.decode, Option.some),
    fn.flow(iso.encode, fn.const),
  )
}

export function fromLens<A, B>(lens: Lens<A, B>): Optional<A, B> {
  return Optional_new(
    fn.flow(lens.get, Option.some),
    lens.set,
  )
}


export function joinLeft<A, B>(prism: Prism<A, B>): <S>(lens: Lens<S, A>) => Optional<S, B>
export function joinLeft<A, B>(prism: Prism<A, B>) {
  const ab = fromPrism(prism)
  return <S>(lens: Lens<S, A>) => {
    const sa = fromLens(lens)
    return compose(sa, ab) as Optional<S, B>
  }
}

export function joinRight<A, B>(lens: Lens<A, B>): <S>(prism: Prism<S, A>) => Optional<S, B>
export function joinRight<A, B>(lens: Lens<A, B>) {
  const ab = fromLens(lens)
  return <S>(prism: Prism<S, A>) => {
    const sa = fromPrism(prism)
    return compose(sa, ab) as Optional<S, B>
  }
}

export function join<S, A, B>(LENS: Lens<S, A>, PRISM: Prism<A, B>): Optional<S, B>
export function join<S, A, B>(PRISM: Prism<S, A>, LENS: Lens<A, B>): Optional<S, B>
export function join<S, A, B>(SA: Prism<S, A> | Lens<S, A>, AB: Prism<A, B> | Lens<A, B>) {
  if (SA[symbol.tag] === undefined || AB[symbol.tag] === undefined)
    throw Error('Optional.join can\'t join without a tag')
  else {
    const sa = Lens.is(SA) ? fromLens(SA) : fromPrism(SA)
    const ab = Lens.is(AB) ? fromLens(AB) : fromPrism(AB)
    return compose(sa, ab)
  }
}

export function compose<S, A, B>(
  ...args:
    | [ab: Optional<A, B>]
    | [sa: Optional<S, A>, ab: Optional<A, B>]
) {
  if (args.length === 1) return <S>(sa: Optional<S, A>) => compose(sa, ...args)
  else {
    const [sa, ab] = args
    return Optional_new(
      fn.flow(sa.getOption, Option.flatMap(ab.getOption)),
      (b) => modify(ab.set(b))(sa),
    ) satisfies Optional<S, B>
  }
}

export function composeLens<S, A>(optional: Optional<S, A>): <B>(lens: Lens<A, B>) => Optional<S, B>
export function composeLens<S, A>(sa: Optional<S, A>) {
  return <B>(lens: Lens<A, B>) => fn.pipe(
    fromLens(lens),
    (ab) => compose(sa, ab)
  )
}


export function prop<K extends keyof any, SA extends UnknownSource<SA>>(optional: SA, k: K): Optional<unknown, Target<SA>>
export function prop<K extends keyof A, SA extends Any, S extends Source<SA>, A extends Target<SA>>(optional: SA, k: K): Optional<S, A[K]>
export function prop<K extends string>(k: K): Optional<{ [x: string]: unknown }, unknown>
export function prop<K extends number>(k: K): Optional<{ [x: number]: unknown }, unknown>
export function prop(
  ...args:
    | [sa: Any, k: keyof any]
    | [k: keyof any]
): {} {
  const [sa, k] = args.length === 1 ? [declare(), args[0]] : args
  return fn.pipe(
    Lens.declare(),
    (lens) => Lens.prop(lens, k),
    fromLens,
    (ab) => compose(sa, ab)
  )
}

export function fromPrism<A, B>(prism: Prism<A, B>): Optional<A, B> {
  return Optional_new(
    prism.match,
    (a) => Prism.set(a)(prism),
  )
}

export function modify<A, B extends A>(f: (a: A) => B): <S>(optional: Optional<S, A>) => (s: S) => S
export function modify<A, B extends A>(f: (a: A) => B) {
  return <S>(sa: Optional<S, A>) => {
    const apply = modifyOption(f)(sa)
    return (s: S) => fn.pipe(
      apply(s),
      Option.getOrElse(() => s),
    ) satisfies S
  }
}

export function modifyOption<A, B extends A>(f: (a: A) => B): <S>(optional: Optional<S, A>) => (s: S) => Option<S>
export function modifyOption<A, B extends A>(f: (a: A) => B) {
  return <S>(optional: Optional<S, A>) => (s: S) => fn.pipe(
    optional.getOption(s),
    Option.map((a) => {
      const x = f(a)
      return x === a ? s : optional.set(x)(s)
    }),
  ) satisfies Option<S>
}
