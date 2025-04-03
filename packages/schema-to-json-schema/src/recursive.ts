import type * as T from '@traversable/registry'
import { fn, URI, symbol } from '@traversable/registry'
import { t } from '@traversable/schema'

import { isRequired, property } from './properties.js'
import type * as Spec from './specification.js'

import * as JsonSchema from './jsonSchema.js'
type JsonSchema = import('./jsonSchema.js').JsonSchema

/** @internal */
const phantom
  : <T = never>() => T
  = () => <never>void 0

/** @internal */
function handleOptionality(x: JsonSchema.Unary<t.Schema> & Record<typeof symbol.optional, unknown>) {
  let { [symbol.optional]: ix, ...y } = x;
  (y as any) = Recursive.fromJsonSchema(y)
  if (typeof ix !== 'number') return y
  else while (ix-- > 0) (y as {}) = t.optional(y as never)
  return y
}

function handleNullability(x: JsonSchema.Unary<t.Schema> & { nullable: unknown }) {
  let { nullable, ...y } = x
  return t.optional(Recursive.fromJsonSchema(y as never))
}

/** @internal */
function recoverTupleOptionality(xs: readonly unknown[], { min, max }: { min: number, max: number }) {
  if (min !== max) {
    const firstOptional = min
    const req = xs.slice(0, firstOptional)
    const opt = xs.slice(firstOptional).map(t.optional.def)
    return [...req, ...opt]
  }
  else return xs
}

export namespace Recursive {
  export const toJsonSchema: T.Algebra<t.Free, () => JsonSchema> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.symbol: return phantom
      case x.tag === URI.bigint: return phantom
      case x.tag === URI.never: return phantom
      case x.tag === URI.undefined: return phantom
      case x.tag === URI.void: return phantom
      case x.tag === URI.any: return () => JsonSchema.RAW.any
      case x.tag === URI.unknown: return () => JsonSchema.RAW.any
      case x.tag === URI.null: return () => JsonSchema.RAW.null
      case x.tag === URI.boolean: return JsonSchema.boolean
      case x.tag === URI.integer: return () => JsonSchema.integer(x)
      case x.tag === URI.number: return () => JsonSchema.number(x)
      case x.tag === URI.string: return () => JsonSchema.string(x)
      case x.tag === URI.optional: return JsonSchema.optional(x.def()).toJsonSchema
      case x.tag === URI.eq: return () => JsonSchema.eq(x.def)
      case x.tag === URI.array: return () => JsonSchema.array(x.def(), { minLength: x.minLength, maxLength: x.maxLength })
      case x.tag === URI.record: return () => JsonSchema.record(x.def())
      case x.tag === URI.union: return () => JsonSchema.union(fn.map(x.def, (v) => v()))
      case x.tag === URI.intersect: return () => JsonSchema.intersect(fn.map(x.def, (v) => v()))
      case x.tag === URI.tuple: return () => JsonSchema.tuple(fn.map(x.def, (v) => v()))
      case x.tag === URI.object: {
        const required = Object.keys(x.def).filter(isRequired(x.def))
        return () => ({
          type: 'object',
          required,
          properties: fn.map(x.def, (v, k) => property(required)(v(), k)),
        })
      }
    }
  }

  const fromJsonSchemaInteger = ({
    minimum: min,
    maximum: max,
    exclusiveMinimum: xMin,
    exclusiveMaximum: xMax
  }: Spec.IntegerSchema = { type: 'integer' }) => {
    let out = t.integer
    let minimum = t.number(min) && !t.boolean(xMin) ? min : void 0
    let maximum = t.number(max) && !t.boolean(xMax) ? max : void 0
    if (t.number(minimum)) out = out.min(minimum)
    if (t.number(maximum)) out = out.max(maximum)
    return out
  }

  const fromJsonSchemaNumber = ({
    minimum: min,
    maximum: max,
    exclusiveMinimum: xMin,
    exclusiveMaximum: xMax
  }: Spec.NumberSchema = { type: 'number' }) => {
    let out = t.number
    let exclusiveMinimum = t.number(xMin) ? xMin : t.boolean(xMin) && t.number(min) ? min : void 0
    let exclusiveMaximum = t.number(xMax) ? xMax : t.boolean(xMax) && t.number(max) ? max : void 0
    let minimum = t.number(min) && !t.boolean(xMin) ? min : void 0
    let maximum = t.number(max) && !t.boolean(xMax) ? max : void 0
    if (t.number(exclusiveMinimum)) out = out.moreThan(exclusiveMinimum)
    if (t.number(exclusiveMaximum)) out = out.lessThan(exclusiveMaximum)
    if (t.number(minimum)) out = out.min(minimum)
    if (t.number(maximum)) out = out.max(maximum)
    return out
  }

  const fromJsonSchemaString = ({ minLength: min, maxLength: max }: Spec.StringSchema = { type: 'string' }) => {
    let out = t.string
    if (t.number(min)) out = out.min(min)
    if (t.number(max)) out = out.max(max)
    return out
  }

  export const fromJsonSchema: T.Algebra<JsonSchema.Free, t.Schema> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case JsonSchema.is.any(x): return t.unknown
      case symbol.optional in x: return handleOptionality(x) as never
      case 'nullable' in x: return handleNullability(x) as never
      case JsonSchema.is.optional(x): return t.optional.def(x)
      case JsonSchema.is.null(x): return t.null
      case JsonSchema.is.boolean(x): return t.boolean
      case JsonSchema.is.integer(x): return fromJsonSchemaInteger(x)
      case JsonSchema.is.number(x): return fromJsonSchemaNumber(x)
      case JsonSchema.is.string(x): return fromJsonSchemaString(x)
      case JsonSchema.is.record(x): return t.record(x.additionalProperties)
      case JsonSchema.is.union(x): return t.union.def(x.anyOf)
      case JsonSchema.is.enum(x): return t.union.def(x.enum.map((_) => t.eq(_)))
      case JsonSchema.is.const(x): return t.eq.def(x.const)
      case JsonSchema.is.intersect(x): return t.intersect.def(x.allOf)
      case JsonSchema.is.tuple(x): return t.tuple.def(recoverTupleOptionality(x.items, { min: x.minItems, max: x.maxItems }))
      case JsonSchema.is.array(x): return t.array.def(x.items, x)
      case JsonSchema.is.object(x): return t.object(fn.map(x.properties, (v, k) => x.required.includes(`${k}`) ? v : t.optional(v)))
    }
  }
}

