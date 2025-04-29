import { type as arktype } from 'arktype'
import { fc } from '@fast-check/vitest'

import { escape, fn, Number_isFinite, Number_isNatural, Number_isSafeInteger, parseKey as parseKey_, URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import { t } from '@traversable/schema'

export type StringTree =
  | string
  | readonly StringTree[]
  | { [x: string]: StringTree }

export type Options = {
  namespaceAlias?: string
  object?: Options.Object
}

export declare namespace Options {
  type Object = {
    exactOptional?: boolean
  }
}

interface Config extends Required<Options> {
  object: Config.Object
}
declare namespace Config {
  interface Object extends Required<Options.Object> {}
}

const parseKey = (k: string) => parseKey_(k, { parseAsJson: false })

const defaults = {
  namespaceAlias: 'arktype',
  object: {
    exactOptional: true,
  }
} satisfies Config

const parseOptions
  : (options?: Options) => Config
  = ({
    namespaceAlias = defaults.namespaceAlias,
    object: {
      exactOptional = defaults.object.exactOptional,
    } = defaults.object,
  }: Options = defaults) => ({
    namespaceAlias,
    object: {
      exactOptional,
    }
  })

export const PATTERN = {
  alphanumeric: '^[a-zA-Z0-9]*$',
  ident: '^[$_a-zA-Z][$_a-zA-Z0-9]*$',
  exponential: 'e[-|+]?',
} as const satisfies Record<string, string>

export const REG_EXP = {
  alphanumeric: new RegExp(PATTERN.alphanumeric, 'u'),
  ident: new RegExp(PATTERN.ident, 'u'),
  exponential: new RegExp(PATTERN.exponential, 'u'),
} satisfies Record<string, RegExp>

export const LEAST_UPPER_BOUND = 0x100000000
export const GREATEST_LOWER_BOUND = 1e-8
export const floatConstraints = { noDefaultInfinity: true, min: -LEAST_UPPER_BOUND, max: +LEAST_UPPER_BOUND } satisfies fc.FloatConstraints
export const getExponential = (x: number) => Number.parseInt(String(x).split(REG_EXP.exponential)[1])
export const isBounded = (x: number) => x <= -GREATEST_LOWER_BOUND || +GREATEST_LOWER_BOUND <= x
export const toFixed = (x: number) => {
  const exponential = getExponential(x)
  return Number.isNaN(x) ? x : x.toFixed(exponential)
}

export const arbitrary = {
  alphanumeric: fc.stringMatching(REG_EXP.alphanumeric),
  ident: fc.stringMatching(REG_EXP.ident),
  int32toFixed: fc.float(floatConstraints).filter(isBounded).map(toFixed)
}

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
  const { namespaceAlias: type } = $
  switch (true) {
    default: return fn.exhaustive(x)
    case x.tag === URI.never: return `${type}.never`
    case x.tag === URI.unknown: return `${type}.unknown`
    case x.tag === URI.any: return `${type}.unknown`
    case x.tag === URI.void: return `${type}.undefined`
    case x.tag === URI.null: return `${type}.null`
    case x.tag === URI.undefined: return `${type}.undefined`
    case x.tag === URI.symbol: return `${type}.symbol`
    case x.tag === URI.boolean: return `${type}.boolean`
    case x.tag === URI.bigint: return `${type}.bigint`
    case x.tag === URI.optional: return x.def.startsWith(type) ? x.def + `.or(${type}.undefined)` : x.def
    case x.tag === URI.integer: {
      let schema = `${type}.keywords.number.integer`
      if (Number_isSafeInteger(x.minimum)) schema += `.atLeast(${x.minimum})`
      if (Number_isSafeInteger(x.maximum)) schema += `.atMost(${x.maximum})`
      return schema
    }
    case x.tag === URI.number: {
      let schema = `${type}.number`
      if (Number_isFinite(x.exclusiveMinimum)) schema += `.moreThan(${x.exclusiveMinimum})`
      if (Number_isFinite(x.exclusiveMaximum)) schema += `.lessThan(${x.exclusiveMaximum})`
      if (Number_isFinite(x.minimum)) schema += `.atLeast(${x.minimum})`
      if (Number_isFinite(x.maximum)) schema += `.atMost(${x.maximum})`
      return schema
    }
    case x.tag === URI.string: {
      let schema = `${type}.string`
      if (Number_isNatural(x.minLength)) schema += `.atLeastLength(${x.minLength})`
      if (Number_isNatural(x.maxLength)) schema += `.atMostLength(${x.maxLength})`
      return schema
    }
    case x.tag === URI.eq: return `${type}(${stringFromJson($)(x.def)})`
    case x.tag === URI.array: {
      const CHAIN = (body: string) => ''
        + body
        + (Number_isNatural(x.minLength) ? `.atLeastLength(${x.minLength})` : '')
        + (Number_isNatural(x.maxLength) ? `.atMostLength(${x.maxLength})` : '')
      const EMBED = (body: string) => ''
        + `${type}("`
        + (Number_isSafeInteger(x.minLength) && Number_isSafeInteger(x.maxLength) ? `${x.minLength} <= ` : '')
        + body
        + (Number_isSafeInteger(x.maxLength) ? ` <= ${x.maxLength}` : '')
        + (Number_isSafeInteger(x.minLength) && !Number_isSafeInteger(x.maxLength) ? ` >= ${x.minLength}` : '')
        + '")'
      return x.def.startsWith(`[`) ? CHAIN(`${type}(` + x.def + `).array()`)
        : x.def.startsWith(`${type}(`) ? CHAIN(x.def + `.array()`)
          : [`${type}.null`, `${type}.boolean`, `${type}.number`, `${type}.string`].includes(x.def)
            ? EMBED(x.def.slice(`${type}.`.length) + `[]`)
            : ['"null', '"boolean', '"number', '"string'].some((_) => x.def.startsWith(_))
              ? EMBED(x.def.slice(1, -1) + `[]`)
              : x.def.startsWith(`${type}.`) ? CHAIN(x.def + `.array()`)
                : CHAIN(`${type}(` + x.def + ', "[]")')
    }
    case x.tag === URI.record: return `${type}.Record("string", ${x.def})`
    case x.tag === URI.tuple: return x.def.length === 0 ? `${type}([])` : `${type}([${x.def.join(', ')}])`
    case x.tag === URI.union: return ''
      + (x.def[0].startsWith(`${type}(`) ? x.def[0] : `${type}(${x.def[0]})`)
      + (x.def.slice(1).reduce((acc, y) => `${acc}.or(${y})`, ''))
    case x.tag === URI.intersect: return ''
      + (x.def[0].startsWith(`${type}(`) ? x.def[0] : `${type}(${x.def[0]})`)
      + (x.def.slice(1).reduce((acc, y) => `${acc}.and(${y})`, ''))
    case x.tag === URI.object: return ''
      + `${type}({ `
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
