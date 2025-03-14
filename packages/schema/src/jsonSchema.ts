import type * as T from './registry.js'

import { fn, has, symbol } from './registry.js'
import * as core from './core.js'

export type {
  Unary,
  Free,
}

export {
  Functor,
}

export {
  NeverJsonSchema,
  UnknownJsonSchema,
  AnyJsonSchema,
  VoidJsonSchema,
  UndefinedJsonSchema,
  NullJsonSchema,
  SymbolJsonSchema,
  BooleanJsonSchema,
  BigIntJsonSchema,
  IntegerJsonSchema,
  NumberJsonSchema,
  StringJsonSchema,
  EqJsonSchema,
  OptionalJsonSchema,
  ArrayJsonSchema,
  RecordJsonSchema,
  TupleJsonSchema,
  UnionJsonSchema,
  IntersectJsonSchema,
  ObjectJsonSchema,
}

export const RAW = {
  any: { type: 'object', properties: {}, nullable: true } satisfies JsonSchema_any,
  null: { type: 'null', enum: [null] satisfies [any] } satisfies JsonSchema_null,
  boolean: { type: 'boolean' } satisfies JsonSchema_boolean,
  integer: { type: 'integer' } satisfies JsonSchema_integer,
  number: { type: 'number' } satisfies JsonSchema_number,
  string: { type: 'string' } satisfies JsonSchema_string,
}

/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
type IndexOfFirstOptional<I, MaxDepth, Z extends 1[] = []>
  = Z['length'] extends MaxDepth ? I
  : `${Z['length']}` extends I ? Z['length']
  : IndexOfFirstOptional<I, MaxDepth, [...Z, 1]>

export type MinItems<
  T,
  U = { [I in keyof T]: T[I] extends OptionalJsonSchema<any> ? I : never },
  V = Extract<T[number & keyof T], { [symbol.optional]: any }>,
> = [V] extends [never] ? T['length' & keyof T] : IndexOfFirstOptional<U[number & keyof U], T['length' & keyof T]>

export function minItems<T extends readonly unknown[], Min = MinItems<T>>(xs: T): Min
export function minItems(xs: unknown[]): number {
  const len = xs.length
  for (let ix = 0; ix < len; ix++) {
    const x = xs[ix]
    if (has('jsonSchema', symbol.optional)(x)) return ix
  }
  return xs.length as never
}

type RequiredKeys<
  T,
  _K extends keyof T = keyof T,
  _Req = _K extends _K ? T[_K]['jsonSchema' & keyof T[_K]] extends { [symbol.optional]: number } ? never : _K : never
> = [_Req] extends [never] ? [] : _Req[]

const hasSchema = has('jsonSchema')
const getSchema = (u: unknown) => hasSchema(u) ? u.jsonSchema : u

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

/* * * * * * * * * * * * * * * * * * *
 *                                   *
 *   no JSON Schema representation   *
 *                                   *
 * * * * * * * * * * * * * * * * * * */

interface NeverJsonSchema { get jsonSchema(): undefined }
const NeverJsonSchema: NeverJsonSchema = { get jsonSchema() { return void 0 } }
interface VoidJsonSchema { get jsonSchema(): undefined }
const VoidJsonSchema: VoidJsonSchema = { get jsonSchema() { return void 0 } }
interface UndefinedJsonSchema { get jsonSchema(): undefined }
const UndefinedJsonSchema: UndefinedJsonSchema = { get jsonSchema() { return void 0 } }
interface SymbolJsonSchema { get jsonSchema(): undefined }
const SymbolJsonSchema: SymbolJsonSchema = { get jsonSchema() { return void 0 } }
interface BigIntJsonSchema { get jsonSchema(): undefined }
const BigIntJsonSchema: BigIntJsonSchema = { get jsonSchema() { return void 0 } }

export { JsonSchema_any as isAny }
export { JsonSchema_any as isUnknown }
interface JsonSchema_any { type: 'object', properties: {}, nullable: true }
const JsonSchema_any = core.object({ type: core.eq('object'), properties: core.object({}), nullable: core.eq(true) })

export { JsonSchema_null as isNull }
interface JsonSchema_null { type: 'null', enum: [null] }
const JsonSchema_null = core.object({ type: core.eq('null'), enum: core.tuple(core.eq(null)) })

export { JsonSchema_boolean as isBoolean }
interface JsonSchema_boolean { type: 'boolean' }
const JsonSchema_boolean = core.object({ type: core.eq('boolean') })

export { JsonSchema_integer as isInteger }
interface JsonSchema_integer { type: 'integer' }
const JsonSchema_integer = core.object({ type: core.eq('integer') })

export { JsonSchema_number as isNumber }
interface JsonSchema_number { type: 'number' }
const JsonSchema_number = core.object({ type: core.eq('number') })

export { JsonSchema_string as isString }
interface JsonSchema_string { type: 'string' }
const JsonSchema_string = core.object({ type: core.eq('string') })

