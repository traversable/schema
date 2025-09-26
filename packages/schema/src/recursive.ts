import type * as T from '@traversable/registry'
import { Array_isArray, escape, has, fn, Object_entries, parseKey, typeName, URI } from '@traversable/registry'

import * as t from './schema.js'

/**
 * Note: strictly speaking, `undefined` is not a valid JSON value. It's
 * included here because in practice `JSON.stringify(undefined)` returns
 * `undefined` instead of the empty string.
 */

export type Json<T = never> = [T] extends [never] ? Json.Fixpoint : Json.Unary<T>
export declare namespace Json {
  type Scalar =
    | undefined
    | null
    | boolean
    | number
    | string

  type Unary<T = never> =
    | Scalar
    | readonly T[]
    | { [x: string]: T }

  interface Free extends T.HKT { [-1]: Json.Unary<this[0]> }
  type Fixpoint =
    | Scalar
    | readonly Fixpoint[]
    | { [x: string]: Fixpoint }
}

const isObject
  : <T>(u: unknown) => u is { [x: string]: T }
  = (u): u is never => !!u && typeof u === 'object' && !Array_isArray(u)

const isOptional = <T>(x: unknown): x is t.optional<T> => has('tag', (tag) => tag === URI.optional)(x)

export const JsonFunctor: T.Functor<Json.Free> = {
  map(f) {
    return (x) => {
      switch (true) {
        /* v8 ignore next 1 */
        default: return fn.exhaustive(x)
        case x == null:
        case typeof x === 'boolean':
        case typeof x === 'number':
        case typeof x === 'string': return x
        case Array_isArray(x): return fn.map(x, f)
        case isObject(x): return fn.map(x, f)
      }
    }
  }
}

const foldJson = fn.cata(JsonFunctor)

export type Options = {
  namespaceAlias?: string
  typeName?: string
}

interface Config extends Required<Options> {}

export const defaults = {
  namespaceAlias: 't',
  typeName: ''
} satisfies Config

export function schemaToString(schema: t.Type, options?: Pick<Options, 'namespaceAlias'>): string
export function schemaToString(schema: t.Schema, options?: Pick<Options, 'namespaceAlias'>): string
export function schemaToString(schema: t.Schema | t.Type, options?: Pick<Options, 'namespaceAlias'>): string {
  const T = options?.namespaceAlias ?? 't'
  return t.fold<string>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.ref: return x.id
      case x.tag === URI.any: return `${T}.any`
      case x.tag === URI.unknown: return `${T}.unknown`
      case x.tag === URI.never: return `${T}.never`
      case x.tag === URI.void: return `${T}.void`
      case x.tag === URI.undefined: return `${T}.undefined`
      case x.tag === URI.null: return `${T}.null`
      case x.tag === URI.symbol: return `${T}.symbol`
      case x.tag === URI.boolean: return `${T}.boolean`
      case x.tag === URI.integer: {
        let BOUNDS = ''
        if (typeof x.minimum === 'number' && typeof x.maximum === 'number') BOUNDS += `.between(${x.minimum}, ${x.maximum})`
        else if (typeof x.minimum === 'number') BOUNDS += `.min(${x.minimum})`
        else if (typeof x.maximum === 'number') BOUNDS += `.max(${x.maximum})`
        return `${T}.integer${BOUNDS}`
      }
      case x.tag === URI.bigint: {
        let BOUNDS = ''
        if (typeof x.minimum === 'bigint' && typeof x.maximum === 'bigint') BOUNDS += `.between(${x.minimum}n, ${x.maximum}n)`
        else if (typeof x.minimum === 'bigint') BOUNDS += `.min(${x.minimum}n)`
        else if (typeof x.maximum === 'bigint') BOUNDS += `.max(${x.maximum}n)`
        return `${T}.bigint${BOUNDS}`
      }
      case x.tag === URI.number: {
        let BOUNDS = ''
        if (typeof x.exclusiveMinimum === 'number') BOUNDS += `.moreThan(${x.exclusiveMinimum})`
        if (typeof x.exclusiveMaximum === 'number') BOUNDS += `.lessThan(${x.exclusiveMaximum})`
        if (typeof x.minimum === 'number') BOUNDS += `.min(${x.minimum})`
        if (typeof x.maximum === 'number') BOUNDS += `.max(${x.maximum})`
        return `${T}.number${BOUNDS}`
      }
      case x.tag === URI.string: {
        let BOUNDS = ''
        if (typeof x.minLength === 'number' && typeof x.maxLength === 'number') BOUNDS += `.between(${x.minLength}, ${x.maxLength})`
        else if (typeof x.minLength === 'number') BOUNDS += `.min(${x.minLength})`
        else if (typeof x.maxLength === 'number') BOUNDS += `.max(${x.maxLength})`
        return `${T}.string${BOUNDS}`
      }
      case x.tag === URI.array: {
        let BOUNDS = ''
        if (typeof x.minLength === 'number' && typeof x.maxLength === 'number') BOUNDS = `.between(${x.minLength}, ${x.maxLength})`
        else if (typeof x.minLength === 'number') BOUNDS = `.min(${x.minLength})`
        else if (typeof x.maxLength === 'number') BOUNDS = `.max(${x.maxLength})`
        return `${T}.array(${x.def})${BOUNDS}`
      }
      case x.tag === URI.eq: return `${T}.eq(${JSON.stringify(x.def)})`
      case x.tag === URI.optional: return `${T}.optional(${x.def})`
      case x.tag === URI.record: return `${T}.record(${x.def})`
      case x.tag === URI.union: return `${T}.union(${x.def.join(',')})`
      case x.tag === URI.intersect: return `${T}.intersect(${x.def.join(',')})`
      case x.tag === URI.tuple: return `${T}.tuple(${x.def.join(',')})`
      case x.tag === URI.object: return `${T}.object({${Object.entries(x.def).map(([k, v]) => `${parseKey(k)}: ${v}`).join(',')}})`
    }
  })(schema as t.Type)
}

