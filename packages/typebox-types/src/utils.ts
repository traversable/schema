import type { Target } from '@traversable/registry'
import { intersectKeys } from '@traversable/registry'
import { tagged, Type } from './functor.js'

export type Tagged = {
  shape: Record<string, unknown>
  tag: string | number | bigint | boolean | null | undefined
}

export type Discriminated = [
  discriminant: string | number,
  tagged: Tagged[],
]

export type PathSpec = {
  path: (string | number)[]
  ident: string
}

export const Invariant = {
  IllegalState(functionName: string, expected: string, got: unknown): never {
    throw Error(`Illegal state (box.${functionName}): ${expected}, got: ${JSON.stringify(got, null, 2)}`)
  }
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
  return tagged('literal')(x)
}

export function isNumeric(x: unknown) {
  return tagged('integer')(x)
    || tagged('number')(x)
}

export function isScalar(x: unknown) {
  return tagged('boolean')(x)
    || tagged('string')(x)
}

export function isTypelevelNullary(x: unknown) {
  return tagged('unknown')(x)
    || tagged('never')(x)
}

export type Primitive = Target<typeof isPrimitive>
export type DeepClonePrimitive = Target<typeof deepCloneIsPrimitive>

export function isPrimitive(x: unknown) {
  return isScalar(x)
    || isNumeric(x)
    || isSpecialCase(x)
}

export function deepCloneIsPrimitive(x: unknown) {
  return tagged('null')(x)
    || isScalar(x)
    || isNumeric(x)
    || isSpecialCase(x)
}

export function schemaOrdering([x]: readonly [unknown, number], [y]: readonly [unknown, number]) {
  return isSpecialCase(x) ? -1 : isSpecialCase(y) ? 1
    : isNumeric(x) ? -1 : isNumeric(y) ? 1
      : isScalar(x) ? -1 : isScalar(y) ? 1
        : isTypelevelNullary(x) ? 1 : isTypelevelNullary(y) ? -1
          : tagged('null')(x) ? 1 : tagged('null')(y) ? -1
            : 0
}

export function deepCloneSchemaOrdering<T>(x: T, y: T) {
  return isSpecialCase(x) ? -1 : isSpecialCase(y) ? 1
    : isNumeric(x) ? -1 : isNumeric(y) ? 1
      : isScalar(x) ? -1 : isScalar(y) ? 1
        : tagged('null')(x) ? -1 : tagged('null')(y) ? 1
          : isTypelevelNullary(x) ? 1 : isTypelevelNullary(y) ? -1
            : 0
}

export function deepCloneInlinePrimitiveCheck(x: DeepClonePrimitive, LEFT_SPEC: PathSpec, RIGHT_SPEC?: PathSpec, useGlobalThis?: boolean) {
  switch (true) {
    default: return x satisfies never
    case tagged('null')(x): return `${LEFT_SPEC.ident} === null${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === null` : ''}`
    case isNumeric(x): return `typeof ${LEFT_SPEC.ident} === 'number'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'number'` : ''}`
    case tagged('string')(x): return `typeof ${LEFT_SPEC.ident} === 'string'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'string'` : ''}`
    case tagged('boolean')(x): return `typeof ${LEFT_SPEC.ident} === 'boolean'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'boolean'` : ''}`
    case tagged('literal')(x): return !RIGHT_SPEC ? 'true' : `${LEFT_SPEC.ident} === ${RIGHT_SPEC.ident}`
  }
}

export function inlinePrimitiveCheck(x: Primitive, LEFT_SPEC: PathSpec, RIGHT_SPEC?: PathSpec, useGlobalThis?: boolean) {
  switch (true) {
    default: return x satisfies never
    case tagged('integer')(x):
    case tagged('number')(x): return `typeof ${LEFT_SPEC.ident} === 'number'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'number'` : ''}`
    case tagged('string')(x): return `typeof ${LEFT_SPEC.ident} === 'string'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'string'` : ''}`
    case tagged('boolean')(x): return `typeof ${LEFT_SPEC.ident} === 'boolean'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'boolean'` : ''}`
    case tagged('literal')(x): return !RIGHT_SPEC ? 'true' : `${LEFT_SPEC.ident} === ${RIGHT_SPEC.ident}`
  }
}

export function areAllObjects(xs: readonly unknown[]): xs is readonly Type.Object<unknown>[] {
  return xs.every(tagged('object'))
}

export function getTags(xs: readonly unknown[]): Discriminated | null {
  if (!areAllObjects(xs)) {
    return null
  } else {
    const shapes = xs.map((x) => x.properties)
    const discriminants = intersectKeys(...shapes)
    if (discriminants.length !== 1) return null
    else {
      const [discriminant] = discriminants
      let seen = new Set()
      const withTags = shapes.map((shape) => {
        const withTag = shape[discriminant]
        if (tagged('literal')(withTag) && typeof withTag.const === 'string') {
          seen.add(withTag.const)
          return { shape, tag: withTag.const }
        } else {
          return null
        }
      })
      if (withTags.every((_) => _ != null) && withTags.length === seen.size) return [discriminant, withTags]
      else return null
    }
  }
}

export function flattenUnion(options: readonly unknown[], out: unknown[] = []): unknown[] {
  for (let ix = 0; ix < options.length; ix++) {
    const option = options[ix]
    if (tagged('anyOf')(option)) out = flattenUnion(option.anyOf, out)
    else out.push(option)
  }
  return out
}
