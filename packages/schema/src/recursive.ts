import type * as T from './registry.js'
import { fn, parseKey, typeName, URI } from './registry.js'
import * as core from './core.js'
import * as t from './schema.js'

import * as Json from './json.js'
type Json<T = never> = [T] extends [never]
  ? import('./json.js').Json
  : import('./json.js').Unary<T>

/** @internal */
const Object_entries = globalThis.Object.entries

/** @internal */
const OPT = '<<>>' as const

/** @internal */
const trim = (s?: string) =>
  s == null ? String(s)
    : s.startsWith(OPT) ? s.substring(OPT.length)
      : s

export namespace Recursive {
  const jsonToString = Json.fold((x: Json<string>) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case Json.isScalar(x): return typeof x === 'string' ? `"${x}"` : `${x}`
      case Json.isArray(x): return `[${x.join(',')}]`
      case Json.isObject(x): return `{ ${Object_entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ')} }`
    }
  })

  export const toString: T.Functor.Algebra<t.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case core.isLeaf(x): return 't.' + typeName(x)
      case x.tag === URI.eq: return `t.eq(${jsonToString(x.def as never)})`
      case x.tag === URI.array: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.record: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.optional: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.tuple: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.union: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.intersect: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.object: {
        const xs = Object_entries(x.def)
        return xs.length === 0
          ? `t.${typeName(x)}({})`
          : `t.${typeName(x)}({ ${xs.map(([k, v]) => parseKey(k) + `: ${v}`).join(', ')} })`
      }
    }
  }

  export const toTypeString: T.Functor.Algebra<t.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case core.isLeaf(x): return typeName(x)
      case x.tag === URI.eq: return jsonToString(x.def as never)
      case x.tag === URI.array: return `(${trim(x.def)})[]`
      case x.tag === URI.record: return `Record<string, ${trim(x.def)}>`
      case x.tag === URI.optional: return `${OPT}(${trim(x.def)} | undefined)`
      case x.tag === URI.union: return `(${x.def.map(trim).join(' | ')})`
      case x.tag === URI.intersect: return `(${x.def.map(trim).join(' & ')})`
      case x.tag === URI.tuple:
        return `[${x.def.map((y) => (y?.startsWith(OPT) ? '_?: ' : '') + trim(y)).join(', ')}]`
      case x.tag === URI.object: {
        const xs = Object_entries(x.def)
        return xs.length === 0
          ? `{}`
          : `{ ${xs.map(([k, v]) => parseKey(k) + (v?.startsWith(OPT) ? '?' : '') + `: ${trim(v)}`).join(', ')} }`
      }
    }
  }
}

const fold
  : <T>(algebra: T.Algebra<t.Free, T>) => <S extends t.Schema>(term: S) => string
  = core.fold as never

export const toString
  : <S extends t.LowerBound>(schema: S) => string
  = fold(Recursive.toString)

export const toTypeString
  : <S extends t.Schema>(schema: S) => string
  = (schema) => trim(fold(Recursive.toTypeString)(schema))
