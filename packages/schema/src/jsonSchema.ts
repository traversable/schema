import type * as T from './registry-types.js'

import { fn, has } from './registry.js'
import * as symbol from './symbol.js'
import * as core from './core.js'

export type {
  Unary,
  Free,
  JsonSchema,
}

export {
  Functor,
}

export {
  never_ as never,
  unknown_ as unknown,
  any_ as any,
  void_ as void,
  undefined_ as undefined,
  null_ as null,
  symbol_ as symbol,
  boolean_ as boolean,
  bigint_ as bigint,
  integer_ as integer,
  number_ as number,
  string_ as string,
  eq,
  optional,
  array,
  record,
  tuple,
  union,
  intersect,
  object_ as object,
}

const RAW = {
  any: { type: 'object', properties: {}, nullable: true } satisfies JsonSchema_any,
  null: { type: 'null', enum: [null] satisfies [any] } satisfies JsonSchema_null,
  boolean: { type: 'boolean' } satisfies JsonSchema_boolean,
  integer: { type: 'integer' } satisfies JsonSchema_integer,
  number: { type: 'number' } satisfies JsonSchema_number,
  string: { type: 'string' } satisfies JsonSchema_string,
}

/** @internal */
type Evaluate<T> = never | { [K in keyof T]: T[K] }

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
type IndexOfFirstOptional<I, MaxDepth, Z extends 1[] = []>
  = Z['length'] extends MaxDepth ? I
  : `${Z['length']}` extends I ? Z['length']
  : IndexOfFirstOptional<I, MaxDepth, [...Z, 1]>

type MinItems<
  T,
  V = Extract<T[number & keyof T], optional<any>>,
  U = { [I in keyof T]: T[I] extends optional<any> ? I : never }
> = [V] extends [never] ? T['length' & keyof T] : IndexOfFirstOptional<U[number & keyof U], T['length' & keyof T]>

function minItems<T extends readonly unknown[]>(xs: T): MinItems<T>
function minItems<T extends readonly unknown[]>(xs: T): MinItems<T> {
  const len = xs.length
  for (let ix = 0; ix < len; ix++) {
    const x = xs[ix]
    if (has('jsonSchema', symbol.optional)(x)) return ix as never
  }
  return xs.length as never
}

type RequiredKeys<T, Req = Exclude<keyof T, OptionalKeys<T>>> = [Req] extends [never] ? [] : Req[]

type OptionalKeys<
  T,
  K extends keyof T = keyof T,
  Opt = K extends K ? T[K] extends { [symbol.optional]: true } ? K : never : never
> = Opt

const isRequired = (v: { [x: string]: unknown }) => (k: string) => {
  if (!has('jsonSchema')(v[k])) return false
  const jsonSchema = v[k].jsonSchema
  if (!(jsonSchema && symbol.optional in jsonSchema)) return true
  const optional = jsonSchema[symbol.optional]
  if (typeof optional !== 'number') return true
  else return optional === 0
}

function wrapOptional(x: unknown) {
  return has('jsonSchema', symbol.optional, (u) => typeof u === 'number')(x)
    ? x.jsonSchema[symbol.optional] + 1
    : 1
}

function unwrapOptional(x: unknown) {
  if (has(symbol.optional, (u) => typeof u === 'number')(x)) {
    const opt = x[symbol.optional]
    if (opt === 1) delete (x as Partial<typeof x>)[symbol.optional]
    else x[symbol.optional]--
  }
  return x
}

function property(required: string[]) {
  return (x: unknown, k: string | number) => {
    if (!has('jsonSchema')(x)) return x
    else if (!required.includes(String(k))) return unwrapOptional(x.jsonSchema)
    else return x.jsonSchema
  }
}

const hasSchema = has('jsonSchema')
const schemaOf = (x: unknown) => has('jsonSchema')(x) ? x.jsonSchema : x

/* * * * * * * * * * * * * * * * * * *
 *                                   *
 *   no JSON Schema representation   *
 *                                   *
 * * * * * * * * * * * * * * * * * * */

interface never_ { jsonSchema: void }
const never_: never_ = { jsonSchema: void 0 }
interface void_ { jsonSchema: void }
const void_: void_ = { jsonSchema: void 0 }
interface undefined_ { jsonSchema: void }
const undefined_: undefined_ = { jsonSchema: void 0 }
interface symbol_ { jsonSchema: void }
const symbol_: symbol_ = { jsonSchema: void 0 }
interface bigint_ { jsonSchema: void }
const bigint_: bigint_ = { jsonSchema: void 0 }

