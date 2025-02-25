import type * as T from './types.js'

interface TypeError<Msg extends string = string, T = {}> extends T.TypeError.Unary<Msg, T> { }

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
  = [T] extends [infer U extends T.Primitive] ? U
  : [T] extends [infer U extends Atom] ? U
  : { -readonly [ix in keyof T]: Mut<T[ix], Atom> }

export type Mutable<T> = never | { -readonly [K in keyof T]: T[K] }

/**
 * ## {@link Fin `Fin`}
 * 
 * Applies an inductive constraint to a type parameter such that 
 * its instantiations are all _finite_ -- that is, literal values.
 * 
 * This isn't a pattern I've seen used elsewhere in the wild, but
 * I suspect that it's more efficient that applying a transformation
 * to a previously declared type parameter to force it to be mutable.
 * 
 * Because {@link Fin `Fin`} is an "inductive constraint", the compiler
 * applies the transformation _while_ instantiating its initial value.
 * 
 */
export type Finite<S>
  = [S] extends [infer T extends T.Primitive]
  ? [boolean] extends [T] ? TypeError<'Expected boolean literal, got:', boolean>
  : [number] extends [T] ? TypeError<'Expected numeric literal, got:', number>
  : [string] extends [T] ? TypeError<'Expected string literal, got:', string>
  : [bigint] extends [T] ? TypeError<'Expected bigint literal, got:', bigint>
  : [T] extends [symbol]
  ? [T & typeof Finite.symbol] extends [never] ? T : TypeError<'Expected unique symbol, got:', symbol>
  : T
  : [S] extends [infer T extends { [x: number]: any }] ? Finite.object<T>
  : TypeError<'Expected finite type, got:', S>
  ;

export declare namespace Finite {
  export const symbol: unique symbol
  export { Fin_object as object }
  export type Fin_object<T, K = keyof T, Ix = T['length' & keyof T]>
    = string extends K ? TypeError<'Expected object literal, got:', T>
    : number extends Ix ? TypeError<'Expected tuple literal, got:', {}>
    : { -readonly [K in keyof T]: Finite<T[K]> }
}
