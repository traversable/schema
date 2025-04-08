import * as Spec from './specification.js'
import { t } from '@traversable/schema'

import * as JsonSchema from './jsonSchema.js'
import { symbol as Sym } from '@traversable/registry'

export {
  toJsonSchemaAny as any,
  toJsonSchemaUnknown as unknown,
  toJsonSchemaNull as null,
  toJsonSchemaBoolean as boolean,
  toJsonSchemaInteger as integer,
  toJsonSchemaNumber as number,
  toJsonSchemaString as string,
  toJsonSchemaEq as eq,
  toJsonSchemaArray as array,
  toJsonSchemaOptional as optional,
  toJsonSchemaRecord as record,
  toJsonSchemaUnion as union,
  toJsonSchemaIntersect as intersect,
  toJsonSchemaTuple as tuple,
  toJsonSchemaObject as object,
}

function toJsonSchemaAny(this: t.any) { return Spec.RAW.any }
function toJsonSchemaUnknown(this: t.unknown) { return Spec.RAW.any }
function toJsonSchemaNull(this: t.null) { return Spec.RAW.null }
function toJsonSchemaBoolean(this: t.boolean) { return JsonSchema.boolean() }
function toJsonSchemaInteger(this: t.integer) { return JsonSchema.integer(this) }
function toJsonSchemaNumber(this: t.number) { return JsonSchema.number(this) }
function toJsonSchemaString(this: t.string) { return JsonSchema.string(this) }
function toJsonSchemaEq<V>(this: t.eq<V>) { return JsonSchema.eq(this.def) }
function toJsonSchemaOptional<S extends t.Schema>(this: t.optional<S>) { return JsonSchema.optionalProto(this.def) }
function toJsonSchemaRecord<S extends t.Schema>(this: t.record<S>) { return JsonSchema.record(this.def) }
function toJsonSchemaUnion<S extends t.Schema[]>(this: t.union<S>) { return JsonSchema.union(this.def) }
function toJsonSchemaIntersect<S extends readonly t.Schema[]>(this: t.intersect<S>) { return JsonSchema.intersect(this.def) }
function toJsonSchemaTuple<S extends readonly t.Schema[]>(this: t.tuple<S>) { return JsonSchema.tuple(this.def) }
function toJsonSchemaObject<S extends { [x: string]: t.Schema }>(this: t.object<S>) { return JsonSchema.object(this.def) }
function toJsonSchemaArray<S extends t.Schema>(this: t.array<S>) {
  return JsonSchema.array(this.def, { minLength: this.minLength, maxLength: this.maxLength })
}
