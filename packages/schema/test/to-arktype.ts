import { type as arktype } from 'arktype'

import { escape, fn, Number_isFinite, Number_isNatural, Number_isSafeInteger, parseKey, URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import { t } from '@traversable/schema'
import {
  toFixed,
} from './test-utils.js'

export type StringTree =
  | string
  | readonly StringTree[]
  | { [x: string]: StringTree }

export type Options = {
  exactOptional?: boolean
  format?: boolean
  maxWidth?: number
  namespaceAlias?: string
}

interface Config extends Required<Options> {}


const defaults = {
  exactOptional: true,
  format: false,
  maxWidth: 99,
  namespaceAlias: 'arktype',
} satisfies Config

const parseOptions
  : (options?: Options) => Config
  = ({
    exactOptional = defaults.exactOptional,
    format = defaults.format,
    maxWidth = defaults.maxWidth,
    namespaceAlias = defaults.namespaceAlias,
  }: Options = defaults) => ({
    exactOptional,
    format,
    maxWidth,
    namespaceAlias,
  })

export const fromJson = (options?: Options) => Json.fold<StringTree>((x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case Number.isNaN(x):
    case x == null: return 'null'
    case x === true: return 'true'
    case x === false: return 'false'
    case typeof x === 'number': return `${toFixed(x)}`
    case typeof x === 'string': return `"${escape(x)}"`
    case Json.isArray(x): return x
    case Json.isObject(x): return x
  }
})

export const stringFromJson = (options?: Options) => Json.fold<string>((x) => {
  switch (true) {
    default: return fn.exhaustive(x)
    case Number.isNaN(x):
    case x == null: return `'null'`
    case x === true: return `'true'`
    case x === false: return `'false'`
    case typeof x === 'number': return `'${x}'`
    case typeof x === 'string': return `'"${x}"'`
    case Json.isArray(x): return x.length === 0 ? '[]' : `[${x.join(', ')}]`
    case Json.isObject(x): {
      const xs = Object.entries(x)
      return xs.length === 0
        ? '{}'
        : `{ ${xs.map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ')} }`
    }
  }
})

export const fromTraversable = (options?: Options) => t.fold<arktype.Any>((x) => {
  const $ = parseOptions(options)
  switch (true) {
    default: return fn.exhaustive(x)
    case x.tag === URI.never: return arktype.never
    case x.tag === URI.unknown: return arktype.unknown
    case x.tag === URI.any: return arktype.unknown
    case x.tag === URI.void: return arktype.undefined
    case x.tag === URI.null: return arktype.null
    case x.tag === URI.undefined: return arktype.undefined
    case x.tag === URI.symbol: return arktype.symbol
    case x.tag === URI.boolean: return arktype.boolean
    case x.tag === URI.integer: {
      let schema = arktype.keywords.number.integer
      if (Number_isSafeInteger(x.minimum)) schema = schema.atLeast(x.minimum)
      if (Number_isSafeInteger(x.maximum)) schema = schema.atMost(x.maximum)
      return schema
    }
    case x.tag === URI.bigint: return arktype.bigint
    case x.tag === URI.number: {
      let schema = arktype.number
      if (Number_isFinite(x.minimum)) schema = schema.atLeast(x.minimum)
      if (Number_isFinite(x.maximum)) schema = schema.atMost(x.maximum)
      if (Number_isFinite(x.exclusiveMinimum)) schema = schema.moreThan(x.exclusiveMinimum)
      if (Number_isFinite(x.exclusiveMaximum)) schema = schema.lessThan(x.exclusiveMaximum)
      return schema
    }
    case x.tag === URI.string: {
      let schema = arktype.string
      if (Number_isNatural(x.minLength)) schema = schema.atLeastLength(x.minLength)
      if (Number_isNatural(x.maxLength)) schema = schema.atMostLength(x.maxLength)
      return schema
    }
    case x.tag === URI.eq: return arktype<{}>(fromJson($)(x.def as never))
    case x.tag === URI.array: return x.def.array()
    case x.tag === URI.optional: return arktype(x.def).or(arktype.undefined)
    case x.tag === URI.record: return arktype.Record('string', x.def)
    case x.tag === URI.tuple: return arktype(x.def as [])
    case x.tag === URI.intersect:
      return x.def.reduce((acc, y) => acc.and(y), arktype.unknown)
    case x.tag === URI.union:
      return x.def.reduce((acc, y) => acc.or(y), arktype.never as arktype<unknown>)
    case x.tag === URI.object:
      return arktype(Object.fromEntries(Object.entries(x.def).map(([k, v]) => [x.opt.includes(k) ? `${k}?` : k, v])))
  }
})

