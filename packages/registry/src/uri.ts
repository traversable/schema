export {
  // data types
  URI_any as any,
  URI_array as array,
  URI_bigint as bigint,
  URI_boolean as boolean,
  URI_eq as eq,
  URI_inline as inline,
  URI_intersect as intersect,
  URI_never as never,
  URI_null as null,
  URI_number as number,
  URI_object as object,
  URI_optional as optional,
  URI_record as record,
  URI_string as string,
  URI_symbol as symbol,
  URI_tuple as tuple,
  URI_unknown as unknown,
  URI_undefined as undefined,
  URI_union as union,
  URI_void as void,
  // misc.
  URI_bottom as bottom,
  URI_cache_hit as cache_hit,
  URI_const as const,
  URI_nonnullable as nonnullable,
  URI_notfound as notfound,
  URI_tag as tag,
  URI_top as top,
  URI_type as type,
  URI_type_error as type_error,
  URI_typeclass as typeclass,
}

export const SCOPE = '@traversable/schema/URI'

export const NS = `${SCOPE}::`
export type NS = typeof NS

// data types
const URI_any = `${NS}any` as const
type URI_any = typeof URI_any
const URI_array = `${NS}array` as const
type URI_array = typeof URI_array
const URI_bigint = `${NS}bigint` as const
type URI_bigint = typeof URI_bigint
const URI_boolean = `${NS}boolean` as const
type URI_boolean = typeof URI_boolean
const URI_eq = `${NS}eq` as const
type URI_eq = typeof URI_eq
const URI_inline = `${NS}inline` as const
type URI_inline = typeof URI_inline
const URI_intersect = `${NS}intersect` as const
type URI_intersect = typeof URI_intersect
const URI_never = `${NS}never` as const
type URI_never = typeof URI_never
const URI_null = `${NS}null` as const
type URI_null = typeof URI_null
const URI_number = `${NS}number` as const
type URI_number = typeof URI_number
const URI_object = `${NS}object` as const
type URI_object = typeof URI_object
const URI_optional = `${NS}optional` as const
type URI_optional = typeof URI_optional
const URI_record = `${NS}record` as const
type URI_record = typeof URI_record
const URI_string = `${NS}string` as const
type URI_string = typeof URI_string
const URI_symbol = `${NS}symbol` as const
type URI_symbol = typeof URI_symbol
const URI_tuple = `${NS}tuple` as const
type URI_tuple = typeof URI_tuple
const URI_unknown = `${NS}unknown` as const
type URI_unknown = typeof URI_unknown
const URI_undefined = `${NS}undefined` as const
type URI_undefined = typeof URI_undefined
const URI_union = `${NS}union` as const
type URI_union = typeof URI_union
const URI_void = `${NS}void` as const
type URI_void = typeof URI_void

// misc.
const URI_bottom = `${NS}bottom` as const
type URI_bottom = typeof URI_bottom
const URI_cache_hit = `${NS}cache_hit` as const
type URI_cache_hit = typeof URI_cache_hit
const URI_const = `${NS}const` as const
type URI_const = typeof URI_const
const URI_nonnullable = `${NS}nonnullable` as const
type URI_nonnullable = typeof URI_nonnullable
const URI_notfound = `${NS}notfound` as const
type URI_notfound = typeof URI_notfound
const URI_tag = `${NS}tag` as const
type URI_tag = typeof URI_tag
const URI_top = `${NS}top` as const
type URI_top = typeof URI_top
const URI_type = `${NS}type` as const
type URI_type = typeof URI_type
const URI_type_error = `${NS}type_error` as const
type URI_type_error = typeof URI_type_error
const URI_typeclass = `${NS}typeclass` as const
type URI_typeclass = typeof URI_typeclass
