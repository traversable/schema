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
  : { -readonly [K in keyof T]: Mut<T[K], Atom> }

export declare namespace Mut {
  type FiniteArray<T> = [T] extends [readonly any[]] ? number extends T['length'] ? never : [...{ [I in keyof T]: Mut<T[I]> }] : never
  type FiniteObject<T> = [T] extends [Record<keyof any, any>] ? string extends keyof T ? never : number extends keyof T ? never : { -readonly [K in keyof T]: Mut<T[K]> } : never
}

export type NonFiniteArray<T>
  = [T] extends [readonly any[]]
  ? number extends T['length']
  ? readonly [] | readonly unknown[]
  : never : never

export type NonFiniteArrayOf<V, T>
  = [T] extends [readonly any[]]
  ? number extends T['length']
  ? readonly [] | readonly V[]
  : never : never

export type NonFiniteObject<T>
  = string extends keyof T ? Record<string, unknown>
  : number extends keyof T ? Record<number, unknown>
  : never

export type EmptyObject<T> = [keyof T] extends [never] ? {} : never
export type FiniteArray<T> = [T] extends [readonly any[]] ? number extends T['length'] ? never : { [I in keyof T]: T[I] } : never
export type FiniteObject<T> = [T] extends [Record<keyof any, any>] ? string extends keyof T ? never : number extends keyof T ? never : { -readonly [K in keyof T]: T[K] } : never

export type FiniteArrayOf<V, T> = [T] extends [readonly V[]] ? number extends T['length'] ? never : { [I in keyof T]: T[I] } : never

export type FiniteArrayOf_<V, T> = [T] extends [readonly V[]] ? number extends T['length'] ? never : [...V[]] : never

export type FiniteObjectOf<V, T> = [T] extends [Record<string, V>] ? string extends keyof T ? never : number extends keyof T ? never : Mut<T> : never

export type OnlyAny<T, _ = [T] extends [infer _] ? 0 extends 1 & _ ? unknown : never : never> = _
export type OnlyUnknown<T, _ = unknown extends OnlyAny<T> ? never : unknown> = [unknown] extends [T] ? _ : never
export type StringLiteral<T> = [T] extends [string] ? string extends T ? never : string : never
export type NumberLiteral<T> = [T] extends [number] ? number extends T ? never : number : never
export type BooleanLiteral<T> = [T] extends [true | false] ? true | false extends T ? never : boolean : never
export type Literal<T>
  = [T] extends [string | number | boolean]
  ? string extends T ? never
  : number extends T ? never
  : boolean extends T ? never
  : string | number | boolean
  : never

export type Mutable<T> = never | { -readonly [K in keyof T]: T[K] }

export type JsonConstructor<T>
  = [T] extends [Non.Json] ? never
  : [T] extends [Scalar] ? Scalar
  : { [K in keyof T]: JsonConstructor<T[K]> }

export type Scalar = undefined | null | boolean | number | string

export type { toString as Key }
export type toString<T> =
  /* @ts-expect-error - simply resolves to `never` if `T` can't be coerced to a string */
  `${T}`

export type Integer<T extends number> = [`${T}`] extends [`${string}.${string}`] ? never : number

declare const SIGNED_NUMERIC: `-${number}`
declare const STRING_WITH_LEADING_ZERO: `0${string}`
declare const STRING_WITH_LEADING_WHITESPACE: ` ${string}`
declare const STRING_NUMERIC: `${number}`
declare const DOT_SEPARATED: `${string}.${string}`
declare const NON_NATURAL_CONSTRUCTIONS:
  | typeof SIGNED_NUMERIC
  | typeof STRING_WITH_LEADING_ZERO
  | typeof DOT_SEPARATED
  | typeof STRING_WITH_LEADING_WHITESPACE

export type Natural<T> = 0 extends T ? number : [toString<T>] extends [typeof NON_NATURAL_CONSTRUCTIONS] ? never : number

export type NegativeInteger<T, _ extends string = toString<T>>
  = [T] extends [0] ? never
  : [_] extends [typeof DOT_SEPARATED] ? never
  : [_] extends [typeof SIGNED_NUMERIC] ? number
  : typeof STRING_NUMERIC extends _ ? number
  : never

export type PositiveInteger<T, _ extends string = toString<T>>
  = [T] extends [0] ? never
  : [_] extends [typeof SIGNED_NUMERIC | typeof DOT_SEPARATED] ? never
  : number

export type NonNegativeInteger<T>
  = [T] extends [0] ? number
  : [toString<T>] extends [typeof SIGNED_NUMERIC | typeof DOT_SEPARATED] ? never
  : number

export type NonPositiveInteger<T, _ extends string = toString<T>>
  = [T] extends [0] ? number
  : [_] extends [typeof DOT_SEPARATED] ? never
  : [_] extends [typeof SIGNED_NUMERIC] ? number
  : typeof STRING_NUMERIC extends _ ? number
  : never

export type NegativeNumber<T>
  = [T] extends [0] ? never
  : [toString<T>] extends [typeof SIGNED_NUMERIC] ? number
  : typeof STRING_NUMERIC extends toString<T> ? number
  : never

export type PositiveNumber<T, _ extends string = toString<T>>
  = [T] extends [0] ? never
  : [toString<T>] extends [typeof SIGNED_NUMERIC] ? never
  : number