export const stringFromTraversable = (options?: Options) => t.fold<string>((x) => {
  const $ = parseOptions(options)
  const { namespaceAlias: ark } = $
  switch (true) {
    default: return fn.exhaustive(x)
    case x.tag === URI.never: return `${ark}.never`
    case x.tag === URI.unknown: return `${ark}.unknown`
    case x.tag === URI.any: return `${ark}.unknown`
    case x.tag === URI.void: return `${ark}.undefined`
    case x.tag === URI.null: return `${ark}.null`
    case x.tag === URI.undefined: return `${ark}.undefined`
    case x.tag === URI.symbol: return `${ark}.symbol`
    case x.tag === URI.boolean: return `${ark}.boolean`
    case x.tag === URI.bigint: return `${ark}.bigint`
    case x.tag === URI.optional: return x.def.startsWith(ark) ? x.def + `.or(${ark}.undefined)` : x.def
    case x.tag === URI.integer: {
      let schema = `${ark}.keywords.number.integer`
      if (Number_isSafeInteger(x.minimum)) schema += `.atLeast(${x.minimum})`
      if (Number_isSafeInteger(x.maximum)) schema += `.atMost(${x.maximum})`
      return schema
    }
    case x.tag === URI.number: {
      let schema = `${ark}.number`
      if (Number_isFinite(x.exclusiveMinimum)) schema += `.moreThan(${x.exclusiveMinimum})`
      if (Number_isFinite(x.exclusiveMaximum)) schema += `.lessThan(${x.exclusiveMaximum})`
      if (Number_isFinite(x.minimum)) schema += `.atLeast(${x.minimum})`
      if (Number_isFinite(x.maximum)) schema += `.atMost(${x.maximum})`
      return schema
    }
    case x.tag === URI.string: {
      let schema = `${ark}.string`
      if (Number_isNatural(x.minLength)) schema += `.atLeastLength(${x.minLength})`
      if (Number_isNatural(x.maxLength)) schema += `.atMostLength(${x.maxLength})`
      return schema
    }
    case x.tag === URI.eq: return `${ark}(${stringFromJson($)(x.def)})`
    case x.tag === URI.array: {
      const CHAIN = (body: string) => ''
        + body
        + (Number_isNatural(x.minLength) ? `.atLeastLength(${x.minLength})` : '')
        + (Number_isNatural(x.maxLength) ? `.atMostLength(${x.maxLength})` : '')
      const EMBED = (body: string) => ''
        + `${ark}("`
        + (Number_isSafeInteger(x.minLength) && Number_isSafeInteger(x.maxLength) ? `${x.minLength} <= ` : '')
        + body
        + (Number_isSafeInteger(x.maxLength) ? ` <= ${x.maxLength}` : '')
        + (Number_isSafeInteger(x.minLength) && !Number_isSafeInteger(x.maxLength) ? ` >= ${x.minLength}` : '')
        + '")'
      return x.def.startsWith(`[`) ? CHAIN(`${ark}(` + x.def + `).array()`)
        : x.def.startsWith(`${ark}(`) ? CHAIN(x.def + `.array()`)
          : [`${ark}.null`, `${ark}.boolean`, `${ark}.number`, `${ark}.string`].includes(x.def)
            ? EMBED(x.def.slice(`${ark}.`.length) + `[]`)
            : ['"null', '"boolean', '"number', '"string'].some((_) => x.def.startsWith(_))
              ? EMBED(x.def.slice(1, -1) + `[]`)
              : x.def.startsWith(`${ark}.`) ? CHAIN(x.def + `.array()`)
                : CHAIN(`${ark}(` + x.def + ', "[]")')
    }
    case x.tag === URI.record: return `${ark}.Record("string", ${x.def})`
    case x.tag === URI.tuple: return x.def.length === 0 ? `${ark}([])` : `${ark}([${x.def.join(', ')}])`
    case x.tag === URI.union: return ''
      + (x.def[0].startsWith(`${ark}(`) ? x.def[0] : `${ark}(${x.def[0]})`)
      + (x.def.slice(1).reduce((acc, y) => `${acc}.or(${y})`, ''))
    case x.tag === URI.intersect: return ''
      + (x.def[0].startsWith(`${ark}(`) ? x.def[0] : `${ark}(${x.def[0]})`)
      + (x.def.slice(1).reduce((acc, y) => `${acc}.and(${y})`, ''))
    case x.tag === URI.object: return ''
      + `${ark}({ `
      + Object.entries(x.def).map(
        ([k, v]) => ''
          + '"'
          + parseKey(k)
          + (x.opt.includes(k) ? '?' : '')
          + '": '
          + v
      ).join(', ')
      + ' })'
  }
})
