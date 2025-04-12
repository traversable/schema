import type { Unknown } from '@traversable/registry'
import {
  Object_assign,
  URI,
  bindUserExtensions,
} from '@traversable/registry'

import type { Bounds } from '@traversable/schema-core'
import { __carryover as carryover, __withinBig as within } from '@traversable/schema-core'

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

interface bigint_ extends bigint_.core {
  //<%= Types %>
}

export { bigint_ as bigint }

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
    def: this['_type']
    minimum?: bigint
    maximum?: bigint
  }
  type Min<X extends bigint, Self>
    = [Self] extends [{ maximum: bigint }]
    ? bigint_.between<[min: X, max: Self['maximum']]>
    : bigint_.min<X>
    ;
  type Max<X extends bigint, Self>
    = [Self] extends [{ minimum: bigint }]
    ? bigint_.between<[min: Self['minimum'], max: X]>
    : bigint_.max<X>
    ;
  interface methods {
    min<Min extends bigint>(minimum: Min): bigint_.Min<Min, this>
    max<Max extends bigint>(maximum: Max): bigint_.Max<Max, this>
    between<Min extends bigint, Max extends bigint>(minimum: Min, maximum: Max): bigint_.between<[min: Min, max: Max]>
  }
  interface min<Min extends bigint> extends bigint_ { minimum: Min }
  interface max<Max extends bigint> extends bigint_ { maximum: Max }
  interface between<Bounds extends [min: bigint, max: bigint]> extends bigint_ { minimum: Bounds[0], maximum: Bounds[1] }
}

function boundedBigInt(bounds: Bounds<number | bigint>, carry?: Partial<bigint_>): ((u: unknown) => boolean) & Bounds<number | bigint> & bigint_
function boundedBigInt(bounds: Bounds<number | bigint>, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number | bigint> & bigint_
function boundedBigInt(bounds: Bounds<number | bigint>, carry?: {}): {} {
  return Object_assign(function BoundedBigIntSchema(u: unknown) {
    return bigint_(u) && within(bounds)(u)
  }, carry, bigint_)
}
