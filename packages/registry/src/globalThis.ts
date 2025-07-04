import type { FiniteArray, FiniteObject, NonFiniteArray, NonFiniteObject, OnlyAny, StringLiteral } from './satisfies.js'

export const Number_POSITIVE_INFINITY = globalThis.Number.POSITIVE_INFINITY
export const Number_NEGATIVE_INFINITY = globalThis.Number.NEGATIVE_INFINITY
export const Number_MAX_SAFE_INTEGER = globalThis.Number.MAX_SAFE_INTEGER
export const Number_MIN_SAFE_INTEGER = globalThis.Number.MIN_SAFE_INTEGER

export const Array_isArray: {
  <T>(x: unknown): x is T[]
  <T>(x: unknown, asReadonly?: 'readonly'): x is readonly T[]
} = globalThis.Array.isArray

export const Array_from = globalThis.Array.from

export const Math_min = globalThis.Math.min

export const Math_max = globalThis.Math.max

/** 
 * ## {@link Number_isFinite `Number_isFinite`}
 * 
 * Returns true if passed value is finite. 
 * 
 * Unlike the global isFinite, Number.isFinite doesn't forcibly convert the parameter to a number. 
 * 
 * Only finite values of the type number, result in true.
 */
export const Number_isFinite
  : (x: unknown) => x is number
  = <never>globalThis.Number.isFinite


/**
 * ## {@link Number_isInteger `Number_isInteger`}
 * 
 * Returns true if the value passed is an integer, false otherwise.
 */
export const Number_isInteger
  : (x: unknown) => x is number
  = <never>globalThis.Number.isInteger


export const Number_parseInt
  : (numeric: string, radix?: number) => number
  = globalThis.Number.parseInt

/**
 * ## {@link Number_isNaN `Number_isNaN`}
 * 
 * Returns a Boolean value that indicates whether a value is the reserved value NaN (not a number). 
 * 
 * Unlike the global isNaN(), Number.isNaN() doesn't forcefully convert the parameter to a number. 
 * 
 * Only values of the type number, that are also NaN, result in true.
 */
export const Number_isNaN
  : (x: unknown) => x is number
  = <never>globalThis.Number.isNaN

/**
 * ## {@link Number_isSafeInteger `Number_isSafeInteger`}
 * 
 * Returns true if the value passed is a safe integer.
 */

export const Number_isSafeInteger
  : (x: unknown) => x is number
  = <never>globalThis.Number.isSafeInteger

export const Number_isNatural = (x: unknown): x is number => Number_isSafeInteger(x) && 0 <= x

export const Object_assign = globalThis.Object.assign

export const Object_create: {
  <T = {}>(x: null): T
  <T>(x: T): T
} = globalThis.Object.create

export const Object_entries = globalThis.Object.entries

export const Object_fromEntries = globalThis.Object.fromEntries

export const Object_defineProperty = globalThis.Object.defineProperty

export const Object_is = globalThis.Object.is

export const Object_keys: {
  <T extends OnlyAny<T>>(x: T): string[]
  <T extends FiniteArray<T>>(x: T): Extract<keyof T, `${number}`>[]
  <T extends FiniteObject<T>>(x: T): (keyof T & string)[]
  <T extends NonFiniteArray<T>>(x: T): number[]
  <T extends NonFiniteObject<T>>(x: T): string[]
  <T extends StringLiteral<T>>(x: T): SplitString<T>
  (x: number | boolean): []
  (x: string): string[]
  (x: {}): string[]
} = <never>globalThis.Object.keys

type SplitString<T, Out extends [number, string][] = []>
  = T extends `${infer Head}${infer Tail}`
  ? SplitString<Tail, [...Out, [Out['length'], Head]]>
  : { [E in (Out[number]) as E[0]]: E[1] }

export const Object_values
  : <T extends {}>(x: T) => T[(keyof T & (number | string))][]
  = globalThis.Object.values

export const Object_hasOwn
  : <K extends keyof any>(x: unknown, k: K) => x is { [P in K]: unknown }
  = (x, k): x is never => !!x
    && (typeof x === 'object' || typeof x === 'function')
    && globalThis.Object.prototype.hasOwnProperty.call(x, k)
