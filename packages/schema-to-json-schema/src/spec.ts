import type { HKT, newtype } from '@traversable/registry'
import { symbol } from '@traversable/registry'
import { t } from '@traversable/schema-core'

const RAW = {
  any: { type: 'object', properties: {}, nullable: true } satisfies JsonSchema_any,
  null: { type: 'null', enum: [null] satisfies [any] } satisfies JsonSchema_null,
  boolean: { type: 'boolean' } satisfies JsonSchema_boolean,
  integer: { type: 'integer' } satisfies JsonSchema_integer,
  number: { type: 'number' } satisfies JsonSchema_number,
  string: { type: 'string' } satisfies JsonSchema_string,
}


interface JsonSchema_any { type: 'object', properties: {}, nullable: true }
const JsonSchema_any = t.object({ type: t.eq('object'), properties: t.object({}), nullable: t.eq(true) })

interface JsonSchema_null { type: 'null', enum: [null] }
const JsonSchema_null = t.object({ type: t.eq('null'), enum: t.tuple(t.eq(null)) })

interface JsonSchema_boolean { type: 'boolean' }
const JsonSchema_boolean = t.object({ type: t.eq('boolean') })

interface JsonSchema_integer { type: 'integer' }
const JsonSchema_integer = t.object({ type: t.eq('integer') })

interface JsonSchema_number { type: 'number' }
const JsonSchema_number = t.object({ type: t.eq('number') })

interface JsonSchema_string { type: 'string' }
const JsonSchema_string = t.object({ type: t.eq('string') })

interface JsonSchema_const<T = unknown> { const: T }
const JsonSchema_const = t.object({ const: t.unknown })

interface JsonSchema_enum<T = unknown> { enum: readonly T[] }
const JsonSchema_enum = t.object({ enum: t.array(t.unknown, 'readonly') })

interface JsonSchema_array<T> { type: 'array', items: T }
const JsonSchema_array = t.object({ type: t.eq('array'), items: t.unknown })

interface JsonSchema_record<T = unknown> { type: 'object', additionalProperties: T }
const JsonSchema_record_ = t.object({
  type: t.eq('object'),
  additionalProperties: t.unknown,
})

const JsonSchema_record = <T>(u: unknown): u is JsonSchema_record<T> => JsonSchema_record_(u)

interface JsonSchema_union<T = unknown> { anyOf: T }
const JsonSchema_union_ = t.object({ anyOf: t.array.fix(t.unknown) })
const JsonSchema_union = t.inline((u): u is JsonSchema_union => JsonSchema_union_(u))

interface JsonSchema_intersect<T = unknown> { allOf: T }
const JsonSchema_intersect_ = t.object({ allOf: t.array(t.unknown, 'readonly') })
const JsonSchema_intersect = t.inline((u): u is JsonSchema_intersect => JsonSchema_intersect_(u))

interface JsonSchema_object<T> { type: 'object', required: string[], properties: T }
const JsonSchema_object = t.object({
  type: t.eq('object'),
  required: t.array(t.string),
  properties: t.unknown,
})

interface JsonSchema_tuple<T> {
  type: 'array'
  items: T
  minItems: number
  maxItems: number
  additionalItems: false
}

const JsonSchema_tuple = t.object({
  type: t.eq('array'),
  items: t.unknown,
  minItems: t.number,
  maxItems: t.number,
  additionalItems: t.eq(false),
})

type Nullary =
  | JsonSchema_any
  | JsonSchema_null
  | JsonSchema_boolean
  | JsonSchema_integer
  | JsonSchema_number
  | JsonSchema_string

type Unary<T> =
  | Nullary
  | JsonSchema_const
  | JsonSchema_enum
  // | JsonSchema_optional<Fixpoint>
  | JsonSchema_array<T>
  | JsonSchema_record<T>
  | JsonSchema_union<readonly T[]>
  | JsonSchema_intersect<readonly T[]>
  | JsonSchema_tuple<readonly T[]>
  | JsonSchema_object<{ [x: string]: T }>

