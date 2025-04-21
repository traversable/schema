/**  
 * record schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type * as T from '@traversable/registry'
import type { Equal, Returns, Unknown } from '@traversable/registry'
import {
  _isPredicate,
  Array_isArray,
  bindUserExtensions,
  isAnyObject,
  Object_assign,
  Object_hasOwn,
  Object_is,
  Object_keys,
  record as record$,
  URI
} from '@traversable/registry'
import type { Entry, Schema, SchemaLike } from '../_namespace.js'
import type { t } from '../index.js'
import { getSchema } from '@traversable/schema-to-json-schema'
import { callToString } from '@traversable/schema-to-string'
import type { ValidationError, ValidationFn, Validator } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals<T> = never | Equal<T['_type' & keyof T]>
export function equals<S extends { equals: Equal }>(recordSchema: record<S>): equals<typeof recordSchema>
export function equals<S extends t.Schema>(recordSchema: record<S>): equals<typeof recordSchema>
export function equals({ def }: record<{ equals: Equal }>): Equal<Record<string, unknown>> {
  function recordEquals(l: Record<string, unknown>, r: Record<string, unknown>): boolean {
    if (Object_is(l, r)) return true
    if (!l || typeof l !== 'object' || Array_isArray(l)) return false
    if (!r || typeof r !== 'object' || Array_isArray(r)) return false
    const lhs = Object_keys(l)
    const rhs = Object_keys(r)
    let len = lhs.length
    let k: string
    if (len !== rhs.length) return false
    for (let ix = len; ix-- !== 0;) {
      k = lhs[ix]
      if (!Object_hasOwn(r, k)) return false
      if (!(def.equals(l[k], r[k]))) return false
    }
    len = rhs.length
    for (let ix = len; ix-- !== 0;) {
      k = rhs[ix]
      if (!Object_hasOwn(l, k)) return false
      if (!(def.equals(l[k], r[k]))) return false
    }
    return true
  }
  return recordEquals
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema<S, T = S['def' & keyof S]> {
  (): {
    type: 'object'
    additionalProperties: T.Returns<T['toJsonSchema' & keyof T]>
  }
}

export function toJsonSchema<S extends t.Schema>(recordSchema: record<S>): toJsonSchema<typeof recordSchema>
export function toJsonSchema<S>(recordSchema: record<S>): toJsonSchema<typeof recordSchema>
export function toJsonSchema({ def }: { def: unknown }): () => { type: 'object', additionalProperties: unknown } {
  return function recordToJsonSchema() {
    return {
      type: 'object' as const,
      additionalProperties: getSchema(def),
    }
  }
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString<T> {
  /* @ts-expect-error */
  (): never | `Record<string, ${Returns<T['def']['toString']>}>`
}

export function toString<S extends record<t.Schema>>(recordSchema: S): toString<typeof recordSchema>
export function toString<S>(recordSchema: record<S>): toString<typeof recordSchema>
export function toString({ def }: { def: unknown }): () => string {
  function recordToString() {
    return `Record<string, ${callToString(def)}>`
  }
  return recordToString
}
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate<S> = never | ValidationFn<S['_type' & keyof S]>
export function validate<S extends Validator>(recordSchema: record<S>): validate<typeof recordSchema>
export function validate<S extends t.Schema>(recordSchema: record<S>): validate<typeof recordSchema>
export function validate<S extends Validator>({ def: { validate = () => true } }: record<S>) {
  validateRecord.tag = URI.record
  function validateRecord(u: unknown, path = Array.of<keyof any>()) {
    if (!u || typeof u !== 'object' || Array_isArray(u)) return [NullaryErrors.record(u, path)]
    let errors = Array.of<ValidationError>()
    let keys = Object_keys(u)
    for (let k of keys) {
      let y = u[k]
      let results = validate(y, [...path, k])
      if (results === true) continue
      else errors.push(...results)
    }
    return errors.length === 0 || errors
  }
  return validateRecord
}
///    validate    ///
//////////////////////

export function record<S extends Schema>(schema: S): record<S>
export function record<S extends SchemaLike>(schema: S): record<Entry<S>>
export function record(schema: Schema) {
  return record.def(schema)
}

export interface record<S> extends record.core<S> {
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  toString: toString<this>
  validate: validate<this>
}

export namespace record {
  export let userDefinitions: Record<string, any> = {
    }
  export function def<T>(x: T): record<T>
  export function def(x: unknown): {} {
    let userExtensions: Record<string, any> = {
      toString,
      equals,
      toJsonSchema,
      validate,
    }
    const predicate = _isPredicate(x) ? record$(x) : isAnyObject
    function RecordSchema(src: unknown) { return predicate(src) }
    RecordSchema.tag = URI.record
    RecordSchema.def = x
    Object_assign(RecordSchema, record.userDefinitions)
    return Object_assign(RecordSchema, bindUserExtensions(RecordSchema, userExtensions))
  }
}

export declare namespace record {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.record
    get def(): S
    _type: Record<string, S['_type' & keyof S]>
  }
  export type type<S, T = Record<string, S['_type' & keyof S]>> = never | T
}
