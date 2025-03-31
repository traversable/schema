import { URI } from '@traversable/registry'

import type { Typeguard } from './types.js'
import type { Bounds } from './bounded.js'
import { within } from './bounded.js'

/** @internal */
const Object_assign = globalThis.Object.assign

/** @internal */
const Math_min = globalThis.Math.min

/** @internal */
const Math_max = globalThis.Math.max

/** @internal */
const Number_isSafeInteger
  : (u: unknown) => u is number
  = globalThis.Number.isSafeInteger as never

export function bounded(bounds: Bounds): ((u: unknown) => boolean) & Bounds<number> & integer {
  return Object_assign(function BoundedIntegerSchema(u: unknown) {
    return Number_isSafeInteger(u) && within(bounds)(u)
  }, bounds, integer)
}


export { integer }
interface integer extends integer.base {
  min<T extends number>(minimum: T): integer.min<T>
  max<T extends number>(maximum: T): integer.max<T>
  moreThan<T extends number>(moreThan: T): integer.moreThan<T>
  lessThan<T extends number>(lessThan: T): integer.lessThan<T>
  between<Min extends number, Max extends number>(minimum: Min, maximum: Max): integer.between<[min: Min, max: Max]>
}

declare namespace integer {
  interface base extends Typeguard<number> {
    tag: URI.integer
    def: this['_type']
    minimum?: number
    maximum?: number
    exclusiveMinimum?: number
    exclusiveMaximum?: number
  }
  interface min<Min extends number> extends integer.base {
    minimum: Min
    max<Max extends number>(maximum: Max): integer.between<[min: Min, max: Max]>
    lessThan<Max extends number>(lessThan: Max): integer.minStrictMax<[min: Min, lessThan: Max]>
  }
  interface max<Max extends number> extends integer.base {
    maximum: Max
    min<Min extends number>(minimum: Min): integer.between<[min: Min, max: Max]>
    moreThan<Min extends number>(moreThan: Min): integer.maxStrictMin<[moreThan: Min, max: Max]>
  }
  interface moreThan<Min extends number> extends integer.base {
    exclusiveMinimum: Min
    max<Max extends number>(moreThan: Max): integer.maxStrictMin<[moreThan: Min, max: Max]>
    lessThan<Max extends number>(lessThan: Max): integer.strictlyBetween<[moreThan: Min, lessThan: Max]>
  }
  interface lessThan<Max extends number> extends integer.base {
    exclusiveMaximum: Max
    min<Min extends number>(minimum: Min): integer.minStrictMax<[min: Min, lessThan: Max]>
    moreThan<Min extends number>(moreThan: Min): integer.strictlyBetween<[moreThan: Min, lessThan: Max]>
  }
  interface between<Bounds extends [min: number, max: number]> extends integer.base {
    minimum: Bounds[0]
    maximum: Bounds[1]
  }
  interface minStrictMax<Bounds extends [min: number, lessThan: number]> extends integer.base {
    minimum: Bounds[0]
    exclusiveMaximum: Bounds[1]
  }
  interface maxStrictMin<Bounds extends [moreThan: number, max: number]> extends integer.base {
    maximum: Bounds[1]
    exclusiveMinimum: Bounds[0]
  }
  interface strictlyBetween<Bounds extends [moreThan: number, lessThan: number]> extends integer.base {
    exclusiveMinimum: Bounds[0]
    exclusiveMaximum: Bounds[1]
  }
}

const integer = <integer>function IntegerSchema(src: unknown) { return Number_isSafeInteger(src) }
integer.tag = URI.integer
integer.def = 0
integer.min = (minimum) => Object_assign(bounded({ gte: minimum }), { minimum } as never)
integer.max = (maximum) => Object_assign(bounded({ lte: maximum }), { maximum } as never)
integer.moreThan = (exclusiveMinimum) => Object_assign(bounded({ gt: exclusiveMinimum }), { exclusiveMinimum } as never)
integer.lessThan = (exclusiveMaximum) => Object_assign(bounded({ lt: exclusiveMaximum }), { exclusiveMaximum } as never)
integer.between = (min, max, minimum = Math_min(min, max), maximum = Math_max(min, max)) => {
  const bounds = { minimum, maximum } as { minimum: typeof min, maximum: typeof max }
  return Object_assign(bounded({ gte: minimum, lte: maximum }), bounds)
}
