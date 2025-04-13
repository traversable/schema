/**  
 * string_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema
 */
import type {
  Bounds,
  Equal,
  Force,
  Integer,
  PickIfDefined,
  Unknown
} from '@traversable/registry'
import {
  bindUserExtensions,
  carryover,
  has,
  Math_max,
  Math_min,
  Object_assign,
  URI,
  within
} from '@traversable/registry'
import type { t } from '../_exports.js'
import type { SizeBounds } from '@traversable/schema-to-json-schema'
import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<number>
export function equals(left: string, right: string): boolean {
  return left === right
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema<T> {
  (): Force<{ type: 'string' } & PickIfDefined<T, keyof SizeBounds>>
}

export function toJsonSchema<S extends string_>(schema: S): toJsonSchema<S>
export function toJsonSchema(schema: string_): () => { type: 'string' } & Partial<SizeBounds> {
  function stringToJsonSchema() {
    const minLength = has('minLength', (u: any) => typeof u === 'number')(schema) ? schema.minLength : null
    const maxLength = has('maxLength', (u: any) => typeof u === 'number')(schema) ? schema.maxLength : null
    let out: { type: 'string' } & Partial<SizeBounds> = { type: 'string' }
    minLength !== null && void (out.minLength = minLength)
    maxLength !== null && void (out.maxLength = maxLength)

    return out
  }
  return stringToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'string' }
export function toString(): 'string' { return 'string' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<string>
export function validate<S extends string_>(stringSchema: S): validate {
  validateString.tag = URI.string
  function validateString(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
    return stringSchema(u) || [NullaryErrors.number(u, path)]
  }
  return validateString
}
///    validate    ///
//////////////////////

export { string_ as string }

/** @internal */
function boundedString(bounds: Bounds, carry?: Partial<string_>): ((u: unknown) => boolean) & Bounds<number> & string_
function boundedString(bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & string_
function boundedString(bounds: Bounds, carry?: {}): {} {
  return Object_assign(function BoundedStringSchema(u: unknown) {
    return string_(u) && within(bounds)(u.length)
  }, carry, string_)
}

interface string_ extends string_.core {
  equals: equals
  toJsonSchema: toJsonSchema<this>
  toString: toString
  validate: validate
}

export let userDefinitions: Record<string, any> = {
  toString,
  equals,
}

export let userExtensions: Record<string, any> = {
  toJsonSchema,
  validate,
}

function StringSchema(src: unknown) { return typeof src === 'string' }
StringSchema.tag = URI.string
StringSchema.def = ''

const string_ = <string_>Object_assign(
  StringSchema,
  userDefinitions,
) as string_

string_.min = function stringMinLength(minLength) {
  return Object_assign(
    boundedString({ gte: minLength }, carryover(this, 'minLength')),
    { minLength },
  )
}
string_.max = function stringMaxLength(maxLength) {
  return Object_assign(
    boundedString({ lte: maxLength }, carryover(this, 'maxLength')),
    { maxLength },
  )
}
string_.between = function stringBetween(
  min,
  max,
  minLength = <typeof min>Math_min(min, max),
  maxLength = <typeof max>Math_max(min, max)) {
  return Object_assign(
    boundedString({ gte: minLength, lte: maxLength }),
    { minLength, maxLength },
  )
}

Object_assign(
  string_,
  bindUserExtensions(string_, userExtensions),
)

declare namespace string_ {
  interface core extends string_.methods {
    (u: this['_type'] | Unknown): u is this['_type']
    _type: string
    tag: URI.string
    get def(): this['_type']
  }
  interface methods {
    minLength?: number
    maxLength?: number
    min<Min extends Integer<Min>>(minLength: Min): string_.Min<Min, this>
    max<Max extends Integer<Max>>(maxLength: Max): string_.Max<Max, this>
    between<Min extends Integer<Min>, Max extends Integer<Max>>(minLength: Min, maxLength: Max): string_.between<[min: Min, max: Max]>
  }
  type Min<Min extends number, Self>
    = [Self] extends [{ maxLength: number }]
    ? string_.between<[min: Min, max: Self['maxLength']]>
    : string_.min<Min>
    ;
  type Max<Max extends number, Self>
    = [Self] extends [{ minLength: number }]
    ? string_.between<[min: Self['minLength'], max: Max]>
    : string_.max<Max>
    ;
  interface min<Min extends number> extends string_ { minLength: Min }
  interface max<Max extends number> extends string_ { maxLength: Max }
  interface between<Bounds extends [min: number, max: number]> extends string_ {
    minLength: Bounds[0]
    maxLength: Bounds[1]
  }
}
