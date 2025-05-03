import * as typebox from '@sinclair/typebox'
import type * as T from '@traversable/registry'

import { escape, fn, Number_isFinite, Number_isNatural, Number_isSafeInteger, Object_entries, parseKey, symbol, URI } from '@traversable/registry'
import { Json } from '@traversable/json'

import { defaultIndex, t } from '@traversable/schema'

export type Options = {
  format?: boolean
  initialOffset?: number
  maxWidth?: number
  namespaceAlias?: string
}

interface Config extends Required<Options> {}

const defaults = {
  format: false,
  initialOffset: 0,
  maxWidth: 99,
  namespaceAlias: 'typebox',
} satisfies Config

const parseOptions
  : (options?: Options) => Config
  = ({
    format = defaults.format,
    initialOffset = defaults.initialOffset,
    maxWidth = defaults.maxWidth,
    namespaceAlias = defaults.namespaceAlias,
  }: Options = defaults) => ({
    format,
    initialOffset,
    maxWidth,
    namespaceAlias,
  })

interface Index {
  path: (keyof any)[]
  depth: number
  isProperty?: boolean
}

declare namespace Type {
  interface Never { [typebox.Kind]: 'Never' }
  interface Any { [typebox.Kind]: 'Any' }
  interface Unknown { [typebox.Kind]: 'Unknown' }
  interface Void { [typebox.Kind]: 'Void' }
  interface Null { [typebox.Kind]: 'Null' }
  interface Undefined { [typebox.Kind]: 'Undefined' }
  interface Symbol { [typebox.Kind]: 'Symbol' }
  interface Boolean { [typebox.Kind]: 'Boolean' }
  interface Literal { [typebox.Kind]: 'Literal', const: string | number | boolean }
  interface Integer extends Integer.Bounds { [typebox.Kind]: 'Integer' }
  namespace Integer { interface Bounds { minimum?: number, maximum?: number } }
  interface BigInt extends BigInt.Bounds { [typebox.Kind]: 'BigInt' }
  namespace BigInt { interface Bounds { minimum?: bigint, maximum?: bigint } }
  interface Number extends Number.Bounds { [typebox.Kind]: 'Number' }
  namespace Number { interface Bounds { exclusiveMinimum?: number, exclusiveMaximum?: number, minimum?: number, maximum?: number } }
  interface String extends String.Bounds { [typebox.Kind]: 'String' }
  namespace String { interface Bounds { minLength?: number, maxLength?: number } }
  interface Array<S> extends Array.Bounds { [typebox.Kind]: 'Array', items: S }
  namespace Array { interface Bounds { minItems?: number, maxItems?: number } }
  interface Optional<S> { [typebox.Kind]: 'Optional', schema: S }
  interface Record<S> { [typebox.Kind]: 'Record', patternProperties: { ['^(.*)$']: S } }
  interface Tuple<S> { [typebox.Kind]: 'Tuple', items: S }
  interface Object<S> { [typebox.Kind]: 'Object', properties: S }
  interface Union<S> { [typebox.Kind]: 'Union', anyOf: S }
  interface Intersect<S> { [typebox.Kind]: 'Intersect', allOf: S }
  type Nullary =
    | Never
    | Any
    | Unknown
    | Void
    | Null
    | Undefined
    | Symbol
    | Boolean
    | Integer
    | BigInt
    | Number
    | String
    | Literal

  type Unary<S> =
    | Array<S>
    | Record<S>
    | Optional<S>
    | Tuple<S[]>
    | Union<S[]>
    | Intersect<S[]>
    | Object<{ [x: string]: S }>

  interface Free extends T.HKT { [-1]: F<this[0]> }
  type F<S> = Nullary | Unary<S>
  type Fixpoint =
    | Nullary
    | Array<Fixpoint>
    | Record<Fixpoint>
    | Tuple<Fixpoint[]>
    | Union<Fixpoint[]>
    | Intersect<Fixpoint[]>
    | Object<{ [x: string]: Fixpoint }>
}

