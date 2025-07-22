import {
  escapeRegExp,
  Number_isSafeInteger,
  Number_isFinite,
  Math_min,
  Math_max,
  Number_isNatural,
  Object_entries,
  Object_keys,
  Object_hasOwn,
  Object_values,
} from '@traversable/registry'
import { Json } from '@traversable/json'

import { fold, defaultIndex } from './functor.js'
import * as JsonSchema from './types.js'
type JsonSchema<T = unknown> = import('./types.js').JsonSchema<T>

export const checkJson = Json.fold<(x: unknown) => boolean>((x) => {
  switch (true) {
    default: return (void (x satisfies never), () => false)
    case Json.isScalar(x):
      return (u) => u === x
    case Json.isArray(x):
      return (u) => Json.isArray(u)
        && u.length === x.length
        && x.every((predicate, i) => predicate(u[i]))
    case Json.isObject(x): {
      const predicates = Object_entries(x)
      return (u) => {
        if (!Json.isObject(u)) {
          return false
        } else {
          const keys = Object_keys(u)
          if (keys.length !== predicates.map(([k]) => k).length)
            return false
          else
            return predicates.every(
              ([k, predicate]) =>
                Object_hasOwn(u, k)
                && predicate(u[k])
            )
        }
      }
    }
  }
})

