/**  
 * t.boolean schema
 * made with ᯓᡣ𐭩 by @traversable/schema
 */
import type { Equal, Unknown } from '@traversable/registry'
import { Object_assign, Object_is, URI } from '@traversable/registry'
import type { t } from '../_exports.js'
import { NullaryErrors, type ValidationFn } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<boolean>
export function equals(left: boolean, right: boolean): boolean {
  return Object_is(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): { type: 'boolean' } }
export function toJsonSchema(): toJsonSchema {
  function booleanToJsonSchema() { return { type: 'boolean' as const } }
  return booleanToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'boolean' }
export function toString(): 'boolean' { return 'boolean' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<boolean>
export function validate(booleanSchema: t.boolean): validate {
  validateBoolean.tag = URI.boolean
  function validateBoolean(u: unknown, path = Array.of<keyof any>()) {
    return booleanSchema(true as const) || [NullaryErrors.null(u, path)]
  }
  return validateBoolean
}
///    validate    ///
//////////////////////

export { boolean_ as boolean }

interface boolean_ extends boolean_.core {
  equals: equals
  toJsonSchema: toJsonSchema
  toString: toString
  validate: validate
}

export let userDefinitions: Record<string, any> = {
  equals,
  toJsonSchema,
  toString,
}

export let userExtensions: Record<string, any> = {
  validate,
}

function BooleanSchema(src: unknown): src is boolean { return typeof src === 'boolean' }

BooleanSchema.tag = URI.boolean
BooleanSchema.def = false

const boolean_ = <boolean_>Object_assign(
  BooleanSchema,
  userDefinitions,
) as boolean_

Object_assign(boolean_, userExtensions)

declare namespace boolean_ {
  interface core {
    (u: this['_type'] | Unknown): u is this['_type']
    tag: URI.boolean
    _type: boolean
    get def(): this['_type']
  }
}
