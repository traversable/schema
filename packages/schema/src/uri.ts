export { URI, symbol }

export const SCOPE = '@traversable/schema/URI'
export const NS = `${SCOPE}::`
export type NS = typeof NS

const URI_any = `${NS}any` as const
const URI_array = `${NS}array` as const
const URI_bigint = `${NS}bigint` as const
const URI_boolean = `${NS}boolean` as const
const URI_const = `${NS}const` as const
const URI_def = `${NS}def` as const
const URI_eq = `${NS}eq` as const
const URI_function = `${NS}function` as const
const URI_inline = `${NS}inline` as const
const URI_integer = `${NS}integer` as const
const URI_intersect = `${NS}intersect` as const
const URI_key = `${NS}key` as const
const URI_null = `${NS}null` as const
const URI_never = `${NS}never` as const
const URI_nonnullable = `${NS}nonnullable` as const
const URI_notfound = `${NS}notfound` as const
const URI_number = `${NS}number` as const
const URI_object = `${NS}object` as const
const URI_optional = `${NS}optional` as const
const URI_record = `${NS}record` as const
const URI_string = `${NS}string` as const
const URI_symbol = `${NS}symbol` as const
const URI_tag = `${NS}tag` as const
const URI_tuple = `${NS}tuple` as const
const URI_type = `${NS}type` as const
const URI_typeclass = `${NS}typeclass` as const
const URI_type_error = `${NS}type_error` as const
const URI_unknown = `${NS}unknown` as const
const URI_undefined = `${NS}undefined` as const
const URI_union = `${NS}union` as const
const URI_void = `${NS}void` as const

type URI_any = typeof URI_any
type URI_array = typeof URI_array
type URI_bigint = typeof URI_bigint
type URI_boolean = typeof URI_boolean
type URI_const = typeof URI_const
type URI_def = typeof URI_def
type URI_eq = typeof URI_eq
type URI_function = typeof URI_function
type URI_inline = typeof URI_inline
type URI_integer = typeof URI_integer
type URI_intersect = typeof URI_intersect
type URI_key = typeof URI_key
type URI_never = typeof URI_never
type URI_nonnullable = typeof URI_nonnullable
type URI_notfound = typeof URI_notfound
type URI_null = typeof URI_null
type URI_number = typeof URI_number
type URI_object = typeof URI_object
type URI_optional = typeof URI_optional
type URI_record = typeof URI_record
type URI_string = typeof URI_string
type URI_symbol = typeof URI_symbol
type URI_tag = typeof URI_tag
type URI_tuple = typeof URI_tuple
type URI_type = typeof URI_type
type URI_typeclass = typeof URI_typeclass
type URI_type_error = typeof URI_type_error
type URI_unknown = typeof URI_unknown
type URI_undefined = typeof URI_undefined
type URI_union = typeof URI_union
type URI_void = typeof URI_void

function URI() { }
declare namespace URI {
  export {
    URI,
    URI_any as any,
    URI_array as array,
    URI_bigint as bigint,
    URI_boolean as boolean,
    URI_const as const,
    URI_def as def,
    URI_eq as eq,
    URI_function as function,
    URI_inline as inline,
    URI_integer as integer,
    URI_intersect as intersect,
    URI_key as key,
    URI_never as never,
    URI_nonnullable as nonnullable,
    URI_notfound as notfound,
    URI_null as null,
    URI_number as number,
    URI_object as object,
    URI_optional as optional,
    URI_record as record,
    URI_string as string,
    URI_symbol as symbol_,
    URI_tag as tag,
    URI_tuple as tuple,
    URI_type as type,
    URI_typeclass as typeclass,
    URI_type_error as type_error,
    URI_unknown as unknown,
    URI_undefined as undefined,
    URI_union as union,
    URI_void as void,
  }
}

namespace URI {
  void (URI.any = URI_any)
  void (URI.array = URI_array)
  void (URI.bigint = URI_bigint)
  void (URI.boolean = URI_boolean)
  void (URI.const = URI_const)
  void (URI.def = URI_def)
  void (URI.eq = URI_eq)
  void (URI.function = URI_function)
  void (URI.inline = URI_inline)
  void (URI.integer = URI_integer)
  void (URI.intersect = URI_intersect)
  void (URI.key = URI_key)
  void (URI.never = URI_never)
  void (URI.nonnullable = URI_nonnullable)
  void (URI.notfound = URI_notfound)
  void (URI.null = URI_null)
  void (URI.number = URI_number)
  void (URI.object = URI_object)
  void (URI.optional = URI_optional)
  void (URI.record = URI_record)
  void (URI.string = URI_string)
  void (URI.symbol_ = URI_symbol)
  void (URI.tag = URI_tag)
  void (URI.tuple = URI_tuple)
  void (URI.type = URI_type)
  void (URI.typeclass = URI_typeclass)
  void (URI.type_error = URI_type_error)
  void (URI.unknown = URI_unknown)
  void (URI.undefined = URI_undefined)
  void (URI.union = URI_union)
  void (URI.void = URI_void)
}

