import * as typebox from '@sinclair/typebox'
import type * as T from '@traversable/registry'

import { escape, fn, Number_isFinite, Number_isNatural, Number_isSafeInteger, Object_entries, omit, parseKey, URI } from '@traversable/registry'
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
  isProperty?: boolean
}

const defaultindex = { path: Array.of<keyof any>() } satisfies Index

export const fromJson = (options?: Options) => Json.fold<typebox.TSchema>((x) => {
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
})

export function stringFromJson(json: Json, options?: Options, index?: Json.Functor.Index): string
export function stringFromJson(json: Json, options: Options = defaults, index: Json.Functor.Index = Json.defaultIndex) {
  const $ = parseOptions(options)
  const { namespaceAlias: typebox, format: FORMAT, initialOffset: OFF, maxWidth: MAX_WIDTH } = $
  const { depth } = index
  return Json.foldWithIndex<string>((x) => {
    const OFFSET = OFF + depth * 2
    const JOIN = ',\n' + '  '.repeat(depth + 1)
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
              : `${typebox}.object({`
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
  })(json, index)
}

export function fromTraversable(options?: Options): <S extends t.Schema>(schema: S) => typebox.TAnySchema
export function fromTraversable(options?: Options) {
  return t.fold<typebox.TAnySchema>((x) => {
    const $ = parseOptions(options)
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.eq: return fromJson($)(x.def as never)
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
      case x.tag === URI.optional: return typebox.Optional(typebox.Union([x.def, typebox.Undefined()]))
      case x.tag === URI.record: return typebox.Record(typebox.String(), x.def)
      case x.tag === URI.union: return typebox.Union(x.def)
      case x.tag === URI.intersect: return typebox.Intersect([...x.def])
      case x.tag === URI.tuple: return typebox.Tuple(x.def)
      case x.tag === URI.object: return typebox.Object(x.def)
    }
  })
}

export function stringFromTraversable(schema: t.Schema, options?: Options, index?: t.Functor.Index): string
export function stringFromTraversable(
  schema: t.Schema,
  options: Options = defaults,
  index: t.Functor.Index = defaultIndex,
): string {
  return t.foldWithIndex<string>((x, ix) => {
    const $ = parseOptions(options)
    const { namespaceAlias: typebox, format: FORMAT, initialOffset: OFF, maxWidth: MAX_WIDTH } = $
    const { depth } = index
    const OFFSET = OFF + depth * 2
    const JOIN = ',\n' + '  '.repeat(depth + 1)
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.eq: { return stringFromJson(x.def as never, { ...$, initialOffset: OFFSET }) }
      case x.tag === URI.never: return `${typebox}.Never()`
      case x.tag === URI.unknown: return `${typebox}.Unknown()`
      case x.tag === URI.any: return `${typebox}.Any()`
      case x.tag === URI.void: return `${typebox}.Void()`
      case x.tag === URI.null: return `${typebox}.Null()`
      case x.tag === URI.undefined: return `${typebox}.Undefined()`
      case x.tag === URI.symbol: return `${typebox}.Symbol()`
      case x.tag === URI.boolean: return `${typebox}.Boolean()`
      case x.tag === URI.bigint: {
        const BOUNDS = [
          typeof x.minimum === 'bigint' ? `minimum: ${x.minimum}` : null,
          typeof x.maximum === 'bigint' ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        return `${typebox}.BigInt(${BOUNDS.length === 0 ? '' : `{ ${BOUNDS.join(', ')} }`})`
      }
      case x.tag === URI.integer: {
        const BOUNDS = [
          Number_isSafeInteger(x.minimum) ? `minimum: ${x.minimum}` : null,
          Number_isSafeInteger(x.maximum) ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        return `${typebox}.Integer(${BOUNDS.length === 0 ? '' : `{ ${BOUNDS.join(', ')} }`})`
      }
      case x.tag === URI.number: {
        const BOUNDS = [
          Number_isFinite(x.exclusiveMinimum) ? `exclusiveMinimum: ${x.exclusiveMinimum}` : null,
          Number_isFinite(x.exclusiveMaximum) ? `exclusiveMaximum: ${x.exclusiveMaximum}` : null,
          Number_isFinite(x.minimum) ? `minimum: ${x.minimum}` : null,
          Number_isFinite(x.maximum) ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        return `${typebox}.Number(${BOUNDS.length === 0 ? '' : `{ ${BOUNDS.join(', ')} }`})`
      }
      case x.tag === URI.string: {
        const BOUNDS = [
          Number_isNatural(x.minLength) ? `minLength: ${x.minLength}` : null,
          Number_isNatural(x.maxLength) ? `maxLength: ${x.maxLength}` : null,
        ].filter((_) => _ !== null)
        return `${typebox}.String(${BOUNDS.length === 0 ? '' : `{ ${BOUNDS.join(', ')} }`})`
      }
      case x.tag === URI.array: {
        let bounds = [
          Number_isNatural(x.minLength) ? `minimum: ${x.minLength}` : null,
          Number_isNatural(x.maxLength) ? `maximum: ${x.maxLength}` : null,
        ].filter((_) => _ !== null)
        const BOUNDS = bounds.length === 0 ? '' : `, { ${bounds.join(', ')} }`
        const SINGLE_LINE = `${typebox}.Array(${x.def}${BOUNDS})`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : SINGLE_LINE
        }
      }
      case x.tag === URI.optional: {
        const SINGLE_LINE = `${typebox}.Optional(${typebox}.Union([${x.def}, ${typebox}.Undefined()]))`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : SINGLE_LINE
        }
      }
      case x.tag === URI.record: {
        const SINGLE_LINE = `${typebox}.Record(${typebox}.String(), ${x.def})`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : SINGLE_LINE
        }
      }
      case x.tag === URI.tuple: {
        const SINGLE_LINE = `${typebox}.Tuple([${x.def.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : SINGLE_LINE
        }
      }
      case x.tag === URI.union: {
        const SINGLE_LINE = `${typebox}.Union([${x.def.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : SINGLE_LINE
        }
      }
      case x.tag === URI.intersect: {
        const SINGLE_LINE = `${typebox}.Intersect([${x.def.join(', ')}])`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : SINGLE_LINE
        }
      }
      case x.tag === URI.object: {
        const BODY = Object.entries(x.def).map(([k, v]) => `"${parseKey(k)}": ${v}`)
        if (BODY.length === 0) return `${typebox}.Object({})`
        else {
          const SINGLE_LINE = `${typebox}.Object({ ${BODY.join(', ')} })`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTI_LINE
              ? SINGLE_LINE
              : SINGLE_LINE
          }
        }
      }
    }
  })(schema, index)
}

