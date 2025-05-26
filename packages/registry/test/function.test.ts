import * as vi from 'vitest'
import type * as T from '@traversable/registry'
import { Either, fn } from '@traversable/registry'

const readonly
  : <T extends {}>(x: T) => { readonly [K in keyof T]: T[K] }
  = (x) => x

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳: fn', () => {
  vi.it('〖⛳️〗‹‹‹ ❲fn.map❳: typelevel tests', () => {
    vi.expectTypeOf(fn.map([] satisfies [], String)).toEqualTypeOf([] satisfies [])
    vi.expectTypeOf(fn.map([] as const, String)).toEqualTypeOf([] as const)
    vi.expectTypeOf(fn.map(Array.of<never>(), String)).toEqualTypeOf(Array.of(String()))
    vi.expectTypeOf(fn.map([] as readonly never[], String)).toEqualTypeOf(readonly(Array.of(String())))
    vi.expectTypeOf(fn.map([Number(), Number(), Number()], String)).toEqualTypeOf([String(), String(), String()] satisfies [any, any, any])
    vi.expectTypeOf(fn.map({ a: Number(), b: Number(), c: Number() }, String)).toEqualTypeOf({ a: String(), b: String(), c: String() })
    vi.expectTypeOf(fn.map(Array.of(Number()), String)).toEqualTypeOf(Array.of(String()))
    vi.expectTypeOf(fn.map({ [String()]: Number() }, String)).toEqualTypeOf({ [String()]: String() })
    vi.expectTypeOf(fn.map([Number(), Number(), Number()] as const, String)).toEqualTypeOf([String(), String(), String()] as const)
    vi.expectTypeOf(fn.map(String)([] satisfies [])).toEqualTypeOf([] satisfies [])
    vi.expectTypeOf(fn.map([] as const, String)).toEqualTypeOf([] as const)
    vi.expectTypeOf(fn.map(Array.of<never>(), String)).toEqualTypeOf(Array.of(String()))
    vi.expectTypeOf(fn.map([] as readonly never[], String)).toEqualTypeOf(readonly(Array.of(String())))
    vi.expectTypeOf(fn.map([Number(), Number(), Number()], String)).toEqualTypeOf([String(), String(), String()] satisfies [any, any, any])
    vi.expectTypeOf(fn.map({ a: Number(), b: Number(), c: Number() }, String)).toEqualTypeOf({ a: String(), b: String(), c: String() })
    vi.expectTypeOf(fn.map(Array.of(Number()), String)).toEqualTypeOf(Array.of(String()))
    vi.expectTypeOf(fn.map({ [String()]: Number() }, String)).toEqualTypeOf({ [String()]: String() })
    vi.expectTypeOf(fn.map([Number(), Number(), Number()] as const, String)).toEqualTypeOf([String(), String(), String()] as const)
  })
})

const Bifunctor: T.Bifunctor<T.TypeConstructor.Either> = {
  map(f) { return (x) => x._tag === 'Either::Left' ? x : { _tag: 'Either::Right', right: f(x.right) } },
  mapLeft(f) { return (x) => x._tag === 'Either::Right' ? x : { _tag: 'Either::Left', left: f(x.left) } }
}

vi.describe('〖⛳️〗‹‹‹ ❲@traverable/registry❳: fn', () => {
  vi.it('〖⛳️〗‹‹‹ ❲fn.map❳: typelevel tests', () => {
    const unfold = fn.apo(Bifunctor)

    const sum = unfold<number>((x) => {
      return x > 0 ? Either.right(x - 1) : Either.left(x)
    })

    vi.assert.deepEqual(sum(10), Either.left(0))
  })
})

