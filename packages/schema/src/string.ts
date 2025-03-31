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


export function bounded(bounds: Bounds): ((u: unknown) => boolean) & Bounds<number> & string_ {
  return Object_assign(function BoundedStringSchema(u: unknown) {
    return typeof u === 'string' && within(bounds)(u.length)
  }, bounds, string_)
}


export { string_ as string }
interface string_ extends string_.base {
  min<T extends number>(minLength: T): string_.min<T>
  max<T extends number>(maxLength: T): string_.max<T>
  between<Min extends number, Max extends number>(minLength: Min, maxLength: Max): string_.between<[min: Min, max: Max]>
}
declare namespace string_ {
  interface base extends Typeguard<string> {
    tag: URI.string
    def: this['_type']
    minLength?: number
    maxLength?: number
  }
  interface min<Min extends number> extends string_.base {
    minLength: Min
    max<Max extends number>(maxLength: Max): string_.between<[min: Min, max: Max]>
  }
  interface max<Max extends number> extends string_.base {
    maxLength: Max
    min<Min extends number>(minLength: Min): string_.between<[min: Min, max: Max]>
  }
  interface between<Bounds extends [min: number, max: number]> extends string_.base {
    minLength: Bounds[0]
    maxLength: Bounds[1]
  }
}
const string_ = <string_>function StringSchema(src: unknown) { return typeof src === 'string' }
string_.tag = URI.string
string_.def = ''
string_.min = (minLength) => Object_assign(bounded({ gte: minLength }), { minLength } as never)
string_.max = (maxLength) => Object_assign(bounded({ lte: maxLength }), { maxLength } as never)
string_.between = (min, max, minLength = Math_min(min, max), maxLength = Math_max(min, max)) => {
  const bounds = { minLength, maxLength } as { minLength: typeof min, maxLength: typeof max }
  return Object_assign(bounded({ gte: minLength, lte: maxLength }), bounds)
}
