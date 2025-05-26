import type { TypeConstructor as F, Bind } from './hkt.js'
import { Object_assign, Object_create } from './globalThis.js'

export interface Some<T> extends Bind<F.Option> { _tag: 'Option::Some', value: T }
export interface None extends Bind<F.Option> { _tag: 'Option::None' }
export type Option<T> = Some<T> | None

const NONE = Object_create<None>(null)
NONE._tag = 'Option::None'

const SOME = Object_create<Some<any>>(null)
SOME._tag = 'Option::Some'

export const isOption = <T>(x: unknown): x is Option<T> =>
  !!x && typeof x === 'object' && '_tag' in x && (x._tag === 'Option::Some' || x._tag === 'Option::None')
export function isSome<T>(x: Option<T>): x is Some<T>
export function isSome<T>(x: unknown): x is Some<T>
export function isSome<T>(x: unknown): x is Some<T> { return isOption(x) && x._tag === 'Option::Some' }
export function isNone<T>(x: Option<T>): x is None
export function isNone(x: unknown): x is None
export function isNone(x: unknown): x is None { return isOption(x) && x._tag === 'Option::None' }

export function some<T>(x: T): Option<T> { return Object_assign(Object_create<Some<T>>(null), SOME, { value: x }) }
export function none<T = never>(): Option<T> { return NONE }

export function alt<T>(x: Option<T>, y: Option<T>): Option<T> { return isSome(x) ? x : y }

export function map<S, T>(f: (s: S) => T): (x: Option<S>) => Option<T>
export function map<S, T>(f: (s: S) => T) { return (x: Option<S>) => x._tag === 'Option::None' ? x : some(f(x.value)) }

export function flatMap<S, T>(f: (s: S) => Option<T>): (x: Option<S>) => Option<T>
export function flatMap<S, T>(f: (s: S) => Option<T>) { return (x: Option<S>) => x._tag === 'Option::None' ? x : f(x.value) }

export function getOrElse<T>(fallback: () => T): (x: Option<T>) => T
export function getOrElse<T>(fallback: () => T) {
  return (x: Option<T>) => x._tag === 'Option::Some' ? x.value : fallback()
}

export function fromPredicate<S, T extends S>(predicate: (x: S) => x is T): (x: unknown) => Option<T>
export function fromPredicate<T>(predicate: (x: T) => boolean): (x: T) => Option<T>
export function fromPredicate<T>(predicate: (x: T) => boolean) { return (x: T) => predicate(x) ? some(x) : none() }
