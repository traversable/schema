
export const Array_isArray: {
  <T>(x: unknown): x is T[]
  <T>(x: unknown, asReadonly?: 'readonly'): x is readonly T[]
} = globalThis.Array.isArray

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

/**
 * ## {@link Number_isNaN `Number_isNaN`}
 * 
 * Returns a Boolean value that indicates whether a value is the reserved value NaN (not a number). 
 * 
 * Unlike the global isNaN(), Number.isNaN() doesn't forcefully convert the parameter to a number. 
 * 
 * Only values of the type number, that are also NaN, result in true.
 */
export const Number_isNaN = globalThis.Number.isNaN

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

export const Object_entries = globalThis.Object.entries

export const Object_keys
  : <T extends {}>(x: T) => (keyof T)[]
  = globalThis.Object.keys

export const Object_values
  : <T extends {}>(x: T) => T[keyof T][]
  = globalThis.Object.values

export const Object_hasOwn
  : <K extends keyof any>(x: unknown, k: K) => x is { [P in K]: unknown }
  = (x, k): x is never => !!x && (typeof x === 'object' || typeof x === 'function') && globalThis.Object.prototype.hasOwnProperty.call(x, k)
