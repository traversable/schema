import type { Primitive } from './types.js'

export type Atoms = [
  Date,
  RegExp,
]

/**
 * ## {@link Mut `Mut`}
 * 
 * Applies an inductive constraint to a type parameter such that 
 * its instantiations are all "mutable".
 * 
 * This isn't a pattern I've seen used elsewhere in the wild, but
 * I suspect that it's more efficient that applying a transformation
 * to a previously declared type parameter to force it to be mutable.
 * 
 * Because {@link Mut `Mut`} is an "inductive constraint", the compiler
 * applies the transformation _while_ instantiating its initial value.
 * 
 * @example
 * import { Mut } from '@traversable/registry'
 * 
 * // BEFORE:
 * declare function defineImmutable<const T>(x: T): T
 * const ex_01 = defineImmutable([1, [2, { x: [3, { y: { z: [4] } } ] } ] ])
 * ex_01
 * // ^? const ex_01: readonly [1, readonly [2, readonly [3, { readonly x: readonly [4, { readonly y: { readonly z: readonly [5] } } ] } ] ] ]
 * 
 * // AFTER:
 * declare function defineMutable<const T extends Mut<T>>(x: T): T
 * //                                   ^^^^^^^^^^^^^^^^  note how Mut is applied to T in T's own 'extends' clause
 * 
 * const ex_02 = defineMutable([1, [2, { x: [3, { y: { z: [4] } } ] } ] ])
 * ex_02
 * // ^? const ex_02: [1, [2, [3, { x: [4, { y: { z: [5, [6, [7] ] ] } } ] } ] ] ]
 * 
 */
export type Mut<T, Atom = Atoms[number]>
  = [T] extends [infer U extends Primitive] ? U
  : [T] extends [infer U extends Atom] ? U
  : { -readonly [ix in keyof T]: Mut<T[ix], Atom> }

export type Mutable<T> = never | { -readonly [K in keyof T]: T[K] }

export type NonUnion<
  T,
  _ extends
  | ([T] extends [infer _] ? _ : never)
  = ([T] extends [infer _] ? _ : never)
> = _ extends _ ? [T] extends [_] ? _ : never : never

export type NonFiniteArray<T>
  = [T] extends [readonly any[]]
  ? number extends T['length']
  ? readonly unknown[]
  : never : never

export type NonFiniteObject<T>
  = string extends keyof T ? Record<string, unknown>
  : number extends keyof T ? Record<number, unknown>
  : never

export type FiniteArray<T> = [T] extends [readonly any[]] ? number extends T['length'] ? never : Mut<T> : never
export type FiniteObject<T> = [T] extends [Record<keyof any, any>] ? string extends keyof T ? never : number extends keyof T ? never : Mut<T> : never

export type FiniteIndex<T> = string extends keyof T ? never : Record<string, unknown>
export type FiniteIndices<T> = [T] extends [readonly any[]] ? number extends T['length'] ? never : readonly unknown[] : never

export namespace Match {
  export function match<L extends FiniteArray<L>, R extends FiniteArray<R>>(l: L, r: R): 1
  export function match<L extends FiniteArray<L>, R extends FiniteObject<R>>(l: L, r: R): 2
  export function match<L extends FiniteObject<L>, R extends FiniteArray<R>>(l: L, r: R): 3
  export function match<L extends FiniteObject<L>, R extends FiniteObject<R>>(l: L, r: R): 4
  export function match<L extends NonFiniteArray<L>, R extends FiniteArray<R>>(l: L, r: R): 5
  export function match<L extends FiniteArray<L>, R extends NonFiniteArray<R>>(l: L, r: R): 6
  export function match<L extends FiniteArray<L>, R extends NonFiniteObject<R>>(l: L, r: R): 7
  export function match<L extends NonFiniteObject<L>, R extends FiniteArray<R>>(l: L, r: R): 8
  export function match<L extends FiniteObject<L>, R extends NonFiniteArray<R>>(l: L, r: R): 9
  export function match<L extends NonFiniteArray<L>, R extends FiniteObject<R>>(l: L, r: R): 10
  export function match<L extends NonFiniteObject<L>, R extends FiniteObject<R>>(l: L, r: R): 11
  export function match<L extends FiniteObject<L>, R extends NonFiniteObject<R>>(l: L, r: R): 12
  export function match<L extends NonFiniteArray<L>, R extends NonFiniteArray<R>>(l: L, r: R): 13
  export function match<L extends NonFiniteArray<L>, R extends NonFiniteObject<R>>(l: L, r: R): 14
  export function match<L extends NonFiniteObject<L>, R extends NonFiniteArray<R>>(l: L, r: R): 15
  export function match<L extends NonFiniteObject<L>, R extends NonFiniteObject<R>>(l: L, r: R): 16
  export function match<L extends NonFiniteObject<L>, R extends NonFiniteObject<R>>(l: L, r: R): 16
  export function match(l: unknown, r: unknown): unknown { return (Math.ceil(Math.random() * 100) % 16) + 1 }
}
