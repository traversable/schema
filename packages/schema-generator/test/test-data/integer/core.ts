import type { Integer } from '@traversable/registry'
import {
  Math_min,
  Math_max,
  Number_isSafeInteger,
  Object_assign,
  URI,
} from '@traversable/registry'

import type { Bounds } from '@traversable/schema'
import { __carryover as carryover, __within as within } from '@traversable/schema'

export let userDefinitions = {
  //<%= terms %>
}

export { integer }
interface integer extends integer.core {
  //<%= types %>
}

declare namespace integer {
  interface core extends integer.methods {
    (u: unknown): u is this['_type']
    _type: number
    tag: URI.integer
    def: this['_type']
    minimum?: number
    maximum?: number
  }
  interface methods {
    min<Min extends Integer<Min>>(minimum: Min): integer.Min<Min, this>
    max<Max extends Integer<Max>>(maximum: Max): integer.Max<Max, this>
    between<Min extends Integer<Min>, Max extends Integer<Max>>(minimum: Min, maximum: Max): integer.between<[min: Min, max: Max]>
  }
  type Min<X extends number, Self>
    = [Self] extends [{ maximum: number }]
    ? integer.between<[min: X, max: Self['maximum']]>
    : integer.min<X>
  type Max<X extends number, Self>
    = [Self] extends [{ minimum: number }]
    ? integer.between<[min: Self['minimum'], max: X]>
    : integer.max<X>
  interface min<Min extends number> extends integer { minimum: Min }
  interface max<Max extends number> extends integer { maximum: Max }
  interface between<Bounds extends [min: number, max: number]> extends integer { minimum: Bounds[0], maximum: Bounds[1] }
}
const integer = Object_assign(
  <integer>function IntegerSchema(src: unknown) { return Number_isSafeInteger(src) },
  userDefinitions,
) as integer

integer.tag = URI.integer
integer.def = 0
integer.min = function integerMin(minimum) {
  return Object_assign(
    boundedInteger({ gte: minimum }, carryover(this, 'minimum')),
    { minimum },
  )
}
integer.max = function integerMax(maximum) {
  return Object_assign(
    boundedInteger({ lte: maximum }, carryover(this, 'maximum')),
    { maximum },
  )
}
integer.between = function integerBetween(
  min,
  max,
  minimum = <typeof min>Math_min(min, max),
  maximum = <typeof max>Math_max(min, max),
) {
  return Object_assign(
    boundedInteger({ gte: minimum, lte: maximum }),
    { minimum, maximum },
  )
}

function boundedInteger(bounds: Bounds, carry?: Partial<integer>): ((u: unknown) => boolean) & Bounds<number> & integer
function boundedInteger(bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & integer
function boundedInteger(bounds: Bounds, carry?: {}): {} {
  return Object_assign(function BoundedIntegerSchema(u: unknown) {
    return integer(u) && within(bounds)(u)
  }, carry, integer)
}