const symbol_any = Symbol.for(URI_any)
const symbol_array = Symbol.for(URI_array)
const symbol_bigint = Symbol.for(URI_bigint)
const symbol_boolean = Symbol.for(URI_boolean)
const symbol_const = Symbol.for(URI_const)
const symbol_def = Symbol.for(URI_def)
const symbol_eq = Symbol.for(URI_eq)
const symbol_function = Symbol.for(URI_function)
const symbol_key = Symbol.for(URI_key)
const symbol_inline = Symbol.for(URI_inline)
const symbol_integer = Symbol.for(URI_integer)
const symbol_intersect = Symbol.for(URI_intersect)
const symbol_never = Symbol.for(URI_never)
const symbol_nonnullable = Symbol.for(URI_nonnullable)
const symbol_notfound = Symbol.for(URI_notfound)
const symbol_null = Symbol.for(URI_null)
const symbol_number = Symbol.for(URI_number)
const symbol_object = Symbol.for(URI_object)
const symbol_optional = Symbol.for(URI_optional)
const symbol_record = Symbol.for(URI_record)
const symbol_string = Symbol.for(URI_string)
const symbol_symbol = Symbol.for(URI_symbol)
const symbol_tag = Symbol.for(URI_tag)
const symbol_tuple = Symbol.for(URI_tuple)
const symbol_type = Symbol.for(URI_type)
const symbol_typeclass = Symbol.for(URI_typeclass)
const symbol_type_error = Symbol.for(URI_type_error)
const symbol_unknown = Symbol.for(URI_unknown)
const symbol_undefined = Symbol.for(URI_undefined)
const symbol_union = Symbol.for(URI_union)
const symbol_void = Symbol.for(URI_void)

type symbol_any = typeof symbol_any
type symbol_array = typeof symbol_array
type symbol_bigint = typeof symbol_bigint
type symbol_boolean = typeof symbol_boolean
type symbol_const = typeof symbol_const
type symbol_def = typeof symbol_def
type symbol_eq = typeof symbol_eq
type symbol_function = typeof symbol_function
type symbol_inline = typeof symbol_inline
type symbol_integer = typeof symbol_integer
type symbol_intersect = typeof symbol_intersect
type symbol_key = typeof symbol_key
type symbol_never = typeof symbol_never
type symbol_nonnullable = typeof symbol_nonnullable
type symbol_notfound = typeof symbol_notfound
type symbol_null = typeof symbol_null
type symbol_number = typeof symbol_number
type symbol_object = typeof symbol_object
type symbol_optional = typeof symbol_optional
type symbol_record = typeof symbol_record
type symbol_string = typeof symbol_string
type symbol_symbol = typeof symbol_symbol
type symbol_tag = typeof symbol_tag
type symbol_tuple = typeof symbol_tuple
type symbol_type = typeof symbol_type
type symbol_typeclass = typeof symbol_typeclass
type symbol_type_error = typeof symbol_type_error
type symbol_unknown = typeof symbol_unknown
type symbol_undefined = typeof symbol_undefined
type symbol_union = typeof symbol_union
type symbol_void = typeof symbol_void

declare namespace symbol {
  export {
    symbol_any as any,
    symbol_array as array,
    symbol_bigint as bigint,
    symbol_boolean as boolean,
    symbol_const as const,
    symbol_def as def,
    symbol_eq as eq,
    symbol_function as function,
    symbol_inline as inline,
    symbol_integer as integer,
    symbol_intersect as intersect,
    symbol_key as key,
    symbol_never as never,
    symbol_nonnullable as nonnullable,
    symbol_notfound as notfound,
    symbol_null as null,
    symbol_number as number,
    symbol_object as object,
    symbol_optional as optional,
    symbol_record as record,
    symbol_string as string,
    symbol_tag as tag,
    symbol_tuple as tuple,
    symbol_type as type,
    symbol_typeclass as typeclass,
    symbol_type_error as type_error,
    symbol_unknown as unknown,
    symbol_undefined as undefined,
    symbol_union as union,
    symbol_void as void,
    symbol_symbol as symbol_,
  }
}

function symbol() { }
namespace symbol {
  void (symbol.any = symbol_any)
  void (symbol.array = symbol_array)
  void (symbol.bigint = symbol_bigint)
  void (symbol.boolean = symbol_boolean)
  void (symbol.const = symbol_const)
  void (symbol.def = symbol_def)
  void (symbol.eq = symbol_eq)
  void (symbol.function = symbol_function)
  void (symbol.inline = symbol_inline)
  void (symbol.integer = symbol_integer)
  void (symbol.intersect = symbol_intersect)
  void (symbol.key = symbol_key)
  void (symbol.never = symbol_never)
  void (symbol.nonnullable = symbol_nonnullable)
  void (symbol.notfound = symbol_notfound)
  void (symbol.null = symbol_null)
  void (symbol.number = symbol_number)
  void (symbol.object = symbol_object)
  void (symbol.optional = symbol_optional)
  void (symbol.record = symbol_record)
  void (symbol.string = symbol_string)
  void (symbol.symbol_ = symbol_symbol)
  void (symbol.tag = symbol_tag)
  void (symbol.tuple = symbol_tuple)
  void (symbol.type = symbol_type)
  void (symbol.typeclass = symbol_typeclass)
  void (symbol.type_error = symbol_type_error)
  void (symbol.undefined = symbol_undefined)
  void (symbol.unknown = symbol_unknown)
  void (symbol.union = symbol_union)
  void (symbol.void = symbol_void)

  export const lookup = {
    any: symbol_any,
    array: symbol_array,
    bigint: symbol_bigint,
    boolean: symbol_boolean,
    const: symbol_const,
    def: symbol_def,
    eq: symbol_eq,
    function: symbol_function,
    inline: symbol_inline,
    integer: symbol_integer,
    intersect: symbol_intersect,
    key: symbol_key,
    never: symbol_never,
    nonnullable: symbol_nonnullable,
    notfound: symbol_notfound,
    null: symbol_null,
    number: symbol_number,
    object: symbol_object,
    optional: symbol_optional,
    record: symbol_record,
    string: symbol_string,
    symbol_: symbol_symbol,
    tag: symbol_tag,
    tuple: symbol_tuple,
    type: symbol_type,
    typeclass: symbol_typeclass,
    type_error: symbol_type_error,
    undefined: symbol_undefined,
    unknown: symbol_unknown,
    union: symbol_union,
    void: symbol_void,
  } as const
}
