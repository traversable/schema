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

export function bounded(bounds: Bounds): ((u: unknown) => boolean) & Bounds<number> & number_ {
  return Object_assign(function BoundedNumberSchema(u: unknown) {
    return typeof u === 'number' && within(bounds)(u)
  }, bounds, number_)
}

export { number_ as number }
interface number_ extends number_.base {
  min<T extends number>(minimum: T): number_.min<T>
  max<T extends number>(maximum: T): number_.max<T>
  moreThan<T extends number>(moreThan: T): number_.moreThan<T>
  lessThan<T extends number>(lessThan: T): number_.lessThan<T>
  between<Min extends number, Max extends number>(minimum: Min, maximum: Max): number_.between<[min: Min, max: Max]>
}
declare namespace number_ {
  interface base extends Typeguard<number> {
    tag: URI.number
    def: this['_type']
    minimum?: number
    maximum?: number
    exclusiveMinimum?: number
    exclusiveMaximum?: number
  }
  interface min<Min extends number> extends number_.base {
    minimum: Min
    max<Max extends number>(maximum: Max): number_.between<[min: Min, max: Max]>
    lessThan<Max extends number>(lessThan: Max): number_.minStrictMax<[min: Min, lessThan: Max]>
  }
  interface max<Max extends number> extends number_.base {
    maximum: Max
    min<Min extends number>(minimum: Min): number_.between<[min: Min, max: Max]>
    moreThan<Min extends number>(moreThan: Min): number_.maxStrictMin<[moreThan: Min, max: Max]>
  }
  interface moreThan<Min extends number> extends number_.base {
    exclusiveMinimum: Min
    max<Max extends number>(moreThan: Max): number_.maxStrictMin<[moreThan: Min, max: Max]>
    lessThan<Max extends number>(lessThan: Max): number_.strictlyBetween<[moreThan: Min, lessThan: Max]>
  }
  interface lessThan<Max extends number> extends number_.base {
    exclusiveMaximum: Max
    min<Min extends number>(minimum: Min): number_.minStrictMax<[min: Min, lessThan: Max]>
    moreThan<Min extends number>(moreThan: Min): number_.strictlyBetween<[moreThan: Min, lessThan: Max]>
  }
  interface between<Bounds extends [min: number, max: number]> extends number_.base {
    minimum: Bounds[0]
    maximum: Bounds[1]
  }
  interface minStrictMax<Bounds extends [min: number, max: number]> extends number_.base {
    minimum: Bounds[0]
    exclusiveMaximum: Bounds[1]
  }
  interface maxStrictMin<Bounds extends [min: number, max: number]> extends number_.base {
    maximum: Bounds[1]
    exclusiveMinimum: Bounds[0]
  }
  interface strictlyBetween<Bounds extends [min: number, max: number]> extends number_.base {
    exclusiveMinimum: Bounds[0]
    exclusiveMaximum: Bounds[1]
  }
}

const number_ = <number_>function NumberSchema(src: unknown) { return typeof src === 'number' }
number_.tag = URI.number
number_.def = 0
number_.min = (minimum) => Object_assign(bounded({ gte: minimum }), { minimum } as never)
number_.max = (maximum) => Object_assign(bounded({ lte: maximum }), { maximum } as never)
number_.moreThan = (exclusiveMinimum) => Object_assign(bounded({ gt: exclusiveMinimum }), { exclusiveMinimum } as never)
number_.lessThan = (exclusiveMaximum) => Object_assign(bounded({ lt: exclusiveMaximum }), { exclusiveMaximum } as never)
number_.between = (min, max, minimum = Math_min(min, max), maximum = Math_max(min, max)) => {
  const bounds = { minimum, maximum } as { minimum: typeof min, maximum: typeof max }
  return Object_assign(bounded({ gte: minimum, lte: maximum }), bounds)
}
