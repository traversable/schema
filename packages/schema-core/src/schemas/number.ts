import type { Bounds, Unknown } from '@traversable/registry'
import {
  bindUserExtensions,
  carryover,
  Math_min,
  Math_max,
  Object_assign,
  URI,
  within,
} from '@traversable/registry'


export { number_ as number }

interface number_ extends number_.core {
  //<%= Types %>
}

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
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
