import type { Algebra } from '@traversable/registry'
import { fn, URI, symbol } from '@traversable/registry'
import { t } from '@traversable/schema-core'

import { JsonSchema } from './spec.js'
import { Functor } from './functor.js'
import * as to from './jsonSchema.js'

const phantom = <T = never>() => void 0 as T

namespace Recursive {
  export const toJsonSchema: Algebra<t.Free, JsonSchema.Fixpoint> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.symbol: return phantom()
      case x.tag === URI.bigint: return phantom()
      case x.tag === URI.never: return phantom()
      case x.tag === URI.undefined: return phantom()
      case x.tag === URI.void: return phantom()
      case x.tag === URI.any: return JsonSchema.raw.any
      case x.tag === URI.unknown: return JsonSchema.raw.any
      case x.tag === URI.null: return JsonSchema.raw.null
      case x.tag === URI.boolean: return JsonSchema.raw.boolean
      case x.tag === URI.integer: return JsonSchema.raw.integer
      case x.tag === URI.number: return JsonSchema.raw.number
      case x.tag === URI.string: return JsonSchema.raw.string
      case x.tag === URI.optional: return to.Optional({ jsonSchema: x.def }).jsonSchema
      case x.tag === URI.eq: return to.Eq(x.def).jsonSchema
      case x.tag === URI.array: return to.Array({ jsonSchema: x.def }).jsonSchema
      case x.tag === URI.record: return to.Record({ ...x, jsonSchema: x.def }).jsonSchema
      case x.tag === URI.union: return to.Union(...fn.map(x.def, (v) => ({ jsonSchema: v }))).jsonSchema
      case x.tag === URI.intersect: return to.Intersect(...fn.map(x.def, (v) => ({ jsonSchema: v }))).jsonSchema
      case x.tag === URI.tuple: return to.Tuple(...fn.map(x.def, (v) => ({ jsonSchema: v }))).jsonSchema
      case x.tag === URI.object: return to.Object(fn.map(x.def, (v) => ({ jsonSchema: v }))).jsonSchema
    }
  }

  const handleOptionality = (x: JsonSchema.Unary<t.Fixpoint> & Record<typeof symbol.optional, unknown>) => {
    let { [symbol.optional]: ix, ...y } = x;
    (y as any) = fromJsonSchema(y)
    if (typeof ix !== 'number') return fromJsonSchema(y)
    else while (ix-- > 0) (y as {}) = t.optional(y as never)
    return y
  }

  export const fromJsonSchema: Algebra<JsonSchema.Free, t.Fixpoint> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case symbol.optional in x: return handleOptionality(x) as never
      case JsonSchema.null(x): return t.null
      case JsonSchema.boolean(x): return t.boolean
      case JsonSchema.integer(x): return t.integer
      case JsonSchema.number(x): return t.number
      case JsonSchema.string(x): return t.string
      case JsonSchema.record(x): return t.record(x.additionalProperties)
      case JsonSchema.any(x): return t.unknown
      case JsonSchema.union(x): return t.union.fix(x.anyOf)
      case JsonSchema.enum(x): return t.union.fix(x.enum.map((_) => t.eq(_)))
      case JsonSchema.const(x): return t.eq(x.const)
      case JsonSchema.intersect(x): return t.intersect.fix(x.allOf)
      case JsonSchema.tuple(x): return t.tuple.fix(x.items)
      case JsonSchema.array(x): return t.array.fix(x.items)
      case JsonSchema.record(x): return t.record.fix(x.additionalProperties as t.Fixpoint)
      case JsonSchema.object(x): return t.object.fix(
        fn.map(x.properties, (v, k) => x.required.includes(`${k}`) ? v : t.optional(v))
      )
    }
  }
}

export const toJsonSchema
  : <S extends t.Fixpoint>(term: S) => JsonSchema.Fixpoint & { [symbol.optional]?: number }
  = fn.cata(t.Functor)(Recursive.toJsonSchema)

export const fromJsonSchema = fn.cata(Functor)(Recursive.fromJsonSchema)
