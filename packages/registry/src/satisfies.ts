import type { Primitive } from './types.js'

export type Atoms = [
  Date,
  RegExp,
]

/**
 * ## {@link Mut `Mut`}
 * 
 * @example
 * declare function defineImmutable<const T>(x: T): T
 * declare function defineMutable<const T extends Mut<T>>(x: T): T
 * 
 * const ex_01 = defineImmutable([1, [2, { x: [3, { y: { z: [4] } } ] } ] ])
 * const ex_02 = defineMutable([1, [2, { x: [3, { y: { z: [4] } } ] } ] ])
 * 
 * ex_01
 * // ^? const ex_01: readonly [1, readonly [2, readonly [3, { readonly x: readonly [4, { readonly y: { readonly z: readonly [5] } } ] } ] ] ]
 * 
 * ex_02
 * // ^? const ex_02: [1, [2, [3, { x: [4, { y: { z: [5, [6, [7] ] ] } } ] } ] ] ]
 * 
 */
export type Mut<T, Atom = Atoms[number]>
  = [T] extends [infer U extends Primitive] ? U
  : [T] extends [infer U extends Atom] ? U
  : { -readonly [ix in keyof T]: Mut<T[ix], Atom> }

export type Mutable<T> = never | { -readonly [K in keyof T]: T[K] }

