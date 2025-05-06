import type { TypeError } from '@traversable/registry'
import type * as t from './schema.js'

export type Target<S> = S extends Guard<infer T> ? T : S extends Predicate<infer T> ? T : never

export type $<S> = [keyof S] extends [never] ? unknown : S

export interface Predicate<T = unknown> {
  (value: T): boolean
  (value?: T): boolean
}

export type InvalidItem = never | TypeError<'A required element cannot follow an optional element.'>

export type Guard<T = unknown> = { (u: unknown): u is T }
export interface Typeguard<T = unknown> { (u: unknown): u is this['_type']; readonly _type: T }

export type { TypePredicate_ as TypePredicate }
type TypePredicate_<I = unknown, O = unknown> = never | TypePredicate<[I, O]>

interface TypePredicate<T extends [unknown, unknown]> {
  (u: T[0]): u is T[1]
  (u: T[1]): boolean
}

export type ValidateTuple<
  T extends readonly unknown[],
  LowerBound = t.optional<any>,
  V = ValidateOptionals<[...T], LowerBound>,
> = [V] extends [['ok']] ? T : V

export type ValidateOptionals<S extends unknown[], LowerBound = t.optional<any>, Acc extends unknown[] = []>
  = LowerBound extends S[number]
  ? S extends [infer H, ...infer T]
  ? LowerBound extends H
  ? T[number] extends LowerBound
  ? ['ok']
  : [...Acc, H, ...{ [Ix in keyof T]: T[Ix] extends LowerBound ? T[Ix] : InvalidItem }]
  : ValidateOptionals<T, LowerBound, [...Acc, H]>
  : ['ok']
  : ['ok']

