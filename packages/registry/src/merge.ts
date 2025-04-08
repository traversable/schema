import type {
  Mut,
  Mutable,
  FiniteArray,
  FiniteObject,
  NonFiniteArray,
  NonFiniteObject,

} from './satisfies.js'
import type { Force } from './types.js'

export type FinArrayWithObject<A, O> = { [I in keyof A & `${number}`]: A[I] } & O
export type NonFinArrayWithObject<A, O> = { [x: number]: A[number & keyof A] } & (number extends keyof O ? { [x: string]: O[keyof O] } : O)
export type LongerThan<T, XS>
  = T['length' & keyof T] extends XS['length' & keyof XS] ? T
  : `${XS['length' & keyof XS] & (string | number)}` extends keyof T ? T
  : never

export type MergePair<
  T extends [any, any],
  X = offset[(T[0]['length' & keyof T[0]]) & keyof offset]
> = { [I in keyof X]: I extends keyof T[1] ? T[1][I] : T[0][I & keyof T[0]] }

export type MergeFiniteArrays<L, R> = [LongerThan<L, R>] extends [never] ? R : MergePair<[L, R]>

export interface offset {
  [0]: [],
  [1]: [unknown],
  [2]: [unknown, unknown],
  [3]: [unknown, unknown, unknown],
  [4]: [unknown, unknown, unknown, unknown],
  [5]: [unknown, unknown, unknown, unknown, unknown]
  [6]: [unknown, unknown, unknown, unknown, unknown, unknown]
  [7]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [8]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [9]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [10]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [11]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [12]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [13]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [14]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [15]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [16]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [17]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [18]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
  [19]: [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]
}


export function mut<const S extends Mut<S>, T>(l: { -readonly [K in keyof S]: S[K] } & T): { -readonly [K in keyof T]: T[K] }
export function mut<const L extends Mut<L>, const R extends Mut<R>, S, T>(
  l: { -readonly [K in keyof L]: L[K] } & S,
  r: { -readonly [K in keyof R]: R[K] } & T
): Mutable<S & T>
export function mut<L, R>(l: L, r?: R) { return { ...l, ...r } }

export function merge<L extends FiniteArray<L>, R extends FiniteArray<R>>(l: L, r: R): MergeFiniteArrays<L, R>
export function merge<L extends FiniteArray<L>, R extends FiniteObject<R>>(l: L, r: R): Force<FinArrayWithObject<L, R>>
export function merge<L extends FiniteObject<L>, R extends FiniteArray<R>>(l: L, r: R): Force<FinArrayWithObject<R, L>>
export function merge<L extends FiniteObject<L>, R extends FiniteObject<R>>(l: L, r: R): Force<L & R>
export function merge<L extends NonFiniteArray<L>, R extends FiniteArray<R>>(l: L, r: R): Force<L & R>
export function merge<L extends FiniteArray<L>, R extends NonFiniteArray<R>>(l: L, r: R): Force<L & R>
export function merge<const L extends FiniteArray<L>, R extends NonFiniteObject<R>>(l: L, r: R): Force<FinArrayWithObject<L, R>>
export function merge<L extends NonFiniteObject<L>, R extends FiniteArray<R>>(l: L, r: R): Force<L & R>
export function merge<L extends FiniteObject<L>, R extends NonFiniteArray<R>>(l: L, r: R): Force<NonFinArrayWithObject<R, L>>
export function merge<L extends NonFiniteArray<L>, R extends FiniteObject<R>>(l: L, r: R): Force<NonFinArrayWithObject<L, R>>
export function merge<L extends NonFiniteObject<L>, R extends FiniteObject<R>>(l: L, r: R): Force<L & R>
export function merge<const L extends FiniteObject<L>, R extends NonFiniteObject<R>>(l: L, r: R): Force<L & R>
export function merge<L extends NonFiniteArray<L>, R extends NonFiniteArray<R>>(l: L, r: R): Force<L & R>
export function merge<L extends NonFiniteArray<L>, R extends NonFiniteObject<R>>(l: L, r: R): Force<NonFinArrayWithObject<L, R>>
export function merge<L extends NonFiniteObject<L>, R extends NonFiniteArray<R>>(l: L, r: R): Force<NonFinArrayWithObject<R, L>>
export function merge<L extends NonFiniteObject<L>, R extends NonFiniteObject<R>>(l: L, r: R): Force<L & R>
export function merge(l: {}, r: {}): unknown {
  if (Array.isArray(l) && Array.isArray(r)) return [...l, ...r]
  else {
    let l_ = globalThis.structuredClone(l)
    return Object.assign(l_, r)
  }
}


// type FiniteArrayToFiniteObject<T> = never | { [I in keyof T as I extends `${number}` ? I : never]: T[I] }
// type NonFiniteArrayToFiniteObject<T extends { [x: number]: any }> = never | { [x: number]: T[number] }
// type MixedToObject<T> = [T] extends [Record<keyof T, T[keyof T]> & infer U] ? U : [fail: Record<keyof T, T[keyof T]>]