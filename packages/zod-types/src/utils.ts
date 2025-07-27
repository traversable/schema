import { z } from 'zod'
import type { Target } from '@traversable/registry'
import { Array_isArray, fn, has, intersectKeys, joinPath, parseKey, symbol } from '@traversable/registry'
import { Json } from '@traversable/json'

import { RAISE_ISSUE_URL, VERSION, ZOD_CHANGELOG } from './version.js'
import { tagged } from './typename.js'

export type Atoms = [Date, RegExp, Function]

export interface ZodType extends z.ZodType {}
export interface ZodArray extends z.ZodArray {}
export interface ZodObject extends z.ZodObject {}
export interface ZodTuple extends z.ZodTuple {}
export interface ZodRecord extends z.ZodRecord {}

export type Options = {
  initialIndex?: (string | number)[]
  namespaceAlias?: string
}

export interface Config extends Required<Options> {}

export interface Ctx { input: unknown, error: z.ZodError }
export const Ctx = { input: null, error: new z.ZodError([]) } satisfies Ctx

/** 
 * This approach to generating partially invalid data borrows from the excellent
 * [type-predicate-generator](https://github.com/peter-leonov/type-predicate-generator) library
 */
export const invalidValue: any = symbol.invalid_value

/**
 * TODO: Remove once [this issue](https://github.com/colinhacks/zod/pull/4359) is resolved
 */
export const removePrototypeMethods = (k: string) => !['__proto__', 'toString'].includes(k)

/**
 * {@link z.promise `z.promise`} has been deprecated -- refer to the 
 * [changelog](https://v4.zod.dev/v4/changelog) for more information
 */

export const defaults = {
  initialIndex: Array.of<string | number>(),
  namespaceAlias: 'z',
} satisfies Config

export const PromiseSchemaIsUnsupported = (fnName: string) => Invariant.Unimplemented('promise', fnName)

export const Invariant = {
  CircularSchemaDetected: (schemaName: string, functionName?: string) => {
    if (typeof functionName === 'string') {
      throw Error(
        '\r\n\n[@traversable/zod]\r\n'
        + `Circular schema detected while executing ${functionName}. Problem schema: ${schemaName}. `
        + 'If the schema is not circular, you may have encountered a bug. Please consider filing an issue: '
        + RAISE_ISSUE_URL
      )
    } else {
      throw Error(''
        + '\r\n\n[@traversable/zod]\r\n'
        + `Circular schema detected. Problem schema: ${schemaName}. `
        + 'If the schema is not circular, you may have encountered a bug. Please consider filing an issue: '
        + RAISE_ISSUE_URL
      )
    }
  },
  Unimplemented: (schemaName: string, functionName?: string) => {
    if (typeof functionName === 'string') {
      throw Error(''
        + '\r\n\n[@traversable/zod]\r\n'
        + functionName
        + ' has not implemented '
        + `z.${schemaName}`
        + '. If you\'d like to see it supported, please file an issue: '
        + RAISE_ISSUE_URL
      )
    } else {
      throw Error(''
        + `z.${schemaName} has not been implemented. `
        + `If you think this might be a mistake, consider filing an issue: `
        + RAISE_ISSUE_URL
      )
    }
  },
  IllegalState(functionName: string, expected: string, got: unknown): never {
    throw Error(`Illegal state (zx.${functionName}): ${expected}, got: ${JSON.stringify(got, null, 2)}`)
  }
}

export const Warn = {
  Deprecated: (
    schemaName: string,
    functionName: string,
    logger: (...xs: unknown[]) => void = console.warn
  ) => <T>(output: T): T => (
    logger(''
      + '\r\n\n[@traversable/zod]\r\n'
      + '\r\n\n'
      + '    WARNING:'
      + '\r\n\n'
      + `    z.${schemaName} has been deprecated in zod@4, and will`
      + '\r\n'
      + `    not continue to be supported by ${functionName}. `
      + '\r\n'
      + `    For migration instructions, please visit: `
      + '\r\n'
      + `    ${ZOD_CHANGELOG}.`
      + '\r\n\n'
      + `    [${VERSION}]`
      + '\r\n'
    ),
    output
  ),
}