export type NonNegativeNumber<T>
  = [T] extends [0] ? number
  : [toString<T>] extends [typeof SIGNED_NUMERIC] ? never
  : number

export type NonPositiveNumber<T>
  = [T] extends [0] ? number
  : [toString<T>] extends [typeof SIGNED_NUMERIC] ? number
  : typeof STRING_NUMERIC extends toString<T> ? number
  : never

export type StringifiedNatural<T>
  = [T] extends [typeof NON_NATURAL_CONSTRUCTIONS] ? never
  : [T] extends [typeof STRING_NUMERIC] ? typeof STRING_NUMERIC
  : never

export type NonUnion<
  T,
  _ extends
  | ([T] extends [infer _] ? _ : never)
  = ([T] extends [infer _] ? _ : never)
> = _ extends _ ? [T] extends [_] ? _ : never : never

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

declare namespace experimental {
  type LongerThan<Bound extends any[], T extends any[]> = [{ [I in keyof T]: any }] extends [[...Bound, ...any]] ? T : never
  namespace GreaterThanOrEqualTo {
    type SingleDigit<Bound extends number, T extends number> = [Bound, T] extends [T, Bound] ? T : '0123456789' extends `${string}${Bound}${string}${T}${string}` ? T : never
  }
  type GreaterThan<
    Bound extends number,
    T extends number,
    Z = GreaterThan.Zip<Bound, T>
  > = [Z] extends [never[]] ? never : T
  namespace GreaterThan {
    type SingleDigit<Bound extends number, T extends number> = '0123456789' extends `${string}${Bound}${string}${T}${string}` ? T : never
    type DigitsOf<T extends number | string, Out extends any[] = []> = `${T}` extends `${infer D extends number}${infer DS}` ? DigitsOf<DS, [...Out, D]> : Out
    type Zip<
      Bound extends number,
      T extends number,
      _Bound extends any[] = GreaterThan.DigitsOf<Bound>,
      _T extends any[] = GreaterThan.DigitsOf<T>,
    > = [LongerThan<_Bound, _T>] extends [never] ? never : [LongerThan<_T, _Bound>] extends [never] ? T
    : { [I in keyof _T]: I extends _T['length'] ? GreaterThan.SingleDigit<_Bound[I & keyof _Bound], _T[I]> : GreaterThan.SingleDigit<_Bound[I & keyof _Bound], _T[I]> }
  }
}

export declare namespace ArrayOf {
  /**
   * @example
   * declare function arrayOfNonAny<T extends ArrayOf.NonAny<T>>(xs: T): T
   * 
   * const ex_01 = arrayOfNonAny([Boolean(), Number(), String()])
   * //    ^? const ex_01: [boolean, number, string]
   * 
   * const ex_02 = arrayOfNonAny([Boolean(), Number(), JSON.parse('0')])
   * //    ^? const ex_02: [boolean, number, never]    ^^^^^^^^^^^^^^^   🚫 Type 'any' is not assignable to type 'never'
   */
  type NonAny<T> = [T] extends [readonly unknown[]] ? { [I in keyof T]: 0 extends 1 & T[I] ? never : T[I] } : never
  /**
   * @example
   * declare function arrayOfOnlyAny<T extends ArrayOf.OnlyAny<T>>(xs: T): T
   * 
   * const ex_01 = arrayOfOnlyAny([Number(), Number()])
   * //     ^? const ex_01: [number, number]
   * 
   * const ex_02 = arrayOfOnlyAny([JSON.parse(0x00 + ''), 0x01])
   * //     ^? const ex_02: [any, never]                  ^^^^   🚫 Type 'number' is not assignable to type 'never'
   */
  type OnlyAny<T> = [T] extends [readonly unknown[]] ? { [I in keyof T]: 0 extends 1 & T[I] ? T[I] : never } : never
}

export declare namespace Not {
  /**
   * ## {@link Any `Not.Any`}
   * 
   * @example
   * import type { Not } from '@traversable/registry'
   * 
   * declare function notAny<T extends Not.Any<T>>(schema: T): T
   * declare const any: any
   * 
   * const ex_01 = notUnknown({ a: 1 })
   * //    ^? const ex_01: { a: number }
   * 
   * const ex_02 = notUnknown(unknown)
   * //                       ^^^^^^^ 
   * // 🚫 TypeError: Argument of type 'unknown' is not assignable to parameter of type 'never'
   */
  type Any<S, T = [S] extends [infer _] ? 0 extends 1 & _ ? never : unknown : never> = T

  /**
   * ## {@link Unknown `Not.Unknown`}
   * 
   * @example
   * import type { Not } from '@traversable/registry'
   * 
   * declare function notUnknown<T extends Not.Unknown<T>>(schema: T): T
   * declare const unknown: unknown
   * 
   * const ex_01 = notUnknown({ a: 1 })
   * //    ^? const ex_01: { a: number }
   * 
   * const ex_02 = notUnknown(unknown)
   * //                       ^^^^^^^ 
   * // 🚫 TypeError: Argument of type 'unknown' is not assignable to parameter of type 'never'
   */
  type Unknown<T> = unknown extends T ? never : unknown
}

export declare namespace Non {
  type Json =
    | bigint
    | symbol
    | globalThis.Function
    | globalThis.Date
    | globalThis.RegExp
}
