/**  
 * optional schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type {
  Equal,
  Force,
  Returns,
  Unknown
} from '@traversable/registry'
import {
  _isPredicate,
  bindUserExtensions,
  has,
  isUnknown as isAny,
  Object_assign,
  Object_is,
  optional as optional$,
  symbol,
  URI
} from '@traversable/registry'
import type { Entry, Schema, SchemaLike } from '../_namespace.js'
import type { t } from '../_exports.js'
import { getSchema, wrapOptional } from '@traversable/schema-to-json-schema'
import { callToString } from '@traversable/schema-to-string'
import type { Validate, ValidationFn, Validator } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals<T> = never | Equal<T['_type' & keyof T]>
export function equals<S extends { equals: Equal }>(optionalSchema: optional<S>): equals<typeof optionalSchema>
export function equals<S extends t.Schema>(optionalSchema: optional<S>): equals<typeof optionalSchema>
export function equals({ def }: optional<{ equals: Equal }>): Equal<unknown> {
  return function optionalEquals(l: unknown, r: unknown): boolean {
    if (Object_is(l, r)) return true
    return def.equals(l, r)
  }
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
type Nullable<T> = Force<T & { nullable: true }>

export interface toJsonSchema<S, T = S['def' & keyof S]> {
  (): Nullable<Returns<T['toJsonSchema' & keyof T]>>
  [symbol.optional]: number
}

export function toJsonSchema<S>(optionalSchema: optional<S>): toJsonSchema<S>
export function toJsonSchema({ def }: optional<unknown>) {
  function optionalToJsonSchema() { return getSchema(def) }
  optionalToJsonSchema[symbol.optional] = wrapOptional(def)
  return optionalToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString<S, T = S['def' & keyof S]> {
  /* @ts-expect-error */
  (): never | `(${ReturnType<T['toString']>} | undefined)`
}

export function toString<S>(optionalSchema: optional<S>): toString<typeof optionalSchema>
export function toString<S>({ def }: optional<S>): () => string {
  function optionalToString(): string {
    return '(' + callToString(def) + ' | undefined)'
  }
  return optionalToString
}
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate<T> = Validate<T['_type' & keyof T]>

export function validate<S extends Validator>(optionalSchema: optional<S>): validate<S>
export function validate<S extends t.Schema>(optionalSchema: optional<S>): validate<S>
export function validate({ def }: optional<Validator>): ValidationFn<unknown> {
  validateOptional.tag = URI.optional
  validateOptional.optional = 1
  function validateOptional(u: unknown, path = Array.of<keyof any>()) {
    if (u === void 0) return true
    return def.validate(u, path)
  }
  return validateOptional
}
///    validate    ///
//////////////////////

export function optional<S extends Schema>(schema: S): optional<S>
export function optional<S extends SchemaLike>(schema: S): optional<Entry<S>>
export function optional<S>(schema: S): optional<S> { return optional.def(schema) }

export interface optional<S> extends optional.core<S> {
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  toString: toString<this>
  validate: validate<this>
}

export namespace optional {
  export let userDefinitions: Record<string, any> = {
    }
  export function def<T>(x: T): optional<T>
  export function def<T>(x: T) {
    let userExtensions: Record<string, any> = {
      toString,
      equals,
      toJsonSchema,
      validate,
    }
    const predicate = _isPredicate(x) ? optional$(x) : isAny
    function OptionalSchema(src: unknown) { return predicate(src) }
    OptionalSchema.tag = URI.optional
    OptionalSchema.def = x
    OptionalSchema[symbol.optional] = 1
    Object_assign(OptionalSchema, { ...optional.userDefinitions, get def() { return x } })
    return Object_assign(OptionalSchema, bindUserExtensions(OptionalSchema, userExtensions))
  }
  export const is
    : <S extends Schema>(u: unknown) => u is optional<S>
    = <never>has('tag', (u) => u === URI.optional)
}

export declare namespace optional {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.optional
    _type: undefined | S['_type' & keyof S]
    def: S
    [symbol.optional]: number
  }
  export type type<S, T = undefined | S['_type' & keyof S]> = never | T
}
