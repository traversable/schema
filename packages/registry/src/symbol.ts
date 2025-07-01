export {
  symbol_any as any,
  symbol_array as array,
  symbol_bad_data as bad_data,
  symbol_bigint as bigint,
  symbol_bottom as bottom,
  symbol_boolean as boolean,
  symbol_coalesce as coalesce,
  symbol_const as const,
  symbol_disjoint as disjoint,
  symbol_enum as enum,
  symbol_eq as eq,
  symbol_has as has,
  symbol_inline as inline,
  symbol_integer as integer,
  symbol_intersect as intersect,
  symbol_invalid_value as invalid_value,
  symbol_cache_hit as cache_hit,
  symbol_never as never,
  symbol_nonnullable as nonnullable,
  symbol_notfound as notfound,
  symbol_null as null,
  symbol_number as number,
  symbol_object as object,
  symbol_optional as optional,
  symbol_path as path,
  symbol_top as top,
  symbol_record as record,
  symbol_set as set,
  symbol_string as string,
  symbol_tag as tag,
  symbol_tuple as tuple,
  symbol_type as type,
  symbol_type_error as type_error,
  symbol_typeclass as typeclass,
  symbol_unknown as unknown,
  symbol_undefined as undefined,
  symbol_union as union,
  symbol_void as void,
  symbol_symbol as symbol,
}

import * as URI from './uri.js'

const symbol_any = Symbol.for(URI.any)
const symbol_array = Symbol.for(URI.array)
const symbol_bad_data = Symbol.for(URI.bad_data)
const symbol_bigint = Symbol.for(URI.bigint)
const symbol_bottom = Symbol.for(URI.bottom)
const symbol_boolean = Symbol.for(URI.boolean)
const symbol_coalesce = Symbol.for(URI.coalesce)
const symbol_const = Symbol.for(URI.const)
const symbol_disjoint = Symbol.for(URI.disjoint)
const symbol_enum = Symbol.for(URI.enum)
const symbol_eq = Symbol.for(URI.eq)
const symbol_has = Symbol.for(URI.has)
const symbol_inline = Symbol.for(URI.inline)
const symbol_integer = Symbol.for(URI.integer)
const symbol_intersect = Symbol.for(URI.intersect)
const symbol_cache_hit = Symbol.for(URI.cache_hit)
const symbol_invalid_value = Symbol.for(URI.invalid_value)
const symbol_never = Symbol.for(URI.never)
const symbol_nonnullable = Symbol.for(URI.nonnullable)
const symbol_notfound = Symbol.for(URI.notfound)
const symbol_null = Symbol.for(URI.null)
const symbol_number = Symbol.for(URI.number)
const symbol_object = Symbol.for(URI.object)
const symbol_optional = Symbol.for(URI.optional)
const symbol_path = Symbol.for(URI.path)
const symbol_top = Symbol.for(URI.top)
const symbol_record = Symbol.for(URI.record)
const symbol_set = Symbol.for(URI.set)
const symbol_string = Symbol.for(URI.string)
const symbol_symbol = Symbol.for(URI.symbol)
const symbol_tag = Symbol.for(URI.tag)
const symbol_tuple = Symbol.for(URI.tuple)
const symbol_type = Symbol.for(URI.type)
const symbol_type_error = Symbol.for(URI.type_error)
const symbol_typeclass = Symbol.for(URI.typeclass)
const symbol_unknown = Symbol.for(URI.unknown)
const symbol_undefined = Symbol.for(URI.undefined)
const symbol_union = Symbol.for(URI.union)
const symbol_void = Symbol.for(URI.void)

type symbol_any = typeof symbol_any
type symbol_array = typeof symbol_array
type symbol_bad_data = typeof symbol_bad_data
type symbol_bigint = typeof symbol_bigint
type symbol_bottom = typeof symbol_bottom
type symbol_boolean = typeof symbol_boolean
type symbol_coalesce = typeof symbol_coalesce
type symbol_const = typeof symbol_const
type symbol_disjoint = typeof symbol_disjoint
type symbol_enum = typeof symbol_enum
type symbol_eq = typeof symbol_eq
type symbol_inline = typeof symbol_inline
type symbol_integer = typeof symbol_integer
type symbol_invalid_value = typeof symbol_invalid_value
type symbol_cache_hit = typeof symbol_cache_hit
type symbol_has = typeof symbol_has
type symbol_never = typeof symbol_never
type symbol_nonnullable = typeof symbol_nonnullable
type symbol_notfound = typeof symbol_notfound
type symbol_null = typeof symbol_null
type symbol_number = typeof symbol_number
type symbol_object = typeof symbol_object
type symbol_optional = typeof symbol_optional
type symbol_path = typeof symbol_path
type symbol_top = typeof symbol_top
type symbol_record = typeof symbol_record
type symbol_set = typeof symbol_set
type symbol_string = typeof symbol_string
type symbol_symbol = typeof symbol_symbol
type symbol_tag = typeof symbol_tag
type symbol_tuple = typeof symbol_tuple
type symbol_type = typeof symbol_type
type symbol_type_error = typeof symbol_type_error
type symbol_typeclass = typeof symbol_typeclass
type symbol_unknown = typeof symbol_unknown
type symbol_undefined = typeof symbol_undefined
type symbol_union = typeof symbol_union
type symbol_void = typeof symbol_void

export const lookup = {
  any: symbol_any,
  array: symbol_array,
  bigint: symbol_bigint,
  bottom: symbol_bottom,
  boolean: symbol_boolean,
  const: symbol_const,
  eq: symbol_eq,
  has: symbol_has,
  inline: symbol_inline,
  integer: symbol_integer,
  intersect: symbol_intersect,
  cache_hit: symbol_cache_hit,
  never: symbol_never,
  nonnullable: symbol_nonnullable,
  notfound: symbol_notfound,
  null: symbol_null,
  number: symbol_number,
  object: symbol_object,
  optional: symbol_optional,
  top: symbol_top,
  record: symbol_record,
  string: symbol_string,
  symbol_: symbol_symbol,
  tag: symbol_tag,
  tuple: symbol_tuple,
  type: symbol_type,
  type_error: symbol_type_error,
  typeclass: symbol_typeclass,
  undefined: symbol_undefined,
  unknown: symbol_unknown,
  union: symbol_union,
  void: symbol_void,
} as const
