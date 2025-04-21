/**  
 * never_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type { Equal, Unknown } from '@traversable/registry'
import { Object_assign, URI } from '@traversable/registry'
import type { t } from '../index.js'
import { NullaryErrors, type ValidationFn } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<never>
export function equals(left: never, right: never): boolean {
  return false
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): never }
export function toJsonSchema(): toJsonSchema {
  function neverToJsonSchema() { return void 0 as never }
  return neverToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'never' }
export function toString(): 'never' { return 'never' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<never>
export function validate(_?: never_): validate {
  validateNever.tag = URI.never
  function validateNever(u: unknown, path = Array.of<keyof any>()) { return [NullaryErrors.never(u, path)] }
  return validateNever
}
///    validate    ///
//////////////////////

export { never_ as never }

export let userDefinitions: Record<string, any> = {
  equals,
  toJsonSchema,
  toString,
}

export let userExtensions: Record<string, any> = {
  validate,
}

interface never_ extends never_.core {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

function NeverSchema(src: unknown): src is never { return false }
NeverSchema.tag = URI.never;
NeverSchema.def = void 0 as never

const never_ = <never_>Object_assign(
  NeverSchema,
  userDefinitions,
) as never_

Object_assign(never_, userExtensions)

export declare namespace never_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.never
    _type: never
    get def(): this['_type']
  }
}
