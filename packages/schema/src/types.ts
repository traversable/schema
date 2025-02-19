import type { t } from './model.js'
import type { TypeError } from '@traversable/registry'

export interface Predicate<T = unknown> { (value: T): boolean, (value?: T): boolean }
export interface Thunk<out T = unknown> { (): T }
export type Guard<T = unknown> = { (u: unknown): u is T }

export type { TypePredicate_ as TypePredicate }
type TypePredicate_<I = unknown, O = unknown> = never | TypePredicate<[I, O]>

interface TypePredicate<T extends [unknown, unknown]> {
  (u: T[0]): u is T[1]
  (u: T[1]): boolean
}

export type Target<S> = S extends Guard<infer T> ? T : S extends Predicate<infer T> ? T : never

export type $<S> = [keyof S] extends [never] ? unknown : S
export type Conform<S, T, U, _ extends Extract<S, T> = Extract<S, T>> = [_] extends [never] ? Extract<U, S> : _

export type InvalidItem = never | TypeError<'A required element cannot follow an optional element.'>

export type ValidateTuple<
  T extends readonly unknown[],
  V = ValidateOptionals<[...T]>
> = [V] extends [['ok']] ? T : V

type ValidateOptionals<S extends unknown[], Acc extends unknown[] = []>
  = t.Optional<any> extends S[number]
  ? S extends [infer H, ...infer T]
  ? t.Optional<any> extends H
  ? T[number] extends t.Optional<any>
  ? ['ok']
  : [...Acc, H, ...{ [Ix in keyof T]: T[Ix] extends t.Optional<any> ? T[Ix] : InvalidItem }]
  : ValidateOptionals<T, [...Acc, H]>
  : ['ok']
  : ['ok']
  ;

export type Label<S extends readonly unknown[], T = S['length'] extends keyof Labels ? Labels[S['length']] : never>
  = never | [T] extends [never]
  ? { [ix in keyof S]: S[ix] }
  : { [ix in keyof T]: S[ix & keyof S] }
  ;

export type _ = never
export interface Labels {
  1: readonly [ᙚ?: _]
  2: readonly [ᙚ?: _, ᙚ?: _]
  3: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _]
  4: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  5: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  6: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  7: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  8: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
  9: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
}