/** 
 * ## {@link fromJsonSchema `fromJsonSchema`}
 * 
 * Recursively convert a JSON schema into a traversable schema.
 * 
 * __Roundtrip property:__
 * 
 * Thoroughly tested using randomly generated schemas to be invertible when paired
 * with {@link toJsonSchema} without any loss of information.
 */
export const fromJsonSchema
  : <S extends JsonSchema.JsonSchema>(term: S) => t.LowerBound
  = <never>JsonSchema.fold(Recursive.fromJsonSchema)

/** 
 * ## {@link toJsonSchema `toJsonSchema`}
 * 
 * Recursively convert a traversable schema into its JSON schema representation.
 * 
 * __Roundtrip property:__
 * 
 * Thoroughly tested using randomly generated schemas to be invertible with
 * {@link fromJsonSchema `fromJsonSchema`} without any loss of information.
 * 
 * __Note:__ If you find yourself reaching for {@link toJsonSchema `toJsonSchema`}, 
 * keep in mind that by installing the `@traversable/schema-to-json-schema` package,
 * all of the built-in schemas from the `@traversable/schema` package come
 * equipped with a `.toJsonSchema` getter method.
 * 
 * Prefer using the `.toJsonSchema` method if possible -- not only is it
 * easier to use, but it's also more performant, since the implementation
 * is not recursive.
 */
export const toJsonSchema
  : <S extends t.LowerBound>(term: S) => () => JsonSchema.JsonSchema
  = <never>t.fold(Recursive.toJsonSchema)
