import { fn, has, symbol } from '@traversable/registry'
import { t } from '@traversable/schema'

import type { MinItems } from './items.js'
import { minItems } from './items.js'
import type { RequiredKeys } from './properties.js'
import { isRequired, property, wrapOptional } from './properties.js'
import * as Spec from './specification.js'


export type {
  Unary,
  Free,
  Nullary,
} from './specification.js'
export {
  is,
  RAW,
} from './specification.js'
export {
  Functor,
  fold,
  unfold,
} from './functor.js'
export type { RequiredKeys } from './properties.js'
export {
  isRequired,
  property,
  wrapOptional,
} from './properties.js'
export type { MinItems } from './items.js'
export { minItems } from './items.js'


export type {
  JsonSchema,
}
export {
  /* schemas that don't have a corresponding JSON Schema representation */
  SymbolJsonSchema,
  VoidJsonSchema,
  UndefinedJsonSchema,
  BigIntJsonSchema,
  NeverJsonSchema,
  InlineJsonSchema,
  /* data types */
  UnknownJsonSchema,
  AnyJsonSchema,
  NullJsonSchema,
  BooleanJsonSchema,
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


/** @internal */
const Object_keys = globalThis.Object.keys

/** @internal */
const Object_assign = globalThis.Object.assign

type JsonSchema<T = never> = [T] extends [never] ? Spec.JsonSchema : Spec.Unary<T>

const hasSchema = has('jsonSchema')
const getSchema = (u: unknown) => hasSchema(u) ? u.jsonSchema : u

function applyTupleOptionality(xs: readonly unknown[], { min, max }: { min: number, max: number }) {
  return min === max ? xs.map(getSchema) : [
    ...xs.slice(0, min).map(getSchema),
    ...xs.slice(min).map(getSchema),
  ]
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
interface InlineJsonSchema<S> extends t.inline<S> { jsonSchema: void }
const InlineJsonSchema
  : <S extends t.AnySchema>(predicate: S) => InlineJsonSchema<S>
  = (predicate) => Object_assign(t.inline(predicate), { jsonSchema: void 0 })

/* * * * * * * * *
 *                *
 *   data types   *
 *                *
  * * * * * * * * */


const AnyJsonSchema: AnyJsonSchema = { get jsonSchema() { return Spec.RAW.any } }
interface AnyJsonSchema { get jsonSchema(): typeof Spec.RAW.any }
const UnknownJsonSchema: UnknownJsonSchema = { get jsonSchema() { return Spec.RAW.any } }
interface UnknownJsonSchema { get jsonSchema(): typeof Spec.RAW.any }
const NullJsonSchema: NullJsonSchema = { get jsonSchema() { return Spec.RAW.null } }
interface NullJsonSchema { get jsonSchema(): typeof Spec.RAW.null }
const BooleanJsonSchema: BooleanJsonSchema = { get jsonSchema() { return Spec.RAW.boolean } }
interface BooleanJsonSchema { get jsonSchema(): typeof Spec.RAW.boolean }
const IntegerJsonSchema: IntegerJsonSchema = { get jsonSchema() { return Spec.RAW.integer } }
interface IntegerJsonSchema { get jsonSchema(): typeof Spec.RAW.integer }
const NumberJsonSchema: NumberJsonSchema = { get jsonSchema() { return Spec.RAW.number } }
interface NumberJsonSchema { get jsonSchema(): typeof Spec.RAW.number }
const StringJsonSchema: StringJsonSchema = { get jsonSchema() { return Spec.RAW.string } }
interface StringJsonSchema { get jsonSchema(): typeof Spec.RAW.string }

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

interface TupleJsonSchema<S extends readonly unknown[]> {
  get jsonSchema(): {
    type: 'array',
    items: { [I in keyof S]: S[I]['jsonSchema' & keyof S[I]] }
    additionalItems: false
    minItems: MinItems<S>
    maxItems: S['length' & keyof S]
  }
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
