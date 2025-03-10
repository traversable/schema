import type { Guard } from '@traversable/schema-core'
import { t, T } from '@traversable/schema-core'
import type { HKT, Mut, Primitive } from '@traversable/registry'
import { fn, symbol } from '@traversable/registry'

import { JsonSchema } from './specification.js'

export {
  /* schemas that don't have a corresponding JSON Schema representation */
  SymbolJsonSchema as Symbol,
  VoidJsonSchema as Void,
  UndefinedJsonSchema as Undefined,
  BigIntJsonSchema as BigInt,
  NeverJsonSchema as Never,
  InlineJsonSchema as Inline,
  /* data types */
  UnknownJsonSchema as Unknown,
  AnyJsonSchema as Any,
  NullJsonSchema as Null,
  BooleanJsonSchema as Boolean,
  IntegerJsonSchema as Integer,
  NumberJsonSchema as Number,
  StringJsonSchema as String,
  EqJsonSchema as Eq,
  OptionalJsonSchema as Optional,
  ArrayJsonSchema as Array,
  RecordJsonSchema as Record,
  UnionJsonSchema as Union,
  IntersectJsonSchema as Intersect,
  TupleJsonSchema as Tuple,
  ObjectJsonSchema as Object,
}

/** @internal */
type Evaluate<T> = never | { [K in keyof T]: T[K] }

/** @internal */
type Optionals<
  T,
  K extends
  | Exclude<keyof T & string, T.Optionals<T>>
  = Exclude<keyof T & string, T.Optionals<T>>
> = [K] extends [never] ? [] : K[]

type Nullary =
  | SymbolJsonSchema
  | VoidJsonSchema
  | UndefinedJsonSchema
  | BigIntJsonSchema
  | NeverJsonSchema
  | UnknownJsonSchema
  | AnyJsonSchema
  | NullJsonSchema
  | BooleanJsonSchema
  | IntegerJsonSchema
  | NumberJsonSchema
  | StringJsonSchema


type F<T> =
  | Nullary
  | InlineJsonSchema<T>
  | EqJsonSchema<T>
  | OptionalJsonSchema<T>
  | ArrayJsonSchema<T>
  | RecordJsonSchema<T>
  | UnionJsonSchema<readonly T[]>
  | IntersectJsonSchema<readonly T[]>
  | TupleJsonSchema<readonly T[]>
  | ObjectJsonSchema<{ [x: string]: T }>
  ;

interface Free extends HKT { [-1]: F<this[0]> }

type Fixpoint =
  | Nullary
  | InlineJsonSchema<Fixpoint>
  | EqJsonSchema<Fixpoint>
  | OptionalJsonSchema<Fixpoint>
  | ArrayJsonSchema<Fixpoint>
  | RecordJsonSchema<Fixpoint>
  | UnionJsonSchema<readonly Fixpoint[]>
  | IntersectJsonSchema<readonly Fixpoint[]>
  | TupleJsonSchema<readonly Fixpoint[]>
  | ObjectJsonSchema<{ [x: string]: Fixpoint }>
  ;

/** @internal */
const Object_assign = globalThis.Object.assign

/** @internal */
const Object_keys = globalThis.Object.keys

/* * * * * * * * * * * * * * * * * * *
 *                                   *
 *   no JSON Schema representation   *
 *                                   *
 * * * * * * * * * * * * * * * * * * */

interface SymbolJsonSchema extends t.symbol { jsonSchema: void }
const SymbolJsonSchema: SymbolJsonSchema = Object_assign(t.symbol, { jsonSchema: void 0 })

interface UndefinedJsonSchema extends t.undefined { jsonSchema: void }
const UndefinedJsonSchema: UndefinedJsonSchema = Object_assign(t.undefined, { jsonSchema: void 0 })

interface VoidJsonSchema extends t.void { jsonSchema: void }
const VoidJsonSchema: VoidJsonSchema = Object_assign(t.void, { jsonSchema: void 0 })

interface BigIntJsonSchema extends t.bigint { jsonSchema: void }
const BigIntJsonSchema: BigIntJsonSchema = Object_assign(t.bigint, { jsonSchema: void 0 })

interface NeverJsonSchema extends t.never { jsonSchema: void }
const NeverJsonSchema: NeverJsonSchema = Object_assign(t.never, { jsonSchema: void 0 })