const isNullary = (x: unknown): x is Type.Nullary =>
  (!!x && typeof x === 'object' && typebox.Kind in x)
  && (
    x[typebox.Kind] === 'Never'
    || x[typebox.Kind] === 'Any'
    || x[typebox.Kind] === 'Unknown'
    || x[typebox.Kind] === 'Void'
    || x[typebox.Kind] === 'Null'
    || x[typebox.Kind] === 'Undefined'
    || x[typebox.Kind] === 'Symbol'
    || x[typebox.Kind] === 'Boolean'
    || x[typebox.Kind] === 'Integer'
    || x[typebox.Kind] === 'BigInt'
    || x[typebox.Kind] === 'Number'
    || x[typebox.Kind] === 'String'
    || x[typebox.Kind] === 'Literal'
  )

export const Functor: T.Functor.Ix<Index, Type.Free> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
        case 'anyOf' in x: return { ...x, anyOf: fn.map(x.anyOf, f) }
        case 'allOf' in x: return { ...x, allOf: fn.map(x.allOf, f) }
        case x[typebox.Kind] === 'Optional': return { ...x, schema: f(x.schema) }
        case x[typebox.Kind] === 'Array': return { ...x, items: f(x.items) }
        case x[typebox.Kind] === 'Record': return { ...x, patternProperties: fn.map(x.patternProperties, f) }
        case x[typebox.Kind] === 'Tuple': return { ...x, items: fn.map(x.items, f) }
        case x[typebox.Kind] === 'Object': return { ...x, properties: fn.map(x.properties, f) }
      }
    }
  },
  mapWithIndex(f) {
    return (x, ix) => {
      const { path, depth } = ix
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
        case 'anyOf' in x: return { ...x, anyOf: fn.map(x.anyOf, (v) => f(v, { path, depth: depth + 1 })) }
        case 'allOf' in x: return { ...x, allOf: fn.map(x.allOf, (v) => f(v, { path, depth: depth + 1 })) }
        case x[typebox.Kind] === 'Array': return { ...x, items: f(x.items, { path, depth: depth + 1 }) }
        case x[typebox.Kind] === 'Optional': return { ...x, schema: f(x.schema, { path, depth: depth + 1 }) }
        case x[typebox.Kind] === 'Tuple':
          return { ...x, items: fn.map(x.items, (v, i) => f(v, { path: [...path, i], depth: depth + 1 })) }
        case x[typebox.Kind] === 'Record':
          return { ...x, patternProperties: fn.map(x.patternProperties, (v) => f(v, { path, depth: depth + 1 })) }
        case x[typebox.Kind] === 'Object':
          return { ...x, properties: fn.map(x.properties, (v, k) => f(v, { path: [...path, k], depth: depth + 1, isProperty: true })) }
      }
    }
  }
}

const fold = fn.cataIx(Functor)

export const tFunctor: T.Functor.Ix<Index, t.Free, t.Schema> = {
  map: t.Functor.map,
  mapWithIndex(f) {
    return (x, ix) => {
      const next = { ...ix, isProperty: false }
      switch (true) {
        default: return fn.exhaustive(x)
        case t.isNullary(x): return x
        case t.isBoundable(x): return x
        case x.tag === URI.eq: return t.eq.def(x.def as never)
        case x.tag === URI.array: return t.array.def(f(x.def, { ...next, path: [...ix.path, symbol.array], depth: ix.depth + 1 }), x)
        case x.tag === URI.record: return t.record.def(f(x.def, { ...next, path: [...ix.path, symbol.record], depth: ix.depth + 1 }))
        case x.tag === URI.optional: return t.optional.def(f(x.def, { ...next, path: [...ix.path, symbol.optional], depth: ix.depth + 1 }))
        case x.tag === URI.tuple: return t.tuple.def(fn.map(x.def, (y, iy) => f(y, { ...next, path: [...ix.path, iy], depth: ix.depth + 1 })), x.opt)
        case x.tag === URI.union: return t.union.def(fn.map(x.def, (y, iy) => f(y, { ...next, path: [...ix.path, symbol.union, iy], depth: ix.depth + 1 })))
        case x.tag === URI.intersect: return t.intersect.def(fn.map(x.def, (y, iy) => f(y, { ...next, path: [...ix.path, symbol.intersect, iy], depth: ix.depth + 1 })))
        case x.tag === URI.object: return t.object.def(fn.map(x.def, (y, iy) => {
          const next = { ...ix, isProperty: true, path: [...ix.path, iy], depth: ix.depth + 1 }
          return f(y, next)
        }), {}, x.opt)
      }
    }
  },
}

