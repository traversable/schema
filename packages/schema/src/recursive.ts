import type * as T from './registry.js'
import { fn, NS, parseKey, URI, symbol } from './registry.js'
import * as core from './core.js'
import * as t from './schema.js'

import * as JsonSchema from './jsonSchema.js'
type JsonSchema = import('./jsonSchema.js').JsonSchema

import * as Json from './json.js'
type Json<T = never> = [T] extends [never]
  ? import('./json.js').Json
  : import('./json.js').Unary<T>

/** @internal */
const Object_entries = globalThis.Object.entries
/** @internal */
const OPT = '<<>>' as const
/** @internal */
const trim = (s?: string) =>
  s == null ? String(s)
    : s.startsWith(OPT) ? s.substring(OPT.length)
      : s

type TypeName<T> = never | T extends `${NS}${infer S}` ? S : never
function typeName<T extends { tag: string }>(x: T): TypeName<T['tag']>
function typeName(x: { tag: string }) {
  return x.tag.substring(NS.length)
}

export namespace Recursive {
  const jsonToString = Json.fold((x: Json<string>) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case Json.isScalar(x): return typeof x === 'string' ? `"${x}"` : `${x}`
      case Json.isArray(x): return `[${x.join(',')}]`
      case Json.isObject(x): return `{ ${Object_entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`).join(', ')} }`
    }
  })

  export const toString: T.Functor.Algebra<t.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case core.isLeaf(x): return 't.' + typeName(x)
      case x.tag === URI.eq: return `t.eq(${jsonToString(x.def)})`
      case x.tag === URI.array: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.record: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.optional: return `t.${typeName(x)}(${x.def})`
      case x.tag === URI.tuple: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.union: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.intersect: return `t.${typeName(x)}(${x.def.join(', ')})`
      case x.tag === URI.object: {
        const xs = Object_entries(x.def)
        return xs.length === 0
          ? `t.${typeName(x)}({})`
          : `t.${typeName(x)}({ ${xs.map(([k, v]) => parseKey(k) + `: ${v}`).join(', ')} })`
      }
    }
  }

  export const toTypeString: T.Functor.Algebra<t.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case core.isLeaf(x): return typeName(x)
      case x.tag === URI.eq: return jsonToString(x.def)
      case x.tag === URI.array: return `(${trim(x.def)})[]`
      case x.tag === URI.record: return `Record<string, ${trim(x.def)}>`
      case x.tag === URI.optional: return `${OPT}(${trim(x.def)} | undefined)`
      case x.tag === URI.union: return `(${x.def.map(trim).join(' | ')})`
      case x.tag === URI.intersect: return `(${x.def.map(trim).join(' & ')})`
      case x.tag === URI.tuple:
        return `[${x.def.map((y) => (y?.startsWith(OPT) ? '_?: ' : '') + trim(y)).join(', ')}]`
      case x.tag === URI.object: {
        const xs = Object_entries(x.def)
        return xs.length === 0
          ? `{}`
          : `{ ${xs.map(([k, v]) => parseKey(k) + (v?.startsWith(OPT) ? '?' : '') + `: ${trim(v)}`).join(', ')} }`
      }
    }
  }

  const phantom = <T = never>() => void 0 as T

  export const toJsonSchema: T.Algebra<t.Free, JsonSchema> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x.tag === URI.symbol: return phantom() satisfies JsonSchema
      case x.tag === URI.bigint: return phantom() satisfies JsonSchema
      case x.tag === URI.never: return phantom() satisfies JsonSchema
      case x.tag === URI.undefined: return phantom() satisfies JsonSchema
      case x.tag === URI.void: return phantom() satisfies JsonSchema
      case x.tag === URI.any: return JsonSchema.RAW.any satisfies JsonSchema
      case x.tag === URI.unknown: return JsonSchema.RAW.any satisfies JsonSchema
      case x.tag === URI.null: return JsonSchema.RAW.null satisfies JsonSchema
      case x.tag === URI.boolean: return JsonSchema.RAW.boolean satisfies JsonSchema
      case x.tag === URI.integer: return JsonSchema.RAW.integer satisfies JsonSchema
      case x.tag === URI.number: return JsonSchema.RAW.number satisfies JsonSchema
      case x.tag === URI.string: return JsonSchema.RAW.string satisfies JsonSchema
      case x.tag === URI.optional: return JsonSchema.OptionalJsonSchema({ jsonSchema: x.def }).jsonSchema satisfies JsonSchema
      case x.tag === URI.eq: return JsonSchema.EqJsonSchema(x.def).jsonSchema satisfies JsonSchema
      case x.tag === URI.array: return JsonSchema.ArrayJsonSchema({ jsonSchema: x.def }).jsonSchema satisfies JsonSchema
      case x.tag === URI.record: return JsonSchema.RecordJsonSchema({ ...x, jsonSchema: x.def }).jsonSchema satisfies JsonSchema
      case x.tag === URI.union: return JsonSchema.UnionJsonSchema(fn.map(x.def, (v) => ({ jsonSchema: v }))).jsonSchema satisfies JsonSchema
      case x.tag === URI.intersect: return JsonSchema.IntersectJsonSchema(fn.map(x.def, (v) => ({ jsonSchema: v }))).jsonSchema satisfies JsonSchema
      case x.tag === URI.tuple: return JsonSchema.TupleJsonSchema(fn.map(x.def, (v) => ({ jsonSchema: v }))).jsonSchema satisfies JsonSchema
      case x.tag === URI.object: return JsonSchema.ObjectJsonSchema(fn.map(x.def, (v) => ({ jsonSchema: v }))).jsonSchema satisfies JsonSchema
    }
  }

  function handleOptionality(x: JsonSchema.Unary<t.Schema> & Record<typeof symbol.optional, unknown>) {
    let { [symbol.optional]: ix, ...y } = x;
    (y as any) = Recursive.fromJsonSchema(y)
    if (typeof ix !== 'number') return Recursive.fromJsonSchema(y)
    else while (ix-- > 0) (y as {}) = t.optional(y as never)
    return y
  }

  function recoverTupleOptionality(xs: readonly unknown[], { min, max }: { min: number, max: number }) {
    if (min !== max) {
      const firstOptional = min
      const req = xs.slice(0, firstOptional)
      const opt = xs.slice(firstOptional).map(t.optional.def)
      return [...req, ...opt]
    }
    else return xs
  }

  export const fromJsonSchema: T.Algebra<JsonSchema.Free, t.Schema> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case symbol.optional in x: return handleOptionality(x) as never
      case JsonSchema.isNull(x): return t.null
      case JsonSchema.isBoolean(x): return t.boolean
      case JsonSchema.isInteger(x): return t.integer
      case JsonSchema.isNumber(x): return t.number
      case JsonSchema.isString(x): return t.string
      case JsonSchema.isRecord(x): return t.record(x.additionalProperties)
      case JsonSchema.isAny(x): return t.unknown
      case JsonSchema.isAnyOf(x): return t.union.def(x.anyOf)
      case JsonSchema.isEnum(x): return t.union.def(x.enum.map((_) => t.eq(_)))
      case JsonSchema.isConst(x): return t.eq.def(x.const)
      case JsonSchema.isAllOf(x): return t.intersect.def(x.allOf)
      case JsonSchema.isTuple(x): return t.tuple.def(recoverTupleOptionality(x.items, { min: x.minItems, max: x.maxItems }))
      case JsonSchema.isArray(x): return t.array.def(x.items)
      case JsonSchema.isRecord(x): return t.record.def(x.additionalProperties as t.Fixpoint)
      case JsonSchema.isObject(x): return t.object(fn.map(x.properties, (v, k) => x.required.includes(`${k}`) ? v : t.optional(v)))
    }
  }
}

const fold
  : <T>(algebra: T.Algebra<t.Free, T>) => <S extends t.Schema>(term: S) => string
  = core.fold as never

export const toString
  : <S extends t.AnySchema>(schema: S) => string
  = fold(Recursive.toString)

export const toTypeString
  : <S extends t.Schema>(schema: S) => string
  = (schema) => trim(fold(Recursive.toTypeString)(schema))

type fromJsonSchema<T> = T extends { type: infer type extends string } ? Extract<t.Fixpoint, { tag: `${NS}${type}` }> : T

export const fromJsonSchema
  : <S extends JsonSchema.JsonSchema>(term: S) => t.AnySchema
  = JsonSchema.fold(Recursive.fromJsonSchema) as never


export const toJsonSchema
  : <S extends t.AnySchema>(term: S) => JsonSchema.JsonSchema // [S] extends [{ [symbol.optional]: any }] ? JsonSchema.JsonSchema & { [symbol.optional]: number } : JsonSchema.JsonSchema
  = t.fold(Recursive.toJsonSchema) as never
