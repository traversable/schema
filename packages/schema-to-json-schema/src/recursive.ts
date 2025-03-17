import type * as T from '@traversable/registry'
import { fn, URI, symbol } from '@traversable/registry'
import { t } from '@traversable/schema'

import { isRequired, property } from './properties.js'

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
      case x.tag === URI.symbol: return phantom satisfies () => JsonSchema
      case x.tag === URI.bigint: return phantom satisfies () => JsonSchema
      case x.tag === URI.never: return phantom satisfies () => JsonSchema
      case x.tag === URI.undefined: return phantom satisfies () => JsonSchema
      case x.tag === URI.void: return phantom satisfies () => JsonSchema
      case x.tag === URI.any: return (() => JsonSchema.RAW.any) satisfies () => JsonSchema
      case x.tag === URI.unknown: return (() => JsonSchema.RAW.any) satisfies () => JsonSchema
      case x.tag === URI.null: return (() => JsonSchema.RAW.null) satisfies () => JsonSchema
      case x.tag === URI.boolean: return (() => JsonSchema.RAW.boolean) satisfies () => JsonSchema
      case x.tag === URI.integer: return (() => JsonSchema.RAW.integer) satisfies () => JsonSchema
      case x.tag === URI.number: return (() => JsonSchema.RAW.number) satisfies () => JsonSchema
      case x.tag === URI.string: return (() => JsonSchema.RAW.string) satisfies () => JsonSchema
      case x.tag === URI.optional: return JsonSchema.OptionalJsonSchema(x.def()).jsonSchema satisfies () => JsonSchema
      case x.tag === URI.eq: return JsonSchema.EqJsonSchema(x.def).jsonSchema satisfies () => JsonSchema
      case x.tag === URI.array: return JsonSchema.ArrayJsonSchema(x.def()).jsonSchema
      case x.tag === URI.record: return JsonSchema.RecordJsonSchema(x.def()).jsonSchema satisfies () => JsonSchema
      case x.tag === URI.union: return JsonSchema.UnionJsonSchema(fn.map(x.def, (v) => v())).jsonSchema satisfies () => JsonSchema
      case x.tag === URI.intersect: return JsonSchema.IntersectJsonSchema(fn.map(x.def, (v) => v())).jsonSchema satisfies () => JsonSchema
      case x.tag === URI.tuple: return JsonSchema.TupleJsonSchema(fn.map(x.def, (v) => v())).jsonSchema satisfies () => JsonSchema
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

  export const fromJsonSchema: T.Algebra<JsonSchema.Free, t.Schema> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case symbol.optional in x: return handleOptionality(x) as never
      case JsonSchema.is.null(x): return t.null
      case JsonSchema.is.boolean(x): return t.boolean
      case JsonSchema.is.integer(x): return t.integer
      case JsonSchema.is.number(x): return t.number
      case JsonSchema.is.string(x): return t.string
      case JsonSchema.is.any(x): return t.unknown
      case JsonSchema.is.record(x): return t.record(x.additionalProperties)
      case JsonSchema.is.union(x): return t.union.def(x.anyOf)
      case JsonSchema.is.enum(x): return t.union.def(x.enum.map((_) => t.eq(_)))
      case JsonSchema.is.const(x): return t.eq.def(x.const)
      case JsonSchema.is.intersect(x): return t.intersect.def(x.allOf)
      case JsonSchema.is.tuple(x): return t.tuple.def(recoverTupleOptionality(x.items, { min: x.minItems, max: x.maxItems }))
      case JsonSchema.is.array(x): return t.array.def(x.items)
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
