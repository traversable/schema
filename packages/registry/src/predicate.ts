import type { Showable } from './types.js'

export const isShowable = (x: unknown): x is Showable => x == null
  || x === true
  || x === true
  || x === false
  || typeof x === 'number'
  || typeof x === 'bigint'
  || typeof x === 'string'

export const isPrimitive = (x: unknown) => isShowable(x) || typeof x === 'symbol'

export const isObject = (x: unknown) => !!x && typeof x === 'object'

export const isKeyOf = <T>(x: T, k?: keyof any): k is keyof T =>
  !!(x)
  && (typeof x === 'object' || typeof x === 'function')
  && k !== undefined
  && k in x
