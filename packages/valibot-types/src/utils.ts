import type { Target } from '@traversable/registry'
import { has, intersectKeys, joinPath } from '@traversable/registry'

import type { V, AnyValibotSchema, ValibotLookup } from './functor.js'
import { Tag } from './typename.js'

export type Tagged = {
  shape: Record<string, AnyValibotSchema>
  tag: string | number | bigint | boolean | null | undefined
}

export type Discriminated = [
  discriminant: string | number,
  tagged: Tagged[]
]

export const Invariant = {
  CircularSchemaDetected: (schemaName: string, functionName?: string) => {
    if (typeof functionName === 'string') {
      throw Error(
        '\r\n\n[@traversable/valibot]\r\n'
        + `Circular schema detected while executing ${functionName}. Problem schema: ${schemaName}. `
        + 'If the schema is not circular, you may have encountered a bug. Please consider filing an issue: '
        + 'https://github.com/traversable/schema/issues'
      )
    } else {
      throw Error(''
        + '\r\n\n[@traversable/valibot]\r\n'
        + `Circular schema detected. Problem schema: ${schemaName}. `
        + 'If the schema is not circular, you may have encountered a bug. Please consider filing an issue: '
        + 'https://github.com/traversable/schema/issues'
      )
    }
  },
  Unimplemented: (schemaName: string, functionName?: string) => {
    if (typeof functionName === 'string') {
      throw Error(''
        + '\r\n\n[@traversable/valibot]\r\n'
        + functionName
        + ' has not implemented '
        + `v.${schemaName}`
        + '. If you\'d like to see it supported, please file an issue: '
        + 'https://github.com/traversable/schema/issues'
      )
    } else {
      throw Error(''
        + `v.${schemaName} has not been implemented. `
        + `If you think this might be a mistake, consider filing an issue: `
        + 'https://github.com/traversable/schema/issues'
      )
    }
  },
  IllegalState(functionName: string, expected: string, got: unknown): never {
    throw Error(`Illegal state (zx.${functionName}): ${expected}, got: ${JSON.stringify(got, null, 2)}`)
  }
}


export function hasTag<K extends keyof Tag>(tag: K) {
  return (u: unknown) => has('type', (type): type is unknown => type === Tag[tag])(u)
    || has('type', (type): type is unknown => type === tag)(u)
}

export function hasType(x: unknown) {
  return has('type')(x)
}

export function tagged<K extends keyof Tag>(tag: K): <S>(u: unknown) => u is V.lookup<K, S>
export function tagged<K extends keyof Tag, S>(tag: K, u: unknown): u is ValibotLookup<K>
export function tagged<K extends keyof Tag>(tag: K, u?: unknown) {
  return u === undefined ? hasTag(tag) : hasTag(tag)(u)
}

export function areAllObjects(xs: readonly unknown[]) {
  return xs.every((x) => tagged('object', x))
}

export const nullaryTags = [
  'any',
  'bigint',
  'boolean',
  'blob',
  'boolean',
  'custom',
  'date',
  'enum',
  'file',
  'function',
  'instance',
  'literal',
  'nan',
  'never',
  'null',
  'number',
  'picklist',
  'promise',
  'string',
  'symbol',
  'undefined',
  'unknown',
  'void',
] as const satisfies V.Nullary['type'][]

export function isNullary(x: unknown): x is V.Nullary
export function isNullary(x: unknown) {
  return has('type', (type): type is unknown => nullaryTags.includes(type as never))(x)
}

export function isAnyObject(x: unknown) {
  return tagged('object', x)
    || tagged('looseObject', x)
    || tagged('strictObject', x)
    || tagged('objectWithRest', x)
}

export function isAnyTuple(x: unknown) {
  return tagged('tuple', x)
    || tagged('looseTuple', x)
    || tagged('strictTuple', x)
    || tagged('tupleWithRest', x)
}

export function isOptionalDeep(x: unknown): boolean {
  switch (true) {
    default: return false
    case tagged('optional', x): return true
    case tagged('exactOptional', x): return true
    case tagged('nullish', x): return true
  }
}

export function isSpecialCase(x: unknown) {
  return tagged('date', x)
    || tagged('literal', x)
}

export function isNumeric(x: unknown) {
  return tagged('number', x)
    || tagged('NaN', x)
}

export function isScalar(x: unknown) {
  return tagged('boolean', x)
    || tagged('symbol', x)
    || tagged('bigint', x)
    || tagged('string', x)
}

export function isNullish(x: unknown) {
  return tagged('null', x)
    || tagged('undefined', x)
    || tagged('void', x)
}

export function isTypelevelNullary(x: unknown) {
  return tagged('any', x)
    || tagged('unknown', x)
    || tagged('never', x)
}

