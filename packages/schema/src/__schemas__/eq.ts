/**  
 * eq schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type {
  Key,
  Mut,
  Mutable,
  SchemaOptions as Options,
  Unknown
} from '@traversable/registry'
import {
  _isPredicate,
  applyOptions,
  bindUserExtensions,
  Equal,
  getConfig,
  laxEquals,
  Object_assign,
  URI
} from '@traversable/registry'
import type { t } from '../index.js'
import { stringify } from '@traversable/schema-to-string'
import type { Validate } from '@traversable/derive-validators'
import { Errors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals<T> = never | Equal<T['def' & keyof T]>
export function equals<V>(eqSchema: eq<V>): equals<typeof eqSchema>
export function equals(): Equal<unknown> {
  return function eqEquals(left: any, right: any) {
    return laxEquals(left, right)
  }
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema<S, T = S['def' & keyof S]> { (): { const: T } }
export function toJsonSchema<V>(eqSchema: eq<V>): toJsonSchema<typeof eqSchema>
export function toJsonSchema<V>({ def }: eq<V>) {
  function eqToJsonSchema() { return { const: def } }
  return eqToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString<S, T = S['def' & keyof S]> {
  (): [Key<T>] extends [never]
    ? [T] extends [symbol] ? 'symbol' : 'symbol'
    : [T] extends [string] ? `'${T}'` : Key<T>
}

export function toString<V>(eqSchema: eq<V>): toString<typeof eqSchema>
export function toString<V>({ def }: eq<V>): () => string {
  function eqToString(): string {
    return typeof def === 'symbol' ? 'symbol' : stringify(def)
  }
  return eqToString
}
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate<T> = Validate<T['_type' & keyof T]>
export function validate<V>(eqSchema: eq<V>): validate<V>
export function validate<V>({ def }: eq<V>): validate<V> {
  validateEq.tag = URI.eq
  function validateEq(u: unknown, path = Array.of<keyof any>()) {
    let options = getConfig().schema
    let equals = options?.eq?.equalsFn || Equal.lax
    if (equals(def, u)) return true
    else return [Errors.eq(u, path, def)]
  }
  return validateEq
}
///    validate    ///
//////////////////////

export function eq<const V extends Mut<V>>(value: V, options?: Options<V>): eq<Mutable<V>>
export function eq<const V>(value: V, options?: Options<V>): eq<V>
export function eq<const V>(value: V, options?: Options<V>): eq<V> {
  return eq.def(value, options)
}

export interface eq<V> extends eq.core<V> {
  equals: equals<this>
  toJsonSchema: toJsonSchema<this>
  toString: toString<this>
  validate: validate<this>
}

export namespace eq {
  export let userDefinitions: Record<string, any> = {
    }
  export function def<T>(value: T, options?: Options): eq<T>
  export function def<T>(x: T, $?: Options): {} {
    let userExtensions: Record<string, any> = {
      toString,
      equals,
      toJsonSchema,
      validate,
    }
    const options = applyOptions($)
    const predicate = _isPredicate(x) ? x : (y: unknown) => options.eq.equalsFn(x, y)
    function EqSchema(src: unknown) { return predicate(src) }
    EqSchema.tag = URI.eq
    EqSchema.def = x
    Object_assign(EqSchema, eq.userDefinitions)
    return Object_assign(EqSchema, bindUserExtensions(EqSchema, userExtensions))
  }
}

export declare namespace eq {
  interface core<V> {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.eq
    _type: V
    get def(): V
  }
}
