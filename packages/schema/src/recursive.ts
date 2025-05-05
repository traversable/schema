import type * as T from '@traversable/registry'
import { Array_isArray, escape, fn, Object_entries, parseKey, typeName, URI } from '@traversable/registry'

import * as s from './schema.js'

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


/** @internal */
const isObject
  : <T>(u: unknown) => u is { [x: string]: T }
  = (u): u is never => !!u && typeof u === 'object' && !Array_isArray(u)

/** @internal */
const OPT = '<<>>' as const

/** @internal */
export const trim = (s?: string) => s == null ? String(s) : s.startsWith(OPT) ? s.substring(OPT.length) : s

export const JsonFunctor: T.Functor.Ix<s.Functor.Index, Json.Free> = {
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
  },
  mapWithIndex(f) {
    return (x, { depth, path }) => {
      switch (true) {
        /* v8 ignore next 1 */
        default: return fn.exhaustive(x)
        case x == null:
        case typeof x === 'boolean':
        case typeof x === 'number':
        case typeof x === 'string': return x
        case Array_isArray(x): return fn.map(x, (v, i) => f(v, { path: [...path, i], depth: depth + 1 }))
        case isObject(x): return fn.map(x, (v, k) => f(v, { path: [...path, k], depth: depth + 1 }))
      }
    }
  }
}

const foldJson = fn.cataIx(JsonFunctor)
const foldWithIndex
  : <T>(algebra: T.IndexedAlgebra<s.Functor.Index, s.Free, T>, initialIndex?: s.Functor.Index) => <S extends s.Schema>(term: S) => string
  = (algebra, initialIndex = s.defaultIndex) => (schema) => s.foldWithIndex(algebra)(schema, initialIndex) as never

export type Options = {
  format?: boolean
  initialOffset?: number
  namespaceAlias?: string
  maxWidth?: number
}

interface Config extends Required<Options> {}

export const defaults = {
  format: false,
  initialOffset: 0,
  namespaceAlias: 't',
  maxWidth: 99,
} satisfies Config

function parseOptions(options?: Options): Config
function parseOptions({
  format = defaults.format,
  initialOffset = defaults.initialOffset,
  maxWidth = defaults.maxWidth,
  namespaceAlias = defaults.namespaceAlias,
}: Options = defaults) {
  return {
    format,
    initialOffset,
    maxWidth,
    namespaceAlias,
  } satisfies Config
}

