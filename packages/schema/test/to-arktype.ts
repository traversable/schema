import { type as arktype } from 'arktype'

import type * as T from '@traversable/registry'
import { escape, fn, Number_isFinite, Number_isNatural, Number_isSafeInteger, parseKey, URI } from '@traversable/registry'
import { Json } from '@traversable/json'
import { t } from '@traversable/schema'
import { toFixed } from './test-utils.js'

export type StringTree =
  | string
  | readonly StringTree[]
  | { [x: string]: StringTree }

export type Options = {
  exactOptional?: boolean
  format?: boolean
  initialOffset?: number
  maxWidth?: number
  namespaceAlias?: string
}

export type Index =
  & t.Functor.Index
  & { isProperty?: boolean }

export const defaultIndex = {
  depth: 0,
  path: [],
  isProperty: false,
} satisfies Index

const toArkTypeKey = (k: string, opt: string[]) => opt.includes(k) ? `"${parseKey(k)}?"` : parseKey(k)

interface Config extends Required<Options> {}

const defaults = {
  exactOptional: false,
  format: false,
  initialOffset: 0,
  maxWidth: 99,
  namespaceAlias: 'arktype',
} satisfies Config

function parseOptions(options?: Options): Config
function parseOptions({
  exactOptional = defaults.exactOptional,
  format = defaults.format,
  initialOffset = defaults.initialOffset,
  maxWidth = defaults.maxWidth,
  namespaceAlias = defaults.namespaceAlias,
}: Options = defaults) {
  return {
    exactOptional,
    format,
    initialOffset,
    maxWidth,
    namespaceAlias,
  } satisfies Config
}

export type Algebra<T> = T.IndexedAlgebra<Index, t.Free, T>

export const Functor: T.Functor.Ix<Index, t.Free, t.Fixpoint> = {
  map: t.Functor.map,
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x.tag === URI.optional: {
          return ix.isProperty
            ? t.IndexedFunctor.mapWithIndex(f)(x, ix)
            : t.IndexedFunctor.mapWithIndex(f)(x, { ...ix, depth: Math.max(ix.depth - 1, 0) })
        }
        case x.tag === URI.object: {
          const next = { ...ix, isProperty: true }
          return t.IndexedFunctor.mapWithIndex(f)(x, next)
        }
        case t.isCore(x): {
          const next = { ...ix, isProperty: false }
          return t.IndexedFunctor.mapWithIndex(f)(x, next)
        }
      }
    }
  }
}

export function fold<T>(g: Algebra<T>): <S extends t.Schema>(schema: S, ix?: Index) => T
export function fold<T>(g: Algebra<T>) { return (x: t.Schema, ix: Index = defaultIndex): T => fn.cataIx(Functor)(g)(x as never, ix) }

export function fromTraversable(schema: t.Schema, options?: Options, initialIndex?: t.Functor.Index): arktype.Any
export function fromTraversable(
  schema: t.Schema,
  options: Options = defaults,
  initialIndex: t.Functor.Index = defaultIndex,
): arktype.Any {
  return fold<arktype.Any>((x, ix) => {
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
      case x.tag === URI.eq: return arktype<{}>(fromJson(x.def as never, $))
      case x.tag === URI.array: return x.def.array()
      case x.tag === URI.record: return arktype.Record('string', x.def)
      case x.tag === URI.tuple: return arktype(x.def as [])
      case x.tag === URI.intersect: return x.def.reduce((acc, y) => acc.and(y), arktype.unknown)
      case x.tag === URI.union: return x.def.reduce((acc, y) => acc.or(y), arktype.never as arktype<unknown>)
      case x.tag === URI.optional:
        return ix.isProperty && $.exactOptional ? x.def : arktype(x.def).or(arktype.undefined)
      case x.tag === URI.object:
        return arktype(Object.fromEntries(Object.entries(x.def).map(([k, v]) => [x.opt.includes(k) ? `${k}?` : k, v])))
    }
  })(schema, initialIndex)
}