export { JsonSchema_const as isConst }
interface JsonSchema_const<T> { const: T }
const JsonSchema_const = core.object({ const: core.unknown })

export { JsonSchema_enum as isEnum }
interface JsonSchema_enum<T> { enum: readonly T[] }
const JsonSchema_enum = core.object({ enum: core.array(core.unknown, 'readonly') })

export { JsonSchema_array as isArray }
interface JsonSchema_array<T> { type: 'array', items: T }
const JsonSchema_array = core.object({ type: (u) => u === 'array', items: core.unknown })

export { JsonSchema_record as isRecord }
interface JsonSchema_record<T = unknown> { type: 'object', additionalProperties: T }
const JsonSchema_record = <T>(u: unknown): u is JsonSchema_record<T> => JsonSchema_record_(u)
const JsonSchema_record_ = core.object({
  type: core.eq('object'),
  additionalProperties: core.unknown,
})

export { JsonSchema_union as isAnyOf }
interface JsonSchema_union<T = unknown> { anyOf: T }
const JsonSchema_union_ = core.object({ anyOf: core.array(core.unknown, 'readonly') })
const JsonSchema_union = core.inline((u): u is JsonSchema_union => JsonSchema_union_(u))

export { JsonSchema_intersect as isAllOf }
interface JsonSchema_intersect<T = unknown> { allOf: T }
const JsonSchema_intersect_ = core.object({ allOf: core.array(core.unknown, 'readonly') })
const JsonSchema_intersect = core.inline((u): u is JsonSchema_intersect => JsonSchema_intersect_(u))

export { JsonSchema_object as isObject }
interface JsonSchema_object<T> {
  type: 'object'
  required: string[], properties: T
}
const JsonSchema_object = core.object({
  type: core.eq('object'),
  required: core.array(core.string),
  properties: core.unknown,
})

export { JsonSchema_tuple as isTuple }
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

const Unary = core.union(
  JsonSchema_array,
  JsonSchema_record,
  JsonSchema_union,
  JsonSchema_intersect,
  JsonSchema_tuple,
  JsonSchema_object,
)

interface Free extends T.HKT { [-1]: Unary<this[0]> }

type Unary<T> =
  | Nullary
  | JsonSchema_const<unknown>
  | JsonSchema_enum<unknown>
  | JsonSchema_array<T>
  | JsonSchema_record<T>
  | JsonSchema_union<readonly T[]>
  | JsonSchema_intersect<readonly T[]>
  | JsonSchema_tuple<readonly T[]>
  | JsonSchema_object<{ [x: string]: T }>
  ;

export type { JSONSchema as JsonSchema }
type JSONSchema<T = never> = [T] extends [never] ? JsonSchema : Unary<T>

type JsonSchema =
  | Nullary
  | JsonSchema_const<unknown>
  | JsonSchema_enum<unknown>
  | JsonSchema_array<JsonSchema>
  | JsonSchema_record<JsonSchema>
  | JsonSchema_union<readonly JsonSchema[]>
  | JsonSchema_intersect<readonly JsonSchema[]>
  | JsonSchema_tuple<readonly JsonSchema[]>
  | JsonSchema_object<{ [x: string]: JsonSchema }>
  ;


/* * * * * * * * *
 *                *
 *   data types   *
 *                *
  * * * * * * * * */

const AnyJsonSchema: AnyJsonSchema = { get jsonSchema() { return RAW.any } }
interface AnyJsonSchema { get jsonSchema(): typeof RAW.any }
const UnknownJsonSchema: UnknownJsonSchema = { get jsonSchema() { return RAW.any } }
interface UnknownJsonSchema { get jsonSchema(): typeof RAW.any }
const NullJsonSchema: NullJsonSchema = { get jsonSchema() { return RAW.null } }
interface NullJsonSchema { get jsonSchema(): typeof RAW.null }
const BooleanJsonSchema: BooleanJsonSchema = { get jsonSchema() { return RAW.boolean } }
interface BooleanJsonSchema { get jsonSchema(): typeof RAW.boolean }
const IntegerJsonSchema: IntegerJsonSchema = { get jsonSchema() { return RAW.integer } }
interface IntegerJsonSchema { get jsonSchema(): typeof RAW.integer }
const NumberJsonSchema: NumberJsonSchema = { get jsonSchema() { return RAW.number } }
interface NumberJsonSchema { get jsonSchema(): typeof RAW.number }
const StringJsonSchema: StringJsonSchema = { get jsonSchema() { return RAW.string } }
interface StringJsonSchema { get jsonSchema(): typeof RAW.string }

interface EqJsonSchema<S> { get jsonSchema(): { const: S } }
function EqJsonSchema<V>(value: V): EqJsonSchema<V>
function EqJsonSchema(value: unknown) {
  return {
    get jsonSchema() {
      return {
        const: value
      }
    }
  }
}

interface OptionalJsonSchema<S> {
  get jsonSchema(): S['jsonSchema' & keyof S] & { [symbol.optional]: number }
}

