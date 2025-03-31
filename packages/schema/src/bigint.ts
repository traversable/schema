import { URI } from '@traversable/registry'

import type { Typeguard } from './types.js'
import type { Bounds } from './bounded.js'
import { withinBig } from './bounded.js'

/** @internal */
const Object_assign = globalThis.Object.assign

export function bounded(bounds: Bounds<number | bigint>): ((u: unknown) => boolean) & Bounds<number | bigint> & bigint_ {
  return Object_assign(function BoundedBigIntSchema(u: unknown) {
    return typeof u === 'bigint' && withinBig(bounds)(u)
  }, bounds, bigint_)
}


export { bigint_ as bigint }
interface bigint_ extends bigint_.base {
  min<T extends bigint>(minimum: T): bigint_.min<T>
  max<T extends bigint>(maximum: T): bigint_.max<T>
  moreThan<T extends bigint>(moreThan: T): bigint_.moreThan<T>
  lessThan<T extends bigint>(lessThan: T): bigint_.lessThan<T>
  between<Min extends bigint, Max extends bigint>(minimum: Min, maximum: Max): bigint_.between<[min: Min, max: Max]>
}
declare namespace bigint_ {
  interface base extends Typeguard<bigint> {
    tag: URI.bigint
    def: this['_type']
    minimum?: bigint
    maximum?: bigint
    exclusiveMinimum?: bigint
    exclusiveMaximum?: bigint
  }
  interface min<Min extends bigint> extends bigint_.base {
    minimum: Min
    max<Max extends bigint>(maximum: Max): bigint_.between<[min: Min, max: Max]>
    lessThan<Max extends bigint>(lessThan: Max): bigint_.minStrictMax<[min: Min, lessThan: Max]>
  }
  interface max<Max extends bigint> extends bigint_.base {
    maximum: Max
    min<Min extends bigint>(minimum: Min): bigint_.between<[min: Min, max: Max]>
    moreThan<Min extends bigint>(moreThan: Min): bigint_.maxStrictMin<[moreThan: Min, max: Max]>
  }
  interface moreThan<Min extends bigint> extends bigint_.base {
    exclusiveMinimum: Min
    max<Max extends bigint>(moreThan: Max): bigint_.maxStrictMin<[moreThan: Min, max: Max]>
    lessThan<Max extends bigint>(lessThan: Max): bigint_.strictlyBetween<[moreThan: Min, lessThan: Max]>
  }
  interface lessThan<Max extends bigint> extends bigint_.base {
    exclusiveMaximum: Max
    min<Min extends bigint>(minimum: Min): bigint_.minStrictMax<[min: Min, lessThan: Max]>
    moreThan<Min extends bigint>(moreThan: Min): bigint_.strictlyBetween<[moreThan: Min, lessThan: Max]>
  }
  interface between<Bounds extends [min: bigint, max: bigint]> extends bigint_.base {
    minimum: Bounds[0]
    maximum: Bounds[1]
  }
  interface minStrictMax<Bounds extends [min: bigint, lessThan: bigint]> extends bigint_.base {
    minimum: Bounds[0]
    exclusiveMaximum: Bounds[1]
  }
  interface maxStrictMin<Bounds extends [moreThan: bigint, max: bigint]> extends bigint_.base {
    maximum: Bounds[1]
    exclusiveMinimum: Bounds[0]
  }
  interface strictlyBetween<Bounds extends [moreThan: bigint, lessThan: bigint]> extends bigint_.base {
    exclusiveMinimum: Bounds[0]
    exclusiveMaximum: Bounds[1]
  }
}

const bigint_ = <bigint_>function BigIntSchema(src: unknown) { return typeof src === 'bigint' }
bigint_.tag = URI.bigint
bigint_.def = 0n
bigint_.min = (minimum) => Object_assign(bounded({ gte: minimum }), { minimum } as never)
bigint_.max = (maximum) => Object_assign(bounded({ lte: maximum }), { maximum } as never)
bigint_.moreThan = (exclusiveMinimum) => Object_assign(bounded({ gt: exclusiveMinimum }), { exclusiveMinimum } as never)
bigint_.lessThan = (exclusiveMaximum) => Object_assign(bounded({ lt: exclusiveMaximum }), { exclusiveMaximum } as never)
bigint_.between = (min, max, minimum = max < min ? max : min, maximum = max < min ? min : max) => {
  const bounds = { minimum, maximum } as { minimum: typeof min, maximum: typeof max }
  return Object_assign(bounded({ gte: minimum, lte: maximum }), bounds)
}
