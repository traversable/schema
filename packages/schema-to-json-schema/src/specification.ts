import type { HKT } from '@traversable/registry'
import { t } from '@traversable/schema'

export const RAW = {
  any: { type: 'object', properties: {}, nullable: true } satisfies JsonSchema_any,
  null: { type: 'null', enum: [null] satisfies [any] } satisfies JsonSchema_null,
  boolean: { type: 'boolean' } satisfies JsonSchema_boolean,
  integer: { type: 'integer' } satisfies JsonSchema_integer,
  number: { type: 'number' } satisfies JsonSchema_number,
  string: { type: 'string' } satisfies JsonSchema_string,
}

interface JsonSchema_any { type: 'object', properties: {}, nullable: true }
const JsonSchema_any = t.eq(RAW.any)

interface JsonSchema_null { type: 'null', enum: [null] }
const JsonSchema_null = t.eq(RAW.null)

interface JsonSchema_boolean { type: 'boolean' }
const JsonSchema_boolean = t.eq(RAW.boolean)

interface JsonSchema_integer { type: 'integer' }
const JsonSchema_integer = t.eq(RAW.integer)

interface JsonSchema_number { type: 'number' }
const JsonSchema_number = t.eq(RAW.number)

interface JsonSchema_string { type: 'string' }
const JsonSchema_string = t.eq(RAW.string)

interface JsonSchema_const<T = unknown> { const: T }
const JsonSchema_const = t.object({ const: t.unknown })

interface JsonSchema_enum<T = unknown> { enum: readonly T[] }
const JsonSchema_enum_ = t.object({ enum: t.array(t.unknown, 'readonly') })
const JsonSchema_enum = t.of((u): u is JsonSchema_enum => JsonSchema_enum_(u))

interface JsonSchema_array<T> { type: 'array', items: T }
const JsonSchema_array = t.object({ type: t.eq('array'), items: t.unknown })

interface JsonSchema_record<T = unknown> { type: 'object', additionalProperties: T }
const JsonSchema_record_ = t.object({
  type: t.eq('object'),
  additionalProperties: t.unknown,
})

const JsonSchema_record = <T>(u: unknown): u is JsonSchema_record<T> => JsonSchema_record_(u)

interface JsonSchema_union<T = unknown> { anyOf: T }
const JsonSchema_union_ = t.object({ anyOf: t.array(t.unknown, 'readonly') })
const JsonSchema_union = t.of((u): u is JsonSchema_union => JsonSchema_union_(u))

interface JsonSchema_intersect<T = unknown> { allOf: T }
const JsonSchema_intersect_ = t.object({ allOf: t.array(t.unknown, 'readonly') })
const JsonSchema_intersect = t.of((u): u is JsonSchema_intersect => JsonSchema_intersect_(u))

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

const JsonSchema_nullary = t.union(
  JsonSchema_any,
  JsonSchema_null,
  JsonSchema_boolean,
  JsonSchema_integer,
  JsonSchema_number,
  JsonSchema_string,
)

const JsonSchema_special = t.union(
  JsonSchema_enum,
  JsonSchema_const,
)

const JsonSchema_unary = t.union(
  JsonSchema_array,
  JsonSchema_record,
  JsonSchema_union,
  JsonSchema_intersect,
  JsonSchema_tuple,
  JsonSchema_object,
)

export const is = {
  any: JsonSchema_any,
  null: JsonSchema_null,
  boolean: JsonSchema_boolean,
  integer: JsonSchema_integer,
  number: JsonSchema_number,
  string: JsonSchema_string,
  enum: JsonSchema_enum,
  const: JsonSchema_const,
  array: JsonSchema_array,
  record: JsonSchema_record,
  union: JsonSchema_union,
  intersect: JsonSchema_intersect,
  tuple: JsonSchema_tuple,
  object: JsonSchema_object,
  nullary: JsonSchema_nullary,
  unary: JsonSchema_unary,
  special: JsonSchema_special,
}

export type Nullary =
  | JsonSchema_any
  | JsonSchema_null
  | JsonSchema_boolean
  | JsonSchema_integer
  | JsonSchema_number
  | JsonSchema_string

export type JsonSchema =
  | Nullary
  | JsonSchema_const
  | JsonSchema_enum
  | JsonSchema_array<JsonSchema>
  | JsonSchema_record<JsonSchema>
  | JsonSchema_union<readonly JsonSchema[]>
  | JsonSchema_intersect<readonly JsonSchema[]>
  | JsonSchema_tuple<readonly JsonSchema[]>
  | JsonSchema_object<{ [x: string]: JsonSchema }>

export type Unary<T> =
  | Nullary
  | JsonSchema_const
  | JsonSchema_enum
  | JsonSchema_array<T>
  | JsonSchema_record<T>
  | JsonSchema_union<readonly T[]>
  | JsonSchema_intersect<readonly T[]>
  | JsonSchema_tuple<readonly T[]>
  | JsonSchema_object<{ [x: string]: T }>

export interface Free extends HKT { [-1]: Unary<this[0]> }