const tFold = fn.cataIx(tFunctor)

const preprocessTypeboxSchema
  : <T>(schema: typebox.TAnySchema, ix: Index) => Type.F<T>
  = <never>fold((schema) => (!(typebox.OptionalKind in schema) ? schema : { [typebox.Kind]: 'Optional', schema }) as never)


export function fromJson(json: Json, options?: Options, initialIndex?: Json.Functor.Index): typebox.TAnySchema
export function fromJson(
  json: Json,
  options: Options = defaults,
  initialIndex = Json.defaultIndex
): typebox.TAnySchema {
  return Json.foldWithIndex<typebox.TAnySchema>((x, ix) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x == null: return typebox.Null()
      case x === true:
      case x === false:
      case typeof x === 'number':
      case typeof x === 'string': return typebox.Literal(x)
      case Json.isArray(x): return typebox.Tuple([...x])
      case Json.isObject(x): return typebox.Object(Object.fromEntries(Object.entries(x).map(([k, v]) => [parseKey(k), v])))
    }
  })(json, initialIndex)
}

export function stringFromJson(json: Json, options?: Options, initialIndex?: Json.Functor.Index): string
export function stringFromJson(json: Json, options: Options = defaults, initialIndex: Json.Functor.Index = Json.defaultIndex) {
  const $ = parseOptions(options)
  const { namespaceAlias: typebox, format: FORMAT, initialOffset: OFF, maxWidth: MAX_WIDTH } = $
  return Json.foldWithIndex<string>((x, ix) => {
    const { depth } = ix
    const OFFSET = OFF + depth * 2
    const JOIN = ',\n' + ' '.repeat(OFFSET + 2)
    switch (true) {
      default: return fn.exhaustive(x)
      case x == null: return `${typebox}.Null()`
      case x === true:
      case x === false:
      case typeof x === 'number': return `${typebox}.Literal(${x})`
      case typeof x === 'string': return `${typebox}.Literal("${escape(x)}")`
      case Json.isArray(x): {
        if (x.length === 0) return `${typebox}.Tuple([])`
        else {
          const SINGLE_LINE = `${typebox}.Tuple([${x.join(', ')}])`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${typebox}.Tuple([`
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
        const BODY = Object.entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`)
        if (BODY.length === 0) return `${typebox}.Object({})`
        else {
          const SINGLE_LINE = `${typebox}.Object({ ${BODY.join(', ')} })`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${typebox}.Object({`
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
  })(json, initialIndex)
}

export function fromTraversable(schema: t.Schema, options?: Options, initialIndex?: Index): typebox.TAnySchema
export function fromTraversable(schema: t.Schema, options: Options = defaults, initialIndex = defaultIndex) {
  return tFold<typebox.TAnySchema>((x, ix) => {
    const $ = parseOptions(options)
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.eq: return fromJson(x.def as never, $)
      case x.tag === URI.never: return typebox.Never()
      case x.tag === URI.unknown: return typebox.Unknown()
      case x.tag === URI.any: return typebox.Any()
      case x.tag === URI.void: return typebox.Void()
      case x.tag === URI.null: return typebox.Null()
      case x.tag === URI.undefined: return typebox.Undefined()
      case x.tag === URI.symbol: return typebox.Symbol()
      case x.tag === URI.boolean: return typebox.Boolean()
      case x.tag === URI.integer: return typebox.Integer({
        ...Number_isSafeInteger(x.minimum) && { minimum: x.minimum },
        ...Number_isSafeInteger(x.maximum) && { maximum: x.maximum },
      })
      case x.tag === URI.bigint: return typebox.BigInt({
        ...typeof x.minimum === 'bigint' && { minimum: x.minimum },
        ...typeof x.maximum === 'bigint' && { maximum: x.maximum },
      })
      case x.tag === URI.number: {
        let bounds: typebox.NumberOptions = {}
        if (Number_isFinite(x.minimum)) bounds.minimum = x.minimum
        if (Number_isFinite(x.maximum)) bounds.maximum = x.maximum
        if (Number_isFinite(x.exclusiveMinimum)) bounds.exclusiveMinimum = x.exclusiveMinimum
        if (Number_isFinite(x.exclusiveMaximum)) bounds.exclusiveMaximum = x.exclusiveMaximum
        return typebox.Number(bounds)
      }
      case x.tag === URI.string: return typebox.String({
        ...Number_isNatural(x.minLength) && { minLength: x.minLength },
        ...Number_isNatural(x.maxLength) && { maxLength: x.maxLength },
      })
      case x.tag === URI.array: return typebox.Array(x.def, {
        ...Number_isNatural(x.minLength) && { minItems: x.minLength },
        ...Number_isNatural(x.maxLength) && { maxItems: x.maxLength },
      })
      case x.tag === URI.optional: {
        if (ix.isProperty)
          return typebox.Optional(typebox.Union([x.def, typebox.Undefined()]))
        else
          return typebox.Union([typebox.Undefined(), x.def])
      }
      case x.tag === URI.record: return typebox.Record(typebox.String(), x.def)
      case x.tag === URI.union: return typebox.Union(x.def)
      case x.tag === URI.intersect: return typebox.Intersect([...x.def])
      case x.tag === URI.tuple: return typebox.Tuple(x.def)
      case x.tag === URI.object: return typebox.Object(x.def)
    }
  })(schema, initialIndex)
}

export function stringFromTraversable(schema: t.Schema, options?: Options, initialIndex?: t.Functor.Index): string
export function stringFromTraversable(
  schema: t.Schema,
  options: Options = defaults,
  initialIndex: t.Functor.Index = defaultIndex,
): string {
  const $ = parseOptions(options)
  const {
    namespaceAlias: Type,
    format: FORMAT,
    initialOffset: OFF,
    maxWidth: MAX_WIDTH
  } = $
  return tFold<string>((x, ix) => {
    const path = ix.path.filter((x) => typeof x === 'number' || typeof x === 'string')
    const { depth } = ix
    const OFFSET = OFF + depth * 2
    const JOIN = `,\n` + ' '.repeat(OFFSET + 2)
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.eq: { return stringFromJson(x.def as never, $, { depth, path }) }
      case x.tag === URI.never: return `${Type}.Never()`
      case x.tag === URI.unknown: return `${Type}.Unknown()`
      case x.tag === URI.any: return `${Type}.Any()`
      case x.tag === URI.void: return `${Type}.Void()`
      case x.tag === URI.null: return `${Type}.Null()`
      case x.tag === URI.undefined: return `${Type}.Undefined()`
      case x.tag === URI.symbol: return `${Type}.Symbol()`
      case x.tag === URI.boolean: return `${Type}.Boolean()`
      case x.tag === URI.bigint: {
        const bounds = [
          typeof x.minimum === 'bigint' ? `minimum: ${x.minimum}` : null,
          typeof x.maximum === 'bigint' ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
        return `${Type}.BigInt(${BOUNDS})`
      }
      case x.tag === URI.integer: {
        const bounds = [
          Number_isSafeInteger(x.minimum) ? `minimum: ${x.minimum}` : null,
          Number_isSafeInteger(x.maximum) ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
        return `${Type}.Integer(${BOUNDS})`
      }
      case x.tag === URI.number: {
        const bounds = [
          Number_isFinite(x.exclusiveMinimum) ? `exclusiveMinimum: ${x.exclusiveMinimum}` : null,
          Number_isFinite(x.exclusiveMaximum) ? `exclusiveMaximum: ${x.exclusiveMaximum}` : null,
          Number_isFinite(x.minimum) ? `minimum: ${x.minimum}` : null,
          Number_isFinite(x.maximum) ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
        return `${Type}.Number(${BOUNDS})`
      }
      case x.tag === URI.string: {
        const bounds = [
          Number_isNatural(x.minLength) ? `minLength: ${x.minLength}` : null,
          Number_isNatural(x.maxLength) ? `maxLength: ${x.maxLength}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
        return `${Type}.String(${BOUNDS})`
      }
      case x.tag === URI.array: {
        let bounds = [
          Number_isNatural(x.minLength) ? `minItems: ${x.minLength}` : null,
          Number_isNatural(x.maxLength) ? `maxItems: ${x.maxLength}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
        const SINGLE_LINE = `${Type}.Array(${x.def}${BOUNDS.length ? ', ' : ''}${BOUNDS})`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Array(`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def
            + (
              BOUNDS.length > 0 ? ''
                + ','
                + '\n'
                + ' '.repeat(OFFSET + 2)
                + BOUNDS
                : ''
            )
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `)`
        }
      }
      case x.tag === URI.optional: {
        const SINGLE_LINE = ix.isProperty
          ? `${Type}.Optional(${x.def})`
          : `${Type}.Union([${Type}.Undefined(), ${x.def}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : ix.isProperty
              ? `${Type}.Optional(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + x.def
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `)`
              : `${Type}.Union([`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + `${Type}.Undefined(),`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + x.def
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `])`
        }
      }
      case x.tag === URI.record: {
        const SINGLE_LINE = `${Type}.Record(${Type}.String(), ${x.def})`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Record(`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + `${Type}.String(),`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `)`
        }
      }
      case x.tag === URI.tuple: {
        const SINGLE_LINE = `${Type}.Tuple([${x.def.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Tuple([`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `])`
        }
      }
      case x.tag === URI.union: {
        const SINGLE_LINE = `${Type}.Union([${x.def.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Union([`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `])`
        }
      }
      case x.tag === URI.intersect: {
        const SINGLE_LINE = `${Type}.Intersect([${x.def.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Intersect([`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.def.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `])`
        }
      }

      case x.tag === URI.object: {
        const BODY = Object.entries(x.def).map(([k, v]) => `${parseKey(k)}: ${v}`)
        if (BODY.length === 0) return `${Type}.Object({})`
        else {
          const SINGLE_LINE = `${Type}.Object({ ${BODY.join(', ')} })`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${Type}.Object({`
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

function stringFromTypebox_(options?: Options): T.IndexedAlgebra<Index, Type.Free, string> {
  const $ = parseOptions(options)
  const { namespaceAlias: Type, format: FORMAT, initialOffset: OFF, maxWidth: MAX_WIDTH } = $
  return fold((x, ix) => {
    const { depth } = ix
    const OFFSET = OFF + depth * 2
    const JOIN = ',\n' + '  '.repeat(depth + 1)
    switch (true) {
      default: return fn.exhaustive(x)
      case x[typebox.Kind] === 'Never': return `${Type}.Never()`
      case x[typebox.Kind] === 'Any': return `${Type}.Any()`
      case x[typebox.Kind] === 'Unknown': return `${Type}.Unknown()`
      case x[typebox.Kind] === 'Void': return `${Type}.Void()`
      case x[typebox.Kind] === 'Null': return `${Type}.Null()`
      case x[typebox.Kind] === 'Undefined': return `${Type}.Undefined()`
      case x[typebox.Kind] === 'Symbol': return `${Type}.Symbol()`
      case x[typebox.Kind] === 'Boolean': return `${Type}.Boolean()`
      case x[typebox.Kind] === 'Literal': return `${Type}.Literal(${x.const})`
      case x[typebox.Kind] === 'Integer': {
        const bounds = [
          Number_isSafeInteger(x.minimum) ? `minimum: ${x.minimum}` : null,
          Number_isSafeInteger(x.maximum) ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
        return `${Type}.Integer(${BOUNDS})`
      }
      case x[typebox.Kind] === 'BigInt': {
        const bounds = [
          typeof x.minimum === 'bigint' ? `minimum: ${x.minimum}` : null,
          typeof x.maximum === 'bigint' ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
        return `${Type}.BigInt(${BOUNDS})`
      }
      case x[typebox.Kind] === 'Number': {
        const bounds = [
          Number_isFinite(x.exclusiveMinimum) ? `exclusiveMinimum: ${x.exclusiveMinimum}` : null,
          Number_isFinite(x.exclusiveMaximum) ? `exclusiveMaximum: ${x.exclusiveMaximum}` : null,
          Number_isFinite(x.minimum) ? `minimum: ${x.minimum}` : null,
          Number_isFinite(x.maximum) ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
        return `${Type}.Number(${BOUNDS})`
      }
      case x[typebox.Kind] === 'String': {
        const bounds = [
          Number_isNatural(x.minLength) ? `minLength: ${x.minLength}` : null,
          Number_isNatural(x.maxLength) ? `maxLength: ${x.maxLength}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `{ ${bounds.join(', ')} }`
        return `${Type}.String(${BOUNDS})`
      }
      case x[typebox.Kind] === 'Array': {
        const bounds = [
          Number_isNatural(x.minItems) ? `minItems: ${x.minItems}` : null,
          Number_isNatural(x.maxItems) ? `maxItems: ${x.maxItems}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `, { ${bounds.join(', ')} }`
        const SINGLE_LINE = `${Type}.Array(${x.items}${BOUNDS})`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Array(`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.items
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `)`
        }
      }
      case x[typebox.Kind] === 'Optional': {
        const SINGLE_LINE = ix.isProperty
          ? `${Type}.Optional(${x.schema})`
          : `${Type}.Union([${Type}.Undefined(), ${x.schema}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : ix.isProperty
              ? `${Type}.Optional(`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + x.schema
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `)`
              : `${Type}.Union([`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + `${Type}.Undefined(),`
              + '\n'
              + ' '.repeat(OFFSET + 2)
              + x.schema
              + '\n'
              + ' '.repeat(OFFSET + 0)
              + `])`
        }
      }
      case x[typebox.Kind] === 'Record': {
        const SINGLE_LINE = `${Type}.Record(${Type}.String(), ${x.patternProperties['^(.*)$']})`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Record(`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + `${Type}.String(),`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.patternProperties['^(.*)$']
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `)`
        }
      }
      case 'anyOf' in x: {
        const SINGLE_LINE = `${Type}.Union([${x.anyOf.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Union([`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.anyOf.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `])`
        }
      }
      case 'allOf' in x: {
        const SINGLE_LINE = `${Type}.Intersect([${x.allOf.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Intersect([`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.allOf.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `])`
        }
      }
      case x[typebox.Kind] === 'Tuple': {
        const SINGLE_LINE = `${Type}.Tuple([${x.items.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : `${Type}.Tuple([`
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.items.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + `])`
        }
      }
      case x[typebox.Kind] === 'Object': {
        const BODY = Object_entries(x.properties).map(([k, v]) => parseKey(k) + ': ' + v)
        if (BODY.length === 0) return `${Type}.Object({})`
        else {
          const SINGLE_LINE = `${Type}.Object({ ${BODY.join(', ')} })`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : `${Type}.Object({`
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
  })
}

export function stringFromTypebox(
  schema: typebox.TAnySchema,
  options?: Options,
  index?: t.Functor.Index
): string
export function stringFromTypebox(
  schema: typebox.TAnySchema,
  options: Options = defaults,
  index: t.Functor.Index = defaultIndex
): string {
  return stringFromTypebox_(options)(
    preprocessTypeboxSchema(schema, index),
    index,
  )
}
