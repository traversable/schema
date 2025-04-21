/**  
 * any_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type { Equal, Unknown } from '@traversable/registry'
import { Object_assign, Object_is, URI } from '@traversable/registry'
import type { t } from '../index.js'
import type { ValidationFn } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<unknown>
export function equals(left: unknown, right: unknown): boolean {
  return Object_is(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): { type: 'object', properties: {}, nullable: true } }
export function toJsonSchema(): toJsonSchema {
  function unknownToJsonSchema() { return { type: 'object', properties: {}, nullable: true } as const }
  return unknownToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'any' }
export function toString(): 'any' { return 'any' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<any>
export function validate(_?: any_): validate {
  validateAny.tag = URI.any
  function validateAny() { return true as const }
  return validateAny
}
///    validate    ///
//////////////////////

export { any_ as any }

export let userDefinitions: Record<string, any> = {
  equals,
  toJsonSchema,
  toString,
}

export let userExtensions: Record<string, any> = {
  validate,
}

interface any_ extends any_.core {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

function AnySchema(src: unknown): src is any { return true }
AnySchema.tag = URI.any
AnySchema.def = void 0 as any

const any_ = <any_>Object_assign(
  AnySchema,
  userDefinitions,
) as any_

Object_assign(any_, userExtensions)

declare namespace any_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.any
    _type: any
    get def(): this['_type']
  }
}
