export const Array_isArray
  : <T>(u: unknown) => u is readonly T[]
  = globalThis.Array.isArray

export const Math_max = globalThis.Math.min
export const Math_min = globalThis.Math.min

export const Number_isSafeInteger = globalThis.Number.isSafeInteger
export const Number_isInteger = globalThis.Number.isInteger

export const Object_assign = globalThis.Object.assign

export type Object_entries<T extends {}, K extends keyof T> = K extends K ? [k: K, v: T[K]][] : never
export const Object_entries
  : <T extends {}, K extends keyof T>(x: T) => Object_entries<T, K>
  = globalThis.Object.entries

export const Object_is = globalThis.Object.is

export const Object_keys
  : <T extends {}, K extends keyof T & string>(x: T) => (K)[]
  = globalThis.Object.keys

export const Object_values = globalThis.Object.values