interface InlineJsonSchema<S> extends t.inline<S> { jsonSchema: void }
const InlineJsonSchema = <S>(guard: Guard<S>): InlineJsonSchema<S> => Object_assign(t.inline(guard), { jsonSchema: void 0 })

/* * * * * * * * * 
 *                *
 *   data types   *
 *                *
  * * * * * * * * */

interface NullJsonSchema extends t.null { jsonSchema: Evaluate<JsonSchema.null> }
const NullJsonSchema: NullJsonSchema = Object_assign(t.null, { jsonSchema: JsonSchema.raw.null })

interface BooleanJsonSchema extends t.boolean { jsonSchema: Evaluate<JsonSchema.boolean> }
const BooleanJsonSchema: BooleanJsonSchema = Object_assign(t.boolean, { jsonSchema: JsonSchema.raw.boolean })

interface IntegerJsonSchema extends t.integer { jsonSchema: Evaluate<JsonSchema.integer> }
const IntegerJsonSchema: IntegerJsonSchema = Object_assign(t.integer, { jsonSchema: JsonSchema.raw.integer })

interface NumberJsonSchema extends t.number { jsonSchema: Evaluate<JsonSchema.number> }
const NumberJsonSchema: NumberJsonSchema = Object_assign(t.number, { jsonSchema: JsonSchema.raw.number })

interface StringJsonSchema extends t.string { jsonSchema: Evaluate<JsonSchema.string> }
const StringJsonSchema: StringJsonSchema = Object_assign(t.string, { jsonSchema: JsonSchema.raw.string })

interface AnyJsonSchema extends t.any { jsonSchema: Evaluate<JsonSchema.any> }
const AnyJsonSchema: AnyJsonSchema = Object_assign(t.any, { jsonSchema: JsonSchema.raw.any })

interface UnknownJsonSchema extends t.unknown { jsonSchema: Evaluate<JsonSchema.any> }
const UnknownJsonSchema: UnknownJsonSchema = Object_assign(t.unknown, { jsonSchema: JsonSchema.raw.any })

interface EqJsonSchema<S> extends t.eq.def<S> { jsonSchema: Evaluate<JsonSchema.const<S>> }
function EqJsonSchema<V extends Mut<V>>(value: V): EqJsonSchema<V>
function EqJsonSchema<V>(value: V): EqJsonSchema<V>
function EqJsonSchema<S extends Mut<S>>(value: S): EqJsonSchema<S> {
  return Object_assign(t.eq(value), { jsonSchema: { const: value } })
}

interface OptionalJsonSchema<S> extends t.optional.def<S> {
  jsonSchema: S['jsonSchema' & keyof S] & { [symbol.optional]: number }
}

function OptionalJsonSchema<S>(schema: S): OptionalJsonSchema<S>
function OptionalJsonSchema<S>(schema: S): OptionalJsonSchema<S>
function OptionalJsonSchema(schema: t.Schema & { jsonSchema: {} }): t.optional {
  const optional = ((schema.jsonSchema as any)[symbol.optional] ?? 0) + 1
  const out = Object_assign(
    t.optional(schema),
    {
      jsonSchema: {
        ...schema.jsonSchema,
        [symbol.optional]: optional,
      },
    }
  )
  return out
}

interface ArrayJsonSchema<S> extends t.array.def<S> {
  jsonSchema: Evaluate<JsonSchema.array<S['jsonSchema' & keyof S]>>
}

function ArrayJsonSchema<S extends t.Schema>(schema: S & { jsonSchema: JsonSchema.Fixpoint }): ArrayJsonSchema<S>
function ArrayJsonSchema<S>(schema: S): ArrayJsonSchema<S>
function ArrayJsonSchema(schema: t.Schema & { jsonSchema: {} }): t.array {
  return Object_assign(
    t.array(schema), {
    jsonSchema: {
      type: 'array',
      items: schema.jsonSchema,
    },
  })
}

interface RecordJsonSchema<S> extends t.record.def<S> {
  jsonSchema: Evaluate<JsonSchema.record<S['jsonSchema' & keyof S]>>
}