interface JsonSchema_any { type: 'object', properties: {}, nullable: true }
const JsonSchema_any = core.object({ type: core.eq('object'), properties: core.object({}), nullable: core.eq(true) })

interface JsonSchema_null { type: 'null', enum: [null] }
const JsonSchema_null = core.object({ type: core.eq('null'), enum: core.tuple(core.eq(null)) })

interface JsonSchema_boolean { type: 'boolean' }
const JsonSchema_boolean = core.object({ type: core.eq('boolean') })

interface JsonSchema_integer { type: 'integer' }
const JsonSchema_integer = core.object({ type: core.eq('integer') })

interface JsonSchema_number { type: 'number' }
const JsonSchema_number = core.object({ type: core.eq('number') })

interface JsonSchema_string { type: 'string' }
const JsonSchema_string = core.object({ type: core.eq('string') })

interface JsonSchema_const<T = unknown> { const: T }
const JsonSchema_const = core.object({ const: core.unknown })

interface JsonSchema_enum<T = unknown> { enum: readonly T[] }
const JsonSchema_enum = core.object({ enum: core.array(core.unknown, 'readonly') })

interface JsonSchema_array<T> { type: 'array', items: T }
const JsonSchema_array = core.object({ type: core.eq('array'), items: core.unknown })

interface JsonSchema_record<T = unknown> { type: 'object', additionalProperties: T }
const JsonSchema_record = <T>(u: unknown): u is JsonSchema_record<T> => JsonSchema_record_(u)
const JsonSchema_record_ = core.object({
  type: core.eq('object'),
  additionalProperties: core.unknown,
})

interface JsonSchema_union<T = unknown> { anyOf: T }
const JsonSchema_union_ = core.object({ anyOf: core.array(core.unknown, 'readonly') })
const JsonSchema_union = core.inline((u): u is JsonSchema_union => JsonSchema_union_(u))

interface JsonSchema_intersect<T = unknown> { allOf: T }
const JsonSchema_intersect_ = core.object({ allOf: core.array(core.unknown, 'readonly') })
const JsonSchema_intersect = core.inline((u): u is JsonSchema_intersect => JsonSchema_intersect_(u))

/* * * * * * * * *
 *                *
 *   data types   *
 *                *
  * * * * * * * * */

const any_: any_ = { jsonSchema: RAW.any }
interface any_ { jsonSchema: typeof RAW.any }
const unknown_: unknown_ = { jsonSchema: RAW.any }
interface unknown_ { jsonSchema: typeof RAW.any }
const null_: null_ = { jsonSchema: RAW.null }
interface null_ { jsonSchema: typeof RAW.null }
const boolean_: boolean_ = { jsonSchema: RAW.boolean }
interface boolean_ { jsonSchema: typeof RAW.boolean }
const integer_: integer_ = { jsonSchema: RAW.integer }
interface integer_ { jsonSchema: typeof RAW.integer }
const number_: number_ = { jsonSchema: RAW.number }
interface number_ { jsonSchema: typeof RAW.number }
const string_: string_ = { jsonSchema: RAW.string }
interface string_ { jsonSchema: typeof RAW.string }

interface eq<S> { jsonSchema: Evaluate<JsonSchema_const<S>> }
function eq<V>(value: V): eq<V>
function eq(value: unknown) { return { jsonSchema: { const: value } } }

interface optional<S> { [symbol.optional]: true, jsonSchema: S['jsonSchema' & keyof S] }
function optional<S>(x: S): optional<S>
function optional(x: unknown) {
  return {
    jsonSchema: {
      ...hasSchema(x) && x,
      [symbol.optional]: wrapOptional(x),
    }
  }
}

interface array<S> { jsonSchema: Evaluate<JsonSchema_array<S['jsonSchema' & keyof S]>> }
function array<S>(schema: S): array<S>
function array(x: unknown) {
  return {
    jsonSchema: {
      type: 'array',
      items: schemaOf(x),
    },
  }
}

interface record<S> { jsonSchema: Evaluate<JsonSchema_record<S['jsonSchema' & keyof S]>> }
function record<S>(schema: S): record<S>
function record(x: unknown) {
  return {
    jsonSchema: {
      type: 'object',
      additionalProperties: schemaOf(x),
    },
  }
}

interface union<S> {
  jsonSchema: {
    anyOf: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
  }
}

function union<S extends readonly unknown[]>(schemas: S): union<S>
function union(xs: unknown[]) { return { jsonSchema: { anyOf: xs.map(schemaOf) } } }

