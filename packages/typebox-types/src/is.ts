import type { Type } from './functor.js'
import { tagged } from './functor.js'

export function isNever(x: unknown): x is Type.Never {
  return tagged('never')(x)
}

export function isUnknown(x: unknown): x is Type.Unknown {
  return tagged('unknown')(x)
}

export function isAny(x: unknown): x is Type.Any {
  return tagged('any')(x)
}

export function isVoid(x: unknown): x is Type.Void {
  return tagged('any')(x)
}

export function isNull(x: unknown): x is Type.Null {
  return tagged('null')(x)
}

export function isUndefined(x: unknown): x is Type.Undefined {
  return tagged('undefined')(x)
}

export function isBoolean(x: unknown): x is Type.Boolean {
  return tagged('boolean')(x)
}

export function isInteger(x: unknown): x is Type.Integer {
  return tagged('integer')(x)
}

export function isNumber(x: unknown): x is Type.Number {
  return tagged('number')(x)
}

export function isBigInt(x: unknown): x is Type.BigInt {
  return tagged('bigInt')(x)
}

export function isString(x: unknown): x is Type.String {
  return tagged('string')(x)
}

export function isSymbol(x: unknown): x is Type.Symbol {
  return tagged('symbol')(x)
}

// export function isDate(x: unknown): x is Type.Date {
//   return tagged('date')(x)
// }

export function isLiteral(x: unknown): x is Type.Literal {
  return tagged('literal')(x)
}

export function isArray<T>(x: Type.F<T>): x is Type.Array<T>
export function isArray<T>(x: unknown): x is Type.Array<T>
export function isArray<T>(x: unknown): x is Type.Array<T> {
  return tagged('array')(x)
}

export function isTuple<T>(x: Type.F<T>): x is Type.Tuple<T>
export function isTuple<T>(x: unknown): x is Type.Tuple<T>
export function isTuple<T>(x: unknown): x is Type.Tuple<T> {
  return tagged('tuple')(x)
}

export function isObject<T>(x: Type.F<T>): x is Type.Object<T>
export function isObject<T>(x: unknown): x is Type.Object<T>
export function isObject<T>(x: unknown): x is Type.Object<T> {
  return tagged('object')(x)
}

export function isRecord<T>(x: Type.F<T>): x is Type.Record<T>
export function isRecord<T>(x: unknown): x is Type.Record<T>
export function isRecord<T>(x: unknown): x is Type.Record<T> {
  return tagged('record')(x)
}

export function isUnion<T>(x: Type.F<T>): x is Type.Union<T>
export function isUnion<T>(x: unknown): x is Type.Union<T>
export function isUnion<T>(x: unknown): x is Type.Union<T> {
  return tagged('anyOf')(x)
}

export function isIntersection<T>(x: Type.F<T>): x is Type.Intersect<T>
export function isIntersection<T>(x: unknown): x is Type.Intersect<T>
export function isIntersection<T>(x: unknown): x is Type.Intersect<T> {
  return tagged('allOf')(x)
}