type Fixpoint =
  | Nullary
  | JsonSchema_const
  | JsonSchema_enum
  // | JsonSchema_optional<Fixpoint>
  | JsonSchema_array<Fixpoint>
  | JsonSchema_record<Fixpoint>
  | JsonSchema_union<readonly Fixpoint[]>
  | JsonSchema_intersect<readonly Fixpoint[]>
  | JsonSchema_tuple<readonly Fixpoint[]>
  | JsonSchema_object<{ [x: string]: Fixpoint }>

interface Free extends HKT { [-1]: Unary<this[0]> }

const Nullary = t.union(
  JsonSchema_any,
  JsonSchema_null,
  JsonSchema_boolean,
  JsonSchema_integer,
  JsonSchema_number,
  JsonSchema_string,
)

const Special = t.union(
  JsonSchema_enum,
  JsonSchema_const,
)

const Unary = t.union(
  JsonSchema_array,
  JsonSchema_record,
  JsonSchema_union,
  JsonSchema_intersect,
  JsonSchema_tuple,
  JsonSchema_object,
)

// const is = {
//   null: JsonSchema_null,
//   boolean: JsonSchema_boolean,
//   integer: JsonSchema_integer,
//   number: JsonSchema_number,
//   string: JsonSchema_string,
//   array: JsonSchema_array,
//   record: JsonSchema_record,
//   union: JsonSchema_union,
//   interesect: JsonSchema_intersect,
//   tuple: JsonSchema_tuple,
//   object: JsonSchema_object,

//   nullary: isNullary,
//   leaf: isLeaf,
// } as const

/*
const JsonSchema_Functor: Functor<JsonSchema_lambda, JsonSchema> = {
  map(f) {
    return (x) => {
      switch (true) {
        default: return fn.softExhaustiveCheck(x)
        case JsonSchema_is.$ref(x): return fn.throw('[JsonSchema.Functor::$ref]: Unimplemented')
        case JsonSchema_is.enum(x): return { enum: x.enum }
        case JsonSchema_is.const(x): return { const: x }
        case JsonSchema_is.scalar(x): return x
        case JsonSchema_is.array(x): return { ...x, items: f(x.items) }
        case JsonSchema_is.allOf(x): return { ...x, allOf: x.allOf.map(f) }
        case JsonSchema_is.anyOf(x): return { ...x, anyOf: x.anyOf.map(f) }
        case JsonSchema_is.oneOf(x): return  { ...x, oneOf: x.oneOf.map(f) }
        case JsonSchema_is.object(x): {
          const { additionalProperties: aprops, properties: props, ...y } = x
          const p = Object_entries(props).map(([k, v]) => [k, f(v)] satisfies [string, any])
          const a = aprops ? f(aprops) : null
          return {
            ...y,
            properties: Object.fromEntries(p),
            ...a && { additionalProperties: a },
          }
        }
      }
    }
  }
}
*/

export declare namespace JsonSchema {
  export {
    /* data types */
    JsonSchema_any as any,
    JsonSchema_null as null,
    JsonSchema_boolean as boolean,
    JsonSchema_integer as integer,
    JsonSchema_number as number,
    JsonSchema_string as string,
    JsonSchema_const as const,
    JsonSchema_enum as enum,
    JsonSchema_array as array,
    JsonSchema_record as record,
    JsonSchema_union as union,
    JsonSchema_intersect as intersect,
    JsonSchema_object as object,
    JsonSchema_tuple as tuple,
    /* types */
    Fixpoint,
    Free,
    /* terms */
    Nullary,
    Unary,
    Special,
  }
}

export namespace JsonSchema { export const raw = RAW }
export const any = JsonSchema_any
JsonSchema.null = JsonSchema_null
JsonSchema.boolean = JsonSchema_boolean
JsonSchema.integer = JsonSchema_integer
JsonSchema.number = JsonSchema_number
JsonSchema.string = JsonSchema_string
JsonSchema.any = JsonSchema_any

JsonSchema.enum = JsonSchema_enum
JsonSchema.const = JsonSchema_const
JsonSchema.array = JsonSchema_array
JsonSchema.record = JsonSchema_record

JsonSchema.union = JsonSchema_union
JsonSchema.intersect = JsonSchema_intersect

JsonSchema.tuple = JsonSchema_tuple
JsonSchema.object = JsonSchema_object


JsonSchema.Nullary = Nullary
JsonSchema.Unary = Unary
JsonSchema.Special = Special