function RecordJsonSchema<S extends t.Schema>(schema: S): RecordJsonSchema<S>
function RecordJsonSchema<S>(schema: S): RecordJsonSchema<S>
function RecordJsonSchema(schema: t.Schema & { jsonSchema: {} }): t.record {
  return Object_assign(
    t.record(schema), {
    jsonSchema: {
      type: 'object',
      additionalProperties: schema.jsonSchema
    },
  })
}

interface UnionJsonSchema<S extends readonly unknown[]> extends t.union.def<S> {
  jsonSchema: {
    anyOf: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
  }
}

function UnionJsonSchema<S extends readonly t.Schema[]>(...schemas: S): UnionJsonSchema<S>
function UnionJsonSchema<S extends readonly unknown[]>(...schemas: S): UnionJsonSchema<S>
function UnionJsonSchema(...schemas: (t.Schema & { jsonSchema: {} })[]): t.union {
  return Object_assign(
    t.union.fix(schemas),
    { jsonSchema: { anyOf: schemas.map((s) => s.jsonSchema) } },
  )
}

interface IntersectJsonSchema<S extends readonly unknown[]> extends t.intersect.def<S> {
  jsonSchema: {
    allOf: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
  }
}

function IntersectJsonSchema<S extends readonly t.Schema[]>(...schemas: S): IntersectJsonSchema<S>
function IntersectJsonSchema<S extends readonly unknown[]>(...schemas: S): IntersectJsonSchema<S>
function IntersectJsonSchema(...schemas: (t.Schema & { jsonSchema: {} })[]): t.intersect {
  return Object_assign(
    t.intersect.fix(schemas),
    { jsonSchema: { allOf: schemas.map((s) => s.jsonSchema) } },
  )
}

interface TupleJsonSchema<S extends readonly unknown[]> extends t.tuple<S> {
  jsonSchema: {
    type: 'array',
    items: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
    additionalItems: false
    minItems: S['length' & keyof S]
    maxItems: S['length' & keyof S]
  }
}

function TupleJsonSchema<S extends readonly t.Schema[]>(...schemas: S): TupleJsonSchema<S>
function TupleJsonSchema<S extends readonly unknown[]>(...schemas: S): TupleJsonSchema<S>
function TupleJsonSchema(...schemas: (t.Schema & { jsonSchema: {} })[]) {
  return Object_assign(
    t.tuple.fix(schemas), {
    jsonSchema: {
      type: 'array',
      items: schemas.map((s) => s.jsonSchema),
      minItems: schemas.length,
      maxItems: schemas.length,
      additionalItems: false,
    },
  })
}

interface ObjectJsonSchema<S extends { [x: string]: unknown }> extends t.object<S> {
  jsonSchema: {
    type: 'object'
    required: Optionals<S>
    properties: { [K in keyof S]: S[K]['jsonSchema' & keyof S[K]] }
  }
}

const isRequired = (v: { [x: string]: t.Schema & { jsonSchema: {}; }; }) => (k: string) => {
  const jsonSchema: { [x: symbol]: unknown } = v[k].jsonSchema
  if (!(symbol.optional in v[k].jsonSchema)) return true
  else {
    const optional = jsonSchema[symbol.optional]
    if (typeof optional !== 'number') return true
    else return optional === 0
  }
}

function ObjectJsonSchema<S extends { [x: string]: t.Fixpoint }>(schema: S): ObjectJsonSchema<S>
function ObjectJsonSchema<S extends { [x: string]: JsonSchema.Fixpoint }>(schema: S): ObjectJsonSchema<S>
function ObjectJsonSchema<S extends { [x: string]: unknown }>(schemas: S): ObjectJsonSchema<S>
function ObjectJsonSchema<S extends { [x: string]: t.Schema & { jsonSchema: {} } }>(schemas: S): t.object.def<S> {
  const required = Object_keys(schemas).filter(isRequired(schemas))
  return Object_assign(
    t.object.fix(schemas), {
    jsonSchema: {
      type: 'object',
      required,
      properties: fn.map(schemas, (v, k) => {
        if (!required.includes(String(k))) {
          const optional = (v.jsonSchema as any)[symbol.optional]
          if (optional === 1) {
            delete (v.jsonSchema as any)[symbol.optional]
            return v.jsonSchema
          }
          else {
            ; (v.jsonSchema as any)[symbol.optional]--
            return v.jsonSchema
          }

        }
        return v.jsonSchema
      })
    },
  })
}