function OptionalJsonSchema<S>(x: S): OptionalJsonSchema<S>
function OptionalJsonSchema(x: unknown) {
  return {
    get jsonSchema() {
      return {
        ...hasSchema(x) && x.jsonSchema,
        [symbol.optional]: wrapOptional(x),
      }
    }
  }
}

interface ArrayJsonSchema<S> {
  get jsonSchema(): {
    type: 'array'
    items: S['jsonSchema' & keyof S]
  }
}

function ArrayJsonSchema<S>(schema: S): ArrayJsonSchema<S>
function ArrayJsonSchema(x: unknown) {
  return {
    get jsonSchema() {
      return {
        type: 'array',
        items: getSchema(x),
      }
    }
  }
}

interface RecordJsonSchema<S> {
  get jsonSchema(): {
    type: 'object'
    additionalProperties: S['jsonSchema' & keyof S]
  }
}
function RecordJsonSchema<S>(schema: S): RecordJsonSchema<S>
function RecordJsonSchema(x: unknown) {
  return {
    get jsonSchema() {
      return {
        type: 'object',
        additionalProperties: getSchema(x),
      }
    }
  }
}

interface UnionJsonSchema<S> {
  get jsonSchema(): {
    anyOf: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
  }
}

function UnionJsonSchema<S extends readonly unknown[]>(schemas: S): UnionJsonSchema<S>
function UnionJsonSchema(xs: unknown[]) {
  return {
    get jsonSchema() {
      return {
        anyOf: xs.map(getSchema)
      }
    }
  }
}

interface IntersectJsonSchema<S> {
  get jsonSchema(): {
    allOf: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
  }
}

function IntersectJsonSchema<S extends readonly unknown[]>(schemas: S): IntersectJsonSchema<S>
function IntersectJsonSchema(xs: unknown[]) {
  return {
    get jsonSchema() {
      return {
        allOf: xs.map(getSchema)
      }
    }
  }
}

interface TupleJsonSchema<S> {
  get jsonSchema(): {
    type: 'array',
    items: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
    additionalItems: false
    minItems: MinItems<S>
    maxItems: S['length' & keyof S]
  }
}

export function applyTupleOptionality(xs: readonly unknown[], { min, max }: { min: number, max: number }) {
  return min === max ? xs.map(getSchema) : [
    ...xs.slice(0, min).map(getSchema),
    ...xs.slice(min).map(getSchema),
  ]
}

function TupleJsonSchema<S extends readonly unknown[]>(schemas: readonly [...S]): TupleJsonSchema<S>
function TupleJsonSchema(xs: readonly unknown[]): TupleJsonSchema<any> {
  const min = minItems(xs)
  const max = xs.length
  return {
    get jsonSchema() {
      return {
        type: 'array' as const,
        additionalItems: false as const,
        items: applyTupleOptionality(xs, { min, max }),
        minItems: min as never,
        maxItems: max,
      }
    }
  }
}

interface ObjectJsonSchema<S, KS extends RequiredKeys<S> = RequiredKeys<S>> {
  get jsonSchema(): {
    type: 'object'
    required: { [I in keyof KS]: KS[I] & string }
    properties: { [K in keyof S]: S[K]['jsonSchema' & keyof S[K]] }
  }
}

function ObjectJsonSchema<S extends { [x: string]: unknown }>(schemas: S): ObjectJsonSchema<S>
function ObjectJsonSchema(xs: { [x: string]: unknown }) {
  const required = Object_keys(xs).filter(isRequired(xs))
  return {
    get jsonSchema() {
      return {
        type: 'object',
        required,
        properties: fn.map(xs, property(required)),
      }
    }
  }
}

const Functor: T.Functor<Free, JsonSchema> = {
  map(f) {
    type T = ReturnType<typeof f>
    return (x) => {
      switch (true) {
        default: return fn.exhaustive(x satisfies never)
        case Nullary(x): return x satisfies Unary<T>
        case JsonSchema_enum(x): return x satisfies Unary<T>
        case JsonSchema_const(x): return x satisfies Unary<T>
        case JsonSchema_union(x): return { ...x, anyOf: fn.map(x.anyOf, f) } satisfies Unary<T>
        case JsonSchema_intersect(x): return { ...x, allOf: fn.map(x.allOf, f) } satisfies Unary<T>
        case JsonSchema_tuple(x): return { ...x, items: fn.map(x.items, f) } satisfies Unary<T>
        case JsonSchema_array(x): return { ...x, items: f(x.items) } satisfies Unary<T>
        case JsonSchema_object(x): return { ...x, properties: fn.map(x.properties, f) } satisfies Unary<T>
        case JsonSchema_record(x): return { ...x, additionalProperties: f(x.additionalProperties) } satisfies Unary<T>
      }
    }
  },
}

export const fold = fn.cata(Functor)
export const unfold = fn.ana(Functor)
