/**  
 * bigint_ schema
 * made with ᯓᡣ𐭩 by @traversable/schema@0.0.35
 */
import type { Bounds, Equal, Unknown } from '@traversable/registry'
import {
  bindUserExtensions,
  carryover,
  Object_assign,
  Object_is,
  URI,
  withinBig as within
} from '@traversable/registry'
import type { ValidationError, ValidationFn } from '@traversable/derive-validators'
import { NullaryErrors } from '@traversable/derive-validators'
import type { t } from '../index.js'
////////////////////
///    equals    ///
export type equals = Equal<bigint>
export function equals(left: bigint, right: bigint): boolean {
  return Object_is(left, right)
}
///    equals    ///
////////////////////
//////////////////////////
///    toJsonSchema    ///
export interface toJsonSchema { (): void }
export function toJsonSchema(): toJsonSchema {
  function bigintToJsonSchema(): void {
    return void 0
  }
  return bigintToJsonSchema
}
///    toJsonSchema    ///
//////////////////////////
//////////////////////
///    toString    ///
export interface toString { (): 'bigint' }
export function toString(): 'bigint' { return 'bigint' }
///    toString    ///
//////////////////////
//////////////////////
///    validate    ///
export type validate = ValidationFn<bigint>
export function validate<S extends bigint_>(bigIntSchema: S): validate {
  validateBigInt.tag = URI.bigint
  function validateBigInt(u: unknown, path = Array.of<keyof any>()): true | ValidationError[] {
    return bigIntSchema(u) || [NullaryErrors.bigint(u, path)]
  }
  return validateBigInt
}
///    validate    ///
//////////////////////

export { bigint_ as bigint }

/** @internal */
function boundedBigInt(bounds: Bounds<number | bigint>, carry?: Partial<bigint_>): ((u: unknown) => boolean) & Bounds<number | bigint> & bigint_
function boundedBigInt(bounds: Bounds<number | bigint>, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number | bigint> & bigint_
function boundedBigInt(bounds: Bounds<number | bigint>, carry?: {}): {} {
  return Object_assign(function BoundedBigIntSchema(u: unknown) {
    return bigint_(u) && within(bounds)(u)
  }, carry, bigint_)
}

interface bigint_ extends bigint_.core {
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

function BigIntSchema(src: unknown) { return typeof src === 'bigint' }
BigIntSchema.tag = URI.bigint
BigIntSchema.def = 0n

const bigint_ = <bigint_>Object_assign(
  BigIntSchema,
  userDefinitions,
) as bigint_

bigint_.min = function bigIntMin(minimum) {
  return Object_assign(
    boundedBigInt({ gte: minimum }, carryover(this, 'minimum')),
    { minimum },
  )
}
bigint_.max = function bigIntMax(maximum) {
  return Object_assign(
    boundedBigInt({ lte: maximum }, carryover(this, 'maximum')),
    { maximum },
  )
}
bigint_.between = function bigIntBetween(
  min,
  max,
  minimum = <typeof min>(max < min ? max : min),
  maximum = <typeof max>(max < min ? min : max),
) {
  return Object_assign(
    boundedBigInt({ gte: minimum, lte: maximum }),
    { minimum, maximum }
  )
}

Object_assign(
  bigint_,
  bindUserExtensions(bigint_, userExtensions),
)

declare namespace bigint_ {
  interface core extends bigint_.methods {
    (u: this['_type'] | Unknown): u is this['_type']
    _type: bigint
    tag: URI.bigint
    get def(): this['_type']
    minimum?: bigint
    maximum?: bigint
  }
  type Min<X extends bigint, Self>
    = [Self] extends [{ maximum: bigint }]
    ? bigint_.between<[min: X, max: Self['maximum']]>
    : bigint_.min<X>
    
  type Max<X extends bigint, Self>
    = [Self] extends [{ minimum: bigint }]
    ? bigint_.between<[min: Self['minimum'], max: X]>
    : bigint_.max<X>
    
  interface methods {
    min<const Min extends bigint>(minimum: Min): bigint_.Min<Min, this>
    max<const Max extends bigint>(maximum: Max): bigint_.Max<Max, this>
    between<const Min extends bigint, const Max extends bigint>(
      minimum: Min,
      maximum: Max
    ): bigint_.between<[min: Min, max: Max]>
  }
  interface min<Min extends bigint> extends bigint_ { minimum: Min }
  interface max<Max extends bigint> extends bigint_ { maximum: Max }
  interface between<Bounds extends [min: bigint, max: bigint]> extends bigint_ { minimum: Bounds[0], maximum: Bounds[1] }
}
