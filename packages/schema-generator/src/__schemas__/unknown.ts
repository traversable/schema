/**  
 * unknown_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema
 */
import type { Equal, Unknown } from '@traversable/registry'
import { Object_assign, Object_is, URI } from '@traversable/registry'
import type { t } from '../_exports.js'
import type { ValidationFn } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<any>
export function equals(left: any, right: any): boolean {
  return Object_is(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): { type: 'object', properties: {}, nullable: true } }
export function toJsonSchema(): toJsonSchema {
  function anyToJsonSchema() { return { type: 'object', properties: {}, nullable: true } as const }
  return anyToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'unknown' }
export function toString(): 'unknown' { return 'unknown' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<unknown>
export function validate(_?: unknown_): validate {
  validateUnknown.tag = URI.unknown
  function validateUnknown() { return true as const }
  return validateUnknown
}
///    validate    ///
//////////////////////

export { unknown_ as unknown }

export let userDefinitions: Record<string, any> = {
  equals,
  toJsonSchema,
  toString,
}

export let userExtensions: Record<string, any> = {
  validate,
}

interface unknown_ extends unknown_.core {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

function UnknownSchema(src: unknown): src is unknown { return true }
UnknownSchema.tag = URI.unknown
UnknownSchema.def = void 0 as unknown

const unknown_ = <unknown_>Object_assign(
  UnknownSchema,
  userDefinitions,
) as unknown_

Object_assign(unknown_, userExtensions)

declare namespace unknown_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.unknown
    _type: unknown
    get def(): this['_type']
  }
}