export const isOptional = tagged('optional')

export const isOptionalDeep = (x: unknown): boolean => {
  switch (true) {
    default: return false // TODO: add check for exhautiveness
    case tagged('optional', x): return true
    case tagged('nonoptional', x):
    case tagged('intersection', x):
    case tagged('never', x):
    case tagged('any', x):
    case tagged('unknown', x):
    case tagged('void', x):
    case tagged('undefined', x):
    case tagged('null', x):
    case tagged('boolean', x):
    case tagged('symbol', x):
    case tagged('nan', x):
    case tagged('int', x):
    case tagged('bigint', x):
    case tagged('number', x):
    case tagged('string', x):
    case tagged('date', x):
    case tagged('file', x):
    case tagged('enum', x):
    case tagged('literal', x):
    case tagged('template_literal', x):
    case tagged('success', x):
    case tagged('array', x):
    case tagged('tuple', x):
    case tagged('map', x):
    case tagged('object', x):
    case tagged('promise', x):
    case tagged('record', x): return false
    /// ???
    case tagged('default', x):
    case tagged('prefault', x):
    case tagged('catch', x):
    case tagged('custom', x):
    /// ???
    case tagged('set', x): return false

    case tagged('union', x): return x._zod.def.options.some(isOptionalDeep)
    case tagged('readonly', x): return isOptionalDeep(x._zod.def.innerType)
    case tagged('nullable', x): return isOptionalDeep(x._zod.def.innerType)
    case tagged('pipe', x): return isOptionalDeep(x._zod.def.out)
    case tagged('lazy', x): return isOptionalDeep(x._zod.def.getter())
  }
}

export function serializeShort(json: Json): string
export function serializeShort(json: {} | null | undefined): string
export function serializeShort(json: unknown): string {
  return Json.fold<string>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null:
      case x === undefined:
      case typeof x === 'boolean':
      case typeof x === 'number':
      case typeof x === 'string': return JSON.stringify(x)
      case Array_isArray(x): return x.length === 0 ? '[]' : '[' + x.join(', ') + ']'
      case !!x && typeof x === 'object': {
        const xs = Object.entries(x)
        return xs.length === 0 ? '{}' : '{' + xs.map(([k, v]) => parseKey(k) + ': ' + v).join(',') + '}]'
      }
    }
  })(json as Json.Unary<string>)
}


export function areAllObjects(xs: readonly unknown[]) {
  return xs.every((x) => tagged('object', x))
}

export function getTags(xs: readonly unknown[]): Discriminated | null {
  if (!xs.every((x) => tagged('object', x))) {
    return null
  } else {
    const shapes = xs.map((x) => x._zod.def.shape)
    const discriminants = intersectKeys(...shapes)
    const [discriminant] = discriminants
    if (discriminants.length !== 1) return null
    else {
      let seen = new Set()
      const withTags = shapes.map((shape) => {
        const withTag = shape[discriminant]
        if (!tagged('literal', withTag)) {
          return null
        } else {
          if (withTag._zod.def.values.length !== 1) return null
          else {
            const [tag] = withTag._zod.def.values
            seen.add(tag)
            return { shape, tag }
          }
        }
      })
      if (withTags.every((_) => _ !== null) && withTags.length === seen.size) return [discriminant, withTags]
      else return null
    }
  }
}

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

export type Tagged = {
  shape: Record<string, z.ZodType>
  tag: string | number | bigint | boolean | null | undefined
}

export type Discriminated = [
  discriminant: string | number,
  tagged: Tagged[]
]

export function isSpecialCase(x: unknown) {
  return tagged('date', x)
    || tagged('literal', x)
    || tagged('template_literal', x)
}