export function toString(schema: s.Schema, options?: Options): string
export function toString(schema: s.Schema, options: Options = defaults): string {
  const $ = parseOptions(options)
  const {
    namespaceAlias: t = defaults.namespaceAlias,
    format: FORMAT = defaults.format,
    initialOffset: OFF = defaults.initialOffset,
    maxWidth: MAX_WIDTH = defaults.maxWidth,
  } = $
  return foldWithIndex<string>(
    (x, ix) => {

      const { depth } = ix
      const OFFSET = OFF + depth * 2
      const JOIN = `,\n` + ' '.repeat(OFFSET + 2)

      switch (true) {
        /* v8 ignore next 1 */
        default: return fn.exhaustive(x)
        case x.tag === URI.eq: return `${t}.eq(${jsonToString(x.def, $, ix)})`
        case s.isNullary(x): return `${t}.${typeName(x)}`
        case x.tag === URI.string: {
          let BOUNDS = ''
          if (typeof x.minLength === 'number' && typeof x.maxLength === 'number') BOUNDS += `.between(${x.minLength}, ${x.maxLength})`
          else if (typeof x.minLength === 'number') BOUNDS += `.min(${x.minLength})`
          else if (typeof x.maxLength === 'number') BOUNDS += `.max(${x.maxLength})`
          return `${t}.string${BOUNDS}`
        }
        case x.tag === URI.integer: {
          let BOUNDS = ''
          if (typeof x.minimum === 'number' && typeof x.maximum === 'number') BOUNDS += `.between(${x.minimum}, ${x.maximum})`
          else if (typeof x.minimum === 'number') BOUNDS += `.min(${x.minimum})`
          else if (typeof x.maximum === 'number') BOUNDS += `.max(${x.maximum})`
          return `${t}.integer${BOUNDS}`
        }
        case x.tag === URI.bigint: {
          let BOUNDS = ''
          if (typeof x.minimum === 'bigint' && typeof x.maximum === 'bigint') BOUNDS += `.between(${x.minimum}n, ${x.maximum}n)`
          else if (typeof x.minimum === 'bigint') BOUNDS += `.min(${x.minimum}n)`
          else if (typeof x.maximum === 'bigint') BOUNDS += `.max(${x.maximum}n)`
          return `${t}.bigint${BOUNDS}`
        }
        case x.tag === URI.number: {
          let BOUNDS = ''
          if (typeof x.exclusiveMinimum === 'number') BOUNDS += `.moreThan(${x.exclusiveMinimum})`
          if (typeof x.exclusiveMaximum === 'number') BOUNDS += `.lessThan(${x.exclusiveMaximum})`
          if (typeof x.minimum === 'number') BOUNDS += `.min(${x.minimum})`
          if (typeof x.maximum === 'number') BOUNDS += `.max(${x.maximum})`
          return `${t}.number${BOUNDS}`
        }
        case x.tag === URI.array: {
          const BODY = x.def
          let BOUNDS = ''
          if (typeof x.minLength === 'number' && typeof x.maxLength === 'number') BOUNDS = `.between(${x.minLength}, ${x.maxLength})`
          else if (typeof x.minLength === 'number') BOUNDS = `.min(${x.minLength})`
          else if (typeof x.maxLength === 'number') BOUNDS = `.max(${x.maxLength})`
          const SINGLE_LINE = `${t}.array(${BODY})${BOUNDS}`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE ? SINGLE_LINE
              : `${t}.array(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + BODY
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `)${BOUNDS}`
          }
        }
        case x.tag === URI.record: {
          const BODY = x.def
          const SINGLE_LINE = `${t}.record(${BODY})`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE ? SINGLE_LINE
              : `${t}.record(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + BODY
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `)`
          }
        }
        case x.tag === URI.optional: {
          const BODY = x.def
          const SINGLE_LINE = `${t}.optional(${BODY})`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE ? SINGLE_LINE
              : `${t}.optional(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + BODY
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `)`
          }
        }
        case x.tag === URI.union: {
          const BODY = x.def
          const SINGLE_LINE = `${t}.union(${BODY.join(', ')})`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE ? SINGLE_LINE
              : `${t}.union(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + BODY.join(JOIN)
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `)`
          }
        }
        case x.tag === URI.intersect: {
          const BODY = x.def
          const SINGLE_LINE = `${t}.intersect(${BODY.join(', ')})`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE ? SINGLE_LINE
              : `${t}.intersect(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + BODY.join(JOIN)
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `)`
          }
        }
        case x.tag === URI.tuple: {
          const BODY = x.def
          const SINGLE_LINE = `${t}.tuple(${BODY.join(', ')})`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE ? SINGLE_LINE
              : `${t}.tuple(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + BODY.join(JOIN)
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `)`
          }
        }

        case x.tag === URI.object: {
          const BODY = Object_entries(x.def).map(([k, v]) => `${parseKey(k)}: ${v}`)
          if (BODY.length === 0) return `${t}.object({})`
          else {
            const SINGLE_LINE = `${t}.object({ ${BODY.join(', ')} })`
            if (!FORMAT) return SINGLE_LINE
            else {
              const WIDTH = OFFSET + SINGLE_LINE.length
              const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
              return !IS_MULTI_LINE
                ? SINGLE_LINE
                : `${t}.object({`
                + '\n'
                + ' '.repeat(OFFSET + 2)
                + BODY.join(JOIN)
                + '\n'
                + ' '.repeat(OFFSET + 0)
                + `})`
            }
          }
        }

      }
    }
  )(schema)
}


