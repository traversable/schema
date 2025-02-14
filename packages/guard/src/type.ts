export { type }

import { symbol as Symbol, URI } from './uri.js'

declare namespace type {
  export {
    /// nullary
    any_type as any,
    unknown_type as unknown,
    void_type as void,
    never_type as never,
    //
    null_type as null,
    undefined_type as undefined,
    symbol_type as symbol,
    boolean_type as boolean,
    bigint_type as bigint,
    number_type as number,
    string_type as string,
    /// unary
    const_type as const,
    eq_type as eq,
    array_type as array,
    record_type as record,
    tuple_type as tuple,
    object_type as object,
    optional_type as optional,
    union_type as union,
    intersect_type as intersect,
    /// other
    inline_type as inline,
    /// utils
    type_of as of,
  }
}

type Key = keyof (typeof Symbol | typeof URI)

type TypeMap<T = unknown> = never | {
  [URI.never]: never
  [URI.any]: any
  [URI.unknown]: unknown
  [URI.void]: void
  [URI.null]: null
  [URI.undefined]: undefined
  [URI.boolean]: boolean
  [URI.symbol_]: symbol
  [URI.number]: number
  [URI.string]: string
}

function type<Tag extends Key, Type extends readonly never[]>(tag: Tag, type: Type): t<Tag, []>
function type<Tag extends Key, Type extends TypeMap[typeof URI[Tag] & keyof TypeMap]>(tag: Tag): t<Tag, Type>
function type<Tag extends Key, Type>(tag: Tag, type: Type): t<Tag, Type>
function type(tag: Key, type: unknown = URI[tag]): unknown {
  return { [Symbol.tag]: Symbol[tag], [Symbol.type]: type, }
}

interface t<Tag extends Key, Type> extends tag<Tag>, type<Type> { }
interface type<T> { [Symbol.type]: T }

interface tag<K extends keyof typeof URI> { [Symbol.tag]: typeof URI[K] }
type type_of<S> = S extends type<infer T> ? T : S

// nullary types
interface void_type extends tag<'void'>, type<void> { }
interface never_type extends tag<'never'>, type<never> { }
interface any_type extends tag<'any'>, type<any> { }
interface unknown_type extends tag<'unknown'>, type<unknown> { }
//
interface null_type extends tag<'null'>, type<null> { }
interface undefined_type extends tag<'undefined'>, type<undefined> { }
interface symbol_type extends tag<'symbol_'>, type<symbol> { }
interface boolean_type extends tag<'boolean'>, type<boolean> { }
interface bigint_type extends tag<'bigint'>, type<bigint> { }
interface number_type extends tag<'number'>, type<number> { }
interface string_type extends tag<'string'>, type<string> { }

// unary types
interface const_type<T> extends tag<'const'>, type<T> { }
interface array_type<T> extends tag<'array'>, type<T> { }
interface record_type<T> extends tag<'record'>, type<T> { }
interface inline_type<T> extends tag<'inline'>, type<T> { }
interface optional_type<T> extends tag<'optional'>, type<T> { }
interface union_type<T> extends tag<'union'>, type<T> { }
interface intersect_type<T> extends tag<'intersect'>, type<T> { }
interface eq_type<T> extends tag<'eq'>, type<T> { }

// representable types
interface tuple_type<T> extends tag<'tuple'>, type<T> { }
interface object_type<T> extends tag<'object'>, type<T> { }

type _3 = never[] extends [] ? true : false
type _4 = [] extends never[] ? true : false
