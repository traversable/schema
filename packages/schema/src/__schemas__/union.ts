/**  
 * union schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type {
  Equal,
  Join,
  Returns,
  Unknown
} from '@traversable/registry'
import {
  _isPredicate,
  Array_isArray,
  bindUserExtensions,
  isUnknown as isAny,
  Object_assign,
  Object_is,
  union as union$,
  URI
} from '@traversable/registry'
import type { Entry, Schema, SchemaLike } from '../_namespace.js'
import type { t } from '../index.js'
import { getSchema } from '@traversable/schema-to-json-schema'
import { callToString } from '@traversable/schema-to-string'
import type { Validate, ValidationError, Validator } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals<S> = Equal<S['_type' & keyof S]>
export function equals<S extends readonly { equals: Equal }[]>(unionSchema: union<[...S]>): equals<typeof unionSchema>
export function equals<S extends readonly t.Schema[]>(unionSchema: union<[...S]>): equals<typeof unionSchema>
export function equals({ def }: union<{ equals: Equal }[]>): Equal<unknown> {
  function unionEquals(l: unknown, r: unknown): boolean {
    if (Object_is(l, r)) return true
    for (let ix = def.length; ix-- !== 0;)
      if (def[ix].equals(l, r)) return true
    return false
  }
  return unionEquals
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema<S, T = S['def' & keyof S]> {
  (): { anyOf: { [I in keyof T]: Returns<T[I]['toJsonSchema' & keyof T[I]]> } }
}

export function toJsonSchema<S extends readonly { toJsonSchema(): unknown }[]>(unionSchema: union<S>): toJsonSchema<S>
export function toJsonSchema<S extends readonly t.Schema[]>(unionSchema: union<S>): toJsonSchema<S>
export function toJsonSchema<S extends readonly { toJsonSchema(): unknown }[]>({ def }: union<S>): () => {} {
  return function unionToJsonSchema() {
    return {
      anyOf: def.map(getSchema)
    }
  }
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString<S, T = S['def' & keyof S]> {
  (): never | [T] extends [readonly []] ? 'never'
    /* @ts-expect-error */
    : `(${Join<{ [I in keyof T]: ReturnType<T[I]['toString']> }, ' | '>})`
}

export function toString<S>(unionSchema: union<S>): toString<S>
export function toString<S>({ def }: union<S>): () => string {
  function unionToString() {
    return Array_isArray(def) ? def.length === 0 ? 'never' : `(${def.map(callToString).join(' | ')})` : 'unknown'
  }
  return unionToString
}
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate<T> = Validate<T['_type' & keyof T]>

export function validate<S extends readonly Validator[]>(unionSchema: union<S>): validate<S>
export function validate<S extends readonly t.Schema[]>(unionSchema: union<S>): validate<S>
export function validate({ def }: union<readonly Validator[]>) {
  validateUnion.tag = URI.union
  function validateUnion(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
    // if (this.def.every((x) => t.optional.is(x.validate))) validateUnion.optional = 1;
    let errors = Array.of<ValidationError>()
    for (let i = 0; i < def.length; i++) {
      let results = def[i].validate(u, path)
      if (results === true) {
        // validateUnion.optional = 0
        return true
      }
      for (let j = 0; j < results.length; j++) errors.push(results[j])
    }
    // validateUnion.optional = 0
    return errors.length === 0 || errors
  }
  return validateUnion
}
///    validate    ///
//////////////////////

export function union<S extends readonly Schema[]>(...schemas: S): union<S>
export function union<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: S): union<T>
export function union(...schemas: unknown[]) {
  return union.def(schemas)
}

export interface union<S> extends union.core<S> {
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  toString: toString<this>
  validate: validate<this>
}

export namespace union {
  export let userDefinitions: Record<string, any> = {
    } as Partial<union<unknown>>
  export function def<T extends readonly unknown[]>(xs: T): union<T>
  export function def(xs: unknown[]) {
    let userExtensions: Record<string, any> = {
      toString,
      equals,
      toJsonSchema,
      validate,
    }
    const predicate = xs.every(_isPredicate) ? union$(xs) : isAny
    function UnionSchema(src: unknown): src is unknown { return predicate(src) }
    UnionSchema.tag = URI.union
    UnionSchema.def = xs
    Object_assign(UnionSchema, union.userDefinitions)
    return Object_assign(UnionSchema, bindUserExtensions(UnionSchema, userExtensions))
  }
}

export declare namespace union {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.union
    _type: union.type<S>
    get def(): S
  }
  type type<S, T = S[number & keyof S]['_type' & keyof S[number & keyof S]]> = never | T
}
