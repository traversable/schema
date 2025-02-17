export { type }

import { symbol as Symbol, URI } from './uri.js'

declare namespace type {
  export {
    /// nullary
    any_ as any,
    unknown_ as unknown,
    void_ as void,
    never_ as never,
    //
    null_ as null,
    undefined_ as undefined,
    symbol_ as symbol,
    boolean_ as boolean,
    bigint_ as bigint,
    number_ as number,
    string_ as string,
    /// unary
    const_ as const,
    eq,
    array,
    record,
    tuple,
    object_ as object,
    optional,
    union,
    intersect,
    inline,
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
interface void_ extends tag<'void'>, type<void> { }
interface never_ extends tag<'never'>, type<never> { }
interface any_ extends tag<'any'>, type<any> { }
interface unknown_ extends tag<'unknown'>, type<unknown> { }
//
interface null_ extends tag<'null'>, type<null> { }
interface undefined_ extends tag<'undefined'>, type<undefined> { }
interface symbol_ extends tag<'symbol_'>, type<symbol> { }
interface boolean_ extends tag<'boolean'>, type<boolean> { }
interface bigint_ extends tag<'bigint'>, type<bigint> { }
interface number_ extends tag<'number'>, type<number> { }
interface string_ extends tag<'string'>, type<string> { }

// unary types
interface const_<T> extends tag<'const'>, type<T> { }
interface array<T> extends tag<'array'>, type<T> { }
interface record<T> extends tag<'record'>, type<T> { }
interface inline<T> extends tag<'inline'>, type<T> { }
interface optional<T> extends tag<'optional'>, type<T> { }
interface union<T> extends tag<'union'>, type<T> { }
interface intersect<T> extends tag<'intersect'>, type<T> { }
interface eq<T> extends tag<'eq'>, type<T> { }

// representable types
interface tuple<T> extends tag<'tuple'>, type<T> { }
interface object_<T> extends tag<'object'>, type<T> { }
