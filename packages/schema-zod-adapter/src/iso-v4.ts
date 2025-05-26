import type { HKT } from '@traversable/registry'
import { fn, has, Object_assign, Object_create, symbol } from '@traversable/registry'

type Iso<S, A> = import('./optics-v4.js').Iso<S, A>
import type { Optic } from './proxy-v4.js'

export type Any = Iso<any, any>
export interface Box extends HKT<{ [0]: unknown, [1]: unknown }> { [-1]: Iso<this[0][0], this[0][1]> }
export type infer<SA> = SA extends Iso<infer S, infer A> ? [S: S, A: A] : never
export type inferSource<SA> = SA extends Iso<infer S, any> ? S : never
export type inferTarget<SA> = SA extends Iso<any, infer T> ? T : never

export const identity = Object_create<Iso<any, any>>(null)
identity[symbol.tag] = 'Iso'
identity.decode = fn.identity
identity.encode = fn.identity

export const declare
  : <T>() => Iso<T, T>
  = fn.const(identity)

export function is<S, A>(x: Optic.Any<S, A>): x is Iso<S, A>
export function is<S, A>(x: unknown): x is Iso<S, A>
export function is(x: unknown) {
  return (
    has(symbol.tag, (x) => x === identity[symbol.tag])(x) || (
      has('decode', (x) => typeof x === 'function')(x)
      && has('encode', (x) => typeof x === 'function')(x)
    )
  )
}

export { Iso_new as new }
function Iso_new<S, T>(
  decode: (s: S) => T,
  encode: (t: T) => S
): Iso<S, T> {
  return Object_assign(
    Object_create(null),
    identity, {
    decode,
    encode,
  })
}

export function compose<S, A, B>(sa: Iso<S, A>, ab: Iso<A, B>): Iso<S, B>
export function compose<S, A, B>(sa: Iso<S, A>, ab: Iso<A, B>) {
  return Iso_new(
    fn.flow(sa.decode, ab.decode),
    fn.flow(ab.encode, sa.encode),
  ) satisfies Iso<S, B>
}

export const fromIso
  : <A, B>(iso: Iso<A, B>) => Iso<A, B>
  = fn.identity
