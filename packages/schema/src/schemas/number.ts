/**  
 * t.number schema
 * made with ᯓᡣ𐭩 by @traversable/schema
 */
import type {
  Bounds,
  Equal,
  Force,
  PickIfDefined,
  Unknown
} from '@traversable/registry'
import {
  bindUserExtensions,
  carryover,
  Math_max,
  Math_min,
  Object_assign,
  SameValueNumber,
  URI,
  within
} from '@traversable/registry'
import type { t } from '../_exports.js'
import type { NumericBounds } from '@traversable/schema-to-json-schema'
import { getNumericBounds } from '@traversable/schema-to-json-schema'
import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'
////////////////////
///    equals    ///
export type equals = Equal<number>
export function equals(left: number, right: number): boolean {
  return SameValueNumber(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema<T> { (): Force<{ type: 'number' } & PickIfDefined<T, keyof NumericBounds>> }

export function toJsonSchema<S extends t.number>(schema: S): toJsonSchema<S>
export function toJsonSchema(schema: t.number): toJsonSchema<t.number> {
  function numberToJsonSchema() {
    const { exclusiveMaximum, exclusiveMinimum, maximum, minimum } = getNumericBounds(schema)
    let bounds: NumericBounds = {}
    if (typeof exclusiveMinimum === 'number') bounds.exclusiveMinimum = exclusiveMinimum
    if (typeof exclusiveMaximum === 'number') bounds.exclusiveMaximum = exclusiveMaximum
    if (typeof minimum === 'number') bounds.minimum = minimum
    if (typeof maximum === 'number') bounds.maximum = maximum
    return {
      type: 'number' as const,
      ...bounds,
    }
  }
  return numberToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'number' }
export function toString(): 'number' { return 'number' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<number>
export function validate<S extends t.number>(numberSchema: S): validate {
  validateNumber.tag = URI.number
  function validateNumber(u: unknown, path: (keyof any)[] = []): true | ValidationError[] {
    return numberSchema(u) || [NullaryErrors.number(u, path)]
  }
  return validateNumber
}
///    validate    ///
//////////////////////

export { number_ as number }

interface number_ extends number_.core {
  toString: toString
  equals: equals
  toJsonSchema: toJsonSchema<this>
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

function NumberSchema(src: unknown) { return typeof src === 'number' }
NumberSchema.tag = URI.number
NumberSchema.def = 0

const number_ = Object_assign(
  <number_>NumberSchema,
  userDefinitions,
) as number_

number_.min = function numberMin(minimum) {
  return Object_assign(
    boundedNumber({ gte: minimum }, carryover(this, 'minimum')),
    { minimum },
  )
}
number_.max = function numberMax(maximum) {
  return Object_assign(
    boundedNumber({ lte: maximum }, carryover(this, 'maximum')),
    { maximum },
  )
}
number_.moreThan = function numberMoreThan(exclusiveMinimum) {
  return Object_assign(
    boundedNumber({ gt: exclusiveMinimum }, carryover(this, 'exclusiveMinimum')),
    { exclusiveMinimum },
  )
}
number_.lessThan = function numberLessThan(exclusiveMaximum) {
  return Object_assign(
    boundedNumber({ lt: exclusiveMaximum }, carryover(this, 'exclusiveMaximum')),
    { exclusiveMaximum },
  )
}
number_.between = function numberBetween(
  min,
  max,
  minimum = <typeof min>Math_min(min, max),
  maximum = <typeof max>Math_max(min, max),
) {
  return Object_assign(
    boundedNumber({ gte: minimum, lte: maximum }),
    { minimum, maximum },
  )
}

Object_assign(
  number_,
  bindUserExtensions(number_, userExtensions),
)

function boundedNumber(bounds: Bounds, carry?: Partial<number_>): ((u: unknown) => boolean) & Bounds<number> & number_
function boundedNumber(bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & number_
function boundedNumber(bounds: Bounds, carry?: {}): {} {
  return Object_assign(function BoundedNumberSchema(u: unknown) {
    return typeof u === 'number' && within(bounds)(u)
  }, carry, number_)
}

declare namespace number_ {
  interface core extends number_.methods {
    (u: this['_type'] | Unknown): u is this['_type']
    _type: number
    tag: URI.number
    get def(): this['_type']
    minimum?: number
    maximum?: number
    exclusiveMinimum?: number
    exclusiveMaximum?: number
  }
  interface methods {
    min<Min extends number>(minimum: Min): number_.Min<Min, this>
    max<Max extends number>(maximum: Max): number_.Max<Max, this>
    moreThan<Min extends number>(moreThan: Min): ExclusiveMin<Min, this>
    lessThan<Max extends number>(lessThan: Max): ExclusiveMax<Max, this>
    between<Min extends number, Max extends number>(minimum: Min, maximum: Max): number_.between<[min: Min, max: Max]>
  }
  type Min<X extends number, Self>
    = [Self] extends [{ exclusiveMaximum: number }]
    ? number_.minStrictMax<[min: X, max: Self['exclusiveMaximum']]>
    : [Self] extends [{ maximum: number }]
    ? number_.between<[min: X, max: Self['maximum']]>
    : number_.min<X>
    ;
  type Max<X extends number, Self>
    = [Self] extends [{ exclusiveMinimum: number }]
    ? number_.maxStrictMin<[Self['exclusiveMinimum'], X]>
    : [Self] extends [{ minimum: number }]
    ? number_.between<[min: Self['minimum'], max: X]>
    : number_.max<X>
    ;
  type ExclusiveMin<X extends number, Self>
    = [Self] extends [{ exclusiveMaximum: number }]
    ? number_.strictlyBetween<[X, Self['exclusiveMaximum']]>
    : [Self] extends [{ maximum: number }]
    ? number_.maxStrictMin<[min: X, Self['maximum']]>
    : number_.moreThan<X>
    ;
  type ExclusiveMax<X extends number, Self>
    = [Self] extends [{ exclusiveMinimum: number }]
    ? number_.strictlyBetween<[Self['exclusiveMinimum'], X]>
    : [Self] extends [{ minimum: number }]
    ? number_.minStrictMax<[Self['minimum'], min: X]>
    : number_.lessThan<X>
    ;
  interface min<Min extends number> extends number_ { minimum: Min }
  interface max<Max extends number> extends number_ { maximum: Max }
  interface moreThan<Min extends number> extends number_ { exclusiveMinimum: Min }
  interface lessThan<Max extends number> extends number_ { exclusiveMaximum: Max }
  interface between<Bounds extends [min: number, max: number]> extends number_ { minimum: Bounds[0], maximum: Bounds[1] }
  interface minStrictMax<Bounds extends [min: number, max: number]> extends number_ { minimum: Bounds[0], exclusiveMaximum: Bounds[1] }
  interface maxStrictMin<Bounds extends [min: number, max: number]> extends number_ { maximum: Bounds[1], exclusiveMinimum: Bounds[0] }
  interface strictlyBetween<Bounds extends [min: number, max: number]> extends number_ { exclusiveMinimum: Bounds[0], exclusiveMaximum: Bounds[1] }
}
