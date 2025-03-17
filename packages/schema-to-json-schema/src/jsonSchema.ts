import type { Returns } from '@traversable/registry'
import { fn, has, symbol } from '@traversable/registry'
import { t } from '@traversable/schema'

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

type JsonSchema<T = never> = [T] extends [never] ? Spec.JsonSchema : Spec.Unary<T>

function applyTupleOptionality(xs: readonly unknown[], { min, max }: { min: number, max: number }) {
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

interface NeverJsonSchema { jsonSchema(): undefined }
const NeverJsonSchema: NeverJsonSchema = { jsonSchema() { return void 0 } }
interface VoidJsonSchema { jsonSchema(): undefined }
const VoidJsonSchema: VoidJsonSchema = { jsonSchema() { return void 0 } }
interface UndefinedJsonSchema { jsonSchema(): undefined }
const UndefinedJsonSchema: UndefinedJsonSchema = { jsonSchema() { return void 0 } }
interface SymbolJsonSchema { jsonSchema(): undefined }
const SymbolJsonSchema: SymbolJsonSchema = { jsonSchema() { return void 0 } }
interface BigIntJsonSchema { jsonSchema(): undefined }
const BigIntJsonSchema: BigIntJsonSchema = { jsonSchema() { return void 0 } }
interface InlineJsonSchema<S> { jsonSchema: () => void }
function InlineJsonSchema<S>(schema: S): InlineJsonSchema<S> {
  return { jsonSchema: () => void 0 }
}

/* * * * * * * * *
 *                *
 *   data types   *
 *                *
  * * * * * * * * */


const AnyJsonSchema: AnyJsonSchema = { jsonSchema() { return Spec.RAW.any } }
interface AnyJsonSchema { jsonSchema(): typeof Spec.RAW.any }
const UnknownJsonSchema: UnknownJsonSchema = { jsonSchema() { return Spec.RAW.any } }
interface UnknownJsonSchema { jsonSchema(): typeof Spec.RAW.any }
const NullJsonSchema: NullJsonSchema = { jsonSchema() { return Spec.RAW.null } }
interface NullJsonSchema { jsonSchema(): typeof Spec.RAW.null }
const BooleanJsonSchema: BooleanJsonSchema = { jsonSchema() { return Spec.RAW.boolean } }
interface BooleanJsonSchema { jsonSchema(): typeof Spec.RAW.boolean }
const IntegerJsonSchema: IntegerJsonSchema = { jsonSchema() { return Spec.RAW.integer } }
interface IntegerJsonSchema { jsonSchema(): typeof Spec.RAW.integer }
const NumberJsonSchema: NumberJsonSchema = { jsonSchema() { return Spec.RAW.number } }
interface NumberJsonSchema { jsonSchema(): typeof Spec.RAW.number }
const StringJsonSchema: StringJsonSchema = { jsonSchema() { return Spec.RAW.string } }
interface StringJsonSchema { jsonSchema(): typeof Spec.RAW.string }

interface EqJsonSchema<S> { jsonSchema(): { const: S } }
function EqJsonSchema<V>(value: V): EqJsonSchema<V>
function EqJsonSchema(value: unknown) {
  return {
    jsonSchema() {
      return {
        const: value
      }
    }
  }
}

interface OptionalJsonSchema<S> {
  jsonSchema: {
    [symbol.optional]: number
    (): Returns<S['jsonSchema' & keyof S]>
  }
}

function OptionalJsonSchema<S>(x: S): OptionalJsonSchema<S>
function OptionalJsonSchema(x: unknown) {
  function jsonSchema() { return getSchema(x) }
  jsonSchema[symbol.optional] = wrapOptional(x)
  return {
    jsonSchema,
  }
}

interface ArrayJsonSchema<S> {
  jsonSchema(): {
    type: 'array'
    items: Returns<S['jsonSchema' & keyof S]>
  }
}

function ArrayJsonSchema<S>(schema: S): ArrayJsonSchema<S>
function ArrayJsonSchema(x: unknown) {
  return {
    jsonSchema() {
      return {
        type: 'array',
        items: getSchema(x),
      }
    }
  }
}

interface RecordJsonSchema<S> {
  jsonSchema(): {
    type: 'object'
    additionalProperties: Returns<S['jsonSchema' & keyof S]>
  }
}
function RecordJsonSchema<S>(schema: S): RecordJsonSchema<S>
function RecordJsonSchema(x: unknown) {
  return {
    jsonSchema() {
      return {
        type: 'object',
        additionalProperties: getSchema(x),
      }
    }
  }
}

interface UnionJsonSchema<S> {
  jsonSchema(): {
    anyOf: { [I in keyof S]: Returns<S[I]['jsonSchema' & keyof S[I]]> }
  }
}

function UnionJsonSchema<S extends readonly unknown[]>(schemas: S): UnionJsonSchema<S>
function UnionJsonSchema(xs: unknown[]): UnionJsonSchema<unknown> {
  return {
    jsonSchema() {
      return {
        anyOf: xs.map(getSchema)
      }
    }
  }
}

interface IntersectJsonSchema<S> {
  jsonSchema(): {
    allOf: { [I in keyof S]: Returns<S[I]['jsonSchema' & keyof S[I]]> }
  }
}

function IntersectJsonSchema<S extends readonly unknown[]>(schemas: S): IntersectJsonSchema<S>
function IntersectJsonSchema(xs: unknown[]): IntersectJsonSchema<unknown> {
  return {
    jsonSchema() {
      return {
        allOf: xs.map(getSchema)
      }
    }
  }
}

interface TupleJsonSchema<S extends readonly unknown[]> {
  jsonSchema(): {
    type: 'array',
    items: { [I in keyof S]: Returns<S[I]['jsonSchema' & keyof S[I]]> }
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
    jsonSchema() {
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
  jsonSchema(): {
    type: 'object'
    required: { [I in keyof KS]: KS[I] & string }
    properties: { [K in keyof S]: Returns<S[K]['jsonSchema' & keyof S[K]]> }
  }
}

function ObjectJsonSchema<S extends { [x: string]: unknown }>(schemas: S): ObjectJsonSchema<S>
function ObjectJsonSchema(xs: { [x: string]: unknown }) {
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
