import { z } from 'zod4'

import { escape, fn, Number_isFinite, Number_isNatural, Number_isSafeInteger, parseKey, URI } from '@traversable/registry'
import { Json } from '@traversable/json'
import { t, defaultIndex } from '@traversable/schema'

export type Options = {
  exactOptional?: boolean
  format?: boolean
  initialOffset?: number
  maxWidth?: number
  namespaceAlias?: string
  preferInterface?: boolean
}

interface Config extends Required<Options> {}

const defaults = {
  exactOptional: true,
  format: false,
  initialOffset: 0,
  maxWidth: 99,
  namespaceAlias: 'z',
  preferInterface: true,
} satisfies Config


function parseOptions(options?: Options): Config
function parseOptions({
  exactOptional = defaults.exactOptional,
  format = defaults.format,
  initialOffset = defaults.initialOffset,
  maxWidth = defaults.maxWidth,
  namespaceAlias = defaults.namespaceAlias,
  preferInterface = defaults.preferInterface,
}: Options = defaults) {
  return {
    exactOptional,
    format,
    initialOffset,
    maxWidth,
    namespaceAlias,
    preferInterface,
  } satisfies Config
}

export const fromJson = (options?: Options) => Json.fold<z.ZodType>((x) => {
  const { preferInterface } = parseOptions(options)
  switch (true) {
    default: return fn.exhaustive(x)
    case Number.isNaN(x): return z.nan()
    case x == null: return z.null()
    case x === true:
    case x === false:
    case typeof x === 'number':
    case typeof x === 'string': return z.literal(x)
    case Json.isArray(x): return x.length === 0 ? z.tuple([]) : z.tuple([x[0], ...x.slice(1)])
    case Json.isObject(x): {
      const parsed = Object.fromEntries(Object.entries(x).map(([k, v]) => [parseKey(k), v]))
      return preferInterface ? z.interface(parsed) : z.object(parsed)
    }
  }
})