declare namespace Type {
  namespace Integer { interface Bounds { minimum?: number, maximum?: number } }
  namespace BigInt { interface Bounds { minimum?: bigint, maximum?: bigint } }
  namespace String { interface Bounds { minLength?: number, maxLength?: number } }
  namespace Array { interface Bounds { minItems?: number, maxItems?: number } }
  namespace Number { interface Bounds { exclusiveMinimum?: number, exclusiveMaximum?: number, minimum?: number, maximum?: number } }

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
  interface BigInt extends BigInt.Bounds { [typebox.Kind]: 'BigInt' }
  interface Number extends Number.Bounds { [typebox.Kind]: 'Number' }
  interface String extends String.Bounds { [typebox.Kind]: 'String' }
  interface Array<S> extends Array.Bounds { [typebox.Kind]: 'Array', items: S }
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
    || x[typebox.Kind] === 'Bigint'
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
        case x[typebox.Kind] === 'Optional': return { ...x, schema: f(x.schema) }
        case x[typebox.Kind] === 'Array': return { ...x, items: f(x.items) }
        case x[typebox.Kind] === 'Record': return { ...x, patternProperties: fn.map(x.patternProperties, f) }
        case x[typebox.Kind] === 'Tuple': return { ...x, items: fn.map(x.items, f) }
        case x[typebox.Kind] === 'Object': return { ...x, properties: fn.map(x.properties, f) }
        case 'anyOf' in x: return { ...x, anyOf: fn.map(x.anyOf, f) }
        case 'allOf' in x: return { ...x, allOf: fn.map(x.allOf, f) }
      }
    }
  },
  mapWithIndex(f) {
    return (x, ix) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case isNullary(x): return x
        case x[typebox.Kind] === 'Optional': return { ...x, schema: f(x.schema, ix) }
        case x[typebox.Kind] === 'Array': return { ...x, items: f(x.items, ix) }
        case x[typebox.Kind] === 'Record': return { ...x, patternProperties: fn.map(x.patternProperties, (v) => f(v, ix)) }
        case x[typebox.Kind] === 'Tuple': return { ...x, items: fn.map(x.items, (v, i) => f(v, { path: [...ix.path, i], isProperty: false })) }
        case x[typebox.Kind] === 'Object': return { ...x, properties: fn.map(x.properties, (v, k) => f(v, { path: [...ix.path, k], isProperty: true })) }
        case 'anyOf' in x: return { ...x, anyOf: fn.map(x.anyOf, (v) => f(v, ix)) }
        case 'allOf' in x: return { ...x, allOf: fn.map(x.allOf, (v) => f(v, ix)) }
      }
    }
  }
}

