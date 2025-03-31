import type { Force, PickIfDefined, Returns } from '@traversable/registry'
import { fn, has, symbol, unsafeCompact } from '@traversable/registry'

import type { MinItems } from './items.js'
import { minItems } from './items.js'
import type { RequiredKeys } from './properties.js'
import { getSchema, isRequired, property, wrapOptional } from './properties.js'
import * as Spec from './specification.js'
import { t } from '@traversable/schema'

export type {
  Unary,
  Free,
  Nullary,
  NumericBounds,
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
  Schema,
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

const isNumber = (u: unknown): u is number => typeof u === 'number'

const getNumericBounds = (u: unknown): Spec.NumericBounds => ({
  ...has('minimum', isNumber)(u) && { minimum: u.minimum },
  ...has('maximum', isNumber)(u) && { maximum: u.maximum },
  ...has('exclusiveMinimum', isNumber)(u) && { exclusiveMinimum: u.exclusiveMinimum },
  ...has('exclusiveMaximum', isNumber)(u) && { exclusiveMaximum: u.exclusiveMaximum },
})

type JsonSchema<T = never> = [T] extends [never] ? Spec.JsonSchema : Spec.Unary<T>
type StringBounds<T> = Force<{ type: 'string' } & PickIfDefined<T, keyof Spec.SizeBounds>>
type NumberBounds<T> = Force<{ type: 'number' } & PickIfDefined<T, keyof Spec.NumericBounds>>
type IntegerBounds<T> = Force<{ type: 'integer' } & PickIfDefined<T, keyof Spec.NumericBounds>>
type ArrayBounds<S, T> = Force<{ type: 'array', items: Returns<S['toJsonSchema' & keyof S]> } & PickIfDefined<T, keyof Spec.SizeBounds>>

function applyTupleOptionality(xs: readonly unknown[], { min, max }: { min: number, max: number }): readonly unknown[] {
  return min === max ? xs.map(getSchema) : [
    ...xs.slice(0, min).map(getSchema),
    ...xs.slice(min).map(getSchema),
  ]
}

interface LowerBound { toJsonSchema(): JsonSchema | undefined }
interface Schema { toJsonSchema?(): any }

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

interface IntegerSchema { toJsonSchema(): IntegerBounds<this> }
const IntegerSchema = {
  toJsonSchema: function IntegerSchemaToJsonSchema() {
    const { exclusiveMaximum, exclusiveMinimum, maximum, minimum } = getNumericBounds(this)
    let bounds: Spec.NumericBounds = {}
    if (typeof exclusiveMinimum === 'number') bounds.exclusiveMinimum = exclusiveMinimum
    if (typeof exclusiveMaximum === 'number') bounds.exclusiveMaximum = exclusiveMaximum
    if (typeof minimum === 'number') bounds.minimum = minimum
    if (typeof maximum === 'number') bounds.maximum = maximum
    return {
      ...Spec.RAW.integer,
      ...bounds,
    }
  }
}

interface NumberSchema { toJsonSchema(): NumberBounds<this> }
const NumberSchema: NumberSchema = {
  toJsonSchema: function NumberSchemaToJsonSchema() {
    const { exclusiveMaximum, exclusiveMinimum, maximum, minimum } = getNumericBounds(this)
    let bounds: Spec.NumericBounds = {}
    if (typeof exclusiveMinimum === 'number') bounds.exclusiveMinimum = exclusiveMinimum
    if (typeof exclusiveMaximum === 'number') bounds.exclusiveMaximum = exclusiveMaximum
    if (typeof minimum === 'number') bounds.minimum = minimum
    if (typeof maximum === 'number') bounds.maximum = maximum
    return {
      ...Spec.RAW.number,
      ...bounds,
    }
  }
}

interface StringSchema { toJsonSchema(): StringBounds<this> }
const StringSchema: StringSchema = {
  toJsonSchema: function StringSchemaToJsonSchema() {
    const minLength = has('minLength', isNumber)(this) ? this.minLength : null
    const maxLength = has('maxLength', isNumber)(this) ? this.maxLength : null
    return {
      ...Spec.RAW.string,
      ...maxLength != null && { maxLength },
      ...minLength != null && { minLength },
    }
  }
}

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
  toJsonSchema(): ArrayBounds<S, this>
}

function ArraySchema<S>(schema: S): ArraySchema<S>
function ArraySchema(x: unknown) {
  return {
    toJsonSchema() {
      const minLength = has('minLength', isNumber)(this) ? this.minLength : null
      const maxLength = has('maxLength', isNumber)(this) ? this.maxLength : null
      return {
        type: 'array',
        items: getSchema(x),
        ...minLength != null && { minLength },
        ...maxLength != null && { maxLength },
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
