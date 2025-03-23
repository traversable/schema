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

interface LowerBound { toJsonSchema(): JsonSchema | undefined }

/* * * * * * * * * * * * * * * * * * *
 *                                   *
 *   no JSON Schema representation   *
 *                                   *
 * * * * * * * * * * * * * * * * * * */

interface NeverSchema { toJsonSchema(): undefined }
const NeverSchema: NeverSchema = { toJsonSchema() { return void 0 } }
interface VoidSchema { toJsonSchema(): undefined }
const VoidSchema: VoidSchema = { toJsonSchema() { return void 0 } }
interface UndefinedSchema { toJsonSchema(): undefined }
const UndefinedSchema: UndefinedSchema = { toJsonSchema() { return void 0 } }
interface SymbolSchema { toJsonSchema(): undefined }
const SymbolSchema: SymbolSchema = { toJsonSchema() { return void 0 } }
interface BigIntSchema { toJsonSchema(): undefined }
const BigIntSchema: BigIntSchema = { toJsonSchema() { return void 0 } }
interface InlineSchema<S> { toJsonSchema: () => void }
function InlineSchema<S>(_: S): InlineSchema<S> {
  return { toJsonSchema: () => void 0 }
}

/* * * * * * * * *
 *                *
 *   data types   *
 *                *
  * * * * * * * * */


const AnySchema: AnySchema = { toJsonSchema() { return Spec.RAW.any } }
interface AnySchema { toJsonSchema(): typeof Spec.RAW.any }
const UnknownSchema: UnknownSchema = { toJsonSchema() { return Spec.RAW.any } }
interface UnknownSchema { toJsonSchema(): typeof Spec.RAW.any }
const NullSchema: NullSchema = { toJsonSchema() { return Spec.RAW.null } }
interface NullSchema { toJsonSchema(): typeof Spec.RAW.null }
const BooleanSchema: BooleanSchema = { toJsonSchema() { return Spec.RAW.boolean } }
interface BooleanSchema { toJsonSchema(): typeof Spec.RAW.boolean }
const IntegerSchema: IntegerSchema = { toJsonSchema() { return Spec.RAW.integer } }
interface IntegerSchema { toJsonSchema(): typeof Spec.RAW.integer }
const NumberSchema: NumberSchema = { toJsonSchema() { return Spec.RAW.number } }
interface NumberSchema { toJsonSchema(): typeof Spec.RAW.number }
const StringSchema: StringSchema = { toJsonSchema() { return Spec.RAW.string } }
interface StringSchema { toJsonSchema(): typeof Spec.RAW.string }

interface EqSchema<S> { toJsonSchema(): { const: S } }
function EqSchema<V>(value: V): EqSchema<V>
function EqSchema(value: unknown) {
  return {
    toJsonSchema() {
      return {
        const: value
      }
    }
  }
}

interface OptionalSchema<S> {
  toJsonSchema: {
    [symbol.optional]: number
    (): Returns<S['toJsonSchema' & keyof S]>
  }
}

function OptionalSchema<S>(x: S): OptionalSchema<S>
function OptionalSchema(x: unknown) {
  function toJsonSchema() { return getSchema(x) }
  toJsonSchema[symbol.optional] = wrapOptional(x)
  return {
    toJsonSchema,
  }
}

interface ArraySchema<S> {
  toJsonSchema(): {
    type: 'array'
    items: Returns<S['toJsonSchema' & keyof S]>
  }
}

function ArraySchema<S>(schema: S): ArraySchema<S>
function ArraySchema(x: unknown) {
  return {
    toJsonSchema() {
      return {
        type: 'array',
        items: getSchema(x),
      }
    }
  }
}

interface RecordSchema<S> {
  toJsonSchema(): {
    type: 'object'
    additionalProperties: Returns<S['toJsonSchema' & keyof S]>
  }
}
function RecordSchema<S>(schema: S): RecordSchema<S>
function RecordSchema(x: unknown) {
  return {
    toJsonSchema() {
      return {
        type: 'object',
        additionalProperties: getSchema(x),
      }
    }
  }
}

interface UnionSchema<S> {
  toJsonSchema(): {
    anyOf: { [I in keyof S]: Returns<S[I]['toJsonSchema' & keyof S[I]]> }
  }
}

function UnionSchema<S extends readonly unknown[]>(schemas: S): UnionSchema<S>
function UnionSchema(xs: unknown[]): UnionSchema<unknown> {
  return {
    toJsonSchema() {
      return {
        anyOf: xs.map(getSchema)
      }
    }
  }
}

interface IntersectSchema<S> {
  toJsonSchema(): {
    allOf: { [I in keyof S]: Returns<S[I]['toJsonSchema' & keyof S[I]]> }
  }
}

function IntersectSchema<S extends readonly unknown[]>(schemas: S): IntersectSchema<S>
function IntersectSchema(xs: unknown[]): IntersectSchema<unknown> {
  return {
    toJsonSchema() {
      return {
        allOf: xs.map(getSchema)
      }
    }
  }
}

interface TupleSchema<S> {
  toJsonSchema(): {
    type: 'array',
    items: { [I in keyof S]: Returns<S[I]['toJsonSchema' & keyof S[I]]> }
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
    toJsonSchema() {
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

interface ObjectSchema<S, KS extends RequiredKeys<S> = RequiredKeys<S>> {
  toJsonSchema(): {
    type: 'object'
    required: { [I in keyof KS]: KS[I] & string }
    properties: { [K in keyof S]: Returns<S[K]['toJsonSchema' & keyof S[K]]> }
  }
}

function ObjectSchema<S extends { [x: string]: unknown }>(schemas: S): ObjectSchema<S>
function ObjectSchema(xs: { [x: string]: unknown }) {
  const required = Object_keys(xs).filter(isRequired(xs))
  return {
    toJsonSchema() {
      return {
        type: 'object',
        required,
        properties: fn.map(xs, property(required)),
      }
    }
  }
}
