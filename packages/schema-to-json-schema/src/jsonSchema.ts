import type { Returns } from '@traversable/registry'
import { fn, symbol } from '@traversable/registry'

import type { MinItems } from './items.js'
import { minItems } from './items.js'
import type { RequiredKeys } from './properties.js'
import { getSchema, isRequired, property, wrapOptional } from './properties.js'
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
  LowerBound,
}
export {
  /* no JSON Schema representation */
  SymbolSchema,
  VoidSchema,
  UndefinedSchema,
  BigIntSchema,
  NeverSchema,
  InlineSchema,
  /* data types */
  UnknownSchema,
  AnySchema,
  NullSchema,
  BooleanSchema,
  IntegerSchema,
  NumberSchema,
  StringSchema,
  EqSchema,
  OptionalSchema,
  ArraySchema,
  RecordSchema,
  TupleSchema,
  UnionSchema,
  IntersectSchema,
  ObjectSchema,
}

/** @internal */
const Object_keys = globalThis.Object.keys

type JsonSchema<T = never> = [T] extends [never] ? Spec.JsonSchema : Spec.Unary<T>

function applyTupleOptionality(xs: readonly unknown[], { min, max }: { min: number, max: number }): readonly unknown[] {
  return min === max ? xs.map(getSchema) : [
    ...xs.slice(0, min).map(getSchema),
    ...xs.slice(min).map(getSchema),
  ]
}

interface LowerBound { jsonSchema(): JsonSchema | undefined }

/* * * * * * * * * * * * * * * * * * *
 *                                   *
 *   no JSON Schema representation   *
 *                                   *
 * * * * * * * * * * * * * * * * * * */

interface NeverSchema { jsonSchema(): undefined }
const NeverSchema: NeverSchema = { jsonSchema() { return void 0 } }
interface VoidSchema { jsonSchema(): undefined }
const VoidSchema: VoidSchema = { jsonSchema() { return void 0 } }
interface UndefinedSchema { jsonSchema(): undefined }
const UndefinedSchema: UndefinedSchema = { jsonSchema() { return void 0 } }
interface SymbolSchema { jsonSchema(): undefined }
const SymbolSchema: SymbolSchema = { jsonSchema() { return void 0 } }
interface BigIntSchema { jsonSchema(): undefined }
const BigIntSchema: BigIntSchema = { jsonSchema() { return void 0 } }
interface InlineSchema<S> { jsonSchema: () => void }
function InlineSchema<S>(_: S): InlineSchema<S> {
  return { jsonSchema: () => void 0 }
}

/* * * * * * * * *
 *                *
 *   data types   *
 *                *
  * * * * * * * * */


const AnySchema: AnySchema = { jsonSchema() { return Spec.RAW.any } }
interface AnySchema { jsonSchema(): typeof Spec.RAW.any }
const UnknownSchema: UnknownSchema = { jsonSchema() { return Spec.RAW.any } }
interface UnknownSchema { jsonSchema(): typeof Spec.RAW.any }
const NullSchema: NullSchema = { jsonSchema() { return Spec.RAW.null } }
interface NullSchema { jsonSchema(): typeof Spec.RAW.null }
const BooleanSchema: BooleanSchema = { jsonSchema() { return Spec.RAW.boolean } }
interface BooleanSchema { jsonSchema(): typeof Spec.RAW.boolean }
const IntegerSchema: IntegerSchema = { jsonSchema() { return Spec.RAW.integer } }
interface IntegerSchema { jsonSchema(): typeof Spec.RAW.integer }
const NumberSchema: NumberSchema = { jsonSchema() { return Spec.RAW.number } }
interface NumberSchema { jsonSchema(): typeof Spec.RAW.number }
const StringSchema: StringSchema = { jsonSchema() { return Spec.RAW.string } }
interface StringSchema { jsonSchema(): typeof Spec.RAW.string }