export function jsonToString(json: Json<any>, options?: Options, ix?: s.Functor.Index): string
export function jsonToString(
  json: Json<string>, {
    format: FORMAT = defaults.format,
    initialOffset: OFF = defaults.initialOffset,
    maxWidth: MAX_WIDTH = defaults.maxWidth,
  }: Options = defaults,
  index = s.defaultIndex,
) {
  return foldJson<string>((x, ix) => {
    const OFFSET = OFF + ix.depth * 2
    const JOIN = ',\n' + ' '.repeat(OFFSET + 2)
    switch (true) {
      /* v8 ignore next 1 */
      default: return fn.exhaustive(x)
      case x == null: return `${x}`
      case typeof x === 'boolean': return `${x}`
      case typeof x === 'number': return `${x}`
      case typeof x === 'string': return `"${escape(x)}"`
      case Array_isArray(x): {
        const SINGLE_LINE = `[${x.join(', ')}]`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE ? SINGLE_LINE
            : '['
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + ']'
        }
      }
      case isObject(x): {
        const xs = Object_entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`)
        if (xs.length === 0) return '{}'
        else {
          const SINGLE_LINE = `{ ${xs.join(', ')} }`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE ? SINGLE_LINE
              : '{'
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + xs.join(JOIN)
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + '}'
          }
        }
      }
    }
  })(json, index)
}

export function toTypeString(schema: s.Schema, options?: Options, ix?: s.Functor.Index): string
export function toTypeString(schema: s.Schema, options: Options = defaults, ix = s.defaultIndex) {
  const {
    initialOffset: OFF = defaults.initialOffset,
    format: FORMAT = defaults.format,
    maxWidth: MAX_WIDTH = defaults.maxWidth,
  } = options
  const out = s.foldWithIndex<string>(
    (x, ix) => {
      const { depth } = ix
      const OFFSET = OFF + depth * 2
      const JOIN = ',\n' + '  '.repeat(depth + 1)
      switch (true) {
        /* v8 ignore next 1 */
        default: return fn.exhaustive(x)
        case x.tag === URI.integer: return 'number'
        case s.isLeaf(x): return typeName(x)
        case x.tag === URI.eq: return jsonToString(x.def, options, ix)
        case x.tag === URI.array: return `(${trim(x.def)})[]`
        case x.tag === URI.record: return `Record<string, ${trim(x.def)}>`
        case x.tag === URI.optional: return `${OPT}(${trim(x.def)} | undefined)`
        case x.tag === URI.union: return `(${x.def.map(trim).join(' | ')})`
        case x.tag === URI.intersect: return `(${x.def.map(trim).join(' & ')})`
        case x.tag === URI.tuple: {
          const BODY = x.def.map((y) => (y?.startsWith(OPT) ? '_?: ' : '') + trim(y))
          const SINGLE_LINE = `[${BODY.join(', ')}]`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE ? SINGLE_LINE
              : '['
              + '\n'
              + '  '.repeat(depth + 1)
              + BODY.join(JOIN)
              + '\n'
              + '  '.repeat(depth + 0)
              + ']'
          }
        }
        case x.tag === URI.object: {
          const BODY = Object_entries(x.def).map(([k, v]) => parseKey(k) + (v?.startsWith(OPT) ? '?' : '') + `: ${trim(v)}`)
          if (BODY.length === 0) return `{}`
          else {
            const SINGLE_LINE = `{ ${BODY.join(', ')} }`
            if (!FORMAT) return SINGLE_LINE
            else {
              const WIDTH = OFFSET + SINGLE_LINE.length
              const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
              return !IS_MULTI_LINE ? SINGLE_LINE
                : '{'
                + '\n'
                + '  '.repeat(depth + 1)
                + BODY.join(JOIN)
                + '\n'
                + '  '.repeat(depth + 0)
                + '}'
            }
          }
        }
      }
    }
  )(schema, ix)

  return out.startsWith(OPT) ? out.slice(OPT.length) : out
}