export function isNumeric(x: unknown) {
  return tagged('number', x)
    || tagged('int', x)
    || tagged('nan', x)
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


export function schemaOrdering(x: readonly [z.core.$ZodType, number], y: readonly [z.core.$ZodType, number]) {
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

export function inlinePrimitiveCheck(x: Primitive, LEFT_SPEC: PathSpec, RIGHT_SPEC?: PathSpec, useGlobalThis?: boolean) {
  switch (true) {
    default: return x satisfies never
    case tagged('int', x):
    case tagged('nan', x):
    case tagged('number', x): return `typeof ${LEFT_SPEC.ident} === 'number'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'number'` : ''}`
    case tagged('symbol', x): return `typeof ${LEFT_SPEC.ident} === 'symbol'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'symbol'` : ''}`
    case tagged('bigint', x): return `typeof ${LEFT_SPEC.ident} === 'bigint'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'bigint'` : ''}`
    case tagged('string', x): return `typeof ${LEFT_SPEC.ident} === 'string'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'string'` : ''}`
    case tagged('boolean', x): return `typeof ${LEFT_SPEC.ident} === 'boolean'${RIGHT_SPEC ? ` && typeof ${RIGHT_SPEC.ident} === 'boolean'` : ''}`
    case tagged('literal', x): return !RIGHT_SPEC ? 'true' : `${LEFT_SPEC.ident} === ${RIGHT_SPEC.ident}`
    case tagged('template_literal', x): return !RIGHT_SPEC ? 'true' : `${LEFT_SPEC.ident} === ${RIGHT_SPEC.ident}`
    case tagged('date', x): {
      const NS = useGlobalThis ? 'globalThis.' : ''
      return `${LEFT_SPEC.ident} instanceof ${NS}Date${RIGHT_SPEC ? ` && ${RIGHT_SPEC.ident} instanceof ${NS}Date` : ''}`
    }
  }
}

export function deepCloneInlinePrimitiveCheck(
  x: DeepClonePrimitive,
  LEFT_PATH: (string | number)[],
  RIGHT_PATH?: (string | number)[],
  useGlobalThis?: boolean
) {
  switch (true) {
    default: return x satisfies never
    case tagged('void')(x):
    case tagged('undefined')(x): return `${LEFT_PATH} === undefined${RIGHT_PATH ? ` && ${RIGHT_PATH} === undefined` : ''}`
    case tagged('null')(x): return `${LEFT_PATH} === null${RIGHT_PATH ? ` && ${RIGHT_PATH} === null` : ''}`
    case tagged('int', x):
    case tagged('nan', x):
    case tagged('number', x): return `typeof ${LEFT_PATH} === 'number'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'number'` : ''}`
    case tagged('symbol', x): return `typeof ${LEFT_PATH} === 'symbol'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'symbol'` : ''}`
    case tagged('bigint', x): return `typeof ${LEFT_PATH} === 'bigint'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'bigint'` : ''}`
    case tagged('string', x): return `typeof ${LEFT_PATH} === 'string'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'string'` : ''}`
    case tagged('boolean', x): return `typeof ${LEFT_PATH} === 'boolean'${RIGHT_PATH ? ` && typeof ${RIGHT_PATH} === 'boolean'` : ''}`
    case tagged('literal', x): return !RIGHT_PATH ? 'true' : `${LEFT_PATH} === ${RIGHT_PATH}`
    case tagged('template_literal', x): return !RIGHT_PATH ? 'true' : `${LEFT_PATH} === ${RIGHT_PATH}`
    case tagged('date', x): {
      const NS = useGlobalThis ? 'globalThis.' : ''
      return `${LEFT_PATH} instanceof ${NS}Date${RIGHT_PATH ? ` && ${RIGHT_PATH} instanceof ${NS}Date` : ''}`
    }
  }
}