interface intersect<S> {
  jsonSchema: {
    allOf: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
  }
}

function intersect<S extends readonly unknown[]>(schemas: S): intersect<S>
function intersect(xs: unknown[]) { return { jsonSchema: { allOf: xs.map(schemaOf) } } }

interface tuple<S> {
  jsonSchema: {
    type: 'array',
    items: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
    additionalItems: false
    minItems: MinItems<S>
    maxItems: S['length' & keyof S]
  }
}

function tuple<S extends readonly unknown[]>(schemas: readonly [...S]): tuple<S>
function tuple(xs: readonly unknown[]): tuple<any> {
  return {
    jsonSchema: {
      type: 'array',
      items: xs.map(schemaOf),
      minItems: minItems(xs) as never,
      maxItems: xs.length,
      additionalItems: false,
    }
  }
}

interface object_<S> {
  jsonSchema: {
    type: 'object'
    required: RequiredKeys<S>
    properties: { [K in keyof S]: S[K]['jsonSchema' & keyof S[K]] }
  }
}

function object_<S extends { [x: string]: unknown }>(schemas: S): object_<S>
function object_(xs: { [x: string]: unknown }) {
  const required = Object_keys(xs).filter(isRequired(xs))
  return {
    jsonSchema: {
      type: 'object',
      required,
      properties: fn.map(xs, property(required))
    }
  }
}


interface JsonSchema_object<T> {
  type: 'object'
  required: string[], properties: T
}

const JsonSchema_object = core.object({
  type: core.eq('object'),
  required: core.array(core.string),
  properties: core.unknown,
})

interface JsonSchema_tuple<T> {
  type: 'array'
  items: T
  minItems: number
  maxItems: number
  additionalItems: false
}

const JsonSchema_tuple = core.object({
  type: core.eq('array'),
  items: core.unknown,
  minItems: core.number,
  maxItems: core.number,
  additionalItems: core.eq(false),
})

const Nullary = core.union(
  JsonSchema_any,
  JsonSchema_null,
  JsonSchema_boolean,
  JsonSchema_integer,
  JsonSchema_number,
  JsonSchema_string,
)

type Nullary =
  | JsonSchema_any
  | JsonSchema_null
  | JsonSchema_boolean
  | JsonSchema_integer
  | JsonSchema_number
  | JsonSchema_string

// type Special =
//   | JsonSchema_enum
//   | JsonSchema_const

// const Special = core.union(
//   JsonSchema_enum,
//   JsonSchema_const,
// )

type Unary<T> =
  | Nullary
  | JsonSchema_const
  | JsonSchema_enum
  | JsonSchema_array<T>
  | JsonSchema_record<T>
  | JsonSchema_union<readonly T[]>
  | JsonSchema_intersect<readonly T[]>
  | JsonSchema_tuple<readonly T[]>
  | JsonSchema_object<{ [x: string]: T }>

const Unary = core.union(
  JsonSchema_array,
  JsonSchema_record,
  JsonSchema_union,
  JsonSchema_intersect,
  JsonSchema_tuple,
  JsonSchema_object,
)

type JsonSchema =
  | Nullary
  | JsonSchema_const
  | JsonSchema_enum
  | JsonSchema_array<JsonSchema>
  | JsonSchema_record<JsonSchema>
  | JsonSchema_union<readonly JsonSchema[]>
  | JsonSchema_intersect<readonly JsonSchema[]>
  | JsonSchema_tuple<readonly JsonSchema[]>
  | JsonSchema_object<{ [x: string]: JsonSchema }>

interface Free extends T.HKT { [-1]: Unary<this[0]> }

const Functor: T.Functor<Free, JsonSchema> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case Nullary(x): return x
        case JsonSchema_enum(x): return x
        case JsonSchema_const(x): return x
        case JsonSchema_union(x): return { ...x, anyOf: fn.map(x.anyOf, f) }
        case JsonSchema_intersect(x): return { ...x, allOf: fn.map(x.allOf, f) }
        case JsonSchema_tuple(x): return { ...x, items: fn.map(x.items, f) }
        case JsonSchema_array(x): return { ...x, items: f(x.items) }
        case JsonSchema_object(x): return { ...x, properties: fn.map(x.properties, f) }
        case JsonSchema_record(x): return { ...x, additionalProperties: f(x.additionalProperties) }
      }
    }
  },
}

// const fold = fn.cata(Functor)
// const unfold = fn.ana(Functor)
