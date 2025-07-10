import { z } from 'zod/v4'
import { Array_isArray, fn, has, isQuoted, isValidIdentifier, parseKey, symbol } from '@traversable/registry'
import { Json } from '@traversable/json'

import { RAISE_ISSUE_URL, VERSION, ZOD_CHANGELOG } from './version.js'

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

export const pair
  : <L, R>(left: L, right: R) => [L, R]
  = (left, right) => [left, right]

/**
 * {@link z.promise `z.promise`} has been deprecated -- refer to the 
 * [changelog](https://v4.zod.dev/v4/changelog) for more information
 */

export const defaults = {
  initialIndex: Array.of<string | number>(),
  namespaceAlias: 'z',
} satisfies Config

export const mutateRandomValueOf = <S, T>(before: Record<string, S>, x: T = invalidValue as never): Record<string, S> => {
  const xs = Object.entries(before)
  if (xs.length === 0) return x as never
  else {
    const index = getRandomIndexOf(xs)
    const [key] = xs[index]
    void xs.splice(index, 1, [key, x as never])
    const after = Object.fromEntries(xs)
    return after
  }
}

export const getRandomIndexOf = <T>(xs: T[]) => Math.floor((Math.random() * 100) % Math.max(xs.length, 1))
export const getRandomElementOf = <T>(xs: T[]) => xs[getRandomIndexOf(xs)]

export const mutateRandomElementOf = <S, T>(xs: S[], x: T = invalidValue as never): S[] => {
  if (xs.length === 0) return x as never
  else {
    const index = getRandomIndexOf(xs)
    xs.splice(index, 1, x as never)
    return xs
  }
}

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

export function keyAccessor(key: keyof any | undefined, isOptional: boolean) {
  return typeof key !== 'string' ? ''
    : isValidIdentifier(key)
      ? `${isOptional ? '?.' : isQuoted(key) ? '' : '.'}${isQuoted(key) ? `[${key.startsWith('"') && key.endsWith('"') ? key : `"${key}"`}]` : key}`
      : `${isOptional ? '?.' : ''}[${parseKey(key)}]`
}

export function indexAccessor(index: keyof any | undefined, isOptional: boolean) {
  const safe = isOptional ? '?.' : ''
  return typeof index !== 'number' ? '' : `${safe}[${index}]`
}

export const isOptional = has('_zod', 'optout', (_) => _ === 'optional')

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
  })(json as Json)
}