interface EqSchema<S> { jsonSchema(): { const: S } }
function EqSchema<V>(value: V): EqSchema<V>
function EqSchema(value: unknown) {
  return {
    jsonSchema() {
      return {
        const: value
      }
    }
  }
}

interface OptionalSchema<S> {
  jsonSchema: {
    [symbol.optional]: number
    (): Returns<S['jsonSchema' & keyof S]>
  }
}

function OptionalSchema<S>(x: S): OptionalSchema<S>
function OptionalSchema(x: unknown) {
  function jsonSchema() { return getSchema(x) }
  jsonSchema[symbol.optional] = wrapOptional(x)
  return {
    jsonSchema,
  }
}

interface ArraySchema<S> {
  jsonSchema(): {
    type: 'array'
    items: Returns<S['jsonSchema' & keyof S]>
  }
}

function ArraySchema<S>(schema: S): ArraySchema<S>
function ArraySchema(x: unknown) {
  return {
    jsonSchema() {
      return {
        type: 'array',
        items: getSchema(x),
      }
    }
  }
}

interface RecordSchema<S> {
  jsonSchema(): {
    type: 'object'
    additionalProperties: Returns<S['jsonSchema' & keyof S]>
  }
}
function RecordSchema<S>(schema: S): RecordSchema<S>
function RecordSchema(x: unknown) {
  return {
    jsonSchema() {
      return {
        type: 'object',
        additionalProperties: getSchema(x),
      }
    }
  }
}

interface UnionSchema<S> {
  jsonSchema(): {
    anyOf: { [I in keyof S]: Returns<S[I]['jsonSchema' & keyof S[I]]> }
  }
}

function UnionSchema<S extends readonly unknown[]>(schemas: S): UnionSchema<S>
function UnionSchema(xs: unknown[]): UnionSchema<unknown> {
  return {
    jsonSchema() {
      return {
        anyOf: xs.map(getSchema)
      }
    }
  }
}

interface IntersectSchema<S> {
  jsonSchema(): {
    allOf: { [I in keyof S]: Returns<S[I]['jsonSchema' & keyof S[I]]> }
  }
}

function IntersectSchema<S extends readonly unknown[]>(schemas: S): IntersectSchema<S>
function IntersectSchema(xs: unknown[]): IntersectSchema<unknown> {
  return {
    jsonSchema() {
      return {
        allOf: xs.map(getSchema)
      }
    }
  }
}

interface TupleSchema<S> {
  jsonSchema(): {
    type: 'array',
    items: { [I in keyof S]: Returns<S[I]['jsonSchema' & keyof S[I]]> }
    additionalItems: false
    minItems: MinItems<S>
    maxItems: S['length' & keyof S]
  }
}

function TupleSchema<S extends readonly unknown[]>(schemas: readonly [...S]): TupleSchema<S>
function TupleSchema(xs: readonly unknown[]): TupleSchema<any> {
  const min = minItems(xs)
  const max = xs.length
  return {
    jsonSchema() {
      return {
        type: 'array' as const,
        additionalItems: false as const,
        items: applyTupleOptionality(xs, { min, max }) as never,
        minItems: min as never,
        maxItems: max,
      }
    }
  }
}

TupleSchema([NumberSchema]).jsonSchema().items

interface ObjectSchema<S, KS extends RequiredKeys<S> = RequiredKeys<S>> {
  jsonSchema(): {
    type: 'object'
    required: { [I in keyof KS]: KS[I] & string }
    properties: { [K in keyof S]: Returns<S[K]['jsonSchema' & keyof S[K]]> }
  }
}

function ObjectSchema<S extends { [x: string]: unknown }>(schemas: S): ObjectSchema<S>
function ObjectSchema(xs: { [x: string]: unknown }) {
  const required = Object_keys(xs).filter(isRequired(xs))
  return {
    jsonSchema() {
      return {
        type: 'object',
        required,
        properties: fn.map(xs, property(required)),
      }
    }
  }
}