export function toType(schema: t.Type, options?: Pick<Options, 'typeName'>): string {
  const TYPE = !options?.typeName ? '' : `type ${options?.typeName} = `
  return TYPE + t.fold<string>((x, _, original) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.any: return 'any'
      case x.tag === URI.unknown: return 'unknown'
      case x.tag === URI.never: return 'never'
      case x.tag === URI.void: return 'void'
      case x.tag === URI.undefined: return 'undefined'
      case x.tag === URI.null: return 'null'
      case x.tag === URI.symbol: return 'symbol'
      case x.tag === URI.boolean: return 'boolean'
      case x.tag === URI.integer: return 'number'
      case x.tag === URI.bigint: return 'bigint'
      case x.tag === URI.number: return 'number'
      case x.tag === URI.string: return 'string'
      case x.tag === URI.ref: return x.id
      case x.tag === URI.eq: return jsonToType(x.def)
      case x.tag === URI.array: return `Array<${x.def}>`
      case x.tag === URI.record: return `Record<string, ${x.def}>`
      case x.tag === URI.optional: return `(undefined | ${x.def})`
      case x.tag === URI.union: return x.def.length === 0 ? 'never' : `(${x.def.join(' | ')})`
      case x.tag === URI.intersect: return x.def.length === 0 ? 'unknown' : `(${x.def.join(' & ')})`
      case x.tag === URI.tuple: {
        const xs = x.def.map(
          (v, i) => isOptional((original as t.tuple<string[]>).def[i]) ? `${v.slice('(undefined | '.length, -(')'.length))}?` : v
        )
        return `[${xs.join(', ')}]`
      }
      case x.tag === URI.object: {
        const entries = Object.entries(x.def).map(
          ([k, v]) => {
            const OPT = isOptional((original as t.object).def[k])
            return `${parseKey(k)}${OPT ? '?' : ''}: ${OPT ? v.slice('(undefined | '.length, -(')'.length)) : v}`
          }
        )
        return entries.length === 0 ? '{}' : `{ ${entries.join(', ')} }`
      }
    }
  })(schema)
}

export function jsonToType(json: Json<any>, options?: Pick<Options, 'typeName'>): string {
  const TYPE = !options?.typeName ? '' : `type ${options?.typeName} = `
  const OUT = foldJson<string>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x == null: return String(x)
      case x === true: return 'true'
      case x === false: return 'false'
      case typeof x === 'number': return x + ''
      case typeof x === 'string': return `"${escape(x)}"`
      case Array_isArray(x): return `[${x.join(', ')}]`
      case isObject(x): {
        const xs = Object_entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`)
        return xs.length === 0 ? '{}' : `{ ${xs.join(', ')} }`
      }
    }
  })(json)
  return `${TYPE}${OUT}`
}
