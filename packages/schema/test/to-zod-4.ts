import { z } from 'zod4'

import { escape, fn, Number_isFinite, Number_isNatural, Number_isSafeInteger, parseKey as parseKey_, URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import { t } from '@traversable/schema'

const parseKey = (k: string) => parseKey_(k, { parseAsJson: false })

export type Options = {
  maxWidth?: number
  namespaceAlias?: string
  object?: Options.Object
}

export declare namespace Options {
  type Object = {
    exactOptional?: boolean
    preferInterface?: boolean
  }
}

interface Config extends Required<Options> {
  object: Config.Object
}
declare namespace Config {
  interface Object extends Required<Options.Object> {}
}

const defaults = {
  maxWidth: 99,
  namespaceAlias: 'z',
  object: {
    exactOptional: true,
    preferInterface: true,
  }
} satisfies Config

const parseOptions
  : (options?: Options) => Config
  = ({
    maxWidth = defaults.maxWidth,
    namespaceAlias = defaults.namespaceAlias,
    object: {
      exactOptional = defaults.object.exactOptional,
      preferInterface = defaults.object.preferInterface,
    } = defaults.object
  }: Options = defaults) => ({
    maxWidth,
    namespaceAlias,
    object: {
      exactOptional,
      preferInterface,
    }
  })

export const fromJson = (options?: Options) => Json.fold<z.ZodType>((x) => {
  const { object: { preferInterface } } = parseOptions(options)
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

export const stringFromJson
  : (options?: Options) => (json: Json, index?: Json.Functor.Index) => string
  = (options) => (json, index = Json.defaultIndex) => Json.foldWithIndex<string>((x, { path }) => {
    const $ = parseOptions(options)
    const { maxWidth: MAX_WIDTH, namespaceAlias: z, object: { preferInterface } } = $
    const JOIN = ',\n' + '  '.repeat(path.length + 1)
    switch (true) {
      default: return fn.exhaustive(x)
      case Number.isNaN(x): return `${z}.nan()`
      case x == null: return `${z}.null()`
      case x === true:
      case x === false:
      case typeof x === 'number': return `${z}.literal(${x})`
      case typeof x === 'string': return `${z}.literal("${escape(x)}")`
      case Json.isArray(x): {
        // const WIDTH = 'z.tuple(['.length + xs.reduce((acc, x) => acc + ', '.length + x.length, ix.length * 2) + '])'.length
        const WIDTH = `${z}.tuple([`.length + x.reduce((acc, y) => acc + ', '.length + y.length, path.length * 2) + `])`.length
        return x.length === 0 ? `${z}.tuple([])`
          : WIDTH < MAX_WIDTH ? `z.tuple([${x.join(', ')}])`
            : `${z}.tuple([${x.join(JOIN)}])`
      }
      case Json.isObject(x): {
        const BASE = preferInterface ? 'interface' : 'object'
        const xs = Object.entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`)
        const WIDTH = `${z}.${BASE}({ `.length + xs.reduce((acc, x) => acc + ', '.length + x.length, path.length * 2) + ' })'.length
        return xs.length === 0 ? `${z}.${BASE}({})`
          : WIDTH < MAX_WIDTH ? `${z}.${BASE}({ ${xs.join(', ')} })`
            : `${z}.${BASE}({`
            + '\n'
            + '  '.repeat(path.length + 1)
            + xs.join(JOIN)
            + '\n'
            + '  '.repeat(path.length)
            + '})'

        // `${z}.${BASE}({ ${xs.join(',\n')} })`
      }
    }
  })(json, index)

export function fromTraversable(options?: Options): <S extends t.Schema>(schema: S) => z.ZodType<S['_type']>
export function fromTraversable(options?: Options) {
  return t.fold<z.ZodType>((x) => {
    const $ = parseOptions(options)
    const { object: { preferInterface } } = $
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

export const stringFromTraversable
  : (options?: Options) => (schema: t.Schema, index?: (keyof any)[]) => string
  = (options) => (schema, index = []) => t.foldWithIndex<string>((x, ix) => {
    const $ = parseOptions(options)
    const { namespaceAlias: z, object: { preferInterface } } = $
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.never: return `${z}.never()`
      case x.tag === URI.unknown: return `${z}.unknown()`
      case x.tag === URI.any: return `${z}.any()`
      case x.tag === URI.void: return `${z}.void()`
      case x.tag === URI.null: return `${z}.null()`
      case x.tag === URI.undefined: return `${z}.undefined()`
      case x.tag === URI.symbol: return `${z}.symbol()`
      case x.tag === URI.boolean: return `${z}.boolean()`
      case x.tag === URI.bigint: return `${z}.bigint()`
      case x.tag === URI.optional: return `${z}.optional(${x.def})`
      case x.tag === URI.integer: {
        let schema = `${z}.number().int()`
        if (Number_isSafeInteger(x.minimum)) schema += `.min(${x.minimum})`
        if (Number_isSafeInteger(x.maximum)) schema += `.max(${x.maximum})`
        return schema
      }
      case x.tag === URI.number: {
        let schema = `${z}.number()`
        if (Number_isFinite(x.exclusiveMinimum)) schema += `.gt(${x.exclusiveMinimum})`
        if (Number_isFinite(x.exclusiveMaximum)) schema += `.lt(${x.exclusiveMaximum})`
        if (Number_isFinite(x.minimum)) schema += `.min(${x.minimum})`
        if (Number_isFinite(x.maximum)) schema += `.max(${x.maximum})`
        return schema
      }
      case x.tag === URI.string: {
        let schema = `${z}.string()`
        if (Number_isNatural(x.minLength)) schema += `.min(${x.minLength})`
        if (Number_isNatural(x.maxLength)) schema += `.max(${x.maxLength})`
        return schema
      }
      case x.tag === URI.eq: {
        return stringFromJson($)(x.def as never)
      }
      case x.tag === URI.array: {
        let schema = `${z}.array(${x.def})`
        if (Number_isNatural(x.minLength)) schema += `.min(${x.minLength})`
        if (Number_isNatural(x.maxLength)) schema += `.max(${x.maxLength})`
        return schema
      }
      case x.tag === URI.record: return `${z}.record(z.string(), ${x.def})`
      case x.tag === URI.tuple: return `${z}.tuple([${x.def.join(', ')}])`
      case x.tag === URI.union: return `${z}.union([${x.def.join(', ')}])`
      case x.tag === URI.intersect:
        return x.def.length === 0 ? `${z}.unknown()`
          : x.def.length === 1 ? x.def[0]
            : `${z}.intersection(` + x.def.slice(1).reduce((acc, cur) => `${acc}.and(${cur})`, x.def[0]) + `)`
      case x.tag === URI.object: {
        const BASE = preferInterface ? 'interface' : 'object'
        const xs = Object.entries(x.def).map(
          ([k, v]) => ''
            + '"'
            + parseKey(k)
            + '": '
            + v
        )
        return xs.length === 0
          ? `${z}.${BASE}({})`
          : `${z}.${BASE}({ ${xs.join(', ')} })`
      }
    }
  })(schema as t.Fixpoint, index)
