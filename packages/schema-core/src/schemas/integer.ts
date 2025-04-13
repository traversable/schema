import type { Bounds, Integer, Unknown } from '@traversable/registry'
import {
  bindUserExtensions,
  carryover,
  Math_min,
  Math_max,
  Number_isSafeInteger,
  Object_assign,
  URI,
  within,
} from '@traversable/registry'


export { integer }

/** @internal */
function boundedInteger(bounds: Bounds, carry?: Partial<integer>): ((u: unknown) => boolean) & Bounds<number> & integer
function boundedInteger(bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & integer
function boundedInteger(bounds: Bounds, carry?: {}): {} {
  return Object_assign(function BoundedIntegerSchema(u: unknown) {
    return integer(u) && within(bounds)(u)
  }, carry, integer)
}

interface integer extends integer.core {
  //<%= Types %>
}

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

function IntegerSchema(src: unknown) { return Number_isSafeInteger(src) }
IntegerSchema.tag = URI.integer
IntegerSchema.def = 0

const integer = Object_assign(
  <integer>IntegerSchema,
  userDefinitions,
) as integer

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

Object_assign(
  integer,
  bindUserExtensions(integer, userExtensions),
)

declare namespace integer {
  interface core extends integer.methods {
    (u: this['_type'] | Unknown): u is this['_type']
    _type: number
    tag: URI.integer
    get def(): this['_type']
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
