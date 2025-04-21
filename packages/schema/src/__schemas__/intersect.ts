/**  
 * intersect schema
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
  intersect as intersect$,
  isUnknown as isAny,
  Object_assign,
  Object_is,
  URI
} from '@traversable/registry'
import type {
  Entry,
  IntersectType,
  Schema,
  SchemaLike
} from '../_namespace.js'
import type { t } from '../index.js'
import { getSchema } from '@traversable/schema-to-json-schema'
import { callToString } from '@traversable/schema-to-string'
import type { Validate, ValidationError, Validator } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals<S> = Equal<S['_type' & keyof S]>
export function equals<S extends readonly { equals: Equal }[]>(intersectSchema: intersect<[...S]>): equals<typeof intersectSchema>
export function equals<S extends readonly t.Schema[]>(intersectSchema: intersect<[...S]>): equals<typeof intersectSchema>
export function equals({ def }: intersect<{ equals: Equal }[]>): Equal<unknown> {
  function intersectEquals(l: unknown, r: unknown): boolean {
    if (Object_is(l, r)) return true
    for (let ix = def.length; ix-- !== 0;)
      if (!def[ix].equals(l, r)) return false
    return true
  }
  return intersectEquals
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema<S, T = S['def' & keyof S]> {
  (): {
    allOf: { [I in keyof T]: Returns<T[I]['toJsonSchema' & keyof T[I]]> }
  }
}

export function toJsonSchema<S extends readonly { toJsonSchema(): unknown }[]>(intersectSchema: intersect<S>): toJsonSchema<S>
export function toJsonSchema<S extends readonly t.Schema[]>(intersectSchema: intersect<S>): toJsonSchema<S>
export function toJsonSchema<S extends readonly { toJsonSchema(): unknown }[]>({ def }: intersect<S>): () => {} {
  function intersectToJsonSchema() {
    return {
      allOf: def.map(getSchema)
    }
  }
  return intersectToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString<S, T = S['def' & keyof S]> {
  (): never | [T] extends [readonly []] ? 'unknown'
    /* @ts-expect-error */
    : `(${Join<{ [I in keyof T]: Returns<T[I]['toString']> }, ' & '>})`
}

export function toString<S>(intersectSchema: intersect<S>): toString<S>
export function toString<S>({ def }: intersect<S>): () => string {
  function intersectToString() {
    return Array_isArray(def) ? def.length === 0 ? 'never' : `(${def.map(callToString).join(' & ')})` : 'unknown'
  }
  return intersectToString
}
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate<T> = Validate<T['_type' & keyof T]>

export function validate<S extends readonly Validator[]>(intersectSchema: intersect<S>): validate<S>
export function validate<S extends readonly t.Schema[]>(intersectSchema: intersect<S>): validate<S>
export function validate({ def }: intersect<readonly Validator[]>) {
  validateIntersect.tag = URI.intersect
  function validateIntersect(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
    let errors = Array.of<ValidationError>()
    for (let i = 0; i < def.length; i++) {
      let results = def[i].validate(u, path)
      if (results !== true)
        for (let j = 0; j < results.length; j++) errors.push(results[j])
    }
    return errors.length === 0 || errors
  }
  return validateIntersect
}
///    validate    ///
//////////////////////

export function intersect<S extends readonly Schema[]>(...schemas: S): intersect<S>
export function intersect<S extends readonly SchemaLike[], T extends { [I in keyof S]: Entry<S[I]> }>(...schemas: S): intersect<T>
export function intersect(...schemas: readonly unknown[]) {
  return intersect.def(schemas)
}

export interface intersect<S> extends intersect.core<S> {
  toString: toString<this>
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  validate: validate<this>
}

export namespace intersect {
  export let userDefinitions: Record<string, any> = {
    } as intersect<unknown>
  export function def<T extends readonly unknown[]>(xs: readonly [...T]): intersect<T>
  export function def(xs: readonly unknown[]): {} {
    let userExtensions: Record<string, any> = {
      toJsonSchema,
      validate,
      toString,
      equals,
    }
    const predicate = xs.every(_isPredicate) ? intersect$(xs) : isAny
    function IntersectSchema(src: unknown) { return predicate(src) }
    IntersectSchema.tag = URI.intersect
    IntersectSchema.def = xs
    Object_assign(IntersectSchema, intersect.userDefinitions)
    return Object_assign(IntersectSchema, bindUserExtensions(IntersectSchema, userExtensions))
  }
}

export declare namespace intersect {
  interface core<S> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.intersect
    get def(): S
    _type: IntersectType<S>
  }
  type type<S, T = IntersectType<S>> = never | T
}