const algebra = fold<(x: unknown) => boolean>((x) => {
  switch (true) {
    default: return (void (x satisfies never), () => false)
    case JsonSchema.isNever(x): return () => false
    case JsonSchema.isConst(x): return checkJson(x.const)
    case JsonSchema.isNull(x): return (u) => u === null
    case JsonSchema.isBoolean(x): return (u) => u === false || u === true
    case JsonSchema.isUnion(x): return (u) => x.anyOf.some((p) => p(u))
    case JsonSchema.isIntersection(x): return (u) => x.allOf.every((p) => p(u))
    case JsonSchema.isEnum(x): return (u) =>
      u !== undefined
      && Json.isScalar(u)
      && x.enum.includes(u)
    case JsonSchema.isInteger(x): {
      const { maximum, minimum, multipleOf } = x
      if (Number_isSafeInteger(maximum) && Number_isSafeInteger(minimum) && Number_isSafeInteger(multipleOf))
        return (u) => Number_isSafeInteger(u)
          && minimum <= u
          && u <= maximum
          && u % multipleOf === 0
      else if (Number_isSafeInteger(maximum) && Number_isSafeInteger(minimum))
        return (u) => Number_isSafeInteger(u)
          && minimum <= u
          && u <= maximum
      else if (Number_isSafeInteger(maximum) && Number_isSafeInteger(multipleOf))
        return (u) => Number_isSafeInteger(u)
          && u <= maximum
          && u % multipleOf === 0
      else if (Number_isSafeInteger(maximum))
        return (u) => Number_isSafeInteger(u)
          && u <= maximum
      else if (Number_isSafeInteger(minimum) && Number_isSafeInteger(multipleOf))
        return (u) => Number_isSafeInteger(u)
          && minimum <= u
          && u % multipleOf === 0
      else if (Number_isSafeInteger(minimum))
        return (u) => Number_isSafeInteger(u)
          && minimum <= u
      else if (Number_isSafeInteger(multipleOf))
        return (u) => Number_isSafeInteger(u)
          && u % multipleOf === 0
      else
        return (u) => Number_isSafeInteger(u)
    }
    case JsonSchema.isNumber(x): {
      const { exclusiveMaximum: xMax, exclusiveMinimum: xMin, maximum: max, minimum: min, multipleOf } = x
      const maximum = Number_isFinite(xMax) && Number_isFinite(max) ? Math_min(xMax, max) : Number_isFinite(xMax) ? xMax : max
      const minimum = Number_isFinite(xMin) && Number_isFinite(min) ? Math_max(xMin, min) : Number_isFinite(xMin) ? xMin : min
      const exclusiveMaximum = Number_isFinite(xMax) && xMax === maximum
      const exclusiveMinimum = Number_isFinite(xMin) && xMin === minimum
      if (Number_isFinite(maximum) && Number_isFinite(minimum) && Number_isFinite(multipleOf))
        if (exclusiveMaximum && exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u < maximum
            && u % multipleOf === 0
        else if (exclusiveMaximum)
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u < maximum
            && u % multipleOf === 0
        else if (exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u <= maximum
            && u % multipleOf === 0
        else
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u <= maximum
            && u % multipleOf === 0
      else if (Number_isFinite(maximum) && Number_isFinite(minimum))
        if (exclusiveMaximum && exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u < maximum
        else if (exclusiveMaximum)
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u < maximum
        else if (exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u <= maximum
        else
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u <= maximum
      else if (Number_isFinite(maximum) && Number_isFinite(multipleOf))
        if (exclusiveMaximum)
          return (u) =>
            Number_isFinite(u)
            && u < maximum
            && u % multipleOf === 0
        else
          return (u) =>
            Number_isFinite(u)
            && u <= maximum
            && u % multipleOf === 0
      else if (Number_isFinite(maximum))
        if (exclusiveMaximum)
          return (u) =>
            Number_isFinite(u)
            && u < maximum
        else
          return (u) =>
            Number_isFinite(u)
            && u <= maximum
      else if (Number_isFinite(minimum) && Number_isFinite(multipleOf))
        if (exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
            && u % multipleOf === 0
        else
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
            && u % multipleOf === 0
      else if (Number_isFinite(minimum))
        if (exclusiveMinimum)
          return (u) =>
            Number_isFinite(u)
            && minimum < u
        else
          return (u) =>
            Number_isFinite(u)
            && minimum <= u
      else if (Number_isFinite(multipleOf))
        return (u) =>
          Number_isFinite(u)
          && u % multipleOf === 0
      else
        return (u) =>
          Number_isFinite(u)
    }
    case JsonSchema.isString(x): {
      const { maxLength, minLength } = x
      if (Number_isNatural(maxLength) && Number_isNatural(minLength))
        return (u) =>
          typeof u === 'string'
          && minLength <= u.length
          && u.length <= maxLength
      else if (Number_isNatural(maxLength))
        return (u) =>
          typeof u === 'string'
          && u.length <= maxLength
      else if (Number_isNatural(minLength))
        return (u) =>
          typeof u === 'string'
          && minLength <= u.length
      else
        return (u) =>
          typeof u === 'string'
    }
    case JsonSchema.isArray(x): {
      const { items: predicate, maxItems, minItems } = x
      if (predicate)
        if (Number_isNatural(maxItems) && Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && u.every(predicate)
            && minItems <= u.length
            && u.length <= maxItems
        else if (Number_isNatural(maxItems))
          return (u) =>
            Json.isArray(u)
            && u.every(predicate)
            && u.length <= maxItems
        else if (Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && u.every(predicate)
            && minItems <= u.length
        else return (u) =>
          Json.isArray(u)
          && u.every(predicate)
      else
        if (Number_isNatural(maxItems) && Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && u.length <= maxItems
        else if (Number_isNatural(maxItems))
          return (u) =>
            Json.isArray(u)
            && u.length <= maxItems
        else if (Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
        else
          return Json.isArray
    }
    case JsonSchema.isTuple(x): {
      const { items: predicate, maxItems, minItems, prefixItems: predicates } = x
      if (predicate)
        if (Number_isNatural(maxItems) && Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && u.length <= maxItems
            && predicates.every((p, i) => p(u[i]))
            && u.slice(predicates.length).every(predicate)
        else if (Number_isNatural(maxItems))
          return (u) =>
            Json.isArray(u)
            && u.length <= maxItems
            && predicates.every((p, i) => p(u[i]))
            && u.slice(predicates.length).every(predicate)
        else if (Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && predicates.every((p, i) => p(u[i]))
            && u.slice(predicates.length).every(predicate)
        else return (u) =>
          Json.isArray(u)
          && predicates.every((p, i) => p(u[i]))
          && u.slice(predicates.length).every(predicate)
      else
        if (Number_isNatural(maxItems) && Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && u.length <= maxItems
            && predicates.every((p, i) => p(u[i]))
        else if (Number_isNatural(maxItems))
          return (u) =>
            Json.isArray(u)
            && u.length <= maxItems
            && predicates.every((p, i) => p(u[i]))
        else if (Number_isNatural(minItems))
          return (u) =>
            Json.isArray(u)
            && minItems <= u.length
            && predicates.every((p, i) => p(u[i]))
        else return (u) =>
          Json.isArray(u)
          && predicates.every((p, i) => p(u[i]))
    }
    case JsonSchema.isRecord(x): {
      const { additionalProperties, patternProperties } = x
      if (additionalProperties && patternProperties) {
        const patterns = Object_entries(patternProperties)
        return (u) => {
          if (!Json.isObject(u)) return false
          else {
            const keys = Object_keys(u)
            return keys.every(
              (key) => {
                const [, predicate] = patterns.find(([p]) => new RegExp(escapeRegExp(p)).test(key)) || []
                return (
                  predicate
                  && predicate(u[key])
                )
                  || additionalProperties(u[key])
              }
            )
          }
        }
      } else if (additionalProperties) {
        return (u) =>
          Json.isObject(u)
          && Object_values(u).every(additionalProperties)
      } else if (patternProperties) {
        const patterns = Object_entries(patternProperties)
        return (u) => {
          if (!Json.isObject(u)) {
            return false
          } else {
            const keys = Object_keys(u)
            return keys.every(
              (key) => {
                const [, predicate] = patterns.find(([p]) => new RegExp(escapeRegExp(p)).test(key)) || []
                return predicate && predicate(u[key])
              }
            )
          }
        }
      } else return Json.isObject
    }
    case JsonSchema.isObject(x): {
      const { properties, required } = x
      const predicates = Object_entries(properties)
      return (u) =>
        Json.isObject(u)
        && predicates.every(
          ([k, predicate]) =>
            !required.includes(k)
              ? (
                !Object_hasOwn(u, k)
                || predicate(u[k])
              )
              : (
                Object_hasOwn(u, k)
                && predicate(u[k])
              )
        )
    }
    case JsonSchema.isUnknown(x): return () => true
  }
})

export function check<T extends JsonSchema>(schema: T): (x: unknown) => boolean {
  return algebra(schema as JsonSchema<(x: unknown) => boolean>, defaultIndex)
}