export function stringFromJson(json: Json, options?: Options, index?: Json.Functor.Index): string
export function stringFromJson(
  json: Json,
  options: Options = defaults,
  index: Json.Functor.Index = Json.defaultIndex
) {
  const $ = parseOptions(options)
  const { namespaceAlias: z, format: FORMAT, initialOffset: OFF, maxWidth: MAX_WIDTH, preferInterface } = $
  return Json.foldWithIndex<string>((x, { depth }) => {
    const OFFSET = OFF + depth * 2
    const JOIN = ',\n' + '  '.repeat(depth + 1)
    switch (true) {
      default: return fn.exhaustive(x)
      case Number.isNaN(x): return `${z}.nan()`
      case x == null: return `${z}.null()`
      case x === true:
      case x === false: return `${z}.literal(${x})`
      case typeof x === 'number': return `${z}.literal(${x})`
      case typeof x === 'string': return `${z}.literal("${escape(x)}")`
      case Json.isArray(x): {
        if (x.length === 0) return `${z}.tuple([])`
        else {
          const SINGLE_LINE = `${z}.tuple([${x.join(', ')}])`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${z}.tuple([`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + x.join(JOIN)
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `])`
          }
        }
      }
      case Json.isObject(x): {
        const BASE = preferInterface ? 'interface' : 'object'
        const BODY = Object.entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`)
        if (BODY.length === 0) return `${z}.${BASE}({})`
        else {
          const SINGLE_LINE = `${z}.${BASE}({ ${BODY.join(', ')} })`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${z}.${BASE}({`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + BODY.join(JOIN)
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + '})'
          }
        }
      }
    }
  })(json, index)
}

export function fromTraversable(options?: Options): <S extends t.Schema>(schema: S) => z.ZodType<S['_type']>
export function fromTraversable(options?: Options) {
  return t.fold<z.ZodType>((x) => {
    const $ = parseOptions(options)
    const { preferInterface } = $
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.eq: return fromJson($)(x.def as never)
      case x.tag === URI.never: return z.never()
      case x.tag === URI.unknown: return z.unknown()
      case x.tag === URI.any: return z.any()
      case x.tag === URI.void: return z.void()
      case x.tag === URI.null: return z.null()
      case x.tag === URI.undefined: return z.undefined()
      case x.tag === URI.symbol: return z.symbol()
      case x.tag === URI.boolean: return z.boolean()
      case x.tag === URI.integer: {
        let schema = z.number().int()
        if (Number_isSafeInteger(x.minimum)) schema = schema.min(x.minimum)
        if (Number_isSafeInteger(x.maximum)) schema = schema.max(x.maximum)
        return schema
      }
      case x.tag === URI.bigint: {
        let schema = z.bigint()
        if (typeof x.minimum === 'bigint') schema = schema.min(x.minimum)
        if (typeof x.maximum === 'bigint') schema = schema.max(x.maximum)
        return schema
      }
      case x.tag === URI.number: {
        let schema = z.number()
        if (Number_isFinite(x.minimum)) schema = schema.gte(x.minimum)
        if (Number_isFinite(x.maximum)) schema = schema.lte(x.maximum)
        if (Number_isFinite(x.exclusiveMinimum)) schema = schema.gt(x.exclusiveMinimum)
        if (Number_isFinite(x.exclusiveMaximum)) schema = schema.lt(x.exclusiveMaximum)
        return schema
      }
      case x.tag === URI.string: {
        let schema = z.string()
        if (Number_isNatural(x.minLength)) schema = schema.min(x.minLength)
        if (Number_isNatural(x.maxLength)) schema = schema.max(x.maxLength)
        return schema
      }
      case x.tag === URI.array: {
        let schema = z.array(x.def)
        if (Number_isNatural(x.minLength)) schema = schema.min(x.minLength)
        if (Number_isNatural(x.maxLength)) schema = schema.max(x.maxLength)
        return schema
      }
      case x.tag === URI.optional: return z.optional(x.def)
      case x.tag === URI.record: return z.record(z.string(), x.def)
      case x.tag === URI.union: return z.union(x.def)
      case x.tag === URI.intersect: return x.def.slice(1).reduce((acc, y) => acc.and(y), x.def[0])
      case x.tag === URI.tuple: return x.def.length === 0
        ? z.tuple([])
        : z.tuple([x.def[0], ...x.def.slice(1)])
      case x.tag === URI.object: return !preferInterface
        ? z.object(x.def)
        : z.interface(Object.fromEntries(Object.entries(x.def).map(([k, v]) => [parseKey(k), v])))
    }
  })
}

export function stringFromTraversable(schema: t.Schema, options?: Options, index?: t.Functor.Index): string
export function stringFromTraversable(schema: t.Schema, options: Options = defaults, index: t.Functor.Index = defaultIndex) {
  const $ = parseOptions(options)
  const {
    namespaceAlias: z,
    format: FORMAT,
    initialOffset: OFF,
    maxWidth: MAX_WIDTH,
    preferInterface
  } = $

  return t.foldWithIndex<string>((x, ix) => {
    const path = ix.path.filter((x) => typeof x === 'number' || typeof x === 'string')

    const { depth } = ix
    const OFFSET = OFF + depth * 2
    const JOIN = ',\n' + ' '.repeat(OFFSET + 2)

    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.eq: return stringFromJson(x.def as never, $, { depth, path })
      case x.tag === URI.never: return `${z}.never()`
      case x.tag === URI.unknown: return `${z}.unknown()`
      case x.tag === URI.any: return `${z}.any()`
      case x.tag === URI.void: return `${z}.void()`
      case x.tag === URI.null: return `${z}.null()`
      case x.tag === URI.undefined: return `${z}.undefined()`
      case x.tag === URI.symbol: return `${z}.symbol()`
      case x.tag === URI.boolean: return `${z}.boolean()`
      case x.tag === URI.bigint: return `${z}.bigint()`
      case x.tag === URI.integer: {
        let BOUNDS = ''
        if (Number_isSafeInteger(x.minimum)) BOUNDS += `.min(${x.minimum})`
        if (Number_isSafeInteger(x.maximum)) BOUNDS += `.max(${x.maximum})`
        return `${z}.number().int()${BOUNDS}`
      }
      case x.tag === URI.number: {
        let BOUNDS = ''
        if (Number_isFinite(x.exclusiveMinimum)) BOUNDS += `.gt(${x.exclusiveMinimum})`
        if (Number_isFinite(x.exclusiveMaximum)) BOUNDS += `.lt(${x.exclusiveMaximum})`
        if (Number_isFinite(x.minimum)) BOUNDS += `.min(${x.minimum})`
        if (Number_isFinite(x.maximum)) BOUNDS += `.max(${x.maximum})`
        return `${z}.number()${BOUNDS}`
      }
      case x.tag === URI.string: {
        let BOUNDS = ''
        if (Number_isNatural(x.minLength)) BOUNDS += `.min(${x.minLength})`
        if (Number_isNatural(x.maxLength)) BOUNDS += `.max(${x.maxLength})`
        return `${z}.string()${BOUNDS}`
      }
      case x.tag === URI.array: {
        let BOUNDS = ''
        if (Number_isNatural(x.minLength)) BOUNDS += `.min(${x.minLength})`
        if (Number_isNatural(x.maxLength)) BOUNDS += `.max(${x.maxLength})`
        const SINGLE_LINE = `${z}.array(${x.def})${BOUNDS}`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${z}.array(`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `)${BOUNDS}`
        }
      }
      case x.tag === URI.optional: {
        const SINGLE_LINE = `${z}.optional(${x.def})`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${z}.optional(`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `)`
        }
      }
      case x.tag === URI.record: {
        const SINGLE_LINE = `${z}.record(${z}.string(), ${x.def})`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${z}.record(`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + `${z}.string(),`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `)`
        }
      }
      case x.tag === URI.tuple: {
        const SINGLE_LINE = `${z}.tuple([${x.def.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${z}.tuple([`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `])`
        }
      }
      case x.tag === URI.union: {
        const SINGLE_LINE = `${z}.union([${x.def.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${z}.union([`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `])`
        }
      }
      case x.tag === URI.intersect: {
        if (x.def.length === 0) return `${z}.unknown()`
        else if (x.def.length === 1) return x.def[0]
        else {
          const SINGLE_LINE = `${z}.intersection(` + x.def.slice(1).reduce((acc, cur) => `${acc}.and(${cur})`, x.def[0]) + `)`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${z}.intersection(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + x.def[0]
              + ' '.repeat(OFFSET + 0)
              + '\n'
              + `)`
              + x.def.slice(1).reduce(
                (acc, cur) => ''
                  + acc
                  + `.and(`
                  + '\n'
                  + ' '.repeat(OFFSET + 2)
                  + cur
                  + ' '.repeat(OFFSET + 0)
                  + '\n'
                  + ' '.repeat(OFFSET + 0)
                  + `)`,
                ''
              )
          }
        }
      }

      case x.tag === URI.object: {
        const BASE = preferInterface ? 'interface' : 'object'
        const BODY = Object.entries(x.def).map(([k, v]) => `${parseKey(k)}: ${v}`)
        if (BODY.length === 0) return `${z}.${BASE}({})`
        else {
          const SINGLE_LINE = `${z}.${BASE}({ ${BODY.join(', ')} })`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${z}.${BASE}({`
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
  })(schema, index)
}
