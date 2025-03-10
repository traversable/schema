import { fn, has, symbol } from '@traversable/registry'
import { JsonSchema } from './spec.js'

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

/** @internal */
type Evaluate<T> = never | { [K in keyof T]: T[K] }

/** @internal */
type RequiredKeys<T, Req = Exclude<keyof T, OptionalKeys<T>>> = [Req] extends [never] ? [] : Req[]

/** @internal */
type OptionalKeys<
  T,
  K extends keyof T = keyof T,
  Opt = K extends K ? T[K] extends { [symbol.optional]: true } ? K : never : never
> = Opt

/** @internal */
type MinItems<
  T extends readonly unknown[],
  V = Extract<T[number], optional<any>>,
  U = { [I in keyof T]: T[I] extends optional<any> ? I : never }
> = [V] extends [never] ? T['length'] : IndexOfFirstOptional<U[number & keyof U], T['length']>

/** @internal */
type IndexOfFirstOptional<I, MaxDepth extends number, Z extends 1[] = []>
  = Z['length'] extends MaxDepth ? I
  : `${Z['length']}` extends I ? Z['length']
  : IndexOfFirstOptional<I, MaxDepth, [...Z, 1]>

export function indexOfFirstOptional<T extends readonly unknown[]>(xs: T) {
  const len = xs.length
  for (let ix = 0; ix < len; ix++) {
    const x = xs[ix]
    // console.log('x', x)
    if (has('jsonSchema', symbol.optional)(x)) return ix
  }
  return xs.length
}

/** @internal */
const isNumber = (u: unknown) => typeof u === 'number'

/** @internal */
const Object_keys = globalThis.Object.keys

const isRequired = (v: { [x: string]: unknown }) => (k: string) => {
  if (!has('jsonSchema')(v[k])) return false
  const jsonSchema = v[k].jsonSchema
  if (!(jsonSchema && symbol.optional in jsonSchema)) return true
  const optional = jsonSchema[symbol.optional]
  if (typeof optional !== 'number') return true
  else return optional === 0
}

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

/* * * * * * * * * 
 *                *
 *   data types   *
 *                *
  * * * * * * * * */

const any_: any_ = { jsonSchema: JsonSchema.raw.any }
interface any_ { jsonSchema: typeof JsonSchema.raw.any }
const unknown_: unknown_ = { jsonSchema: JsonSchema.raw.any }
interface unknown_ { jsonSchema: typeof JsonSchema.raw.any }
const null_: null_ = { jsonSchema: JsonSchema.raw.null }
interface null_ { jsonSchema: typeof JsonSchema.raw.null }
const boolean_: boolean_ = { jsonSchema: JsonSchema.raw.boolean }
interface boolean_ { jsonSchema: typeof JsonSchema.raw.boolean }
const integer_: integer_ = { jsonSchema: JsonSchema.raw.integer }
interface integer_ { jsonSchema: typeof JsonSchema.raw.integer }
const number_: number_ = { jsonSchema: JsonSchema.raw.number }
interface number_ { jsonSchema: typeof JsonSchema.raw.number }
const string_: string_ = { jsonSchema: JsonSchema.raw.string }
interface string_ { jsonSchema: typeof JsonSchema.raw.string }

interface eq<S> { jsonSchema: Evaluate<JsonSchema.const<S>> }
function eq<V>(value: V): eq<V>
function eq(value: unknown) { return { jsonSchema: { const: value } } }

interface optional<S> { [symbol.optional]: true, jsonSchema: S['jsonSchema' & keyof S] }
function optional<S>(x: S): optional<S>
function optional(x: unknown) {
  return {
    jsonSchema: {
      ...has('jsonSchema')(x) && x,
      [symbol.optional]: has('jsonSchema', symbol.optional, isNumber)(x)
        ? x.jsonSchema[symbol.optional] + 1
        : 1,
    }
  }
}

interface array<S> { jsonSchema: Evaluate<JsonSchema.array<S['jsonSchema' & keyof S]>> }
function array<S>(schema: S): array<S>
function array(x: unknown) {
  return {
    jsonSchema: {
      type: 'array',
      items: has('jsonSchema')(x) ? x.jsonSchema : x,
    },
  }
}

interface record<S> { jsonSchema: Evaluate<JsonSchema.record<S['jsonSchema' & keyof S]>> }
function record<S>(schema: S): record<S>
function record(schema: unknown) {
  return {
    jsonSchema: {
      type: 'object',
      additionalProperties: has('jsonSchema')(schema) ? schema.jsonSchema : schema
    },
  }
}

interface union<S extends readonly unknown[]> {
  jsonSchema: {
    anyOf: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
  }
}

function union<S extends readonly unknown[]>(schemas: S): union<S>
function union(xs: unknown[]) {
  return {
    jsonSchema: {
      anyOf: xs.map((x) => has('jsonSchema')(x) ? x.jsonSchema : x)
    }
  }
}

interface intersect<S extends readonly unknown[]> {
  jsonSchema: {
    allOf: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
  }
}

function intersect<S extends readonly unknown[]>(schemas: S): intersect<S>
function intersect(xs: unknown[]) {
  return {
    jsonSchema: {
      allOf: xs.map((x) => has('jsonSchema')(x) ? x.jsonSchema : x)
    }
  }
}

interface tuple<S extends readonly unknown[]> {
  jsonSchema: {
    type: 'array',
    items: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
    additionalItems: false
    minItems: MinItems<S>
    maxItems: S['length' & keyof S]
  }
}

function tuple<S extends readonly unknown[]>(schemas: readonly [...S]): tuple<S>
function tuple(xs: readonly unknown[]) {
  return {
    jsonSchema: {
      type: 'array',
      items: xs.map((x) => has('jsonSchema')(x) ? x.jsonSchema : x),
      minItems: xs.length,
      maxItems: xs.length,
      additionalItems: false,
    }
  }
}

interface object_<S extends { [x: string]: unknown }> {
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
      properties: fn.map(xs, (x, k) => {
        if (!has('jsonSchema')(x)) return x
        const js = x.jsonSchema
        if (!required.includes(String(k))) {
          const opt = (js as any)[symbol.optional]
          return (
            void (
              opt === 1
                ? delete (js as any)[symbol.optional]
                : (js as any)[symbol.optional]--
            ),
            js
          )
        }
        return x.jsonSchema
      })
    }
  }
}

