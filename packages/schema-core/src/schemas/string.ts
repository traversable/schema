import type { Bounds, Integer, Unknown } from '@traversable/registry'
import {
  bindUserExtensions,
  carryover,
  Math_min,
  Math_max,
  Object_assign,
  URI,
  within,
} from '@traversable/registry'

export { string_ as string }

/** @internal */
function boundedString(bounds: Bounds, carry?: Partial<string_>): ((u: unknown) => boolean) & Bounds<number> & string_
function boundedString(bounds: Bounds, carry?: { [x: string]: unknown }): ((u: unknown) => boolean) & Bounds<number> & string_
function boundedString(bounds: Bounds, carry?: {}): {} {
  return Object_assign(function BoundedStringSchema(u: unknown) {
    return string_(u) && within(bounds)(u.length)
  }, carry, string_)
}

interface string_ extends string_.core {
  //<%= Types %>
}

export let userDefinitions: Record<string, any> = {
  //<%= Definitions %>
}

export let userExtensions: Record<string, any> = {
  //<%= Extensions %>
}

function StringSchema(src: unknown) { return typeof src === 'string' }
StringSchema.tag = URI.string
StringSchema.def = ''

const string_ = <string_>Object_assign(
  StringSchema,
  userDefinitions,
) as string_

string_.min = function stringMinLength(minLength) {
  return Object_assign(
    boundedString({ gte: minLength }, carryover(this, 'minLength')),
    { minLength },
  )
}
string_.max = function stringMaxLength(maxLength) {
  return Object_assign(
    boundedString({ lte: maxLength }, carryover(this, 'maxLength')),
    { maxLength },
  )
}
string_.between = function stringBetween(
  min,
  max,
  minLength = <typeof min>Math_min(min, max),
  maxLength = <typeof max>Math_max(min, max)) {
  return Object_assign(
    boundedString({ gte: minLength, lte: maxLength }),
    { minLength, maxLength },
  )
}

Object_assign(
  string_,
  bindUserExtensions(string_, userExtensions),
)

declare namespace string_ {
  interface core extends string_.methods {
    (u: this['_type'] | Unknown): u is this['_type']
    _type: string
    tag: URI.string
    get def(): this['_type']
  }
  interface methods {
    minLength?: number
    maxLength?: number
    min<Min extends Integer<Min>>(minLength: Min): string_.Min<Min, this>
    max<Max extends Integer<Max>>(maxLength: Max): string_.Max<Max, this>
    between<Min extends Integer<Min>, Max extends Integer<Max>>(minLength: Min, maxLength: Max): string_.between<[min: Min, max: Max]>
  }
  type Min<Min extends number, Self>
    = [Self] extends [{ maxLength: number }]
    ? string_.between<[min: Min, max: Self['maxLength']]>
    : string_.min<Min>
    ;
  type Max<Max extends number, Self>
    = [Self] extends [{ minLength: number }]
    ? string_.between<[min: Self['minLength'], max: Max]>
    : string_.max<Max>
    ;
  interface min<Min extends number> extends string_ { minLength: Min }
  interface max<Max extends number> extends string_ { maxLength: Max }
  interface between<Bounds extends [min: number, max: number]> extends string_ {
    minLength: Bounds[0]
    maxLength: Bounds[1]
  }
}
