import type * as T from '@traversable/registry'
import { escape, fn, parseKey, typeName, URI } from '@traversable/registry'

import * as t from './schema.js'

/** 
 * Note: strictly speaking, `undefined` is not a valid JSON value. It's
 * included here because in practice `JSON.stringify(undefined)` returns
 * `undefined` instead of the empty string. 
 */
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

type Fixpoint =
  | Scalar
  | readonly Fixpoint[]
  | { [x: string]: Fixpoint }

type Json<T = never> = [T] extends [never] ? Fixpoint : Unary<T>

interface Free extends T.HKT { [-1]: Unary<this[0]> }

/** @internal */
const entries = globalThis.Object.entries

/** @internal */
const isArray: <T>(u: unknown) => u is readonly T[] = globalThis.Array.isArray

/** @internal */
const isObject
  : <T>(u: unknown) => u is { [x: string]: T }
  = (u): u is never => !!u && typeof u === 'object' && !isArray(u)

/** @internal */
const OPT = '<<>>' as const

/** @internal */
export const trim = (s?: string) =>
  s == null ? String(s)
    : s.startsWith(OPT) ? s.substring(OPT.length)
      : s

export namespace Recursive {
  export const JsonFunctor: T.Functor<Free> = {
    map(f) {
      return (x) => {
        switch (true) {
          default: return fn.exhaustive(x)
          case x == null:
          case typeof x === 'boolean':
          case typeof x === 'number':
          case typeof x === 'string': return x
          case isArray(x): return fn.map(x, f)
          case isObject(x): return fn.map(x, f)
        }
      }
    }
  }

  export const jsonToStringAlgebra
    : (x: Json) => string
    = (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x == null: return `${x}`
        case typeof x === 'boolean': return `${x}`
        case typeof x === 'number': return `${x}`
        case typeof x === 'string': return `"${escape(x)}"`
        case isArray(x): return '[' + x.join(', ') + ']'
        case isObject(x): {
          let xs = entries(x)
          return xs.length === 0 ? '{}' : '{ ' + xs.map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ') + ' }'
        }
      }
    }

  export const jsonToString = fn.cata(JsonFunctor)(jsonToStringAlgebra)

  export const toString: T.Functor.Algebra<t.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case t.isNullary(x): return 't.' + typeName(x)
      case x.tag === URI.string: {
        if (typeof x.minLength === 'number' && typeof x.maxLength === 'number')
          return `t.string.between(${x.minLength}, ${x.maxLength})`
        else if (typeof x.minLength === 'number')
          return `t.string.min(${x.minLength})`
        else if (typeof x.maxLength === 'number')
          return `t.string.max(${x.maxLength})`
        else
          return `t.string`
      }
      case x.tag === URI.integer: {
        if (typeof x.minimum === 'number' && typeof x.maximum === 'number')
          return `t.integer.between(${x.minimum}, ${x.maximum})`
        else if (typeof x.minimum === 'number')
          return `t.integer.min(${x.minimum})`
        else if (typeof x.maximum === 'number')
          return `t.integer.max(${x.maximum})`
        else
          return `t.integer`
      }
      case x.tag === URI.bigint: {
        if (typeof x.minimum === 'bigint' && typeof x.maximum === 'bigint')
          return `t.bigint.between(${x.minimum}n, ${x.maximum}n)`
        else if (typeof x.minimum === 'bigint')
          return `t.bigint.min(${x.minimum}n)`
        else if (typeof x.maximum === 'bigint')
          return `t.bigint.max(${x.maximum}n)`
        else
          return `t.bigint`
      }
      case x.tag === URI.number: {
        let out = 't.number'
        if (typeof x.exclusiveMinimum === 'number') out += `.moreThan(${x.exclusiveMinimum})`
        if (typeof x.exclusiveMaximum === 'number') out += `.lessThan(${x.exclusiveMaximum})`
        if (typeof x.minimum === 'number') out += `.min(${x.minimum})`
        if (typeof x.maximum === 'number') out += `.max(${x.maximum})`
        return out
      }
      case x.tag === URI.array: {
        if (typeof x.minLength === 'number' && typeof x.maxLength === 'number')
          return `t.${typeName(x)}(${x.def}).between(${x.minLength}, ${x.maxLength})`
        else if (typeof x.minLength === 'number')
          return `t.${typeName(x)}(${x.def}).min(${x.minLength})`
        else if (typeof x.maxLength === 'number')
          return `t.${typeName(x)}(${x.def}).max(${x.maxLength})`
        else
          return `t.${typeName(x)}(${x.def})`
      }
      case x.tag === URI.eq: return `t.eq(${jsonToString(x.def as never)})`
      case x.tag === URI.record: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.optional: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.tuple: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.union: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.intersect: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.object: {
        const xs = entries(x.def)
        return xs.length === 0
          ? `t.${typeName(x)}({})`
          : `t.${typeName(x)}({ ${xs.map(([k, v]) => parseKey(k) + `: ${v}`).join(', ')} })`
      }
    }
  }

  export const toTypeString: T.Functor.Algebra<t.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.integer: return 'number'
      case t.isLeaf(x): return typeName(x)
      case x.tag === URI.eq: return jsonToString(x.def as never)
      case x.tag === URI.array: return `(${trim(x.def)})[]`
      case x.tag === URI.record: return `Record<string, ${trim(x.def)}>`
      case x.tag === URI.optional: return `${OPT}(${trim(x.def)} | undefined)`
      case x.tag === URI.union: return `(${x.def.map(trim).join(' | ')})`
      case x.tag === URI.intersect: return `(${x.def.map(trim).join(' & ')})`
      case x.tag === URI.tuple:
        return `[${x.def.map((y) => (y?.startsWith(OPT) ? '_?: ' : '') + trim(y)).join(', ')}]`
      case x.tag === URI.object: {
        const xs = entries(x.def)
        return xs.length === 0
          ? `{}`
          : `{ ${xs.map(([k, v]) => parseKey(k) + (v?.startsWith(OPT) ? '?' : '') + `: ${trim(v)}`).join(', ')} }`
      }
    }
  }
}

const fold
  : <T>(algebra: T.Algebra<t.Free, T>) => <S extends t.Schema>(term: S) => string
  = t.fold as never

export const toString
  : (schema: t.Schema) => string
  = fold(Recursive.toString)

export const toTypeString
  : (schema: t.Schema) => string
  = (schema) => trim(fold(Recursive.toTypeString)(schema))
