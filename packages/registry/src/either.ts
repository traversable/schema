import type { Bind, TypeConstructor as F } from './hkt.js'

export type Either<L, R> = Left<L> | Right<R>
export type Any = Either<any, any>
export interface Right<T> extends Bind<F.Either> { _tag: 'Either::Right', right: T }
export interface Left<T> extends Bind<F.Either> { _tag: 'Either::Left', left: T }

export function isEither<L, R>(x: unknown): x is Either<L, R> {
  return !!x && typeof x === 'object' && '_tag' in x && (x._tag === 'Either::Left' || x._tag === 'Either::Right')
}
export function isRight<R, L>(x: Either<L, R>): x is Right<R>
export function isRight<R, L>(x: unknown): x is Right<R>
export function isRight(x: unknown) { return isEither(x) && x._tag === 'Either::Right' }
export function isLeft<L, R>(x: Either<L, R>): x is Left<L>
export function isLeft<L, R>(x: unknown): x is Left<L>
export function isLeft(x: unknown) { return isEither(x) && x._tag === 'Either::Left' }
export function left<L, R = unknown>(x: L): Either<L, R> { return { _tag: 'Either::Left', left: x } }
export function right<R, L = never>(x: R): Either<L, R> { return { _tag: 'Either::Right', right: x } }
export function alt<L, R>(x: Either<L, R>, y: Either<L, R>): Either<L, R> { return isRight(x) ? x : y }

export function fromPredicate<S, T extends S>(predicate: (x: S) => x is T): (x: S) => Either<S, T>
export function fromPredicate<S, T extends S, E>(predicate: (x: S) => x is T, onFalse: (x: S) => E): (x: S) => Either<E, T>
export function fromPredicate<T, E>(predicate: (x: T) => boolean, onFalse: (x: T) => E): (x: T) => Either<E, T>
export function fromPredicate<T, E>(predicate: (x: T) => boolean, onFalse?: (x: T) => E) {
  return (x: T) => predicate(x) ? right(x) : left(!onFalse ? x : onFalse(x))
}

export function either<A, B, T>(onLeft: (a: A) => T, onRight: (b: B) => T): (x: Either<A, B>) => T {
  return (x) => isLeft(x) ? onLeft(x.left) : onRight(x.right)
}