const fold = fn.cataIx(Functor)

const preprocessTypeboxSchema
  : <T>(schema: typebox.TAnySchema, ix: Index) => Type.F<T>
  = <never>fold((schema) => (!(typebox.OptionalKind in schema) ? schema : { [typebox.Kind]: 'Optional', schema }) as never)

function stringFromTypebox_(options?: Options): T.IndexedAlgebra<Index, Type.Free, string> {
  const $ = parseOptions(options)
  const { namespaceAlias: Type } = $
  return fold((x, ix) => {
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
        const BOUNDS = [
          Number_isSafeInteger(x.minimum) ? `minimum: ${x.minimum}` : null,
          Number_isSafeInteger(x.maximum) ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        return `${Type}.Integer({ ${BOUNDS.join(', ')} })`
      }
      case x[typebox.Kind] === 'BigInt': {
        const BOUNDS = [
          typeof x.minimum === 'bigint' ? `minimum: ${x.minimum}` : null,
          typeof x.maximum === 'bigint' ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        return `${Type}.BigInt(${BOUNDS.length === 0 ? '' : `{ ${BOUNDS.join(', ')} }`})`
      }
      case x[typebox.Kind] === 'Number': {
        const BOUNDS = [
          Number_isFinite(x.exclusiveMinimum) ? `exclusiveMinimum: ${x.exclusiveMinimum}` : null,
          Number_isFinite(x.exclusiveMaximum) ? `exclusiveMaximum: ${x.exclusiveMaximum}` : null,
          Number_isFinite(x.minimum) ? `minimum: ${x.minimum}` : null,
          Number_isFinite(x.maximum) ? `maximum: ${x.maximum}` : null,
        ].filter((_) => _ !== null)
        return `${Type}.Number(${BOUNDS.length === 0 ? '' : `{ ${BOUNDS.join(', ')} }`})`
      }
      case x[typebox.Kind] === 'String': {
        const BOUNDS = [
          Number_isNatural(x.minLength) ? `minLength: ${x.minLength}` : null,
          Number_isNatural(x.maxLength) ? `maxLength: ${x.maxLength}` : null,
        ].filter((_) => _ !== null)
        return `${Type}.String(${BOUNDS.length === 0 ? '' : `{ ${BOUNDS.join(', ')} }`})`
      }
      case x[typebox.Kind] === 'Array': {
        const BOUNDS = [
          Number_isNatural(x.minItems) ? `minimum: ${x.minItems}` : null,
          Number_isNatural(x.maxItems) ? `maximum: ${x.maxItems}` : null,
        ].filter((_) => _ !== null)
        return `${Type}.Array(${x.items}${BOUNDS.length === 0 ? '' : `, { ${BOUNDS.join(', ')} }`})`
      }
      case x[typebox.Kind] === 'Optional': return ix.isProperty ? `${Type}.Optional(${x.schema})` : `${Type}.Union([${x.schema}, ${Type}.Undefined()])`
      case x[typebox.Kind] === 'Record': return `${Type}.Record(${Type}.String(), ${x.patternProperties['^(.*)$']})`
      case 'anyOf' in x: return `${Type}.Union([${x.anyOf.join(', ')}])`
      case 'allOf' in x: return `${Type}.Intersect([${x.allOf.join(', ')}])`
      case x[typebox.Kind] === 'Tuple': return `${Type}.Tuple([${x.items.join(', ')}])`
      case x[typebox.Kind] === 'Object': {
        const xs = Object_entries(x.properties).map(([k, v]) => parseKey(k) + ': ' + v)
        return `${Type}.Object(${xs.length === 0 ? '{}' : `{ ${xs.join(', ')} }`})`
      }
    }
  })
}

export function stringFromTypebox(options?: Options) {
  return (schema: typebox.TAnySchema) => stringFromTypebox_(options)(preprocessTypeboxSchema(schema, defaultindex), defaultindex)
}
