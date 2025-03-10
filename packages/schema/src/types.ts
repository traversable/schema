import type { Conform, TypeError } from '@traversable/registry'
import type { Guard, Predicate, t, InvalidItem } from '@traversable/schema-core'

export type Target<S> = S extends Guard<infer T> ? T : S extends Predicate<infer T> ? T : never

export type $<S> = [keyof S] extends [never] ? unknown : S

export type ValidateTuple<
  T extends readonly unknown[],
  V = ValidateOptionals<[...T]>
> = [V] extends [['ok']] ? T : V

type ValidateOptionals<S extends unknown[], Acc extends unknown[] = []>
  = t.optional<any> extends S[number]
  ? S extends [infer H, ...infer T]
  ? t.optional<any> extends H
  ? T[number] extends t.optional<any>
  ? ['ok']
  : [...Acc, H, ...{ [Ix in keyof T]: T[Ix] extends t.optional<any> ? T[Ix] : InvalidItem }]
  : ValidateOptionals<T, [...Acc, H]>
  : ['ok']
  : ['ok']
  ;

// export type Label<S extends readonly unknown[], T = S['length'] extends keyof Labels ? Labels[S['length']] : never>
//   = never | [T] extends [never]
//   ? { [ix in keyof S]: S[ix] }
//   : { [ix in keyof T]: S[ix & keyof S] }
//   ;

// export type _ = never
// export interface Labels {
//   1: readonly [ᙚ?: _]
//   2: readonly [ᙚ?: _, ᙚ?: _]
//   3: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _]
//   4: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
//   5: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
//   6: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
//   7: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
//   8: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
//   9: readonly [ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _, ᙚ?: _]
// }
