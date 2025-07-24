import type { Target } from '@traversable/registry'
import { intersectKeys } from '@traversable/registry'
import { JsonSchema } from '@traversable/json-schema-types'

export type Tagged = {
  shape: Record<string, unknown>
  tag: string | number | bigint | boolean | null | undefined
}

export type Discriminated = [
  discriminant: string | number,
  tagged: Tagged[]
]

export type PathSpec = {
  path: (string | number)[]
  ident: string
}

export const defaultPrevSpec = {
  ident: 'prev',
  path: ['prev'],
} satisfies PathSpec

export const defaultNextSpec = {
  ident: 'next',
  path: ['next'],
} satisfies PathSpec

export function isSpecialCase(x: unknown) {
  return JsonSchema.isEnum(x)
}

export function isNumeric(x: unknown) {
  return JsonSchema.isInteger(x)
    || JsonSchema.isNumber(x)
}

export function isScalar(x: unknown) {
  return JsonSchema.isBoolean(x)
    || JsonSchema.isString(x)
}

export function isTypelevelNullary(x: unknown) {
  return JsonSchema.isUnknown(x)
    || JsonSchema.isNever(x)
}

export type Primitive = Target<typeof isPrimitive>

export function isPrimitive(x: unknown) {
  return isScalar(x)
    || isNumeric(x)
    || isSpecialCase(x)
}

export function schemaOrdering(x: readonly [JsonSchema, number], y: readonly [JsonSchema, number]) {
  return isSpecialCase(x) ? -1 : isSpecialCase(y) ? 1
    : isNumeric(x) ? -1 : isNumeric(y) ? 1
      : isScalar(x) ? -1 : isScalar(y) ? 1
        : isTypelevelNullary(x) ? 1 : isTypelevelNullary(y) ? -1
          : JsonSchema.isNull(x) ? 1 : JsonSchema.isNull(y) ? -1
            : 0
}

export function inlinePrimitiveCheck(x: Primitive, LEFT_SPEC: PathSpec, RIGHT_SPEC?: PathSpec, useGlobalThis?: boolean) {
  switch (true) {
    default: return x satisfies never
    case JsonSchema.isInteger(x):
    case JsonSchema.isNumber(x): return `typeof ${LEFT_SPEC.ident} === 'number'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'number'` : ''}`
    case JsonSchema.isString(x): return `typeof ${LEFT_SPEC.ident} === 'string'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'string'` : ''}`
    case JsonSchema.isBoolean(x): return `typeof ${LEFT_SPEC.ident} === 'boolean'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'boolean'` : ''}`
    case JsonSchema.isEnum(x): return !RIGHT_SPEC ? 'true' : `${LEFT_SPEC.ident} === ${RIGHT_SPEC.ident}`
  }
}

export function areAllObjects(xs: readonly unknown[]) {
  return xs.every(JsonSchema.isObject)
}

export function getTags(xs: readonly JsonSchema[]): Discriminated | null {
  if (!areAllObjects(xs)) {
    return null
  } else {
    const shapes = xs.map((x) => x.properties)
    const discriminants = intersectKeys(...shapes)
    const [discriminant] = discriminants
    if (discriminants.length !== 1) return null
    else {
      let seen = new Set()
      const withTags = shapes.map((shape) => {
        const withTag = shape[discriminant]
        if (!JsonSchema.isConst(withTag)) {
          return null
        } else {
          if (typeof withTag.const !== 'string') return null
          else {
            seen.add(withTag.const)
            return { shape, tag: withTag.const }
          }
        }
      })
      if (withTags.every((_) => _ !== null) && withTags.length === seen.size) return [discriminant, withTags]
      else return null
    }
  }
}