export function fromJson(json: Json, options?: Options, initialIndex?: Json.Functor.Index): StringTree
export function fromJson(
  json: Json,
  options: Options = defaults,
  initialIndex: Json.Functor.Index = Json.defaultIndex,
): StringTree {
  return Json.foldWithIndex<StringTree>((x, { depth }) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case Number.isNaN(x):
      case x == null: return 'null'
      case x === true: return 'true'
      case x === false: return 'false'
      case typeof x === 'number': return `${toFixed(x)}`
      case typeof x === 'string': return `"${escape(x)}"`
      case Json.isArray(x): return x
      /**
       * Under the hood, {@link fn.map `fn.map`} initializes objects with `Object.create(null)`, to
       * prevent prototype pollution.
       * 
       * Here, we clone the object to restore its prototype, which helps us avoid runtime
       * exceptions -- otherwise the objects returned by {@link fromJson `fromJson`} will
       * lack (for example) an implementation of 
       * {@link Object.prototype.toString `Object.prototype.toString`}.
       */
      case Json.isObject(x): return globalThis.structuredClone(x)
    }
  })(json, initialIndex)
}

export function stringFromJson(json: Json, options?: Options, initialIndex?: Json.Functor.Index): string
export function stringFromJson(
  json: Json,
  options: Options = defaults,
  initialIndex: Json.Functor.Index = Json.defaultIndex,
): string {
  const { format: FORMAT, maxWidth: MAX_WIDTH, initialOffset: OFF } = parseOptions(options)
  return Json.foldWithIndex<string>((x, { depth }) => {
    const OFFSET = OFF + depth * 2
    const JOIN = ',\n' + '  '.repeat(depth + 1)
    switch (true) {
      default: return fn.exhaustive(x)
      case Number.isNaN(x):
      case x == null: return `'null'`
      case x === true: return `'true'`
      case x === false: return `'false'`
      case typeof x === 'number': return `'${x}'`
      case typeof x === 'string': return `'"${x}"'`
      case Json.isArray(x): {
        if (x.length === 0) return '[]'
        else {
          const SINGLE_LINE = `[${x.join(', ')}]`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `[`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + x.join(JOIN)
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `]`
          }
        }
      }
      case Json.isObject(x): {
        const BODY = Object.entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`)
        if (BODY.length === 0) return '{}'
        else {
          const SINGLE_LINE = `{ ${BODY.join(', ')} }`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `{`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + BODY.join(JOIN)
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `}`
          }
        }
      }
    }
  })(json, initialIndex)
}

export function stringFromTraversable(schema: t.Schema, options?: Options, initialIndex?: t.Functor.Index): string
export function stringFromTraversable(
  schema: t.Schema,
  options: Options = defaults,
  initialIndex: t.Functor.Index = defaultIndex,
) {
  const $ = parseOptions(options)
  const { namespaceAlias: ark, exactOptional, format: FORMAT, initialOffset: OFF, maxWidth: MAX_WIDTH } = $
  return fold<string>((x, ix) => {
    const path = ix.path.filter((x) => typeof x === 'string' || typeof x === 'number')

    const { depth } = ix
    const OFFSET = OFF + depth * 2
    const JOIN = ',\n' + ' '.repeat(OFFSET + 2)

    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.eq: return `${ark}(${stringFromJson(x.def, $, { depth, path })})`
      case x.tag === URI.never: return `${ark}.never`
      case x.tag === URI.unknown: return `${ark}.unknown`
      case x.tag === URI.any: return `${ark}.unknown`
      case x.tag === URI.void: return `${ark}.undefined`
      case x.tag === URI.null: return `${ark}.null`
      case x.tag === URI.undefined: return `${ark}.undefined`
      case x.tag === URI.symbol: return `${ark}.symbol`
      case x.tag === URI.boolean: return `${ark}.boolean`
      case x.tag === URI.bigint: return `${ark}.bigint`
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

        const SINGLE_LINE
          = x.def.startsWith(`[`) ? CHAIN(`${ark}(` + x.def + `).array()`)

            : x.def.startsWith(`${ark}(`) ? CHAIN(x.def + `.array()`)

              : [`${ark}.null`, `${ark}.boolean`, `${ark}.number`, `${ark}.string`].includes(x.def) ? EMBED(x.def.slice(`${ark}.`.length) + `[]`)

                : ['"null', '"boolean', '"number', '"string'].some((_) => x.def.startsWith(_)) ? EMBED(x.def.slice(1, -1) + `[]`)

                  : x.def.startsWith(`${ark}.`) ? CHAIN(x.def + `.array()`)

                    : CHAIN(`${ark}(` + x.def + ', "[]")')

        const MULTI_LINE
          = x.def.startsWith(`[`) ? CHAIN(''
            + `${ark}(`
            + `\n`
            + ' '.repeat(OFFSET + 2)
            + x.def
            + `\n`
            + ' '.repeat(OFFSET + 0)
            + `).array()`
          ) : x.def.startsWith(`${ark}(`) ? CHAIN(x.def + `.array()`)
            : [`${ark}.null`, `${ark}.boolean`, `${ark}.number`, `${ark}.string`].includes(x.def) ? EMBED(x.def.slice(`${ark}.`.length) + `[]`)
              : ['"null', '"boolean', '"number', '"string'].some((_) => x.def.startsWith(_)) ? EMBED(x.def.slice(1, -1) + `[]`)
                : x.def.startsWith(`${ark}.`) ? CHAIN(x.def + `.array()`)
                  : CHAIN(''
                    + `${ark}(`
                    + `\n`
                    + ' '.repeat(OFFSET + 2)
                    + x.def
                    + ', "[]")'
                  )

        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE

            : MULTI_LINE
        }
      }
      case x.tag === URI.optional: {
        if (ix.isProperty && exactOptional) return x.def
        else {
          const SINGLE_LINE = x.def.startsWith(ark) ? x.def + `.or(${ark}.undefined)` : x.def
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : !x.def.startsWith(ark)
                ? x.def
                : (
                  `${x.def}.or(`
                  + '\n'
                  + ' '.repeat(OFFSET + 2)
                  + `${ark}.undefined`
                  + '\n'
                  + ' '.repeat(OFFSET + 0)
                  + ')'
                )
          }
        }
      }
      case x.tag === URI.record: {
        const SINGLE_LINE = `${ark}.Record("string", ${x.def})`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${ark}.Record(`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + '"string",'
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + ')'
        }
      }
      case x.tag === URI.tuple: {
        if (x.def.length === 0) return `${ark}([])`
        else {
          const SINGLE_LINE = `${ark}([${x.def.join(', ')}])`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${ark}([`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + x.def.join(JOIN)
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `])`
          }
        }
      }
      case x.tag === URI.union: {
        if (x.def.length === 0) return `${ark}.never`
        const SINGLE_LINE = ''
          + (x.def[0].startsWith(`${ark}(`) ? x.def[0] : `${ark}(${x.def[0]})`)
          + (x.def.slice(1).reduce((acc, y) => `${acc}.or(${y})`, ''))
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${ark}(`
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + x.def[0]
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `)`
            + x.def.slice(1).reduce(
              (acc, cur) => ''
                + acc
                + `.or(`
                + '\n'
                + ' '.repeat(OFFSET + 2)
                + cur
                + '\n'
                + ' '.repeat(OFFSET + 0)
                + `)`
              , ''
            )
        }
      }
      case x.tag === URI.intersect: {
        const SINGLE_LINE = ''
          + (x.def[0].startsWith(`${ark}(`) ? x.def[0] : `${ark}(${x.def[0]})`)
          + (x.def.slice(1).reduce((acc, y) => `${acc}.and(${y})`, ''))
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : x.def[0].startsWith(`${ark}(`)
              ? x.def[0]
              : `${ark}(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + x.def[0]
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `)`
              + x.def.slice(1).reduce(
                (acc, cur) => ''
                  + acc
                  + `.and(`
                  + '\n'
                  + ' '.repeat(OFFSET + 2)
                  + cur
                  + '\n'
                  + ' '.repeat(OFFSET + 0)
                  + '\n'
                  + ' '.repeat(OFFSET + 0)
                  + `)`
                , ''
              )
        }
      }
      case x.tag === URI.object: {
        const BODY = Object.entries(x.def).map(([k, v]) => `${toArkTypeKey(k, x.opt)}: ${v}`)
        if (BODY.length === 0) return `${ark}({})`
        else {
          const SINGLE_LINE = `${ark}({ ${BODY.join(', ')} })`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${ark}({`
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
  })(schema, initialIndex)
}
