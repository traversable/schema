import {
  Array_isArray,
  Math_max,
  Math_min,
  Number_isFinite,
  Number_isNatural,
  Number_isSafeInteger,
  Number_MAX_SAFE_INTEGER,
  Number_MIN_SAFE_INTEGER,
  Number_NEGATIVE_INFINITY,
  Number_POSITIVE_INFINITY,
} from '@traversable/registry'
import { conjunctiveIdentity } from './predicates.js'

export interface InclusiveBounds<T> {
  minimum?: T
  maximum?: T
}

export interface ExclusiveBounds extends InclusiveBounds<number> {
  exclusiveMinimum?: number
  exclusiveMaximum?: number
}

export const boundedInteger = (bounds: InclusiveBounds<number>) => {
  const _min = bounds.minimum ?? Number_MIN_SAFE_INTEGER
  const _max = bounds.maximum ?? Number_MAX_SAFE_INTEGER
  const min = Math_min(_min, _max)
  const max = Math_max(_max, _min)
  return function BoundedInteger(got: unknown) { return Number_isSafeInteger(got) && min <= got && got <= max }
}

export const boundedBigInt = ({ minimum: _min, maximum: _max }: InclusiveBounds<bigint>) => {
  const min = _min === undefined ? undefined : _max === undefined ? _min : _min <= _max ? _min : _max
  const boundedFromBelow = min === undefined ? conjunctiveIdentity : (got: bigint) => min <= got
  const max = _max === undefined ? undefined : _min === undefined ? _max : _max >= _min ? _max : _min
  const boundedFromAbove = max === undefined ? conjunctiveIdentity : (got: bigint) => got <= max
  return function BoundedBigInt(got: unknown) { return typeof got === 'bigint' && boundedFromBelow(got) && boundedFromAbove(got) }
}

export const boundedNumber = (bounds: ExclusiveBounds) => {
  const min = Math_max(bounds.minimum ?? Number_NEGATIVE_INFINITY, bounds.exclusiveMinimum ?? Number_NEGATIVE_INFINITY)
  const greatestLowerBound = min === bounds.exclusiveMinimum ? bounds.exclusiveMinimum : Number_NEGATIVE_INFINITY
  const max = Math_min(bounds.maximum ?? Number_POSITIVE_INFINITY, bounds.exclusiveMaximum ?? Number_POSITIVE_INFINITY)
  const leastUpperBound = max === bounds.exclusiveMaximum ? bounds.exclusiveMaximum : Number_POSITIVE_INFINITY
  return function BoundedNumber(got: unknown) {
    return Number_isFinite(got)
      && min <= got && got <= max
      && got !== greatestLowerBound && got !== leastUpperBound
  }
}

export const boundedString = (bounds: InclusiveBounds<number>) => {
  const min = Number_isNatural(bounds.maximum) ? Math_min(bounds.minimum ?? 0, bounds.maximum) : bounds.minimum ?? 0
  const max = Number_isNatural(bounds.minimum)
    ? Math_max(bounds.maximum ?? Number_MAX_SAFE_INTEGER, bounds.minimum)
    : bounds.maximum ?? Number_MAX_SAFE_INTEGER
  return function BoundedString(got: unknown) { return typeof got === 'string' && min <= got.length && got.length <= max }
}

export const boundedArray = (bounds: InclusiveBounds<number>, predicate: (x: any) => boolean) => {
  const min = Number_isNatural(bounds.maximum) ? Math_min(bounds.minimum ?? 0, bounds.maximum) : bounds.minimum ?? 0
  const max = Number_isNatural(bounds.minimum)
    ? Math_max(bounds.maximum ?? Number_MAX_SAFE_INTEGER, bounds.minimum)
    : bounds.maximum ?? Number_MAX_SAFE_INTEGER
  return function BoundedArray(got: unknown) { return Array_isArray(got) && min <= got.length && got.length <= max && got.every(predicate) }
}