export type Primitive = Target<typeof isPrimitive>
export function isPrimitive(x: unknown) {
  return isScalar(x)
    || isNumeric(x)
    || isSpecialCase(x)
}

export type DeepClonePrimitive = Target<typeof deepCloneIsPrimitive>
export function deepCloneIsPrimitive(x: unknown) {
  return isNullish(x)
    || isScalar(x)
    || isNumeric(x)
    || isSpecialCase(x)
}

export function inlinePrimitiveCheck(
  x: Primitive, LEFT_PATH: (string | number)[],
  RIGHT_PATH?: (string | number)[],
  useGlobalThis?: boolean
) {
  const LEFT = joinPath(LEFT_PATH, false)
  const RIGHT = RIGHT_PATH ? joinPath(RIGHT_PATH, false) : null
  switch (true) {
    default: return x satisfies never
    case tagged('NaN', x):
    case tagged('number', x): return `typeof ${LEFT} === 'number'${RIGHT ? ` && typeof ${RIGHT} === 'number'` : ''}`
    case tagged('symbol', x): return `typeof ${LEFT} === 'symbol'${RIGHT ? ` && typeof ${RIGHT} === 'symbol'` : ''}`
    case tagged('bigint', x): return `typeof ${LEFT} === 'bigint'${RIGHT ? ` && typeof ${RIGHT} === 'bigint'` : ''}`
    case tagged('string', x): return `typeof ${LEFT} === 'string'${RIGHT ? ` && typeof ${RIGHT} === 'string'` : ''}`
    case tagged('boolean', x): return `typeof ${LEFT} === 'boolean'${RIGHT ? ` && typeof ${RIGHT} === 'boolean'` : ''}`
    case tagged('literal', x): return !RIGHT ? 'true' : `${LEFT} === ${RIGHT}`
    case tagged('date', x): {
      const NS = useGlobalThis ? 'globalThis.' : ''
      return `${LEFT} instanceof ${NS}Date${RIGHT ? ` && ${RIGHT} instanceof ${NS}Date` : ''}`
    }
  }
}

export function deepCloneInlinePrimitiveCheck(
  x: DeepClonePrimitive,
  LEFT_PATH: (string | number)[],
  RIGHT_PATH?: (string | number)[],
) {
  switch (true) {
    default: return x satisfies never
    case tagged('void')(x):
    case tagged('undefined')(x): return `${LEFT_PATH} === undefined${RIGHT_PATH ? ` && ${RIGHT_PATH} === undefined` : ''}`
    case tagged('null')(x): return `${LEFT_PATH} === null${RIGHT_PATH ? ` && ${RIGHT_PATH} === null` : ''}`
    case tagged('NaN', x):
    case tagged('number', x): return `typeof ${LEFT_PATH} === 'number'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'number'` : ''}`
    case tagged('symbol', x): return `typeof ${LEFT_PATH} === 'symbol'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'symbol'` : ''}`
    case tagged('bigint', x): return `typeof ${LEFT_PATH} === 'bigint'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'bigint'` : ''}`
    case tagged('string', x): return `typeof ${LEFT_PATH} === 'string'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'string'` : ''}`
    case tagged('boolean', x): return `typeof ${LEFT_PATH} === 'boolean'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'boolean'` : ''}`
    case tagged('literal', x): return !RIGHT_PATH ? 'true' : `${LEFT_PATH} === ${RIGHT_PATH}`
    case tagged('date', x): {
      return `${LEFT_PATH} instanceof Date${RIGHT_PATH ? ` && ${RIGHT_PATH} instanceof Date` : ''}`
    }
  }
}

export function schemaOrdering(x: unknown, y: unknown) {
  return isSpecialCase(x) ? -1 : isSpecialCase(y) ? 1
    : isNumeric(x) ? -1 : isNumeric(y) ? 1
      : isScalar(x) ? -1 : isScalar(y) ? 1
        : isTypelevelNullary(x) ? 1 : isTypelevelNullary(y) ? -1
          : isNullish(x) ? 1 : isNullish(y) ? -1
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

export function getTags(xs: readonly unknown[]): Discriminated | null {
  if (!xs.every((x) => tagged('object', x))) {
    return null
  } else {
    const entries = xs.map((x) => x.entries)
    const discriminants = intersectKeys(...entries)
    const [discriminant] = discriminants
    if (discriminants.length !== 1) return null
    else {
      let seen = new Set()
      const withTags = entries.map((entry) => {
        const withTag = entry[discriminant]
        if (!tagged('literal', withTag)) {
          return null
        } else {
          const tag = withTag.literal
          seen.add(tag)
          return { shape: entry, tag }
        }
      })
      if (withTags.every((_) => _ !== null) && withTags.length === seen.size) return [discriminant, withTags]
      else return null
    }
  }
}
